import compiledData from './compiled.json'

const { elements: ELEMENTS, recipes: RECIPES, categories: CATEGORIES, quality: QUALITY } = compiledData

export { ELEMENTS, RECIPES, CATEGORIES, QUALITY }

export const TOTAL_ELEMENT_COUNT = Object.keys(ELEMENTS).length
export const STARTER_IDS = ['water', 'fire', 'air', 'earth']

export function getCombinationResult(a, b) {
  if (!a || !b) return null
  const key = [a, b].sort().join('+')
  return RECIPES[key] ? RECIPES[key].result : null
}

export function getElementCategories() {
  const cats = new Map()
  Object.values(ELEMENTS).forEach(el => {
    if (!cats.has(el.category)) cats.set(el.category, [])
    cats.get(el.category).push(el.id)
  })
  return cats
}

export function searchElements(query, discoveredIds) {
  const q = query.toLowerCase().trim()
  if (!q) return discoveredIds
  return discoveredIds.filter(id => {
    const el = ELEMENTS[id]
    return el && (el.id.includes(q) || el.name.toLowerCase().includes(q))
  })
}

export function filterByCategory(ids, category) {
  if (!category || category === 'All') return ids
  return ids.filter(id => ELEMENTS[id]?.category === category)
}

export function getRecentlyDiscovered(ids, elements, count = 20) {
  // IDs are in discovery order (newest last)
  return ids.slice(-count)
}

export function saveMigrationCheck(savedState) {
  if (!savedState) return false
  // Check if saved discovered IDs are valid in the new element set
  const valid = savedState.discovered?.every(id => ELEMENTS[id])
  return valid !== false
}