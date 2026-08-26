import { useState, useEffect, useRef } from 'react'

function DiscoveryToast({ toast, onDone }) {
  const [visible, setVisible] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!toast) {
      setVisible(false)
      return
    }

    setVisible(true)

    let doneTimer
    const totalTimer = setTimeout(() => {
      setVisible(false)
      doneTimer = setTimeout(() => {
        onDoneRef.current()
      }, 300)
    }, 2000)

    return () => {
      clearTimeout(totalTimer)
      clearTimeout(doneTimer)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div
      className={`discovery-toast${visible ? ' show' : ' hide'}`}
      role="status"
      aria-live="polite"
    >
      Discovered: {toast.emoji} {toast.name}!
    </div>
  )
}

export default DiscoveryToast
