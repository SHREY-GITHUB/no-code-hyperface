import { useState, useRef, useEffect } from 'react'

// ─── Color presets ────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: 'Blue',   color: '#2563EB', gradFrom: '#3B82F6', gradTo: '#1D4ED8', bg: '#EFF6FF' },
  { label: 'Purple', color: '#7C3AED', gradFrom: '#8B5CF6', gradTo: '#6D28D9', bg: '#F5F3FF' },
  { label: 'Green',  color: '#059669', gradFrom: '#10B981', gradTo: '#047857', bg: '#ECFDF5' },
  { label: 'Orange', color: '#D97706', gradFrom: '#F59E0B', gradTo: '#B45309', bg: '#FFFBEB' },
  { label: 'Red',    color: '#DC2626', gradFrom: '#EF4444', gradTo: '#B91C1C', bg: '#FEF2F2' },
  { label: 'Teal',   color: '#0891B2', gradFrom: '#06B6D4', gradTo: '#0E7490', bg: '#ECFEFF' },
]

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS_BASE = [
  {
    label: 'Total Programs', valueKey: 'totalPrograms', sub: 'configured',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.9"/>
        <rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.55"/>
        <rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.55"/>
        <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity="0.25"/>
      </svg>
    ),
    accent: '#2563EB', accentBg: '#EFF6FF',
  },
  {
    label: 'Live Journeys', valueKey: 'liveJourneys', sub: 'actively running',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25"/>
        <circle cx="9" cy="9" r="4" fill="currentColor" opacity="0.9"/>
        <circle cx="9" cy="9" r="1.8" fill="white"/>
      </svg>
    ),
    accent: '#059669', accentBg: '#ECFDF5',
  },
  {
    label: 'Applications (7d)', value: '7,224', sub: 'across all programs', trend: '+12%', trendGood: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
        <path d="M2 14L6 9L9 12L13 6L16 9"   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
        <path d="M2 14L6 9L9 12L13 6L16 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#7C3AED', accentBg: '#F5F3FF',
  },
  {
    label: 'Avg Conversion', value: '58.5%', sub: 'across programs', trend: '+1.8%', trendGood: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L11 7H16L12 10.5L13.5 16L9 12.5L4.5 16L6 10.5L2 7H7L9 2Z"
              fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#D97706', accentBg: '#FFFBEB',
  },
]

// ─── New Program Modal ────────────────────────────────────────────────────────

