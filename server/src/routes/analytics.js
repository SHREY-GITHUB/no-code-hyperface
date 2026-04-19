// ─────────────────────────────────────────────────────────────────────────────
// Analytics Router — aggregation queries that back the JourneyAnalytics component
// Mounted at: /api/analytics
// All routes accept ?range=7d|30d|90d (default: 7d)
// ─────────────────────────────────────────────────────────────────────────────

const { Router } = require('express')
const { prisma }  = require('../db')

const router = Router()

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rangeStart(range) {
  const days = { '7d': 7, '30d': 30, '90d': 90 }[range] ?? 7
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d
}

function pct(num, den) {
  if (!den) return 0
  return Math.round((num / den) * 1000) / 10  // one decimal place
}

function avgMs(events) {
  const valid = events.filter(e => e.timeSpentMs)
  if (!valid.length) return null
  return Math.round(valid.reduce((s, e) => s + e.timeSpentMs, 0) / valid.length)
}

function formatDuration(ms) {
  if (!ms) return '—'
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

// ─── GET /api/analytics/:programId/summary ────────────────────────────────────

router.get('/:programId/summary', async (req, res, next) => {
  try {
    const { programId } = req.params
    const since = rangeStart(req.query.range)

    const [totalStarted, submitted, events] = await Promise.all([
      prisma.application.count({ where: { programId, startedAt: { gte: since } } }),
      prisma.application.count({ where: { programId, startedAt: { gte: since }, status: 'SUBMITTED' } }),
      prisma.applicationEvent.findMany({
        where: {
          application: { programId },
          eventType: 'journey_completed',
          occurredAt: { gte: since },
        },
        select: { timeSpentMs: true },
      }),
    ])

    const conversionRate = pct(submitted, totalStarted)
    const avgCompletionMs = avgMs(events)

    res.json({
      totalStarted,
      submitted,
      conversionRate,
      avgCompletionMs,
      avgCompletionFormatted: formatDuration(avgCompletionMs),
    })
  } catch (err) { next(err) }
})

// ─── GET /api/analytics/:programId/funnel ─────────────────────────────────────
// Returns per-stage counts and drop-off for the conversion funnel.

router.get('/:programId/funnel', async (req, res, next) => {
  try {
    const { programId } = req.params
    const since = rangeStart(req.query.range)

    const STAGES = [
      'Application Form',
      'Bureau & Decisioning',
      'KYC Verification',
      'Agreement & Consent',
      'Submitted',
    ]

    // Count distinct applications that reached (completed) each stage
    const stageCounts = await Promise.all(
      STAGES.slice(0, -1).map(stageName =>
        prisma.applicationEvent.groupBy({
          by: ['applicationId'],
          where: {
            application: { programId },
            eventType: 'stage_completed',
            stageName,
            occurredAt: { gte: since },
          },
          _count: true,
        }).then(rows => rows.length)
      )
    )

    // "Submitted" = applications with status SUBMITTED
    const submittedCount = await prisma.application.count({
      where: { programId, startedAt: { gte: since }, status: 'SUBMITTED' },
    })

    const counts = [...stageCounts, submittedCount]
    const top = counts[0] || 1

    const funnel = STAGES.map((stage, i) => {
      const count = counts[i] ?? 0
      const prev  = i > 0 ? (counts[i - 1] ?? 0) : null
      const drop  = prev !== null ? pct(count - prev, prev) : null
      return {
        stage,
        count,
        pct: pct(count, top),
        drop,
      }
    })

    res.json({ funnel })
  } catch (err) { next(err) }
})

// ─── GET /api/analytics/:programId/daily ──────────────────────────────────────
// Daily (7d), weekly (30d), or monthly (90d) application counts.

router.get('/:programId/daily', async (req, res, next) => {
  try {
    const { programId } = req.params
    const range = req.query.range ?? '7d'
    const since = rangeStart(range)

    // Use raw SQL for date_trunc — Prisma's groupBy doesn't support it
    const bucketUnit = range === '7d' ? 'day' : range === '30d' ? 'week' : 'month'

    const rows = await prisma.$queryRaw`
      SELECT
        date_trunc(${bucketUnit}, "started_at") AS bucket,
        COUNT(*)::int AS count
      FROM applications
      WHERE program_id = ${programId}
        AND started_at >= ${since}
        AND deleted_at IS NULL
      GROUP BY bucket
      ORDER BY bucket ASC
    `

    const daily = rows.map(r => ({
      day: r.bucket instanceof Date
        ? r.bucket.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : String(r.bucket),
      count: r.count,
    }))

    res.json({ daily })
  } catch (err) { next(err) }
})

// ─── GET /api/analytics/:programId/outcomes ────────────────────────────────────
// Count applications by final status (Approved / Pending Review / Declined / Incomplete).

router.get('/:programId/outcomes', async (req, res, next) => {
  try {
    const { programId } = req.params
    const since = rangeStart(req.query.range)

    const groups = await prisma.application.groupBy({
      by: ['status'],
      where: { programId, startedAt: { gte: since } },
      _count: { status: true },
    })

    const total = groups.reduce((s, g) => s + g._count.status, 0) || 1

    const OUTCOME_MAP = {
      APPROVED:      { label: 'Approved',       color: '#22C55E', bg: '#DCFCE7', textColor: '#15803D' },
      MANUAL_REVIEW: { label: 'Pending Review', color: '#F59E0B', bg: '#FEF3C7', textColor: '#B45309' },
      DECLINED:      { label: 'Declined',       color: '#EF4444', bg: '#FEE2E2', textColor: '#B91C1C' },
    }

    const defined = Object.entries(OUTCOME_MAP).map(([status, meta]) => {
      const g = groups.find(x => x.status === status)
      const count = g?._count?.status ?? 0
      return { ...meta, count, pct: pct(count, total) }
    })

    // Everything else = Incomplete
    const otherCount = groups
      .filter(g => !Object.keys(OUTCOME_MAP).includes(g.status))
      .reduce((s, g) => s + g._count.status, 0)

    const outcomes = [
      ...defined,
      {
        label: 'Incomplete', color: '#94A3B8', bg: '#F1F5F9', textColor: '#475569',
        count: otherCount, pct: pct(otherCount, total),
      },
    ]

    res.json({ outcomes })
  } catch (err) { next(err) }
})

// ─── GET /api/analytics/:programId/stage-performance ─────────────────────────
// Average time on stage and drop-off rate per stage.

router.get('/:programId/stage-performance', async (req, res, next) => {
  try {
    const { programId } = req.params
    const since = rangeStart(req.query.range)

    const STAGES = [
      'Application Form',
      'Bureau & Decisioning',
      'KYC Verification',
      'Agreement & Consent',
    ]

    const stagePerf = await Promise.all(
      STAGES.map(async (stageName) => {
        const [entered, completed, timeEvents] = await Promise.all([
          prisma.applicationEvent.count({
            where: {
              application: { programId },
              eventType: { in: ['stage_completed', 'journey_abandoned'] },
              stageName,
              occurredAt: { gte: since },
            },
          }),
          prisma.applicationEvent.count({
            where: {
              application: { programId },
              eventType: 'stage_completed',
              stageName,
              occurredAt: { gte: since },
            },
          }),
          prisma.applicationEvent.findMany({
            where: {
              application: { programId },
              eventType: 'stage_completed',
              stageName,
              occurredAt: { gte: since },
              timeSpentMs: { not: null },
            },
            select: { timeSpentMs: true },
          }),
        ])

        const dropPct = entered > 0 ? pct(entered - completed, entered) : 0
        const avgTimeMs = avgMs(timeEvents)

        const severity =
          dropPct >= 20 ? 'high' :
          dropPct >= 12 ? 'medium' : 'low'

        return {
          stage: stageName,
          avgTime: formatDuration(avgTimeMs),
          avgTimeMs,
          dropPct,
          severity,
        }
      })
    )

    res.json({ stagePerf })
  } catch (err) { next(err) }
})

module.exports = router
