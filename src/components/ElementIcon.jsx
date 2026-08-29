import { useRef, useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import { ELEMENTS } from '../data/engine'

function ElementIcon({ elementId, name, emoji, payload, pointerDrag }) {
  const ref = useRef(null)
  const [rect, setRect] = useState({ left: 0, top: 0 })
  const isTooltipTarget = pointerDrag.tooltipTarget === payload
  const element = ELEMENTS[elementId]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerLeave } = pointerDrag
    el.addEventListener('pointerdown', (e) => handlePointerDown(e, payload))
    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('pointerup', handlePointerUp)
    el.addEventListener('pointerleave', handlePointerLeave)
    el.addEventListener('pointercancel', handlePointerUp)
    const updateRect = () => {
      const r = el.getBoundingClientRect()
      setRect({ left: r.left, top: r.top })
    }
    updateRect()
    window.addEventListener('scroll', updateRect, true)
    return () => {
      el.removeEventListener('pointerdown', handlePointerDown)
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerup', handlePointerUp)
      el.removeEventListener('pointerleave', handlePointerLeave)
      el.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [payload, pointerDrag])

  return (
    <>
      <div
        ref={ref}
        className={`element-icon${isTooltipTarget ? ' tooltip-visible' : ''}`}
        tabIndex={0}
        role="button"
        aria-label={name}
        style={{ touchAction: 'none' }}
      >
        <span>{emoji}</span>
      </div>
      {isTooltipTarget && element && (
        <InfoCard element={element} x={rect.left} y={rect.top} anchor="sidebar" />
      )}
    </>
  )
}

export default ElementIcon