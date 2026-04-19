import { useState } from 'react'

/* ─── helpers ─────────────────────────────────────────────── */
function Toggle({ value, onChange, color = '#3B82F6' }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 10,
        backgroundColor: value ? color : '#CBD5E1',
        border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: value ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        backgroundColor: '#fff',
        transition: 'left 0.2s',
        display: 'block',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
      }} />
    </button>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', margin: '0 0 4px' }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{subtitle}</p>}
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─── Document row ─────────────────────────────────────────── */
function DocRow({ label, desc, required, onRequiredChange, enabled, onEnabledChange, badge }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: '1px solid #F1F5F9',
    }}>
      {/* icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        backgroundColor: '#EFF6FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="1" width="9" height="13" rx="1.5" stroke="#3B82F6" strokeWidth="1.3" />
          <path d="M5 5h5M5 7.5h5M5 10h3" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M11 5l2.5 2.5L11 10" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{label}</span>
          {badge && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#059669',
              backgroundColor: '#D1FAE5', borderRadius: 4, padding: '1px 6px',
            }}>{badge}</span>
          )}
        </div>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>{desc}</span>
      </div>

      {/* Required label + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: '#64748B' }}>Required</span>
        <Toggle value={required} onChange={onRequiredChange} color="#3B82F6" />
      </div>

      {/* Show/hide toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: '#64748B' }}>Show</span>
        <Toggle value={enabled} onChange={onEnabledChange} color="#22C55E" />
      </div>
    </div>
  )
}

/* ─── Signature option card ─────────────────────────────────── */
function SigCard({ icon, label, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 16px', border: 'none', cursor: 'pointer',
        backgroundColor: selected ? '#EFF6FF' : '#fff',
        borderBottom: '1px solid #F1F5F9',
        textAlign: 'left', width: '100%',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 1,
        backgroundColor: selected ? '#DBEAFE' : '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: selected ? '1.5px solid #BFDBFE' : '1.5px solid transparent',
        transition: 'all 0.15s',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{label}</span>
          {selected && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#3B82F6',
              backgroundColor: '#DBEAFE', borderRadius: 4, padding: '1px 6px',
            }}>Active</span>
          )}
        </div>
        <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{desc}</p>
      </div>
      {/* radio dot */}
      <div style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 6,
        border: selected ? '5px solid #3B82F6' : '1.5px solid #CBD5E1',
        backgroundColor: '#fff', transition: 'border 0.15s',
      }} />
    </button>
  )
}

/* ─── NACH mandate row ────────────────────────────────────── */
function MandateRow({ label, value, onChange, options }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: '1px solid #F1F5F9',
    }}>
      <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontSize: 12, color: '#1E293B', fontWeight: 500,
          border: '1px solid #E2E8F0', borderRadius: 6,
          padding: '5px 28px 5px 10px', backgroundColor: '#fff',
          cursor: 'pointer', outline: 'none',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

/* ─── Tab bar ───────────────────────────────────────────────── */
const TABS = ['Documents', 'Signature', 'NACH Mandate', 'Disclosures']

