import { useRef, useEffect } from 'react'

function WorkspaceElement({ uid, name, emoji, x, y, isDragOver, pointerDrag, isTooltipTarget }) {
  const ref = useRef(null)
  const payload = { type: 'workspace', uid }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerLeave } = pointerDrag
    el.addEventListener('pointerdown', (e) => handlePointerDown(e, payload))
    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('pointerup', handlePointerUp)
    el.addEventListener('pointerleave', handlePointerLeave)
    el.addEventListener('pointercancel', handlePointerUp)
    return () => {
      el.removeEventListener('pointerdown', handlePointerDown)
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerup', handlePointerUp)
      el.removeEventListener('pointerleave', handlePointerLeave)
      el.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [payload, pointerDrag])

  return (
    <div
      ref={ref}
      className={`workspace-element${isDragOver ? ' drag-over' : ''}${isTooltipTarget ? ' tooltip-visible' : ''}`}
      style={{ left: x, top: y, touchAction: 'none' }}
      tabIndex={0}
      role="button"
      aria-label={name}
      data-uid={uid}
    >
      <span>{emoji}</span>
    </div>
  )
}

export default WorkspaceElement