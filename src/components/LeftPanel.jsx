import { useState } from 'react'
import StageItem from './StageItem'

export default function LeftPanel({ stages, setStages, selectedStage, onSelectStage, onHome, onPublish }) {
  const [draggingIdx, setDraggingIdx] = useState(null)
  const [overIdx,     setOverIdx]     = useState(null)

  function handleDragStart(e, idx) {
    setDraggingIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }
  function handleDragOver(e, idx) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== draggingIdx) setOverIdx(idx)
  }
  function handleDrop(e, idx) {
    e.preventDefault()
    if (draggingIdx === null || draggingIdx === idx) {
      setDraggingIdx(null); setOverIdx(null); return
    }
    const next = [...stages]
    const [removed] = next.splice(draggingIdx, 1)
    next.splice(idx, 0, removed)
    setStages(next)
    setDraggingIdx(null); setOverIdx(null)
  }
  function handleDragEnd() { setDraggingIdx(null); setOverIdx(null) }

  const liveCount = stages.filter(s => s.enabled).length

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{
        width: 256,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
      }}
    >
      {/* ── Logo / Brand ─────────────────────────────────── */}
      <div
        onClick={onHome}
        title="Back to Home"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 18px 14px',
          cursor: 'pointer',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37,99,235,0.28)',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>H</span>
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 700, color: '#111827',
            margin: 0, letterSpacing: '-0.2px', lineHeight: 1.2,
          }}>
            Hyperface Studio
          </p>
          <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, marginTop: 2, fontWeight: 500 }}>
            Journey Configurator
          </p>
        </div>
      </div>

      {/* ── Stage list ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: '14px 10px 8px' }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8, padding: '0 6px',
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0,
          }}>
            Journey Stages
          </p>
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: '#2563EB',
            backgroundColor: '#EFF6FF',
            borderRadius: 8, padding: '1.5px 7px',
            border: '1px solid #DBEAFE',
          }}>
            {liveCount} / {stages.length}
          </span>
        </div>

        {/* Stages */}
        <ul style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {stages.map((stage, idx) => (
            <StageItem
              key={stage.id}
              stage={stage}
              index={idx}
              isSelected={selectedStage === stage.name}
              onSelect={() => onSelectStage(stage.name)}
              isDragging={draggingIdx === idx}
              isDropTarget={overIdx === idx && draggingIdx !== idx}
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onToggle={() => setStages(prev =>
                prev.map(s => s.id === stage.id ? { ...s, enabled: !s.enabled } : s)
              )}
            />
          ))}
        </ul>

        <p style={{
          fontSize: 10, color: '#D1D5DB', margin: '10px 6px 0',
          letterSpacing: '0.01em', userSelect: 'none',
        }}>
          ⠿ Drag to reorder stages
        </p>
      </div>

      {/* ── Footer / Publish ─────────────────────────────── */}
      <div style={{ padding: '12px 10px 18px', borderTop: '1px solid #F3F4F6' }}>
        <button
          onClick={onPublish}
          style={{
            width: '100%', height: 40,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: 9, fontSize: 13, fontWeight: 600,
            color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            fontFamily: 'inherit',
            boxShadow: '0 2px 10px rgba(37,99,235,0.22)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            letterSpacing: '-0.1px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.32)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,99,235,0.22)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5v8"              stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M4.5 4L7 1.5 9.5 4"   stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 10v1.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V10"
                  stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Publish Journey
        </button>
      </div>
    </aside>
  )
}
