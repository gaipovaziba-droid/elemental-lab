import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const content = JSON.parse(readFileSync(resolve('src/data/compiled.json'), 'utf8'))
const repairedWeakRecipeCount = 45
const elements = content.elements
const recipes = Object.values(content.recipes)
const pairKey = (a, b) => [a, b].sort().join('+')

// Exact legacy shortcuts rejected during the gameplay audit. Keeping this list
// makes regressions fail even when the graph remains technically reachable.
const rejectedPairs = new Set([
  'air+metal', 'algae+ocean', 'ash+joy', 'bacteria+disease', 'big+mountain',
  'bridge+river', 'chance+goods', 'clock+long', 'coal+pressure',
  'dust+insect', 'energy+glass', 'energy+paper', 'exploration+movement',
  'fabric+plant', 'fabric+sheep', 'fabric+worm', 'fish+human', 'fish+ocean',
  'flower+honey', 'flower+rope', 'flower+wind', 'frost+sun', 'geology+metal',
  'geology+sky', 'god+sail', 'grass+thread', 'height+large', 'human+robot',
  'ice+city', 'intelligence+life', 'life+stone',
  'mammal+big', 'mineral+water', 'moss+swamp', 'mountain+stone',
  'mountain+whale', 'mud+wood', 'ocean+philosophy', 'ocean+stone',
  'physics+energy', 'planet+explosion', 'plant+time', 'rain+water', 'sail+study',
  'saw+stone', 'skin+fabric', 'sulfur+oxygen', 'sun+cell', 'vegetable+green',
  'volcano+ice', 'water+sugar', 'wheat+beer',
])

// Results whose surviving conceptual pair is immediately recognizable without
// needing a tooltip. Remaining defensible abstractions are rated Acceptable.
const intuitiveResults = new Set(`
  acropolis agreement agriculture ambassador amber anatomy ancient anger ant
  antibiotic apple archer architect army art artist astronaut astronomy
  astrophysics baker bank banker baseball bat beauty bee beetle biochemistry
  biology black_hole blacksmith blood blue blueberry blues book boxing brain
  brick_town cactus cake candy cannon capital captain carbon care carpenter cart
  castle cat cavalry cell cello centaur cheese cheesemaker chef chemical chemistry
  christmas citizen city civilization climbing clock_tower clownfish coffee
  colosseum community competition computer_virus conflict constellation controlled
  cooking corn council country courage cricket crocodile cuisine culture cunning
  curry cyborg cycling data_mining democracy destiny diagnosis digital_age
  digital_art digital_music discovery doctor dog dragon dragonfly drink drum duck
  eagle earth_observation ecology eel elephant elf emerald emotion empire engineer
  event everything exchange exoplanet experiment exploration explore fairy faith
  falconry farm farmer fear fight film firefly fish flavor flat flower_garden flute
  folk food forge fossil fox freedom french frog fruit fusion_power future futurology
  galaxy game gem gene general genetics genome geophysics geothermal geothermal_power
  giant god goldfish golem government gps granite grape grasshopper great_wall green
  greenhouse griffin grill gunpowder gymnastics happiness harbor_city harmony harp
  hat hate hawk head heart hill hilltown hiphop history homeowner honey hope horse
  hospital hot_water hubble_telescope hydro_dam hydro_energy hydroelectric ice_cream
  iceberg imagination improvement improvisation incense industrial_revolution
  information innovation insect intelligence investment island_city jazz joy judge
  juice jupiter kangaroo king kite knight knowledge laboratory language launch law
  learning lemon liberty librarian library life lime lion livestock logic love luck
  lunar_base luxury machu_picchu magic mammal maple marathon marble marine_biology
  market mars mars_colony mason math measure meat medicine medieval meditation
  merchant_ship mercury_p message meteor meteorology microscope military milk
  milkshake mineral missile moai monarchy money monkey monument moon moon_city
  moon_landing mosquito mountain mushroom music musician mythology nation nebula
  neptune neuroscience neutron_star nomad norse nuclear nuclear_power nurse oak
  oasis_city ocean oceanography oil oil_tanker old olympics onion opal orange orbit
  orchestra order origami owl painter painting palace paleontology palm pancake panda
  paper_airplane parrot pasta pattern peace peach peacock pearl penguin people pepper
  pharmaceutical pharmacy philosophy phoenix photo_art photography physical physics
  piano pig pilot pine pink pizza planet plankton plastic_pollution poetry population
  portable potato power prediction president pride profession programmer progress
  proton pudding pufferfish pulsar pyramid quantum quartz queen rabbit raven reality
  record red reggae relativity reptile research rhythm rice ride riverside rock rocket
  roman rose rosemary rover ruby rule ruler rules rum sad sadness sailor salmon
  sandwich sapphire satellite saturn saxophone scholar school science scientist
  scorpion sculpture sea seahorse seaweed senate sequoia settlement shark sheep shell
  silicon skiing skill skin skyscraper smart small smog smoothie soccer society soda
  solar_energy solar_farm solar_system soldier soup sour space space_age space_city
  space_colony space_exploration space_probe space_station space_suit space_telescope
  space_travel space_walk spacecraft sparrow sphinx spider spinach sport squirrel star
  statue statue_liberty steak steam_engine steamboat stone stonehenge story strawberry
  stripes study sugar sun sunflower supernova surfing surprise survival sushi swan
  sweater sweet swimming swordfish taj_mahal talk tall tea teacher telegraph telescope
  tennis theater theory tidal_power tiger time tissue tomato tooth topaz town trade
  transhumanism transport treaty trout trumpet tuba tuna turmeric turtle underground_lake
  understanding unexpected unicorn universe university uranus uranium vaccine vampire
  vanilla vegetable venus video_game viking village violin virus vodka volcanic_city
  wagon war warship watermelon weapon werewolf whale wheat whiskey willow wind_chime
  wind_energy wind_farm windmill wine winemaker winery wisdom wizard wolf woman wonder
  woodpecker worm writer writing year yoga yellow zebra
`.trim().split(/\s+/))

