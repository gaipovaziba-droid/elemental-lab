import { useRef, useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import { isKeyboardActivationKey } from '../hooks/pointerInteraction'

function WorkspaceElement({
  uid,
  element,
  x,
  y,
  isDragOver,
  pointerDrag,
  isTooltipTarget,
  selected,
  onActivate,
  onCancelSelection,
  onNudgeWorkspace,
  onRemoveWorkspace,
}) {
  const ref = useRef(null)
  const [rect, setRect] = useState({ left: 0, top: 0 })
  const payload = { type: 'workspace', uid }

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
    return () => {
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerup', handlePointerUp)
      el.removeEventListener('pointerleave', handlePointerLeave)
      el.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [
    payload.type,
    payload.uid,
    pointerDrag.handlePointerEnter,
    pointerDrag.handlePointerDown,
    pointerDrag.handlePointerMove,
    pointerDrag.handlePointerUp,
    pointerDrag.handlePointerCancel,
    pointerDrag.handlePointerLeave,
  ])

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

  const handleKeyDown = (event) => {
    if (isKeyboardActivationKey(event.key)) {
      event.preventDefault()
      event.stopPropagation()
      onActivate(payload, { inputMethod: 'keyboard' })
      return
    }

    const step = event.shiftKey ? 24 : 8
    const movement = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[event.key]

    if (movement) {
      event.preventDefault()
      event.stopPropagation()
      onNudgeWorkspace(uid, movement[0], movement[1])
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      event.stopPropagation()
      onRemoveWorkspace(uid)
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
        className={`workspace-element${selected ? ' selected' : ''}${isDragOver ? ' drag-over' : ''}${isTooltipTarget ? ' tooltip-visible' : ''}`}
        style={{ left: x, top: y, touchAction: 'none' }}
        tabIndex={0}
        role="button"
        aria-label={selected
          ? `${element.name} selected — choose another element to combine; use arrow keys to move`
          : `${element.name} — select to combine; use arrow keys to move`}
        aria-pressed={selected}
        aria-describedby="lab-instructions"
        data-uid={uid}
        onKeyDown={handleKeyDown}
        onFocus={() => pointerDrag.handleFocus(payload)}
        onBlur={pointerDrag.handleBlur}
        onClick={(event) => event.stopPropagation()}
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
