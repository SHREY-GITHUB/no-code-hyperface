import { useState } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const RANGE_DATA = {
  '7d': {
    label: 'Apr 8 – 15, 2026',
    metrics: [
      { label: 'Total Started',   value: '1,247', sub: 'applications'  },
      { label: 'Submitted',       value: '698',   sub: 'completed'     },
      { label: 'Conversion Rate', value: '56.0%', sub: 'of started',    trend: '+2.3%', trendGood: true  },
      { label: 'Avg Completion',  value: '8m 42s',sub: 'per applicant', trend: '-18s',  trendGood: true  },
    ],
    funnel: [
      { stage: 'Application Form',     count: 1247, pct: 100.0, drop: null   },
      { stage: 'Bureau & Decisioning', count: 1089, pct: 87.3,  drop: -12.7  },
      { stage: 'KYC Verification',     count: 824,  pct: 66.1,  drop: -21.2  },
      { stage: 'Agreement & Consent',  count: 731,  pct: 58.6,  drop: -7.5   },
      { stage: 'Submitted',            count: 698,  pct: 56.0,  drop: -2.6   },
    ],
    daily: [
      { day: 'Mon', count: 142 },
      { day: 'Tue', count: 178 },
      { day: 'Wed', count: 201 },
      { day: 'Thu', count: 165 },
      { day: 'Fri', count: 189 },
      { day: 'Sat', count: 223 },
      { day: 'Sun', count: 149 },
    ],
    outcomes: [
      { label: 'Approved',       count: 641, pct: 51.4, color: '#22C55E', bg: '#DCFCE7', textColor: '#15803D' },
      { label: 'Pending Review', count: 183, pct: 14.7, color: '#F59E0B', bg: '#FEF3C7', textColor: '#B45309' },
      { label: 'Declined',       count: 100, pct: 8.0,  color: '#EF4444', bg: '#FEE2E2', textColor: '#B91C1C' },
      { label: 'Incomplete',     count: 323, pct: 25.9, color: '#94A3B8', bg: '#F1F5F9', textColor: '#475569' },
    ],
    stagePerf: [
      { stage: 'Application Form',     avgTime: '2m 14s', dropPct: 12.7, severity: 'low'    },
      { stage: 'Bureau & Decisioning', avgTime: '3m 08s', dropPct: 15.2, severity: 'medium' },
      { stage: 'KYC Verification',     avgTime: '2m 51s', dropPct: 24.4, severity: 'high'   },
      { stage: 'Agreement & Consent',  avgTime: '1m 22s', dropPct: 4.5,  severity: 'low'    },
    ],
  },
  '30d': {
    label: 'Mar 16 – Apr 15, 2026',
    metrics: [
      { label: 'Total Started',   value: '5,341', sub: 'applications'  },
      { label: 'Submitted',       value: '2,891', sub: 'completed'     },
      { label: 'Conversion Rate', value: '54.1%', sub: 'of started',    trend: '+1.8%', trendGood: true  },
      { label: 'Avg Completion',  value: '9m 05s',sub: 'per applicant', trend: '+5s',   trendGood: false },
    ],
    funnel: [
      { stage: 'Application Form',     count: 5341, pct: 100.0, drop: null   },
      { stage: 'Bureau & Decisioning', count: 4612, pct: 86.4,  drop: -13.6  },
      { stage: 'KYC Verification',     count: 3480, pct: 65.2,  drop: -21.2  },
      { stage: 'Agreement & Consent',  count: 3101, pct: 58.1,  drop: -7.1   },
      { stage: 'Submitted',            count: 2891, pct: 54.1,  drop: -4.0   },
    ],
    daily: [
      { day: 'W1',  count: 1102 },
      { day: 'W2',  count: 1348 },
      { day: 'W3',  count: 1543 },
      { day: 'W4',  count: 1348 },
    ],
    outcomes: [
      { label: 'Approved',       count: 2741, pct: 51.3, color: '#22C55E', bg: '#DCFCE7', textColor: '#15803D' },
      { label: 'Pending Review', count: 789,  pct: 14.8, color: '#F59E0B', bg: '#FEF3C7', textColor: '#B45309' },
      { label: 'Declined',       count: 421,  pct: 7.9,  color: '#EF4444', bg: '#FEE2E2', textColor: '#B91C1C' },
      { label: 'Incomplete',     count: 1390, pct: 26.0, color: '#94A3B8', bg: '#F1F5F9', textColor: '#475569' },
    ],
    stagePerf: [
      { stage: 'Application Form',     avgTime: '2m 22s', dropPct: 13.6, severity: 'medium' },
      { stage: 'Bureau & Decisioning', avgTime: '3m 14s', dropPct: 21.2, severity: 'high'   },
      { stage: 'KYC Verification',     avgTime: '2m 58s', dropPct: 21.2, severity: 'high'   },
      { stage: 'Agreement & Consent',  avgTime: '1m 31s', dropPct: 7.1,  severity: 'low'    },
    ],
  },
  '90d': {
    label: 'Jan 15 – Apr 15, 2026',
    metrics: [
      { label: 'Total Started',   value: '14,892', sub: 'applications'  },
      { label: 'Submitted',       value: '7,804',  sub: 'completed'     },
      { label: 'Conversion Rate', value: '52.4%',  sub: 'of started',    trend: '-0.4%', trendGood: false },
      { label: 'Avg Completion',  value: '9m 31s', sub: 'per applicant', trend: '+44s',  trendGood: false },
    ],
    funnel: [
      { stage: 'Application Form',     count: 14892, pct: 100.0, drop: null   },
      { stage: 'Bureau & Decisioning', count: 12804, pct: 86.0,  drop: -14.0  },
      { stage: 'KYC Verification',     count: 9811,  pct: 65.9,  drop: -20.1  },
      { stage: 'Agreement & Consent',  count: 8612,  pct: 57.8,  drop: -8.1   },
      { stage: 'Submitted',            count: 7804,  pct: 52.4,  drop: -5.4   },
    ],
    daily: [
      { day: 'Jan', count: 4201 },
      { day: 'Feb', count: 4890 },
      { day: 'Mar', count: 5801 },
    ],
    outcomes: [
      { label: 'Approved',       count: 7401,  pct: 49.7, color: '#22C55E', bg: '#DCFCE7', textColor: '#15803D' },
      { label: 'Pending Review', count: 2198,  pct: 14.8, color: '#F59E0B', bg: '#FEF3C7', textColor: '#B45309' },
      { label: 'Declined',       count: 1241,  pct: 8.3,  color: '#EF4444', bg: '#FEE2E2', textColor: '#B91C1C' },
      { label: 'Incomplete',     count: 4052,  pct: 27.2, color: '#94A3B8', bg: '#F1F5F9', textColor: '#475569' },
    ],
    stagePerf: [
      { stage: 'Application Form',     avgTime: '2m 31s', dropPct: 14.0, severity: 'medium' },
      { stage: 'Bureau & Decisioning', avgTime: '3m 22s', dropPct: 20.1, severity: 'high'   },
      { stage: 'KYC Verification',     avgTime: '3m 08s', dropPct: 20.1, severity: 'high'   },
      { stage: 'Agreement & Consent',  avgTime: '1m 29s', dropPct: 8.1,  severity: 'medium' },
    ],
  },
}

