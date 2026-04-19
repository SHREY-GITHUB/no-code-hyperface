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
        backgroundColor: '#F8FAFC',
        borderRadius: '12px 12px 0 0',
        border: '1px solid #E2E8F0',
        borderBottom: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
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

  /* Close on outside click */
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
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontSize: 13, color: '#64748B', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#3B82F6' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748B' }}
      >
        {current.name}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        >
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          backgroundColor: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          minWidth: 220, zIndex: 200,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {Object.values(CLIENTS).map(c => (
            <button
              key={c.id}
              onClick={() => { setClientId(c.id); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                fontSize: 13, color: c.id === clientId ? '#1D4ED8' : '#1E293B',
                backgroundColor: c.id === clientId ? '#EFF6FF' : 'transparent',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={e => { if (c.id !== clientId) e.currentTarget.style.backgroundColor = '#F8FAFC' }}
              onMouseLeave={e => { if (c.id !== clientId) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {c.id === clientId && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {c.id !== clientId && <span style={{ width: 12 }} />}
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
  onPreviewClick, clientId, setClientId, demoControls,
  analyticsOpen, setAnalyticsOpen,
}) {
  const scenarioActive = demoControls && Object.values(demoControls).some(Boolean)
  /* Determine what panel content to render */
  function renderContent() {
    if (analyticsOpen) return <JourneyAnalytics onClose={() => setAnalyticsOpen(false)} />
    if (selectedStage === 'Application Form') {
      return <ApplicationFormSettings fields={fields} setFields={setFields} />
    }
    if (selectedStage === 'Bureau & Decisioning') {
      return <BureauDecisioningSettings />
    }
    if (selectedStage === 'KYC Verification') {
      return <KYCVerificationSettings kycMethods={kycMethods} setKycMethods={setKycMethods} />
    }
    if (selectedStage === 'Agreement & Consent') {
      return <AgreementConsentSettings />
    }
    return null
  }

  const content = renderContent()

  return (
    <main className="flex flex-col flex-1 h-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>

      {/* Top bar */}
      <div
        className="flex items-center justify-between shrink-0 px-6"
        style={{
          height: 56, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
        }}
      >
        {/* Breadcrumb with client selector */}
        <nav className="flex items-center gap-1.5" style={{ fontSize: 13, color: '#64748B' }}>
          <span className="font-medium" style={{ color: '#1E293B' }}>Hyperface Studio</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 3L7.5 6L4.5 9" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <ClientSelector clientId={clientId} setClientId={setClientId} />
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 12, fontWeight: 500, color: '#D97706',
              backgroundColor: '#FEF3C7', borderRadius: 6, padding: '3px 10px',
            }}
          >
            Draft
          </span>
          {scenarioActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: '#EF4444' }}>Scenario Active</span>
            </div>
          )}
          <button
            onClick={() => setAnalyticsOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 500,
              color: analyticsOpen ? '#1D4ED8' : '#64748B',
              border: `1.5px solid ${analyticsOpen ? '#3B82F6' : '#E2E8F0'}`,
              borderRadius: 8, padding: '6px 14px',
              backgroundColor: analyticsOpen ? '#EFF6FF' : 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              if (!analyticsOpen) {
                e.currentTarget.style.backgroundColor = '#F8FAFC'
                e.currentTarget.style.borderColor = '#CBD5E1'
              }
            }}
            onMouseLeave={e => {
              if (!analyticsOpen) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#E2E8F0'
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="8"  width="3" height="5" rx="0.75" fill="currentColor" opacity="0.7"/>
              <rect x="5.5" y="5" width="3" height="8" rx="0.75" fill="currentColor" opacity="0.85"/>
              <rect x="10" y="2" width="3" height="11" rx="0.75" fill="currentColor"/>
            </svg>
            Analytics
          </button>
          <button
            onClick={onPreviewClick}
            style={{
              fontSize: 13, fontWeight: 500, color: '#3B82F6',
              border: '1.5px solid #3B82F6', borderRadius: 8,
              padding: '6px 16px', backgroundColor: 'transparent', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Preview Journey
          </button>
        </div>
      </div>

      {/* Content area — keyed on selectedStage to trigger fade-in transition */}
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
          className="flex-1 overflow-hidden"
          style={{
            backgroundColor: '#F1F5F9',
            padding: '24px 24px 0',
            animation: 'stageFadeIn 0.2s ease-out',
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
            className="flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 32,
              minWidth: 360,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="flex items-center justify-center mb-4"
              style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3"  y="3"  width="7" height="7" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
                <rect x="12" y="3"  width="7" height="7" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
                <rect x="3"  y="12" width="7" height="7" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
                <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#64748B', margin: '0 0 8px' }}>
              Select a stage to configure
            </h2>
            <p style={{ fontSize: 13, color: '#94A3B8', maxWidth: 280, margin: 0 }}>
              Click any stage on the left to open its settings
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
