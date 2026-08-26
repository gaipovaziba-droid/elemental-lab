function Header({ onReset, onClearWorkspace }) {
  return (
    <header className="app-header">
      <h1>Elemental Lab</h1>
      <div className="header-actions">
        <button type="button" onClick={onClearWorkspace}>Clear Lab</button>
        <button type="button" onClick={onReset}>Reset All</button>
      </div>
    </header>
  )
}

export default Header