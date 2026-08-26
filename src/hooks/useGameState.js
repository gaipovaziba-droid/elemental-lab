import { useState, useEffect, useCallback, useRef } from 'react'
import { saveState, loadState, clearState } from '../utils/storage'

const STARTERS = ['water', 'fire', 'air', 'earth']
const DEBOUNCE_MS = 300

function useGameState() {
  const [discovered, setDiscovered] = useState(STARTERS)
  const [workspace, setWorkspace] = useState([])
  const nextIdRef = useRef(1)
  const persistTimer = useRef(null)
  const latestRef = useRef({ discovered: STARTERS, workspace: [] })

  // Keep latestRef in sync with state
  latestRef.current = { discovered, workspace }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      if (Array.isArray(saved.discovered)) {
        setDiscovered(saved.discovered)
        latestRef.current.discovered = saved.discovered
      }
      if (Array.isArray(saved.workspace)) {
        setWorkspace(saved.workspace)
        latestRef.current.workspace = saved.workspace
      }
      if (saved.nextId) {
        nextIdRef.current = saved.nextId
      }
    }
  }, [])

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
    removeFromWorkspace,
    replacePairWithResult,
    clearWorkspace,
    reset,
    isDiscovered,
  }
}

export default useGameState