const SEVERITY_STYLES = {
  low:    { color: '#15803D', bg: '#DCFCE7' },
  medium: { color: '#B45309', bg: '#FEF3C7' },
  high:   { color: '#B91C1C', bg: '#FEE2E2' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 16px' }}>
      {children}
    </p>
  )
}

// ─── KPI cards ────────────────────────────────────────────────────────────────

const METRIC_ICONS = {
  'Total Started': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="#3B82F6" strokeWidth="1.4" />
      <path d="M1 13.5c0-3 2-4.5 4.5-4.5S10 10.5 10 13.5" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 5v5M14 7.5h-5" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  'Submitted': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#3B82F6" strokeWidth="1.4" />
      <path d="M5 8l2.5 2.5 4-4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Conversion Rate': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 13L13 3" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="4.5" cy="4.5" r="2" stroke="#3B82F6" strokeWidth="1.4" />
      <circle cx="11.5" cy="11.5" r="2" stroke="#3B82F6" strokeWidth="1.4" />
    </svg>
  ),
  'Avg Completion': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#3B82F6" strokeWidth="1.4" />
      <path d="M8 4.5V8l2.5 1.5" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

function MetricCards({ metrics }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
      {metrics.map((m, i) => (
        <Card key={i} style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {m.label}
            </span>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {METRIC_ICONS[m.label]}
            </div>
          </div>
          <p style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 3px', lineHeight: 1 }}>
            {m.value}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>{m.sub}</span>
            {m.trend && (
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: m.trendGood ? '#15803D' : '#B91C1C',
                backgroundColor: m.trendGood ? '#DCFCE7' : '#FEE2E2',
                borderRadius: 4, padding: '1px 6px',
              }}>
                {m.trend}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Conversion Funnel ────────────────────────────────────────────────────────

function FunnelBar({ row, isLast }) {
  const barColor = row.pct >= 80 ? '#3B82F6' : row.pct >= 60 ? '#60A5FA' : '#93C5FD'
  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid #F8FAFC', paddingBottom: isLast ? 0 : 12, marginBottom: isLast ? 0 : 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#334155', minWidth: 168, flexShrink: 0 }}>
          {row.stage}
        </span>
        <div style={{ flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            backgroundColor: barColor,
            '--bar-w': `${row.pct}%`,
            animation: 'barGrow 0.6s ease-out forwards',
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', minWidth: 52, textAlign: 'right' }}>
          {row.count.toLocaleString('en-IN')}
        </span>
        <span style={{ fontSize: 13, color: '#64748B', minWidth: 46, textAlign: 'right' }}>
          {row.pct.toFixed(1)}%
        </span>
        <span style={{ minWidth: 72, textAlign: 'right' }}>
          {row.drop !== null ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#EF4444', fontWeight: 500 }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M4 1v6M1.5 4.5L4 7l2.5-2.5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {Math.abs(row.drop).toFixed(1)}%
            </span>
          ) : (
            <span style={{ fontSize: 11, color: '#94A3B8' }}>—</span>
          )}
        </span>
      </div>
    </div>
  )
}

function ConversionFunnel({ funnel }) {
  return (
    <Card style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionTitle>Conversion Funnel</SectionTitle>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ color: '#3B82F6', label: '>80%' }, { color: '#60A5FA', label: '60-80%' }, { color: '#93C5FD', label: '<60%' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color }} />
              <span style={{ fontSize: 11, color: '#94A3B8' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Column headers */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 168 }}>Stage</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 52, textAlign: 'right' }}>Count</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 46, textAlign: 'right' }}>Rate</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 72, textAlign: 'right' }}>Drop-off</span>
      </div>
      {funnel.map((row, i) => (
        <FunnelBar key={row.stage} row={row} isLast={i === funnel.length - 1} />
      ))}
    </Card>
  )
}

