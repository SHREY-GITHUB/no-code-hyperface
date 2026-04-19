// ─────────────────────────────────────────────────────────────────────────────
// Programs Router — CRUD for journey configuration
// Mounted at: /api/programs
// ─────────────────────────────────────────────────────────────────────────────

const { Router } = require('express')
const { prisma }  = require('../db')
const { trackPublish } = require('../lib/mixpanel')

const router = Router()

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build the full config object used for a JourneyVersion snapshot. */
async function buildSnapshot(programId) {
  const [stages, fields, kycMethods, bureauConfig, validationRules] = await Promise.all([
    prisma.journeyStage.findMany({ where: { programId }, orderBy: { sortOrder: 'asc' } }),
    prisma.formField.findMany({ where: { programId }, orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.kycMethodConfig.findMany({ where: { programId }, orderBy: { sortOrder: 'asc' } }),
    prisma.bureauConfig.findFirst({ where: { programId }, include: { creditLimitConfig: true } }),
    prisma.validationRule.findMany({ where: { programId } }),
  ])
  return { stages, fields, kycMethods, bureauConfig, validationRules }
}

// ─── GET /api/programs ────────────────────────────────────────────────────────
// List all programs (summary — no nested config detail).

router.get('/', async (req, res, next) => {
  try {
    const programs = await prisma.program.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { applications: true } },
        versions: { where: { isActive: true }, take: 1 },
      },
    })
    res.json({ programs })
  } catch (err) { next(err) }
})

// ─── GET /api/programs/:id ────────────────────────────────────────────────────
// Full program detail including all config tables.

router.get('/:id', async (req, res, next) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: {
        stages:            { orderBy: { sortOrder: 'asc' } },
        fields:            { orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }] },
        kycMethods:        { orderBy: { sortOrder: 'asc' } },
        bureauConfig:      { include: { creditLimitConfig: true } },
        validationRules:   true,
        versions:          { where: { isActive: true }, take: 1 },
      },
    })
    if (!program || program.deletedAt) return res.status(404).json({ error: 'Program not found.' })
    res.json({ program })
  } catch (err) { next(err) }
})

// ─── POST /api/programs ───────────────────────────────────────────────────────
// Create a new program with default stages and a v1 draft version.

router.post('/', async (req, res, next) => {
  try {
    const { slug, name, bankName, colorHex, bgHex, logoInitial, webhookUrl } = req.body
    if (!slug || !name || !bankName) {
      return res.status(400).json({ error: 'slug, name, and bankName are required.' })
    }

    const program = await prisma.$transaction(async (tx) => {
      const p = await tx.program.create({
        data: { slug, name, bankName, colorHex, bgHex, logoInitial, webhookUrl },
      })

      // Create 4 default stages
      const defaultStages = [
        { name: 'Application Form',     sortOrder: 1 },
        { name: 'Bureau & Decisioning', sortOrder: 2 },
        { name: 'KYC Verification',     sortOrder: 3 },
        { name: 'Agreement & Consent',  sortOrder: 4 },
      ]
      await tx.journeyStage.createMany({
        data: defaultStages.map(s => ({ ...s, programId: p.id })),
      })

      // Initial draft version (no snapshot yet)
      await tx.journeyVersion.create({
        data: {
          programId: p.id,
          versionNumber: 1,
          isActive: true,
          snapshot: {},
          publishedBy: req.headers['x-user-id'] ?? 'system',
        },
      })
      return p
    })

    res.status(201).json({ program })
  } catch (err) { next(err) }
})

// ─── PATCH /api/programs/:id ──────────────────────────────────────────────────
// Update program metadata only (name, status, webhook, colours).

router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['name', 'bankName', 'colorHex', 'bgHex', 'logoInitial', 'webhookUrl', 'status']
    const data = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    )
    const program = await prisma.program.update({ where: { id: req.params.id }, data })
    res.json({ program })
  } catch (err) { next(err) }
})

// ─── DELETE /api/programs/:id ─────────────────────────────────────────────────
// Soft-delete (sets deletedAt). Never hard-deletes.

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.program.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ─── PUT /api/programs/:id/stages ─────────────────────────────────────────────
// Replace the full ordered list of stages.

