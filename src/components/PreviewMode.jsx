import { useState, useEffect } from 'react'

// ─── Client data ───────────────────────────────────────────────────────────────

const CLIENT_DATA = {
  hdfc: {
    name: 'HDFC Millenia Card Program',
    bankName: 'HDFC Bank',
    cardName: 'Millenia Credit Card',
    logoText: 'HDFC',
    logoColor: '#1D4ED8',
    urlSlug: 'hdfc-millenia-credit-card',
    creditLimit: '₹3,00,000',
    cardVariant: 'Millenia Gold',
    interestRate: '3.5% per month',
  },
  slice: {
    name: 'Slice Student Credit Card',
    bankName: 'Slice',
    cardName: 'Student Credit Card',
    logoText: 'SL',
    logoColor: '#7C3AED',
    urlSlug: 'slice-student-credit-card',
    creditLimit: '₹50,000',
    cardVariant: 'Student Starter',
    interestRate: '2.9% per month',
  },
  jupiter: {
    name: 'Jupiter Edge Card',
    bankName: 'Jupiter',
    cardName: 'Edge Card',
    logoText: 'JUP',
    logoColor: '#0F766E',
    urlSlug: 'jupiter-edge-card',
    creditLimit: '₹1,50,000',
    cardVariant: 'Edge Rewards',
    interestRate: '3.2% per month',
  },
}

// ─── Dummy field data ──────────────────────────────────────────────────────────

const DUMMY = {
  'Full Name':       'Rahul Sharma',
  'PAN Number':      'ABCDE1234F',
  'Date of Birth':   '15 / 03 / 1990',
  'Mobile Number':   '98765 43210',
  'Employment Type': 'Salaried',
  'Monthly Income':  '75,000',
}

const OTP_DIGITS = ['4', '8', '2', '9', '1', '6']

function getAgreementText(client) {
  return `MOST IMPORTANT TERMS AND CONDITIONS — ${client.cardName.toUpperCase()}

1. CREDIT LIMIT
The credit limit assigned to your ${client.cardName} may be revised at the sole discretion of ${client.bankName} based on your repayment behaviour and credit profile.

2. INTEREST RATE
${client.interestRate} applicable on revolving credit. Interest charged from date of transaction if total outstanding is not paid by due date.

3. MINIMUM AMOUNT DUE
You are required to pay a minimum of 5% of total outstanding or ₹200 (whichever is higher) by the payment due date each month.

4. LATE PAYMENT CHARGES
A late payment fee will be levied by ${client.bankName} if the minimum amount due is not received by the payment due date.

5. CASH ADVANCE CHARGES
Cash withdrawals attract a fee of 2.5% (minimum ₹500) of the withdrawn amount from the date of transaction.

6. ANNUAL FEE
Annual membership fee waived if annual retail spends on your ${client.cardVariant} exceed the specified threshold.

7. REWARDS
Earn reward points on eligible spends with your ${client.cardVariant}. Points redeemable at participating merchants.

8. DISPUTES
Any dispute must be raised within 30 days of the statement date.

9. GOVERNING LAW
This agreement shall be governed by the laws of India.`
}

// ─── Shared primitives ─────────────────────────────────────────────────────────

function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ padding: '8px 20px 6px', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Step {step} of {total}</span>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>{pct}%</span>
      </div>
      <div style={{ height: 3, backgroundColor: '#E2E8F0', borderRadius: 99 }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 99,
          backgroundColor: '#3B82F6', transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

function BankHeader({ client }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px 6px', flexShrink: 0 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, backgroundColor: client.logoColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontSize: 8, fontWeight: 900, letterSpacing: '0.06em' }}>
          {client.logoText}
        </span>
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
          {client.cardName}
        </p>
        <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{client.bankName}</p>
      </div>
    </div>
  )
}

function PrimaryBtn({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height: 50, borderRadius: 14, border: 'none',
        backgroundColor: disabled ? '#E2E8F0' : '#3B82F6',
        color: disabled ? '#94A3B8' : '#fff',
        fontSize: 15, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = '#2563EB' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = '#3B82F6' }}
    >
      {label}
    </button>
  )
}

