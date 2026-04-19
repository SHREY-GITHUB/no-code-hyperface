import { useState } from 'react'
import StageItem from './StageItem'

export default function LeftPanel({ stages, setStages, selectedStage, onSelectStage, onHome, onPublish }) {
  const [draggingIdx, setDraggingIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  /* ── Drag handlers ── */
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
      setDraggingIdx(null)
      setOverIdx(null)
      return
    }
    const next = [...stages]
    const [removed] = next.splice(draggingIdx, 1)
    next.splice(idx, 0, removed)
    setStages(next)
    setDraggingIdx(null)
    setOverIdx(null)
  }

  function handleDragEnd() {
    setDraggingIdx(null)
    setOverIdx(null)
  }

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{ width: 260, backgroundColor: '#0F172A' }}
    >
      {/* Logo — click to go home */}
      <div
        className="flex items-center gap-2.5 px-5 py-5"
        onClick={onHome}
        title="Back to Home"
        style={{ cursor: 'pointer' }}
      >
        <div
          className="flex items-center justify-center rounded shrink-0"
          style={{ width: 28, height: 28, backgroundColor: '#3B82F6', borderRadius: 7 }}
        >
          <span className="text-white font-bold" style={{ fontSize: 14, lineHeight: 1 }}>H</span>
        </div>
        <span className="text-white font-semibold" style={{ fontSize: 14 }}>Hyperface Studio</span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#1E293B' }} />

      {/* Journey Stages section */}
      <div className="flex flex-col flex-1 px-4 pt-5 overflow-y-auto">
        <p
          className="uppercase tracking-widest mb-3"
          style={{ fontSize: 10, color: '#475569', letterSpacing: '0.1em' }}
        >
          Journey Stages
        </p>

        <ul className="flex flex-col gap-1.5" style={{ padding: 0, margin: 0 }}>
          {stages.map((stage, idx) => (
            <StageItem
              key={stage.id}
              stage={stage}
              isSelected={selectedStage === stage.name}
              onSelect={() => onSelectStage(stage.name)}
              isDragging={draggingIdx === idx}
              isDropTarget={overIdx === idx && draggingIdx !== idx}
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onToggle={() => setStages(prev => prev.map(s => s.id === stage.id ? { ...s, enabled: !s.enabled } : s))}
            />
          ))}
        </ul>

        <p className="mt-3" style={{ fontSize: 11, color: '#334155' }}>
          Drag to reorder stages
        </p>
      </div>

      {/* Publish button */}
      <div className="px-4 pb-5 pt-3">
        <button
          onClick={onPublish}
          style={{
            width: '100%', height: 40,
            backgroundColor: '#3B82F6',
            borderRadius: 8, fontSize: 13, fontWeight: 600,
            color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2563EB' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3B82F6' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5v7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 4L6.5 1.5 9 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 9.5v1A1.5 1.5 0 003 12h7a1.5 1.5 0 001.5-1.5v-1" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Publish Journey
        </button>
      </div>
    </aside>
  )
}
