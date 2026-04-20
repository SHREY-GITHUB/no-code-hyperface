import { useState } from 'react'

function DemoToggle({ label, desc, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '9px 0', borderBottom: '1px solid #F3F4F6',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1F2937', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 30, height: 17, borderRadius: 9, flexShrink: 0, marginTop: 2,
          backgroundColor: value ? '#EF4444' : '#E5E7EB',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background-color 0.2s',
          boxShadow: value ? 'inset 0 1px 3px rgba(239,68,68,0.3)' : 'inset 0 1px 2px rgba(0,0,0,0.07)',
        }}
      >
        <span style={{
          position: 'absolute', top: 2.5, left: value ? 15 : 2.5,
          width: 12, height: 12, borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'block',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
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
      width: 248,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: collapsed ? 'none' : '1px solid #F3F4F6',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F9FAFB' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            backgroundColor: anyActive ? '#EF4444' : '#10B981',
            boxShadow: anyActive
              ? '0 0 0 3px rgba(239,68,68,0.12)'
              : '0 0 0 3px rgba(16,185,129,0.12)',
            transition: 'all 0.2s',
          }} />
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: '#6B7280',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Demo Controls
          </span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#9CA3AF' }}
        >
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            fontSize: 10, color: '#D1D5DB', margin: '9px 0 2px',
            textAlign: 'center', letterSpacing: '0.02em',
          }}>
            Affects bureau check in Preview Mode
          </p>
        </div>
      )}
    </div>
  )
}
