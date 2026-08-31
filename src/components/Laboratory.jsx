import { ELEMENTS } from '../data/engine'
import WorkspaceElement from './WorkspaceElement'

function Laboratory({
  laboratoryRef,
  workspace,
  pointerDrag,
  tooltipTarget,
  selection,
  selectionMessage,
  onActivate,
  onLaboratoryActivate,
  onCancelSelection,
  onNudgeWorkspace,
  onRemoveWorkspace,
}) {
  const isTooltipTarget = (uid) => {
    const target = tooltipTarget
    return target && target.type === 'workspace' && target.uid === uid
  }

  const isDragOver = () => false

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onLaboratoryActivate({ inputMethod: 'keyboard' })
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onCancelSelection()
    }
  }

  return (
    <div
      className="laboratory"
      ref={laboratoryRef}
      tabIndex={0}
      role="region"
      aria-label="Laboratory workspace"
      aria-describedby="lab-instructions"
      onKeyDown={handleKeyDown}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`laboratory-hint${workspace.length === 0 ? '' : ' hidden'}`}
        aria-hidden={workspace.length !== 0}
      >
        Drag an element here, or use Enter/Space with the keyboard
      </div>
      {selectionMessage && (
        <div className="laboratory-status" role="status" aria-live="polite">
          {selectionMessage}
        </div>
      )}
      {workspace.map((item) => {
        const element = ELEMENTS[item.elementId]
        if (!element) return null
        return (
          <WorkspaceElement
            key={item.uid}
            uid={item.uid}
            element={element}
            x={item.x}
            y={item.y}
            isDragOver={isDragOver(item.uid)}
            pointerDrag={pointerDrag}
            isTooltipTarget={isTooltipTarget(item.uid)}
            selected={selection?.type === 'workspace' && selection.uid === item.uid}
            onActivate={onActivate}
            onCancelSelection={onCancelSelection}
            onNudgeWorkspace={onNudgeWorkspace}
            onRemoveWorkspace={onRemoveWorkspace}
          />
        )
      })}
    </div>
  )
}

export default Laboratory
