import { useRef, useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import { ELEMENTS } from '../data/engine'
import { isKeyboardActivationKey } from '../hooks/pointerInteraction'

function ElementIcon({
  elementId,
  name,
  emoji,
  payload,
  pointerDrag,
  selected,
  onActivate,
  onCancelSelection,
}) {
  const ref = useRef(null)
  const [rect, setRect] = useState({ left: 0, top: 0 })
  const tooltipTarget = pointerDrag.tooltipTarget
  const isTooltipTarget = tooltipTarget?.type === 'sidebar'
    && tooltipTarget.elementId === elementId
  const element = ELEMENTS[elementId]
  const iconSrc = element?.icon
    ? new URL(`../../assets/icons/${element.icon}`, import.meta.url).href
    : null

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const {
      handlePointerEnter,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handlePointerCancel,
      handlePointerLeave,
    } = pointerDrag
    const updateRect = () => {
      const r = el.getBoundingClientRect()
      setRect({ left: r.left, top: r.top })
    }
    const onPointerEnter = (e) => {
      updateRect()
      handlePointerEnter(e, payload)
    }
    const onPointerDown = (e) => {
      updateRect()
      handlePointerDown(e, payload)
    }

    el.addEventListener('pointerenter', onPointerEnter)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('pointerup', handlePointerUp)
    el.addEventListener('pointerleave', handlePointerLeave)
    el.addEventListener('pointercancel', handlePointerCancel)
    updateRect()
    window.addEventListener('scroll', updateRect, true)
    return () => {
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerup', handlePointerUp)
      el.removeEventListener('pointerleave', handlePointerLeave)
      el.removeEventListener('pointercancel', handlePointerCancel)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [
    payload.type,
    payload.elementId,
    pointerDrag.handlePointerEnter,
    pointerDrag.handlePointerDown,
    pointerDrag.handlePointerMove,
    pointerDrag.handlePointerUp,
    pointerDrag.handlePointerCancel,
    pointerDrag.handlePointerLeave,
  ])

  const handleKeyDown = (event) => {
    if (isKeyboardActivationKey(event.key)) {
      event.preventDefault()
      event.stopPropagation()
      onActivate(payload, { inputMethod: 'keyboard' })
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onCancelSelection()
    }
  }

  return (
    <>
      <div
        ref={ref}
        className={`element-icon${selected ? ' selected' : ''}${isTooltipTarget ? ' tooltip-visible' : ''}`}
        tabIndex={0}
        role="button"
        aria-label={selected
          ? `${name} selected — activate again to cancel`
          : `${name} — select to place in laboratory`}
        aria-pressed={selected}
        aria-describedby="lab-instructions"
        onKeyDown={handleKeyDown}
        onFocus={() => pointerDrag.handleFocus(payload)}
        onBlur={pointerDrag.handleBlur}
        style={{ touchAction: 'none' }}
      >
        {emoji ? (
          <span>{emoji}</span>
        ) : (
          iconSrc ? (
            <img src={iconSrc} alt={name} width={28} height={28} />
          ) : (
            <span />
          )
        )}
      </div>
      {isTooltipTarget && element && (
        <InfoCard element={element} x={rect.left} y={rect.top} anchor="sidebar" />
      )}
    </>
  )
}

export default ElementIcon
