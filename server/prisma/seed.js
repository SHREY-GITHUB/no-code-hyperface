// ─────────────────────────────────────────────────────────────────────────────
// Hyperface Studio — Database Seed
// Idempotent: safe to run multiple times (uses upsert on slug / unique keys).
// Run: cd server && npm run db:seed
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ─── Program definitions ─────────────────────────────────────────────────────

const PROGRAMS = [
  {
    slug:        'hdfc-millenia',
    name:        'HDFC Millenia Card Program',
    bankName:    'HDFC Bank',
    productType: 'Credit Card',
    colorHex:    '#1D4ED8',
    bgHex:       '#EFF6FF',
    logoInitial: 'H',
    status:      'DRAFT',
    creditLimitMin: 10000,
    creditLimitMax: 300000,
    creditLimitDefault: 225000,
  },
  {
    slug:        'slice-student',
    name:        'Slice Student Credit Card',
    bankName:    'Slice Fintech',
    productType: 'Credit Card',
    colorHex:    '#7C3AED',
    bgHex:       '#F5F3FF',
    logoInitial: 'S',
    status:      'LIVE',
    creditLimitMin: 5000,
    creditLimitMax: 50000,
    creditLimitDefault: 25000,
  },
  {
    slug:        'jupiter-edge',
    name:        'Jupiter Edge Card',
    bankName:    'Jupiter / Federal Bank',
    productType: 'Credit Card',
    colorHex:    '#059669',
    bgHex:       '#ECFDF5',
    logoInitial: 'J',
    status:      'LIVE',
    creditLimitMin: 10000,
    creditLimitMax: 200000,
    creditLimitDefault: 150000,
  },
]

const DEFAULT_STAGES = [
  { name: 'Application Form',     sortOrder: 1 },
  { name: 'Bureau & Decisioning', sortOrder: 2 },
  { name: 'KYC Verification',     sortOrder: 3 },
  { name: 'Agreement & Consent',  sortOrder: 4 },
]

const DEFAULT_FIELDS = [
  { name: 'Full Name',       fieldType: 'TEXT',     show: true, required: true,  page: 1, sortOrder: 1, hint: null },
  { name: 'Date of Birth',   fieldType: 'DATE',     show: true, required: true,  page: 1, sortOrder: 2, hint: 'Applicant must be 21 to 65 years old' },
  { name: 'Employment Type', fieldType: 'DROPDOWN', show: true, required: true,  page: 1, sortOrder: 3,
    hint: 'Options: Salaried, Self-Employed, Business Owner',
    options: ['Salaried', 'Self-Employed', 'Business Owner'] },
  { name: 'Mobile Number',   fieldType: 'TEXT',     show: true, required: true,  page: 2, sortOrder: 1, hint: 'OTP verification triggered automatically' },
  { name: 'PAN Number',      fieldType: 'TEXT',     show: true, required: true,  page: 2, sortOrder: 2, hint: 'Format: AAAAA9999A — validated automatically' },
  { name: 'Monthly Income',  fieldType: 'NUMBER',   show: true, required: true,  page: 2, sortOrder: 3, hint: 'Minimum value configurable in Validation Rules tab' },
]

const DEFAULT_KYC_METHODS = [
  { methodName: 'AADHAAR_OTP',    enabled: true,  sortOrder: 1, description: 'Instant verification via Aadhaar-linked mobile OTP. Fastest method.' },
  { methodName: 'VIDEO_KYC',      enabled: false, sortOrder: 2, description: 'Live video call with a KYC agent. Required for high credit limit cards above ₹5 lakh.' },
  { methodName: 'DIGI_LOCKER',    enabled: true,  sortOrder: 3, description: 'Fetch documents directly from government DigiLocker. No manual upload needed.' },
  { methodName: 'MANUAL_UPLOAD',  enabled: false, sortOrder: 4, description: 'Applicant uploads physical document photos. Slowest but most flexible.' },
]

