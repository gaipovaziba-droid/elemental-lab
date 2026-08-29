import { useRef } from 'react'
import { ELEMENTS } from '../data/engine'
import WorkspaceElement from './WorkspaceElement'

function Laboratory({ workspace, pointerDrag, tooltipTarget }) {
  const labRef = useRef(null)

  // Detect whether a specific uid is the tooltip target
  const isTooltipTarget = (uid) => {
    const t = tooltipTarget
    return t && t.type === 'workspace' && t.uid === uid
  }

  // Detect whether a specific uid is being dragged over
  const isDragOver = (uid) => {
    const ds = pointerDrag.dragState
    if (!ds || !ds.isDragging) return false
    // Should be checked via CSS hover but we can set from the ghost's position
    return false
  }

  return (
    <div
      className="laboratory"
      ref={labRef}
      tabIndex={-1}
      role="region"
      aria-label="Laboratory workspace"
      style={{ touchAction: 'none' }}
    >
      <div
        className={`laboratory-hint${workspace.length === 0 ? '' : ' hidden'}`}
        aria-hidden={workspace.length !== 0}
      >
        Drag elements here to combine
      </div>
      {workspace.map((item) => {
        const el = ELEMENTS[item.elementId]
        if (!el) return null
        return (
          <WorkspaceElement
            key={item.uid}
            uid={item.uid}
            element={el}
            x={item.x}
            y={item.y}
            isDragOver={isDragOver(item.uid)}
            pointerDrag={pointerDrag}
            isTooltipTarget={isTooltipTarget(item.uid)}
          />
        )
      })}
    </div>
  )
}

export default Laboratory