router.put('/:id/stages', async (req, res, next) => {
  try {
    const { stages } = req.body
    if (!Array.isArray(stages)) return res.status(400).json({ error: 'stages must be an array.' })

    await prisma.$transaction([
      prisma.journeyStage.deleteMany({ where: { programId: req.params.id } }),
      prisma.journeyStage.createMany({
        data: stages.map((s, i) => ({
          programId: req.params.id,
          name: s.name,
          sortOrder: i + 1,
          enabled: s.enabled ?? true,
        })),
      }),
    ])
    const updated = await prisma.journeyStage.findMany({
      where: { programId: req.params.id }, orderBy: { sortOrder: 'asc' },
    })
    res.json({ stages: updated })
  } catch (err) { next(err) }
})

// ─── PUT /api/programs/:id/fields ─────────────────────────────────────────────
// Replace all form fields for the program.

router.put('/:id/fields', async (req, res, next) => {
  try {
    const { fields } = req.body
    if (!Array.isArray(fields)) return res.status(400).json({ error: 'fields must be an array.' })

    await prisma.$transaction([
      prisma.formField.deleteMany({ where: { programId: req.params.id } }),
      prisma.formField.createMany({
        data: fields.map((f, i) => ({
          programId: req.params.id,
          name: f.name,
          fieldType: f.type?.toUpperCase() ?? 'TEXT',
          show: f.show ?? true,
          required: f.required ?? true,
          hint: f.hint ?? null,
          page: f.page ?? 1,
          sortOrder: f.sortOrder ?? i + 1,
          options: f.options ?? null,
        })),
      }),
    ])
    const updated = await prisma.formField.findMany({
      where: { programId: req.params.id },
      orderBy: [{ page: 'asc' }, { sortOrder: 'asc' }],
    })
    res.json({ fields: updated })
  } catch (err) { next(err) }
})

// ─── PUT /api/programs/:id/kyc-methods ────────────────────────────────────────
// Replace KYC method configs.

const KYC_METHOD_MAP = {
  'Aadhaar OTP':   'AADHAAR_OTP',
  'Video KYC':     'VIDEO_KYC',
  'DigiLocker':    'DIGI_LOCKER',
  'Manual Upload': 'MANUAL_UPLOAD',
}

router.put('/:id/kyc-methods', async (req, res, next) => {
  try {
    const { kycMethods } = req.body
    if (!Array.isArray(kycMethods)) return res.status(400).json({ error: 'kycMethods must be an array.' })

    await prisma.$transaction([
      prisma.kycMethodConfig.deleteMany({ where: { programId: req.params.id } }),
      prisma.kycMethodConfig.createMany({
        data: kycMethods.map((m, i) => ({
          programId: req.params.id,
          methodName: KYC_METHOD_MAP[m.name] ?? m.name,
          enabled: m.enabled ?? false,
          description: m.desc ?? null,
          sortOrder: i + 1,
        })),
      }),
    ])
    const updated = await prisma.kycMethodConfig.findMany({
      where: { programId: req.params.id }, orderBy: { sortOrder: 'asc' },
    })
    res.json({ kycMethods: updated })
  } catch (err) { next(err) }
})

// ─── PUT /api/programs/:id/bureau-config ──────────────────────────────────────
// Upsert BureauConfig (and nested CreditLimitConfig).

