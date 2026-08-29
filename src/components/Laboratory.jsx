import { useRef, useState, useCallback, useEffect } from 'react'
import { ELEMENT_CATALOG } from '../data/catalog'
import WorkspaceElement from './WorkspaceElement'

function Laboratory({
  workspace,
  onDropFromCollection,
  onCombine,
  onMoveInWorkspace,
  onWorkspaceTap,
  onWorkspaceElementTap,
  isTouchDevice,
  selectedElement,
}) {
  const labRef = useRef(null)
  const [dragOverUid, setDragOverUid] = useState(null)
  const [selectedWsUid, setSelectedWsUid] = useState(null)

  // Sidebar and workspace selection modes are mutually exclusive
  useEffect(() => {
    setSelectedWsUid(null)
  }, [selectedElement])

  const getRelativePos = useCallback((clientX, clientY) => {
    const rect = labRef.current.getBoundingClientRect()
    return {
      x: clientX - rect.left - 32,
      y: clientY - rect.top - 32,
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed === 'copy'
      ? 'copy'
      : 'move'
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    if (!data) return
    const { x, y } = getRelativePos(e.clientX, e.clientY)

    if (isNaN(Number(data))) {
      onDropFromCollection(data, x, y)
    } else {
      const uid = parseInt(data, 10)
      onMoveInWorkspace(uid, x, y)
    }
  }, [getRelativePos, onDropFromCollection, onMoveInWorkspace])

  const handleWorkspaceDrop = useCallback((e, targetUid) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverUid(null)

    const data = e.dataTransfer.getData('text/plain')
    if (!data) return

    if (isNaN(Number(data))) {
      const targetItem = workspace.find((w) => w.uid === targetUid)
      if (!targetItem) return
      const { x, y } = getRelativePos(e.clientX, e.clientY)
      onDropFromCollection(data, x, y)
      return
    }

    const sourceUid = parseInt(data, 10)
    if (sourceUid === targetUid) return

    const sourceItem = workspace.find((w) => w.uid === sourceUid)
    const targetItem = workspace.find((w) => w.uid === targetUid)
    if (!sourceItem || !targetItem) return

    const midX = (sourceItem.x + targetItem.x) / 2 + 16
    const midY = (sourceItem.y + targetItem.y) / 2 + 16

    onCombine(sourceUid, targetUid, midX, midY)
  }, [workspace, getRelativePos, onDropFromCollection, onCombine])

  // Mobile touch: handle tap on workspace background
  const handleLabClick = useCallback((e) => {
    if (e.target === labRef.current || e.target.classList.contains('laboratory-hint')) {
      onWorkspaceTap()
      setSelectedWsUid(null)
    }
  }, [onWorkspaceTap])

  const handleLabKeyDown = useCallback((e) => {
    if (
      e.target === e.currentTarget &&
      selectedElement &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault()
      onWorkspaceTap()
      setSelectedWsUid(null)
    }
  }, [onWorkspaceTap, selectedElement])

  // Mobile touch: handle tap on a workspace element
  const handleWsElementTap = useCallback((uid) => {
    // If a sidebar element is selected, place it near the tapped workspace element
    if (selectedElement && onWorkspaceElementTap) {
      onWorkspaceElementTap(uid)
      setSelectedWsUid(null)
      return
    }

    // If no sidebar element selected, handle workspace-to-workspace selection
    if (selectedWsUid === null) {
      setSelectedWsUid(uid)
      return
    }

    if (selectedWsUid === uid) {
      setSelectedWsUid(null)
      return
    }

    // Second tap on a different element — attempt combination
    const itemA = workspace.find((w) => w.uid === selectedWsUid)
    const itemB = workspace.find((w) => w.uid === uid)
    if (!itemA || !itemB) {
      setSelectedWsUid(null)
      return
    }

    const midX = (itemA.x + itemB.x) / 2 + 16
    const midY = (itemA.y + itemB.y) / 2 + 16
    onCombine(selectedWsUid, uid, midX, midY)
    setSelectedWsUid(null)
  }, [selectedElement, selectedWsUid, workspace, onCombine, onWorkspaceElementTap])

  return (
    <div
      className="laboratory"
      ref={labRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleLabClick}
      onKeyDown={handleLabKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Laboratory workspace"
    >
      <div
        className={`laboratory-hint${workspace.length === 0 ? '' : ' hidden'}`}
        aria-hidden={workspace.length !== 0}
      >
        Drag elements here to combine
      </div>
      {workspace.map((item) => {
        const el = ELEMENT_CATALOG[item.elementId]
        if (!el) return null
        return (
          <WorkspaceElement
            key={item.uid}
            uid={item.uid}
            name={`${el.name} in laboratory`}
            emoji={el.emoji}
            x={item.x}
            y={item.y}
            isDragOver={dragOverUid === item.uid}
            isSelected={selectedWsUid === item.uid}
            onDragOver={() => setDragOverUid(item.uid)}
            onDragLeave={() => setDragOverUid(null)}
            onDrop={(e) => handleWorkspaceDrop(e, item.uid)}
            onTap={() => handleWsElementTap(item.uid)}
            isTouchDevice={isTouchDevice}
          />
        )
      })}
    </div>
  )
}

export default Laboratory
