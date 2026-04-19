import { useState } from 'react'

function DemoToggle({ label, desc, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 0', borderBottom: '1px solid #F1F5F9',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1E293B', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 32, height: 18, borderRadius: 9, flexShrink: 0, marginTop: 2,
          backgroundColor: value ? '#EF4444' : '#CBD5E1',
          border: 'none', cursor: 'pointer', position: 'relative',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: value ? 16 : 2,
          width: 14, height: 14, borderRadius: '50%',
          backgroundColor: '#fff', transition: 'left 0.15s',
          display: 'block', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}

export default function DemoControlsPanel({ controls, onChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const anyActive = Object.values(controls).some(Boolean)

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
      width: 244,
      backgroundColor: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: collapsed ? 'none' : '1px solid #F1F5F9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            backgroundColor: anyActive ? '#EF4444' : '#22C55E',
            boxShadow: anyActive ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 0 0 3px rgba(34,197,94,0.15)',
            transition: 'background-color 0.2s',
          }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#64748B',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Demo Controls
          </span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M3 4.5l3 3 3-3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {!collapsed && (
        <div style={{ padding: '4px 14px 10px' }}>
          <DemoToggle
            label="Simulate Bureau Failure"
            desc="Show fetch error on bureau screen"
            value={controls.bureauFailure}
            onChange={v => onChange({ bureauFailure: v, manualReview: false, lowScoreDecline: false })}
          />
          <DemoToggle
            label="Simulate Manual Review"
            desc="Refer to agent review instead of instant decision"
            value={controls.manualReview}
            onChange={v => onChange({ bureauFailure: false, manualReview: v, lowScoreDecline: false })}
          />
          <DemoToggle
            label="Simulate Low Score Decline"
            desc="Decline with adverse action notice"
            value={controls.lowScoreDecline}
            onChange={v => onChange({ bureauFailure: false, manualReview: false, lowScoreDecline: v })}
          />
          <p style={{
            fontSize: 10, color: '#CBD5E1', margin: '10px 0 2px',
            textAlign: 'center', letterSpacing: '0.02em',
          }}>
            Affects bureau check in Preview Mode
          </p>
        </div>
      )}
    </div>
  )
}
