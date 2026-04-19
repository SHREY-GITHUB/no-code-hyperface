import { useState } from 'react'

// ─── Shared primitives ───────────────────────────────────────────────

function Toggle({ enabled, onChange, colorOn = '#3B82F6' }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      style={{
        position: 'relative',
        width: 32,
        height: 18,
        borderRadius: 9,
        backgroundColor: enabled ? colorOn : '#CBD5E1',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        transition: 'background-color 0.2s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transform: enabled ? 'translateX(14px)' : 'translateX(0)',
          display: 'block',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
        }}
      />
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', margin: '0 0 10px' }}>
      {children}
    </p>
  )
}

// ─── Bureau Config tab ───────────────────────────────────────────────

const BUREAUS = [
  { id: 'CIBIL',      desc: 'Most widely used in India. Score range 300–900.' },
  { id: 'Experian',   desc: 'Strong alternative bureau. Score range 300–850.' },
  { id: 'Equifax',    desc: 'Growing adoption in India. Score range 1–999.' },
  { id: 'CRIF High Mark', desc: 'Specialist in MSME and thin file profiles.' },
]

const PULL_TYPES = [
  {
    id: 'soft',
    label: 'Soft Pull',
    desc: 'Pre-qualification check. Does not impact applicant\'s credit score. Recommended for initial screening.',
  },
  {
    id: 'hard',
    label: 'Hard Pull',
    desc: 'Full credit check. Impacts applicant\'s score. Use only after applicant intent is confirmed.',
  },
]

