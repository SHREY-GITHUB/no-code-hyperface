import { useState, useRef } from 'react'

// ─── Shared primitives ────────────────────────────────────────────────────────

function Toggle({ enabled, onChange, colorOn = '#3B82F6' }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      style={{
        position: 'relative', width: 32, height: 18, borderRadius: 9,
        backgroundColor: enabled ? colorOn : '#CBD5E1',
        border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
        transition: 'background-color 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: 2, width: 14, height: 14,
        borderRadius: '50%', backgroundColor: '#fff',
        transform: enabled ? 'translateX(14px)' : 'translateX(0)',
        display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s',
      }} />
    </button>
  )
}

function SectionLabel({ children, style }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', margin: '0 0 6px', ...style }}>
      {children}
    </p>
  )
}

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: '#CBD5E1' }}>
      <circle cx="4.5" cy="3.5"  r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="3.5"  r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="7"    r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="7"    r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="10.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

// ─── Method icons ─────────────────────────────────────────────────────────────

function AadhaarIcon() {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2a3 3 0 100 6 3 3 0 000-6z" stroke="#EA580C" strokeWidth="1.3" />
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#EA580C" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M10 9.5l1.5 1.5-1.5 1.5" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function VideoKYCIcon() {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="4" width="9" height="8" rx="1.5" stroke="#16A34A" strokeWidth="1.3" />
        <path d="M10.5 6.5l4-2v7l-4-2V6.5z" stroke="#16A34A" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function DigiLockerIcon() {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="#2563EB" strokeWidth="1.3" />
        <path d="M5 5V4a3 3 0 016 0v1" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="8" cy="9.5" r="1" fill="#2563EB" />
        <path d="M8 10.5v1.5" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function ManualUploadIcon() {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 10V3M5 6l3-3 3 3" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12h12" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="2" y="12" width="12" height="2" rx="1" fill="#7C3AED" opacity="0.15" />
      </svg>
    </div>
  )
}

const METHOD_ICONS = {
  'Aadhaar OTP':   <AadhaarIcon />,
  'Video KYC':     <VideoKYCIcon />,
  'DigiLocker':    <DigiLockerIcon />,
  'Manual Upload': <ManualUploadIcon />,
}

const METHOD_DETAILS = {
  'Aadhaar OTP':   { recommended: true,  desc: 'Instant verification using Aadhaar-linked mobile OTP. Fastest method.' },
  'Video KYC':     { recommended: false, desc: 'Live video call with a KYC agent. Required for high credit limit cards above ₹5 lakh.' },
  'DigiLocker':    { recommended: false, desc: 'Fetch documents directly from government DigiLocker. No manual upload needed.' },
  'Manual Upload': { recommended: false, desc: 'Applicant uploads physical document photos. Slowest but most flexible.' },
}

// ─── KYC Method Tab ───────────────────────────────────────────────────────────

function KYCMethodTab({ kycMethods, setKycMethods }) {
  const [timing, setTiming] = useState('after')
  const [reverify30, setReverify30] = useState(true)
  const [reverifyMobile, setReverifyMobile] = useState(true)
  const [skipExisting, setSkipExisting] = useState(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  function toggleMethod(id) {
    setKycMethods((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m))
  }

  const TIMING_OPTIONS = [
    { id: 'before', label: 'Before Offer',           desc: 'Verify identity first, then show credit offer. Higher drop-off but cleaner compliance.' },
    { id: 'after',  label: 'After Offer Acceptance', desc: 'Show offer first, collect KYC only after applicant accepts. Lower drop-off.' },
  ]

  const REVERIFY_ROWS = [
    { label: 'Re-verify if applicant returns after 30 days', value: reverify30, set: setReverify30, info: null },
    { label: 'Re-verify if applicant changes mobile number', value: reverifyMobile, set: setReverifyMobile, info: null },
    {
      label: 'Skip KYC for existing verified customers',
      value: skipExisting,
      set: setSkipExisting,
      info: 'Applies only if applicant is already verified on another product from the same bank',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Sub-section A: Verification Method */}
      <div>
        <SectionLabel>Verification Method</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.6 }}>
          Choose how applicants verify their identity. You can enable multiple methods — applicants will see them in the order shown.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {kycMethods.map((method) => {
            const detail = METHOD_DETAILS[method.name]
            return (
              <div
                key={method.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${method.enabled ? '#E2E8F0' : '#F1F5F9'}`,
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: method.enabled ? 1 : 0.65,
                  transition: 'opacity 0.2s, border-color 0.2s',
                }}
              >
                <DragHandle />
                {METHOD_ICONS[method.name]}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{method.name}</span>
                    {detail.recommended && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: '#16A34A',
                        backgroundColor: '#DCFCE7', borderRadius: 4, padding: '2px 7px',
                      }}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                    {detail.desc}
                  </p>
                </div>
                <Toggle enabled={method.enabled} onChange={() => toggleMethod(method.id)} colorOn="#3B82F6" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Sub-section B: KYC Timing */}
      <div>
        <SectionLabel>When should KYC happen?</SectionLabel>
        <div className="settings-2col" style={{ gap: 10 }}>
          {TIMING_OPTIONS.map((opt) => {
            const active = timing === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setTiming(opt.id)}
                style={{
                  textAlign: 'left', padding: 16, borderRadius: 12,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: active ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                    display: 'inline-block', flexShrink: 0, backgroundColor: '#fff',
                    transition: 'border 0.15s',
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#1D4ED8' : '#1E293B' }}>
                    {opt.label}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, paddingLeft: 22, lineHeight: 1.5 }}>
                  {opt.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-section C: Re-verification Rules */}
      <div>
        <SectionLabel>Re-verification</SectionLabel>
        <div
          style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 12, overflow: 'hidden',
          }}
        >
          {REVERIFY_ROWS.map((row, idx) => (
            <div key={idx}>
              {idx > 0 && <div style={{ height: 1, backgroundColor: '#F1F5F9' }} />}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1 }}>
                  <span style={{ fontSize: 13, color: '#334155' }}>{row.label}</span>
                  {row.info && (
                    <div style={{ position: 'relative', display: 'inline-flex' }}>
                      <span
                        style={{ cursor: 'default', lineHeight: 0 }}
                        onMouseEnter={() => setTooltipVisible(true)}
                        onMouseLeave={() => setTooltipVisible(false)}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.5" stroke="#CBD5E1" strokeWidth="1.2" />
                          <path d="M7 6.5v3M7 4.5v.5" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </span>
                      {tooltipVisible && (
                        <div style={{
                          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                          transform: 'translateX(-50%)', width: 220,
                          backgroundColor: '#1E293B', color: '#F1F5F9',
                          fontSize: 11, lineHeight: 1.5, borderRadius: 7,
                          padding: '8px 10px', zIndex: 50, pointerEvents: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}>
                          {row.info}
                          <div style={{
                            position: 'absolute', top: '100%', left: '50%',
                            transform: 'translateX(-50%)',
                            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                            borderTop: '5px solid #1E293B',
                          }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Toggle enabled={row.value} onChange={() => row.set((v) => !v)} colorOn="#3B82F6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Vendor Settings Tab ──────────────────────────────────────────────────────

const VENDORS = [
  {
    id: 'idfy',
    name: 'IDfy',
    initials: 'ID',
    color: '#6366F1',
    bg: '#EEF2FF',
    desc: 'End-to-end KYC platform. Supports Aadhaar OTP, Video KYC, DigiLocker.',
    pills: ['Aadhaar OTP', 'Video KYC', 'DigiLocker'],
  },
  {
    id: 'signzy',
    name: 'Signzy',
    initials: 'SZ',
    color: '#0891B2',
    bg: '#ECFEFF',
    desc: 'Digital onboarding platform. Strong Video KYC capabilities.',
    pills: ['Video KYC', 'Manual Upload'],
  },
  {
    id: 'perfios',
    name: 'Perfios',
    initials: 'PF',
    color: '#D97706',
    bg: '#FFFBEB',
    desc: 'Financial data platform. Best for bank statement and income verification.',
    pills: ['DigiLocker', 'Manual Upload'],
  },
]

function VendorSettingsTab() {
  const [selectedVendor, setSelectedVendor] = useState('idfy')
  const [configuringVendor, setConfiguringVendor] = useState(null)
  const [creds, setCreds] = useState({ apiKey: '', clientId: '', env: 'sandbox' })
  const [testStatus, setTestStatus] = useState(null) // null | 'testing' | 'ok' | 'fail'

  function handleConfigure(vendorId) {
    setConfiguringVendor(configuringVendor === vendorId ? null : vendorId)
    setTestStatus(null)
  }

  function handleTestConnection() {
    setTestStatus('testing')
    setTimeout(() => setTestStatus('ok'), 1800)
  }

  return (
    <div>
      <SectionLabel>KYC Vendor</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {VENDORS.map((vendor) => {
          const isSelected = selectedVendor === vendor.id
          const isConfiguring = configuringVendor === vendor.id
          return (
            <div key={vendor.id}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${isSelected ? '#3B82F6' : '#E2E8F0'}`,
                  borderRadius: isConfiguring ? '12px 12px 0 0' : 12,
                  padding: 16,
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'border-color 0.15s',
                }}
              >
                {/* Radio */}
                <button
                  onClick={() => setSelectedVendor(vendor.id)}
                  style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    border: isSelected ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                    backgroundColor: '#fff', cursor: 'pointer', padding: 0,
                    transition: 'border 0.15s',
                  }}
                />

                {/* Logo */}
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  backgroundColor: vendor.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: vendor.color }}>{vendor.initials}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', margin: '0 0 3px' }}>{vendor.name}</p>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 7px', lineHeight: 1.4 }}>{vendor.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {vendor.pills.map((pill) => (
                      <span key={pill} style={{
                        fontSize: 10, fontWeight: 500, color: '#475569',
                        backgroundColor: '#F1F5F9', borderRadius: 4, padding: '2px 7px',
                      }}>
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Configure button */}
                <button
                  onClick={() => handleConfigure(vendor.id)}
                  style={{
                    fontSize: 12, fontWeight: 500, flexShrink: 0,
                    color: isConfiguring ? '#fff' : '#3B82F6',
                    backgroundColor: isConfiguring ? '#3B82F6' : 'transparent',
                    border: '1.5px solid #3B82F6', borderRadius: 7,
                    padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background-color 0.15s, color 0.15s',
                  }}
                >
                  {isConfiguring ? 'Close' : 'Configure'}
                </button>
              </div>

              {/* Credentials panel — inline below vendor card */}
              {isConfiguring && (
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #3B82F6',
                  borderTop: '1px solid #E2E8F0',
                  borderRadius: '0 0 12px 12px',
                  padding: '16px 20px 20px',
                }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    API Credentials — {vendor.name}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                    <CredInput
                      label="API Key"
                      type="password"
                      placeholder={`Enter your ${vendor.name} API key`}
                      value={creds.apiKey}
                      onChange={(v) => setCreds((c) => ({ ...c, apiKey: v }))}
                    />
                    <CredInput
                      label="Client ID"
                      placeholder={`Enter your ${vendor.name} Client ID`}
                      value={creds.clientId}
                      onChange={(v) => setCreds((c) => ({ ...c, clientId: v }))}
                    />
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Environment
                      </p>
                      <select
                        value={creds.env}
                        onChange={(e) => setCreds((c) => ({ ...c, env: e.target.value }))}
                        style={{
                          width: '100%', height: 34, borderRadius: 8,
                          border: '1.5px solid #E2E8F0', padding: '0 10px',
                          fontSize: 13, color: '#1E293B', fontFamily: 'inherit',
                          backgroundColor: '#fff', outline: 'none', cursor: 'pointer',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      >
                        <option value="sandbox">Sandbox</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing'}
                      style={{
                        fontSize: 13, fontWeight: 600, color: testStatus === 'ok' ? '#16A34A' : '#fff',
                        backgroundColor: testStatus === 'ok' ? '#DCFCE7' : testStatus === 'fail' ? '#FEE2E2' : '#22C55E',
                        border: 'none', borderRadius: 8, padding: '7px 14px',
                        cursor: testStatus === 'testing' ? 'default' : 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: 6,
                        opacity: testStatus === 'testing' ? 0.7 : 1,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {testStatus === 'testing' ? (
                        <><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} /> Testing…</>
                      ) : testStatus === 'ok' ? (
                        <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> Connected</>
                      ) : (
                        'Test Connection'
                      )}
                    </button>
                    <button style={{
                      fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: '#3B82F6',
                      border: 'none', borderRadius: 8, padding: '7px 14px',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      Save Credentials
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info banner */}
      <div style={{
        padding: '11px 14px', backgroundColor: '#FEFCE8',
        border: '1px solid #FDE68A', borderRadius: 8,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6.5" stroke="#CA8A04" strokeWidth="1.2" />
          <path d="M7 6v4M7 4.5v.5" stroke="#CA8A04" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
          Hyperface has pre-integrated all vendors above. Select your vendor and enter API credentials to activate. No code required.
        </p>
      </div>
    </div>
  )
}

function CredInput({ label, placeholder, value, onChange, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 34, borderRadius: 8,
          border: `1.5px solid ${focused ? '#3B82F6' : '#E2E8F0'}`,
          padding: '0 10px', fontSize: 13, color: '#1E293B',
          fontFamily: 'inherit', outline: 'none', backgroundColor: '#fff',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'kyc-method',      label: 'KYC Method' },
  { key: 'vendor-settings', label: 'Vendor Settings' },
]

export default function KYCVerificationSettings({ kycMethods, setKycMethods }) {
  const [activeTab, setActiveTab] = useState('kyc-method')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
            KYC Verification
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
            Configure how applicant identity is verified before card issuance
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 24 }}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key
            return (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? '#3B82F6' : '#64748B',
                background: 'none', border: 'none',
                borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                padding: '0 4px 10px', marginRight: 24, cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s', fontFamily: 'inherit',
              }}>
                {label}
              </button>
            )
          })}
        </div>

        {/* Tab body */}
        <div style={{ paddingBottom: 28 }}>
          {activeTab === 'kyc-method'      && <KYCMethodTab kycMethods={kycMethods} setKycMethods={setKycMethods} />}
          {activeTab === 'vendor-settings' && <VendorSettingsTab />}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Changes are saved automatically</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ fontSize: 13, fontWeight: 500, color: '#64748B', background: 'none', border: '1px solid #CBD5E1', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Reset to Default
          </button>
          <button style={{ fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: '#3B82F6', border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Save Stage
          </button>
        </div>
      </div>
    </div>
  )
}
