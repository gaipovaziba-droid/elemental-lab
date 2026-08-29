function InfoCard({ element, x, y, anchor }) {
  if (!element) return null

  const el = element
  const hasScience = el.symbol || el.atomicNumber || el.chemicalGroup

  // Position relative to the icon
  const style = anchor === 'sidebar'
    ? { left: x + 48, top: y - 10 }   // to the right of sidebar icon
    : { left: x + 44, top: y - 10 }  // to the right of workspace icon

  // Keep in viewport
  const adjusted = {}
  if (style.left > window.innerWidth - 220) adjusted.left = x - 210
  if (style.top < 10) adjusted.top = 10
  if (style.top > window.innerHeight - 120) adjusted.top = window.innerHeight - 130

  return (
    <div
      className="info-card"
      style={{ ...style, ...adjusted }}
    >
      <div className="info-card-header">
        <span className="info-card-emoji">{el.emoji}</span>
        <div>
          <div className="info-card-name">{el.name}</div>
          {hasScience && (
            <div className="info-card-symbol">
              {el.symbol && <span className="science-badge">({el.symbol})</span>}
              {el.atomicNumber && <span className="science-badge">Z={el.atomicNumber}</span>}
              {el.chemicalGroup && <span className="science-badge">{el.chemicalGroup}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="info-card-desc">{el.description || `${el.name}.`}</div>
      <div className="info-card-category">{el.category}</div>
    </div>
  )
}

export default InfoCard