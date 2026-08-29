function Header({ discoveredCount, totalCount, onReset, onClearWorkspace }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Elemental Lab</h1>
        <span className="discovered-count">
          {discoveredCount} / {totalCount}
        </span>
      </div>
      <div className="header-actions">
        <button type="button" onClick={onClearWorkspace}>Clear Lab</button>
        <button type="button" onClick={onReset}>Reset All</button>
      </div>
    </header>
  )
}

export default Header