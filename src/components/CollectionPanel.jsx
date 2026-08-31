import { useState, useMemo, useRef, useEffect } from 'react'
import { ELEMENTS, getElementCategories } from '../data/engine'
import ElementIcon from './ElementIcon'

const cats = getElementCategories()

function CollectionPanel({
  discovered,
  pointerDrag,
  selection,
  onActivate,
  onCancelSelection,
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showRecent, setShowRecent] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const inputRef = useRef(null)

  // Clear search when panel opens
  useEffect(() => {
    if (showFilters && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showFilters])

  const filtered = useMemo(() => {
    let ids = [...discovered]

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase().trim()
      ids = ids.filter(id => {
        const el = ELEMENTS[id]
        return el && (el.id.includes(q) || el.name.toLowerCase().includes(q))
      })
    }

    // Category filter
    if (activeCategory !== 'All') {
      ids = ids.filter(id => ELEMENTS[id]?.category === activeCategory)
    }

    // Recently discovered
    if (showRecent) {
      ids = ids.slice(-30)
    }

    return ids
  }, [discovered, query, activeCategory, showRecent])

  const toggleFilters = () => {
    setShowFilters(v => !v)
    if (!showFilters) {
      setQuery('')
      setActiveCategory('All')
      setShowRecent(false)
    }
  }

  return (
    <div className={`collection-panel${showFilters ? ' expanded' : ''}`}>
      <button
        type="button"
        className="filter-toggle"
        onClick={toggleFilters}
        aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        title="Search & filter"
      >
        {showFilters ? '✕' : '🔍'}
      </button>

      {showFilters && (
        <div className="filter-section">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search elements..."
            aria-label="Search discovered elements"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div
            className="category-scroll"
            role="group"
            aria-label="Filter discoveries by category"
          >
            <button
              type="button"
              className={`cat-btn${activeCategory === 'All' ? ' active' : ''}`}
              aria-pressed={activeCategory === 'All'}
              onClick={() => setActiveCategory('All')}
            >All</button>
            {[...cats.keys()].sort((a, b) => a.localeCompare(b)).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-btn${activeCategory === cat ? ' active' : ''}`}
                aria-pressed={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >{cat}</button>
            ))}
          </div>
          <label className="recent-toggle">
            <input
              type="checkbox"
              checked={showRecent}
              onChange={e => setShowRecent(e.target.checked)}
            />
            {' '}Recent only
          </label>
        </div>
      )}

      <div className="icon-grid" aria-label="Discovered elements">
        {filtered.map((id) => {
          const el = ELEMENTS[id]
          if (!el) return null
          return (
            <ElementIcon
              key={id}
              elementId={id}
              name={el.name}
              emoji={el.emoji}
              payload={{ type: 'sidebar', elementId: id }}
              pointerDrag={pointerDrag}
              selected={selection?.type === 'sidebar' && selection.elementId === id}
              onActivate={onActivate}
              onCancelSelection={onCancelSelection}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CollectionPanel
