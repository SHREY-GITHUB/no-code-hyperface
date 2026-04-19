import { useState } from 'react'

// ─── Program catalogue ────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    id: 'hdfc',
    name: 'HDFC Millenia Card Program',
    bank: 'HDFC Bank',
    type: 'Credit Card',
    status: 'Draft',
    stages: 4,
    enabledStages: 4,
    lastModified: 'Today, 2:14 PM',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    initial: 'H',
    applications: '1,247',
    conversion: '56.0%',
  },
  {
    id: 'slice',
    name: 'Slice Student Credit Card',
    bank: 'Slice Fintech',
    type: 'Credit Card',
    status: 'Live',
    stages: 4,
    enabledStages: 3,
    lastModified: 'Yesterday, 11:30 AM',
    color: '#7C3AED',
    bg: '#F5F3FF',
    initial: 'S',
    applications: '3,821',
    conversion: '61.2%',
  },
  {
    id: 'jupiter',
    name: 'Jupiter Edge Card',
    bank: 'Jupiter / Federal Bank',
    type: 'Credit Card',
    status: 'Live',
    stages: 4,
    enabledStages: 4,
    lastModified: 'Apr 10, 2026',
    color: '#059669',
    bg: '#ECFDF5',
    initial: 'J',
    applications: '2,156',
    conversion: '58.4%',
  },
]

const STATS = [
  { label: 'Programs', value: '3', sub: 'total configured' },
  { label: 'Live Journeys', value: '2', sub: 'actively running', trend: null },
  { label: 'Applications (7d)', value: '7,224', sub: 'across all programs', trend: '+12%', trendGood: true },
  { label: 'Avg Conversion', value: '58.5%', sub: 'across programs', trend: '+1.8%', trendGood: true },
]

// ─── Root export ──────────────────────────────────────────────────────────────

export default function HomePage({ onOpen }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      backgroundColor: '#F1F5F9',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{
        height: 56, backgroundColor: '#fff',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, backgroundColor: '#3B82F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1 }}>H</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Hyperface Studio</span>
          <span style={{ fontSize: 12, color: '#CBD5E1', marginLeft: 2 }}>/</span>
          <span style={{ fontSize: 13, color: '#64748B' }}>Dashboard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: '#64748B',
            border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '6px 14px', backgroundColor: '#fff', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M7 4.5V7l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Activity Log
          </button>
          <button
            onClick={() => onOpen('hdfc')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '7px 16px', backgroundColor: '#3B82F6', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2563EB' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3B82F6' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            New Program
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
            Welcome back 👋
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
            Manage your credit card onboarding journeys — configure stages, preview flows, and publish to production.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              backgroundColor: '#fff', borderRadius: 12, padding: '18px 20px',
              border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
                {s.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{s.value}</span>
                {s.trend && (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: s.trendGood ? '#16A34A' : '#DC2626',
                    backgroundColor: s.trendGood ? '#DCFCE7' : '#FEE2E2',
                    borderRadius: 5, padding: '2px 6px',
                  }}>{s.trend}</span>
                )}
              </div>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Programs section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 3px' }}>Your Programs</h2>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
              Click <strong>Configure</strong> to open the journey editor, or <strong>Create New</strong> to start from scratch.
            </p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#64748B',
            backgroundColor: '#F1F5F9', borderRadius: 6, padding: '3px 10px',
          }}>
            {PROGRAMS.length} programs
          </span>
        </div>

        {/* Programs grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PROGRAMS.map(prog => (
            <ProgramCard key={prog.id} prog={prog} onOpen={onOpen} />
          ))}
          <CreateCard onOpen={onOpen} />
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 11, color: '#CBD5E1', textAlign: 'center', marginTop: 40 }}>
          Hyperface Studio · No-Code LOS Configurator · v2.4.0
        </p>
      </div>
    </div>
  )
}

// ─── Program card ─────────────────────────────────────────────────────────────

function ProgramCard({ prog, onOpen }) {
  const [hovered, setHovered] = useState(false)
  const isLive = prog.status === 'Live'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: 14,
        border: `1px solid ${hovered ? '#CBD5E1' : '#E2E8F0'}`,
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.09)' : '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: 4, backgroundColor: prog.color }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            backgroundColor: prog.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: prog.color }}>{prog.initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 3px', lineHeight: 1.3 }}>
              {prog.name}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{prog.bank}</p>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, flexShrink: 0,
            color: isLive ? '#15803D' : '#92400E',
            backgroundColor: isLive ? '#DCFCE7' : '#FEF3C7',
            borderRadius: 6, padding: '3px 9px',
          }}>
            {isLive ? '● Live' : '◌ Draft'}
          </span>
        </div>

        {/* Metrics 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 16 }}>
          {[
            { label: 'Applications (7d)', value: prog.applications },
            { label: 'Conversion Rate', value: prog.conversion },
            { label: 'Active Stages', value: `${prog.enabledStages} / ${prog.stages}` },
            { label: 'Last Modified', value: prog.lastModified },
          ].map((m, i) => (
            <div key={i}>
              <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {m.label}
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', margin: 0 }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
          <button
            onClick={() => onOpen(prog.id)}
            style={{
              flex: 1, height: 34, fontSize: 12, fontWeight: 600,
              color: '#fff', backgroundColor: prog.color,
              border: 'none', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontFamily: 'inherit', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Configure
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2.5 5.5h6M6 3l2.5 2.5L6 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            title="Analytics"
            style={{
              width: 34, height: 34, border: '1px solid #E2E8F0', borderRadius: 8,
              backgroundColor: '#F8FAFC', cursor: 'pointer', color: '#64748B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.color = '#3B82F6' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="7.5" width="2.5" height="4.5" rx="0.6" fill="currentColor" opacity="0.55" />
              <rect x="5.2" y="4.5" width="2.5" height="7.5" rx="0.6" fill="currentColor" opacity="0.75" />
              <rect x="9.5" y="2" width="2.5" height="10" rx="0.6" fill="currentColor" />
            </svg>
          </button>
          <button
            title="More options"
            style={{
              width: 34, height: 34, border: '1px solid #E2E8F0', borderRadius: 8,
              backgroundColor: '#F8FAFC', cursor: 'pointer', color: '#64748B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8FAFC' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="3" cy="7" r="1.1" fill="currentColor" />
              <circle cx="7" cy="7" r="1.1" fill="currentColor" />
              <circle cx="11" cy="7" r="1.1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Create new program card ──────────────────────────────────────────────────

function CreateCard({ onOpen }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={() => onOpen('hdfc')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#F8FAFC' : '#fff',
        borderRadius: 14,
        border: `1.5px dashed ${hovered ? '#93C5FD' : '#CBD5E1'}`,
        padding: '32px 20px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
        transition: 'background-color 0.15s, border-color 0.15s',
        textAlign: 'center',
        fontFamily: 'inherit',
        minHeight: 220,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: hovered ? '#DBEAFE' : '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 0.15s',
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3v16M3 11h16" stroke={hovered ? '#3B82F6' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: hovered ? '#1D4ED8' : '#475569', margin: '0 0 5px' }}>
          Create New Program
        </p>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, lineHeight: 1.55, maxWidth: 170 }}>
          Start configuring a new credit card onboarding journey from scratch
        </p>
      </div>
    </button>
  )
}