function BureauConfigTab() {
  const [selectedBureau, setSelectedBureau] = useState('CIBIL')
  const [fallbackBureau, setFallbackBureau] = useState('Experian')
  const [ntcPolicy, setNtcPolicy] = useState('review')
  const [pullType, setPullType] = useState('soft')
  const [thresholds, setThresholds] = useState({
    approve: 750,
    manualLow: 650,
    manualHigh: 749,
    decline: 649,
  })

  function updateThreshold(key, val) {
    const num = parseInt(val, 10)
    if (!isNaN(num)) setThresholds((t) => ({ ...t, [key]: num }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Sub-section A: Bureau Provider */}
      <div>
        <SectionLabel>Bureau Provider</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {BUREAUS.map((b) => {
            const active = selectedBureau === b.id
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBureau(b.id)}
                style={{
                  textAlign: 'left',
                  padding: 16,
                  borderRadius: 12,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {/* Radio dot */}
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: active ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                      display: 'inline-block',
                      flexShrink: 0,
                      backgroundColor: '#fff',
                      transition: 'border 0.15s',
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: active ? '#1D4ED8' : '#1E293B' }}>
                    {b.id}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, paddingLeft: 22, lineHeight: 1.5 }}>
                  {b.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-section B: Pull Type */}
      <div>
        <SectionLabel>Pull Type</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PULL_TYPES.map((p) => {
            const active = pullType === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPullType(p.id)}
                style={{
                  textAlign: 'left',
                  padding: 16,
                  borderRadius: 12,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: active ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                      display: 'inline-block',
                      flexShrink: 0,
                      backgroundColor: '#fff',
                      transition: 'border 0.15s',
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: active ? '#1D4ED8' : '#1E293B' }}>
                    {p.label}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, paddingLeft: 22, lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-section B2: Fallback Bureau */}
      <div>
        <SectionLabel>Fallback Bureau</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 10px', lineHeight: 1.5 }}>
          If the primary bureau is unavailable or returns an error, automatically retry with this bureau.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[{ id: 'none', label: 'None', desc: 'Hard-fail on bureau error' }, ...BUREAUS.filter(b => b.id !== selectedBureau)].map((b) => {
            const active = fallbackBureau === b.id
            return (
              <button
                key={b.id}
                onClick={() => setFallbackBureau(b.id)}
                style={{
                  textAlign: 'left', padding: '12px 14px', borderRadius: 10,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{
                    width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
                    border: active ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                    backgroundColor: '#fff', transition: 'border 0.15s',
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#1D4ED8' : '#1E293B' }}>
                    {b.label ?? b.id}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-section B3: NTC Policy */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <SectionLabel>New to Credit (NTC) Policy</SectionLabel>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#7C3AED',
            backgroundColor: '#F5F3FF', borderRadius: 4, padding: '2px 7px',
          }}>
            Thin File
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 10px', lineHeight: 1.5 }}>
          Applicants with no credit history (NTC / thin file). Bureau returns no score for these users.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { id: 'approve', label: 'Approve (Basic)', color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC', desc: 'Auto-approve with Basic card variant' },
            { id: 'review',  label: 'Manual Review',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', desc: 'Refer to agent for document review' },
            { id: 'decline', label: 'Decline',         color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', desc: 'Reject NTC applicants automatically' },
          ].map((opt) => {
            const active = ntcPolicy === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setNtcPolicy(opt.id)}
                style={{
                  textAlign: 'left', padding: '12px 14px', borderRadius: 10,
                  border: active ? `2px solid ${opt.color}` : '1.5px solid #E2E8F0',
                  backgroundColor: active ? opt.bg : '#FFFFFF',
                  cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: active ? opt.color : '#1E293B', margin: '0 0 4px' }}>
                  {opt.label}
                </p>
                <p style={{ fontSize: 11, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{opt.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-section C: Score Thresholds */}
      <div>
        <SectionLabel>Score Thresholds</SectionLabel>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Auto Approve */}
          <ThresholdRow label="Auto Approve above" color="#22C55E">
            <ScoreInput value={thresholds.approve} onChange={(v) => updateThreshold('approve', v)} />
          </ThresholdRow>
          <div style={{ height: 1, backgroundColor: '#F1F5F9' }} />

          {/* Manual Review */}
          <ThresholdRow label="Manual Review between" color="#F59E0B">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScoreInput value={thresholds.manualLow} onChange={(v) => updateThreshold('manualLow', v)} />
              <span style={{ fontSize: 13, color: '#94A3B8' }}>—</span>
              <ScoreInput value={thresholds.manualHigh} onChange={(v) => updateThreshold('manualHigh', v)} />
            </div>
          </ThresholdRow>
          <div style={{ height: 1, backgroundColor: '#F1F5F9' }} />

          {/* Auto Decline */}
          <ThresholdRow label="Auto Decline below" color="#EF4444">
            <ScoreInput value={thresholds.decline} onChange={(v) => updateThreshold('decline', v)} />
          </ThresholdRow>
        </div>

        {/* Info banner */}
        <div
          style={{
            marginTop: 12,
            padding: '10px 14px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 8,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6.5" stroke="#3B82F6" strokeWidth="1.2" />
            <path d="M7 6v4M7 4.5v.5" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 12, color: '#1D4ED8', margin: 0, lineHeight: 1.6 }}>
            These thresholds apply before your custom decision rules run. Custom rules can override these defaults.
          </p>
        </div>
      </div>
    </div>
  )
}

function ThresholdRow({ label, color, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#334155', fontWeight: 400 }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

function ScoreInput({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 68,
        height: 32,
        borderRadius: 8,
        border: '1.5px solid #E2E8F0',
        padding: '0 10px',
        fontSize: 13,
        fontWeight: 600,
        color: '#1E293B',
        textAlign: 'center',
        outline: 'none',
        fontFamily: 'inherit',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
      onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
    />
  )
}

// ─── Decision Rules tab ──────────────────────────────────────────────

const INITIAL_RULES = [
  {
    id: 1,
    enabled: true,
    condition: 'CIBIL Score < 650  AND  Employment Type is Self-Employed',
    action: 'Auto Decline',
    actionColor: '#EF4444',
    actionBg: '#FEF2F2',
  },
  {
    id: 2,
    enabled: true,
    condition: 'Monthly Income < ₹25,000',
    action: 'Downgrade to Basic Card Variant',
    actionColor: '#D97706',
    actionBg: '#FFFBEB',
  },
  {
    id: 3,
    enabled: true,
    condition: 'CIBIL Score > 800  AND  Monthly Income > ₹1,00,000',
    action: 'Auto Approve Platinum Variant',
    actionColor: '#16A34A',
    actionBg: '#F0FDF4',
  },
]

const FIELD_OPTIONS = ['CIBIL Score', 'Monthly Income', 'Employment Type', 'Age', 'Existing EMIs']
const OPERATOR_OPTIONS = ['is greater than', 'is less than', 'is equal to', 'is between']
const ACTION_OPTIONS = ['Auto Approve', 'Auto Decline', 'Manual Review', 'Downgrade Variant', 'Upgrade Variant']

function DecisionRulesTab() {
  const [rules, setRules] = useState(INITIAL_RULES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({ field: FIELD_OPTIONS[0], operator: OPERATOR_OPTIONS[0], value: '', action: ACTION_OPTIONS[0] })

  function toggleRule(id) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  function deleteRule(id) {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  function saveRule() {
    if (!form.value.trim()) return
    const newRule = {
      id: Date.now(),
      enabled: true,
      condition: `${form.field} ${form.operator} ${form.value}`,
      action: form.action,
      actionColor: '#16A34A',
      actionBg: '#F0FDF4',
    }
    setRules((prev) => [...prev, newRule])
    setShowAddForm(false)
    setForm({ field: FIELD_OPTIONS[0], operator: OPERATOR_OPTIONS[0], value: '', action: ACTION_OPTIONS[0] })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Decision Rules</p>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: '#3B82F6',
            background: 'none', border: '1.5px solid #93C5FD',
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Rule
        </button>
      </div>

      {/* Rule cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rules.map((rule, idx) => (
          <div
            key={rule.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: 16,
              opacity: rule.enabled ? 1 : 0.55,
              transition: 'opacity 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {/* Rule number */}
              <span
                style={{
                  fontSize: 11, fontWeight: 600, color: '#64748B',
                  backgroundColor: '#F1F5F9', borderRadius: 20,
                  padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 1,
                }}
              >
                Rule {idx + 1}
              </span>

              {/* Condition + Action */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>IF</span>
                  <span style={{ fontSize: 13, color: '#334155' }}>{rule.condition}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>THEN</span>
                  <span
                    style={{
                      fontSize: 12, fontWeight: 600,
                      color: rule.actionColor,
                      backgroundColor: rule.actionBg,
                      borderRadius: 5, padding: '2px 8px',
                    }}
                  >
                    {rule.action}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <Toggle enabled={rule.enabled} onChange={() => toggleRule(rule.id)} />
                <button
                  onClick={() => deleteRule(rule.id)}
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#CBD5E1', lineHeight: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 4h9M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3.5 4l.7 7.5h5.6L10.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Rule inline form */}
        {showAddForm && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px dashed #93C5FD',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', margin: '0 0 12px' }}>New Rule</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>IF</span>
              <Select value={form.field} onChange={(v) => setForm((f) => ({ ...f, field: v }))} options={FIELD_OPTIONS} />
              <Select value={form.operator} onChange={(v) => setForm((f) => ({ ...f, operator: v }))} options={OPERATOR_OPTIONS} />
              <input
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                placeholder="value"
                style={{
                  height: 32, borderRadius: 7, border: '1.5px solid #E2E8F0',
                  padding: '0 10px', fontSize: 13, color: '#1E293B',
                  fontFamily: 'inherit', outline: 'none', width: 90,
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>THEN</span>
              <Select value={form.action} onChange={(v) => setForm((f) => ({ ...f, action: v }))} options={ACTION_OPTIONS} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={saveRule}
                style={{
                  fontSize: 13, fontWeight: 600, color: '#fff',
                  backgroundColor: '#3B82F6', border: 'none',
                  borderRadius: 8, padding: '7px 16px', cursor: 'pointer',
                }}
              >
                Save Rule
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{ fontSize: 13, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 14 }}>
        Rules are evaluated in order. First matching rule wins.
      </p>
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 32, borderRadius: 7, border: '1.5px solid #E2E8F0',
        padding: '0 8px', fontSize: 12, color: '#1E293B',
        backgroundColor: '#fff', cursor: 'pointer',
        fontFamily: 'inherit', outline: 'none',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
      onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  )
}

// ─── Credit Limit tab ────────────────────────────────────────────────

const MULTIPLIERS = [
  { id: '2x', label: '2×', hint: '2 × monthly income' },
  { id: '3x', label: '3×', hint: '3 × monthly income' },
  { id: '5x', label: '5×', hint: '5 × monthly income' },
  { id: '6x', label: '6×', hint: '6 × monthly income' },
]

const ROUNDING_OPTIONS = ['₹1,000', '₹5,000', '₹10,000']

const SCORE_BANDS = [
  { range: '750 – 900', label: 'Excellent', color: '#16A34A', bg: '#F0FDF4', borderColor: '#BBF7D0', defaultAdj: '+20', dir: 'up' },
  { range: '700 – 749', label: 'Good',      color: '#2563EB', bg: '#EFF6FF', borderColor: '#BFDBFE', defaultAdj: 'Base', dir: 'base' },
  { range: '650 – 699', label: 'Fair',      color: '#D97706', bg: '#FFFBEB', borderColor: '#FDE68A', defaultAdj: '-10', dir: 'down' },
]

function CreditLimitTab() {
  const [multiplier, setMultiplier] = useState('3x')
  const [minLimit, setMinLimit]     = useState('10000')
  const [maxLimit, setMaxLimit]     = useState('500000')
  const [rounding, setRounding]     = useState('₹10,000')
  const [bandAdj, setBandAdj]       = useState({ 0: '+20', 2: '-10' })

  const sampleIncome = 75000
  const mult = parseInt(multiplier) || 3
  const base = sampleIncome * mult
  const formattedBase = '₹' + base.toLocaleString('en-IN')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Base formula */}
      <div>
        <SectionLabel>Income Multiplier</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.5 }}>
          Base credit limit = multiplier × verified monthly income.
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {MULTIPLIERS.map(m => {
            const active = multiplier === m.id
            return (
              <button
                key={m.id}
                onClick={() => setMultiplier(m.id)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, textAlign: 'center',
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s',
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 700, color: active ? '#1D4ED8' : '#1E293B', margin: '0 0 3px' }}>{m.label}</p>
                <p style={{ fontSize: 10, color: active ? '#3B82F6' : '#94A3B8', margin: 0 }}>{m.hint}</p>
              </button>
            )
          })}
        </div>

        {/* Min / Max cap */}
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {[
            { label: 'Minimum credit limit', sublabel: 'Floor — no card issued below this', value: minLimit, onChange: setMinLimit },
            { label: 'Maximum credit limit', sublabel: 'Cap — limit never exceeds this',    value: maxLimit, onChange: setMaxLimit },
          ].map((row, i) => (
            <div key={i}>
              {i > 0 && <div style={{ height: 1, backgroundColor: '#F1F5F9' }} />}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                <div>
                  <p style={{ fontSize: 13, color: '#334155', fontWeight: 500, margin: '0 0 2px' }}>{row.label}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{row.sublabel}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>₹</span>
                  <input
                    type="number"
                    value={row.value}
                    onChange={e => row.onChange(e.target.value)}
                    style={{
                      width: 96, height: 32, borderRadius: 8,
                      border: '1.5px solid #E2E8F0', padding: '0 10px',
                      fontSize: 13, fontWeight: 600, color: '#1E293B',
                      textAlign: 'right', outline: 'none', fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = '#3B82F6'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score-based adjustments */}
      <div>
        <SectionLabel>Score-Based Adjustments</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.5 }}>
          Uplift or reduce the base limit based on the applicant's credit score band.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SCORE_BANDS.map((band, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 12,
                backgroundColor: band.bg, border: `1px solid ${band.borderColor}`,
              }}
            >
              <div style={{ display: 'flex', align: 'center', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: band.color, margin: '0 0 2px' }}>
                    Score {band.range}
                  </p>
                  <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{band.label} credit profile</p>
                </div>
              </div>
              {band.dir === 'base' ? (
                <span style={{
                  fontSize: 12, fontWeight: 600, color: band.color,
                  backgroundColor: '#fff', border: `1px solid ${band.borderColor}`,
                  borderRadius: 6, padding: '4px 14px',
                }}>
                  Base (no change)
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: band.color, fontWeight: 700 }}>
                    {band.dir === 'up' ? '▲' : '▼'}
                  </span>
                  <input
                    type="number"
                    value={Math.abs(parseInt(bandAdj[i] ?? band.defaultAdj) || 0)}
                    onChange={e => setBandAdj(prev => ({ ...prev, [i]: (band.dir === 'up' ? '+' : '-') + e.target.value }))}
                    style={{
                      width: 56, height: 32, borderRadius: 8,
                      border: `1.5px solid ${band.borderColor}`, padding: '0 8px',
                      fontSize: 13, fontWeight: 700, color: band.color,
                      textAlign: 'center', outline: 'none', fontFamily: 'inherit',
                      backgroundColor: '#fff',
                    }}
                    onFocus={e => e.target.style.borderColor = band.color}
                    onBlur={e => e.target.style.borderColor = band.borderColor}
                  />
                  <span style={{ fontSize: 13, color: band.color, fontWeight: 600 }}>%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rounding */}
      <div>
        <SectionLabel>Limit Rounding</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.5 }}>
          Round the final calculated limit to the nearest value for cleaner numbers.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {ROUNDING_OPTIONS.map(opt => {
            const active = rounding === opt
            return (
              <button
                key={opt}
                onClick={() => setRounding(opt)}
                style={{
                  padding: '8px 18px', borderRadius: 8,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  fontSize: 13, fontWeight: 600, color: active ? '#1D4ED8' : '#64748B',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Live example */}
      <div style={{
        backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
        borderRadius: 12, padding: '14px 16px',
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
          Example calculation
        </p>
        <p style={{ fontSize: 12, color: '#475569', margin: '0 0 4px' }}>
          Monthly income ₹75,000 × {mult} = <strong style={{ color: '#1E293B' }}>{formattedBase}</strong> base limit
        </p>
        <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
          Score 780 (Excellent) → +{Math.abs(parseInt(bandAdj[0] ?? '+20') || 20)}% uplift → <strong style={{ color: '#16A34A' }}>
            ₹{Math.min(Math.round(base * (1 + (Math.abs(parseInt(bandAdj[0] ?? '+20') || 20)) / 100) / 10000) * 10000, parseInt(maxLimit) || 500000).toLocaleString('en-IN')}
          </strong> final limit
        </p>
      </div>
    </div>
  )
}

// ─── Manual Review tab ───────────────────────────────────────────────

const SLA_OPTIONS   = ['24 hours', '48 hours', '72 hours']
const ASSIGN_OPTIONS = [
  { id: 'roundrobin', label: 'Round-robin',   desc: 'Auto-assign to the next available agent in rotation' },
  { id: 'queue',      label: 'Queue-based',   desc: 'Agents pick tasks from a shared review queue' },
  { id: 'manual',     label: 'Supervisor',    desc: 'Team lead manually assigns each referral' },
]
const INITIAL_CHECKLIST = [
  { id: 1, label: 'Income document verification',  desc: 'Salary slip, bank statement, or ITR', checked: true },
  { id: 2, label: 'Address proof check',           desc: 'Utility bill, Aadhaar, or passport',  checked: true },
  { id: 3, label: 'Employment verification',       desc: 'Employer letter or EPF statement',    checked: true },
  { id: 4, label: 'Fraud / watchlist screening',   desc: 'Check against internal and CIBIL fraud lists', checked: true },
  { id: 5, label: 'Call verification',             desc: 'Agent calls applicant to confirm intent', checked: false },
]

function ManualReviewTab() {
  const [sla, setSla]             = useState('48 hours')
  const [escalate, setEscalate]   = useState(true)
  const [assign, setAssign]       = useState('queue')
  const [notify, setNotify]       = useState(true)
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST)

  function toggleCheck(id) {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* SLA */}
      <div>
        <SectionLabel>Review SLA</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.5 }}>
          Target turnaround time for each application referred to manual review.
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {SLA_OPTIONS.map(opt => {
            const active = sla === opt
            return (
              <button
                key={opt}
                onClick={() => setSla(opt)}
                style={{
                  padding: '8px 20px', borderRadius: 8,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  fontSize: 13, fontWeight: 600, color: active ? '#1D4ED8' : '#64748B',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', margin: '0 0 2px' }}>Escalate on SLA breach</p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Notify supervisor if review not completed within SLA</p>
          </div>
          <Toggle enabled={escalate} onChange={() => setEscalate(v => !v)} colorOn="#F59E0B" />
        </div>
      </div>

      {/* Checklist */}
      <div>
        <SectionLabel>Review Checklist</SectionLabel>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.5 }}>
          Items agents must verify before making a final decision. Disable items that aren't applicable to your program.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                backgroundColor: '#FFFFFF', border: `1px solid ${item.checked ? '#BFDBFE' : '#E2E8F0'}`,
                borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                border: `2px solid ${item.checked ? '#3B82F6' : '#CBD5E1'}`,
                backgroundColor: item.checked ? '#3B82F6' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {item.checked && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: item.checked ? '#1E293B' : '#94A3B8', margin: '0 0 2px', transition: 'color 0.15s' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent assignment */}
      <div>
        <SectionLabel>Agent Assignment</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {ASSIGN_OPTIONS.map(opt => {
            const active = assign === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setAssign(opt.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  textAlign: 'left', padding: '12px 16px', borderRadius: 10,
                  border: active ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  border: active ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                  backgroundColor: '#fff', transition: 'border 0.15s',
                }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: active ? '#1D4ED8' : '#1E293B', margin: '0 0 2px' }}>{opt.label}</p>
                  <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', margin: '0 0 2px' }}>Notify agent on assignment</p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Send email + in-app alert when a case is assigned</p>
          </div>
          <Toggle enabled={notify} onChange={() => setNotify(v => !v)} />
        </div>
      </div>
    </div>
  )
}

// ─── Root component ──────────────────────────────────────────────────

const TABS = [
  { key: 'bureau-config',  label: 'Bureau Config' },
  { key: 'decision-rules', label: 'Decision Rules' },
  { key: 'credit-limit',   label: 'Credit Limit' },
  { key: 'manual-review',  label: 'Manual Review' },
]

export default function BureauDecisioningSettings() {
  const [activeTab, setActiveTab] = useState('bureau-config')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
            Bureau &amp; Decisioning
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
            Configure bureau pull settings and credit decisioning rules
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 24 }}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#3B82F6' : '#64748B',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                  padding: '0 4px 10px',
                  marginRight: 24,
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Tab body */}
        <div style={{ paddingBottom: 28 }}>
          {activeTab === 'bureau-config'  && <BureauConfigTab />}
          {activeTab === 'decision-rules' && <DecisionRulesTab />}
          {activeTab === 'credit-limit'   && <CreditLimitTab />}
          {activeTab === 'manual-review'  && <ManualReviewTab />}
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 32px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          flexShrink: 0,
        }}
      >
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
