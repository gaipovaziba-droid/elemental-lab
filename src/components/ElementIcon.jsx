import { useRef, useEffect } from 'react'

function ElementIcon({ elementId, name, emoji, payload, pointerDrag }) {
  const ref = useRef(null)
  const isTooltipTarget = pointerDrag.tooltipTarget === payload

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
      className={`element-icon${isTooltipTarget ? ' tooltip-visible' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={name}
      style={{ touchAction: 'none' }}
    >
      <span>{emoji}</span>
      <span className="tooltip">{name}</span>
    </div>
  )
}

export default ElementIcon