// ─── Phone chrome ──────────────────────────────────────────────────────────────

function DynamicIsland() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 2, flexShrink: 0 }}>
      <div style={{ width: 126, height: 36, backgroundColor: '#000', borderRadius: 20 }} />
    </div>
  )
}

function StatusBar() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 22px 2px', flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0"    y="6"   width="3"   height="5"    rx="0.8" fill="#0F172A" />
          <rect x="5"    y="4"   width="3"   height="7"    rx="0.8" fill="#0F172A" />
          <rect x="10"   y="1.5" width="3"   height="9.5"  rx="0.8" fill="#0F172A" />
          <rect x="14.5" y="0"   width="2.5" height="11"   rx="0.8" fill="#0F172A" opacity="0.25" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M1 4.5C3.5 2 11.5 2 14 4.5"   stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <path d="M3.2 7C4.8 5.4 10.2 5.4 11.8 7" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M5.5 9.5C6.3 8.7 8.7 8.7 9.5 9.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7.5" cy="11" r="0.8" fill="#0F172A" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 22, height: 11, borderRadius: 3, border: '1.2px solid #0F172A', padding: '1.5px 1.5px', display: 'flex' }}>
            <div style={{ width: '82%', backgroundColor: '#0F172A', borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, backgroundColor: '#0F172A', borderRadius: 1, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  )
}

function HomeIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px', flexShrink: 0 }}>
      <div style={{ width: 134, height: 5, borderRadius: 3, backgroundColor: '#000', opacity: 0.18 }} />
    </div>
  )
}

// ─── SCREEN 1: Application Form (multi-page aware) ────────────────────────────

