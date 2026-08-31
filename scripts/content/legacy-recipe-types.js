const pairKey = (a, b) => [a, b].sort().join('+')

const pairTypes = new Map()

function assign(type, pairs) {
  for (const pair of pairs) pairTypes.set(pairKey(...pair), type)
}

// These are relationship-specific classifications. They intentionally do not
// infer a type from the catalog category of either input or the result.
assign('chemical', [
  ['base', 'oil'],
  ['burn', 'fossil'],
  ['electrolysis', 'water'],
  ['fire', 'wood'],
  ['atom', 'chemical'],
  ['compound', 'energy'],
  ['molecule', 'reaction'],
])

assign('physical', [
  ['air', 'ice'],
  ['air', 'rubber'],
  ['attraction', 'mass'],
  ['blue', 'red'],
  ['carbon', 'pressure'],
  ['electricity', 'magnetism'],
  ['earth', 'pressure'],
  ['fire', 'water'],
  ['heat', 'water'],
  ['light', 'prism'],
  ['lava', 'water'],
  ['red', 'yellow'],
  ['water', 'cold'],
  ['apple', 'press'],
  ['bean', 'hot_water'],
  ['fruit', 'blend'],
  ['grape', 'press'],
  ['leaf', 'hot_water'],
  ['milk', 'churn'],
  ['pressure', 'stone'],
])

assign('biological', [
  ['cell', 'cell'],
  ['cell', 'signal'],
  ['cell', 'tissue'],
  ['earth', 'plant'],
  ['earth', 'seed'],
  ['earth', 'water'],
  ['farm', 'seed'],
  ['ferment', 'grain'],
  ['ferment', 'grape'],
  ['field', 'plant'],
  ['fruit', 'plant'],
  ['plant', 'water'],
  ['plant', 'worm'],
  ['tree', 'water'],
  ['tissue', 'tissue'],
])

assign('environmental', [
  ['air', 'cloud'],
  ['air', 'earth'],
  ['air', 'energy'],
  ['air', 'steam'],
  ['air', 'water'],
  ['cloud', 'cold'],
  ['cloud', 'energy'],
  ['cold', 'rain'],
  ['dust', 'water'],
  ['energy', 'storm'],
  ['life', 'nature'],
  ['life', 'ocean'],
  ['life', 'tree'],
  ['mud', 'plant'],
  ['rain', 'sun'],
  ['sand', 'sun'],
  ['air', 'pollution'],
  ['ice', 'ocean'],
])

assign('industrial', [
  ['carbon', 'iron'],
  ['chemical', 'electricity'],
  ['chemistry', 'oil'],
  ['clay', 'fire'],
  ['fire', 'ore'],
  ['fire', 'sand'],
  ['fire', 'stone'],
  ['flour', 'water'],
  ['glass', 'physics'],
  ['heat', 'sand'],
  ['mill', 'wheat'],
  ['mineral', 'mining'],
  ['mud', 'stone'],
  ['fire', 'food'],
  ['fire', 'meat'],
  ['garden', 'glass'],
  ['grape', 'wine'],
  ['knitting', 'wool'],
  ['vegetable', 'water'],
])

assign('technological', [
  ['computer', 'network'],
  ['dam', 'water'],
  ['electricity', 'engine'],
  ['electricity', 'glass'],
  ['electricity', 'metal'],
  ['electricity', 'storage'],
  ['electricity', 'turbine'],
  ['electronics', 'wire'],
  ['engine', 'wheel'],
  ['memory', 'processor'],
  ['solar_panel', 'sun'],
  ['silicon', 'transistor'],
  ['communication', 'electricity'],
  ['electricity', 'light'],
  ['fire', 'rocket'],
  ['fusion', 'nuclear'],
  ['light', 'camera'],
])

const resultTypes = new Map()

function assignResults(type, ids) {
  for (const id of ids.split(/\s+/).filter(Boolean)) resultTypes.set(id, type)
}

assignResults('environmental', `
  archipelago beach cliff cloud cold desert desert_eco dust fjord fog forest_eco
  frost geyser glacier global_warming hill hurricane ice island lagoon lake lava
  lightning meltwater mountain mud oasis_geo ocean ocean_eco plains pollution pond
  rain reef river sand sandstorm sea sea_rise snow soil storm swamp tide tsunami
  valley volcano waterfall wave wildfire wind winter autumn spring summer season
`)

assignResults('technological', `
  3d_printer actuator ai airplane algorithm android app battery bicycle blockchain
  bulb bus capacitor car circuit code communication computer cryptocurrency data
  database diode display drone ecommerce electric_car electricity engine firewall
  generator glider hard_drive helicopter hot_air_balloon hovercraft internet
  jet_engine logistics machine machine_learning memory microchip motorcycle motor
  music_player network neural_network plane processor programming quantum_computer
  radio robot rocket_engine satellite_comm search_engine semiconductor sensor
  smartphone smart_robot social_media software solar_cell solar_panel touchscreen
  train transistor transport truck turbine television virtual_reality webcam website
  wifi wire yacht speedboat sports_car sedan submarine suv ship
`)

assignResults('industrial', `
  accordion armor assembly_line automation automation_i barn beer bomb bow bread
  brick bridge bronze building candle cannon castle_b clothing concrete construction
  dough fabric factory fence flour fortress glass gold gun gunpowder hammer harvest
  hat house industry irrigation knife lamp lighthouse mass_production metal mirror
  ore paper perfume pickaxe plastic pot pottery quality_control road rope saw
  screwdriver shield shoes silk_f soap spear steel sword temple thread tool tower
  tractor tunnel wheel wine wood wool
`)

assignResults('biological', `
  crop flower forest garden gene grass herb_garden life livestock organ plant
  rice_paddy rose_garden seed tissue tree vegetable_garden vineyard wheat_field
`)

assignResults('physical', `
  balloon electromagnetism energy gravity heat lens magnetism pressure steam
`)

const conceptualOverrides = new Set([
  pairKey('big', 'gun'),
  pairKey('clothing', 'head'),
  pairKey('cell', 'tissue'),
  pairKey('dna', 'information'),
  pairKey('discovery', 'tool'),
  pairKey('earth', 'energy'),
  pairKey('farm', 'life'),
  pairKey('improvement', 'invention'),
  pairKey('king', 'stone'),
  pairKey('energy', 'iron'),
  pairKey('military', 'tool'),
  pairKey('movement', 'wheel'),
  pairKey('ocean', 'large'),
  pairKey('piano', 'portable'),
  pairKey('sulfur', 'carbon'),
  pairKey('water', 'small'),
  pairKey('water', 'water'),
  pairKey('earth', 'earth'),
])

pairTypes.set(pairKey('tree', 'tree'), 'environmental')

export function classifyLegacyRecipe(a, b, result) {
  const key = pairKey(a, b)
  if (conceptualOverrides.has(key)) return 'conceptual'
  return pairTypes.get(key) ?? resultTypes.get(result) ?? 'conceptual'
}