// ─── Daily Applications Chart ─────────────────────────────────────────────────

function DailyChart({ daily }) {
  const maxCount = Math.max(...daily.map(d => d.count))
  const chartH = 96
  const totalW = 560
  const slotW = totalW / daily.length
  const barW = Math.min(slotW * 0.5, 44)
  const bottomPad = 28

  return (
    <Card style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionTitle>Daily Applications</SectionTitle>
        <span style={{
          fontSize: 11, fontWeight: 500, color: '#64748B',
          backgroundColor: '#F1F5F9', borderRadius: 6, padding: '3px 10px',
        }}>
          {daily.length === 7 ? 'Last 7 days' : daily.length === 4 ? 'Last 4 weeks' : 'Last 3 months'}
        </span>
      </div>
      <svg
        width="100%"
        height={chartH + bottomPad}
        viewBox={`0 0 ${totalW} ${chartH + bottomPad}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {/* Horizontal guide lines at 25%, 50%, 75%, 100% */}
        {[0.25, 0.5, 0.75, 1].map(f => {
          const y = chartH - f * chartH
          return (
            <line key={f} x1={0} x2={totalW} y1={y} y2={y} stroke="#F1F5F9" strokeWidth="1" />
          )
        })}

        {daily.map((d, i) => {
          const barH = Math.max((d.count / maxCount) * chartH, 4)
          const x = i * slotW + (slotW - barW) / 2
          const y = chartH - barH
          const isMax = d.count === maxCount
          const labelY = chartH + bottomPad - 4

          return (
            <g key={d.day}>
              {/* Bar */}
              <rect
                x={x} y={y} width={barW} height={barH} rx={4}
                fill={isMax ? '#1D4ED8' : '#3B82F6'}
              />
              {/* Count label above bar */}
              {barH > 14 && (
                <text
                  x={x + barW / 2} y={y - 5}
                  textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569"
                >
                  {d.count}
                </text>
              )}
              {/* Day label below */}
              <text
                x={x + barW / 2} y={labelY}
                textAnchor="middle" fontSize="11" fill="#94A3B8"
              >
                {d.day}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}

// ─── Outcome Breakdown ────────────────────────────────────────────────────────

function OutcomeBreakdown({ outcomes }) {
  const total = outcomes.reduce((s, o) => s + o.count, 0)
  return (
    <Card style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionTitle>Outcome Breakdown</SectionTitle>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>{total.toLocaleString('en-IN')} submitted</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {outcomes.map((o, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: o.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#334155', minWidth: 120 }}>
              {o.label}
            </span>
            <div style={{ flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                backgroundColor: o.color,
                '--bar-w': `${o.pct}%`,
                animation: 'barGrow 0.5s ease-out forwards',
              }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', minWidth: 52, textAlign: 'right' }}>
              {o.count.toLocaleString('en-IN')}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: o.textColor, backgroundColor: o.bg,
              borderRadius: 4, padding: '2px 7px', minWidth: 46, textAlign: 'center',
            }}>
              {o.pct}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Stage Performance Table ──────────────────────────────────────────────────

function StagePerformance({ stagePerf }) {
  return (
    <Card style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 12px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>Stage Performance</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC' }}>
            {['Stage', 'Avg Time on Stage', 'Drop-off Rate', 'Severity'].map((h, i) => (
              <th
                key={h}
                style={{
                  padding: '8px 24px', fontSize: 11, fontWeight: 600,
                  color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em',
                  textAlign: i === 0 ? 'left' : 'right',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stagePerf.map((row, i) => {
            const sev = SEVERITY_STYLES[row.severity]
            const isWorst = row.severity === 'high'
            return (
              <tr
                key={i}
                style={{
                  borderTop: '1px solid #F1F5F9',
                  borderLeft: isWorst ? '3px solid #EF4444' : '3px solid transparent',
                }}
              >
                <td style={{ padding: '14px 24px', fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
                  {row.stage}
                </td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#334155', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {row.avgTime}
                </td>
                <td style={{
                  padding: '14px 24px', textAlign: 'right',
                  fontSize: 13, fontWeight: 600,
                  color: row.severity === 'high' ? '#EF4444' : row.severity === 'medium' ? '#F59E0B' : '#22C55E',
                }}>
                  {row.dropPct}%
                </td>
                <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: sev.color, backgroundColor: sev.bg,
                    borderRadius: 4, padding: '2px 8px',
                    textTransform: 'capitalize',
                  }}>
                    {row.severity}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ padding: '10px 24px 14px' }}>
        <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>
          ● Stages highlighted in red have the highest drop-off and are recommended for optimisation.
        </p>
      </div>
    </Card>
  )
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function JourneyAnalytics({ onClose }) {
  const [range, setRange] = useState('7d')
  const d = RANGE_DATA[range]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F1F5F9' }}>
      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            {onClose && (
              <button
                onClick={onClose}
                title="Back to editor"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, marginTop: 3, borderRadius: 8, flexShrink: 0,
                  border: '1px solid #E2E8F0', backgroundColor: '#fff',
                  cursor: 'pointer', color: '#64748B',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  transition: 'background-color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8.5 3L4.5 7L8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 5px' }}>
                Journey Analytics
              </h1>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                HDFC Millenia Card Program &nbsp;·&nbsp; {d.label}
              </p>
            </div>
          </div>
          {/* Range tab strip */}
          <div style={{
            display: 'flex', gap: 2,
            backgroundColor: '#F1F5F9', borderRadius: 9, padding: 3,
          }}>
            {['7d', '30d', '90d'].map(r => {
              const active = range === r
              return (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    padding: '5px 14px', borderRadius: 7, border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                    backgroundColor: active ? '#fff' : 'transparent',
                    color: active ? '#1E293B' : '#64748B',
                    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {r}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <MetricCards metrics={d.metrics} key={range + 'metrics'} />

          {/* Two columns: funnel + right stack */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <ConversionFunnel funnel={d.funnel} key={range + 'funnel'} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <DailyChart daily={d.daily} key={range + 'daily'} />
              <OutcomeBreakdown outcomes={d.outcomes} key={range + 'outcomes'} />
            </div>
          </div>

          <StagePerformance stagePerf={d.stagePerf} key={range + 'perf'} />
        </div>
      </div>
    </div>
  )
}