function Screen1({ fields, client, onNext }) {
  const visible = fields.filter(f => f.show)
  const formPages = [...new Set(visible.map(f => f.page ?? 1))].sort((a, b) => a - b)
  const totalFormPages = Math.max(1, ...formPages)
  const [formPage, setFormPage] = useState(1)

  const currentFields = visible.filter(f => (f.page ?? 1) === formPage)

  function handleContinue() {
    if (formPage < totalFormPages) {
      setFormPage(p => p + 1)
    } else {
      onNext()
    }
  }

  const TITLES = {
    1: 'Tell us about yourself',
    2: 'Identity & income details',
    3: 'Additional information',
    4: 'Final details',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      <BankHeader client={client} />
      <ProgressBar step={1} total={4} />

      {/* Sub-page indicator (only when multiple form pages) */}
      {totalFormPages > 1 && (
        <div style={{ padding: '6px 20px 0', display: 'flex', gap: 4 }}>
          {Array.from({ length: totalFormPages }, (_, i) => i + 1).map(p => (
            <div key={p} style={{
              flex: 1, height: 3, borderRadius: 2,
              backgroundColor: p <= formPage ? '#3B82F6' : '#E2E8F0',
              transition: 'background-color 0.3s',
            }} />
          ))}
        </div>
      )}

      <div style={{ padding: '8px 20px 28px' }}>
        {totalFormPages > 1 && (
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', margin: '4px 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Part {formPage} of {totalFormPages}
          </p>
        )}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '4px 0 3px' }}>
          {TITLES[formPage] ?? 'Tell us about yourself'}
        </h2>
        <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 18px' }}>
          Fill in your details to continue
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 24 }}>
          {currentFields.length === 0 ? (
            <p style={{ fontSize: 13, color: '#CBD5E1', textAlign: 'center', padding: '20px 0' }}>
              No fields on this page
            </p>
          ) : (
            currentFields.map(field => (
              <FieldRow key={field.id} field={field} />
            ))
          )}
        </div>

        <PrimaryBtn
          label={formPage < totalFormPages ? 'Next →' : 'Continue →'}
          onClick={handleContinue}
        />

        {formPage > 1 && (
          <button
            onClick={() => setFormPage(p => p - 1)}
            style={{
              width: '100%', marginTop: 10, padding: '10px 0', border: 'none',
              background: 'none', fontSize: 13, color: '#94A3B8', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

function FieldRow({ field }) {
  const val = DUMMY[field.name] ?? ''
  const isHighlighted = field.name === 'Mobile Number' || field.name === 'PAN Number'

  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 600, color: '#64748B', margin: '0 0 5px',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {field.name}
        {field.required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
      </p>

      {field.type === 'Dropdown' ? (
        <div style={{
          height: 46, borderRadius: 12, border: '1.5px solid #E2E8F0',
          backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 14px',
        }}>
          <span style={{ fontSize: 15, color: '#1E293B' }}>{val || 'Select…'}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div style={{
          height: 46, borderRadius: 12,
          border: `1.5px solid ${isHighlighted ? '#3B82F6' : '#E2E8F0'}`,
          backgroundColor: isHighlighted ? '#EFF6FF' : '#F8FAFC',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 14px',
        }}>
          <span style={{ fontSize: 15, color: '#1E293B' }}>{val}</span>
          {isHighlighted && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#2563EB',
              backgroundColor: '#DBEAFE', borderRadius: 4, padding: '2px 7px',
            }}>
              {field.name === 'Mobile Number' ? 'OTP Sent' : 'Verified'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── SCREEN 2: Bureau & Decisioning ───────────────────────────────────────────

const BUREAU_STEPS = [
  'Fetching your bureau report…',
  'Applying decisioning rules…',
]

function Screen2({ client, demoControls, onNext }) {
  const [step, setStep] = useState(0)
  // 0=fetching, 1=applying rules, 2=all done, 3=show offer/outcome

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200)
    const t2 = setTimeout(() => setStep(2), 2400)
    const t3 = setTimeout(() => setStep(3), 3300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      <BankHeader client={client} />
      <ProgressBar step={2} total={4} />
      <div style={{ padding: '8px 20px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '4px 0 3px' }}>
          Checking your eligibility
        </h2>
        <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 22px' }}>
          Hang tight, this takes just a moment
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <BureauRow label={BUREAU_STEPS[0]} done={step >= 1} active={step === 0} pending={false} />
          <BureauRow label={BUREAU_STEPS[1]} done={step >= 2} active={step === 1} pending={step < 1} />
        </div>

        {step >= 3 && (
          <div style={{ animation: 'fadeSlideUp 0.4s ease' }}>
            {demoControls.bureauFailure   && <BureauFailureCard />}
            {demoControls.manualReview    && <ManualReviewCard />}
            {demoControls.lowScoreDecline && <DeclineCard />}
            {!demoControls.bureauFailure && !demoControls.manualReview && !demoControls.lowScoreDecline && (
              <ApprovalCard client={client} onNext={onNext} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BureauRow({ label, done, active, pending }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      backgroundColor: done ? '#F0FDF4' : pending ? '#F8FAFC' : '#EFF6FF',
      border: `1px solid ${done ? '#BBF7D0' : pending ? '#F1F5F9' : '#BFDBFE'}`,
      borderRadius: 10, transition: 'all 0.35s ease',
    }}>
      {done ? (
        <div style={{
          width: 24, height: 24, borderRadius: '50%', backgroundColor: '#22C55E',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          animation: 'scaleIn 0.25s ease',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="20" strokeDashoffset="0"
              style={{ animation: 'checkDraw 0.3s ease forwards' }}
            />
          </svg>
        </div>
      ) : (
        <div style={{
          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
          border: `2.5px solid ${pending ? '#E2E8F0' : '#BFDBFE'}`,
          borderTopColor: pending ? '#E2E8F0' : '#3B82F6',
          animation: active ? 'spin 0.85s linear infinite' : 'none',
        }} />
      )}
      <span style={{
        fontSize: 13, fontWeight: done ? 500 : 400,
        color: done ? '#15803D' : pending ? '#94A3B8' : '#1E40AF',
      }}>
        {label}
      </span>
    </div>
  )
}

function ApprovalCard({ client, onNext }) {
  return (
    <div style={{
      backgroundColor: '#F0FDF4', border: '1.5px solid #86EFAC',
      borderRadius: 16, padding: 20, marginBottom: 4,
    }}>
      <p style={{ fontSize: 21, fontWeight: 700, color: '#16A34A', margin: '0 0 4px' }}>
        🎉 You're pre-approved!
      </p>
      <p style={{ fontSize: 13, color: '#15803D', margin: '0 0 18px' }}>
        Based on your profile, here is your offer
      </p>
      <div style={{
        backgroundColor: '#fff', borderRadius: 12,
        border: '1px solid #BBF7D0', overflow: 'hidden', marginBottom: 18,
      }}>
        {[
          ['Credit Limit', client.creditLimit],
          ['Interest Rate', client.interestRate],
          ['Card Variant', client.cardVariant],
        ].map(([label, value], i) => (
          <div key={i}>
            {i > 0 && <div style={{ height: 1, backgroundColor: '#F0FDF4' }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>
      <PrimaryBtn label="Accept Offer →" onClick={onNext} />
      <button style={{
        width: '100%', marginTop: 12, background: 'none', border: 'none',
        fontSize: 13, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit',
      }}>
        View full offer details
      </button>
    </div>
  )
}

function BureauFailureCard() {
  return (
    <div style={{
      backgroundColor: '#FEF2F2', border: '1.5px solid #FECACA',
      borderRadius: 16, padding: 20, textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', backgroundColor: '#FEE2E2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', animation: 'scaleIn 0.3s ease',
      }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M8 8l10 10M18 8L8 18" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#DC2626', margin: '0 0 8px' }}>
        Bureau Check Failed
      </p>
      <p style={{ fontSize: 13, color: '#991B1B', margin: '0 0 18px', lineHeight: 1.6 }}>
        We were unable to fetch your bureau report. Please try again.
      </p>
      <PrimaryBtn label="Try Again" onClick={() => {}} />
      <button style={{
        width: '100%', marginTop: 10, background: 'none', border: 'none',
        fontSize: 13, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit',
      }}>
        Contact Support
      </button>
    </div>
  )
}

function ManualReviewCard() {
  return (
    <div style={{
      backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A',
      borderRadius: 16, padding: 20, textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', backgroundColor: '#FEF3C7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', animation: 'scaleIn 0.3s ease',
      }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="10" stroke="#D97706" strokeWidth="2" />
          <path d="M13 7v6l4 2" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#B45309', margin: '0 0 8px' }}>
        Application Under Review
      </p>
      <p style={{ fontSize: 13, color: '#92400E', margin: '0 0 18px', lineHeight: 1.6 }}>
        Your application has been referred for manual review. Our team will contact you within 48 hours.
      </p>
      <div style={{
        backgroundColor: '#FEF3C7', borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="#D97706" strokeWidth="1.3" />
          <path d="M7 4v3.5M7 9v.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 12, color: '#92400E' }}>
          Reference: MR-{Math.random().toString(36).substr(2,8).toUpperCase()}
        </span>
      </div>
      <button style={{
        width: '100%', height: 50, borderRadius: 14,
        border: '1.5px solid #D97706', backgroundColor: 'transparent',
        color: '#B45309', fontSize: 15, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        Track Application Status
      </button>
    </div>
  )
}

function DeclineCard() {
  return (
    <div style={{
      backgroundColor: '#FEF2F2', border: '1.5px solid #FECACA',
      borderRadius: 16, padding: 20,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', backgroundColor: '#FEE2E2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', animation: 'scaleIn 0.3s ease',
      }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M13 3a10 10 0 100 20A10 10 0 0013 3z" stroke="#DC2626" strokeWidth="2" />
          <path d="M9 13h8" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#DC2626', margin: '0 0 6px', textAlign: 'center' }}>
        Application Not Approved
      </p>
      <p style={{ fontSize: 13, color: '#991B1B', margin: '0 0 16px', lineHeight: 1.6, textAlign: 'center' }}>
        We're unable to approve your application at this time.
      </p>
      <div style={{
        backgroundColor: '#fff', border: '1px solid #FECACA',
        borderRadius: 10, padding: '12px 14px', marginBottom: 16,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Adverse Action Notice
        </p>
        <p style={{ fontSize: 11.5, color: '#7F1D1D', margin: 0, lineHeight: 1.65 }}>
          This decision was based on information in your credit report. You have the right to obtain a free copy of your credit report from the bureau used for this decision.
        </p>
      </div>
      <button style={{
        width: '100%', height: 46, borderRadius: 12,
        border: '1.5px solid #E2E8F0', backgroundColor: '#fff',
        color: '#64748B', fontSize: 14, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        View Credit Report
      </button>
    </div>
  )
}

// ─── SCREEN 3: KYC ────────────────────────────────────────────────────────────

const KYC_ICONS = {
  'Aadhaar OTP': {
    bg: '#FFF7ED',
    svg: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3.5a4 4 0 100 8 4 4 0 000-8z" stroke="#EA580C" strokeWidth="1.5" />
        <path d="M3.5 19.5c0-4 3.36-6.5 7.5-6.5s7.5 2.5 7.5 6.5" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  'Video KYC': {
    bg: '#F0FDF4',
    svg: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="6.5" width="12" height="9" rx="2" stroke="#16A34A" strokeWidth="1.5" />
        <path d="M14 9l6-2.5v7L14 11V9z" stroke="#16A34A" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  'DigiLocker': {
    bg: '#EFF6FF',
    svg: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="8" width="16" height="12" rx="2" stroke="#2563EB" strokeWidth="1.5" />
        <path d="M7.5 8V7a3.5 3.5 0 017 0v1" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="14" r="1.5" fill="#2563EB" />
        <path d="M11 15.5V18" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  'Manual Upload': {
    bg: '#F5F3FF',
    svg: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 15V5M7 9l4-4 4 4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18h16" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
}

function Screen3_KYC({ kycMethods, client, onSelectMethod }) {
  const enabled = kycMethods.filter(m => m.enabled)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      <BankHeader client={client} />
      <ProgressBar step={3} total={4} />
      <div style={{ padding: '8px 20px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '4px 0 3px' }}>
          Verify your identity
        </h2>
        <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 20px' }}>
          Quick and secure — takes less than 2 minutes
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {enabled.length === 0 && (
            <p style={{ fontSize: 13, color: '#CBD5E1', textAlign: 'center', padding: '32px 0' }}>
              No verification methods are enabled
            </p>
          )}
          {enabled.map(method => {
            const icon = KYC_ICONS[method.name]
            return (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 14, border: '1.5px solid #E2E8F0', backgroundColor: '#F8FAFC',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.backgroundColor = '#EFF6FF' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#F8FAFC' }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12, backgroundColor: icon?.bg ?? '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {icon?.svg}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', margin: '0 0 2px' }}>{method.name}</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>{method.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN 3b: Aadhaar OTP ───────────────────────────────────────────────────

function Screen3_OTP({ client, onVerified }) {
  const [status, setStatus] = useState('idle') // idle | verifying | done

  function handleVerify() {
    setStatus('verifying')
    setTimeout(() => {
      setStatus('done')
      setTimeout(onVerified, 900)
    }, 1500)
  }

  if (status === 'done') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', flex: 1,
        alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', backgroundColor: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          animation: 'springIn 0.5s ease-out',
          boxShadow: '0 0 0 14px #F0FDF4',
        }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <path
              d="M7 19l8 8L31 11"
              stroke="#16A34A" strokeWidth="3.2"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="60" strokeDashoffset="0"
              style={{ animation: 'checkDraw 0.4s ease 0.2s both' }}
            />
          </svg>
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#16A34A', margin: 0 }}>OTP Verified!</p>
        <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 0' }}>Proceeding to next step…</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      <BankHeader client={client} />
      <ProgressBar step={3} total={4} />
      <div style={{ padding: '8px 20px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '4px 0 8px' }}>
          Enter Aadhaar OTP
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 28px', lineHeight: 1.65 }}>
          A 6-digit OTP has been sent to the mobile number linked with Aadhaar XXXX-XXXX-8742
        </p>

        <div style={{ display: 'flex', gap: 9, justifyContent: 'center', marginBottom: 28 }}>
          {OTP_DIGITS.map((digit, i) => (
            <div key={i} style={{
              width: 46, height: 56, borderRadius: 12,
              border: '2px solid #3B82F6', backgroundColor: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#1D4ED8',
            }}>
              {status === 'verifying' ? '•' : digit}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <PrimaryBtn
            label={status === 'verifying' ? 'Verifying…' : 'Verify OTP'}
            onClick={handleVerify}
            disabled={status === 'verifying'}
          />
        </div>
        <button style={{
          width: '100%', background: 'none', border: 'none',
          fontSize: 13, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0',
        }}>
          Resend OTP
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 4: Agreement ──────────────────────────────────────────────────────

function Screen4({ client, onSubmit }) {
  const [terms, setTerms] = useState(false)
  const [nach, setNach] = useState(false)
  const canSubmit = terms && nach

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      <BankHeader client={client} />
      <ProgressBar step={4} total={4} />
      <div style={{ padding: '8px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '4px 0 3px' }}>
            Almost done!
          </h2>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
            Review and sign your card agreement
          </p>
        </div>

        <div style={{
          height: 200, overflowY: 'auto', backgroundColor: '#F8FAFC',
          border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '14px 16px',
        }}>
          <pre style={{
            fontSize: 11.5, color: '#475569', margin: 0,
            whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.75,
          }}>
            {getAgreementText(client)}
          </pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CheckRow
            checked={terms} onChange={() => setTerms(v => !v)}
            label="I have read and agree to the Terms and Conditions"
          />
          <CheckRow
            checked={nach} onChange={() => setNach(v => !v)}
            label={`I authorise ${client.bankName} to debit my account for EMI payments via NACH`}
          />
        </div>

        <div>
          <PrimaryBtn label="Submit Application" onClick={onSubmit} disabled={!canSubmit} />
          {!canSubmit && (
            <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', margin: '8px 0 0' }}>
              Accept both declarations above to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckRow({ checked, onChange, label }) {
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
        padding: '12px 14px', borderRadius: 10,
        backgroundColor: checked ? '#EFF6FF' : '#F8FAFC',
        border: `1.5px solid ${checked ? '#3B82F6' : '#E2E8F0'}`,
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: `2px solid ${checked ? '#3B82F6' : '#CBD5E1'}`,
        backgroundColor: checked ? '#3B82F6' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, userSelect: 'none' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Success Screen ────────────────────────────────────────────────────────────

function SuccessScreen({ client, onClose }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1,
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', textAlign: 'center',
      background: 'linear-gradient(170deg, #F0FDF4 0%, #fff 55%)',
    }}>
      <div style={{
        width: 92, height: 92, borderRadius: '50%', backgroundColor: '#DCFCE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
        animation: 'springIn 0.5s ease-out',
        boxShadow: '0 0 0 16px #F0FDF4, 0 0 0 30px rgba(34,197,94,0.06)',
      }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path
            d="M8 22l10 10L36 12"
            stroke="#16A34A" strokeWidth="3.8"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="60" strokeDashoffset="0"
            style={{ animation: 'checkDraw 0.5s ease 0.3s both' }}
          />
        </svg>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#16A34A', margin: '0 0 8px' }}>
        Application Submitted!
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 22px', lineHeight: 1.65, maxWidth: 300 }}>
        Your {client.cardName} application is under review
      </p>

      <div style={{
        backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0',
        borderRadius: 10, padding: '10px 22px', marginBottom: 14,
      }}>
        <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 3px' }}>Reference Number</p>
        <p style={{
          fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0,
          fontFamily: 'ui-monospace, "Cascadia Code", monospace', letterSpacing: '0.06em',
        }}>
          REF: HYP-2024-847291
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 30px', lineHeight: 1.65, maxWidth: 280 }}>
        You will receive a decision within 24 hours via SMS and email
      </p>

      <button
        onClick={onClose}
        style={{
          width: '100%', maxWidth: 340, height: 50, borderRadius: 14,
          border: '1.5px solid #E2E8F0', backgroundColor: '#fff',
          color: '#64748B', fontSize: 15, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff' }}
      >
        Return to Home
      </button>
    </div>
  )
}

// ─── Device shells ─────────────────────────────────────────────────────────────

function PhoneShell({ children }) {
  return (
    <div style={{
      width: 390, height: 780,
      borderRadius: 44,
      border: '10px solid #1E293B',
      boxShadow: '0 0 0 1px #0F172A, 0 32px 80px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.06)',
      backgroundColor: '#fff',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <DynamicIsland />
      <StatusBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
      <HomeIndicator />
    </div>
  )
}

function DesktopShell({ client, children }) {
  return (
    <div style={{
      width: 920, height: 680,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
      display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.09)',
      flexShrink: 0,
    }}>
      {/* Browser chrome */}
      <div style={{
        backgroundColor: '#1E293B', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#EF4444', '#F59E0B', '#22C55E'].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex: 1, height: 28, backgroundColor: '#0F172A', borderRadius: 6,
          display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7,
        }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM1 5.5h9M5.5 1C4 3 3.25 4.2 3.25 5.5S4 8 5.5 10M5.5 1C7 3 7.75 4.2 7.75 5.5S7 8 5.5 10" stroke="#475569" strokeWidth="1.1" />
          </svg>
          <span style={{ fontSize: 11, color: '#475569' }}>
            apply.hyperface.io/{client.urlSlug}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22C55E' }} />
            <span style={{ fontSize: 10, color: '#22C55E' }}>Secure</span>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div style={{
        flex: 1, backgroundColor: '#F1F5F9',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: '28px 24px',
      }}>
        <div style={{
          width: '100%', maxWidth: 540,
          backgroundColor: '#fff', borderRadius: 16,
          border: '1px solid #E2E8F0', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({ device, setDevice, onClose, client }) {
  return (
    <div style={{
      height: 52, backgroundColor: '#0F172A',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0,
    }}>
      <button
        onClick={onClose}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#fff', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
          padding: 0, opacity: 0.9,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1 }}
        onMouseLeave={e => { e.currentTarget.style.opacity = 0.9 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11.5 4L6.5 9l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Exit Preview
      </button>

      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, fontWeight: 400 }}>
        Applicant Preview — {client.name}
      </p>

      <div style={{
        display: 'flex', gap: 3,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 9, padding: 3,
      }}>
        {[
          { label: 'Mobile',  key: 'mobile' },
          { label: 'Desktop', key: 'desktop' },
        ].map(({ label, key }) => {
          const active = device === key
          return (
            <button
              key={key}
              onClick={() => setDevice(key)}
              style={{
                padding: '5px 14px', borderRadius: 7, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                backgroundColor: active ? '#3B82F6' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Banner() {
  return (
    <div style={{
      backgroundColor: '#78350F',
      borderBottom: '1px solid #92400E',
      padding: '7px 20px',
      display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5L13 12.5H1L7 1.5z" fill="#FCD34D" />
        <path d="M7 5.5v3.5" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7" cy="10.5" r="0.7" fill="#78350F" />
      </svg>
      <span style={{ fontSize: 12, color: '#FDE68A', fontWeight: 500 }}>
        Preview Mode — This is a simulation using dummy data. No real bureau pull or KYC will occur.
      </span>
    </div>
  )
}

// ─── Root export ───────────────────────────────────────────────────────────────

// Map stage name → screen number
const STAGE_SCREEN = {
  'Application Form':    1,
  'Bureau & Decisioning': 2,
  'KYC Verification':    3,
  'Agreement & Consent': 4,
}

export default function PreviewMode({ fields, kycMethods, stages, clientId = 'hdfc', demoControls = {}, onClose }) {
  const client = CLIENT_DATA[clientId] ?? CLIENT_DATA.hdfc

  // Derive which screen numbers are enabled from stages prop (default: all enabled)
  const enabledScreens = stages
    ? stages.filter(s => s.enabled).map(s => STAGE_SCREEN[s.name]).filter(Boolean)
    : [1, 2, 3, 4]

  const [device, setDevice]         = useState('mobile')
  const [screen, setScreen]         = useState(enabledScreens[0] ?? 1)
  const [kycSubScreen, setKyc]      = useState(null) // null | 'otp'
  const [showSuccess, setSuccess]   = useState(false)
  const [screenKey, setScreenKey]   = useState(0)
  const [departingEl, setDeparting] = useState(null)
  const [departingKey, setDepKey]   = useState(0)

  /* Navigate with dual slide: outgoing slides left, incoming slides in from right */
  function navigate(fn) {
    setDeparting(renderScreen())   // snapshot current screen JSX
    setDepKey(k => k + 1)          // new key forces re-mount → re-triggers animation
    fn()
    setScreenKey(k => k + 1)
  }

  /* Advance to next enabled screen */
  function next() {
    navigate(() => {
      setScreen(cur => {
        const nextEnabled = enabledScreens.filter(n => n > cur)
        return nextEnabled.length > 0 ? nextEnabled[0] : cur + 1
      })
    })
  }

  function handleKycMethod(name) {
    if (name === 'Aadhaar OTP') navigate(() => setKyc('otp'))
    else next()
  }

  function handleOTPVerified() {
    navigate(() => { setKyc(null); setScreen(s => { const ne = enabledScreens.filter(n => n > 3); return ne[0] ?? 4 }) })
  }

  function handleSubmit() {
    navigate(() => setSuccess(true))
  }

  function renderScreen() {
    if (showSuccess) return <SuccessScreen client={client} onClose={onClose} />
    if (screen === 1) return <Screen1 fields={fields} client={client} onNext={next} />
    if (screen === 2) return <Screen2 client={client} demoControls={demoControls} onNext={next} />
    if (screen === 3) {
      if (kycSubScreen === 'otp') return <Screen3_OTP client={client} onVerified={handleOTPVerified} />
      return <Screen3_KYC kycMethods={kycMethods} client={client} onSelectMethod={handleKycMethod} />
    }
    if (screen === 4) return <Screen4 client={client} onSubmit={handleSubmit} />
    return null
  }

  /*
   * IMPORTANT: do NOT extract this into a function component defined inside
   * PreviewMode — that causes React to see a new component type every render
   * and unmount/remount the entire subtree, killing CSS animations mid-frame.
   * Keep it as plain JSX evaluated inline.
   */
  const screenSlider = (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      {/* Departing screen — slides out to the left */}
      {departingEl && (
        <div
          key={departingKey}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            backgroundColor: '#fff',
            animation: 'slideOutToLeft 0.28s cubic-bezier(0.4,0,0.2,1) forwards',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            zIndex: 1,
          }}
          onAnimationEnd={() => setDeparting(null)}
        >
          {departingEl}
        </div>
      )}
      {/* Incoming screen — slides in from the right */}
      <div
        key={screenKey}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          animation: screenKey === 0 ? 'none' : 'slideInFromRight 0.28s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {renderScreen()}
      </div>
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#0A1628',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
    }}>
      <TopBar device={device} setDevice={setDevice} onClose={onClose} client={client} />
      <Banner />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflow: 'auto', padding: '28px 24px',
      }}>
        {device === 'mobile' ? (
          <PhoneShell>{screenSlider}</PhoneShell>
        ) : (
          <DesktopShell client={client}>{screenSlider}</DesktopShell>
        )}
      </div>
    </div>
  )
}
