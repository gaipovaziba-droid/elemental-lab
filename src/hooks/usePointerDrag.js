import { useState, useRef, useCallback, useEffect } from 'react'
import {
  HOVER_TOOLTIP_DELAY,
  finishPointerInteraction,
  pointerMoveTransition,
  scheduleTooltip,
  tooltipDelayFor,
} from './pointerInteraction'

const TOUCH_TOOLTIP_DISMISS_DELAY = 700

export default function usePointerDrag(onDragEndRef) {
  const [dragState, setDragState] = useState(null)
  const [tooltipTarget, setTooltipTarget] = useState(null)
  const dragRef = useRef(null)
  const tooltipTimer = useRef(null)
  const tooltipDismissTimer = useRef(null)
  const hoverRef = useRef(null)
  const originRef = useRef({ x: 0, y: 0 })

  const clearTooltipTimer = useCallback(() => {
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current)
      tooltipTimer.current = null
    }
  }, [])

  const clearTooltipDismissTimer = useCallback(() => {
    if (tooltipDismissTimer.current) {
      clearTimeout(tooltipDismissTimer.current)
      tooltipDismissTimer.current = null
    }
  }, [])

  const hideTooltip = useCallback(() => {
    clearTooltipTimer()
    clearTooltipDismissTimer()
    setTooltipTarget(null)
  }, [clearTooltipDismissTimer, clearTooltipTimer])

  const startTooltipTimer = useCallback((target, delay) => {
    clearTooltipTimer()
    clearTooltipDismissTimer()
    tooltipTimer.current = scheduleTooltip(target, delay, setTimeout, (shownTarget) => {
      setTooltipTarget(shownTarget)
      tooltipTimer.current = null
    })
  }, [clearTooltipDismissTimer, clearTooltipTimer])

  const handlePointerEnter = useCallback((e, payload) => {
    if (e.pointerType !== 'mouse' || dragRef.current) return
    hoverRef.current = {
      payload,
      lastX: e.clientX,
      lastY: e.clientY,
    }
    startTooltipTimer(payload, HOVER_TOOLTIP_DELAY)
  }, [startTooltipTimer])

  const handleFocus = useCallback((payload) => {
    clearTooltipTimer()
    clearTooltipDismissTimer()
    setTooltipTarget(payload)
  }, [clearTooltipDismissTimer, clearTooltipTimer])

  const handleBlur = useCallback(() => {
    if (!dragRef.current) hideTooltip()
  }, [hideTooltip])

  const handlePointerDown = useCallback((e, payload) => {
    if (e.button !== 0 || dragRef.current) return
    e.preventDefault()
    clearTooltipDismissTimer()
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)

    originRef.current = { x: e.clientX, y: e.clientY }
    dragRef.current = {
      payload,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      isDragging: false,
      sourceEl: el,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
    }

    startTooltipTimer(payload, tooltipDelayFor(e.pointerType))
    setDragState({ ...dragRef.current, isDragging: false })
  }, [clearTooltipDismissTimer, startTooltipTimer])

  const handlePointerMove = useCallback((e) => {
    const d = dragRef.current
    if (!d) {
      const hover = hoverRef.current
      if (hover && e.pointerType === 'mouse') {
        const moved = e.clientX !== hover.lastX || e.clientY !== hover.lastY
        if (moved) {
          hover.lastX = e.clientX
          hover.lastY = e.clientY
          setTooltipTarget(null)
          startTooltipTimer(hover.payload, HOVER_TOOLTIP_DELAY)
        }
      }
      return
    }

    if (e.pointerId !== d.pointerId) return

    const dx = e.clientX - originRef.current.x
    const dy = e.clientY - originRef.current.y
    const transition = pointerMoveTransition(d.isDragging, dx, dy)

    if (transition.cancelTooltip) hideTooltip()

    if (!d.isDragging && transition.isDragging) {
      d.isDragging = true
      e.preventDefault()
    }

    if (d.isDragging) {
      e.preventDefault()
      d.lastX = e.clientX
      d.lastY = e.clientY
      setDragState({ ...d })
    }
  }, [hideTooltip, startTooltipTimer])

  const handlePointerUp = useCallback((e) => {
    const d = dragRef.current
    if (!d) return
    if (e.pointerId !== d.pointerId) return

    clearTooltipTimer()

    if (d.isDragging) {
      e.preventDefault()
      finishPointerInteraction(d, e.clientX, e.clientY, onDragEndRef?.current)
    }

    setDragState(null)
    dragRef.current = null

    if (d.isDragging) {
      setTooltipTarget(null)
    } else if (e.pointerType !== 'mouse') {
      clearTooltipDismissTimer()
      tooltipDismissTimer.current = setTimeout(() => {
        setTooltipTarget(null)
        tooltipDismissTimer.current = null
      }, TOUCH_TOOLTIP_DISMISS_DELAY)
    }
  }, [clearTooltipDismissTimer, clearTooltipTimer])

  const handlePointerCancel = useCallback((e) => {
    const d = dragRef.current
    if (d && e.pointerId !== d.pointerId) return
    dragRef.current = null
    hoverRef.current = null
    setDragState(null)
    hideTooltip()
  }, [hideTooltip])

  const handlePointerLeave = useCallback(() => {
    const d = dragRef.current
    hoverRef.current = null
    if (!d || !d.isDragging) hideTooltip()
  }, [hideTooltip])

  useEffect(() => {
    return () => {
      clearTooltipTimer()
      clearTooltipDismissTimer()
    }
  }, [clearTooltipDismissTimer, clearTooltipTimer])

  const resetTooltip = useCallback(() => {
    hoverRef.current = null
    hideTooltip()
  }, [hideTooltip])

  return {
    dragState,
    tooltipTarget,
    handlePointerEnter,
    handleFocus,
    handleBlur,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerLeave,
    resetTooltip,
  }
}
