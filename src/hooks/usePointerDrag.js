import { useState, useRef, useCallback, useEffect } from 'react'

const DRAG_THRESHOLD = 5
const HOVER_TOOLTIP_DELAY = 2000
const LONGPRESS_TOOLTIP_DELAY = 3000

export default function usePointerDrag(onDragEndRef) {
  const [dragState, setDragState] = useState(null)
  const [tooltipTarget, setTooltipTarget] = useState(null)
  const dragRef = useRef(null)
  const tooltipTimer = useRef(null)
  const originRef = useRef({ x: 0, y: 0 })

  const clearTooltipTimer = useCallback(() => {
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current)
      tooltipTimer.current = null
    }
  }, [])

  const startTooltipTimer = useCallback((target) => {
    clearTooltipTimer()
    const isHover = window.matchMedia('(hover: hover)').matches
    const delay = isHover ? HOVER_TOOLTIP_DELAY : LONGPRESS_TOOLTIP_DELAY
    tooltipTimer.current = setTimeout(() => {
      setTooltipTarget(target)
      tooltipTimer.current = null
    }, delay)
  }, [clearTooltipTimer])

  const handlePointerDown = useCallback((e, payload) => {
    if (e.button !== 0) return
    e.preventDefault()
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
    }

    startTooltipTimer(payload)
    setDragState({ ...dragRef.current, isDragging: false })
  }, [startTooltipTimer])

  const handlePointerMove = useCallback((e) => {
    const d = dragRef.current
    if (!d) return

    const dx = e.clientX - originRef.current.x
    const dy = e.clientY - originRef.current.y

    if (!d.isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      clearTooltipTimer()
      setTooltipTarget(null)
      d.isDragging = true
      e.preventDefault()
    }

    if (d.isDragging) {
      e.preventDefault()
      d.lastX = e.clientX
      d.lastY = e.clientY
      setDragState({ ...d })
    }
  }, [clearTooltipTimer])

  const handlePointerUp = useCallback((e) => {
    const d = dragRef.current
    if (!d) return

    clearTooltipTimer()

    if (d.isDragging && onDragEndRef?.current) {
      e.preventDefault()
      onDragEndRef.current(d.payload, e.clientX, e.clientY)
    }

    setDragState(null)
    dragRef.current = null

    setTimeout(() => setTooltipTarget(null), 500)
  }, [clearTooltipTimer])

  const handlePointerLeave = useCallback(() => {
    const d = dragRef.current
    if (d && !d.isDragging) {
      clearTooltipTimer()
      setTooltipTarget(null)
    }
  }, [clearTooltipTimer])

  useEffect(() => {
    return () => {
      clearTooltipTimer()
    }
  }, [clearTooltipTimer])

  const resetTooltip = useCallback(() => {
    setTooltipTarget(null)
  }, [])

  return {
    dragState,
    tooltipTarget,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    resetTooltip,
  }
}