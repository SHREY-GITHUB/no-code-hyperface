import { useState } from 'react'

// ─── Program catalogue ────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    id: 'hdfc',
    name: 'HDFC Millenia Card Program',
    bank: 'HDFC Bank',
    status: 'Draft',
    stages: 4, enabledStages: 4,
    lastModified: 'Today, 2:14 PM',
    color: '#2563EB', gradFrom: '#3B82F6', gradTo: '#1D4ED8',
    bg: '#EFF6FF', initial: 'H',
    applications: '1,247', conversion: '56.0%',
  },
  {
    id: 'slice',
    name: 'Slice Student Credit Card',
    bank: 'Slice Fintech',
    status: 'Live',
    stages: 4, enabledStages: 3,
    lastModified: 'Yesterday, 11:30 AM',
    color: '#7C3AED', gradFrom: '#8B5CF6', gradTo: '#6D28D9',
    bg: '#F5F3FF', initial: 'S',
    applications: '3,821', conversion: '61.2%',
  },
  {
    id: 'jupiter',
    name: 'Jupiter Edge Card',
    bank: 'Jupiter / Federal Bank',
    status: 'Live',
    stages: 4, enabledStages: 4,
    lastModified: 'Apr 10, 2026',
    color: '#059669', gradFrom: '#10B981', gradTo: '#047857',
    bg: '#ECFDF5', initial: 'J',
    applications: '2,156', conversion: '58.4%',
  },
]

const STATS = [
  {
    label: 'Total Programs', value: '3', sub: 'configured',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.9"/>
        <rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
    accent: '#3B82F6', accentBg: '#EFF6FF',
  },
  {
    label: 'Live Journeys', value: '2', sub: 'actively running',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="9" cy="9" r="4" fill="currentColor" opacity="0.9"/>
        <circle cx="9" cy="9" r="2" fill="white"/>
      </svg>
    ),
    accent: '#10B981', accentBg: '#ECFDF5',
  },
  {
    label: 'Applications (7d)', value: '7,224', sub: 'across all programs', trend: '+12%', trendGood: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14L6 9L9 12L13 6L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
        <path d="M2 14L6 9L9 12L13 6L16 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#8B5CF6', accentBg: '#F5F3FF',
  },
  {
    label: 'Avg Conversion', value: '58.5%', sub: 'across programs', trend: '+1.8%', trendGood: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L11 7H16L12 10.5L13.5 16L9 12.5L4.5 16L6 10.5L2 7H7L9 2Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#F59E0B', accentBg: '#FFFBEB',
  },
]

// ─── Root export ──────────────────────────────────────────────────────────────