function NewProgramModal({ onClose, onCreate }) {
  const [name, setName]                   = useState('')
  const [description, setDesc]            = useState('')
  const [nameError, setNameError]         = useState(false)
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0])
  const nameRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleCreate() {
    if (!name.trim()) { setNameError(true); nameRef.current?.focus(); return }
    onCreate({ name: name.trim(), description: description.trim(), color: selectedColor })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        backgroundColor: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.18s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E5E7EB',
          boxShadow: '0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          animation: 'fadeSlideUp 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '22px 24px 18px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${selectedColor.gradFrom} 0%, ${selectedColor.gradTo} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: `0 2px 8px ${selectedColor.color}33`,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.2px' }}>
                Create New Program
              </h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', fontWeight: 400 }}>
                Set up a new credit card onboarding journey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 7, border: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB', cursor: 'pointer', color: '#6B7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.color = '#374151' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.color = '#6B7280' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 24px' }}>

          {/* Program Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: '#374151', marginBottom: 6, letterSpacing: '-0.1px',
            }}>
              Program Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); if (e.target.value.trim()) setNameError(false) }}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
              placeholder="e.g. HDFC Millennia Card Program"
              style={{
                width: '100%', height: 40,
                border: `1.5px solid ${nameError ? '#EF4444' : '#E5E7EB'}`,
                borderRadius: 8, padding: '0 12px',
                fontSize: 13.5, color: '#111827',
                backgroundColor: nameError ? '#FFF5F5' : '#FFFFFF',
                outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 0.15s, background-color 0.15s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { if (!nameError) e.target.style.borderColor = '#3B82F6' }}
              onBlur={e => { if (!nameError) e.target.style.borderColor = '#E5E7EB' }}
            />
            {nameError && (
              <p style={{ fontSize: 11.5, color: '#EF4444', margin: '5px 0 0', fontWeight: 500 }}>
                Program name is required
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: '#374151', marginBottom: 6, letterSpacing: '-0.1px',
            }}>
              Description <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Brief description of this card program and its target audience…"
              rows={2}
              style={{
                width: '100%',
                border: '1.5px solid #E5E7EB',
                borderRadius: 8, padding: '10px 12px',
                fontSize: 13, color: '#111827',
                backgroundColor: '#FFFFFF',
                outline: 'none', fontFamily: 'inherit',
                resize: 'none', lineHeight: 1.55,
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderColor = '#3B82F6' }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB' }}
            />
          </div>

          {/* Color scheme picker */}
          <div style={{ marginBottom: 22 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: '#374151', marginBottom: 10, letterSpacing: '-0.1px',
            }}>
              Color Scheme
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map(preset => {
                const active = preset.color === selectedColor.color
                return (
                  <button
                    key={preset.color}
                    title={preset.label}
                    onClick={() => setSelectedColor(preset)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: `1.5px solid ${active ? preset.color : '#E5E7EB'}`,
                      backgroundColor: active ? preset.bg : '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                      boxShadow: active ? `0 2px 8px ${preset.color}22` : 'none',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = preset.color + '80'; e.currentTarget.style.backgroundColor = preset.bg } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#FFFFFF' } }}
                  >
                    <span style={{
                      width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${preset.gradFrom}, ${preset.gradTo})`,
                      boxShadow: active ? `0 1px 4px ${preset.color}55` : 'none',
                    }} />
                    <span style={{
                      fontSize: 11.5, fontWeight: active ? 600 : 500,
                      color: active ? preset.color : '#6B7280',
                    }}>
                      {preset.label}
                    </span>
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke={preset.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, height: 38, fontSize: 13, fontWeight: 500,
                color: '#6B7280', border: '1px solid #E5E7EB',
                borderRadius: 8, backgroundColor: '#FFFFFF',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E5E7EB' }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{
                flex: 2, height: 38, fontSize: 13, fontWeight: 600,
                color: '#FFFFFF', border: 'none',
                borderRadius: 8,
                background: `linear-gradient(135deg, ${selectedColor.gradFrom} 0%, ${selectedColor.gradTo} 100%)`,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: `0 2px 8px ${selectedColor.color}33`,
                transition: 'transform 0.15s, box-shadow 0.15s, background 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 14px ${selectedColor.color}44` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 8px ${selectedColor.color}33` }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1.5v10M1.5 6.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Create Program
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function HomePage({ onOpen, programs, onAddProgram }) {
  const [showNewModal, setShowNewModal] = useState(false)

  /* Derive stats dynamically from programs list */
  const totalPrograms = programs.length
  const liveJourneys  = programs.filter(p => p.status === 'Live').length

  const stats = STATS_BASE.map(s => {
    if (s.valueKey === 'totalPrograms') return { ...s, value: String(totalPrograms) }
    if (s.valueKey === 'liveJourneys')  return { ...s, value: String(liveJourneys)  }
    return s
  })

  function handleCreate({ name, description, color }) {
    const newProg = {
      id: `custom-${Date.now()}`,
      name,
      bank: description || 'Custom Program',
      status: 'Draft',
      stages: 4, enabledStages: 4,
      lastModified: 'Just now',
      color: color.color,
      gradFrom: color.gradFrom,
      gradTo: color.gradTo,
      bg: color.bg,
      initial: name.charAt(0).toUpperCase(),
      applications: '—', conversion: '—',
    }
    onAddProgram(newProg)
    setShowNewModal(false)
    onOpen('hdfc', name)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      backgroundColor: '#F9FAFB',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="home-topbar" style={{
        height: 58, flexShrink: 0,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37,99,235,0.28)',
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>H</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>Hyperface Studio</span>
            <span className="home-topbar-breadcrumb" style={{ color: '#D1D5DB', fontSize: 14 }}>/</span>
            <span className="home-topbar-breadcrumb" style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Dashboard</span>
          </div>
        </div>

        {/* New Program button */}
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12.5, fontWeight: 600, color: '#fff',
            border: 'none', borderRadius: 7,
            padding: '7px 14px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.32)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.22)' }}
        >
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5v10M1.5 6.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Program
        </button>
      </div>

      {/* ── Scrollable body ───────────────────────────────────── */}
      <div className="home-body" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="home-hero-title" style={{
            fontSize: 22, fontWeight: 800, color: '#111827',
            margin: '0 0 6px', letterSpacing: '-0.5px',
          }}>
            Welcome back 👋
          </h1>
          <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
            Manage your credit card onboarding journeys — configure stages, preview flows, and publish to production.
          </p>
        </div>

        {/* Stats row */}
        <div className="home-stats-grid" style={{ marginBottom: 36 }}>
          {stats.map((s, i) => <StatCard key={i} stat={s} />)}
        </div>

        {/* Programs header */}
        <div className="home-section-header" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 3px', letterSpacing: '-0.2px' }}>
              Your Programs
            </h2>
            <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>
              Click <strong style={{ color: '#2563EB', fontWeight: 600 }}>Configure</strong> to open the journey editor
            </p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#6B7280',
            backgroundColor: '#F3F4F6', borderRadius: 20, padding: '4px 12px',
            border: '1px solid #E5E7EB',
          }}>
            {programs.length} program{programs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Programs grid */}
        <div className="home-programs-grid">
          {programs.map(prog => <ProgramCard key={prog.id} prog={prog} onOpen={onOpen} />)}
          <CreateCard onClick={() => setShowNewModal(true)} />
        </div>

        <p style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'center', marginTop: 44, paddingBottom: 8 }}>
          Hyperface Studio · No-Code LOS Configurator · v2.4.0
        </p>
      </div>

      {/* New Program Modal */}
      {showNewModal && (
        <NewProgramModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ stat: s }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: '18px 20px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
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
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.8px' }}>
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
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{s.sub}</p>
      </div>
    </div>
  )
}

// ─── Program card ─────────────────────────────────────────────────────────────

function ProgramCard({ prog, onOpen }) {
  const [hovered, setHovered] = useState(false)
  const isLive    = prog.status === 'Live'
  /* Built-in programs map to their own clientId; custom ones use 'hdfc' as template */
  const builtinIds = ['hdfc', 'slice', 'jupiter']
  const openArgs  = builtinIds.includes(prog.id)
    ? [prog.id]
    : ['hdfc', prog.name]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        border: `1px solid ${hovered ? '#DBEAFE' : '#E5E7EB'}`,
        boxShadow: hovered
          ? '0 8px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${prog.gradFrom} 0%, ${prog.gradTo} 100%)` }} />

      <div style={{ padding: '18px 20px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            backgroundColor: prog.bg, border: `1px solid ${prog.gradFrom}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: prog.color }}>{prog.initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 3px', lineHeight: 1.3, letterSpacing: '-0.1px' }}>
              {prog.name}
            </p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, fontWeight: 500 }}>{prog.bank}</p>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, flexShrink: 0,
            color: isLive ? '#065F46' : '#78350F',
            backgroundColor: isLive ? '#D1FAE5' : '#FEF3C7',
            border: `1px solid ${isLive ? '#A7F3D0' : '#FDE68A'}`,
            borderRadius: 20, padding: '3px 9px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              width: 5.5, height: 5.5, borderRadius: '50%',
              backgroundColor: isLive ? '#10B981' : '#D97706', display: 'inline-block',
              animation: isLive ? 'livePulse 2s ease-in-out infinite' : 'none',
            }} />
            {prog.status}
          </span>
        </div>

        <div style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 14 }} />

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
          {[
            { label: 'Applications (7d)', value: prog.applications },
            { label: 'Conversion Rate',   value: prog.conversion  },
            { label: 'Active Stages',     value: `${prog.enabledStages} / ${prog.stages}` },
            { label: 'Last Modified',     value: prog.lastModified },
          ].map((m, i) => (
            <div key={i}>
              <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {m.label}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', margin: 0 }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={() => onOpen(...openArgs)}
            style={{
              flex: 1, height: 36, fontSize: 12.5, fontWeight: 600, color: '#fff',
              background: `linear-gradient(135deg, ${prog.gradFrom} 0%, ${prog.gradTo} 100%)`,
              border: 'none', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontFamily: 'inherit', boxShadow: `0 2px 8px ${prog.color}25`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 14px ${prog.color}40` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 8px ${prog.color}25` }}
          >
            Configure
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button title="Analytics" style={{
            width: 36, height: 36, border: '1px solid #E5E7EB', borderRadius: 8,
            backgroundColor: '#F9FAFB', cursor: 'pointer', color: '#9CA3AF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = prog.bg; e.currentTarget.style.borderColor = prog.gradFrom + '50'; e.currentTarget.style.color = prog.color }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#9CA3AF' }}
          >
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="7.5"   width="2.5" height="4.5" rx="0.6" fill="currentColor" opacity="0.45"/>
              <rect x="5.2" y="4.5" width="2.5" height="7.5" rx="0.6" fill="currentColor" opacity="0.7"/>
              <rect x="9.5" y="2"   width="2.5" height="10"  rx="0.6" fill="currentColor"/>
            </svg>
          </button>

          <button title="More options" style={{
            width: 36, height: 36, border: '1px solid #E5E7EB', borderRadius: 8,
            backgroundColor: '#F9FAFB', cursor: 'pointer', color: '#9CA3AF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#6B7280' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#9CA3AF' }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
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

function CreateCard({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#F9FAFB' : '#FFFFFF',
        borderRadius: 14,
        border: `1.5px dashed ${hovered ? '#93C5FD' : '#D1D5DB'}`,
        padding: '32px 20px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
        transition: 'all 0.2s', textAlign: 'center', fontFamily: 'inherit',
        minHeight: 220,
        boxShadow: hovered ? '0 4px 16px rgba(37,99,235,0.06)' : 'none',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: hovered ? 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 12px rgba(37,99,235,0.12)' : 'none',
      }}>
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path d="M11 3v16M3 11h16" stroke={hovered ? '#2563EB' : '#9CA3AF'} strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: hovered ? '#1D4ED8' : '#374151', margin: '0 0 6px', letterSpacing: '-0.1px' }}>
          Create New Program
        </p>
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, lineHeight: 1.6, maxWidth: 170 }}>
          Configure a new credit card onboarding journey from scratch
        </p>
      </div>
    </button>
  )
}
