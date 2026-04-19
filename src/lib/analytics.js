// ─────────────────────────────────────────────────────────────────────────────
// Hyperface Studio — Frontend Analytics
// Wraps Mixpanel browser SDK (lazy-loaded) and also mirrors events to our
// own /api/events ingestion endpoint for DB storage.
//
// Usage:
//   import { studio, journey } from './lib/analytics'
//   studio.programOpened({ programId: 'abc', programSlug: 'hdfc-millenia' })
//   journey.stageCompleted({ applicationId: 'xyz', stageName: 'KYC Verification' })
// ─────────────────────────────────────────────────────────────────────────────

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN
const API_BASE       = import.meta.env.VITE_API_BASE ?? '/api'  // same as api.js
const API_KEY        = import.meta.env.VITE_API_KEY  ?? ''

// ─── Mixpanel lazy init ───────────────────────────────────────────────────────

let _mp = null

async function getMixpanel() {
  if (_mp) return _mp
  if (!MIXPANEL_TOKEN) return null
  try {
    const { default: mixpanel } = await import('mixpanel-browser')
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: import.meta.env.DEV,
      track_pageview: false,
      persistence: 'localStorage',
    })
    _mp = mixpanel
    return _mp
  } catch {
    return null
  }
}

// ─── Core track function ──────────────────────────────────────────────────────

/**
 * Fire an analytics event.
 * - Sends to Mixpanel browser SDK (if token present).
 * - POSTs to /api/events for DB storage (if applicationId present in properties).
 * Never throws — analytics must not break the user flow.
 */
async function track(eventName, properties = {}) {
  const enriched = {
    ...properties,
    source:      'studio-frontend',
    environment: import.meta.env.MODE ?? 'development',
    timestamp:   new Date().toISOString(),
  }

  // 1. Mixpanel (non-blocking)
  getMixpanel().then(mp => {
    if (!mp) return
    mp.track(eventName, enriched)
  }).catch(() => {})

  // 2. Our own event ingestion endpoint (only when an application exists)
  if (properties.applicationId) {
    fetch(`${API_BASE}/events`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    API_KEY,
      },
      body: JSON.stringify({ eventName, properties: enriched }),
    }).catch(() => {})
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDIO EVENTS — fired by the configurator (product manager actions)
// ─────────────────────────────────────────────────────────────────────────────

export const STUDIO_EVENTS = {
  // Session
  SESSION_STARTED:          'studio_session_started',
  HOME_VIEWED:              'studio_home_viewed',

  // Program
  PROGRAM_OPENED:           'studio_program_opened',
  PROGRAM_CREATED:          'studio_program_created',
  PROGRAM_DELETED:          'studio_program_deleted',

  // Stage config
  STAGE_TOGGLED:            'studio_stage_toggled',
  STAGE_REORDERED:          'studio_stage_reordered',

  // Form fields
  FIELD_SHOW_TOGGLED:       'studio_field_show_toggled',
  FIELD_REQUIRED_TOGGLED:   'studio_field_required_toggled',
  FIELD_HINT_UPDATED:       'studio_field_hint_updated',
  FIELD_ADDED:              'studio_field_added',
  FIELD_REMOVED:            'studio_field_removed',
  FIELD_MOVED_TO_PAGE:      'studio_field_moved_to_page',
  PAGE_ADDED:               'studio_page_added',
  PAGE_REMOVED:             'studio_page_removed',

  // KYC
  KYC_METHOD_TOGGLED:       'studio_kyc_method_toggled',

  // Bureau & decisioning
  BUREAU_CONFIG_UPDATED:    'studio_bureau_config_updated',
  CREDIT_LIMIT_UPDATED:     'studio_credit_limit_updated',

  // Validation rules
  VALIDATION_RULE_TOGGLED:  'studio_validation_rule_toggled',

  // Preview
  PREVIEW_OPENED:           'studio_preview_opened',
  PREVIEW_CLOSED:           'studio_preview_closed',
  DEMO_CONTROL_CHANGED:     'studio_demo_control_changed',

  // Analytics panel
  ANALYTICS_VIEWED:         'studio_analytics_viewed',
  ANALYTICS_RANGE_CHANGED:  'studio_analytics_range_changed',

  // Publish
  PUBLISH_CLICKED:          'studio_publish_clicked',
  PUBLISH_CONFIRMED:        'studio_publish_confirmed',
  PUBLISH_CANCELLED:        'studio_publish_cancelled',
  EMBED_CODE_COPIED:        'studio_embed_code_copied',
  API_ENDPOINT_COPIED:      'studio_api_endpoint_copied',
}

