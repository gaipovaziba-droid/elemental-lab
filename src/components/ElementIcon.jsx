function ElementIcon({ elementId, name, emoji, onDragStart, onTap, isSelected }) {
  return (
    <div
      className={`element-icon${isSelected ? ' selected' : ''}`}
      draggable="true"
      tabIndex={0}
      role="button"
      aria-label={name}
      aria-pressed={isSelected}
      onDragStart={(e) => {
        onDragStart(e, elementId)
      }}
      onClick={(e) => {
        e.preventDefault()
        onTap(elementId)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onTap(elementId)
        }
      }}
    >
      <span>{emoji}</span>
      <span className="tooltip">{name}</span>
    </div>
  )
}

export default ElementIcon
