function WorkspaceElement({ uid, name, emoji, x, y, isDragOver, isSelected, onDragOver, onDragLeave, onDrop, onTap, isTouchDevice }) {
  return (
    <div
      className={`workspace-element${isDragOver ? ' drag-over' : ''}${isSelected ? ' selected' : ''}`}
      style={{ left: x, top: y }}
      draggable={!isTouchDevice}
      tabIndex={0}
      role="button"
      aria-label={name}
      aria-pressed={isSelected}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(uid))
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed === 'copy'
          ? 'copy'
          : 'move'
        onDragOver()
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        onDragLeave()
      }}
      onDrop={(e) => {
        onDrop(e)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onTap()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onTap()
        }
      }}
    >
      <span>{emoji}</span>
    </div>
  )
}

export default WorkspaceElement
