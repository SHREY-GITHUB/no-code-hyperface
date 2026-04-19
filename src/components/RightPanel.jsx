import { useState } from 'react'

export default function RightPanel({ selectedStage, fields, kycMethods, stages }) {
  const visibleFields = fields ? fields.filter((f) => f.show) : []
  const selectedStageObj = stages?.find(s => s.name === selectedStage)
  const isDisabled = selectedStageObj ? !selectedStageObj.enabled : false

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{ width: 320, backgroundColor: '#FFFFFF', borderLeft: '1px solid #E2E8F0' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{ height: 56, borderBottom: '1px solid #E2E8F0' }}
      >
        <p
          className="uppercase tracking-widest"
          style={{ fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em', fontWeight: 600 }}
        >
          Live Preview
        </p>
        {isDisabled && (
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#92400E',
            backgroundColor: '#FEF3C7', borderRadius: 5, padding: '2px 8px',
          }}>
            Stage Off
          </span>
        )}
      </div>

      {/* Phone mockup area */}
      <div className="flex flex-1 items-center justify-center overflow-hidden py-6 px-4">
        <PhoneMockup
          selectedStage={selectedStage}
          visibleFields={visibleFields}
          kycMethods={kycMethods}
          isDisabled={isDisabled}
          fields={fields}
        />
      </div>
    </aside>
  )
}

