function DragGhost({ emoji, clientX, clientY }) {
  return (
    <div
      className="drag-ghost"
      style={{ left: clientX, top: clientY }}
    >
      <span>{emoji}</span>
    </div>
  )
}

export default DragGhost