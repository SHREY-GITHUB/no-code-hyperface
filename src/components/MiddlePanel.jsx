import { useState, useRef, useEffect } from 'react'
import ApplicationFormSettings from './ApplicationFormSettings'
import BureauDecisioningSettings from './BureauDecisioningSettings'
import KYCVerificationSettings from './KYCVerificationSettings'
import AgreementConsentSettings from './AgreementConsentSettings'
import JourneyAnalytics from './JourneyAnalytics'

const CLIENTS = {
  hdfc:    { id: 'hdfc',    name: 'HDFC Millenia Card Program' },
  slice:   { id: 'slice',   name: 'Slice Student Credit Card'  },
  jupiter: { id: 'jupiter', name: 'Jupiter Edge Card'          },
}

/* ─── Card wrapper shared by all settings panels ─────────── */
function PanelCard({ children }) {
  return (
    <div
      className="h-full overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px 12px 0 0',
        border: '1px solid #E5E7EB',
        borderBottom: 'none',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      {children}
    </div>
  )
}

/* ─── Client selector dropdown ───────────────────────────── */
function ClientSelector({ clientId, setClientId }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const current = CLIENTS[clientId]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
          fontSize: 13, color: '#374151', fontFamily: 'inherit', fontWeight: 500,
          borderRadius: 5, transition: 'color 0.15s, background-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.backgroundColor = '#EFF6FF' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        {current.name}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#9CA3AF' }}
        >
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          backgroundColor: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
          minWidth: 230, zIndex: 200,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {Object.values(CLIENTS).map(c => (
            <button
              key={c.id}
              onClick={() => { setClientId(c.id); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 14px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                fontSize: 13, fontWeight: c.id === clientId ? 600 : 400,
                color: c.id === clientId ? '#1D4ED8' : '#374151',
                backgroundColor: c.id === clientId ? '#EFF6FF' : 'transparent',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={e => { if (c.id !== clientId) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
              onMouseLeave={e => { if (c.id !== clientId) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {c.id === clientId ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{ width: 12 }} />
              )}
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function MiddlePanel({
  selectedStage, fields, setFields, kycMethods, setKycMethods,
  onPreviewClick, clientId, setClientId, programName, demoControls,
  analyticsOpen, setAnalyticsOpen, onMenuOpen,
}) {
  const scenarioActive = demoControls && Object.values(demoControls).some(Boolean)

  function renderContent() {
    if (analyticsOpen) return <JourneyAnalytics onClose={() => setAnalyticsOpen(false)} />
    if (selectedStage === 'Application Form')
      return <ApplicationFormSettings fields={fields} setFields={setFields} />
    if (selectedStage === 'Bureau & Decisioning')
      return <BureauDecisioningSettings />
    if (selectedStage === 'KYC Verification')
      return <KYCVerificationSettings kycMethods={kycMethods} setKycMethods={setKycMethods} />
    if (selectedStage === 'Agreement & Consent')
      return <AgreementConsentSettings />
    return null
  }

  const content = renderContent()

  return (
    <main className="flex flex-col flex-1 h-full overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>

      {/* ── Top bar ──────────────────────────────────────── */}
      <div
        className="middle-topbar flex items-center justify-between shrink-0"
        style={{
          height: 56,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left: hamburger + breadcrumb */}
        <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
          {/* Hamburger — mobile only */}
          <button
            className="mobile-menu-btn"
            onClick={onMenuOpen}
            style={{
              width: 32, height: 32,
              border: '1px solid #E5E7EB', borderRadius: 7,
              backgroundColor: '#F9FAFB', cursor: 'pointer', color: '#6B7280',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1" style={{ fontSize: 13, color: '#6B7280', minWidth: 0 }}>
            <span className="font-semibold hidden sm:inline" style={{ color: '#111827', whiteSpace: 'nowrap' }}>
              Hyperface Studio
            </span>
            <svg className="hidden sm:block" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {programName ? (
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                {programName}
              </span>
            ) : (
              <ClientSelector clientId={clientId} setClientId={setClientId} />
            )}
            {selectedStage && !analyticsOpen && (
              <>
                <svg className="hidden sm:block" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline" style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                  {selectedStage}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Draft pill */}
          <span style={{
            fontSize: 10.5, fontWeight: 600, color: '#92400E',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: 20, padding: '3px 10px',
            whiteSpace: 'nowrap', letterSpacing: '0.02em',
          }}>
            ◌ Draft
          </span>

          {/* Scenario indicator */}
          {scenarioActive && (
            <div className="scenario-text" style={{ alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: '#EF4444', display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: '#EF4444', whiteSpace: 'nowrap' }}>
                Scenario Active
              </span>
            </div>
          )}

          {/* Analytics toggle */}
          <button
            onClick={() => setAnalyticsOpen(v => !v)}
            title="Analytics"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12.5, fontWeight: 500,
              color: analyticsOpen ? '#1D4ED8' : '#6B7280',
              border: `1px solid ${analyticsOpen ? '#BFDBFE' : '#E5E7EB'}`,
              borderRadius: 7, padding: '6px 10px',
              backgroundColor: analyticsOpen ? '#EFF6FF' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!analyticsOpen) {
                e.currentTarget.style.backgroundColor = '#F9FAFB'
                e.currentTarget.style.borderColor = '#D1D5DB'
                e.currentTarget.style.color = '#374151'
              }
            }}
            onMouseLeave={e => {
              if (!analyticsOpen) {
                e.currentTarget.style.backgroundColor = '#FFFFFF'
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.color = '#6B7280'
              }
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="8"   width="3" height="5" rx="0.75" fill="currentColor" opacity="0.55"/>
              <rect x="5.5" y="5" width="3" height="8" rx="0.75" fill="currentColor" opacity="0.75"/>
              <rect x="10" y="2"  width="3" height="11" rx="0.75" fill="currentColor"/>
            </svg>
            <span className="hidden sm:inline">Analytics</span>
          </button>

          {/* Preview button */}
          <button
            onClick={onPreviewClick}
            style={{
              fontSize: 12.5, fontWeight: 600,
              color: '#FFFFFF',
              border: 'none', borderRadius: 7,
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.32)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.22)'
            }}
          >
            <span className="hidden sm:inline">Preview Journey</span>
            <span className="sm:hidden">Preview</span>
          </button>
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────── */}
      {analyticsOpen ? (
        <div
          key="analytics"
          className="flex-1 overflow-hidden"
          style={{ animation: 'stageFadeIn 0.2s ease-out', display: 'flex', flexDirection: 'column' }}
        >
          {content}
        </div>
      ) : content ? (
        <div
          key={selectedStage}
          className="flex-1 overflow-hidden settings-content-pad"
          style={{
            backgroundColor: '#F9FAFB',
            animation: 'stageFadeIn 0.2s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          <PanelCard>{content}</PanelCard>
        </div>
      ) : (
        <div
          key="empty"
          className="flex flex-1 items-center justify-center overflow-auto p-8"
          style={{ animation: 'stageFadeIn 0.2s ease-out' }}
        >
          <div
            className="empty-state-card flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: '36px 32px',
              minWidth: 360,
              width: '100%',
              maxWidth: 420,
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div
              className="flex items-center justify-center mb-5"
              style={{ width: 52, height: 52, borderRadius: 13, backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3"  y="3"  width="7" height="7" rx="1.5" stroke="#9CA3AF" strokeWidth="1.5" />
                <rect x="12" y="3"  width="7" height="7" rx="1.5" stroke="#9CA3AF" strokeWidth="1.5" />
                <rect x="3"  y="12" width="7" height="7" rx="1.5" stroke="#9CA3AF" strokeWidth="1.5" />
                <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="#9CA3AF" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.2px' }}>
              Select a stage to configure
            </h2>
            <p style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 280, margin: 0, lineHeight: 1.6 }}>
              Click any stage on the left to open its configuration settings
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
