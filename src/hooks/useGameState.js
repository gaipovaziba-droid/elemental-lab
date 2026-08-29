import { useState, useEffect, useCallback, useRef } from 'react'
import { saveState, loadState, clearState } from '../utils/storage'
import { ELEMENTS } from '../data/engine'

const STARTERS = ['water', 'fire', 'air', 'earth']
const DEBOUNCE_MS = 300
const VALID_IDS = new Set(Object.keys(ELEMENTS))

function useGameState() {
  const [discovered, setDiscovered] = useState(STARTERS)
  const [workspace, setWorkspace] = useState([])
  const nextIdRef = useRef(1)
  const persistTimer = useRef(null)
  const latestRef = useRef({ discovered: STARTERS, workspace: [] })

  latestRef.current = { discovered, workspace }

  // Load from localStorage on mount with migration filtering
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      if (Array.isArray(saved.discovered)) {
        const filtered = saved.discovered.filter(id => VALID_IDS.has(id))
        if (filtered.length >= 4) {
          setDiscovered(filtered)
          latestRef.current.discovered = filtered
        }
      }
      if (Array.isArray(saved.workspace)) {
        const filtered = saved.workspace.filter(item => VALID_IDS.has(item.elementId))
        if (filtered.length > 0) {
          setWorkspace(filtered)
          latestRef.current.workspace = filtered
          // Keep highest uid + 1 for nextId
          const maxUid = Math.max(...filtered.map(w => w.uid), 0)
          if (maxUid > 0) nextIdRef.current = maxUid + 1
        }
      }
      if (saved.nextId && saved.nextId > nextIdRef.current) {
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
