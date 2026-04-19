import { useState } from 'react'
import StageItem from './StageItem'

export default function LeftPanel({ stages, setStages, selectedStage, onSelectStage, onHome, onPublish }) {
  const [draggingIdx, setDraggingIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

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
        width: 260,
        background: 'linear-gradient(180deg, #0F172A 0%, #0C1322 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <div
        onClick={onHome}
        title="Back to Home"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '18px 20px 16px',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(59,130,246,0.4)',
        }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1 }}>H</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.1px' }}>
            Hyperface Studio
          </p>
          <p style={{ fontSize: 10, color: '#475569', margin: 0, marginTop: 1 }}>
            Journey Configurator
          </p>
        </div>
      </div>

      {/* Journey Stages */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: '16px 12px 8px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0,
          }}>
            Journey Stages
          </p>
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: '#3B82F6',
            backgroundColor: 'rgba(59,130,246,0.12)',
            borderRadius: 10, padding: '2px 7px',
          }}>
            {liveCount}/{stages.length}
          </span>
        </div>

        {/* Stage list */}
        <ul style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
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

        <p style={{ fontSize: 10, color: '#334155', margin: '10px 4px 0', letterSpacing: '0.01em' }}>
          ⠿ Drag to reorder stages
        </p>
      </div>

      {/* Bottom: publish button */}
      <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onPublish}
          style={{
            width: '100%', height: 42,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: 10, fontSize: 13, fontWeight: 700,
            color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'inherit',
            boxShadow: '0 2px 12px rgba(59,130,246,0.35)',
            transition: 'all 0.15s',
            letterSpacing: '-0.1px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.45)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(59,130,246,0.35)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5v8" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M4.5 4L7 1.5 9.5 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 10v1.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Publish Journey
        </button>
      </div>
    </aside>
  )
}
