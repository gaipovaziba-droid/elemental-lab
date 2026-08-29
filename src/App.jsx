import { useState, useCallback, useRef, useEffect } from 'react'
import { ELEMENT_CATALOG } from './data/catalog'
import { getCombinationResult } from './data/combinations'
import useGameState from './hooks/useGameState'
import usePointerDrag from './hooks/usePointerDrag'
import Header from './components/Header'
import CollectionPanel from './components/CollectionPanel'
import Laboratory from './components/Laboratory'
import DiscoveryToast from './components/DiscoveryToast'
import DragGhost from './components/DragGhost'

function App() {
  const {
    discovered,
    workspace,
    addDiscovery,
    addToWorkspace,
    moveInWorkspace,
    replacePairWithResult,
    clearWorkspace,
    reset,
  } = useGameState()

  const workspaceRef = useRef(workspace)
  workspaceRef.current = workspace

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = useCallback((elementId) => {
    const el = ELEMENT_CATALOG[elementId]
    if (!el) return
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ name: el.name, emoji: el.emoji })
    toastTimer.current = setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, 2300)
  }, [])

  const handleCombineDrop = useCallback((sourceUid, targetUid) => {
    if (sourceUid === targetUid) return
    const currentWs = workspaceRef.current
    const src = currentWs.find((w) => w.uid === sourceUid)
    const tgt = currentWs.find((w) => w.uid === targetUid)
    if (!src || !tgt) return
    const resultId = getCombinationResult(src.elementId, tgt.elementId)
    if (!resultId) return
    showToast(resultId)
    addDiscovery(resultId)
    const midX = (src.x + tgt.x) / 2 + 16
    const midY = (src.y + tgt.y) / 2 + 16
    replacePairWithResult(sourceUid, targetUid, resultId, midX, midY)
  }, [showToast, addDiscovery, replacePairWithResult])

  const handleDragEndRef = useRef(null)

  // Handle end of pointer drag — determine what happened
  const handleDragEnd = useCallback((payload, clientX, clientY) => {
    if (!payload) return

    if (payload.type === 'sidebar') {
      const el = document.elementFromPoint(clientX, clientY)
      const wsEl = el?.closest('.workspace-element')
      if (wsEl) {
        const uid = parseInt(wsEl.dataset.uid, 10)
        const targetItem = workspaceRef.current.find(w => w.uid === uid)
        if (targetItem) {
          addToWorkspace(payload.elementId, targetItem.x + 70, targetItem.y + 20)
          return
        }
      }
      const lab = document.querySelector('.laboratory')
      if (!lab) return
      const rect = lab.getBoundingClientRect()
      addToWorkspace(payload.elementId, clientX - rect.left - 32, clientY - rect.top - 32)
    } else if (payload.type === 'workspace') {
      const el = document.elementFromPoint(clientX, clientY)
      const wsEl = el?.closest('.workspace-element')
      if (wsEl) {
        const targetUid = parseInt(wsEl.dataset.uid, 10)
        handleCombineDropRef.current(payload.uid, targetUid)
      } else {
        const lab = document.querySelector('.laboratory')
        if (!lab) return
        const rect = lab.getBoundingClientRect()
        moveInWorkspace(payload.uid, clientX - rect.left - 32, clientY - rect.top - 32)
      }
    }
  }, [addToWorkspace, moveInWorkspace])

  const handleCombineDropRef = useRef(handleCombineDrop)
  handleCombineDropRef.current = handleCombineDrop
  handleDragEndRef.current = handleDragEnd

  const pointerDrag = usePointerDrag(handleDragEndRef)

  // Cleanup toast timer
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  // Ghost element while dragging
  const ds = pointerDrag.dragState
  const getGhostContent = () => {
    if (!ds || !ds.isDragging || !ds.payload) return null
    if (ds.payload.type === 'sidebar') {
      const el = ELEMENT_CATALOG[ds.payload.elementId]
      return el ? { emoji: el.emoji } : null
    }
    const wsItem = workspaceRef.current.find(w => w.uid === ds.payload.uid)
    if (!wsItem) return null
    const el = ELEMENT_CATALOG[wsItem.elementId]
    return el ? { emoji: el.emoji } : null
  }
  const ghost = getGhostContent()

  return (
    <div id="root">
      <Header onReset={reset} onClearWorkspace={clearWorkspace} />
      <div className="app-body">
        <CollectionPanel
          discovered={discovered}
          pointerDrag={pointerDrag}
        />
        <Laboratory
          workspace={workspace}
          pointerDrag={pointerDrag}
          onDragEnd={handleDragEnd}
          tooltipTarget={pointerDrag.tooltipTarget}
        />
      </div>
      {ghost && (
        <DragGhost emoji={ghost.emoji} clientX={ds.lastX} clientY={ds.lastY} />
      )}
      <DiscoveryToast toast={toast} />
    </div>
  )
}

export default App