const DEFAULT_VALIDATION_RULES = [
  {
    label: 'Age Range',
    description: 'Applicant must be within the specified age range',
    ruleType: 'RANGE',
    enabled: true,
    minValue: 21,
    maxValue: 65,
    unit: 'years',
    pattern: null,
    displayText: null,
  },
  {
    label: 'Minimum Monthly Income',
    description: 'Applicant must earn at least this amount per month',
    ruleType: 'MIN',
    enabled: true,
    minValue: 25000,
    maxValue: null,
    unit: '₹',
    pattern: null,
    displayText: null,
  },
  {
    label: 'Mobile Number Format',
    description: 'Must be a valid 10-digit Indian mobile number starting with 6–9',
    ruleType: 'PATTERN',
    enabled: true,
    minValue: null,
    maxValue: null,
    unit: null,
    pattern: '^[6-9]\\d{9}$',
    displayText: '10-digit Indian mobile',
  },
  {
    label: 'PAN Card Format',
    description: 'Must match the standard PAN card format',
    ruleType: 'PATTERN',
    enabled: true,
    minValue: null,
    maxValue: null,
    unit: null,
    pattern: '^[A-Z]{5}[0-9]{4}[A-Z]$',
    displayText: 'AAAAA9999A',
  },
]

// ─── Score-band credit limit adjustments ──────────────────────────────────────

const BAND_ADJUSTMENTS = [
  { scoreMin: 750, scoreMax: 900, adjustment:  0.20 },  // +20% for excellent scores
  { scoreMin: 700, scoreMax: 749, adjustment:  0.00 },  // base multiplier
  { scoreMin: 650, scoreMax: 699, adjustment: -0.10 },  // −10% for borderline scores
]

// ─── Sample applications (for analytics data) ─────────────────────────────────

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const APPLICATION_SCENARIOS = [
  // status, daysAgo, bureauScore, bureauDecision
  { status: 'APPROVED',       day: 0,  score: 782, decision: 'APPROVED' },
  { status: 'APPROVED',       day: 0,  score: 810, decision: 'APPROVED' },
  { status: 'MANUAL_REVIEW',  day: 0,  score: 720, decision: 'MANUAL_REVIEW' },
  { status: 'DECLINED',       day: 0,  score: 620, decision: 'DECLINED' },
  { status: 'ABANDONED',      day: 0,  score: null, decision: null },
  { status: 'SUBMITTED',      day: 1,  score: 755, decision: 'APPROVED' },
  { status: 'APPROVED',       day: 1,  score: 798, decision: 'APPROVED' },
  { status: 'APPROVED',       day: 2,  score: 830, decision: 'APPROVED' },
  { status: 'MANUAL_REVIEW',  day: 2,  score: 680, decision: 'MANUAL_REVIEW' },
  { status: 'DECLINED',       day: 2,  score: 600, decision: 'DECLINED' },
  { status: 'ABANDONED',      day: 3,  score: null, decision: null },
  { status: 'ABANDONED',      day: 3,  score: null, decision: null },
  { status: 'APPROVED',       day: 4,  score: 812, decision: 'APPROVED' },
  { status: 'SUBMITTED',      day: 4,  score: 760, decision: 'APPROVED' },
  { status: 'APPROVED',       day: 5,  score: 795, decision: 'APPROVED' },
  { status: 'MANUAL_REVIEW',  day: 5,  score: 700, decision: 'MANUAL_REVIEW' },
  { status: 'DECLINED',       day: 6,  score: 630, decision: 'DECLINED' },
  { status: 'APPROVED',       day: 6,  score: 775, decision: 'APPROVED' },
]

