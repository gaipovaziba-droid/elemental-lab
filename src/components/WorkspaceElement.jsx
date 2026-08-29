import { useRef, useEffect, useState } from 'react'
import InfoCard from './InfoCard'

function WorkspaceElement({ uid, element, x, y, isDragOver, pointerDrag, isTooltipTarget }) {
  const ref = useRef(null)
  const [rect, setRect] = useState({ left: 0, top: 0 })
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

  useEffect(() => {
    const updateRect = () => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect()
        setRect({ left: r.left, top: r.top })
      }
    }
    updateRect()
    window.addEventListener('scroll', updateRect, true)
    return () => window.removeEventListener('scroll', updateRect, true)
  }, [x, y])

  return (
    <>
      <div
        ref={ref}
        className={`workspace-element${isDragOver ? ' drag-over' : ''}${isTooltipTarget ? ' tooltip-visible' : ''}`}
        style={{ left: x, top: y, touchAction: 'none' }}
        tabIndex={0}
        role="button"
aria-label={element.name}
      data-uid={uid}
    >
      <span>{element.emoji}</span>
    </div>
      {isTooltipTarget && (
        <InfoCard element={element} x={rect.left} y={rect.top} anchor="workspace" />
      )}
    </>
  )
}

export default WorkspaceElement