router.put('/:id/bureau-config', async (req, res, next) => {
  try {
    const { bureauConfig: b, creditLimitConfig: c } = req.body

    const existing = await prisma.bureauConfig.findUnique({ where: { programId: req.params.id } })

    let bureauConfig
    if (existing) {
      bureauConfig = await prisma.bureauConfig.update({
        where: { programId: req.params.id },
        data: {
          primaryBureau:   b.primaryBureau   ?? undefined,
          fallbackBureau:  b.fallbackBureau  ?? null,
          pullType:        b.pullType        ?? undefined,
          ntcPolicy:       b.ntcPolicy       ?? undefined,
          thresholdApprove: b.thresholdApprove ?? undefined,
          thresholdReview:  b.thresholdReview  ?? undefined,
          incomeMinimum:    b.incomeMinimum    ?? undefined,
          reviewSlaHours:   b.reviewSlaHours   ?? undefined,
          escalateOnBreach: b.escalateOnBreach ?? undefined,
        },
      })
    } else {
      bureauConfig = await prisma.bureauConfig.create({
        data: { programId: req.params.id, ...b },
      })
    }

    if (c) {
      await prisma.creditLimitConfig.upsert({
        where:  { bureauConfigId: bureauConfig.id },
        create: { bureauConfigId: bureauConfig.id, ...c },
        update: c,
      })
    }

    const updated = await prisma.bureauConfig.findUnique({
      where: { programId: req.params.id }, include: { creditLimitConfig: true },
    })
    res.json({ bureauConfig: updated })
  } catch (err) { next(err) }
})

// ─── PUT /api/programs/:id/validation-rules ────────────────────────────────────
// Replace all validation rules.

router.put('/:id/validation-rules', async (req, res, next) => {
  try {
    const { rules } = req.body
    if (!Array.isArray(rules)) return res.status(400).json({ error: 'rules must be an array.' })

    await prisma.$transaction([
      prisma.validationRule.deleteMany({ where: { programId: req.params.id } }),
      prisma.validationRule.createMany({
        data: rules.map(r => ({
          programId: req.params.id,
          label: r.label,
          description: r.description ?? null,
          ruleType: r.type?.toUpperCase() ?? 'PATTERN',
          enabled: r.enabled ?? true,
          minValue: r.min ?? null,
          maxValue: r.max ?? null,
          unit: r.unit ?? null,
          pattern: r.pattern ?? null,
          displayText: r.display ?? null,
        })),
      }),
    ])
    const updated = await prisma.validationRule.findMany({ where: { programId: req.params.id } })
    res.json({ rules: updated })
  } catch (err) { next(err) }
})

// ─── POST /api/programs/:id/publish ───────────────────────────────────────────
// Create a new JourneyVersion snapshot, mark previous inactive, set status → LIVE.

router.post('/:id/publish', async (req, res, next) => {
  try {
    const programId = req.params.id
    const publishedBy = req.headers['x-user-id'] ?? 'anonymous'

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: { versions: { where: { isActive: true } } },
    })
    if (!program) return res.status(404).json({ error: 'Program not found.' })

    const snapshot = await buildSnapshot(programId)
    const enabledStageCount = snapshot.stages.filter(s => s.enabled).length
    const visibleFieldCount = snapshot.fields.filter(f => f.show).length
    const enabledKycCount   = snapshot.kycMethods.filter(m => m.enabled).length

    // Increment version number
    const latestVersion = await prisma.journeyVersion.findFirst({
      where: { programId }, orderBy: { versionNumber: 'desc' },
    })
    const nextVersion = (latestVersion?.versionNumber ?? 0) + 1

    const journeyVersion = await prisma.$transaction(async (tx) => {
      // Deactivate all previous active versions
      await tx.journeyVersion.updateMany({
        where: { programId, isActive: true },
        data:  { isActive: false },
      })
      // Create the new active version
      const v = await tx.journeyVersion.create({
        data: {
          programId,
          versionNumber: nextVersion,
          isActive:    true,
          publishedBy,
          webhookUrl:  program.webhookUrl ?? req.body.webhookUrl ?? null,
          snapshot,
        },
      })
      // Update program status and publishedAt
      await tx.program.update({
        where: { id: programId },
        data:  { status: 'LIVE', publishedAt: new Date() },
      })
      return v
    })

    // Fire Mixpanel event (non-blocking)
    trackPublish({
      programId,
      programSlug: program.slug,
      versionNumber: nextVersion,
      enabledStageCount,
      visibleFieldCount,
      enabledKycCount,
      hadWebhook: !!program.webhookUrl,
    })

    res.json({
      ok: true,
      version: nextVersion,
      journeyVersionId: journeyVersion.id,
      enabledStageCount,
      visibleFieldCount,
      enabledKycCount,
      liveUrl: `https://apply.hyperface.co/${program.slug}`,
    })
  } catch (err) { next(err) }
})

module.exports = router
