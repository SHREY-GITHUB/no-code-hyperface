import { useState } from 'react'

const TYPE_COLORS = {
  Text:     { bg: '#F0F9FF', color: '#0369A1' },
  Date:     { bg: '#F0FDF4', color: '#166534' },
  Dropdown: { bg: '#FDF4FF', color: '#7E22CE' },
  Number:   { bg: '#FFF7ED', color: '#C2410C' },
}

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" style={{ color: '#CBD5E1' }}>
      <circle cx="4.5" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="7"   r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="7"   r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="10.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function Toggle({ enabled, onChange, colorOn }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className="relative shrink-0"
      style={{
        width: 32,
        height: 18,
        borderRadius: 9,
        backgroundColor: enabled ? colorOn : '#CBD5E1',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'background-color 0.2s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transform: enabled ? 'translateX(14px)' : 'translateX(0)',
          display: 'block',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
        }}
      />
    </button>
  )
}

function TypeBadge({ type }) {
  const { bg, color } = TYPE_COLORS[type] ?? { bg: '#F1F5F9', color: '#475569' }
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        color,
        backgroundColor: bg,
        borderRadius: 4,
        padding: '2px 7px',
      }}
    >
      {type}
    </span>
  )
}

function FieldRow({
  field, onToggleShow, onToggleRequired, pageCount, onMovePage,
  isDragging, isDropTarget,
  onDragStart, onDragOver, onDrop, onDragEnd,
}) {
  const [moveOpen, setMoveOpen] = useState(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={{
        backgroundColor: '#FFFFFF',
        border: isDropTarget ? '2px solid #3B82F6' : '1px solid #E2E8F0',
        borderRadius: 12,
        padding: 16,
        position: 'relative',
        opacity: isDragging ? 0.35 : 1,
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        boxShadow: isDragging ? '0 8px 24px rgba(59,130,246,0.18)' : isDropTarget ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
        transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s, border-color 0.15s',
        cursor: 'grab',
      }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3">
        <DragHandle />

        {/* Name + badge */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1E293B', whiteSpace: 'nowrap' }}>
            {field.name}
          </span>
          <TypeBadge type={field.type} />
          {pageCount > 1 && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#7C3AED',
              backgroundColor: '#F5F3FF', borderRadius: 4, padding: '1px 6px',
            }}>
              pg {field.page ?? 1}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-1.5" style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: 12, color: '#64748B', userSelect: 'none' }}>Show</span>
            <Toggle enabled={field.show} onChange={onToggleShow} colorOn="#22C55E" />
          </label>
          <label className="flex items-center gap-1.5" style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: 12, color: '#64748B', userSelect: 'none' }}>Required</span>
            <Toggle enabled={field.required} onChange={onToggleRequired} colorOn="#3B82F6" />
          </label>

          {/* Move to page dropdown */}
          {pageCount > 1 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMoveOpen(v => !v)}
                title="Move to page"
                style={{
                  height: 28, padding: '0 8px', fontSize: 11, fontWeight: 500,
                  color: '#64748B', border: '1px solid #E2E8F0',
                  borderRadius: 6, backgroundColor: '#F8FAFC', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                Move
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M2 3.5l2.5 2.5L7 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {moveOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 100,
                  backgroundColor: '#fff', border: '1px solid #E2E8F0',
                  borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  overflow: 'hidden', minWidth: 110,
                  animation: 'fadeIn 0.12s ease-out',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', padding: '7px 12px 4px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Move to
                  </p>
                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .filter(p => p !== (field.page ?? 1))
                    .map(p => (
                      <button
                        key={p}
                        onClick={() => { onMovePage(p); setMoveOpen(false) }}
                        style={{
                          width: '100%', padding: '7px 12px', border: 'none',
                          backgroundColor: 'transparent', cursor: 'pointer',
                          textAlign: 'left', fontSize: 12, color: '#1E293B',
                          fontFamily: 'inherit', fontWeight: 500,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        Page {p}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      {field.hint && (
        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 8, marginLeft: 20 }}>
          {field.hint}
        </p>
      )}
    </div>
  )
}

// ─── Validation Rules tab ─────────────────────────────────────────────────────

const INITIAL_RULES = [
  {
    id: 1,
    label: 'Age Range',
    description: 'Applicant must be within the specified age range',
    type: 'range',
    min: 21, max: 65, unit: 'years',
    enabled: true,
  },
  {
    id: 2,
    label: 'Minimum Monthly Income',
    description: 'Applicant must earn at least this amount per month',
    type: 'min',
    value: 25000, unit: '₹',
    enabled: true,
  },
  {
    id: 3,
    label: 'Mobile Number Format',
    description: 'Must be a valid 10-digit Indian mobile number starting with 6–9',
    type: 'pattern',
    pattern: '^[6-9]\\d{9}$',
    display: '10-digit Indian mobile',
    enabled: true,
  },
  {
    id: 4,
    label: 'PAN Card Format',
    description: 'Must match the standard PAN format',
    type: 'pattern',
    pattern: '^[A-Z]{5}[0-9]{4}[A-Z]$',
    display: 'AAAAA9999A',
    enabled: true,
  },
]

const RULE_TYPE_COLORS = {
  range:   { bg: '#EFF6FF', color: '#1D4ED8', label: 'Range' },
  min:     { bg: '#F0FDF4', color: '#15803D', label: 'Min Value' },
  pattern: { bg: '#FDF4FF', color: '#7E22CE', label: 'Pattern' },
}

function RuleCard({ rule, onToggle }) {
  const chip = RULE_TYPE_COLORS[rule.type]
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: `1px solid ${rule.enabled ? '#E2E8F0' : '#F1F5F9'}`,
        borderRadius: 12,
        padding: 16,
        opacity: rule.enabled ? 1 : 0.55,
        transition: 'opacity 0.2s, border-color 0.2s',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Left: label + chip + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{rule.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: chip.color,
              backgroundColor: chip.bg, borderRadius: 4, padding: '2px 7px',
            }}>
              {chip.label}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 10px', lineHeight: 1.5 }}>
            {rule.description}
          </p>

          {/* Value display */}
          {rule.type === 'range' && (
            <div className="flex items-center gap-2">
              <ValueChip label="Min" value={`${rule.min} ${rule.unit}`} />
              <span style={{ fontSize: 12, color: '#CBD5E1' }}>–</span>
              <ValueChip label="Max" value={`${rule.max} ${rule.unit}`} />
            </div>
          )}
          {rule.type === 'min' && (
            <ValueChip label="Minimum" value={`${rule.unit}${rule.value.toLocaleString()}/month`} />
          )}
          {rule.type === 'pattern' && (
            <ValueChip label="Format" value={rule.display} mono />
          )}
        </div>

        {/* Right: toggle */}
        <button
          role="switch"
          aria-checked={rule.enabled}
          onClick={onToggle}
          className="relative shrink-0"
          style={{
            width: 32, height: 18, borderRadius: 9,
            backgroundColor: rule.enabled ? '#3B82F6' : '#CBD5E1',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'background-color 0.15s',
          }}
        >
          <span style={{
            position: 'absolute', top: 2, left: 2,
            width: 14, height: 14, borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            transform: rule.enabled ? 'translateX(14px)' : 'translateX(0)',
            transition: 'transform 0.15s',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>
    </div>
  )
}

function ValueChip({ label, value, mono }) {
  return (
    <div className="flex items-center gap-1.5" style={{
      backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
      borderRadius: 6, padding: '4px 10px', display: 'inline-flex',
    }}>
      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{label}:</span>
      <span style={{
        fontSize: 12, color: '#1E293B', fontWeight: 600,
        fontFamily: mono ? 'ui-monospace, "Cascadia Code", monospace' : 'inherit',
      }}>
        {value}
      </span>
    </div>
  )
}

function ValidationRules() {
  const [rules, setRules] = useState(INITIAL_RULES)

  function toggleRule(id) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 16px', lineHeight: 1.6 }}>
        These rules are enforced automatically when applicants submit the form. Disable a rule to skip that validation.
      </p>
      <div className="flex flex-col" style={{ gap: 10 }}>
        {rules.map(rule => (
          <RuleCard key={rule.id} rule={rule} onToggle={() => toggleRule(rule.id)} />
        ))}
      </div>
    </div>
  )
}

export default function ApplicationFormSettings({ fields, setFields }) {
  const [activeTab, setActiveTab] = useState('fields')
  // Derive pageCount from fields — at least 1
  const derivedPageCount = Math.max(1, ...fields.map(f => f.page ?? 1))
  const [pageCount, setPageCount] = useState(derivedPageCount)
  const [activePage, setActivePage] = useState(1)

  // ── Field drag-and-drop state ────────────────────────────────────────────
  const [draggingFieldId, setDraggingFieldId] = useState(null)
  const [overFieldId, setOverFieldId]         = useState(null)

  function handleFieldDragStart(e, id) {
    setDraggingFieldId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleFieldDragOver(e, id) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (id !== draggingFieldId) setOverFieldId(id)
  }

  function handleFieldDrop(e, id) {
    e.preventDefault()
    if (draggingFieldId === null || draggingFieldId === id) {
      setDraggingFieldId(null)
      setOverFieldId(null)
      return
    }
    // Reorder only the fields on activePage; leave other-page fields in place
    setFields(prev => {
      const pageFieldIds = prev
        .filter(f => (f.page ?? 1) === activePage)
        .map(f => f.id)
      const fromIdx = pageFieldIds.indexOf(draggingFieldId)
      const toIdx   = pageFieldIds.indexOf(id)
      if (fromIdx === -1 || toIdx === -1) return prev

      const reordered = [...pageFieldIds]
      const [removed] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, removed)

      const pageFieldMap = Object.fromEntries(
        prev.filter(f => (f.page ?? 1) === activePage).map(f => [f.id, f])
      )
      const reorderedPageFields = reordered.map(fid => pageFieldMap[fid])

      // Reconstruct full array, replacing page-fields in-order
      let pageIdx = 0
      return prev.map(f =>
        (f.page ?? 1) === activePage ? reorderedPageFields[pageIdx++] : f
      )
    })
    setDraggingFieldId(null)
    setOverFieldId(null)
  }

  function handleFieldDragEnd() {
    setDraggingFieldId(null)
    setOverFieldId(null)
  }

  function toggleShow(id) {
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, show: !f.show } : f))
  }

  function toggleRequired(id) {
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, required: !f.required } : f))
  }

  function moveToPage(fieldId, targetPage) {
    setFields((prev) => prev.map((f) => f.id === fieldId ? { ...f, page: targetPage } : f))
  }

  function addPage() {
    if (pageCount >= 4) return
    setPageCount(c => c + 1)
    setActivePage(pageCount + 1)
  }

  function removePage(pageNum) {
    // Move all fields on this page to page 1
    setFields(prev => prev.map(f => (f.page ?? 1) === pageNum ? { ...f, page: 1 } : f))
    // Renumber pages above the removed page
    if (pageNum < pageCount) {
      setFields(prev => prev.map(f => (f.page ?? 1) > pageNum ? { ...f, page: (f.page ?? 1) - 1 } : f))
    }
    setPageCount(c => c - 1)
    if (activePage >= pageNum) setActivePage(Math.max(1, pageNum - 1))
  }

  const pageFields = fields.filter(f => (f.page ?? 1) === activePage)

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '28px 32px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0, marginBottom: 6 }}>
            Application Form
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
            Configure fields, multi-page layout, and validation rules for the applicant form.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: '1px solid #E2E8F0', marginBottom: 24, gap: 0 }}
        >
          {['Fields', 'Validation Rules'].map((tab) => {
            const key = tab === 'Fields' ? 'fields' : 'validation'
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#3B82F6' : '#64748B',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                  padding: '0 4px 10px',
                  marginRight: 24,
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'fields' ? (
          <div>
            {/* ─── Page management strip ─────────────────── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              padding: '10px 14px',
              backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#94A3B8', flexShrink: 0 }}>
                <rect x="1.5" y="1.5" width="4.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1.5" y="9" width="4.5" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="8" y="1.5" width="4.5" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="8" y="7" width="4.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginRight: 4 }}>Pages</span>

              {/* Page tabs */}
              <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <button
                      onClick={() => setActivePage(p)}
                      style={{
                        height: 26, padding: '0 12px', fontSize: 12, fontWeight: 500,
                        border: 'none', borderRadius: pageCount > 1 && p === activePage ? '6px 0 0 6px' : 6,
                        cursor: 'pointer',
                        backgroundColor: activePage === p ? '#3B82F6' : '#E2E8F0',
                        color: activePage === p ? '#fff' : '#64748B',
                        transition: 'background-color 0.15s, color 0.15s',
                      }}
                    >
                      Page {p}
                      <span style={{
                        marginLeft: 5, fontSize: 10, fontWeight: 600,
                        opacity: 0.75,
                      }}>
                        ({fields.filter(f => (f.page ?? 1) === p).length})
                      </span>
                    </button>
                    {pageCount > 1 && p === activePage && p !== 1 && (
                      <button
                        onClick={() => removePage(p)}
                        title={`Remove Page ${p} (moves fields to Page 1)`}
                        style={{
                          height: 26, width: 22, padding: 0, fontSize: 11, fontWeight: 600,
                          border: 'none', borderRadius: '0 6px 6px 0',
                          cursor: 'pointer',
                          backgroundColor: '#DC2626', color: '#fff',
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add page button */}
              {pageCount < 4 && (
                <button
                  onClick={addPage}
                  style={{
                    height: 26, padding: '0 10px', fontSize: 11, fontWeight: 600,
                    color: '#3B82F6', border: '1.5px dashed #93C5FD',
                    borderRadius: 6, backgroundColor: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1.5v7M1.5 5h7" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Add Page
                </button>
              )}
            </div>

            {/* Page description hint */}
            {pageCount > 1 && (
              <p style={{ fontSize: 11, color: '#94A3B8', margin: '-8px 0 14px', lineHeight: 1.5 }}>
                Fields on <strong>Page {activePage}</strong> — use the <strong>Move</strong> button to reassign a field to a different page.
              </p>
            )}

            {/* Fields for current page */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              {pageFields.length === 0 ? (
                <div style={{
                  padding: '24px', textAlign: 'center',
                  border: '1.5px dashed #E2E8F0', borderRadius: 12,
                  backgroundColor: '#F8FAFC',
                }}>
                  <p style={{ fontSize: 13, color: '#CBD5E1', margin: 0 }}>
                    No fields on Page {activePage} — use <strong>Move</strong> on a field to place it here.
                  </p>
                </div>
              ) : (
                pageFields.map((field) => (
                  <FieldRow
                    key={field.id}
                    field={field}
                    onToggleShow={() => toggleShow(field.id)}
                    onToggleRequired={() => toggleRequired(field.id)}
                    pageCount={pageCount}
                    onMovePage={(targetPage) => moveToPage(field.id, targetPage)}
                    isDragging={draggingFieldId === field.id}
                    isDropTarget={overFieldId === field.id && draggingFieldId !== field.id}
                    onDragStart={e => handleFieldDragStart(e, field.id)}
                    onDragOver={e => handleFieldDragOver(e, field.id)}
                    onDrop={e => handleFieldDrop(e, field.id)}
                    onDragEnd={handleFieldDragEnd}
                  />
                ))
              )}
            </div>

            {/* Add Field */}
            <button
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%', marginTop: 12, marginBottom: 28, padding: '11px 0',
                fontSize: 13, fontWeight: 500, color: '#3B82F6',
                background: 'none', border: '1.5px dashed #93C5FD',
                borderRadius: 10, cursor: 'pointer',
                transition: 'background-color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Add Field to Page {activePage}
            </button>
          </div>
        ) : (
          <ValidationRules />
        )}
      </div>

      {/* Bottom action bar — sticks to bottom */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{
          padding: '12px clamp(16px, 4vw, 32px)',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>Changes are saved automatically</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#64748B',
              background: 'none',
              border: '1px solid #CBD5E1',
              borderRadius: 8,
              padding: '7px 16px',
              cursor: 'pointer',
            }}
          >
            Reset to Default
          </button>
          <button
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: '#3B82F6',
              border: 'none',
              borderRadius: 8,
              padding: '7px 16px',
              cursor: 'pointer',
            }}
          >
            Save Stage
          </button>
        </div>
      </div>
    </div>
  )
}
