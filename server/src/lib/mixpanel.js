// ─────────────────────────────────────────────────────────────────────────────
// Server-side Mixpanel wrapper (Node.js SDK)
// Fires-and-forgets — analytics must never block or crash the main request path.
// ─────────────────────────────────────────────────────────────────────────────

const Mixpanel = require('mixpanel')

let mp = null

function getClient() {
  if (!mp && process.env.MIXPANEL_TOKEN) {
    mp = Mixpanel.init(process.env.MIXPANEL_TOKEN, {
      protocol: 'https',
      // Flush every 10 s — reduce latency vs. default 60 s
      flush_interval: 10000,
    })
  }
  return mp
}

/**
 * Track a server-side event.
 * @param {string} eventName
 * @param {Record<string,unknown>} properties
 * @param {string} [distinctId]  - application ID, session ID, or 'server'
 */
function track(eventName, properties = {}, distinctId = 'server') {
  try {
    const client = getClient()
    if (!client) return          // MIXPANEL_TOKEN not set — skip silently

    client.track(eventName, {
      distinct_id: distinctId,
      ...properties,
      source: 'server',
      environment: process.env.NODE_ENV ?? 'development',
      appVersion: '2.4.0',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    // Never let analytics crash the main path
    console.warn('[Mixpanel] track error:', err?.message)
  }
}

/**
 * Convenience: track a journey_published event (called from programs router).
 */
function trackPublish({ programId, programSlug, versionNumber, enabledStageCount,
  visibleFieldCount, enabledKycCount, hadWebhook }) {
  track('journey_published', {
    programId, programSlug, versionNumber,
    enabledStageCount, visibleFieldCount, enabledKycCount, hadWebhook,
  }, programId)
}

/**
 * Convenience: track an applicant journey event (called from applications router).
 */
function trackJourneyEvent(eventName, applicationId, properties = {}) {
  track(eventName, { applicationId, ...properties }, applicationId)
}

module.exports = { track, trackPublish, trackJourneyEvent }
