import { useState, useEffect, useCallback, useRef } from 'react'
import { saveState, loadState, clearState } from '../utils/storage'
import { ELEMENTS } from '../data/engine'

const STARTERS = ['water', 'fire', 'air', 'earth']
const DEBOUNCE_MS = 300
const MAX_SAVED_COORDINATE = 100000
const VALID_IDS = new Set(Object.keys(ELEMENTS))

function sanitizeSavedState(saved) {
  const discovered = [...STARTERS]
  const discoveredSet = new Set(discovered)

  if (Array.isArray(saved?.discovered)) {
    saved.discovered.forEach((id) => {
      if (typeof id !== 'string' || !VALID_IDS.has(id) || discoveredSet.has(id)) return
      discovered.push(id)
      discoveredSet.add(id)
    })
  }

  const workspace = []
  const seenUids = new Set()

  if (Array.isArray(saved?.workspace)) {
    saved.workspace.forEach((item) => {
      if (!item || typeof item !== 'object' || !VALID_IDS.has(item.elementId)) return
      if (!Number.isSafeInteger(item.uid) || item.uid < 1 || seenUids.has(item.uid)) return
      if (!Number.isFinite(item.x) || !Number.isFinite(item.y)) return

      seenUids.add(item.uid)
      workspace.push({
        uid: item.uid,
        elementId: item.elementId,
        x: Math.min(Math.max(0, item.x), MAX_SAVED_COORDINATE),
        y: Math.min(Math.max(0, item.y), MAX_SAVED_COORDINATE),
      })

      if (!discoveredSet.has(item.elementId)) {
        discovered.push(item.elementId)
        discoveredSet.add(item.elementId)
      }
    })
  }

  const highestUid = workspace.reduce((max, item) => Math.max(max, item.uid), 0)
  const savedNextId = Number.isSafeInteger(saved?.nextId) && saved.nextId > 0
    ? saved.nextId
    : 1

  return {
    discovered,
    workspace,
    nextId: Math.max(highestUid + 1, savedNextId),
  }
}

function useGameState() {
  const initialStateRef = useRef(null)
  if (!initialStateRef.current) {
    initialStateRef.current = sanitizeSavedState(loadState())
  }

  const initialState = initialStateRef.current
  const [discovered, setDiscovered] = useState(() => initialState.discovered)
  const [workspace, setWorkspace] = useState(() => initialState.workspace)
  const nextIdRef = useRef(initialState.nextId)
  const persistTimer = useRef(null)
  const latestRef = useRef({
    discovered: initialState.discovered,
    workspace: initialState.workspace,
  })

  latestRef.current = { discovered, workspace }

  // Debounced persist — always reads latestRef so timer always writes current state
  const schedulePersist = useCallback(() => {
    if (persistTimer.current) {
      clearTimeout(persistTimer.current)
    }
    persistTimer.current = setTimeout(() => {
      const { discovered: d, workspace: w } = latestRef.current
      saveState({ discovered: d, workspace: w, nextId: nextIdRef.current })
    }, DEBOUNCE_MS)
  }, [])

  // Trigger persist on any state change
  useEffect(() => {
    schedulePersist()
    return () => {
      if (persistTimer.current) {
        clearTimeout(persistTimer.current)
      }
    }
  }, [discovered, workspace, schedulePersist])

  // Flush pending state when the page is hidden and on unmount
  useEffect(() => {
    const flushPersist = () => {
      if (persistTimer.current) {
        clearTimeout(persistTimer.current)
        persistTimer.current = null
      }
      const { discovered: d, workspace: w } = latestRef.current
      saveState({ discovered: d, workspace: w, nextId: nextIdRef.current })
    }

    window.addEventListener('pagehide', flushPersist)

    return () => {
      window.removeEventListener('pagehide', flushPersist)
      flushPersist()
    }
  }, [])

  const addDiscovery = useCallback((elementId) => {
    setDiscovered((prev) => {
      if (prev.includes(elementId)) return prev
      return [...prev, elementId]
    })
  }, [])

  const addToWorkspace = useCallback((elementId, x, y) => {
    const uid = nextIdRef.current
    nextIdRef.current += 1
    setWorkspace((prev) => [...prev, { uid, elementId, x, y }])
    return uid
  }, [])

  const moveInWorkspace = useCallback((uid, x, y) => {
    setWorkspace((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, x, y } : item))
    )
  }, [])

  const constrainWorkspace = useCallback((maxX, maxY) => {
    const safeMaxX = Math.max(0, Number.isFinite(maxX) ? maxX : 0)
    const safeMaxY = Math.max(0, Number.isFinite(maxY) ? maxY : 0)

    setWorkspace((prev) => {
      let changed = false
      const next = prev.map((item) => {
        const x = Math.min(Math.max(0, item.x), safeMaxX)
        const y = Math.min(Math.max(0, item.y), safeMaxY)
        if (x === item.x && y === item.y) return item
        changed = true
        return { ...item, x, y }
      })
      return changed ? next : prev
    })
  }, [])

  const removeFromWorkspace = useCallback((uid) => {
    setWorkspace((prev) => prev.filter((item) => item.uid !== uid))
  }, [])

  const replacePairWithResult = useCallback((uidA, uidB, resultId, x, y) => {
    const uid = nextIdRef.current
    nextIdRef.current += 1
    setWorkspace((prev) => {
      const filtered = prev.filter(
        (item) => item.uid !== uidA && item.uid !== uidB
      )
      return [...filtered, { uid, elementId: resultId, x, y }]
    })
    return uid
  }, [])

  const clearWorkspace = useCallback(() => {
    setWorkspace([])
  }, [])

  const reset = useCallback(() => {
    clearState()
    setDiscovered(STARTERS)
    setWorkspace([])
    nextIdRef.current = 1
  }, [])

  const isDiscovered = useCallback(
    (elementId) => discovered.includes(elementId),
    [discovered]
  )

  return {
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
    isDiscovered,
  }
}

export default useGameState