/* ─── Main component ────────────────────────────────────────── */
export default function AgreementConsentSettings() {
  const [tab, setTab] = useState('Documents')

  /* Documents tab state */
  const [docs, setDocs] = useState([
    { id: 1, label: 'Loan Agreement',           desc: 'Primary loan/credit agreement document',  required: true,  enabled: true,  badge: 'Mandatory' },
    { id: 2, label: 'MITC Document',             desc: 'Most Important Terms & Conditions',       required: true,  enabled: true,  badge: null },
    { id: 3, label: 'Privacy Policy',            desc: 'Data usage and privacy disclosure',        required: false, enabled: true,  badge: null },
    { id: 4, label: 'Schedule of Charges',       desc: 'Fee and charge schedule for the product', required: false, enabled: true,  badge: null },
    { id: 5, label: 'Auto-debit Authorization',  desc: 'NACH / mandate authorization document',   required: false, enabled: false, badge: null },
  ])

  const updateDoc = (id, key, val) =>
    setDocs(prev => prev.map(d => d.id === id ? { ...d, [key]: val } : d))

  /* Signature tab state */
  const [sigMode, setSigMode] = useState('otp')

  /* NACH tab state */
  const [nachEnabled, setNachEnabled] = useState(true)
  const [mandateType, setMandateType] = useState('E-NACH (Netbanking)')
  const [maxAmount, setMaxAmount] = useState('₹25,000')
  const [frequency, setFrequency] = useState('Monthly')
  const [retryPolicy, setRetryPolicy] = useState('3 retries')

  /* Disclosures tab state */
  const [disclosures, setDisclosures] = useState([
    { id: 1, label: 'Credit Bureau Consent',     desc: 'Consent to pull credit report from CIBIL/Experian',    enabled: true  },
    { id: 2, label: 'Marketing Communications',  desc: 'Allow sending offers and product updates via email/SMS', enabled: false },
    { id: 3, label: 'Data Sharing Consent',      desc: 'Consent for sharing data with group entities',          enabled: true  },
    { id: 4, label: 'Risk Profiling Consent',    desc: 'Consent for investment risk assessment activities',      enabled: false },
  ])

  const updateDisc = (id, val) =>
    setDisclosures(prev => prev.map(d => d.id === id ? { ...d, enabled: val } : d))

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Panel header */}
      <div style={{
        padding: '20px 24px 0',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M4 5h8M4 11h5" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="#3B82F6" strokeWidth="1.3" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', margin: 0 }}>Agreement &amp; Consent</h2>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>Configure documents, signatures and disclosures</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer',
                backgroundColor: 'transparent', fontSize: 13, fontWeight: 500,
                color: tab === t ? '#3B82F6' : '#64748B',
                borderBottom: tab === t ? '2px solid #3B82F6' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>

        {/* ── Documents tab ────────────────────────────────── */}
        {tab === 'Documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SectionHeader
              title="Consent Documents"
              subtitle="Control which documents are shown to the applicant and whether acceptance is mandatory."
            />

            <Card>
              {docs.map((doc, i) => (
                <DocRow
                  key={doc.id}
                  label={doc.label}
                  desc={doc.desc}
                  badge={doc.badge}
                  required={doc.required}
                  onRequiredChange={v => updateDoc(doc.id, 'required', v)}
                  enabled={doc.enabled}
                  onEnabledChange={v => updateDoc(doc.id, 'enabled', v)}
                />
              ))}
              {/* last row no border */}
              <div style={{ padding: '12px 16px' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#3B82F6', fontSize: 13, fontWeight: 500, padding: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#3B82F6" strokeWidth="1.3" />
                    <path d="M7 4.5v5M4.5 7h5" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Add Document
                </button>
              </div>
            </Card>

            {/* Info banner */}
            <div style={{
              display: 'flex', gap: 10, padding: '12px 14px',
              backgroundColor: '#F0F9FF', borderRadius: 8, border: '1px solid #BAE6FD',
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#0EA5E9" strokeWidth="1.3" />
                <path d="M7.5 5v3.5M7.5 10v.5" stroke="#0EA5E9" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: 12, color: '#0369A1', margin: 0, lineHeight: 1.5 }}>
                Mandatory documents (Loan Agreement, MITC) must always be shown and accepted before submission. Toggling <strong>"Show"</strong> off will hide them from the applicant's view.
              </p>
            </div>
          </div>
        )}

        {/* ── Signature tab ─────────────────────────────────── */}
        {tab === 'Signature' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SectionHeader
              title="Digital Signature Method"
              subtitle="Choose how applicants sign the agreement digitally."
            />

            <Card>
              <SigCard
                selected={sigMode === 'otp'}
                onClick={() => setSigMode('otp')}
                label="OTP-based e-Sign"
                desc="Applicant verifies identity with a mobile OTP to sign documents. Compliant with IT Act 2000."
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="2" width="10" height="12" rx="1.5" stroke={sigMode === 'otp' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" />
                    <path d="M6 9l1.5 1.5L10 7" stroke={sigMode === 'otp' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <SigCard
                selected={sigMode === 'aadhaar'}
                onClick={() => setSigMode('aadhaar')}
                label="Aadhaar e-Sign"
                desc="Sign using Aadhaar-linked OTP or biometric. Legally equivalent to physical signature."
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="6" r="2.5" stroke={sigMode === 'aadhaar' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" />
                    <path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={sigMode === 'aadhaar' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                }
              />
              <SigCard
                selected={sigMode === 'drawn'}
                onClick={() => setSigMode('drawn')}
                label="Drawn Signature"
                desc="Applicant draws their signature on a touch/mouse canvas. Stored as image."
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 12c2-3 4-5 6-5s3 2 2 4" stroke={sigMode === 'drawn' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M2 13.5h12" stroke={sigMode === 'drawn' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                }
              />
              <SigCard
                selected={sigMode === 'none'}
                onClick={() => setSigMode('none')}
                label="No Signature Required"
                desc="Documents are displayed and accepted via checkbox only. Lower friction, lower legal standing."
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="3" width="10" height="10" rx="1.5" stroke={sigMode === 'none' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" />
                    <path d="M6 8h4" stroke={sigMode === 'none' ? '#3B82F6' : '#94A3B8'} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                }
              />
            </Card>

            {sigMode === 'aadhaar' && (
              <div style={{
                display: 'flex', gap: 10, padding: '12px 14px',
                backgroundColor: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A',
              }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M7.5 1.5l6 11H1.5l6-11z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round" />
                  <path d="M7.5 6v3M7.5 10.5v.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  Aadhaar e-Sign requires <strong>UIDAI licence</strong> and a certified ASP (Authentication Service Provider) integration. Ensure your vendor credentials are configured in Settings.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── NACH Mandate tab ──────────────────────────────── */}
        {tab === 'NACH Mandate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SectionHeader
              title="NACH Auto-Debit Mandate"
              subtitle="Configure the National Automated Clearing House mandate for recurring repayments."
            />

            {/* Enable toggle */}
            <Card>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderBottom: '1px solid #F1F5F9',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', marginBottom: 2 }}>Enable NACH Mandate</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Applicant will be asked to register an auto-debit mandate during onboarding</div>
                </div>
                <Toggle value={nachEnabled} onChange={setNachEnabled} color="#22C55E" />
              </div>

              {nachEnabled && (
                <>
                  <MandateRow
                    label="Mandate Type"
                    value={mandateType}
                    onChange={setMandateType}
                    options={['E-NACH (Netbanking)', 'Physical NACH', 'UPI AutoPay', 'Debit Card Mandate']}
                  />
                  <MandateRow
                    label="Maximum Debit Amount"
                    value={maxAmount}
                    onChange={setMaxAmount}
                    options={['₹10,000', '₹25,000', '₹50,000', '₹1,00,000', '₹2,00,000']}
                  />
                  <MandateRow
                    label="Frequency"
                    value={frequency}
                    onChange={setFrequency}
                    options={['Monthly', 'Bi-monthly', 'Quarterly', 'Yearly']}
                  />
                  <MandateRow
                    label="Retry Policy"
                    value={retryPolicy}
                    onChange={setRetryPolicy}
                    options={['1 retry', '2 retries', '3 retries', 'No retries']}
                  />
                </>
              )}
            </Card>

            {nachEnabled && (
              <div style={{
                display: 'flex', gap: 10, padding: '12px 14px',
                backgroundColor: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0',
              }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="#16A34A" strokeWidth="1.3" />
                  <path d="M5 7.5l2 2 3-3" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p style={{ fontSize: 12, color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                  NACH mandate is registered during the onboarding journey. Repayment debits will be initiated according to the configured schedule after card issuance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Disclosures tab ───────────────────────────────── */}
        {tab === 'Disclosures' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SectionHeader
              title="Applicant Disclosures"
              subtitle="Select which consent checkboxes and disclosures are shown during the agreement step."
            />

            <Card>
              {disclosures.map(d => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  {/* checkbox preview */}
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${d.enabled ? '#3B82F6' : '#CBD5E1'}`,
                    backgroundColor: d.enabled ? '#3B82F6' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {d.enabled && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', marginBottom: 2 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{d.desc}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Show</span>
                    <Toggle value={d.enabled} onChange={v => updateDisc(d.id, v)} color="#22C55E" />
                  </div>
                </div>
              ))}

              {/* Remove last border visually */}
              <div style={{ padding: '12px 16px' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#3B82F6', fontSize: 13, fontWeight: 500, padding: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#3B82F6" strokeWidth="1.3" />
                    <path d="M7 4.5v5M4.5 7h5" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Add Disclosure
                </button>
              </div>
            </Card>

            <div style={{
              display: 'flex', gap: 10, padding: '12px 14px',
              backgroundColor: '#F0F9FF', borderRadius: 8, border: '1px solid #BAE6FD',
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#0EA5E9" strokeWidth="1.3" />
                <path d="M7.5 5v3.5M7.5 10v.5" stroke="#0EA5E9" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: 12, color: '#0369A1', margin: 0, lineHeight: 1.5 }}>
                Enabled disclosures will appear as checkboxes on the Agreement screen. The applicant must check each enabled disclosure before submitting the application.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{
        flexShrink: 0, padding: '12px 24px',
        borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22C55E' }} />
          <span style={{ fontSize: 12, color: '#64748B' }}>Changes auto-saved</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            fontSize: 13, fontWeight: 500, color: '#64748B',
            border: '1px solid #E2E8F0', borderRadius: 7,
            padding: '6px 16px', backgroundColor: '#fff', cursor: 'pointer',
          }}>
            Reset
          </button>
          <button style={{
            fontSize: 13, fontWeight: 500, color: '#fff',
            border: 'none', borderRadius: 7,
            padding: '6px 18px', backgroundColor: '#3B82F6', cursor: 'pointer',
          }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
