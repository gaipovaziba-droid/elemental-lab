import { ELEMENT_CATALOG } from '../data/catalog'
import ElementIcon from './ElementIcon'

function CollectionPanel({ discovered, pointerDrag }) {
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
            payload={{ type: 'sidebar', elementId: id }}
            pointerDrag={pointerDrag}
          />
        )
      })}
    </div>
  )
}

export default CollectionPanel