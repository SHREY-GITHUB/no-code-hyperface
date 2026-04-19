// ─────────────────────────────────────────────────────────────────────────────
// Applications Router — runtime applicant journey endpoints
// Mounted at: /api/applications
// ─────────────────────────────────────────────────────────────────────────────

const { Router } = require('express')
const { prisma }  = require('../db')
const { trackJourneyEvent } = require('../lib/mixpanel')

const router = Router()

// ─── POST /api/applications ───────────────────────────────────────────────────
// Start a new application session for a program.

router.post('/', async (req, res, next) => {
  try {
    const { programSlug, sessionId, utmSource, utmMedium, utmCampaign, isPreview } = req.body
    if (!programSlug) return res.status(400).json({ error: 'programSlug is required.' })

    const program = await prisma.program.findUnique({ where: { slug: programSlug } })
    if (!program) return res.status(404).json({ error: 'Program not found.' })

    // Find the active journey version
    const journeyVersion = await prisma.journeyVersion.findFirst({
      where: { programId: program.id, isActive: true },
    })

    const application = await prisma.application.create({
      data: {
        programId:       program.id,
        journeyVersionId: journeyVersion?.id ?? null,
        sessionId:       sessionId ?? null,
        status:          'STARTED',
        utmSource:       utmSource  ?? null,
        utmMedium:       utmMedium  ?? null,
        utmCampaign:     utmCampaign ?? null,
        ipAddress:       req.ip ?? null,
        userAgent:       req.headers['user-agent'] ?? null,
      },
    })

    // Record event
    await prisma.applicationEvent.create({
      data: {
        applicationId: application.id,
        eventType: 'journey_started',
        metadata: { programSlug, isPreview: !!isPreview, utmSource, utmMedium },
      },
    })

    trackJourneyEvent('journey_started', application.id, {
      programId: program.id, programSlug, isPreview: !!isPreview, utmSource,
    })

    res.status(201).json({ application })
  } catch (err) { next(err) }
})

// ─── GET /api/applications/:id ────────────────────────────────────────────────
// Get application status + event history.

router.get('/:id', async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        events:          { orderBy: { occurredAt: 'asc' } },
        bureauChecks:    true,
        kycVerifications: true,
      },
    })
    if (!application) return res.status(404).json({ error: 'Application not found.' })
    res.json({ application })
  } catch (err) { next(err) }
})

// ─── PATCH /api/applications/:id/stage ────────────────────────────────────────
// Advance the applicant to a stage and record the event.

router.patch('/:id/stage', async (req, res, next) => {
  try {
    const { stageName, status, formData, currentFormPage, timeSpentMs, isPreview } = req.body

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data:  {
        currentStage:    stageName ?? undefined,
        status:          status    ?? undefined,
        currentFormPage: currentFormPage ?? undefined,
        // ⚠️  Encrypt formData before storing in production
        formData:        formData  ?? undefined,
        updatedAt:       new Date(),
      },
    })

    await prisma.applicationEvent.create({
      data: {
        applicationId: application.id,
        eventType: 'stage_completed',
        stageName,
        timeSpentMs: timeSpentMs ?? null,
        metadata: { isPreview: !!isPreview },
      },
    })

    trackJourneyEvent('stage_completed', application.id, {
      programId: application.programId, stageName, isPreview: !!isPreview,
    })

    res.json({ application })
  } catch (err) { next(err) }
})

// ─── POST /api/applications/:id/form-page ─────────────────────────────────────
// Record a form page viewed or completed event.

