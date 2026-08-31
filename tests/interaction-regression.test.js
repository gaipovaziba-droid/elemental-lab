import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  HOVER_TOOLTIP_DELAY,
  LONGPRESS_TOOLTIP_DELAY,
  finishPointerInteraction,
  isKeyboardActivationKey,
  pointerMoveTransition,
  scheduleTooltip,
  tooltipDelayFor,
} from '../src/hooks/pointerInteraction.js'

const stationaryDrag = (payload) => ({ payload, isDragging: false })
const activeDrag = (payload) => ({ payload, isDragging: true })

function dropRecorder() {
  const calls = []
  return {
    calls,
    callback: (...args) => calls.push(args),
  }
}

test('1. stationary touch release does not select', () => {
  const drop = dropRecorder()
  const completed = finishPointerInteraction(
    stationaryDrag({ type: 'sidebar', elementId: 'water' }),
    10,
    20,
    drop.callback,
  )
  assert.equal(completed, false)
  assert.equal(drop.calls.length, 0)
})

test('2. stationary touch release does not place', () => {
  const drop = dropRecorder()
  finishPointerInteraction(
    stationaryDrag({ type: 'sidebar', elementId: 'earth' }),
    300,
    200,
    drop.callback,
  )
  assert.equal(drop.calls.length, 0)
})

test('3. stationary workspace touch release does not combine', () => {
  const drop = dropRecorder()
  finishPointerInteraction(stationaryDrag({ type: 'workspace', uid: 1 }), 40, 40, drop.callback)
  assert.equal(drop.calls.length, 0)
})

test('4. collection touch drag dispatches exactly one placement drop', () => {
  const drop = dropRecorder()
  const payload = { type: 'sidebar', elementId: 'air' }
  assert.equal(finishPointerInteraction(activeDrag(payload), 240, 180, drop.callback), true)
  assert.deepEqual(drop.calls, [[payload, 240, 180]])
})

test('5. workspace touch drag dispatches exactly one reposition drop', () => {
  const drop = dropRecorder()
  const payload = { type: 'workspace', uid: 17 }
  finishPointerInteraction(activeDrag(payload), 320, 220, drop.callback)
  assert.deepEqual(drop.calls, [[payload, 320, 220]])
})

test('6. dragging workspace element A onto B dispatches one combination drop', () => {
  const drop = dropRecorder()
  const payload = { type: 'workspace', uid: 3 }
  finishPointerInteraction(activeDrag(payload), 500, 300, drop.callback)
  assert.deepEqual(drop.calls, [[payload, 500, 300]])
})

test('7. movement beyond tolerance cancels mobile tooltip and crosses drag threshold', () => {
  assert.deepEqual(pointerMoveTransition(false, 6, 0), {
    cancelTooltip: true,
    isDragging: true,
  })
  assert.deepEqual(pointerMoveTransition(false, 2, 2), {
    cancelTooltip: false,
    isDragging: false,
  })
})

test('8. stationary touch uses the two-second tooltip delay without dragging', () => {
  let scheduledDelay = null
  let scheduledCallback = null
  let shownTarget = null
  const target = { type: 'sidebar', elementId: 'water' }

  scheduleTooltip(
    target,
    tooltipDelayFor('touch'),
    (callback, delay) => {
      scheduledCallback = callback
      scheduledDelay = delay
      return 1
    },
    (shown) => { shownTarget = shown },
  )

  assert.equal(tooltipDelayFor('touch'), LONGPRESS_TOOLTIP_DELAY)
  assert.equal(scheduledDelay, 2000)
  assert.equal(shownTarget, null)
  assert.equal(pointerMoveTransition(false, 0, 0).isDragging, false)
  scheduledCallback()
  assert.deepEqual(shownTarget, target)
})

test('9. releasing after stationary tooltip does not activate or drop', () => {
  const drop = dropRecorder()
  const completed = finishPointerInteraction(
    stationaryDrag({ type: 'sidebar', elementId: 'fire', tooltipVisible: true }),
    80,
    90,
    drop.callback,
  )
  assert.equal(completed, false)
  assert.equal(drop.calls.length, 0)
})

test('10. mouse drag still dispatches exactly one drop', () => {
  const drop = dropRecorder()
  const payload = { type: 'sidebar', elementId: 'water', pointerType: 'mouse' }
  finishPointerInteraction(activeDrag(payload), 120, 140, drop.callback)
  assert.deepEqual(drop.calls, [[payload, 120, 140]])
})

test('11. desktop hover retains its 1.8-second delay', () => {
  let scheduledDelay = null
  scheduleTooltip(
    { type: 'sidebar', elementId: 'air' },
    tooltipDelayFor('mouse'),
    (_callback, delay) => {
      scheduledDelay = delay
      return 1
    },
    () => {},
  )
  assert.equal(tooltipDelayFor('mouse'), HOVER_TOOLTIP_DELAY)
  assert.equal(scheduledDelay, 1800)
})

test('12. keyboard activation remains independent from pointer release', () => {
  assert.equal(isKeyboardActivationKey('Enter'), true)
  assert.equal(isKeyboardActivationKey(' '), true)
  assert.equal(isKeyboardActivationKey('PointerUp'), false)

  const elementIconSource = readFileSync('src/components/ElementIcon.jsx', 'utf8')
  const workspaceSource = readFileSync('src/components/WorkspaceElement.jsx', 'utf8')
  const laboratorySource = readFileSync('src/components/Laboratory.jsx', 'utf8')
  const pointerHookSource = readFileSync('src/hooks/usePointerDrag.js', 'utf8')

  assert.match(elementIconSource, /onActivate\(payload, \{ inputMethod: 'keyboard' \}\)/)
  assert.match(workspaceSource, /onActivate\(payload, \{ inputMethod: 'keyboard' \}\)/)
  assert.match(laboratorySource, /onLaboratoryActivate\(\{ inputMethod: 'keyboard' \}\)/)
  assert.doesNotMatch(laboratorySource, /onPointerUp=/)
  assert.doesNotMatch(pointerHookSource, /onActivateRef/)
  assert.match(pointerHookSource, /handlePointerCancel/)
  assert.match(pointerHookSource, /setPointerCapture/)
})

test('synthetic clicks cannot enter the activation workflow', () => {
  const elementIconSource = readFileSync('src/components/ElementIcon.jsx', 'utf8')
  const workspaceSource = readFileSync('src/components/WorkspaceElement.jsx', 'utf8')
  const laboratorySource = readFileSync('src/components/Laboratory.jsx', 'utf8')

  assert.doesNotMatch(elementIconSource, /onClick=.*onActivate/)
  assert.doesNotMatch(workspaceSource, /onClick=.*onActivate/)
  assert.doesNotMatch(laboratorySource, /onClick=.*onLaboratoryActivate/)
})
