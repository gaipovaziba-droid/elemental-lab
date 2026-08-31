export const DRAG_THRESHOLD = 5
export const TOOLTIP_MOVE_TOLERANCE = 3
export const HOVER_TOOLTIP_DELAY = 1800
export const LONGPRESS_TOOLTIP_DELAY = 2000

export function tooltipDelayFor(pointerType) {
  return pointerType === 'mouse' ? HOVER_TOOLTIP_DELAY : LONGPRESS_TOOLTIP_DELAY
}

export function scheduleTooltip(target, delay, schedule, onShow) {
  return schedule(() => onShow(target), delay)
}

export function pointerMoveTransition(isDragging, dx, dy) {
  const absoluteX = Math.abs(dx)
  const absoluteY = Math.abs(dy)
  const cancelTooltip = (
    absoluteX > TOOLTIP_MOVE_TOLERANCE ||
    absoluteY > TOOLTIP_MOVE_TOLERANCE
  )
  const nextIsDragging = isDragging || (
    absoluteX > DRAG_THRESHOLD ||
    absoluteY > DRAG_THRESHOLD
  )

  return { cancelTooltip, isDragging: nextIsDragging }
}

// Pointer release is deliberately drop-only. Keyboard activation is handled by
// component key handlers and never flows through this function.
export function finishPointerInteraction(drag, clientX, clientY, onDrop) {
  if (!drag?.isDragging || typeof onDrop !== 'function') return false
  onDrop(drag.payload, clientX, clientY)
  return true
}

export function isKeyboardActivationKey(key) {
  return key === 'Enter' || key === ' '
}