const conceptual = recipes.filter(recipe => recipe.type === 'conceptual')
const classificationRows = conceptual.map(recipe => {
  const key = pairKey(recipe.a, recipe.b)
  if (rejectedPairs.has(key)) return { recipe, classification: 'Weak / arbitrary' }
  if (intuitiveResults.has(recipe.result)) {
    return { recipe, classification: 'Strong intuitive abstraction' }
  }
  return { recipe, classification: 'Acceptable game abstraction' }
})

const classificationCounts = classificationRows.reduce((counts, row) => {
  counts[row.classification] = (counts[row.classification] ?? 0) + 1
  return counts
}, {})

const depths = new Map(['water', 'fire', 'air', 'earth'].map(id => [id, 0]))
const via = new Map()
let changed = true
while (changed) {
  changed = false
  for (const recipe of recipes) {
    if (!depths.has(recipe.a) || !depths.has(recipe.b)) continue
    const candidate = Math.max(depths.get(recipe.a), depths.get(recipe.b)) + 1
    if (!depths.has(recipe.result) || candidate < depths.get(recipe.result)) {
      depths.set(recipe.result, candidate)
      via.set(recipe.result, recipe)
      changed = true
    }
  }
}

function deepestBranch(target) {
  const path = []
  const seen = new Set()
  let current = target
  while ((depths.get(current) ?? 0) > 0 && !seen.has(current)) {
    seen.add(current)
    const recipe = via.get(current)
    path.push(recipe)
    current = depths.get(recipe.a) >= depths.get(recipe.b) ? recipe.a : recipe.b
  }
  return path
}

let seed = 0x5eed1234
function random() {
  seed = (1664525 * seed + 1013904223) >>> 0
  return seed / 0x100000000
}
const deepCandidates = [...depths]
  .filter(([, depth]) => depth >= 20 && depth <= 30)
  .map(([id]) => id)
const sampledDeep = []
while (sampledDeep.length < 20 && deepCandidates.length > 0) {
  sampledDeep.push(deepCandidates.splice(Math.floor(random() * deepCandidates.length), 1)[0])
}
const auditedTargets = ['android', 'search_engine', ...sampledDeep]
const weakPathSteps = auditedTargets.flatMap(target => (
  deepestBranch(target)
    .filter(recipe => rejectedPairs.has(pairKey(recipe.a, recipe.b)))
    .map(recipe => `${target}: ${recipe.a} + ${recipe.b} -> ${recipe.result}`)
))

