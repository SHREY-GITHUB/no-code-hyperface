// Stage number badge colors
const STAGE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B']

function DragHandle() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="4" cy="3"   r="1.1" fill="currentColor"/>
      <circle cx="9" cy="3"   r="1.1" fill="currentColor"/>
      <circle cx="4" cy="6.5" r="1.1" fill="currentColor"/>
      <circle cx="9" cy="6.5" r="1.1" fill="currentColor"/>
      <circle cx="4" cy="10"  r="1.1" fill="currentColor"/>
      <circle cx="9" cy="10"  r="1.1" fill="currentColor"/>
    </svg>
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={(e) => { e.stopPropagation(); onChange() }}
      style={{
        width: 30, height: 17, borderRadius: 9, flexShrink: 0,
        backgroundColor: enabled ? '#3B82F6' : 'rgba(255,255,255,0.12)',
        border: 'none', cursor: 'pointer', padding: 0,
        transition: 'background-color 0.2s',
        position: 'relative',
        boxShadow: enabled ? 'inset 0 1px 3px rgba(0,0,0,0.15)' : 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: 2,
        width: 13, height: 13, borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        transform: enabled ? 'translateX(13px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </button>
  )
}

export default function StageItem({
  stage, index, isSelected, onSelect,
  isDragging, isDropTarget,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onToggle,
}) {
  const accentColor = STAGE_COLORS[index % STAGE_COLORS.length]

  return (
    <li
      onClick={onSelect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '10px 10px',
        borderRadius: 10,
        cursor: 'pointer',
        listStyle: 'none',
        userSelect: 'none',
        backgroundColor: isSelected
          ? 'rgba(59,130,246,0.14)'
          : isDropTarget
          ? 'rgba(59,130,246,0.08)'
          : 'transparent',
        border: isSelected
          ? '1px solid rgba(59,130,246,0.3)'
          : isDropTarget
          ? '1px solid rgba(59,130,246,0.25)'
          : '1px solid transparent',
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging
          ? '0 8px 24px rgba(0,0,0,0.3)'
          : isSelected
          ? '0 2px 8px rgba(59,130,246,0.12)'
          : 'none',
        transition: 'background-color 0.15s, border-color 0.15s, opacity 0.15s, transform 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Drag handle — only this span is draggable */}
      <span
        draggable
        onDragStart={onDragStart}
        onClick={e => e.stopPropagation()}
        title="Drag to reorder"
        style={{
          display: 'flex', alignItems: 'center',
          cursor: 'grab', color: '#334155',
          padding: '1px 2px',
          borderRadius: 4,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#64748B' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#334155' }}
      >
        <DragHandle />
      </span>

      {/* Stage color dot */}
      <span style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        backgroundColor: stage.enabled ? accentColor : '#334155',
        boxShadow: stage.enabled && isSelected ? `0 0 0 3px ${accentColor}25` : 'none',
        transition: 'background-color 0.2s, box-shadow 0.2s',
      }} />

      {/* Stage name */}
      <span
        style={{
          flex: 1,
          fontSize: 12.5, fontWeight: isSelected ? 600 : 400,
          color: isSelected ? '#BFDBFE' : stage.enabled ? '#94A3B8' : '#475569',
          transition: 'color 0.15s',
          letterSpacing: '-0.1px',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {stage.name}
      </span>

      {/* Disabled label */}
      {!stage.enabled && (
        <span style={{
          fontSize: 9, fontWeight: 600, color: '#475569',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 4, padding: '2px 5px',
          border: '1px solid rgba(255,255,255,0.07)',
          letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          OFF
        </span>
      )}

      <Toggle enabled={stage.enabled} onChange={onToggle} />
    </li>
  )
}
