// Per-stage accent colors
const STAGE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706']

function DragHandle() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="3.5" cy="2.5"  r="1" fill="currentColor"/>
      <circle cx="8.5" cy="2.5"  r="1" fill="currentColor"/>
      <circle cx="3.5" cy="6"    r="1" fill="currentColor"/>
      <circle cx="8.5" cy="6"    r="1" fill="currentColor"/>
      <circle cx="3.5" cy="9.5"  r="1" fill="currentColor"/>
      <circle cx="8.5" cy="9.5"  r="1" fill="currentColor"/>
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
        width: 28, height: 16, borderRadius: 8, flexShrink: 0,
        backgroundColor: enabled ? '#2563EB' : '#E2E8F0',
        border: 'none', cursor: 'pointer', padding: 0,
        transition: 'background-color 0.2s',
        position: 'relative',
        boxShadow: enabled
          ? 'inset 0 1px 3px rgba(37,99,235,0.3)'
          : 'inset 0 1px 2px rgba(0,0,0,0.08)',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: 2,
        width: 12, height: 12, borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        transform: enabled ? 'translateX(12px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'block',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
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
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        listStyle: 'none',
        userSelect: 'none',
        backgroundColor: isSelected
          ? '#EFF6FF'
          : isDropTarget
          ? '#F0F9FF'
          : 'transparent',
        border: isSelected
          ? '1px solid #BFDBFE'
          : isDropTarget
          ? '1px solid #BAE6FD'
          : '1px solid transparent',
        opacity: isDragging ? 0.45 : 1,
        boxShadow: isSelected ? '0 1px 3px rgba(37,99,235,0.07)' : 'none',
        transition: 'background-color 0.14s, border-color 0.14s, opacity 0.14s, box-shadow 0.14s',
      }}
      onMouseEnter={e => {
        if (!isSelected && !isDragging) e.currentTarget.style.backgroundColor = '#F8FAFC'
      }}
      onMouseLeave={e => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {/* Drag handle — only this span initiates drag */}
      <span
        draggable
        onDragStart={onDragStart}
        onClick={e => e.stopPropagation()}
        title="Drag to reorder"
        style={{
          display: 'flex', alignItems: 'center',
          cursor: 'grab', color: '#D1D5DB',
          padding: '1px 1px',
          borderRadius: 3,
          transition: 'color 0.14s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#9CA3AF' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB' }}
      >
        <DragHandle />
      </span>

      {/* Stage accent dot */}
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        backgroundColor: stage.enabled ? accentColor : '#D1D5DB',
        boxShadow: stage.enabled && isSelected ? `0 0 0 3px ${accentColor}18` : 'none',
        transition: 'background-color 0.2s, box-shadow 0.2s',
      }} />

      {/* Stage name */}
      <span style={{
        flex: 1,
        fontSize: 12.5,
        fontWeight: isSelected ? 600 : 500,
        color: isSelected
          ? '#1D4ED8'
          : stage.enabled
          ? '#374151'
          : '#9CA3AF',
        transition: 'color 0.14s',
        letterSpacing: '-0.1px',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {stage.name}
      </span>

      {/* Disabled badge */}
      {!stage.enabled && (
        <span style={{
          fontSize: 9, fontWeight: 600, color: '#9CA3AF',
          backgroundColor: '#F3F4F6',
          borderRadius: 4, padding: '1.5px 5px',
          border: '1px solid #E5E7EB',
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
