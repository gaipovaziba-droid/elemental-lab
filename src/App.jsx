import { useState, useCallback, useRef } from 'react'
import { ELEMENT_CATALOG } from './data/catalog'
import { getCombinationResult } from './data/combinations'
import useGameState from './hooks/useGameState'
import Header from './components/Header'
import CollectionPanel from './components/CollectionPanel'
import Laboratory from './components/Laboratory'
import DiscoveryToast from './components/DiscoveryToast'

const isTouchDevice = () => 'ontouchstart' in window

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

  const [toast, setToast] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null)
  const workspaceRef = useRef(workspace)
  workspaceRef.current = workspace

  const handleDiscovery = useCallback((elementId) => {
    addDiscovery(elementId)
    const el = ELEMENT_CATALOG[elementId]
    if (el) {
      setToast({ name: el.name, emoji: el.emoji })
    }
  }, [addDiscovery])

  const handleDropFromCollection = useCallback((elementId, x, y) => {
    addToWorkspace(elementId, x, y)
  }, [addToWorkspace])

  const handleCombine = useCallback((uidA, uidB, midX, midY) => {
    const currentWs = workspaceRef.current
    const itemA = currentWs.find((w) => w.uid === uidA)
    const itemB = currentWs.find((w) => w.uid === uidB)
    if (!itemA || !itemB) return null

    const resultId = getCombinationResult(itemA.elementId, itemB.elementId)
    if (!resultId) return null

    handleDiscovery(resultId)
    replacePairWithResult(uidA, uidB, resultId, midX, midY)
    return resultId
  }, [handleDiscovery, replacePairWithResult])

  const handleSidebarTap = useCallback((elementId) => {
    setSelectedElement((current) => (
      current === elementId ? null : elementId
    ))
  }, [])

  const handleWorkspaceElementTap = useCallback((uid) => {
    const currentWs = workspaceRef.current
    const tappedItem = currentWs.find((w) => w.uid === uid)
    if (!tappedItem) return

    setSelectedElement((prev) => {
      if (prev) {
        // Place sidebar element near tapped element
        addToWorkspace(prev, tappedItem.x + 70, tappedItem.y)
        return null
      }
      return prev
    })
  }, [addToWorkspace])

  const handleWorkspaceTap = useCallback(() => {
    setSelectedElement((prev) => {
      if (prev) {
        const x = 100 + Math.random() * 200
        const y = 100 + Math.random() * 200
        addToWorkspace(prev, x, y)
      }
      return null
    })
  }, [addToWorkspace])

  return (
    <>
      <Header onReset={reset} onClearWorkspace={clearWorkspace} />
      <div className="app-body">
        <CollectionPanel
          discovered={discovered}
          onDropElement={handleDropFromCollection}
          selectedElement={selectedElement}
          onSidebarTap={handleSidebarTap}
          isTouchDevice={isTouchDevice()}
        />
        <Laboratory
          workspace={workspace}
          onDropFromCollection={handleDropFromCollection}
          onCombine={handleCombine}
          onMoveInWorkspace={moveInWorkspace}
          onWorkspaceTap={handleWorkspaceTap}
          onWorkspaceElementTap={handleWorkspaceElementTap}
          selectedElement={selectedElement}
          isTouchDevice={isTouchDevice()}
        />
      </div>
      <DiscoveryToast toast={toast} onDone={() => setToast(null)} />
    </>
  )
}

export default App