function PhoneMockup({ selectedStage, visibleFields, kycMethods, isDisabled, fields }) {
  const showingForm      = selectedStage === 'Application Form'
  const showingBureau    = selectedStage === 'Bureau & Decisioning'
  const showingKyc       = selectedStage === 'KYC Verification'
  const showingAgreement = selectedStage === 'Agreement & Consent'
  return (
    <div
      className="relative flex flex-col"
      style={{
        width: 240,
        height: 490,
        borderRadius: 36,
        border: '8px solid #1E293B',
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0 0 0 1px #0F172A, 0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Notch */}
      <div className="flex justify-center pt-3 shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div style={{ width: 72, height: 20, borderRadius: 10, backgroundColor: '#1E293B' }} />
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ paddingTop: 8, paddingBottom: 4, backgroundColor: '#FFFFFF' }}
      >
        <span style={{ fontSize: 9, color: '#64748B', fontWeight: 600 }}>9:41</span>
        <div className="flex items-center gap-1">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <rect x="0" y="4" width="2" height="4" rx="0.5" fill="#94A3B8" />
            <rect x="3" y="2.5" width="2" height="5.5" rx="0.5" fill="#94A3B8" />
            <rect x="6" y="1" width="2" height="7" rx="0.5" fill="#94A3B8" />
            <rect x="9" y="0" width="2" height="8" rx="0.5" fill="#CBD5E1" />
          </svg>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 3C2.6 1.4 7.4 1.4 9 3" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M2.5 5C3.5 4 6.5 4 7.5 5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="5" cy="7" r="0.8" fill="#94A3B8" />
          </svg>
          <div className="flex items-center gap-px">
            <div style={{ width: 16, height: 8, borderRadius: 2, border: '1px solid #94A3B8', padding: 1.5 }}>
              <div style={{ width: '70%', height: '100%', borderRadius: 1, backgroundColor: '#94A3B8' }} />
            </div>
            <div style={{ width: 1.5, height: 4, backgroundColor: '#94A3B8', borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* Screen content */}
      {isDisabled       ? <DisabledStageScreen stageName={selectedStage} /> :
       showingForm      ? <FormPreviewScreen visibleFields={visibleFields} fields={fields} /> :
       showingBureau    ? <BureauPreviewScreen /> :
       showingKyc       ? <KYCPreviewScreen kycMethods={kycMethods} /> :
       showingAgreement ? <AgreementPreviewScreen /> :
       <PlaceholderScreen />}

      {/* Home indicator */}
      <div className="flex justify-center pb-2 shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
        <div style={{ width: 64, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' }} />
      </div>
    </div>
  )
}

function FormPreviewScreen({ visibleFields, fields }) {
  // Derive pages from all fields (including hidden ones so page tabs reflect config)
  const allPages = fields
    ? [...new Set(fields.map(f => f.page ?? 1))].sort((a, b) => a - b)
    : [1]
  const totalPages = allPages.length
  const [activePage, setActivePage] = useState(1)
  const pageFields = visibleFields.filter(f => (f.page ?? 1) === activePage)

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Progress bar */}
      <div style={{ padding: '8px 16px 0' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 8, color: '#94A3B8', fontWeight: 500 }}>
            {totalPages > 1 ? `Page ${activePage} of ${totalPages}` : 'Step 1 of 4'}
          </span>
          <span style={{ fontSize: 8, color: '#94A3B8' }}>
            {totalPages > 1 ? `${Math.round((activePage / totalPages) * 100)}%` : '25%'}
          </span>
        </div>
        <div style={{ height: 3, backgroundColor: '#E2E8F0', borderRadius: 2 }}>
          <div style={{
            width: totalPages > 1 ? `${(activePage / totalPages) * 100}%` : '25%',
            height: '100%', backgroundColor: '#3B82F6', borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Page tabs (only shown when multi-page) */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 4, padding: '6px 16px 0' }}>
          {allPages.map(p => (
            <button
              key={p}
              onClick={() => setActivePage(p)}
              style={{
                flex: 1, height: 18, border: 'none', borderRadius: 4, cursor: 'pointer',
                fontSize: 8, fontWeight: 600,
                backgroundColor: activePage === p ? '#3B82F6' : '#F1F5F9',
                color: activePage === p ? '#fff' : '#94A3B8',
                transition: 'background-color 0.15s',
              }}
            >
              P{p}
            </button>
          ))}
        </div>
      )}

      {/* Title */}
      <div style={{ padding: '8px 16px 4px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 }}>
          {activePage === 1 ? 'Tell us about yourself' : 'Additional details'}
        </p>
        <p style={{ fontSize: 9, color: '#94A3B8', margin: '2px 0 0' }}>
          Fill in your details to continue
        </p>
      </div>

      {/* Scrollable fields */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {pageFields.length === 0 ? (
          <p style={{ fontSize: 10, color: '#CBD5E1', textAlign: 'center', marginTop: 20 }}>
            No visible fields on this page
          </p>
        ) : (
          pageFields.map((field) => (
            <div key={field.id}>
              <p style={{ fontSize: 8.5, fontWeight: 600, color: '#64748B', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {field.name}
              </p>
              <div style={{
                height: 26, backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0', borderRadius: 6,
                display: 'flex', alignItems: 'center', paddingLeft: 8,
              }}>
                {field.type === 'Dropdown' && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ marginLeft: 'auto', marginRight: 8 }}>
                    <path d="M1.5 3L4 5.5L6.5 3" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span style={{ fontSize: 8.5, color: '#CBD5E1' }}>
                  {field.type === 'Date' ? 'DD / MM / YYYY' : field.type === 'Number' ? '0' : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Continue / Next Page button */}
      <div style={{ padding: '8px 16px 10px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
        <div
          onClick={() => {
            if (activePage < totalPages) setActivePage(p => p + 1)
          }}
          style={{
            height: 28, backgroundColor: '#3B82F6', borderRadius: 7, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF' }}>
            {activePage < totalPages ? 'Next Page' : 'Continue'}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4 }}>
            <path d="M3.5 2.5L6.5 5L3.5 7.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function DisabledStageScreen({ stageName }) {
  return (
    <div style={{
      display: 'flex', flex: 1, flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F8FAFC', padding: '0 22px', textAlign: 'center',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11, backgroundColor: '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8.5" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M7.5 11h7" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', margin: '0 0 5px' }}>
        Stage Disabled
      </p>
      <p style={{ fontSize: 10.5, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
        {stageName} is turned off and will be skipped in the applicant journey
      </p>
    </div>
  )
}

function PlaceholderScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#F8FAFC' }}>
      <div
        className="flex items-center justify-center mb-3"
        style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#E2E8F0' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3v12M3 9h12" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontSize: 11, color: '#94A3B8', maxWidth: 140 }}>
        Configure a stage to see preview
      </p>
    </div>
  )
}

function BureauPreviewScreen() {
  return (
    <div className="flex flex-1 flex-col" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #F1F5F9' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
          Eligibility Check
        </p>
        <p style={{ fontSize: 9, color: '#94A3B8', margin: 0 }}>
          Bureau result · CIBIL score
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Score display */}
        <div style={{
          backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 10, padding: '12px 14px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
            CIBIL Score
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#16A34A', margin: '0 0 2px', lineHeight: 1 }}>
            782
          </p>
          <p style={{ fontSize: 9, color: '#15803D', margin: 0 }}>Excellent</p>
        </div>

        {/* Score band bar */}
        <div>
          <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ flex: 35, backgroundColor: '#FCA5A5' }} />
            <div style={{ flex: 10, backgroundColor: '#FDE68A' }} />
            <div style={{ flex: 10, backgroundColor: '#86EFAC' }} />
            <div style={{ flex: 45, backgroundColor: '#22C55E' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 8, color: '#94A3B8' }}>300</span>
            <span style={{ fontSize: 8, color: '#94A3B8' }}>650</span>
            <span style={{ fontSize: 8, color: '#94A3B8' }}>700</span>
            <span style={{ fontSize: 8, color: '#94A3B8' }}>750</span>
            <span style={{ fontSize: 8, color: '#94A3B8' }}>900</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 8, color: '#EF4444', fontWeight: 600 }}>Decline</span>
            <span style={{ fontSize: 8, color: '#D97706', fontWeight: 600 }}>Review</span>
            <span style={{ fontSize: 8, color: '#16A34A', fontWeight: 600 }}>Approve</span>
          </div>
        </div>

        {/* Decision rules applied */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <p style={{ fontSize: 8.5, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Rules Applied
          </p>
          {[
            { label: 'Score ≥ 750', result: 'Passed', ok: true },
            { label: 'Income ≥ ₹25K', result: 'Passed', ok: true },
            { label: 'DPD check', result: 'Passed', ok: true },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#F8FAFC', borderRadius: 7, padding: '6px 10px',
              border: '1px solid #F1F5F9',
            }}>
              <span style={{ fontSize: 9, color: '#475569' }}>{r.label}</span>
              <span style={{
                fontSize: 8.5, fontWeight: 600,
                color: r.ok ? '#16A34A' : '#DC2626',
                backgroundColor: r.ok ? '#F0FDF4' : '#FEF2F2',
                borderRadius: 4, padding: '2px 7px',
              }}>
                {r.result}
              </span>
            </div>
          ))}
        </div>

        {/* Offer card */}
        <div style={{
          backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
          borderRadius: 10, padding: '10px 12px',
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
            Pre-Approved Offer
          </p>
          {[
            ['Credit Limit', '₹2,25,000'],
            ['Card Variant', 'Gold'],
            ['Interest Rate', '3.5% / month'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 2 ? 4 : 0 }}>
              <span style={{ fontSize: 9, color: '#64748B' }}>{k}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#0F172A' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Accept button */}
        <div style={{
          height: 26, backgroundColor: '#3B82F6', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: '#fff' }}>Accept Offer →</span>
        </div>
      </div>
    </div>
  )
}

const KYC_METHOD_ICONS = {
  'Aadhaar OTP':   { bg: '#FFF7ED', stroke: '#EA580C', path: <><path d="M8 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" stroke="#EA580C" strokeWidth="1.2" /><path d="M2 13c0-3 2.5-4.5 6-4.5s6 1.5 6 4.5" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" /></> },
  'Video KYC':     { bg: '#F0FDF4', stroke: '#16A34A', path: <><rect x="1.5" y="4" width="8" height="6" rx="1.2" stroke="#16A34A" strokeWidth="1.2" /><path d="M9.5 5.5l4-1.5v6l-4-1.5V5.5z" stroke="#16A34A" strokeWidth="1.2" strokeLinejoin="round" /></> },
  'DigiLocker':    { bg: '#EFF6FF', stroke: '#2563EB', path: <><rect x="2" y="5" width="10" height="8" rx="1.2" stroke="#2563EB" strokeWidth="1.2" /><path d="M5 5V4a3 3 0 016 0v1" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" /><circle cx="7" cy="9" r="1" fill="#2563EB" /></> },
  'Manual Upload': { bg: '#F5F3FF', stroke: '#7C3AED', path: <><path d="M7 10V3M4.5 5.5L7 3l2.5 2.5" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12h10" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" /></> },
}

function KYCPreviewScreen({ kycMethods }) {
  const enabledMethods = (kycMethods ?? []).filter((m) => m.enabled)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #F1F5F9' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
          Verify your identity
        </p>
        <p style={{ fontSize: 9, color: '#94A3B8', margin: 0 }}>
          Choose how you'd like to complete KYC
        </p>
      </div>

      {/* Method cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {enabledMethods.length === 0 ? (
          <p style={{ fontSize: 10, color: '#CBD5E1', textAlign: 'center', marginTop: 20 }}>
            No methods enabled
          </p>
        ) : (
          enabledMethods.map((method) => {
            const icon = KYC_METHOD_ICONS[method.name] ?? { bg: '#F1F5F9', path: null }
            return (
              <div
                key={method.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: 8, padding: '9px 10px',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                  backgroundColor: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {icon.path}
                  </svg>
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#1E293B', margin: '0 0 1px' }}>
                    {method.name}
                  </p>
                  <p style={{ fontSize: 8.5, color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
                    {method.desc}
                  </p>
                </div>

                {/* Arrow */}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M3.5 2.5L6.5 5l-3 2.5" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )
          })
        )}
      </div>

      {/* Continue button */}
      <div style={{ padding: '8px 12px 10px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{
          height: 28, backgroundColor: '#3B82F6', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Continue</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4 }}>
            <path d="M3.5 2.5L6.5 5L3.5 7.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function AgreementPreviewScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #F1F5F9' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: '0 0 2px' }}>
          Review &amp; Sign
        </p>
        <p style={{ fontSize: 9, color: '#94A3B8', margin: 0 }}>
          Read and accept the following documents
        </p>
      </div>

      {/* Doc cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'Loan Agreement', tag: 'Required' },
          { label: 'MITC Document', tag: 'Required' },
          { label: 'Privacy Policy', tag: null },
          { label: 'Schedule of Charges', tag: null },
        ].map((doc, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: 8, padding: '8px 10px',
          }}>
            {/* doc icon */}
            <div style={{
              width: 24, height: 24, borderRadius: 5, flexShrink: 0,
              backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1.5" y="0.5" width="7" height="10" rx="1" stroke="#3B82F6" strokeWidth="1" />
                <path d="M3 3.5h4M3 5.5h4M3 7.5h2.5" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 9.5, fontWeight: 600, color: '#1E293B', margin: 0 }}>{doc.label}</p>
              {doc.tag && (
                <span style={{ fontSize: 8, color: '#DC2626', fontWeight: 500 }}>● Required</span>
              )}
            </div>
            {/* checkbox */}
            <div style={{
              width: 14, height: 14, borderRadius: 3, border: '1.5px solid #E2E8F0',
              backgroundColor: '#fff', flexShrink: 0,
            }} />
          </div>
        ))}

        {/* Consent checkboxes */}
        <div style={{ marginTop: 6 }}>
          <p style={{ fontSize: 8, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Disclosures</p>
          {['I agree to the Terms & Conditions', 'Consent for auto-debit (NACH)'].map((txt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 6 }}>
              <div style={{
                width: 13, height: 13, borderRadius: 3, border: '1.5px solid #CBD5E1',
                backgroundColor: '#fff', flexShrink: 0, marginTop: 1,
              }} />
              <span style={{ fontSize: 8.5, color: '#64748B', lineHeight: 1.4 }}>{txt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit button (greyed — unchecked) */}
      <div style={{ padding: '8px 12px 10px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{
          height: 28, backgroundColor: '#CBD5E1', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginRight: 4 }}>
            <path d="M5 1.5v4M2.5 8.5h5M3.5 5.5L5 7l1.5-1.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>Sign &amp; Submit</span>
        </div>
        <p style={{ fontSize: 8, color: '#CBD5E1', textAlign: 'center', margin: '4px 0 0' }}>
          Accept all documents to enable
        </p>
      </div>
    </div>
  )
}

function StatusRow({ label, status }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        backgroundColor: '#F8FAFC',
        borderRadius: 7,
        border: '1px solid #F1F5F9',
      }}
    >
      {status === 'done' ? (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3.5 6L6.5 2.5" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '2px solid #BFDBFE',
            borderTopColor: '#3B82F6',
            flexShrink: 0,
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      <span style={{ fontSize: 10, color: status === 'done' ? '#374151' : '#3B82F6', fontWeight: status === 'loading' ? 500 : 400 }}>
        {label}
      </span>
    </div>
  )
}
