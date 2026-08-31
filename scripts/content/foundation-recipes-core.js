// Reachable alternatives for dependency cycles in the authored recipe graph.
// These are intentionally educational relationships, not metric-only bridges.
export const foundationRecipesCore = [
  {
    a: 'stone',
    b: 'water',
    result: 'mineral',
    type: 'environmental',
    explanation: 'Water weathers stone and exposes or carries its constituent mineral grains.',
  },
  {
    a: 'air',
    b: 'night',
    result: 'cold',
    type: 'environmental',
    explanation: 'Without daytime solar heating, nighttime air commonly cools.',
  },
  {
    a: 'earth',
    b: 'tool',
    result: 'flat',
    type: 'industrial',
    explanation: 'Earthmoving tools grade uneven ground into a flat surface.',
  },
  {
    a: 'geology',
    b: 'stone',
    result: 'mineral',
    type: 'conceptual',
    explanation: 'Geologic study identifies the minerals that make up stone.',
  },
  {
    a: 'knowledge',
    b: 'tool',
    result: 'experiment',
    type: 'conceptual',
    explanation: 'Applying knowledge with suitable tools makes a structured experiment possible.',
  },
  {
    a: 'human',
    b: 'rules',
    result: 'law',
    type: 'conceptual',
    explanation: 'Societies formalize rules made by people as laws.',
  },
  {
    a: 'grass',
    b: 'mammal',
    result: 'sheep',
    type: 'conceptual',
    explanation: 'Sheep are grazing mammals adapted to grassland diets.',
  },
  {
    a: 'fire',
    b: 'pot',
    result: 'cooking',
    type: 'industrial',
    explanation: 'Heating ingredients in a pot is a basic cooking process.',
  },
  {
    a: 'change',
    b: 'chemical',
    result: 'reaction',
    type: 'conceptual',
    explanation: 'A chemical change occurs through a reaction.',
  },
]
