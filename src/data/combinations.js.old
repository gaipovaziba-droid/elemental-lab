export const COMBINATIONS = {
  // Tier 1 — from basics
  'air+earth': 'dust',
  'air+fire': 'energy',
  'air+water': 'rain',
  'earth+water': 'plant',
  'earth+fire': 'lava',
  'fire+water': 'steam',
  'dust+water': 'mud',

  // Tier 2 — Nature & environment
  'air+lava': 'stone',
  'lava+water': 'obsidian',
  'mud+plant': 'swamp',
  'earth+plant': 'grass',
  'energy+plant': 'flower',
  'plant+water': 'tree',
  'tree+tree': 'forest',
  'earth+flower': 'garden',
  'earth+energy': 'life',
  'life+stone': 'egg',
  'earth+life': 'beast',

  // Tier 2b — more nature
  'air+stone': 'sand',
  'fire+sand': 'glass',
  'fire+stone': 'metal',
  'mud+stone': 'clay',
  'clay+fire': 'brick',
  'tree+water': 'wood',
  'grass+grass': 'rope',
  'life+water': 'fish',
  'air+egg': 'bird',
  'beast+earth': 'livestock',
  'beast+life': 'human',
  'life+swamp': 'disease',

  // Tier 3 — Materials & tools
  'clay+water': 'pot',
  'flower+rope': 'thread',
  'grass+thread': 'fabric',
  'water+wood': 'paper',
  'stone+wood': 'hammer',
  'metal+wood': 'tool',
  'metal+sand': 'knife',
  'dust+metal': 'spear',
  'mud+wood': 'wheel',

  // Tier 3b — construction
  'tool+wood': 'fence',
  'rope+wood': 'bridge',
  'wheel+wood': 'cart',
  'brick+wood': 'house',

  // Tier 4 — Civilization
  'house+house': 'village',
  'beast+fence': 'farm',
  'farm+life': 'livestock',
  'human+metal': 'sword',
  'sword+wood': 'shield',
  'metal+sword': 'armor',

  // Tier 4b — advanced objects
  'energy+glass': 'lamp',
  'energy+paper': 'book',
  'energy+wheel': 'clock',
  'energy+metal': 'bell',
  'fabric+human': 'cloth',
  'human+thread': 'cloth',
}

export function getCombinationResult(a, b) {
  if (!a || !b) return null
  const key = [a, b].sort().join('+')
  return COMBINATIONS[key] || null
}
