import { useState, useEffect } from 'react'

function DiscoveryToast({ toast }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) {
      setVisible(false)
      return
    }
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
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