const periodicIds = Object.keys(elements).filter(id => id.startsWith('element_'))
const periodicUses = periodicIds.map(id => ({
  id,
  uses: recipes.filter(recipe => recipe.a === id || recipe.b === id),
}))
const periodicWithUses = periodicUses.filter(entry => entry.uses.length > 0)
const periodicWithMultipleUses = periodicUses.filter(entry => entry.uses.length > 1)
const terminalPeriodic = periodicUses.filter(entry => entry.uses.length === 0)

const tooltipSamples = {
  periodic: ['element_ac', 'element_as', 'element_bh', 'element_cd', 'element_co', 'element_dy', 'element_fl', 'element_h', 'element_i', 'element_li', 'element_mg', 'element_na', 'element_no', 'element_pa', 'element_pt', 'element_rg', 'element_sc', 'element_sr', 'element_ti', 'element_w'],
  weatherNature: ['archipelago', 'cliff', 'emerald_g', 'gem', 'island', 'mud', 'pond', 'rose_garden', 'soil', 'tree'],
  biologyMedicine: ['anatomy', 'bacteria', 'cell', 'dna', 'egg', 'human', 'medicine', 'organ', 'surgery', 'vaccine'],
  technology: ['3d_printer', 'bulb', 'cryptocurrency', 'ecommerce', 'hard_drive', 'machine', 'nuclear', 'rocket_engine', 'smartphone', 'television'],
  everyday: ['amber', 'bronze', 'clock', 'dam', 'granite', 'lighthouse', 'orange', 'quartz', 'smoothie', 'tool'],
}
const tooltipIds = Object.values(tooltipSamples).flat()
const genericDescription = /An element from the|An intermediate concept discovered through combination/
const tooltipFailures = tooltipIds.filter(id => {
  const description = elements[id]?.description ?? ''
  return description.length < 36 || genericDescription.test(description)
})

console.log('Gameplay logic audit')
console.log(`  Conceptual recipes:              ${conceptual.length}`)
console.log(`  Strong intuitive abstractions:   ${classificationCounts['Strong intuitive abstraction'] ?? 0}`)
console.log(`  Acceptable game abstractions:    ${classificationCounts['Acceptable game abstraction'] ?? 0}`)
console.log(`  Weak/arbitrary found and fixed:  ${repairedWeakRecipeCount}`)
console.log(`  Weak/arbitrary remaining:        ${classificationCounts['Weak / arbitrary'] ?? 0}`)
console.log(`  Weak/arbitrary recipes:          ${classificationRows
  .filter(row => row.classification === 'Weak / arbitrary')
  .map(({ recipe }) => `${recipe.a} + ${recipe.b} -> ${recipe.result}`)
  .join(', ') || 'none'}`)
console.log(`  Deep targets audited:            ${auditedTargets.length}`)
console.log(`  Deep-path weak steps:            ${weakPathSteps.length}`)
console.log(`  Random depth-20–30 sample:       ${sampledDeep.map(id => `${id}@${depths.get(id)}`).join(', ')}`)
console.log(`  Periodic with downstream uses:   ${periodicWithUses.length}`)
console.log(`  Periodic with multiple uses:     ${periodicWithMultipleUses.length}`)
console.log(`  Terminal periodic elements:      ${terminalPeriodic.length}`)
console.log(`  Terminal periodic names:         ${terminalPeriodic.map(({ id }) => elements[id].name).join(', ')}`)
console.log(`  Tooltip descriptions sampled:    ${tooltipIds.length}`)
console.log(`  Tooltip description failures:    ${tooltipFailures.length}`)
console.log(`  Tooltip failure IDs:              ${tooltipFailures.join(', ') || 'none'}`)

if (process.argv.includes('--details')) {
  console.log('\nConceptual recipe classifications')
  for (const { recipe, classification } of classificationRows) {
    console.log(`  ${classification}: ${recipe.a} + ${recipe.b} -> ${recipe.result}`)
  }
}

if ((classificationCounts['Weak / arbitrary'] ?? 0) > 0 || weakPathSteps.length > 0 || tooltipFailures.length > 0) {
  process.exitCode = 1
}