export default function HomePage({ onOpen }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      backgroundColor: '#F8FAFC',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>

      {/* Top bar */}
      <div className="home-topbar" style={{
        height: 60, flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo mark */}
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>H</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>Hyperface Studio</span>
            <span className="home-topbar-breadcrumb" style={{ fontSize: 13, color: '#CBD5E1' }}>/</span>
            <span className="home-topbar-breadcrumb" style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Dashboard</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button className="home-topbar-actlog" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: '#64748B',
            border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '7px 14px', backgroundColor: '#fff', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7 4.5V7l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Activity Log
          </button>
          <button
            onClick={() => onOpen('hdfc')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 13, fontWeight: 600, color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            New Program
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="home-body" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="home-hero-title" style={{
            fontSize: 24, fontWeight: 800, color: '#0F172A',
            margin: '0 0 6px', letterSpacing: '-0.5px',
          }}>
            Welcome back 👋
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
            Manage your credit card onboarding journeys — configure stages, preview flows, and publish to production.
          </p>
        </div>

        {/* Stats row */}
        <div className="home-stats-grid" style={{ marginBottom: 36 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: '18px 20px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {s.label}
                </p>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  backgroundColor: s.accentBg, color: s.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.icon}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-1px' }}>
                    {s.value}
                  </span>
                  {s.trend && (
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: s.trendGood ? '#059669' : '#DC2626',
                      backgroundColor: s.trendGood ? '#DCFCE7' : '#FEE2E2',
                      borderRadius: 6, padding: '2px 7px',
                    }}>
                      {s.trend}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Programs section header */}
        <div className="home-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 3px', letterSpacing: '-0.2px' }}>
              Your Programs
            </h2>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
              Click <strong style={{ color: '#3B82F6' }}>Configure</strong> to open the journey editor
            </p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#64748B',
            backgroundColor: '#F1F5F9', borderRadius: 20, padding: '4px 12px',
            border: '1px solid #E2E8F0',
          }}>
            {PROGRAMS.length} programs
          </span>
        </div>

        {/* Programs grid */}
        <div className="home-programs-grid">
          {PROGRAMS.map(prog => <ProgramCard key={prog.id} prog={prog} onOpen={onOpen} />)}
          <CreateCard onOpen={onOpen} />
        </div>

        <p style={{ fontSize: 11, color: '#CBD5E1', textAlign: 'center', marginTop: 44, paddingBottom: 8 }}>
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
        borderRadius: 16,
        border: `1px solid ${hovered ? '#DBEAFE' : '#F1F5F9'}`,
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* Gradient accent bar */}
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${prog.gradFrom} 0%, ${prog.gradTo} 100%)`,
      }} />

      <div style={{ padding: '18px 20px 20px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
          {/* Logo chip */}
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${prog.gradFrom}22 0%, ${prog.gradFrom}11 100%)`,
            border: `1.5px solid ${prog.gradFrom}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: prog.color }}>{prog.initial}</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 14, fontWeight: 700, color: '#0F172A',
              margin: '0 0 3px', lineHeight: 1.3, letterSpacing: '-0.1px',
            }}>
              {prog.name}
            </p>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{prog.bank}</p>
          </div>

          {/* Status badge */}
          <span style={{
            fontSize: 10, fontWeight: 700, flexShrink: 0,
            color: isLive ? '#059669' : '#92400E',
            backgroundColor: isLive ? '#D1FAE5' : '#FEF3C7',
            border: `1px solid ${isLive ? '#A7F3D0' : '#FDE68A'}`,
            borderRadius: 20, padding: '3px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: isLive ? '#10B981' : '#D97706',
              display: 'inline-block',
              boxShadow: isLive ? '0 0 0 2px #A7F3D080' : 'none',
              animation: isLive ? 'livePulse 2s ease-in-out infinite' : 'none',
            }} />
            {prog.status}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#F8FAFC', marginBottom: 16 }} />

        {/* Metrics 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: 18 }}>
          {[
            { label: 'Applications (7d)', value: prog.applications, accent: '#8B5CF6' },
            { label: 'Conversion Rate', value: prog.conversion, accent: '#10B981' },
            { label: 'Active Stages', value: `${prog.enabledStages} / ${prog.stages}`, accent: '#3B82F6' },
            { label: 'Last Modified', value: prog.lastModified, accent: '#F59E0B' },
          ].map((m, i) => (
            <div key={i}>
              <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {m.label}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', margin: 0 }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onOpen(prog.id)}
            style={{
              flex: 1, height: 36, fontSize: 13, fontWeight: 600,
              color: '#fff',
              background: `linear-gradient(135deg, ${prog.gradFrom} 0%, ${prog.gradTo} 100%)`,
              border: 'none', borderRadius: 9, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit',
              boxShadow: `0 2px 8px ${prog.color}30`,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 14px ${prog.color}45` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 8px ${prog.color}30` }}
          >
            Configure
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Analytics icon btn */}
          <button title="Analytics" style={{
            width: 36, height: 36, border: '1px solid #E2E8F0', borderRadius: 9,
            backgroundColor: '#F8FAFC', cursor: 'pointer', color: '#64748B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = prog.bg; e.currentTarget.style.borderColor = prog.gradFrom + '60'; e.currentTarget.style.color = prog.color }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="7.5" width="2.5" height="4.5" rx="0.6" fill="currentColor" opacity="0.5"/>
              <rect x="5.2" y="4.5" width="2.5" height="7.5" rx="0.6" fill="currentColor" opacity="0.75"/>
              <rect x="9.5" y="2" width="2.5" height="10" rx="0.6" fill="currentColor"/>
            </svg>
          </button>

          {/* More icon btn */}
          <button title="More options" style={{
            width: 36, height: 36, border: '1px solid #E2E8F0', borderRadius: 9,
            backgroundColor: '#F8FAFC', cursor: 'pointer', color: '#64748B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="3" cy="7" r="1.1" fill="currentColor"/>
              <circle cx="7" cy="7" r="1.1" fill="currentColor"/>
              <circle cx="11" cy="7" r="1.1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Create new card ──────────────────────────────────────────────────────────

function CreateCard({ onOpen }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={() => onOpen('hdfc')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#F8FAFC' : '#fff',
        borderRadius: 16,
        border: `1.5px dashed ${hovered ? '#93C5FD' : '#E2E8F0'}`,
        padding: '32px 20px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
        transition: 'all 0.2s',
        textAlign: 'center',
        fontFamily: 'inherit',
        minHeight: 220,
        boxShadow: hovered ? '0 4px 16px rgba(59,130,246,0.08)' : 'none',
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: hovered
          ? 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)'
          : '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 12px rgba(59,130,246,0.15)' : 'none',
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3v16M3 11h16" stroke={hovered ? '#3B82F6' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: hovered ? '#1D4ED8' : '#475569', margin: '0 0 6px', letterSpacing: '-0.1px' }}>
          Create New Program
        </p>
        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, lineHeight: 1.6, maxWidth: 170 }}>
          Configure a new credit card onboarding journey from scratch
        </p>
      </div>
    </button>
  )
}
