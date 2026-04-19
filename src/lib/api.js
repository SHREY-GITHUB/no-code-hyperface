// ─────────────────────────────────────────────────────────────────────────────
// Hyperface Studio — Frontend API Client
// Thin fetch wrappers for all /api/* endpoints.
// Base URL is proxied by Vite in dev (see vite.config.js) so relative paths
// work both in dev (→ localhost:3001) and production.
// ─────────────────────────────────────────────────────────────────────────────

// In dev, Vite proxies /api → localhost:3001 (see vite.config.js).
// In production, VITE_API_BASE must be set to the deployed backend URL.
const BASE    = import.meta.env.VITE_API_BASE ?? '/api'
const API_KEY = import.meta.env.VITE_API_KEY  ?? ''

// ─── Internal fetch helper ────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    API_KEY,
      ...(options.headers ?? {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data?.error ?? `HTTP ${res.status}`)
    err.status = res.status
    err.data   = data
    throw err
  }

  return data
}

function get(path)         { return apiFetch(path, { method: 'GET' }) }
function post(path, body)  { return apiFetch(path, { method: 'POST',   body: JSON.stringify(body) }) }
function patch(path, body) { return apiFetch(path, { method: 'PATCH',  body: JSON.stringify(body) }) }
function put(path, body)   { return apiFetch(path, { method: 'PUT',    body: JSON.stringify(body) }) }
function del(path)         { return apiFetch(path, { method: 'DELETE' }) }

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS
// ─────────────────────────────────────────────────────────────────────────────

export const programs = {
  /** List all programs (summary). */
  list: () =>
    get('/programs'),

  /** Full program detail including all config. */
  get: (id) =>
    get(`/programs/${id}`),

  /** Create a new program. */
  create: ({ slug, name, bankName, colorHex, bgHex, logoInitial, webhookUrl }) =>
    post('/programs', { slug, name, bankName, colorHex, bgHex, logoInitial, webhookUrl }),

  /** Update program metadata (name, status, colours, webhook). */
  update: (id, data) =>
    patch(`/programs/${id}`, data),

  /** Soft-delete a program. */
  delete: (id) =>
    del(`/programs/${id}`),

  // ── Sub-resources ───────────────────────────────────────────────────────────

  /** Replace all stages (ordered array). */
  updateStages: (id, stages) =>
    put(`/programs/${id}/stages`, { stages }),

  /** Replace all form fields. */
  updateFields: (id, fields) =>
    put(`/programs/${id}/fields`, { fields }),

  /** Replace KYC method configs. */
  updateKycMethods: (id, kycMethods) =>
    put(`/programs/${id}/kyc-methods`, { kycMethods }),

  /** Upsert bureau config + credit limit config. */
  updateBureauConfig: (id, bureauConfig, creditLimitConfig) =>
    put(`/programs/${id}/bureau-config`, { bureauConfig, creditLimitConfig }),

  /** Replace all validation rules. */
  updateValidationRules: (id, rules) =>
    put(`/programs/${id}/validation-rules`, { rules }),

  /**
   * Publish a new journey version.
   * Returns { ok, version, journeyVersionId, liveUrl, enabledStageCount, ... }
   */
  publish: (id, { webhookUrl } = {}) =>
    post(`/programs/${id}/publish`, { webhookUrl }),
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS  (applicant journey runtime)
// ─────────────────────────────────────────────────────────────────────────────

export const applications = {
  /**
   * Start a new application session.
   * Returns { application }
   */
  start: ({ programSlug, sessionId, utmSource, utmMedium, utmCampaign, isPreview } = {}) =>
    post('/applications', { programSlug, sessionId, utmSource, utmMedium, utmCampaign, isPreview }),

  /** Get application + event history. */
  get: (id) =>
    get(`/applications/${id}`),

  /** Advance to a stage / update status. */
  updateStage: (id, { stageName, status, formData, currentFormPage, timeSpentMs, isPreview } = {}) =>
    patch(`/applications/${id}/stage`, { stageName, status, formData, currentFormPage, timeSpentMs, isPreview }),

  /** Record a form page viewed or completed event. */
  recordFormPage: (id, { pageNumber, eventType, timeSpentMs, isPreview } = {}) =>
    post(`/applications/${id}/form-page`, { pageNumber, eventType, timeSpentMs, isPreview }),

  /**
   * Record a bureau check result.
   * decision: 'APPROVED' | 'MANUAL_REVIEW' | 'DECLINED' | 'ERROR'
   */
  recordBureauCheck: (id, { bureauName, pullType, score, decision, reportReference, errorMessage, isFallback, isPreview } = {}) =>
    post(`/applications/${id}/bureau-check`, { bureauName, pullType, score, decision, reportReference, errorMessage, isFallback, isPreview }),

  /** Record a KYC verification attempt. */
  recordKyc: (id, { methodName, status, verificationId, errorMessage, isPreview } = {}) =>
    post(`/applications/${id}/kyc`, { methodName, status, verificationId, errorMessage, isPreview }),

  /** Final submission — marks application SUBMITTED. */
  submit: (id, { totalTimeMs, stagesCompleted, isPreview } = {}) =>
    post(`/applications/${id}/submit`, { totalTimeMs, stagesCompleted, isPreview }),

  /** Mark as abandoned. */
  abandon: (id, { stageName, pageNumber, timeSpentMs, reason, isPreview } = {}) =>
    post(`/applications/${id}/abandon`, { stageName, pageNumber, timeSpentMs, reason, isPreview }),
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

export const analytics = {
  /**
   * Summary KPIs — totalStarted, submitted, conversionRate, avgCompletionMs.
   * range: '7d' | '30d' | '90d'
   */
  summary: (programId, range = '7d') =>
    get(`/analytics/${programId}/summary?range=${range}`),

  /** Funnel — per-stage counts and drop-off. */
  funnel: (programId, range = '7d') =>
    get(`/analytics/${programId}/funnel?range=${range}`),

  /** Daily/weekly/monthly application counts. */
  daily: (programId, range = '7d') =>
    get(`/analytics/${programId}/daily?range=${range}`),

  /** Application outcome breakdown (Approved / Pending / Declined / Incomplete). */
  outcomes: (programId, range = '7d') =>
    get(`/analytics/${programId}/outcomes?range=${range}`),

  /** Per-stage average time and drop-off severity. */
  stagePerformance: (programId, range = '7d') =>
    get(`/analytics/${programId}/stage-performance?range=${range}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────────────────────────────────────

export const health = {
  /** Quick server health check (no auth required). */
  check: () => fetch('/health').then(r => r.json()),
}