export const studio = {
  sessionStarted:        (p = {}) => track(STUDIO_EVENTS.SESSION_STARTED, p),
  homeViewed:            (p = {}) => track(STUDIO_EVENTS.HOME_VIEWED, p),

  programOpened:         (p = {}) => track(STUDIO_EVENTS.PROGRAM_OPENED, p),
  programCreated:        (p = {}) => track(STUDIO_EVENTS.PROGRAM_CREATED, p),
  programDeleted:        (p = {}) => track(STUDIO_EVENTS.PROGRAM_DELETED, p),

  stageToggled:          (p = {}) => track(STUDIO_EVENTS.STAGE_TOGGLED, p),
  stageReordered:        (p = {}) => track(STUDIO_EVENTS.STAGE_REORDERED, p),

  fieldShowToggled:      (p = {}) => track(STUDIO_EVENTS.FIELD_SHOW_TOGGLED, p),
  fieldRequiredToggled:  (p = {}) => track(STUDIO_EVENTS.FIELD_REQUIRED_TOGGLED, p),
  fieldHintUpdated:      (p = {}) => track(STUDIO_EVENTS.FIELD_HINT_UPDATED, p),
  fieldAdded:            (p = {}) => track(STUDIO_EVENTS.FIELD_ADDED, p),
  fieldRemoved:          (p = {}) => track(STUDIO_EVENTS.FIELD_REMOVED, p),
  fieldMovedToPage:      (p = {}) => track(STUDIO_EVENTS.FIELD_MOVED_TO_PAGE, p),
  pageAdded:             (p = {}) => track(STUDIO_EVENTS.PAGE_ADDED, p),
  pageRemoved:           (p = {}) => track(STUDIO_EVENTS.PAGE_REMOVED, p),

  kycMethodToggled:      (p = {}) => track(STUDIO_EVENTS.KYC_METHOD_TOGGLED, p),

  bureauConfigUpdated:   (p = {}) => track(STUDIO_EVENTS.BUREAU_CONFIG_UPDATED, p),
  creditLimitUpdated:    (p = {}) => track(STUDIO_EVENTS.CREDIT_LIMIT_UPDATED, p),

  validationRuleToggled: (p = {}) => track(STUDIO_EVENTS.VALIDATION_RULE_TOGGLED, p),

  previewOpened:         (p = {}) => track(STUDIO_EVENTS.PREVIEW_OPENED, p),
  previewClosed:         (p = {}) => track(STUDIO_EVENTS.PREVIEW_CLOSED, p),
  demoControlChanged:    (p = {}) => track(STUDIO_EVENTS.DEMO_CONTROL_CHANGED, p),

  analyticsViewed:       (p = {}) => track(STUDIO_EVENTS.ANALYTICS_VIEWED, p),
  analyticsRangeChanged: (p = {}) => track(STUDIO_EVENTS.ANALYTICS_RANGE_CHANGED, p),

  publishClicked:        (p = {}) => track(STUDIO_EVENTS.PUBLISH_CLICKED, p),
  publishConfirmed:      (p = {}) => track(STUDIO_EVENTS.PUBLISH_CONFIRMED, p),
  publishCancelled:      (p = {}) => track(STUDIO_EVENTS.PUBLISH_CANCELLED, p),
  embedCodeCopied:       (p = {}) => track(STUDIO_EVENTS.EMBED_CODE_COPIED, p),
  apiEndpointCopied:     (p = {}) => track(STUDIO_EVENTS.API_ENDPOINT_COPIED, p),
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNEY EVENTS — fired by the applicant-facing journey (PreviewMode or
// the embedded public journey player).
// ─────────────────────────────────────────────────────────────────────────────

export const JOURNEY_EVENTS = {
  STARTED:              'journey_started',
  STAGE_COMPLETED:      'stage_completed',
  FORM_PAGE_VIEWED:     'form_page_viewed',
  FORM_PAGE_COMPLETED:  'form_page_completed',
  BUREAU_COMPLETED:     'bureau_completed',
  KYC_COMPLETED:        'kyc_completed',
  KYC_FAILED:           'kyc_failed',
  COMPLETED:            'journey_completed',
  ABANDONED:            'journey_abandoned',
}

export const journey = {
  started:            (p = {}) => track(JOURNEY_EVENTS.STARTED, p),
  stageCompleted:     (p = {}) => track(JOURNEY_EVENTS.STAGE_COMPLETED, p),
  formPageViewed:     (p = {}) => track(JOURNEY_EVENTS.FORM_PAGE_VIEWED, p),
  formPageCompleted:  (p = {}) => track(JOURNEY_EVENTS.FORM_PAGE_COMPLETED, p),
  bureauCompleted:    (p = {}) => track(JOURNEY_EVENTS.BUREAU_COMPLETED, p),
  kycCompleted:       (p = {}) => track(JOURNEY_EVENTS.KYC_COMPLETED, p),
  kycFailed:          (p = {}) => track(JOURNEY_EVENTS.KYC_FAILED, p),
  completed:          (p = {}) => track(JOURNEY_EVENTS.COMPLETED, p),
  abandoned:          (p = {}) => track(JOURNEY_EVENTS.ABANDONED, p),
}
