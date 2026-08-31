import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ELEMENTS,
  getCombinationResult,
  STARTER_IDS,
  TOTAL_ELEMENT_COUNT,
} from './data/engine'
import useGameState from './hooks/useGameState'
import usePointerDrag from './hooks/usePointerDrag'
import Header from './components/Header'
import CollectionPanel from './components/CollectionPanel'
import Laboratory from './components/Laboratory'
import DiscoveryToast from './components/DiscoveryToast'
import DragGhost from './components/DragGhost'

const WORKSPACE_ELEMENT_SIZE = 56
const WORKSPACE_ELEMENT_HALF = WORKSPACE_ELEMENT_SIZE / 2
const ADJACENT_GAP = 12

function App() {
  const {
    discovered,
    workspace,
    addDiscovery,
    addToWorkspace,
    moveInWorkspace,
    constrainWorkspace,
    removeFromWorkspace,
    replacePairWithResult,
    clearWorkspace,
    reset,
  } = useGameState()

  const laboratoryRef = useRef(null)
  const workspaceRef = useRef(workspace)
  const discoveredRef = useRef(discovered)
  workspaceRef.current = workspace
  discoveredRef.current = discovered

  const [selection, setSelection] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const handleDragEndRef = useRef(null)
  const handleActivateRef = useRef(null)

  const getLabRect = useCallback(() => {
    const rect = laboratoryRef.current?.getBoundingClientRect()
    if (!rect || rect.width <= 0 || rect.height <= 0) return null
    return rect
  }, [])

  const clampPosition = useCallback((x, y, rect = getLabRect()) => {
    const maxX = Math.max(0, (rect?.width ?? WORKSPACE_ELEMENT_SIZE) - WORKSPACE_ELEMENT_SIZE)
    const maxY = Math.max(0, (rect?.height ?? WORKSPACE_ELEMENT_SIZE) - WORKSPACE_ELEMENT_SIZE)
    const safeX = Number.isFinite(x) ? x : 0
    const safeY = Number.isFinite(y) ? y : 0
    return {
      x: Math.min(Math.max(0, safeX), maxX),
      y: Math.min(Math.max(0, safeY), maxY),
    }
  }, [getLabRect])

  const positionFromClientPoint = useCallback((clientX, clientY, rect = getLabRect()) => {
    if (!rect) return null
    return clampPosition(
      clientX - rect.left - WORKSPACE_ELEMENT_HALF,
      clientY - rect.top - WORKSPACE_ELEMENT_HALF,
      rect,
    )
  }, [clampPosition, getLabRect])

  const isInsideLab = useCallback((clientX, clientY, rect) => (
    clientX >= rect.left
    && clientX < rect.right
    && clientY >= rect.top
    && clientY < rect.bottom
  ), [])

  const showResultToast = useCallback((elementId, isNew) => {
    const element = ELEMENTS[elementId]
    if (!element) return
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ name: element.name, emoji: element.emoji, isNew })
    toastTimer.current = setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, 2300)
  }, [])

  const focusLaboratory = useCallback(() => {
    window.requestAnimationFrame(() => laboratoryRef.current?.focus())
  }, [])

  const focusWorkspaceElement = useCallback((uid) => {
    window.requestAnimationFrame(() => {
      laboratoryRef.current?.querySelector(`[data-uid="${uid}"]`)?.focus()
    })
  }, [])

  const addWorkspaceElement = useCallback((elementId, x, y) => {
    const position = clampPosition(x, y)
    const uid = addToWorkspace(elementId, position.x, position.y)
    workspaceRef.current = [
      ...workspaceRef.current,
      { uid, elementId, x: position.x, y: position.y },
    ]
    return uid
  }, [addToWorkspace, clampPosition])

  const moveWorkspaceElement = useCallback((uid, x, y) => {
    const position = clampPosition(x, y)
    workspaceRef.current = workspaceRef.current.map((item) => (
      item.uid === uid ? { ...item, ...position } : item
    ))
    moveInWorkspace(uid, position.x, position.y)
  }, [clampPosition, moveInWorkspace])

  const getAdjacentPosition = useCallback((targetItem) => {
    const rect = getLabRect()
    if (!rect) return clampPosition(targetItem.x, targetItem.y)

    const maxX = Math.max(0, rect.width - WORKSPACE_ELEMENT_SIZE)
    const right = targetItem.x + WORKSPACE_ELEMENT_SIZE + ADJACENT_GAP
    const preferredX = right <= maxX
      ? right
      : targetItem.x - WORKSPACE_ELEMENT_SIZE - ADJACENT_GAP
    return clampPosition(preferredX, targetItem.y, rect)
  }, [clampPosition, getLabRect])

  const handleCombine = useCallback((sourceUid, targetUid) => {
    if (sourceUid === targetUid) return null

    const currentWorkspace = workspaceRef.current
    const source = currentWorkspace.find((item) => item.uid === sourceUid)
    const target = currentWorkspace.find((item) => item.uid === targetUid)
    if (!source || !target) return null

    const resultId = getCombinationResult(source.elementId, target.elementId)
    if (!resultId) return null

    const isNew = !discoveredRef.current.includes(resultId)
    if (isNew) {
      discoveredRef.current = [...discoveredRef.current, resultId]
      addDiscovery(resultId)
    }

    const resultPosition = clampPosition(
      (source.x + target.x) / 2,
      (source.y + target.y) / 2,
    )
    const resultUid = replacePairWithResult(
      sourceUid,
      targetUid,
      resultId,
      resultPosition.x,
      resultPosition.y,
    )

    workspaceRef.current = [
      ...currentWorkspace.filter((item) => item.uid !== sourceUid && item.uid !== targetUid),
      { uid: resultUid, elementId: resultId, ...resultPosition },
    ]
    showResultToast(resultId, isNew)
    return resultUid
  }, [addDiscovery, clampPosition, replacePairWithResult, showResultToast])

  const handleDragEnd = useCallback((payload, clientX, clientY) => {
    if (!payload) return

    const laboratory = laboratoryRef.current
    const rect = getLabRect()
    if (!laboratory || !rect || !isInsideLab(clientX, clientY, rect)) return

    const hit = document.elementFromPoint(clientX, clientY)
    const workspaceElement = hit?.closest('.workspace-element')
    const validTarget = workspaceElement && laboratory.contains(workspaceElement)
      ? workspaceElement
      : null

    if (payload.type === 'sidebar') {
      if (validTarget) {
        const targetUid = Number.parseInt(validTarget.dataset.uid, 10)
        const targetItem = workspaceRef.current.find((item) => item.uid === targetUid)
        if (targetItem) {
          const position = getAdjacentPosition(targetItem)
          addWorkspaceElement(payload.elementId, position.x, position.y)
          setSelection(null)
          return
        }
      }

      const position = positionFromClientPoint(clientX, clientY, rect)
      if (position) {
        addWorkspaceElement(payload.elementId, position.x, position.y)
        setSelection(null)
      }
      return
    }

    if (payload.type !== 'workspace') return

    if (validTarget) {
      const targetUid = Number.parseInt(validTarget.dataset.uid, 10)
      handleCombine(payload.uid, targetUid)
    } else {
      const position = positionFromClientPoint(clientX, clientY, rect)
      if (position) moveWorkspaceElement(payload.uid, position.x, position.y)
    }
    setSelection(null)
  }, [
    addWorkspaceElement,
    getAdjacentPosition,
    getLabRect,
    handleCombine,
    isInsideLab,
    moveWorkspaceElement,
    positionFromClientPoint,
  ])

  const handleActivate = useCallback((payload, meta = {}) => {
    if (!payload) return
    const isKeyboard = meta.inputMethod === 'keyboard'

    if (payload.type === 'sidebar') {
      const isAlreadySelected = selection?.type === 'sidebar'
        && selection.elementId === payload.elementId
      setSelection(isAlreadySelected ? null : payload)
      if (!isAlreadySelected && isKeyboard) focusLaboratory()
      return
    }

    if (payload.type !== 'workspace') return
    const targetItem = workspaceRef.current.find((item) => item.uid === payload.uid)
    if (!targetItem) return

    if (selection?.type === 'sidebar') {
      const position = getAdjacentPosition(targetItem)
      const uid = addWorkspaceElement(selection.elementId, position.x, position.y)
      setSelection(null)
      if (isKeyboard) focusWorkspaceElement(uid)
      return
    }

    if (selection?.type === 'workspace') {
      if (selection.uid === payload.uid) {
        setSelection(null)
        return
      }

      const resultUid = handleCombine(selection.uid, payload.uid)
      setSelection(resultUid ? null : payload)
      if (resultUid && isKeyboard) focusWorkspaceElement(resultUid)
      return
    }

    setSelection(payload)
  }, [
    addWorkspaceElement,
    focusLaboratory,
    focusWorkspaceElement,
    getAdjacentPosition,
    handleCombine,
    selection,
  ])

  const handleLaboratoryActivate = useCallback((meta = {}) => {
    if (!selection) return

    if (selection.type === 'workspace') {
      setSelection(null)
      return
    }

    const rect = getLabRect()
    if (!rect) return
    const hasClientPoint = Number.isFinite(meta.clientX) && Number.isFinite(meta.clientY)
    const position = hasClientPoint
      ? positionFromClientPoint(meta.clientX, meta.clientY, rect)
      : clampPosition(
        (rect.width - WORKSPACE_ELEMENT_SIZE) / 2,
        (rect.height - WORKSPACE_ELEMENT_SIZE) / 2,
        rect,
      )
    if (!position) return

    const focusUid = addWorkspaceElement(selection.elementId, position.x, position.y)

    setSelection(null)
    if (focusUid && meta.inputMethod === 'keyboard') focusWorkspaceElement(focusUid)
  }, [
    addWorkspaceElement,
    clampPosition,
    focusWorkspaceElement,
    getLabRect,
    positionFromClientPoint,
    selection,
  ])

  const handleNudgeWorkspace = useCallback((uid, deltaX, deltaY) => {
    const item = workspaceRef.current.find((entry) => entry.uid === uid)
    if (!item) return
    moveWorkspaceElement(uid, item.x + deltaX, item.y + deltaY)
  }, [moveWorkspaceElement])

  const handleRemoveWorkspace = useCallback((uid) => {
    workspaceRef.current = workspaceRef.current.filter((item) => item.uid !== uid)
    removeFromWorkspace(uid)
    setSelection((current) => (
      current?.type === 'workspace' && current.uid === uid ? null : current
    ))
    focusLaboratory()
  }, [focusLaboratory, removeFromWorkspace])

  const clearSelection = useCallback(() => setSelection(null), [])

  handleDragEndRef.current = handleDragEnd
  handleActivateRef.current = handleActivate
  const pointerDrag = usePointerDrag(handleDragEndRef)

  useEffect(() => {
    const laboratory = laboratoryRef.current
    if (!laboratory) return undefined

    const constrain = () => {
      constrainWorkspace(
        laboratory.clientWidth - WORKSPACE_ELEMENT_SIZE,
        laboratory.clientHeight - WORKSPACE_ELEMENT_SIZE,
      )
    }

    constrain()
    const observer = typeof ResizeObserver === 'function'
      ? new ResizeObserver(constrain)
      : null
    observer?.observe(laboratory)
    window.addEventListener('resize', constrain)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', constrain)
    }
  }, [constrainWorkspace])

  useEffect(() => {
    if (
      selection?.type === 'workspace'
      && !workspace.some((item) => item.uid === selection.uid)
    ) {
      setSelection(null)
    }
  }, [selection, workspace])

  useEffect(() => {
    if (!selection) return undefined
    const handleEscape = (event) => {
      if (event.key === 'Escape') setSelection(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selection])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  const handleClearWorkspace = useCallback(() => {
    workspaceRef.current = []
    clearWorkspace()
    setSelection(null)
    pointerDrag.resetTooltip()
  }, [clearWorkspace, pointerDrag.resetTooltip])

  const handleReset = useCallback(() => {
    workspaceRef.current = []
    discoveredRef.current = [...STARTER_IDS]
    reset()
    setSelection(null)
    setToast(null)
    pointerDrag.resetTooltip()
  }, [pointerDrag.resetTooltip, reset])

  const selectedWorkspaceItem = selection?.type === 'workspace'
    ? workspace.find((item) => item.uid === selection.uid)
    : null
  const selectedElement = selection?.type === 'sidebar'
    ? ELEMENTS[selection.elementId]
    : selectedWorkspaceItem
      ? ELEMENTS[selectedWorkspaceItem.elementId]
      : null
  const selectionMessage = selectedElement
    ? selection.type === 'sidebar'
      ? `${selectedElement.name} selected. Tap the lab or press Enter there to place it.`
      : `${selectedElement.name} selected. Choose another element to combine, or use arrow keys to move it.`
    : ''

  const dragState = pointerDrag.dragState
  const getGhostContent = () => {
    if (!dragState?.isDragging || !dragState.payload) return null
    if (dragState.payload.type === 'sidebar') {
      const element = ELEMENTS[dragState.payload.elementId]
      return element ? { emoji: element.emoji } : null
    }
    const workspaceItem = workspaceRef.current.find((item) => item.uid === dragState.payload.uid)
    if (!workspaceItem) return null
    const element = ELEMENTS[workspaceItem.elementId]
    return element ? { emoji: element.emoji } : null
  }
  const ghost = getGhostContent()

  return (
    <div className="app-shell">
      <p id="lab-instructions" className="sr-only">
        Drag elements into the laboratory, or select an element and activate the laboratory to place it.
        Select two laboratory elements to combine them. Use arrow keys to move a focused laboratory element.
      </p>
      <Header
        discoveredCount={discovered.length}
        totalCount={TOTAL_ELEMENT_COUNT}
        onReset={handleReset}
        onClearWorkspace={handleClearWorkspace}
      />
      <div className="app-body">
        <CollectionPanel
          discovered={discovered}
          pointerDrag={pointerDrag}
          selection={selection}
          onActivate={handleActivate}
          onCancelSelection={clearSelection}
        />
        <Laboratory
          laboratoryRef={laboratoryRef}
          workspace={workspace}
          pointerDrag={pointerDrag}
          tooltipTarget={pointerDrag.tooltipTarget}
          selection={selection}
          selectionMessage={selectionMessage}
          onActivate={handleActivate}
          onLaboratoryActivate={handleLaboratoryActivate}
          onCancelSelection={clearSelection}
          onNudgeWorkspace={handleNudgeWorkspace}
          onRemoveWorkspace={handleRemoveWorkspace}
        />
      </div>
      {ghost && (
        <DragGhost
          emoji={ghost.emoji}
          clientX={dragState.lastX}
          clientY={dragState.lastY}
        />
      )}
      <DiscoveryToast toast={toast} />
    </div>
  )
}

export default App
