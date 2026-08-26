import { ELEMENT_CATALOG } from '../data/catalog'
import ElementIcon from './ElementIcon'

function CollectionPanel({ discovered, onDropElement, selectedElement, onSidebarTap, isTouchDevice }) {
  return (
    <div className="collection-panel">
      {discovered.map((id) => {
        const el = ELEMENT_CATALOG[id]
        if (!el) return null
        return (
          <ElementIcon
            key={id}
            elementId={id}
            name={el.name}
            emoji={el.emoji}
            isSelected={selectedElement === id}
            onDragStart={(e, elementId) => {
              e.dataTransfer.setData('text/plain', elementId)
              e.dataTransfer.effectAllowed = 'copy'
            }}
            onTap={(elementId) => {
              onSidebarTap(elementId)
            }}
          />
        )
      })}
    </div>
  )
}

export default CollectionPanel