// ─── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding Hyperface Studio database...\n')

  for (const programDef of PROGRAMS) {
    const { creditLimitMin, creditLimitMax, creditLimitDefault, ...programData } = programDef

    console.log(`  → Program: ${programData.name}`)

    // Upsert program
    const program = await prisma.program.upsert({
      where:  { slug: programData.slug },
      create: programData,
      update: { name: programData.name, bankName: programData.bankName, status: programData.status },
    })

    // ── Stages ──────────────────────────────────────────────────────────────
    for (const stage of DEFAULT_STAGES) {
      await prisma.journeyStage.upsert({
        where:  { programId_name: { programId: program.id, name: stage.name } },
        create: { programId: program.id, ...stage },
        update: { sortOrder: stage.sortOrder },
      })
    }

    // ── Form fields ──────────────────────────────────────────────────────────
    for (const field of DEFAULT_FIELDS) {
      await prisma.formField.upsert({
        where:  { programId_name: { programId: program.id, name: field.name } },
        create: { programId: program.id, ...field, options: field.options ?? null },
        update: { fieldType: field.fieldType, page: field.page, sortOrder: field.sortOrder, hint: field.hint },
      })
    }

    // ── KYC methods ─────────────────────────────────────────────────────────
    for (const method of DEFAULT_KYC_METHODS) {
      await prisma.kycMethodConfig.upsert({
        where:  { programId_methodName: { programId: program.id, methodName: method.methodName } },
        create: { programId: program.id, ...method },
        update: { enabled: method.enabled, sortOrder: method.sortOrder },
      })
    }

    // ── Bureau config ────────────────────────────────────────────────────────
    const bc = await prisma.bureauConfig.upsert({
      where:  { programId: program.id },
      create: {
        programId:        program.id,
        primaryBureau:    'CIBIL',
        fallbackBureau:   'EXPERIAN',
        pullType:         'SOFT',
        ntcPolicy:        'MANUAL_REVIEW',
        thresholdApprove: 750,
        thresholdReview:  650,
        incomeMinimum:    25000,
        reviewSlaHours:   48,
        escalateOnBreach: true,
      },
      update: {},
    })

    // ── Credit limit config ──────────────────────────────────────────────────
    await prisma.creditLimitConfig.upsert({
      where:  { bureauConfigId: bc.id },
      create: {
        bureauConfigId:  bc.id,
        minLimit:        creditLimitMin,
        maxLimit:        creditLimitMax,
        incomeMultiplier: 3.0,
        roundingNearest: 1000,
        bandAdjustments: BAND_ADJUSTMENTS,
      },
      update: { minLimit: creditLimitMin, maxLimit: creditLimitMax },
    })

    // ── Validation rules ─────────────────────────────────────────────────────
    for (const rule of DEFAULT_VALIDATION_RULES) {
      await prisma.validationRule.upsert({
        where:  { programId_label: { programId: program.id, label: rule.label } },
        create: { programId: program.id, ...rule },
        update: { enabled: rule.enabled },
      })
    }

    // ── Initial journey version (draft) ─────────────────────────────────────
    const existingVersion = await prisma.journeyVersion.findFirst({
      where: { programId: program.id },
    })
    if (!existingVersion) {
      await prisma.journeyVersion.create({
        data: {
          programId:     program.id,
          versionNumber: 1,
          isActive:      true,
          publishedBy:   'seed',
          snapshot:      {},
        },
      })
    }

    // ── Sample applications (only for HDFC to keep seed fast) ───────────────
    if (programData.slug === 'hdfc-millenia') {
      console.log('     Creating sample applications for analytics...')
      for (const scenario of APPLICATION_SCENARIOS) {
        const app = await prisma.application.create({
          data: {
            programId:    program.id,
            sessionId:    `seed-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            status:       scenario.status,
            currentStage: scenario.status === 'ABANDONED' ? 'Application Form' : 'Agreement & Consent',
            startedAt:    daysAgo(scenario.day),
            submittedAt:  ['SUBMITTED', 'APPROVED', 'DECLINED', 'MANUAL_REVIEW'].includes(scenario.status)
              ? daysAgo(scenario.day) : null,
          },
        })

        // Create journey_started event
        await prisma.applicationEvent.create({
          data: {
            applicationId: app.id,
            eventType: 'journey_started',
            stageName: 'Application Form',
            occurredAt: daysAgo(scenario.day),
          },
        })

        // Create stage_completed events for non-abandoned apps
        if (scenario.status !== 'ABANDONED') {
          const stagesCompleted = ['Application Form', 'Bureau & Decisioning', 'KYC Verification', 'Agreement & Consent']
          for (const [i, stageName] of stagesCompleted.entries()) {
            await prisma.applicationEvent.create({
              data: {
                applicationId: app.id,
                eventType: 'stage_completed',
                stageName,
                timeSpentMs: Math.round((60 + Math.random() * 240) * 1000), // 1–5 min
                occurredAt: new Date(daysAgo(scenario.day).getTime() + i * 3 * 60 * 1000),
              },
            })
          }

          // Bureau check record
          if (scenario.score && scenario.decision) {
            await prisma.bureauCheck.create({
              data: {
                applicationId:   app.id,
                bureauName:      'CIBIL',
                pullType:        'SOFT',
                score:           scenario.score,
                decision:        scenario.decision,
                reportReference: `CIBIL-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
                requestedAt:     new Date(daysAgo(scenario.day).getTime() + 3 * 60 * 1000),
                respondedAt:     new Date(daysAgo(scenario.day).getTime() + 4 * 60 * 1000),
              },
            })
          }
        }
      }
    }

    console.log(`     ✓ Done\n`)
  }

  console.log('✅ Seed complete!\n')
  console.log('Quick start:')
  console.log('  cd server && npm run db:studio   (browse data)')
  console.log('  cd server && npm run dev         (start API)\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