router.post('/:id/form-page', async (req, res, next) => {
  try {
    const { pageNumber, eventType, timeSpentMs, isPreview } = req.body
    // eventType: 'form_page_viewed' | 'form_page_completed'

    await prisma.applicationEvent.create({
      data: {
        applicationId: req.params.id,
        eventType: eventType ?? 'form_page_viewed',
        stageName: 'Application Form',
        pageNumber: pageNumber ?? 1,
        timeSpentMs: timeSpentMs ?? null,
        metadata: { isPreview: !!isPreview },
      },
    })

    trackJourneyEvent(eventType ?? 'form_page_viewed', req.params.id, {
      pageNumber, isPreview: !!isPreview,
    })

    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ─── POST /api/applications/:id/bureau-check ──────────────────────────────────
// Record a bureau check result and auto-update application status.

router.post('/:id/bureau-check', async (req, res, next) => {
  try {
    const {
      bureauName = 'CIBIL',
      pullType   = 'SOFT',
      score,
      decision,   // APPROVED | MANUAL_REVIEW | DECLINED | ERROR
      reportReference,
      errorMessage,
      isFallback = false,
      isPreview  = false,
    } = req.body

    if (!decision) return res.status(400).json({ error: 'decision is required.' })

    const bureauCheck = await prisma.bureauCheck.create({
      data: {
        applicationId:   req.params.id,
        bureauName:      bureauName.toUpperCase(),
        pullType:        pullType.toUpperCase(),
        score:           score ?? null,
        decision:        decision.toUpperCase(),
        isFallback,
        reportReference: reportReference ?? null,
        errorMessage:    errorMessage ?? null,
        respondedAt:     new Date(),
      },
    })

    // Auto-transition application status based on decision
    const statusMap = {
      APPROVED:      'APPROVED',
      MANUAL_REVIEW: 'MANUAL_REVIEW',
      DECLINED:      'DECLINED',
      ERROR:         'IN_PROGRESS', // stay on bureau step to retry
    }
    const newStatus = statusMap[decision.toUpperCase()] ?? 'IN_PROGRESS'

    await prisma.application.update({
      where: { id: req.params.id },
      data:  { status: newStatus, bureauChecks: undefined },
    })

    await prisma.applicationEvent.create({
      data: {
        applicationId: req.params.id,
        eventType: 'bureau_completed',
        stageName: 'Bureau & Decisioning',
        metadata: { bureauName, score, decision, isFallback, isPreview },
      },
    })

    trackJourneyEvent('bureau_check_completed', req.params.id, {
      bureauName, decision, score, isFallback, isPreview,
    })

    res.json({ bureauCheck, newStatus })
  } catch (err) { next(err) }
})

// ─── POST /api/applications/:id/kyc ───────────────────────────────────────────
// Record a KYC verification attempt.

router.post('/:id/kyc', async (req, res, next) => {
  try {
    const { methodName, status, verificationId, errorMessage, isPreview } = req.body
    if (!methodName) return res.status(400).json({ error: 'methodName is required.' })

    const METHOD_MAP = {
      'Aadhaar OTP':   'AADHAAR_OTP',
      'Video KYC':     'VIDEO_KYC',
      'DigiLocker':    'DIGI_LOCKER',
      'Manual Upload': 'MANUAL_UPLOAD',
    }
    const normalised = METHOD_MAP[methodName] ?? methodName.toUpperCase().replace(/ /g, '_')

    const kycVerification = await prisma.kycVerification.create({
      data: {
        applicationId:  req.params.id,
        methodName:     normalised,
        status:         (status ?? 'COMPLETED').toUpperCase(),
        verificationId: verificationId ?? null,
        errorMessage:   errorMessage ?? null,
        completedAt:    new Date(),
      },
    })

    await prisma.applicationEvent.create({
      data: {
        applicationId: req.params.id,
        eventType: status === 'FAILED' ? 'kyc_failed' : 'kyc_completed',
        stageName: 'KYC Verification',
        metadata: { methodName: normalised, verificationId, isPreview },
      },
    })

    trackJourneyEvent(
      status === 'FAILED' ? 'kyc_failed' : 'kyc_completed',
      req.params.id,
      { methodName: normalised, isPreview }
    )

    res.json({ kycVerification })
  } catch (err) { next(err) }
})

// ─── POST /api/applications/:id/submit ────────────────────────────────────────
// Final submission — mark application as SUBMITTED.

router.post('/:id/submit', async (req, res, next) => {
  try {
    const { totalTimeMs, stagesCompleted, isPreview } = req.body

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data:  { status: 'SUBMITTED', submittedAt: new Date() },
    })

    await prisma.applicationEvent.create({
      data: {
        applicationId: req.params.id,
        eventType: 'journey_completed',
        timeSpentMs: totalTimeMs ?? null,
        metadata: { stagesCompleted, isPreview },
      },
    })

    trackJourneyEvent('journey_completed', req.params.id, {
      programId: application.programId, totalTimeMs, stagesCompleted, isPreview,
    })

    res.json({ ok: true, application })
  } catch (err) { next(err) }
})

// ─── POST /api/applications/:id/abandon ───────────────────────────────────────
// Mark the application as abandoned and record which stage they dropped off at.

router.post('/:id/abandon', async (req, res, next) => {
  try {
    const { stageName, pageNumber, timeSpentMs, reason, isPreview } = req.body

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data:  { status: 'ABANDONED', abandonedAt: new Date() },
    })

    await prisma.applicationEvent.create({
      data: {
        applicationId: req.params.id,
        eventType: 'journey_abandoned',
        stageName: stageName ?? null,
        pageNumber: pageNumber ?? null,
        timeSpentMs: timeSpentMs ?? null,
        metadata: { reason, isPreview },
      },
    })

    trackJourneyEvent('journey_abandoned', req.params.id, {
      programId: application.programId, stageName, pageNumber, reason, isPreview,
    })

    res.json({ ok: true })
  } catch (err) { next(err) }
})

module.exports = router
