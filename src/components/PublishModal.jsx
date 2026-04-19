import { useState } from 'react'

const CLIENT_SLUGS = {
  hdfc:    'hdfc-millenia',
  slice:   'slice-student',
  jupiter: 'jupiter-edge',
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function PublishModal({ onClose, stages, fields, kycMethods, clientId }) {
  const [state, setState]       = useState('idle') // idle | loading | done
  const [webhook, setWebhook]   = useState('')
  const [copied, setCopied]     = useState(null)   // 'api' | 'embed' | null

  const slug     = CLIENT_SLUGS[clientId] ?? 'journey'
  const version  = 'v2.4.0'
  const apiUrl   = `https://api.hyperface.co/journeys/${slug}/v2`
  const embedCode = `<HyperfaceJourney\n  id="${slug}"\n  env="production"\n/>`

  const enabledStages = (stages  ?? []).filter(s => s.enabled)
  const visibleFields = (fields  ?? []).filter(f => f.show)
  const enabledKyc    = (kycMethods ?? []).filter(m => m.enabled)

  function copy(text, key) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function handlePublish() {
    if (state !== 'idle') return
    setState('loading')
    setTimeout(() => setState('done'), 1800)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backgroundColor: 'rgba(15,23,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div style={{
        backgroundColor: '#fff', borderRadius: 16, width: 540,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        animation: 'fadeSlideUp 0.2s ease-out',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
              Publish Journey
            </h2>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
              Version <strong style={{ color: '#64748B' }}>{version}</strong>
              &nbsp;·&nbsp; Promoting <strong style={{ color: '#64748B' }}>Draft → Production</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>
          {state === 'done' ? (
            <SuccessState slug={slug} onClose={onClose} />
          ) : (
            <>
              {/* What's being published */}
              <div style={{
                backgroundColor: '#F8FAFC', borderRadius: 10, padding: '14px 16px',
                marginBottom: 20, border: '1px solid #F1F5F9',
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, color: '#94A3B8',
                  textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px',
                }}>
                  What's being published
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {[
                    {
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="#3B82F6" strokeWidth="1.3" />
                          <path d="M1 6h12" stroke="#3B82F6" strokeWidth="1.3" />
                          <circle cx="4" cy="9.5" r="0.8" fill="#3B82F6" />
                        </svg>
                      ),
                      bg: '#EFF6FF',
                      label: `${enabledStages.length} of ${stages?.length ?? 4} stages enabled`,
                      detail: enabledStages.map(s => s.name.replace(' & ', ' & ')).join(' → '),
                    },
                    {
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="2" y="1.5" width="10" height="12" rx="1.5" stroke="#7C3AED" strokeWidth="1.3" />
                          <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      ),
                      bg: '#F5F3FF',
                      label: `${visibleFields.length} form fields configured`,
                      detail: visibleFields.map(f => f.name).join(', ') || 'None visible',
                    },
                    {
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1.5a4 4 0 100 8 4 4 0 000-8z" stroke="#059669" strokeWidth="1.3" />
                          <path d="M4.5 12.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      ),
                      bg: '#ECFDF5',
                      label: `${enabledKyc.length} KYC method${enabledKyc.length !== 1 ? 's' : ''} active`,
                      detail: enabledKyc.map(m => m.name).join(', ') || 'None enabled',
                    },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                        backgroundColor: item.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', margin: '0 0 2px' }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Endpoint */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 7px' }}>
                  API Endpoint
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8', marginLeft: 6 }}>
                    — POST to start an applicant session
                  </span>
                </p>
                <div style={{
                  display: 'flex', alignItems: 'stretch',
                  border: '1px solid #E2E8F0', borderRadius: 9, overflow: 'hidden',
                }}>
                  <span style={{
                    padding: '9px 12px', fontSize: 11, fontWeight: 700,
                    color: '#3B82F6', backgroundColor: '#EFF6FF',
                    borderRight: '1px solid #E2E8F0', flexShrink: 0,
                    display: 'flex', alignItems: 'center',
                  }}>
                    POST
                  </span>
                  <span style={{
                    flex: 1, padding: '9px 12px', fontSize: 12, color: '#334155',
                    fontFamily: 'ui-monospace, "Cascadia Code", monospace',
                    backgroundColor: '#F8FAFC',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {apiUrl}
                  </span>
                  <button
                    onClick={() => copy(apiUrl, 'api')}
                    title="Copy URL"
                    style={{
                      padding: '9px 14px', border: 'none', background: '#F8FAFC',
                      borderLeft: '1px solid #E2E8F0',
                      cursor: 'pointer', color: copied === 'api' ? '#16A34A' : '#94A3B8',
                      flexShrink: 0, display: 'flex', alignItems: 'center',
                      transition: 'color 0.15s',
                    }}
                  >
                    {copied === 'api'
                      ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 5.5-6" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="8" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M4 4V3a1 1 0 011-1h5a1 1 0 011 1v7a1 1 0 01-1 1H9" stroke="currentColor" strokeWidth="1.3" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Embed code */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 7px' }}>
                  React Embed
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8', marginLeft: 6 }}>
                    — drop into your web app
                  </span>
                </p>
                <div style={{
                  border: '1px solid #E2E8F0', borderRadius: 9, overflow: 'hidden', position: 'relative',
                  backgroundColor: '#1E293B',
                }}>
                  <pre style={{
                    margin: 0, padding: '12px 44px 12px 16px',
                    fontSize: 12, color: '#93C5FD',
                    fontFamily: 'ui-monospace, "Cascadia Code", monospace',
                    lineHeight: 1.7,
                  }}>
                    {embedCode}
                  </pre>
                  <button
                    onClick={() => copy(embedCode, 'embed')}
                    title="Copy code"
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 28, height: 28, borderRadius: 6,
                      border: 'none', backgroundColor: 'rgba(255,255,255,0.1)',
                      cursor: 'pointer', color: copied === 'embed' ? '#4ADE80' : '#94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color 0.15s, background-color 0.15s',
                    }}
                  >
                    {copied === 'embed'
                      ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 6l3.5 3.5 5.5-5.5" stroke="#4ADE80" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="3.5" y="3.5" width="7" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 3.5V2.5A1 1 0 014.5 1.5h5a1 1 0 011 1v6a1 1 0 01-1 1H9" stroke="currentColor" strokeWidth="1.2" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Webhook URL */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 7px' }}>
                  Webhook URL
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8', marginLeft: 6 }}>
                    — optional, receives application events
                  </span>
                </p>
                <input
                  value={webhook}
                  onChange={e => setWebhook(e.target.value)}
                  placeholder="https://your-backend.com/webhooks/hyperface"
                  style={{
                    width: '100%', height: 38, padding: '0 12px',
                    border: '1px solid #E2E8F0', borderRadius: 9,
                    fontSize: 12, color: '#1E293B', fontFamily: 'inherit',
                    outline: 'none', backgroundColor: '#F8FAFC',
                    boxSizing: 'border-box', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#93C5FD'; e.target.style.backgroundColor = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#F8FAFC' }}
                />
                <p style={{ fontSize: 11, color: '#94A3B8', margin: '5px 0 0', lineHeight: 1.5 }}>
                  We'll POST <code style={{ fontSize: 10, backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>submitted</code>,
                  &nbsp;<code style={{ fontSize: 10, backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>approved</code>, and
                  &nbsp;<code style={{ fontSize: 10, backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>declined</code> events to this URL in real time.
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1, height: 40, fontSize: 13, fontWeight: 500,
                    color: '#64748B', border: '1px solid #E2E8F0',
                    borderRadius: 9, backgroundColor: '#fff', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  style={{
                    flex: 2, height: 40, fontSize: 13, fontWeight: 600,
                    color: '#fff', backgroundColor: '#3B82F6',
                    border: 'none', borderRadius: 9,
                    cursor: state !== 'idle' ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontFamily: 'inherit', transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => { if (state === 'idle') e.currentTarget.style.backgroundColor = '#2563EB' }}
                  onMouseLeave={e => { if (state === 'idle') e.currentTarget.style.backgroundColor = '#3B82F6' }}
                >
                  {state === 'loading' ? (
                    <>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: '2.5px solid rgba(255,255,255,0.35)',
                        borderTopColor: '#fff',
                        animation: 'spin 0.75s linear infinite',
                      }} />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5v7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M4.5 4L7 1.5 9.5 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1.5 10.5v1A1.5 1.5 0 003 13h8a1.5 1.5 0 001.5-1.5v-1" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                      Publish to Production
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ slug, onClose }) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
      {/* Animated checkmark */}
      <div style={{
        width: 60, height: 60, borderRadius: '50%', backgroundColor: '#DCFCE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
        animation: 'springIn 0.4s ease-out',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 14l7 7 11-11" stroke="#16A34A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
        Journey is Live! 🎉
      </h3>
      <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px', lineHeight: 1.6 }}>
        Your journey has been published to production.<br />
        Applicants can now start onboarding.
      </p>

      {/* Live URL card */}
      <div style={{
        backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
        borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'left',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 5px' }}>
          Live Applicant URL
        </p>
        <p style={{ fontSize: 13, color: '#166534', fontFamily: 'ui-monospace, monospace', margin: 0, fontWeight: 600 }}>
          https://apply.hyperface.co/{slug}
        </p>
      </div>

      {/* What happens next */}
      <div style={{ textAlign: 'left', marginBottom: 22 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
          What happens next
        </p>
        {[
          'Applicants who visit the URL will enter the live journey',
          'Bureau checks run against CIBIL / Experian in real time',
          "You'll receive webhook events for each status change",
          'View applications & analytics in the Reports dashboard',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              backgroundColor: '#DCFCE7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 1,
            }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2.5 2.5 3.5-4" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.55 }}>{item}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{
          width: '100%', height: 40, fontSize: 13, fontWeight: 600,
          color: '#fff', backgroundColor: '#16A34A',
          border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#15803D' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#16A34A' }}
      >
        Done
      </button>
    </div>
  )
}
