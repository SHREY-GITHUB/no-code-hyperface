function DragHandle() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      className="shrink-0"
      style={{ color: '#94A3B8', cursor: 'grab' }}
    >
      <circle cx="4.5" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="7"   r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="7"   r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="10.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={(e) => { e.stopPropagation(); onChange() }}
      className="relative shrink-0"
      style={{
        width: 32, height: 18, borderRadius: 9,
        backgroundColor: enabled ? '#3B82F6' : '#CBD5E1',
        border: 'none', cursor: 'pointer', padding: 0,
        transition: 'background-color 0.15s',
      }}
    >
      <span
        style={{
          position: 'absolute', top: 2, left: 2,
          width: 14, height: 14, borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transform: enabled ? 'translateX(14px)' : 'translateX(0)',
          transition: 'transform 0.15s',
          display: 'block',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

export default function StageItem({
  stage, isSelected, onSelect,
  isDragging, isDropTarget,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onToggle,
}) {
  // The <li> itself is the drop target but NOT draggable.
  // Only the drag handle span is draggable — this gives proper grab-cursor UX.
  return (
    <li
      onClick={onSelect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="flex items-center gap-2.5 cursor-pointer"
      style={{
        backgroundColor: isSelected ? '#1E3A5F' : 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: '10px 12px',
        border: isDropTarget
          ? '1.5px solid #60A5FA'
          : isSelected
          ? '1.5px solid #3B82F6'
          : '1.5px solid transparent',
        borderLeft: isDropTarget
          ? '3px solid #60A5FA'
          : isSelected
          ? '1.5px solid #3B82F6'
          : '1.5px solid transparent',
        opacity: isDragging ? 0.35 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging
          ? '0 8px 24px rgba(59,130,246,0.25)'
          : isDropTarget
          ? '0 0 0 3px rgba(59,130,246,0.15)'
          : 'none',
        transition: 'background-color 0.15s, border-color 0.15s, opacity 0.15s, transform 0.15s, box-shadow 0.15s',
        userSelect: 'none',
        listStyle: 'none',
      }}
    >
      {/* Drag handle — ONLY this span is draggable */}
      <span
        draggable
        onDragStart={onDragStart}
        title="Drag to reorder"
        style={{ display: 'flex', alignItems: 'center', cursor: 'grab' }}
        onClick={e => e.stopPropagation()}  /* prevent li click when grabbing */
      >
        <DragHandle />
      </span>

      <span
        className="flex-1 select-none"
        style={{
          fontSize: 13,
          color: isSelected ? '#93C5FD' : '#94A3B8',
          fontWeight: isSelected ? 600 : 400,
          transition: 'color 0.15s',
        }}
      >
        {stage.name}
      </span>
      <Toggle enabled={stage.enabled} onChange={onToggle} />
    </li>
  )
}
