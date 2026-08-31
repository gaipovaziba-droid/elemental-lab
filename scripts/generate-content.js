import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { foundationRecipesA } from './content/foundation-recipes-a.js'
import { foundationRecipesB } from './content/foundation-recipes-b.js'
import { foundationRecipesCore } from './content/foundation-recipes-core.js'
import { foundationRecipesDomain } from './content/foundation-recipes-domain.js'
import { periodicRecipes } from './content/periodic-recipes.js'
import { periodicUseRecipes } from './content/periodic-use-recipes.js'
import { classifyLegacyRecipe } from './content/legacy-recipe-types.js'
const __dirname = dirname(fileURLToPath(import.meta.url))

const STARTER_IDS = ['water', 'fire', 'air', 'earth']
const RECIPE_TYPES = new Set([
  'chemical',
  'physical',
  'biological',
  'industrial',
  'environmental',
  'technological',
  'conceptual',
])

function sortKey(a, b) {
  const parts = [a, b].sort()
  return parts.join('+')
}

const R = {}
const E = {}
const CAT = {}
const QUALITY = {} // resultId -> 'strong' | 'reasonable'

function el(id, name, emoji, category, tags = [], opts = {}) {
  if (E[id]) {
    // Merge science metadata if new data provided
    if (opts.symbol) E[id].symbol = opts.symbol
    if (opts.atomicNumber) E[id].atomicNumber = opts.atomicNumber
    if (opts.chemicalGroup) E[id].chemicalGroup = opts.chemicalGroup
    if (opts.description) E[id].description = opts.description
    return id
  }
  E[id] = { id, name, emoji, category, tags }
  if (opts.description) E[id].description = opts.description
  if (opts.symbol) E[id].symbol = opts.symbol
  if (opts.atomicNumber) E[id].atomicNumber = opts.atomicNumber
  if (opts.chemicalGroup) E[id].chemicalGroup = opts.chemicalGroup
  CAT[category] = true
  return id
}

function re(
  a,
  b,
  result,
  quality = 'reasonable',
  recipeType,
  explanation,
) {
  const key = sortKey(a, b)
  if (!R[key]) {
    const resolvedType = recipeType ?? classifyLegacyRecipe(a, b, result)
    R[key] = { a, b, result, type: resolvedType }
    if (explanation) R[key].explanation = explanation
    if (quality === 'strong') QUALITY[result] = 'strong'
    else if (!QUALITY[result]) QUALITY[result] = 'reasonable'
  }
}

function removeLegacyRecipe(a, b, expectedResult) {
  const key = sortKey(a, b)
  if (R[key]?.result !== expectedResult) {
    throw new Error(`Gameplay audit could not remove ${a} + ${b} -> ${expectedResult}`)
  }
  delete R[key]
}

function replaceLegacyRecipe({ from, to, result, type, explanation }) {
  removeLegacyRecipe(from[0], from[1], result)
  const replacementKey = sortKey(to[0], to[1])
  if (R[replacementKey] && R[replacementKey].result !== result) {
    throw new Error(
      `Gameplay audit conflict at ${replacementKey}: ${R[replacementKey].result} vs ${result}`,
    )
  }
  re(to[0], to[1], result, 'strong', type, explanation)
}

/* ─── 4 STARTERS ─── */
el('water','Water','💧','Basics')
el('fire','Fire','🔥','Basics')
el('air','Air','💨','Basics')
el('earth','Earth','🌍','Basics')

/* ─── BATCH A — Foundations & Nature ─── */
el('plant','Plant','🌱','Nature')
re('earth','water','plant','strong')
el('lava','Lava','🌋','Geology')
re('earth','fire','lava','strong')
el('steam','Steam','♨️','Physics')
re('fire','water','steam','strong')
el('dust','Dust','🏜️','Earth')
re('air','earth','dust','strong')
el('energy','Energy','⚡','Physics')
re('air','fire','energy','strong')
re('sun','solar_panel','energy','reasonable')
re('water','dam','energy','reasonable')
el('rain','Rain','🌧️','Weather')
re('air','water','rain','strong')
el('mud','Mud','🧴','Earth')
re('dust','water','mud','strong')
el('stone','Stone','🪨','Geology')
re(
  'air',
  'lava',
  'stone',
  'strong',
  'physical',
  'Lava exposed to cooler air loses heat and solidifies into volcanic rock.',
)
re('earth','pressure','stone','reasonable')
el('swamp','Swamp','🏞️','Nature')
re('mud','plant','swamp','strong')
el('grass','Grass','🌿','Nature')
re('earth','plant','grass','strong')
el('flower','Flower','🌸','Nature')
re('energy','plant','flower','strong')
el('tree','Tree','🌳','Nature')
re('plant','water','tree','strong')
re('seed','earth','tree','reasonable')
el('forest','Forest','🌲','Nature')
re('tree','tree','forest','strong')
el('garden','Garden','🪴','Nature')
re('earth','flower','garden','strong')
el('life','Life','🧬','Biology')
re('earth','energy','life','strong')
el('sand','Sand','🏖️','Geology')
re('air','stone','sand','strong')
el('cold','Cold','🥶','Weather')
re('air','ice','cold','strong')
el('ice','Ice','🧊','Weather')
re('water','cold','ice','strong')
el('snow','Snow','❄️','Weather')
re('rain','cold','snow','strong')
el('cloud','Cloud','☁️','Weather')
re('air','steam','cloud','strong')
el('fog','Fog','🌁','Weather')
re('air','cloud','fog','strong')
el('storm','Storm','⛈️','Weather')
re('cloud','energy','storm','strong')
el('lightning','Lightning','⚡','Weather')
re('storm','energy','lightning','strong')
el('wind','Wind','💨','Weather')
re('air','energy','wind','strong')
el('rainbow','Rainbow','🌈','Weather')
re('rain','sun','rainbow','strong')
el('mountain','Mountain','⛰️','Geology')
re('earth','stone','mountain','strong')
re('lava','stone','mountain','reasonable')
el('volcano','Volcano','🌋','Geology')
re('lava','mountain','volcano','strong')
el('cave','Cave','🕳️','Geology')
re('stone','hole','cave','strong')
el('lake','Lake','🫗','Geography')
re('water','hole','lake','strong')
el('river','River','🏞️','Geography')
re('water','mountain','river','strong')
el('ocean','Ocean','🌊','Geography')
re('water','water','ocean','strong')
el('island','Island','🏝️','Geography')
re('land','ocean','island','strong')
el('desert','Desert','🏜️','Geography')
re('sand','sand','desert','strong')
el('plains','Plains','🏞️','Geography')
re('earth','flat','plains','strong')
el('hill','Hill','⛰️','Geography')
re('earth','earth','hill','strong')
el('valley','Valley','🏞️','Geography')
re('mountain','river','valley','strong')
el('cliff','Cliff','🧗','Geography')
re('mountain','ocean','cliff','strong')
el('beach','Beach','🏖️','Geography')
re('ocean','sand','beach','strong')
el('soil','Soil','🫘','Earth')
re('earth','worm','soil','strong')
re('sand','mud','soil','reasonable')
el('clay','Clay','🏺','Materials')
re('mud','stone','clay','strong')
el('obsidian','Obsidian','🪨','Geology')
re('lava','water','obsidian','strong')
re('volcano','ice','obsidian','reasonable')

/* ─── BATCH B — Life & Ecosystems ─── */
el('egg','Egg','🥚','Biology')
re('life','stone','egg','strong')
el('beast','Beast','🐾','Animals')
re('earth','life','beast','strong')
el('fish','Fish','🐟','Animals')
re('life','water','fish','strong')
el('bird','Bird','🐦','Animals')
re('egg','air','bird','strong')
re('egg','sky','bird','reasonable')
el('worm','Worm','🪱','Biology')
re('life','earth','worm','strong')
el('insect','Insect','🐛','Animals')
re('life','swamp','insect','strong')
el('reptile','Reptile','🐍','Animals')
re('life','desert','reptile','strong')
el('mammal','Mammal','🐾','Animals')
re('life','beast','mammal','strong')
el('human','Human','🧑','Biology')
re('beast','life','human','strong')
el('disease','Disease','🤒','Biology')
re('life','swamp','disease','strong')
re('bacteria','human','disease','reasonable')
el('bacteria','Bacteria','🦠','Biology')
re('life','decay','bacteria','strong')
el('virus','Virus','🦠','Biology')
re('disease','genetics','virus','strong')
el('moss','Moss','🌿','Plants')
re('plant','stone','moss','strong')
el('fern','Fern','🌿','Plants')
re('plant','shade','fern','strong')
el('mushroom','Mushroom','🍄','Plants')
re('moss','swamp','mushroom','strong')
el('algae','Algae','🌿','Plants')
re('plant','water','algae','strong')
el('coral','Coral','🪸','Animals')
re('algae','ocean','coral','strong')
re('life','reef','coral','reasonable')
el('bee','Bee','🐝','Animals')
re('insect','flower','bee','strong')
el('butterfly','Butterfly','🦋','Animals')
re('insect','flower','butterfly','strong')
el('spider','Spider','🕷️','Animals')
re('insect','web','spider','strong')
el('snake','Snake','🐍','Animals')
re('reptile','long','snake','strong')
el('turtle','Turtle','🐢','Animals')
re('reptile','shell','turtle','strong')
el('crocodile','Crocodile','🐊','Animals')
re('reptile','river','crocodile','strong')
el('frog','Frog','🐸','Animals')
re('life','rain','frog','strong')
el('dog','Dog','🐕','Animals')
re('beast','human','dog','strong')
el('cat','Cat','🐈','Animals')
re('beast','mouse','cat','strong')
el('horse','Horse','🐎','Animals')
re('beast','ride','horse','strong')
el('cow','Cow','🐄','Animals')
re('livestock','grass','cow','strong')
el('whale','Whale','🐋','Animals')
re('fish','ocean','whale','strong')
el('dolphin','Dolphin','🐬','Animals')
re('fish','human','dolphin','reasonable')
el('shark','Shark','🦈','Animals')
re('fish','beast','shark','strong')
el('eagle','Eagle','🦅','Animals')
re('bird','mountain','eagle','strong')
el('owl','Owl','🦉','Animals')
re('bird','night','owl','strong')
el('forest_eco','Forest','🌲','Ecosystem')
re('tree','life','forest_eco','strong')
el('desert_eco','Desert','🏜️','Ecosystem')
re('sand','sun','desert_eco','strong')
el('ocean_eco','Ocean','🌊','Ecosystem')
re('ocean','life','ocean_eco','strong')
el('ecosystem','Ecosystem','🌍','Biology')
re('nature','life','ecosystem','strong')

/* ─── BATCH C — Humans, Agriculture & Food ─── */
el('seed','Seed','🌱','Agriculture')
re('plant','fruit','seed','strong')
el('agriculture','Agriculture','🌾','Agriculture')
re('farm','science','agriculture','strong')
el('farm','Farm','🌾','Agriculture')
re('beast','fence','farm','strong')
el('livestock','Livestock','🐄','Agriculture')
re('farm','life','livestock','strong')
el('field','Field','🌾','Agriculture')
re('earth','seed','field','strong')
el('crop','Crop','🌿','Agriculture')
re('seed','farm','crop','strong')
el('harvest','Harvest','🌾','Agriculture')
re('crop','tool','harvest','strong')
el('irrigation','Irrigation','💧','Agriculture')
re('water','farm','irrigation','strong')
el('tractor','Tractor','🚜','Agriculture')
re('farm','engine','tractor','strong')
el('fruit','Fruit','🍎','Food')
re('flower','sweet','fruit','strong')
el('apple','Apple','🍎','Food')
re('fruit','tree','apple','strong')
el('orange','Orange','🍊','Food')
re('fruit','citrus','orange','strong')
el('banana','Banana','🍌','Food')
re('fruit','tropic','banana','strong')
el('grape','Grape','🍇','Food')
re('fruit','vine','grape','strong')
el('vegetable','Vegetable','🥕','Food')
re('plant','root','vegetable','strong')
el('carrot','Carrot','🥕','Food')
re('vegetable','orange','carrot','strong')
el('potato','Potato','🥔','Food')
re('vegetable','dirt','potato','strong')
el('wheat','Wheat','🌾','Food')
re('crop','grass','wheat','strong')
el('corn','Corn','🌽','Food')
re('crop','yellow','corn','strong')
el('rice','Rice','🍚','Food')
re('crop','water','rice','strong')
el('food','Food','🍽️','Food')
re('agriculture','cooking','food','strong')
el('cooking','Cooking','🍳','Food')
re('fire','food','cooking','strong')
el('bread','Bread','🍞','Food')
re('dough','fire','bread','strong')
el('dough','Dough','🥖','Food')
re('flour','water','dough','strong')
el('flour','Flour','🌾','Food')
re('wheat','mill','flour','strong')
el('cheese','Cheese','🧀','Food')
re('milk','culture','cheese','strong')
el('wine','Wine','🍷','Food')
re('grape','ferment','wine','strong')
el('beer','Beer','🍺','Food')
re('grain','ferment','beer','strong')
el('coffee','Coffee','☕','Food')
re('bean','hot_water','coffee','strong')
el('tea','Tea','🍵','Food')
re('leaf','hot_water','tea','strong')
el('chocolate','Chocolate','🍫','Food')
re('cacao','sugar','chocolate','strong')
el('sugar','Sugar','🍬','Food')
re('cane','sweet','sugar','strong')
el('salt','Salt','🧂','Food')
re('mineral','flavor','salt','strong')
el('milk','Milk','🥛','Food')
re('livestock','liquid','milk','strong')
el('meat','Meat','🥩','Food')
re('livestock','butcher','meat','strong')
el('butter','Butter','🧈','Food')
re('milk','churn','butter','strong')
el('cake','Cake','🎂','Food')
re('dough','sugar','cake','strong')
el('pizza','Pizza','🍕','Food')
re('dough','cheese','pizza','strong')
el('sandwich','Sandwich','🥪','Food')
re('bread','meat','sandwich','strong')
el('soup','Soup','🍜','Food')
re('water','vegetable','soup','strong')
el('salad','Salad','🥗','Food')
re('vegetable','fresh','salad','strong')
el('honey','Honey','🍯','Food')
re('bee','flower','honey','strong')

/* ─── BATCH D — Materials & Civilization ─── */
el('glass','Glass','🪟','Materials')
re('fire','sand','glass','strong')
el('metal','Metal','🔩','Materials')
re('fire','mineral','metal','strong')
el('brick','Brick','🧱','Construction')
re('clay','fire','brick','strong')
el('wood','Wood','🪵','Materials')
re('tree','water','wood','strong')
re('tree','axe','wood','reasonable')
el('rope','Rope','🪢','Materials')
re('grass','grass','rope','strong')
el('fabric','Fabric','🧵','Materials')
re('thread','thread','fabric','strong')
el('thread','Thread','🧶','Materials')
re('cotton','tool','thread','strong')
el('paper','Paper','📄','Materials')
re('water','wood','paper','strong')
el('tool','Tool','🔧','Tools')
re('metal','wood','tool','strong')
el('wheel','Wheel','⚙️','Tools')
re('river','wood','wheel','strong')
el('pot','Pot','🪣','Tools')
re('clay','water','pot','strong')
el('knife','Knife','🔪','Tools')
re('metal','sand','knife','strong')
el('hammer','Hammer','🔨','Tools')
re('stone','wood','hammer','strong')
el('spear','Spear','🗡️','Weapons')
re('dust','metal','spear','strong')
el('sword','Sword','⚔️','Weapons')
re('human','metal','sword','strong')
el('shield','Shield','🛡️','Weapons')
re('sword','wood','shield','strong')
el('armor','Armor','🪖','Weapons')
re('metal','sword','armor','strong')
el('house','House','🏠','Construction')
re('brick','wood','house','strong')
el('fence','Fence','🪵','Construction')
re('tool','wood','fence','strong')
el('bridge','Bridge','🌉','Construction')
re('rope','wood','bridge','strong')
el('cart','Cart','🛞','Transport')
re('wheel','wood','cart','strong')
el('village','Village','🏘️','Society')
re('house','house','village','strong')
el('city','City','🏙️','Society')
re('village','population','city','strong')
el('concrete','Concrete','🏗️','Construction')
re('stone','cement','concrete','strong')
el('wood','Wood','🪵','Materials')
re('tree','axe','wood','reasonable')
el('plastic','Plastic','🧴','Materials')
re('oil','chemistry','plastic','strong')
el('gold','Gold','🥇','Materials')
re('fire','ore','gold','strong')
el('silver','Silver','🥈','Materials')
re('fire','ore','silver','strong')
el('copper','Copper','🪙','Materials')
re('fire','ore','copper','strong')
el('iron','Iron','⛓️','Materials')
re('fire','ore','iron','strong')
el('steel','Steel','⚙️','Materials')
re('iron','carbon','steel','strong')
el('bronze','Bronze','🏆','Materials')
re('copper','tin','bronze','strong')
el('diamond','Diamond','💎','Materials')
re('carbon','pressure','diamond','strong')
el('crystal','Crystal','💎','Materials')
re('mineral','time','crystal','strong')
el('ceramic','Ceramic','🏺','Materials')
re('clay','fire','ceramic','strong')
el('mineral','Mineral','💎','Geology')
re('stone','earth','mineral','strong')
el('fossil','Fossil','🦴','Geology')
re('stone','bone','fossil','strong')
el('coal','Coal','🪨','Energy')
re('fossil','time','coal','strong')
re('plant','time','coal','reasonable')
el('oil','Oil','🛢️','Energy')
re('fossil','heat','oil','reasonable')
el('gas','Gas','⛽','Energy')
re('oil','fire','gas','strong')

/* ─── BATCH E — Science & Medicine ─── */
el('science','Science','🔬','Science')
re('knowledge','experiment','science','strong')
el('chemistry','Chemistry','⚗️','Science')
re('science','matter','chemistry','strong')
el('physics','Physics','🔭','Science')
re('science','energy','physics','strong')
el('biology','Biology','🧬','Science')
re('life','study','biology','strong')
el('astronomy','Astronomy','🔭','Science')
re('star','science','astronomy','strong')
el('medicine','Medicine','💊','Biology')
re('health','science','medicine','strong')
el('hospital','Hospital','🏥','Society')
re('medicine','building','hospital','strong')
el('surgery','Surgery','🔪','Biology')
re('medicine','knife','surgery','strong')
el('vaccine','Vaccine','💉','Biology')
re('medicine','virus','vaccine','strong')
el('antibiotic','Antibiotic','💊','Biology')
re('medicine','bacteria','antibiotic','strong')
el('dna','DNA','🧬','Biology')
re('cell','chemistry','dna','strong')
el('gene','Gene','🧬','Biology')
re('dna','information','gene','strong')
el('microscope','Microscope','🔬','Tools')
re('lens','science','microscope','strong')
el('telescope','Telescope','🔭','Tools')
re('lens','star','telescope','strong')
el('lens','Lens','🔍','Physics')
re('glass','physics','lens','strong')
el('laboratory','Laboratory','🧪','Science')
re('science','building','laboratory','strong')

/* ─── BATCH F — Industry & Transportation ─── */
el('machine','Machine','⚙️','Technology')
re('tool','engine','machine','strong')
re('metal','gear','machine','reasonable')
el('engine','Engine','🔧','Technology')
re(
  'metal',
  'steam',
  'engine',
  'strong',
  'technological',
  'A steam engine uses pressurized steam to drive metal machinery; this recipe represents that engineering system.',
)
re('steam','piston','engine','reasonable')
el('factory','Factory','🏭','Industry')
re('tool','machine','factory','strong')
el('industry','Industry','🏭','Industry')
re('factory','production','industry','strong')
el('transport','Transport','🚗','Transport')
re('wheel','movement','transport','strong')
el('car','Car','🚗','Transport')
re('engine','wheel','car','strong')
el('truck','Truck','🚛','Transport')
re('car','cargo','truck','strong')
el('bus','Bus','🚌','Transport')
re('car','group','bus','strong')
el('train','Train','🚂','Transport')
re('engine','rail','train','strong')
el('bicycle','Bicycle','🚲','Transport')
re('wheel','frame','bicycle','strong')
el('boat','Boat','⛵','Transport')
re('wood','water','boat','strong')
el('ship','Ship','🚢','Transport')
re('boat','ocean','ship','strong')
el('plane','Plane','✈️','Transport')
re('engine','wing','plane','strong')
el('road','Road','🛣️','Transport')
re('stone','construction','road','strong')
el('bridge','Bridge','🌉','Construction')
re('wood','stone','bridge','strong')
el('tunnel','Tunnel','🕳️','Construction')
re('cave','tool','tunnel','strong')
el('dam','Dam','🏗️','Construction')
re('river','concrete','dam','strong')
el('mining','Mining','⛏️','Industry')
re('cave','tool','mining','strong')
el('ore','Ore','🪨','Industry')
re('mineral','mining','ore','strong')
el('smelting','Smelting','🔥','Industry')
re('ore','fire','smelting','strong')

/* ─── BATCH G — Electricity & Electronics ─── */
el('electricity','Electricity','⚡','Energy')
re('energy','metal','electricity','strong')
re('sun','solar_cell','electricity','reasonable')
re('water','dam','electricity','reasonable')
re('wind','turbine','electricity','reasonable')
el('battery','Battery','🔋','Energy')
re('electricity','storage','battery','strong')
el('lamp','Lamp','💡','Tools')
re('bulb','tool','lamp','strong')
el('wire','Wire','🔌','Technology')
re('metal','electricity','wire','strong')
el('bulb','Light Bulb','💡','Technology')
re('electricity','glass','bulb','strong')
el('generator','Generator','⚡','Technology')
re('turbine','electricity','generator','strong')
el('motor','Motor','⚙️','Technology')
re('electricity','engine','motor','strong')
el('turbine','Turbine','🌀','Technology')
re('wheel','steam','turbine','strong')
re('wind','blade','turbine','reasonable')
el('solar_cell','Solar Cell','☀️','Energy')
re('sun','silicon','solar_cell','strong')
el('solar_panel','Solar Panel','☀️','Energy')
re('solar_cell','array','solar_panel','strong')
el('electronics','Electronics','💻','Technology')
re('electricity','metal','electronics','strong')
el('circuit','Circuit','🔌','Technology')
re('wire','electronics','circuit','strong')
el('transistor','Transistor','🔌','Technology')
re('silicon','circuit','transistor','strong')
el('silicon','Silicon','💻','Materials')
re('sand','carbon','silicon','strong')
el('microchip','Microchip','💾','Technology')
re('silicon','transistor','microchip','strong')
el('processor','Processor','💻','Technology')
re('microchip','speed','processor','strong')
el('memory','Memory','💾','Technology')
re('microchip','storage','memory','strong')
el('computer','Computer','💻','Technology')
re('processor','memory','computer','strong')
el('clock','Clock','🕐','Tools')
re('energy','wheel','clock','strong')
el('bell','Bell','🔔','Tools')
re('energy','metal','bell','strong')

/* ─── BATCH H — Computing, Internet & AI ─── */
el('software','Software','💿','Technology')
re('computer','code','software','strong')
el('code','Code','💻','Technology')
re('computer','logic','code','strong')
el('programming','Programming','💻','Technology')
re('code','language','programming','strong')
el('algorithm','Algorithm','🔢','Technology')
re('programming','math','algorithm','strong')
el('data','Data','📊','Technology')
re('information','storage','data','strong')
el('database','Database','🗄️','Technology')
re('data','computer','database','strong')
el('network','Network','🔗','Technology')
re('computer','link','network','strong')
el('internet','Internet','🌐','Technology')
re('computer','network','internet','strong')
el('wifi','WiFi','📶','Technology')
re('internet','wireless','wifi','strong')
el('server','Server','🖥️','Technology')
re('computer','network','server','strong')
el('website','Website','🌐','Technology')
re('internet','software','website','strong')
el('search_engine','Search Engine','🔍','Technology')
re('internet','algorithm','search_engine','strong')
el('smartphone','Smartphone','📱','Technology')
re('phone','computer','smartphone','strong')
el('ai','AI','🧠','Technology')
re('computer','intelligence','ai','strong')
re('data','algorithm','ai','reasonable')
el('machine_learning','Machine Learning','🤖','Technology')
re('ai','data','machine_learning','strong')
el('neural_network','Neural Network','🧠','Technology')
re('machine_learning','brain','neural_network','strong')
el('robot','Robot','🤖','Technology')
re('machine','ai','robot','strong')
el('automation','Automation','⚙️','Industry')
re('robot','programming','automation','strong')

/* ─── BATCH I — Astronomy & Space ─── */
el('sun','Sun','☀️','Space')
re('star','energy','sun','strong')
el('moon','Moon','🌙','Space')
re('planet','stone','moon','strong')
el('star','Star','⭐','Space')
re('space','energy','star','strong')
el('planet','Planet','🪐','Space')
re('star','dust','planet','strong')
el('galaxy','Galaxy','🌌','Space')
re('star','star','galaxy','strong')
el('solar_system','Solar System','🪐','Space')
re('star','planet','solar_system','strong')
el('universe','Universe','🌌','Space')
re('space','everything','universe','strong')
el('asteroid','Asteroid','☄️','Space')
re('planet','explosion','asteroid','strong')
el('comet','Comet','☄️','Space')
re('ice','space','comet','strong')
el('meteor','Meteor','☄️','Space')
re('asteroid','earth','meteor','strong')
el('orbit','Orbit','🔄','Space')
re('planet','gravity','orbit','strong')
el('satellite','Satellite','🛰️','Space')
re('orbit','machine','satellite','strong')
el('rocket','Rocket','🚀','Space')
re('engine','fuel','rocket','strong')
re('explosion','controlled','rocket','reasonable')
el('spacecraft','Spacecraft','🚀','Space')
re('rocket','capsule','spacecraft','strong')
el('astronaut','Astronaut','🧑‍🚀','Space')
re('human','rocket','astronaut','strong')
el('space_station','Space Station','🛰️','Space')
re('satellite','habitat','space_station','strong')
el('telescope','Telescope','🔭','Tools')
re('lens','star','telescope','strong')
el('observatory','Observatory','🔭','Science')
re('telescope','building','observatory','strong')
el('probe','Space Probe','🛰️','Space')
re('spacecraft','science','probe','strong')
el('rover','Rover','🪐','Space')
re('probe','wheel','rover','strong')

/* ─── BATCH J — Culture, Arts & Society ─── */
el('art','Art','🎨','Culture')
re('imagination','skill','art','strong')
el('music','Music','🎵','Culture')
re('sound','rhythm','music','strong')
el('book','Book','📖','Culture')
re('energy','paper','book','strong')
re('writing','paper','book','reasonable')
el('knowledge','Knowledge','📚','Abstract')
re('information','learning','knowledge','strong')
el('wisdom','Wisdom','🦉','Abstract')
re('knowledge','time','wisdom','strong')
el('time','Time','⏳','Abstract')
re('change','measure','time','strong')
el('space','Space','🌌','Abstract')
re('void','dimension','space','strong')
el('war','War','⚔️','Society')
re('conflict','hate','war','strong')
el('peace','Peace','🕊️','Abstract')
re('harmony','understanding','peace','strong')
el('love','Love','❤️','Abstract')
re('human','emotion','love','strong')
el('money','Money','💰','Commerce')
re('exchange','goods','money','strong')
el('trade','Trade','🤝','Commerce')
re('city','market','trade','strong')
el('bank','Bank','🏦','Commerce')
re('money','building','bank','strong')
el('school','School','🏫','Society')
re('knowledge','building','school','strong')
el('university','University','🏛️','Society')
re('school','knowledge','university','strong')
el('library','Library','📚','Society')
re('book','building','library','strong')
el('sport','Sport','⚽','Culture')
re('competition','physical','sport','strong')
el('game','Game','🎮','Culture')
re('sport','rules','game','strong')
el('music_genre','Music','🎵','Culture')
re('music','culture','music_genre','reasonable')
el('painting','Painting','🖼️','Culture')
re('art','paint','painting','strong')
el('statue','Statue','🗿','Culture')
re('art','stone','statue','strong')
el('theater','Theater','🎭','Culture')
re('art','building','theater','strong')
el('film','Film','🎬','Culture')
re('camera','story','film','strong')
el('photography','Photography','📷','Culture')
re('light','camera','photography','strong')
el('mythology','Mythology','📜','Fantasy')
re('story','god','mythology','strong')
el('magic','Magic','🔮','Fantasy')
re('energy','wisdom','magic','strong')
el('dragon','Dragon','🐉','Fantasy')
re('reptile','fire','dragon','strong')
el('civilization','Civilization','🏛️','Society')
re('society','progress','civilization','strong')
el('history','History','📜','History')
re('time','record','history','strong')
el('construction','Construction','🏗️','Construction')
re('building','shelter','construction','strong')
el('military','Military','🎖️','Society')
re('army','nation','military','strong')
el('weapon','Weapon','⚔️','Weapons')
re('military','tool','weapon','strong')
el('culture','Culture','🎭','Culture')
re('art','society','culture','strong')
el('society','Society','🏛️','Society')
re('human','group','society','strong')
el('government','Government','🏛️','Society')
re('rule','city','government','strong')
el('law','Law','⚖️','Society')
re('government','justice','law','strong')
el('country','Country','🗺️','Geography')
re('city','population','country','strong')
el('monument','Monument','🗿','Culture')
re('history','building','monument','strong')

/* ─── CROSS-DOMAIN EXPANSION — rich interconnections ─── */
const CROSS = [
  ['glass','electricity','bulb','strong'],
  ['biology','technology','biotechnology','strong'],
  ['medicine','technology','medical_device','strong'],
  ['computer','communication','internet','strong'],
  ['ai','robot','intelligent_robot','strong'],
  ['agriculture','machine','tractor','strong'],
  ['ocean','energy','tidal_power','reasonable'],
  ['physics','space','astrophysics','strong'],
  ['chemistry','medicine','pharmaceutical','strong'],
  ['satellite','communication','satellite_comm','strong'],
  ['plant','fire','ash_fertilizer','reasonable'],
  ['ice','city','igloo','strong'],
  ['desert','city','oasis_city','strong'],
  ['mountain','city','hilltown','reasonable'],
  ['river','city','riverside','reasonable'],
  ['volcano','city','volcanic_city','reasonable'],
  ['island','city','island_city','reasonable'],
  ['ocean','city','harbor_city','strong'],
  ['space','city','space_city','strong'],
  ['human','horse','cavalry','strong'],
  ['human','horse','chariot','reasonable'],
  ['human','eagle','falconry','reasonable'],
  ['horse','cart','wagon','strong'],
  ['steam','boat','steamboat','strong'],
  ['steam','engine','steam_engine','strong'],
  ['car','electricity','electric_car','strong'],
  ['plane','jet','jet_plane','strong'],
  ['metal','ship','warship','strong'],
  ['iron','rail','railroad','strong'],
  ['bicycle','motor','motorcycle','strong'],
  ['car','race','race_car','reasonable'],
  ['computer','game','video_game','strong'],
  ['computer','music','digital_music','reasonable'],
  ['computer','art','digital_art','reasonable'],
  ['camera','phone','camera_phone','reasonable'],
  ['electricity','light','streetlight','strong'],
  ['electricity','heater','electric_heater','reasonable'],
  ['electricity','motor','fan','strong'],
  ['wind','turbine','windmill','strong'],
  ['sun','glass','greenhouse','strong'],
  ['water','turbine','hydroelectric','strong'],
  ['nuclear','reactor','nuclear_power','strong'],
  ['oil','ship','oil_tanker','reasonable'],
  ['steel','building','skyscraper','strong'],
  ['concrete','steel','skyscraper','reasonable'],
  ['glass','building','glass_tower','reasonable'],
  ['stone','castle','stone_castle','strong'],
  ['brick','village','brick_town','reasonable'],
  ['factory','pollution','smog','strong'],
  ['car','pollution','exhaust','reasonable'],
  ['plastic','ocean','plastic_pollution','strong'],
  ['sun','flower','sunflower','strong'],
  ['tree','fruit','orchard','strong'],
  ['tree','rubber','rubber_tree','reasonable'],
  ['flower','garden','flower_garden','strong'],
  ['bee','hive','beehive','strong'],
  ['milk','ice','ice_cream','strong'],
  ['egg','flour','pasta','reasonable'],
  ['egg','milk','custard','strong'],
  ['wheat','field','wheat_field','strong'],
  ['grape','vineyard','vineyard','reasonable'],
  ['bread','meat','sandwich','strong'],
  ['fish','rice','sushi','strong'],
  ['meat','fire','steak','strong'],
  ['wheat','beer','brewery','reasonable'],
  ['grape','wine','winery','reasonable'],
  ['fossil','fuel','fossil_fuel','strong'],
  ['uranium','energy','nuclear_energy','strong'],
  ['sun','energy','solar_energy','strong'],
  ['wind','energy','wind_energy','strong'],
  ['water','energy','hydro_energy','strong'],
  ['earth','heat','geothermal_energy','strong'],
  ['robot','humanoid','humanoid_robot','reasonable'],
  ['ai','camera','computer_vision','reasonable'],
  ['data','mining','data_mining','reasonable'],
  ['code','security','cybersecurity','strong'],
  ['internet','crime','cybercrime','reasonable'],
  ['virus','computer','computer_virus','strong'],
  ['metal','magnet','magnet','strong'],
  ['electricity','magnet','electromagnet','strong'],
  ['magnet','storage','hard_drive','strong'],
  ['silicon','sand','chip','reasonable'],
  ['glass','fiber','fiber_optic','strong'],
  ['fiber_optic','internet','broadband','strong'],
  ['satellite','earth','gps','strong'],
  ['satellite','weather','weather_satellite','reasonable'],
  ['rocket','fuel','rocket_fuel','strong'],
  ['astronaut','space_station','space_walk','reasonable'],
  ['space','colony','space_colony','strong'],
  ['mars','colony','mars_colony','strong'],
  ['moon','landing','moon_landing','strong'],
  ['sun','system','solar_panel','reasonable'],
  ['telescope','space','hubble_telescope','strong'],
  ['black_hole','space','singularity','strong'],
  ['star','explosion','supernova','strong'],
  ['supernova','gravity','neutron_star','strong'],
  ['neutron_star','gravity','black_hole','strong'],
  ['star','planet','exoplanet','reasonable'],
  ['alien','life','extraterrestrial','strong'],
  ['human','animal','pet','strong'],
  ['dog','wild','wolf','strong'],
  ['cat','wild','tiger','reasonable'],
  ['horse','wild','zebra','reasonable'],
  ['cow','wild','buffalo','reasonable'],
  ['bird','water','duck','strong'],
  ['bird','night','owl','strong'],
  ['fish','predator','shark','reasonable'],
  ['fish','ocean','whale','reasonable'],
  ['human','ocean','swimming','strong'],
  ['human','mountain','climbing','strong'],
  ['human','sky','flying','reasonable'],
  ['human','space','space_travel','strong'],
  ['wheel','sail','windmill','reasonable'],
  ['fire','cooking','grill','strong'],
  ['fire','metal','forge','strong'],
  ['fire','clay','kiln','strong'],
  ['water','mill','watermill','strong'],
  ['wind','mill','windmill','reasonable'],
  ['animal','power','animal_power','reasonable'],
  ['steam','power','steam_power','strong'],
  ['electricity','power','electric_power','strong'],
  ['nuclear','power','atomic_power','strong'],
  ['sun','power','solar_power','strong'],
  ['fire','power','thermal_power','reasonable'],
  ['gunpowder','fire','cannon','strong'],
  ['fire','defense','flamethrower','reasonable'],
  ['explosive','ship','battleship','reasonable'],
  ['tank','armor','battle_tank','reasonable'],
  ['gun','soldier','infantry','strong'],
  ['navy','ship','warship','strong'],
  ['air_force','plane','fighter_jet','strong'],
  ['money','bank','investment','reasonable'],
  ['trade','ship','merchant_ship','strong'],
  ['market','city','marketplace','strong'],
  ['factory','goods','manufacturing','strong'],
  ['city','government','capital','strong'],
  ['university','research','research_lab','strong'],
  ['science','laboratory','research','strong'],
  ['gene','biology','genetics','strong'],
  ['dna','research','genome','strong'],
  ['medicine','surgery','hospital','strong'],
  ['brain','computer','brain_computer','reasonable'],
  ['earth','space','earth_observation','reasonable'],
  ['climate','change','climate_change','strong'],
  ['weather','forecast','weather_forecast','reasonable'],
  ['ocean','current','ocean_current','strong'],
  ['ice','ocean','iceberg','strong'],
  ['mountain','snow','glacier','strong'],
  ['glacier','river','meltwater','reasonable'],
  ['desert','oasis','desert_oasis','strong'],
  ['cave','water','underground_lake','reasonable'],
  ['volcano','eruption','volcanic_eruption','strong'],
  ['lava','cooling','volcanic_rock','strong'],
  ['earthquake','city','destruction','reasonable'],
  ['earth','movement','earthquake','strong'],
  ['continent','drift','continental_drift','strong'],
  ['plate','movement','tectonic_plate','strong'],
  ['tectonic_plate','collision','mountain_range','strong'],
  ['mountain_range','erosion','valley','reasonable'],
  ['river','erosion','canyon','strong'],
  ['wind','erosion','sand_dune','strong'],
  ['wave','erosion','sea_cliff','strong'],
  ['coral','reef','coral_reef','strong'],
  ['reef','fish','marine_ecosystem','strong'],
  ['ocean','life','marine_biology','strong'],
  ['seaweed','medicine','seaweed_medicine','reasonable'],
  ['shell','beach','seashell','strong'],
  ['pearl','oyster','natural_pearl','strong'],
  ['oyster','sand','pearl','strong'],
  ['silk','fabric','silk_fabric','strong'],
  ['wool','fabric','wool_fabric','strong'],
  ['cotton','fabric','cotton_fabric','strong'],
  ['fabric','clothes','clothing','strong'],
  ['thread','weaving','textile','reasonable'],
  ['paper','writing','letter','strong'],
  ['ink','paper','book','reasonable'],
  ['paint','canvas','painting','strong'],
  ['stone','chisel','sculpture','strong'],
  ['clay','sculpture','pottery','strong'],
  ['metal','jewelry','metal_jewelry','reasonable'],
  ['gold','jewelry','gold_jewelry','strong'],
  ['diamond','ring','diamond_ring','strong'],
  ['clock','tower','clock_tower','strong'],
  ['bell','tower','bell_tower','strong'],
  ['music','instrument','musical_instrument','strong'],
  ['string','instrument','string_instrument','reasonable'],
  ['drum','music','drum','strong'],
  ['flute','music','flute','strong'],
  ['guitar','music','guitar','strong'],
  ['piano','music','piano','strong'],
  ['song','music','song','strong'],
  ['dance','music','dance','strong'],
  ['theater','play','theater_play','strong'],
  ['actor','theater','actor','strong'],
  ['camera','film','movie_camera','strong'],
  ['movie','theater','cinema','strong'],
  ['photography','art','photo_art','reasonable'],
  ['sport','ball','ball_game','strong'],
  ['soccer','ball','soccer_ball','strong'],
  ['basketball','ball','basketball','strong'],
  ['tennis','ball','tennis','strong'],
  ['swimming','pool','swimming_pool','strong'],
  ['running','race','marathon','strong'],
  ['bicycle','race','cycling_race','reasonable'],
  ['car','race','grand_prix','reasonable'],
  ['sky','jump','skydiving','strong'],
  ['mountain','climb','mountaineering','strong'],
  ['snow','ski','skiing','strong'],
  ['water','surf','surfing','strong'],
  ['board','sail','sailboard','reasonable'],
  ['sail','boat','sailboat','strong'],
  ['wind','sail','sailing','strong'],
  ['solar','system','solar_system','strong'],
  ['planet','earth','earth_planet','strong'],
]

CROSS.forEach(([a,b,r,q]) => {
  if (E[a] && E[b] && !E[r]) {
    el(r, r.split('_').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '), '🔮', 'Discovery', ['cross'])
    re(a, b, r, q)
  }
})

/* ─── ADDITIONAL CROSS-CONNECTION RECIPES for EXISTING elements ─── */
// Major elements get multiple recipes
re('sun','solar_panel','energy','reasonable')
re('water','dam','energy','reasonable')
re('wind','turbine','energy','reasonable')
re('sun','flower','flower','strong')
re('horse','wagon','cart','reasonable')
re('wheel','sail','windmill','reasonable')
re('hammer','chisel','sculpture','reasonable')
re('paper','printing','book','reasonable')
re('wheel','gear','machine','reasonable')
re('human','boat','sailor','reasonable')
re('human','horse','rider','reasonable')
re('human','sword','knight','strong')
re('human','bow','archer','strong')
re('human','shield','soldier','reasonable')
re('human','book','scholar','strong')
re('human','science','scientist','strong')
re('human','art','artist','strong')
re('human','music','musician','strong')
re('human','paint','painter','strong')
re('human','brick','mason','reasonable')
re('human','metal','blacksmith','strong')
re('human','wood','carpenter','strong')
re('human','bread','baker','strong')
re('human','wine','winemaker','reasonable')
re('human','cheese','cheesemaker','reasonable')
re('human','wheat','farmer','strong')
re('human','tractor','farmer','reasonable')
re('human','fish','fisherman','strong')
re('human','horse','cowboy','reasonable')
re('human','law','judge','reasonable')
re('human','knowledge','teacher','strong')
re('human','hospital','doctor','strong')
re('human','money','banker','reasonable')
re('human','house','homeowner','reasonable')
re('human','city','citizen','strong')
re('human','robot','engineer','reasonable')
re('human','computer','programmer','strong')
re('human','space','astronaut','strong')
re('human','music','musician','strong')

/* ─── DEPENDENCY-CHAIN ELEMENTS for deep progression ─── */
// Geology deep chain
el('mineral','Mineral','💎','Geology')
re('stone','earth','mineral','strong')
re('cave','crystal','mineral','reasonable')
el('gem','Gem','💎','Geology')
re('mineral','pressure','gem','strong')
el('ruby','Ruby','🔴','Geology')
re('gem','red','ruby','strong')
el('sapphire','Sapphire','🔵','Geology')
re('gem','blue','sapphire','strong')
el('emerald_g','Emerald','💚','Geology')
re('gem','green','emerald_g','strong')

// Tech deep chain
el('semiconductor','Semiconductor','💻','Technology')
re('silicon','impurity','semiconductor','strong')
el('diode','Diode','🔌','Technology')
re('semiconductor','current','diode','strong')
el('capacitor','Capacitor','🔋','Technology')
re('conductor','insulator','capacitor','strong')
el('hard_drive','Hard Drive','💿','Technology')
re('magnet','memory','hard_drive','strong')

// Biology deep chain
el('cell','Cell','🔬','Biology')
re('life','microscope','cell','strong')
el('tissue','Tissue','🧬','Biology')
re('cell','cell','tissue','strong')
el('organ','Organ','🫀','Biology')
re('tissue','tissue','organ','strong')
el('brain','Brain','🧠','Biology')
re('nerve','organ','brain','strong')
el('heart','Heart','❤️','Biology')
re('blood','organ','heart','strong')

// Human civilization deep chain
el('nomad','Nomad','🧑','Society')
re('human','wild','nomad','strong')
el('settlement','Settlement','🏠','Society')
re('nomad','house','settlement','strong')
el('town','Town','🏘️','Society')
re('settlement','market','town','strong')
el('nation','Nation','🏛️','Society')
re('city','country','nation','strong')

// Science deep chain
el('research','Research','🔬','Science')
re('science','laboratory','research','strong')
el('discovery','Discovery','💡','Science')
re('research','experiment','discovery','strong')
el('invention','Invention','💡','Technology')
re('discovery','tool','invention','strong')
el('innovation','Innovation','📈','Technology')
re('invention','improvement','innovation','strong')

// Ocean deep chain
el('seaweed','Seaweed','🌿','Plants')
re('algae','ocean','seaweed','strong')
el('plankton','Plankton','🦠','Biology')
re('life','ocean','plankton','strong')
el('marine_biology','Marine Biology','🐋','Science')
re('biology','ocean','marine_biology','strong')

// Physics deep chain
el('gravity','Gravity','⬇️','Physics')
re('mass','attraction','gravity','strong')
el('magnetism','Magnetism','🧲','Physics')
re('iron','energy','magnetism','strong')
el('electromagnetism','Electromagnetism','⚡','Physics')
re('electricity','magnetism','electromagnetism','strong')
el('quantum','Quantum','⚛️','Physics')
re('physics','small','quantum','strong')
el('relativity','Relativity','⏳','Physics')
re('physics','speed','relativity','strong')

// Communication chain
el('communication','Communication','📡','Technology')
re('signal','message','communication','strong')
el('telegraph','Telegraph','📡','Technology')
re('electricity','communication','telegraph','strong')
el('radio','Radio','📻','Technology')
re('telegraph','wireless','radio','strong')
el('television','Television','📺','Technology')
re('radio','video','television','strong')
el('satellite_comm','Satellite Communication','🛰️','Technology')
re('satellite','radio','satellite_comm','strong')

// Energy chain
el('steam_engine','Steam Engine','🚂','Technology')
re('steam','engine','steam_engine','strong')
el('internal_combustion','Internal Combustion','🔧','Technology')
re('engine','fuel','internal_combustion','strong')
el('jet_engine','Jet Engine','✈️','Technology')
re('internal_combustion','turbine','jet_engine','strong')
el('rocket_engine','Rocket Engine','🚀','Technology')
re('jet_engine','oxyfuel','rocket_engine','strong')

/* ─── TREE SPECIES ─── */
/* ─── SPORTS ─── */
/* ─── ADDITIONAL PROFESSIONS & ROLES ─── */
el('nurse','Nurse','👩‍⚕️','Society')
re('doctor','care','nurse','strong')
el('architect','Architect','👷','Society')
re('engineer','building','architect','strong')
el('librarian','Librarian','📚','Society')
re('teacher','book','librarian','strong')
el('judge','Judge','⚖️','Society')
re('law','court','judge','strong')
el('captain','Captain','⚓','Society')
re('sailor','leader','captain','strong')
el('general','General','⭐','Society')
re('soldier','leader','general','strong')
el('king','King','👑','Society')
re('ruler','crown','king','strong')
el('queen','Queen','👑','Society')
re('king','woman','queen','strong')
el('president','President','🏛️','Society')
re('leader','democracy','president','strong')
el('diplomat','Diplomat','🤝','Society')
re('ambassador','talk','diplomat','strong')

/* ─── SEASONS ─── */
el('spring','Spring','🌸','Weather')
re('flower','season','spring','strong')
el('summer','Summer','☀️','Weather')
re('sun','season','summer','strong')
el('autumn','Autumn','🍂','Weather')
re('tree','season','autumn','strong')
el('winter','Winter','❄️','Weather')
re('snow','season','winter','strong')
el('season','Season','🍂','Weather')
re('year','climate','season','strong')

/* ─── COLORS ─── */
el('red','Red','🔴','Abstract')
re('light','wavelength','red','strong')
el('blue','Blue','🔵','Abstract')
re('light','sky','blue','strong')
el('green','Green','💚','Abstract')
re('plant','light','green','strong')
el('yellow','Yellow','🟡','Abstract')
re('sun','light','yellow','strong')
el('purple','Purple','🟣','Abstract')
re('blue','red','purple','strong')
el('orange_c','Orange','🟠','Abstract')
re('red','yellow','orange_c','strong')
el('rainbow_c','Rainbow','🌈','Weather')
re('light','prism','rainbow_c','strong')

/* ─── INSTRUMENTS MORE ─── */
el('banjo','Banjo','🪕','Culture')
re('guitar','folk','banjo','strong')
el('accordion','Accordion','🪗','Culture')
re('piano','portable','accordion','strong')
el('harmonica','Harmonica','🎶','Culture')
re('flute','small','harmonica','strong')
el('tuba','Tuba','🎺','Culture')
re('trumpet','big','tuba','strong')
el('cello','Cello','🎻','Culture')
re('violin','big','cello','strong')

/* ─── INSECTS ─── */
el('ant','Ant','🐜','Animals')
re('insect','colony','ant','strong')
el('butterfly_i','Butterfly','🦋','Animals')
re('insect','color','butterfly_i','strong')
el('beetle','Beetle','🪲','Animals')
re('insect','shell','beetle','strong')
el('dragonfly','Dragonfly','🪰','Animals')
re('insect','water','dragonfly','strong')
el('firefly','Firefly','🪲','Animals')
re('beetle','light','firefly','strong')
el('grasshopper','Grasshopper','🦗','Animals')
re('insect','jump','grasshopper','strong')
el('cricket','Cricket','🦗','Animals')
re('insect','sound','cricket','strong')
el('scorpion','Scorpion','🦂','Animals')
re('spider','desert','scorpion','strong')
el('mosquito','Mosquito','🦟','Animals')
re('insect','blood','mosquito','strong')

/* ─── SPICES & HERBS ─── */
el('cinnamon','Cinnamon','🟫','Food')
re('bark','spice','cinnamon','strong')
el('pepper_s','Pepper','🌶️','Food')
re('spice','hot','pepper_s','strong')
el('vanilla','Vanilla','🍦','Food')
re('orchid','spice','vanilla','strong')
el('ginger','Ginger','🫚','Food')
re('root','spice','ginger','strong')
el('turmeric','Turmeric','🟡','Food')
re('root','yellow','turmeric','strong')
el('basil','Basil','🌿','Food')
re('herb','green','basil','strong')
el('mint','Mint','🌿','Food')
re('herb','cool','mint','strong')
el('rosemary','Rosemary','🌿','Food')
re('herb','pine','rosemary','strong')

/* ─── SCIENTIFIC FIELDS ─── */
el('biochemistry','Biochemistry','🧪','Science')
re('biology','chemistry','biochemistry','strong')
el('geophysics','Geophysics','🌍','Science')
re('geology','physics','geophysics','strong')
el('astrophysics','Astrophysics','🌌','Science')
re('astronomy','physics','astrophysics','strong')
el('neuroscience','Neuroscience','🧠','Science')
re('biology','brain','neuroscience','strong')
el('ecology','Ecology','🌿','Science')
re('biology','environment','ecology','strong')
el('oceanography','Oceanography','🌊','Science')
re('ocean','science','oceanography','strong')
el('meteorology','Meteorology','🌤️','Science')
re('weather','science','meteorology','strong')
el('paleontology','Paleontology','🦴','Science')
re('fossil','biology','paleontology','strong')

/* ─── GEMS ─── */
el('amber','Amber','🟠','Materials')
re('fossil','tree','amber','strong')
el('pearl','Pearl','📿','Materials')
re('oyster','sand','pearl','strong')
el('opal','Opal','🌈','Materials')
re('gem','rainbow','opal','strong')
el('amethyst','Amethyst','🟣','Materials')
re('crystal','purple','amethyst','strong')
el('topaz','Topaz','🟡','Materials')
re('crystal','yellow','topaz','strong')
el('quartz','Quartz','🤍','Materials')
re('crystal','sand','quartz','strong')
el('marble','Marble','🪨','Materials')
re('stone','pressure','marble','strong')
el('granite','Granite','🪨','Materials')
re('stone','magma','granite','strong')

/* ─── CUISINES ─── */
el('italian_c','Italian','🍝','Food')
re('cuisine','pasta','italian_c','strong')
el('japanese_c','Japanese','🍣','Food')
re('cuisine','rice','japanese_c','strong')
el('mexican_c','Mexican','🌮','Food')
re('cuisine','spice','mexican_c','strong')
el('indian_c','Indian','🍛','Food')
re('cuisine','curry','indian_c','strong')
el('chinese_c','Chinese','🥟','Food')
re('cuisine','noodles','chinese_c','strong')
el('french_c','French','🥖','Food')
re('cuisine','bread','french_c','strong')
el('thai_c','Thai','🍜','Food')
re('cuisine','spice','thai_c','strong')

/* ─── BODIES OF WATER ─── */
el('sea','Sea','🌊','Geography')
re('ocean','large','sea','strong')
el('pond','Pond','🫗','Geography')
re('water','small','pond','strong')
el('waterfall','Waterfall','🌊','Geography')
re('river','cliff','waterfall','strong')
el('glacier','Glacier','🧊','Geography')
re('ice','mountain','glacier','strong')
el('iceberg','Iceberg','🧊','Geography')
re('glacier','ocean','iceberg','strong')
el('beach_g','Beach','🏖️','Geography')
re('sand','ocean','beach_g','strong')

/* ─── EMOTIONS ─── */
el('happiness','Happiness','😊','Abstract')
re('love','joy','happiness','strong')
el('sadness','Sadness','😢','Abstract')
re('loss','emotion','sadness','strong')
el('anger','Anger','😡','Abstract')
re('frustration','emotion','anger','strong')
el('fear_e','Fear','😨','Abstract')
re('danger','survival','fear_e','strong')
el('surprise','Surprise','😮','Abstract')
re('unexpected','event','surprise','strong')

/* ─── DEEP MANUFACTURING ─── */
el('assembly_line','Assembly Line','🏭','Industry')
re('factory','conveyor','assembly_line','strong')
el('mass_production','Mass Production','🏭','Industry')
re('assembly_line','efficiency','mass_production','strong')
el('automation_i','Automation','⚙️','Industry')
re('robot','factory','automation_i','strong')
el('quality_control','Quality Control','✅','Industry')
re('production','inspection','quality_control','strong')
el('supply_chain','Supply Chain','📦','Commerce')
re('factory','transport','supply_chain','strong')
el('logistics','Logistics','📦','Commerce')
re('supply_chain','computer','logistics','strong')

/* ─── RENEWABLE ENERGY ─── */
el('solar_farm','Solar Farm','☀️','Energy')
re('solar_panel','field','solar_farm','strong')
el('wind_farm','Wind Farm','🌬️','Energy')
re('windmill','field','wind_farm','strong')
el('hydro_dam','Hydro Dam','🏗️','Energy')
re('dam','turbine','hydro_dam','strong')
el('geothermal_power','Geothermal Power','🌋','Energy')
re('volcano','turbine','geothermal_power','strong')
el('nuclear_power','Nuclear Power','☢️','Energy')
re('uranium','reactor','nuclear_power','strong')

/* ─── GARDEN/PLANTS MORE ─── */
el('herb_garden','Herb Garden','🌿','Nature')
re('herb','garden','herb_garden','strong')
el('rose_garden','Rose Garden','🌹','Nature')
re('rose','garden','rose_garden','strong')
el('vegetable_garden','Vegetable Garden','🥕','Nature')
re('vegetable','garden','vegetable_garden','strong')
el('orchard','Orchard','🍎','Agriculture')
re('fruit','farm','orchard','strong')
el('vineyard','Vineyard','🍇','Agriculture')
re('grape','farm','vineyard','strong')
el('rice_paddy','Rice Paddy','🌾','Agriculture')
re('rice','water','rice_paddy','strong')

el('soccer','Soccer','⚽','Culture')
re('sport','ball','soccer','strong')
el('basketball','Basketball','🏀','Culture')
re('sport','height','basketball','strong')
el('tennis','Tennis','🎾','Culture')
re('sport','racket','tennis','strong')
el('baseball','Baseball','⚾','Culture')
re('sport','bat','baseball','strong')
el('swimming','Swimming','🏊','Culture')
re('sport','water','swimming','strong')
el('cycling','Cycling','🚴','Culture')
re('bicycle','sport','cycling','strong')
el('skiing','Skiing','⛷️','Culture')
re('sport','snow','skiing','strong')
el('surfing','Surfing','🏄','Culture')
re('sport','wave','surfing','strong')
el('boxing','Boxing','🥊','Culture')
re('sport','fight','boxing','strong')
el('gymnastics','Gymnastics','🤸','Culture')
re('sport','flexibility','gymnastics','strong')
el('yoga','Yoga','🧘','Culture')
re('exercise','meditation','yoga','strong')
el('marathon','Marathon','🏃','Culture')
re('running','distance','marathon','strong')
el('olympics','Olympics','🏅','Culture')
re('sport','competition','olympics','strong')

/* ─── LANDMARKS ─── */
el('pyramid','Pyramid','🔺','History')
re('ancient','stone','pyramid','strong')
el('colosseum','Colosseum','🏛️','History')
re('arena','stone','colosseum','strong')
el('great_wall','Great Wall','🧱','History')
re('wall','stone','great_wall','strong')
el('stonehenge','Stonehenge','🗿','History')
re('stone','ancient','stonehenge','strong')
el('sphinx_hist','Sphinx','🗿','History')
re('lion','human','sphinx_hist','strong')
el('taj_mahal','Taj Mahal','🕌','History')
re('palace','marble','taj_mahal','strong')
el('eiffel_tower','Eiffel Tower','🗼','History')
re('tower','metal','eiffel_tower','strong')
el('statue_liberty','Statue of Liberty','🗽','History')
re('statue','copper','statue_liberty','strong')
el('acropolis','Acropolis','🏛️','History')
re('temple','greece','acropolis','strong')
el('moai','Moai','🗿','History')
re('statue','island','moai','strong')
el('machu_picchu','Machu Picchu','🏛️','History')
re('city','mountain','machu_picchu','strong')

/* ─── FRUITS & VEGETABLES ─── */
el('lemon','Lemon','🍋','Food')
re('citrus','sour','lemon','strong')
el('lime','Lime','🍋','Food')
re('lemon','green','lime','strong')
el('strawberry','Strawberry','🍓','Food')
re('fruit','red','strawberry','strong')
el('blueberry','Blueberry','🫐','Food')
re('fruit','blue','blueberry','strong')
el('watermelon','Watermelon','🍉','Food')
re('fruit','water','watermelon','strong')
el('peach','Peach','🍑','Food')
re('fruit','warm','peach','strong')
el('avocado','Avocado','🥑','Food')
re('fruit','green','avocado','strong')
el('onion','Onion','🧅','Food')
re('vegetable','layer','onion','strong')
el('garlic','Garlic','🧄','Food')
re('onion','pungent','garlic','strong')
el('broccoli','Broccoli','🥦','Food')
re('vegetable','green','broccoli','strong')
el('spinach','Spinach','🥬','Food')
re('vegetable','leaf','spinach','strong')
el('tomato','Tomato','🍅','Food')
re('vegetable','red','tomato','strong')
el('cucumber','Cucumber','🥒','Food')
re('vegetable','water','cucumber','strong')
el('mushroom_f','Mushroom','🍄','Food')
re('fungus','cave','mushroom_f','strong')

/* ─── DRINKS ─── */
el('juice','Juice','🧃','Food')
re('fruit','water','juice','strong')
el('soda','Soda','🥤','Food')
re('water','sugar','soda','strong')
el('milkshake','Milkshake','🥤','Food')
re('milk','ice_cream','milkshake','strong')
el('cocktail','Cocktail','🍸','Food')
re('drink','fruit_juice','cocktail','strong')
el('whiskey','Whiskey','🥃','Food')
re('grain','distill','whiskey','strong')
el('vodka','Vodka','🍸','Food')
re('potato','distill','vodka','strong')
el('rum','Rum','🍹','Food')
re('sugar','distill','rum','strong')

/* ─── DESSERTS ─── */
el('candy','Candy','🍬','Food')
re('sugar','flavor','candy','strong')
el('cookie','Cookie','🍪','Food')
re('dough','chocolate','cookie','strong')
el('donut','Donut','🍩','Food')
re('dough','sugar','donut','strong')
el('pancake','Pancake','🥞','Food')
re('dough','pan','pancake','strong')
el('pudding','Pudding','🍮','Food')
re('milk','sugar','pudding','strong')

/* ─── ANCIENT CIVILIZATIONS ─── */
el('ancient','Ancient','🏛️','History')
re('history','old','ancient','strong')
el('egyptian','Egyptian','🔺','History')
re('ancient','river','egyptian','strong')
el('greek','Greek','🏛️','History')
re('ancient','philosophy','greek','strong')
el('roman','Roman','🏛️','History')
re('ancient','empire','roman','strong')
el('viking','Viking','⛵','History')
re('ancient','norse','viking','strong')
el('medieval','Medieval','🏰','History')
re('history','knight','medieval','strong')
el('industrial_revolution','Industrial Revolution','🏭','History')
re('steam_engine','factory','industrial_revolution','strong')
el('space_age','Space Age','🚀','History')
re('rocket','exploration','space_age','strong')
el('digital_age','Digital Age','💻','History')
re('internet','computer','digital_age','strong')

/* ─── TOOLS EXPANSION ─── */
el('axe','Axe','🪓','Tools')
re('wood','stone','axe','strong')
el('shovel','Shovel','⛏️','Tools')
re('wood','metal','shovel','strong')
el('pickaxe','Pickaxe','⛏️','Tools')
re('stone','metal','pickaxe','strong')
el('chisel','Chisel','🪚','Tools')
re('metal','stone','chisel','strong')
el('saw','Saw','🪚','Tools')
re('metal','tooth','saw','strong')
el('screwdriver','Screwdriver','🪛','Tools')
re('metal','screw','screwdriver','strong')

/* ─── PLANETS ─── */
el('mercury_p','Mercury','🪐','Space')
re('planet','sun','mercury_p','strong')
el('venus_p','Venus','🪐','Space')
re('planet','cloud','venus_p','strong')
el('earth_p','Earth','🌍','Space')
re('planet','life','earth_p','strong')
el('mars_p','Mars','🪐','Space')
re('planet','iron','mars_p','strong')
el('jupiter_p','Jupiter','🪐','Space')
re('planet','gas','jupiter_p','strong')
el('saturn_p','Saturn','🪐','Space')
re('planet','ring','saturn_p','strong')
el('uranus_p','Uranus','🪐','Space')
re('planet','ice','uranus_p','strong')
el('neptune_p','Neptune','🪐','Space')
re('planet','wind','neptune_p','strong')

/* ─── DEEP COMPUTING ─── */
el('database_e','Database','🗄️','Technology')
re('data','computer','database_e','strong')
el('server_c','Server','🖥️','Technology')
re('computer','network','server_c','strong')
el('website','Website','🌐','Technology')
re('internet','software','website','strong')
el('app','App','📱','Technology')
re('smartphone','software','app','strong')
el('social_media','Social Media','📱','Technology')
re('internet','community','social_media','strong')
el('ecommerce','Ecommerce','🛒','Technology')
re('internet','shop','ecommerce','strong')
el('search_engine','Search Engine','🔍','Technology')
re('internet','algorithm','search_engine','strong')

/* ─── MUSIC GENRES ─── */
el('jazz','Jazz','🎷','Culture')
re('music','improvisation','jazz','strong')
el('rock','Rock','🎸','Culture')
re('music','electric','rock','strong')
el('classical','Classical','🎵','Culture')
re('music','orchestra','classical','strong')
el('blues','Blues','🎵','Culture')
re('music','sad','blues','strong')
el('electronic','Electronic','🎹','Culture')
re('music','computer','electronic','strong')
el('hiphop','Hip Hop','🎤','Culture')
re('music','poetry','hiphop','strong')
el('reggae','Reggae','🎵','Culture')
re('music','tropic','reggae','strong')
el('orchestra','Orchestra','🎵','Culture')
re('music','group','orchestra','strong')

/* ─── SEWING/FABRIC ─── */
el('cotton','Cotton','☁️','Materials')
re('field','plant','cotton','strong')
el('wool','Wool','🧶','Materials')
re('sheep','tool','wool','strong')
el('silk_f','Silk','🧵','Materials')
re('plant','worm','silk_f','strong')
el('leather','Leather','🧤','Materials')
re('skin','fabric','leather','strong')
el('clothing','Clothing','👕','Materials')
re('fabric','needle','clothing','strong')
el('hat','Hat','🧢','Materials')
re('clothing','head','hat','strong')
el('shoes','Shoes','👟','Materials')
re('leather','rubber','shoes','strong')

/* ─── ADDITIONAL CROSS-DOMAIN ─── */
el('paper_airplane','Paper Airplane','✈️','Transport')
re('paper','fold','paper_airplane','strong')
el('kite','Kite','🪁','Culture')
re('paper','wind','kite','strong')
el('balloon','Balloon','🎈','Physics')
re('air','rubber','balloon','strong')
el('soap','Soap','🧼','Materials')
re('oil','base','soap','strong')
el('perfume','Perfume','🧴','Materials')
re('flower','alcohol','perfume','strong')
el('incense','Incense','🪔','Culture')
re('herb','fire','incense','strong')
el('candle','Candle','🕯️','Tools')
re('thread','wax','candle','strong')
el('pottery','Pottery','🏺','Materials')
re('clay','fire','pottery','strong')
el('origami','Origami','🧻','Culture')
re('paper','fold','origami','strong')
el('clock_tower','Clock Tower','🕐','Construction')
re('clock','building','clock_tower','strong')
el('wind_chime','Wind Chime','🎐','Culture')
re('metal','wind','wind_chime','strong')
el('mirror','Mirror','🪞','Tools')
re('glass','silver','mirror','strong')
el('telescope_g','Telescope','🔭','Tools')
re('lens','tube','telescope_g','strong')
el('microscope_g','Microscope','🔬','Tools')
re('lens','magnify','microscope_g','strong')
el('telescope','Telescope','🔭','Tools')
re('lens','star','telescope','strong')

/* ─── EXTRA CROSS-RECIPES ─── */
re('clay','tool','pottery','strong')
re('wood','tool','furniture','strong')
re('wood','metal','weapon','strong')
re('stone','metal','tool','strong')
re('wool','knitting','sweater','strong')
re('sweater','warm','comfort','reasonable')
re('wheat','scythe','harvest','strong')
re('grape','press','juice','strong')
re('apple','press','juice','strong')
re('wind','sail','ship','strong')
re('steam','locomotive','train','strong')
re('electricity','light','street','strong')
re('sun','heat','solar_heater','strong')
re('solar_heater','water','hot_water','strong')
re('engine','propeller','airplane','strong')
re('robot','intelligence','smart_robot','strong')
re('smart_robot','human','android','strong')
re('space','explore','space_exploration','strong')
re('space_exploration','rocket','moon','strong')
re('moon','base','lunar_base','strong')
re('lunar_base','city','moon_city','strong')
re('water','electrolysis','hydrogen','strong')
re('hydrogen','fuel','clean_energy','strong')
re('nuclear','fusion','fusion_power','strong')
re('fusion_power','city','clean_city','strong')
re('science','future','futurology','strong')
re('futurology','ai','transhumanism','reasonable')

el('oak','Oak','🌳','Plants')
re('tree','forest','oak','strong')
el('pine','Pine','🌲','Plants')
re('tree','snow','pine','strong')
el('palm','Palm','🌴','Plants')
re('tree','sand','palm','strong')
el('willow','Willow','🌳','Plants')
re('tree','water','willow','strong')
el('birch','Birch','🌳','Plants')
re('tree','cold','birch','strong')
el('cedar','Cedar','🌲','Plants')
re('pine','mountain','cedar','strong')
el('maple','Maple','🍁','Plants')
re('tree','autumn','maple','strong')
el('bamboo','Bamboo','🎋','Plants')
re('tree','grass','bamboo','strong')
el('cactus','Cactus','🌵','Plants')
re('plant','desert','cactus','strong')
el('fir','Fir','🌲','Plants')
re('pine','christmas','fir','strong')
el('sequoia','Sequoia','🌲','Plants')
re('tree','giant','sequoia','strong')

/* ─── BIRD SPECIES ─── */
el('eagle_b','Eagle','🦅','Animals')
re('bird','mountain','eagle_b','strong')
el('owl_b','Owl','🦉','Animals')
re('bird','night','owl_b','strong')
el('parrot','Parrot','🦜','Animals')
re('bird','tropic','parrot','strong')
el('penguin','Penguin','🐧','Animals')
re('bird','ice','penguin','strong')
el('swan','Swan','🦢','Animals')
re('bird','water','swan','strong')
el('duck','Duck','🦆','Animals')
re('bird','lake','duck','strong')
el('sparrow','Sparrow','🐦','Animals')
re('bird','garden','sparrow','strong')
el('hawk','Hawk','🦅','Animals')
re('bird','hunter','hawk','strong')
el('raven','Raven','🦅','Animals')
re('bird','wisdom','raven','strong')
el('peacock','Peacock','🦚','Animals')
re('bird','beauty','peacock','strong')
el('flamingo','Flamingo','🦩','Animals')
re('bird','pink','flamingo','strong')
el('hummingbird','Hummingbird','🐦','Animals')
re('bird','flower','hummingbird','strong')
el('woodpecker','Woodpecker','🐦','Animals')
re('bird','tree','woodpecker','strong')

/* ─── FISH SPECIES ─── */
el('salmon','Salmon','🐟','Animals')
re('fish','river','salmon','strong')
el('tuna','Tuna','🐟','Animals')
re('fish','ocean','tuna','strong')
el('goldfish','Goldfish','🐠','Animals')
re('fish','gold','goldfish','strong')
el('clownfish','Clownfish','🐠','Animals')
re('fish','reef','clownfish','strong')
el('seahorse','Seahorse','🐠','Animals')
re('fish','horse','seahorse','strong')
el('pufferfish','Pufferfish','🐡','Animals')
re('fish','spike','pufferfish','strong')
el('trout','Trout','🐟','Animals')
re('fish','stream','trout','strong')
el('eel','Eel','🐍','Animals')
re('fish','snake','eel','strong')
el('swordfish','Swordfish','🐟','Animals')
re('fish','sword','swordfish','strong')

/* ─── MAMMAL SPECIES ─── */
el('fox','Fox','🦊','Animals')
re('mammal','cunning','fox','strong')
el('wolf','Wolf','🐺','Animals')
re('mammal','wild','wolf','strong')
el('deer','Deer','🦌','Animals')
re('mammal','forest','deer','strong')
el('bear','Bear','🐻','Animals')
re('mammal','big','bear','strong')
el('rabbit','Rabbit','🐇','Animals')
re('mammal','small','rabbit','strong')
el('squirrel','Squirrel','🐿️','Animals')
re('mammal','tree','squirrel','strong')
el('bat','Bat','🦇','Animals')
re('mammal','cave','bat','strong')
el('elephant','Elephant','🐘','Animals')
re('mammal','giant','elephant','strong')
el('lion','Lion','🦁','Animals')
re('mammal','pride','lion','strong')
el('tiger','Tiger','🐯','Animals')
re('mammal','stripes','tiger','strong')
el('monkey','Monkey','🐒','Animals')
re('mammal','smart','monkey','strong')
el('kangaroo','Kangaroo','🦘','Animals')
re('mammal','jump','kangaroo','strong')
el('panda','Panda','🐼','Animals')
re('bear','bamboo','panda','strong')
el('giraffe','Giraffe','🦒','Animals')
re('mammal','tall','giraffe','strong')
el('zebra','Zebra','🦓','Animals')
re('horse','stripes','zebra','strong')
el('camel','Camel','🐪','Animals')
re('mammal','desert','camel','strong')
el('goat','Goat','🐐','Animals')
re('mammal','mountain','goat','strong')
el('pig','Pig','🐖','Animals')
re('mammal','farm','pig','strong')
el('sheep','Sheep','🐑','Animals')
re('mammal','wool','sheep','strong')

/* ─── PROFESSIONS ─── */
el('profession','Profession','💼','Society')
re('human','skill','profession','strong')
el('blacksmith','Blacksmith','🔨','Society')
re('human','forge','blacksmith','strong')
el('carpenter','Carpenter','🪚','Society')
re('human','wood','carpenter','strong')
el('farmer','Farmer','👨‍🌾','Society')
re('human','farm','farmer','strong')
el('baker','Baker','🥐','Society')
re('human','bread','baker','strong')
el('chef','Chef','👨‍🍳','Society')
re('human','cooking','chef','strong')
el('doctor','Doctor','👨‍⚕️','Society')
re('human','medicine','doctor','strong')
el('teacher','Teacher','👩‍🏫','Society')
re('human','school','teacher','strong')
el('engineer','Engineer','👨‍🔧','Society')
re('human','machine','engineer','strong')
el('scientist','Scientist','👨‍🔬','Society')
re('human','science','scientist','strong')
el('artist','Artist','👩‍🎨','Society')
re('human','art','artist','strong')
el('musician','Musician','🎵','Society')
re('human','music','musician','strong')
el('writer','Writer','✍️','Society')
re('human','book','writer','strong')
el('pilot','Pilot','👨‍✈️','Society')
re('human','plane','pilot','strong')
el('sailor','Sailor','⛵','Society')
re('human','ship','sailor','strong')
el('astronaut_p','Astronaut','🧑‍🚀','Society')
re('human','spacecraft','astronaut_p','strong')
el('soldier','Soldier','🎖️','Society')
re('human','weapon','soldier','strong')
el('knight','Knight','🛡️','Society')
re('human','armor','knight','strong')
el('programmer','Programmer','💻','Society')
re('human','computer','programmer','strong')

/* ─── MUSICAL INSTRUMENTS ─── */
el('guitar','Guitar','🎸','Culture')
re('music','string','guitar','strong')
el('piano','Piano','🎹','Culture')
re('music','keyboard','piano','strong')
el('violin','Violin','🎻','Culture')
re('music','string','violin','strong')
el('drum','Drum','🥁','Culture')
re('music','skin','drum','strong')
el('flute','Flute','🪈','Culture')
re('music','wind','flute','strong')
el('trumpet','Trumpet','🎺','Culture')
re('music','brass','trumpet','strong')
el('harp','Harp','🔱','Culture')
re('music','string','harp','strong')
el('saxophone','Saxophone','🎷','Culture')
re('music','brass','saxophone','strong')

/* ─── VEHICLE TYPES ─── */
el('sedan','Sedan','🚗','Transport')
re('car','comfort','sedan','strong')
el('sports_car','Sports Car','🏎️','Transport')
re('car','speed','sports_car','strong')
el('suv','SUV','🚙','Transport')
re('car','offroad','suv','strong')
el('electric_car','Electric Car','🚗','Transport')
re('car','battery','electric_car','strong')
el('convertible','Convertible','🚗','Transport')
re('car','sun','convertible','reasonable')
el('helicopter','Helicopter','🚁','Transport')
re('plane','rotor','helicopter','strong')
el('hot_air_balloon','Hot Air Balloon','🎈','Transport')
re('balloon','fire','hot_air_balloon','strong')
el('submarine','Submarine','🚤','Transport')
re('boat','metal','submarine','strong')
el('speedboat','Speedboat','🚤','Transport')
re('boat','engine','speedboat','strong')
el('yacht','Yacht','⛵','Transport')
re('boat','luxury','yacht','strong')
el('glider','Glider','🪂','Transport')
re('plane','sail','glider','strong')
el('hovercraft','Hovercraft','🚤','Transport')
re('boat','air','hovercraft','strong')

/* ─── DEEP SCIENCE CHAIN ─── */
el('oxygen','Oxygen','🫧','Chemistry',['gas','element'],{
  description:'The reactive gas used in respiration and combustion; about one fifth of Earth\'s atmosphere by volume.'
})
el('atom','Atom','⚛️','Science')
re('matter','physics','atom','strong')
el('molecule','Molecule','🧬','Science')
re('atom','chemical','molecule','strong')
el('compound','Chemical Compound','🧪','Science')
re('molecule','reaction','compound','strong')
el('reaction','Chemical Reaction','⚡','Science')
re('compound','energy','reaction','strong')
el('acid','Acid','🧪','Science')
re('chemistry','hydrogen','acid','strong')
el('base','Base','🧪','Science')
re('mineral','water','base','strong')
el('experiment','Experiment','🧪','Science')
re('laboratory','reaction','experiment','strong')
el('theory','Theory','📜','Science')
re('science','experiment','theory','strong')

/* ─── DEEP MEDICINE CHAIN ─── */
el('anatomy','Anatomy','🧍','Biology')
re('biology','body','anatomy','strong')
el('cell','Cell','🔬','Biology')
re('life','microscope','cell','strong')
el('tissue_bio','Tissue','🧬','Biology')
re('cell','cell','tissue_bio','strong')
el('organ','Organ','🫀','Biology')
re('tissue_bio','anatomy','organ','strong')
el('heart','Heart','❤️','Biology')
re('organ','blood','heart','strong')
el('lung','Lung','🫁','Biology')
re('organ','air','lung','strong')
el('brain','Brain','🧠','Biology')
re('nerve','organ','brain','strong')
el('nerve','Nerve','🧠','Biology')
re('cell','signal','nerve','strong')
el('blood','Blood','🩸','Biology')
re('cell','tissue','blood','strong')
el('pharmacy','Pharmacy','💊','Biology')
re('chemistry','medicine','pharmacy','strong')
el('surgery','Surgery','🔪','Biology')
re('medicine','knife','surgery','strong')
el('diagnosis','Diagnosis','🔬','Biology')
re('medicine','microscope','diagnosis','strong')
el('genetics','Genetics','🧬','Science')
re('biology','dna','genetics','strong')

/* ─── DEEP TECHNOLOGY CHAIN ─── */
el('sensor','Sensor','📡','Technology')
re('electronics','detect','sensor','strong')
el('actuator','Actuator','🔧','Technology')
re('motor','control','actuator','strong')
el('drone','Drone','🛸','Technology')
re('hovercraft','robot','drone','strong')
el('3d_printer','3D Printer','🖨️','Technology')
re('computer','manufacturing','3d_printer','strong')
el('virtual_reality','Virtual Reality','🥽','Technology')
re('computer','reality','virtual_reality','strong')
el('cyborg','Cyborg','🦾','Technology')
re('human','robot','cyborg','strong')
el('quantum_computer','Quantum Computer','💻','Technology')
re('computer','quantum','quantum_computer','strong')
el('blockchain','Blockchain','⛓️','Technology')
re('data','chain','blockchain','strong')
el('cryptocurrency','Cryptocurrency','🪙','Technology')
re('blockchain','money','cryptocurrency','strong')
el('firewall','Firewall','🧱','Technology')
re('security','network','firewall','strong')

/* ─── DEEP SPACE CHAIN ─── */
el('launch','Launch','🚀','Space')
re('rocket','fire','launch','strong')
el('space_suit','Space Suit','👨‍🚀','Space')
re('astronaut','fabric','space_suit','strong')
el('fuel_rocket','Rocket Fuel','⛽','Space')
re('oil','chemistry','fuel_rocket','strong')
el('moon_landing','Moon Landing','🌙','Space')
re('spacecraft','moon','moon_landing','strong')
el('space_telescope','Space Telescope','🔭','Space')
re('telescope','satellite','space_telescope','strong')
el('space_station','Space Station','🛰️','Space')
re('satellite','habitat','space_station','strong')
el('exoplanet','Exoplanet','🪐','Space')
re('star','planet','exoplanet','strong')
el('supernova','Supernova','💥','Space')
re('star','explosion','supernova','strong')
el('neutron_star','Neutron Star','⭐','Space')
re('supernova','gravity','neutron_star','strong')
el('pulsar','Pulsar','⭐','Space')
re('neutron_star','spin','pulsar','strong')
el('black_hole','Black Hole','🕳️','Space')
re('neutron_star','collapse','black_hole','strong')
el('nebula','Nebula','🌌','Space')
re('star','cloud','nebula','strong')
el('constellation','Constellation','⭐','Space')
re('star','pattern','constellation','strong')
el('space_colony','Space Colony','🚀','Space')
re('space_station','city','space_colony','strong')
el('mars_colony','Mars Colony','🪐','Space')
re('rocket','mars','mars_colony','strong')

/* ─── BUILDING/ARCHITECTURE ─── */
el('skyscraper','Skyscraper','🏙️','Construction')
re('building','steel','skyscraper','strong')
el('temple','Temple','🛕','Construction')
re('building','stone','temple','strong')
el('castle_b','Castle','🏰','Construction')
re('stone','king','castle_b','strong')
el('fortress','Fortress','🏰','Construction')
re('castle_b','defense','fortress','strong')
el('palace','Palace','🏛️','Construction')
re('king','building','palace','strong')
el('tower','Tower','🗼','Construction')
re('building','height','tower','strong')
el('lighthouse','Lighthouse','💡','Construction')
re('tower','light','lighthouse','strong')
el('greenhouse','Greenhouse','🏗️','Construction')
re('glass','garden','greenhouse','strong')
el('barn','Barn','🏠','Construction')
re('farm','building','barn','strong')
el('windmill','Windmill','🌬️','Construction')
re('building','wind','windmill','strong')

/* ─── ABSTRACT CONCEPTS ─── */
el('courage','Courage','🦁','Abstract')
re('fear','overcome','courage','strong')
el('hope','Hope','🌟','Abstract')
re('faith','future','hope','strong')
el('destiny','Destiny','🔮','Abstract')
re('time','prediction','destiny','strong')
el('luck','Luck','🍀','Abstract')
re('chance','fortune','luck','strong')
el('chaos','Chaos','🌪️','Abstract')
re('entropy','disorder','chaos','strong')
el('order','Order','📏','Abstract')
re('structure','law','order','strong')
el('balance','Balance','⚖️','Abstract')
re('order','chaos','balance','strong')
el('justice','Justice','⚖️','Society')
re('balance','law','justice','strong')
el('freedom','Freedom','🕊️','Abstract')
re('liberty','choice','freedom','strong')
el('power','Power','💪','Abstract')
re('strength','control','power','strong')
el('progress','Progress','📈','Abstract')
re('innovation','time','progress','strong')
el('curiosity','Curiosity','❓','Abstract')
re('knowledge','wonder','curiosity','strong')

/* ─── FOOD EXTENSIONS ─── */
el('ice_cream','Ice Cream','🍦','Food')
re('cream','ice','ice_cream','strong')
el('cream','Cream','🥛','Food')
re('milk','fat','cream','strong')
el('pasta','Pasta','🍝','Food')
re('dough','shape','pasta','strong')
el('sushi','Sushi','🍣','Food')
re('rice','fish','sushi','strong')
el('burger','Burger','🍔','Food')
re('sandwich','meat','burger','strong')
el('steak','Steak','🥩','Food')
re('meat','fire','steak','strong')
el('smoothie','Smoothie','🥤','Food')
re('fruit','blend','smoothie','strong')

/* ─── FANTASY EXTENSIONS ─── */
el('unicorn','Unicorn','🦄','Fantasy')
re('horse','magic','unicorn','strong')
el('phoenix','Phoenix','🦅','Fantasy')
re('bird','fire','phoenix','strong')
el('mermaid','Mermaid','🧜','Fantasy')
re('human','fish','mermaid','strong')
el('centaur_m','Centaur','🐴','Fantasy')
re('human','horse','centaur_m','strong')
el('griffin','Griffin','🦅','Fantasy')
re('eagle_b','lion','griffin','strong')
el('fairy','Fairy','🧚','Fantasy')
re('magic','small','fairy','strong')
el('elf','Elf','🧝','Fantasy')
re('human','nature','elf','strong')
el('wizard','Wizard','🧙','Fantasy')
re('human','magic','wizard','strong')
el('golem','Golem','🗿','Fantasy')
re('clay','life','golem','strong')
el('vampire','Vampire','🧛','Fantasy')
re('human','bat','vampire','strong')
el('werewolf','Werewolf','🐺','Fantasy')
re('human','wolf','werewolf','strong')

/* ─── GOVERNMENT ─── */
el('democracy','Democracy','🗳️','Society')
re('government','people','democracy','strong')
el('monarchy','Monarchy','👑','Society')
re('government','king','monarchy','strong')
el('senate','Senate','🏛️','Society')
re('government','council','senate','strong')
el('treaty','Treaty','📜','Society')
re('peace','agreement','treaty','strong')

/* ─── WEAPONS ─── */
el('gun','Gun','🔫','Weapons')
re('metal','gunpowder','gun','strong')
el('cannon','Cannon','💣','Weapons')
re('gun','big','cannon','strong')
el('bomb','Bomb','💥','Weapons')
re('explosive','metal','bomb','strong')
el('missile','Missile','🚀','Weapons')
re('rocket','bomb','missile','strong')
el('gunpowder','Gunpowder','💥','Weapons')
re(
  'sulfur',
  'carbon',
  'gunpowder',
  'strong',
  'conceptual',
  'Sulfur and charcoal supply two historic ingredients; an oxidizing nitrate is omitted, so this is an explicit game abstraction.',
)
el('bow','Bow','🏹','Weapons')
re('wood','string','bow','strong')

/* ─── GEOGRAPHY EXTENSIONS ─── */
el('canyon','Canyon','🏞️','Geography')
re('river','mountain','canyon','strong')
el('fjord','Fjord','🏞️','Geography')
re('glacier','valley','fjord','strong')
el('oasis_geo','Oasis','🏝️','Geography')
re('desert','water','oasis_geo','strong')
el('geyser','Geyser','💨','Geology')
re('water','volcano','geyser','strong')
el('reef','Reef','🪸','Geography')
re('coral','ocean','reef','strong')
el('lagoon','Lagoon','🏝️','Geography')
re('reef','island','lagoon','strong')
el('archipelago','Archipelago','🗺️','Geography')
re('island','island','archipelago','strong')

/* ─── ENVIRONMENT ─── */
re('moon','ocean','tide','strong')
re('ocean','wind','wave','strong')
re('wave','energy','tidal_power','strong')
re('river','dam','hydroelectric','strong')
re('wind','blade','turbine','reasonable')
re('turbine','energy','wind_energy','strong')
re('sun','cell','solar_energy','strong')
re('earth','heat','geothermal','strong')
re('fossil','burn','carbon_dioxide','strong')
re('factory','smoke','pollution','strong')
re('pollution','air','smog','strong')
re('plastic','ocean','microplastic','strong')
re('climate','change','global_warming','strong')
re('global_warming','ice','sea_rise','strong')

/* ─── WEATHER EXTENSIONS ─── */
re('air','water','humidity','strong')
re('cold','humidity','frost','strong')
re('frost','sun','dew','reasonable')
re('storm','ocean','hurricane','strong')
re('sand','wind','sandstorm','strong')
re('lightning','forest','wildfire','strong')
re('ocean','earthquake','tsunami','strong')
re('mountain','snow','avalanche','strong')

/* ─── COMPUTER EXTENSIONS ─── */
re('computer','screen','display','strong')
re('display','touch','touchscreen','strong')
re('computer','camera','webcam','strong')
re('software','music','music_player','strong')
re('video','game','video_game','strong')
re('internet','shop','online_store','strong')

/* ─── DESCRIPTIONS FOR EXISTING ELEMENTS ─── */
el('water','Water','💧','Basics',[],{description:'A transparent, tasteless liquid essential for all known life. Chemical formula H2O.'})
el('fire','Fire','🔥','Basics',[],{description:'A rapid exothermic oxidation reaction producing heat and light. One of the classical elements.'})
el('air','Air','💨','Basics',[],{description:'The invisible mixture of gases surrounding Earth, primarily nitrogen and oxygen.'})
el('earth','Earth','🌍','Basics',[],{description:'Soil and rock constituting the solid surface of the planet. One of the classical elements.'})
el('energy','Energy','⚡','Physics',[],{description:'The quantitative property that must be transferred to an object to perform work or heat it.'})
el('life','Life','🧬','Biology',[],{description:'The condition that distinguishes active organisms from inorganic matter, characterized by growth and reproduction.'})
el('plant','Plant','🌱','Nature',[],{description:'A living organism that synthesizes energy from sunlight through photosynthesis.'})
el('time','Time','⏳','Abstract',[],{description:'The indefinite continued progress of existence and events in the past, present, and future.'})
el('space','Space','🌌','Abstract',[],{description:'The boundless three-dimensional extent in which objects and events have relative position and direction.'})
el('science','Science','🔬','Science',[],{description:'The systematic enterprise that builds and organizes knowledge in the form of testable explanations.'})
el('chemistry','Chemistry','⚗️','Science',[],{description:'The branch of science concerned with the properties and behavior of matter and chemical reactions.'})
el('physics','Physics','🔭','Science',[],{description:'The natural science that studies matter, its motion and behavior through space and time.'})
el('biology','Biology','🧬','Science',[],{description:'The natural science that studies life and living organisms.'})
el('astronomy','Astronomy','🔭','Science',[],{description:'The natural science that studies celestial objects and phenomena beyond Earth.'})
el('steam','Steam','♨️','Physics',[],{description:'Water in its gaseous state, formed when water is heated to its boiling point (100°C).'})
el('ice','Ice','🧊','Weather',[],{description:'Water in its solid crystalline state, formed when water freezes at 0°C (32°F).'})
el('cloud','Cloud','☁️','Weather',[],{description:'A visible mass of condensed water droplets or ice crystals suspended in the atmosphere.'})
el('rain','Rain','🌧️','Weather',[],{description:'Liquid water falling from clouds in the form of droplets condensed from atmospheric water vapor.'})
el('snow','Snow','❄️','Weather',[],{description:'Precipitation in the form of ice crystals falling from clouds.'})
el('cold','Cold','🥶','Weather',[],{description:'The subjective perception of low temperature, the absence of heat.'})
el('metal','Metal','🔩','Materials',[],{description:'A solid material that is typically hard, shiny, malleable, fusible, and ductile with good electrical conductivity.'})
el('wood','Wood','🪵','Materials',[],{description:'The hard fibrous structural tissue found in the stems and roots of trees and other woody plants.'})
el('stone','Stone','🪨','Geology',[],{description:'Hard, solid non-metallic mineral material that forms the Earth crust.'})
el('sand','Sand','🏖️','Geology',[],{description:'A granular material composed of finely divided rock and mineral particles.'})
el('glass','Glass','🪟','Materials',[],{description:'A hard, brittle, usually transparent or translucent material made by fusing sand with soda and lime.'})
el('iron','Iron','⛓️','Materials',[],{description:'A strong, hard magnetic silvery-gray metal. Atomic number 26. Essential for steel production.'})
el('gold','Gold','🥇','Materials',[],{description:'A precious yellow metallic element. Atomic number 79. Highly malleable and resistant to corrosion.'})
el('copper','Copper','🪙','Materials',[],{description:'A reddish-brown metal. Atomic number 29. Excellent conductor of electricity and heat.'})
el('silver','Silver','🥈','Materials',[],{description:'A precious white metallic element. Atomic number 47. Best known conductor of electricity.'})
el('steel','Steel','⚙️','Materials',[],{description:'An alloy of iron and carbon, stronger and harder than pure iron. The foundation of modern industry.'})
el('diamond','Diamond','💎','Materials',[],{description:'An extremely hard crystalline form of carbon. The hardest known natural material on Earth.'})
el('coal','Coal','🪨','Energy',[],{description:'A combustible black sedimentary rock composed mainly of carbon, formed from ancient plant matter.'})
el('oil','Oil','🛢️','Energy',[],{description:'A viscous liquid hydrocarbon formed from ancient organic matter under heat and pressure.'})
el('gas','Gas','⛽','Energy',[],{description:'A fossil fuel composed mainly of methane, used for heating, cooking, and electricity generation.'})
el('electricity','Electricity','⚡','Energy',[],{description:'A form of energy resulting from the flow of charged particles such as electrons.'})
el('human','Human','🧑','Biology',[],{description:'A member of the species Homo sapiens, characterized by bipedalism and advanced cognitive abilities.'})
el('tool','Tool','🔧','Tools',[],{description:'A device or implement used to carry out a particular function, extending human capability.'})
el('machine','Machine','⚙️','Technology',[],{description:'An apparatus using mechanical power to perform a specific task.'})
el('computer','Computer','💻','Technology',[],{description:'An electronic device for storing and processing data according to programmed instructions.'})
el('internet','Internet','🌐','Technology',[],{description:'The global computer network providing worldwide information and communication connectivity.'})
el('sun','Sun','☀️','Space',[],{description:'The star at the center of Solar System, a nearly perfect sphere of hot plasma that provides light and heat to Earth.'})
el('star','Star','⭐','Space',[],{description:'A luminous sphere of plasma held together by gravity, generating energy through nuclear fusion.'})
el('planet','Planet','🪐','Space',[],{description:'A large celestial body orbiting a star, massive enough to have cleared its orbital neighborhood.'})
el('moon','Moon','🌙','Space',[],{description:'A natural satellite that orbits a planet. Earth only permanent natural satellite.'})
el('galaxy','Galaxy','🌌','Space',[],{description:'A vast system of stars, gas, dust, and dark matter bound together by gravity.'})
el('atom','Atom','⚛️','Science',[],{description:'The smallest unit of ordinary matter that retains the properties of a chemical element.'})
el('molecule','Molecule','🧬','Science',[],{description:'A group of atoms bonded together, representing the smallest fundamental unit of a chemical compound.'})
el('dna','DNA','🧬','Biology',[],{description:'Deoxyribonucleic acid, the molecule that carries genetic instructions for development and function of living organisms.'})
el('cell','Cell','🔬','Biology',[],{description:'The basic structural and functional unit of all known living organisms.'})
el('brain','Brain','🧠','Biology',[],{description:'The organ that serves as the center of the nervous system in all vertebrate and most invertebrate animals.'})
el('heart','Heart','❤️','Biology',[],{description:'A muscular organ that pumps blood through the circulatory system of animals.'})
el('mud','Mud','🧴','Earth',[],{description:'A mixture of water and soil or dust, forming a semi-liquid substance.'})
el('lava','Lava','🌋','Geology',[],{description:'Molten rock expelled by a volcano during an eruption, reaching temperatures of 700-1,200°C.'})
el('dust','Dust','🏜️','Earth',[],{description:'Fine particles of matter, typically dry earth or organic material suspended in the air.'})
el('rainbow','Rainbow','🌈','Weather',[],{description:'An optical phenomenon caused by refraction and reflection of light in water droplets, producing a spectrum of colors.'})
el('lightning','Lightning','⚡','Weather',[],{description:'A sudden electrostatic discharge during a thunderstorm, producing a bright flash of light.'})
el('storm','Storm','⛈️','Weather',[],{description:'A violent disturbance of the atmosphere with strong winds and usually rain, thunder, or snow.'})
el('wind','Wind','💨','Weather',[],{description:'The natural movement of air, especially in the form of a current blowing from a particular direction.'})
el('ocean','Ocean','🌊','Geography',[],{description:'A vast body of salt water covering about 71% of Earth surface.'})
el('river','River','🏞️','Geography',[],{description:'A natural flowing watercourse, usually freshwater, flowing toward an ocean, sea, or lake.'})
el('mountain','Mountain','⛰️','Geology',[],{description:'A large natural elevation of the Earth surface rising abruptly from the surrounding level.'})
el('volcano','Volcano','🌋','Geology',[],{description:'A rupture in the Earth crust through which lava, ash, and gases are ejected from below the surface.'})
el('tree','Tree','🌳','Nature',[],{description:'A perennial woody plant with a single main trunk, branches, and leaves.'})
el('flower','Flower','🌸','Nature',[],{description:'The reproductive structure of flowering plants, often colorful and fragrant.'})
el('seed','Seed','🌱','Agriculture',[],{description:'An embryonic plant enclosed in a protective outer covering, capable of developing into a new plant.'})
el('fruit','Fruit','🍎','Food',[],{description:'The seed-bearing structure in flowering plants, often sweet and edible.'})
el('soil','Soil','🫘','Earth',[],{description:'The upper layer of Earth surface composed of organic matter, minerals, water, and air.'})
el('clay','Clay','🏺','Materials',[],{description:'A fine-grained natural soil material that becomes plastic when wet and hardens when fired.'})
el('mineral','Mineral','💎','Geology',[],{description:'A naturally occurring inorganic solid with a definite chemical composition and crystalline structure.'})
el('fossil','Fossil','🦴','Geology',[],{description:'The preserved remains or traces of ancient organisms preserved in rock.'})
el('obsidian','Obsidian','🪨','Geology',[],{description:'A naturally occurring volcanic glass formed when lava cools rapidly with minimal crystal growth.'})
el('brick','Brick','🧱','Construction',[],{description:'A rectangular block of fired clay used in building construction, bonded with mortar.'})
el('concrete','Concrete','🏗️','Construction',[],{description:'A composite building material made from cement, aggregate, and water that hardens over time.'})
el('plastic','Plastic','🧴','Materials',[],{description:'A synthetic polymer material that can be molded into various shapes, widely used in manufacturing.'})
el('battery','Battery','🔋','Energy',[],{description:'A device that stores chemical energy and converts it into electrical energy.'})
el('wire','Wire','🔌','Technology',[],{description:'A thin flexible thread of metal used to carry electrical current.'})
el('wheel','Wheel','⚙️','Tools',[],{description:'A circular component that rotates on an axle, fundamental to transportation and machinery.'})
el('paper','Paper','📄','Materials',[],{description:'A thin material produced by pressing together moist fibers of cellulose from wood.'})
el('fabric','Fabric','🧵','Materials',[],{description:'A flexible material made by weaving or knitting fibers together.'})
el('rope','Rope','🪢','Materials',[],{description:'A strong thick cord made of twisted or braided fibers.'})
el('ceramic','Ceramic','🏺','Materials',[],{description:'A hard, brittle material made by firing clay or other inorganic materials at high temperatures.'})
el('medicine','Medicine','💊','Biology',[],{description:'A substance used for treating or preventing disease.'})
el('hospital','Hospital','🏥','Society',[],{description:'A medical facility providing patient treatment with specialized staff and equipment.'})
el('laboratory','Laboratory','🧪','Science',[],{description:'A facility providing controlled conditions for scientific research and experimentation.'})
el('factory','Factory','🏭','Industry',[],{description:'An industrial building where goods are manufactured or assembled by machine.'})
el('food','Food','🍽️','Food',[],{description:'Any nutritious substance consumed to sustain life, providing energy and essential nutrients.'})
el('cooking','Cooking','🍳','Food',[],{description:'The art and science of preparing food by applying heat for human consumption.'})
el('bread','Bread','🍞','Food',[],{description:'A staple food made from dough of flour and water, usually baked.'})
el('cheese','Cheese','🧀','Food',[],{description:'A dairy product made from milk curds, available in hundreds of varieties worldwide.'})
el('wine','Wine','🍷','Food',[],{description:'An alcoholic beverage made from fermented grapes.'})
el('beer','Beer','🍺','Food',[],{description:'One of the oldest alcoholic beverages, made from fermented grains, usually barley.'})
el('salt','Salt','🧂','Food',[],{description:'Sodium chloride, a mineral essential for life and used as a seasoning for food.'})
el('sugar','Sugar','🍬','Food',[],{description:'A sweet crystalline substance obtained from sugar cane or sugar beet, used as a sweetener.'})
el('honey','Honey','🍯','Food',[],{description:'A sweet viscous substance produced by bees from flower nectar.'})
el('milk','Milk','🥛','Food',[],{description:'A nutrient-rich liquid produced by mammals as food for their young.'})
el('meat','Meat','🥩','Food',[],{description:'Animal flesh used as food, a primary source of protein for humans.'})
el('music','Music','🎵','Culture',[],{description:'An art form and cultural activity whose medium is sound organized in time.'})
el('book','Book','📖','Culture',[],{description:'A written or printed work consisting of pages bound together, containing knowledge or stories.'})
el('art','Art','🎨','Culture',[],{description:'The expression of creative skill and imagination, producing works appreciated for their beauty.'})
el('knowledge','Knowledge','📚','Abstract',[],{description:'Facts, information, and skills acquired through experience or education.'})
el('money','Money','💰','Commerce',[],{description:'A medium of exchange in the form of coins and banknotes used for transactions.'})
el('city','City','🏙️','Society',[],{description:'A large permanent human settlement with complex systems for sanitation, utilities, and governance.'})
el('house','House','🏠','Construction',[],{description:'A building for human habitation, providing shelter and living space.'})
el('village','Village','🏘️','Society',[],{description:'A small human settlement smaller than a town, typically in a rural area.'})
el('car','Car','🚗','Transport',[],{description:'A four-wheeled road vehicle powered by an engine, used for personal transportation.'})
el('train','Train','🚂','Transport',[],{description:'A series of connected rail vehicles that run along railway tracks for transporting passengers or freight.'})
el('plane','Plane','✈️','Transport',[],{description:'A powered flying vehicle with fixed wings that is heavier than air.'})
el('ship','Ship','🚢','Transport',[],{description:'A large watercraft that travels the world oceans and seas for transport of goods or people.'})
el('rocket','Rocket','🚀','Space',[],{description:'A spacecraft or vehicle that travels through space by expelling exhaust gases at high speed.'})
el('astronaut','Astronaut','🧑‍🚀','Space',[],{description:'A person trained to travel and work in space aboard a spacecraft.'})
el('satellite','Satellite','🛰️','Space',[],{description:'An object placed into orbit around a celestial body for communication, observation, or research.'})
el('robot','Robot','🤖','Technology',[],{description:'A programmable machine capable of carrying out complex tasks autonomously or by remote control.'})
el('ai','AI','🧠','Technology',[],{description:'Artificial intelligence: the simulation of human intelligence processes by computer systems.'})
el('nuclear','Nuclear','☢️','Energy',[],{description:'Relating to the nucleus of an atom, involving reactions that release enormous energy by splitting or fusing nuclei.'})
el('mining','Mining','⛏️','Industry',[],{description:'The process of extracting valuable minerals or other geological materials from the Earth.'})
el('smelting','Smelting','🔥','Industry',[],{description:'The process of extracting metal from ore by heating and melting it.'})
el('construction','Construction','🏗️','Construction',[],{description:'The process of building structures or infrastructure using materials like wood, steel, and concrete.'})
el('transport','Transport','🚗','Transport',[],{description:'The system or means of moving people or goods from one place to another.'})
el('industry','Industry','🏭','Industry',[],{description:'Economic activity involving the processing of raw materials and manufacture of goods in factories.'})
el('culture','Culture','🎭','Culture',[],{description:'The customs, arts, social institutions, and achievements of a particular nation or group.'})
el('society','Society','🏛️','Society',[],{description:'A community of people living together in an organized way with shared customs and laws.'})
el('government','Government','🏛️','Society',[],{description:'The governing body of a nation or community, exercising authority and making policy.'})
el('law','Law','⚖️','Society',[],{description:'A system of rules created and enforced by institutions to regulate behavior in a society.'})
el('civilization','Civilization','🏛️','Society',[],{description:'An advanced state of human society with developed culture, science, industry, and government.'})
el('war','War','⚔️','Society',[],{description:'A state of armed conflict between different nations, states, or groups.'})
el('magic','Magic','🔮','Fantasy',[],{description:'The use of supernatural forces or powers to influence events, a staple of mythology and fantasy.'})
el('dragon','Dragon','🐉','Fantasy',[],{description:'A legendary reptilian creature with wings, capable of breathing fire, found in folklore worldwide.'})
el('mythology','Mythology','📜','Fantasy',[],{description:'A collection of myths belonging to a particular culture or religion, explaining aspects of the natural world.'})
el('universe','Universe','🌌','Space',[],{description:'All of space and time and their contents, including planets, stars, galaxies, and all forms of matter and energy.'})

/* ─── PERIODIC TABLE — ALL 118 ELEMENTS ─── */
el('element_h','Hydrogen','🧪','Chemistry',['element','chemistry'],{description:'Hydrogen (H). The lightest and most abundant chemical element in the universe. Atomic number 1.','symbol':'H','atomicNumber':1,'chemicalGroup':'Nonmetal'})
el('element_he','Helium','🧪','Chemistry',['element','chemistry'],{description:'Helium (He). A colorless, odorless, tasteless noble gas. Atomic number 2. Second lightest element.','symbol':'He','atomicNumber':2,'chemicalGroup':'Noble gas'})
el('element_li','Lithium','🧪','Chemistry',['element','chemistry'],{description:'Lithium (Li). A soft, silvery-white alkali metal. Atomic number 3. Lightest metal and solid element.','symbol':'Li','atomicNumber':3,'chemicalGroup':'Alkali metal'})
el('element_be','Beryllium','🧪','Chemistry',['element','chemistry'],{description:'Beryllium (Be). A hard, grayish alkaline earth metal. Atomic number 4. Lightweight and high melting point.','symbol':'Be','atomicNumber':4,'chemicalGroup':'Alkaline earth metal'})
el('element_b','Boron','🧪','Chemistry',['element','chemistry'],{description:'Boron (B). A metalloid element. Atomic number 5. Used in semiconductors and borosilicate glass.','symbol':'B','atomicNumber':5,'chemicalGroup':'Metalloid'})
el('element_c','Carbon','🧪','Chemistry',['element','chemistry'],{description:'Carbon (C). The basis of organic chemistry. Atomic number 6. Forms the backbone of all known life.','symbol':'C','atomicNumber':6,'chemicalGroup':'Nonmetal'})
el('element_n','Nitrogen','🧪','Chemistry',['element','chemistry'],{description:'Nitrogen (N). A colorless, odorless gas. Atomic number 7. Makes up 78% of Earth atmosphere.','symbol':'N','atomicNumber':7,'chemicalGroup':'Nonmetal'})
el('element_o','Oxygen','🧪','Chemistry',['element','chemistry'],{description:'Oxygen (O). A highly reactive gas essential for respiration. Atomic number 8. Makes up 21% of air.','symbol':'O','atomicNumber':8,'chemicalGroup':'Nonmetal'})
el('element_f','Fluorine','🧪','Chemistry',['element','chemistry'],{description:'Fluorine (F). A pale yellow halogen gas. Atomic number 9. The most electronegative and reactive element.','symbol':'F','atomicNumber':9,'chemicalGroup':'Halogen'})
el('element_ne','Neon','🧪','Chemistry',['element','chemistry'],{description:'Neon (Ne). A colorless noble gas. Atomic number 10. Used in neon signs and high-voltage indicators.','symbol':'Ne','atomicNumber':10,'chemicalGroup':'Noble gas'})
el('element_na','Sodium','🧪','Chemistry',['element','chemistry'],{description:'Sodium (Na). A soft, silvery alkali metal. Atomic number 11. Essential for biological organisms.','symbol':'Na','atomicNumber':11,'chemicalGroup':'Alkali metal'})
el('element_mg','Magnesium','🧪','Chemistry',['element','chemistry'],{description:'Magnesium (Mg). A shiny gray alkaline earth metal. Atomic number 12. Essential for living cells.','symbol':'Mg','atomicNumber':12,'chemicalGroup':'Alkaline earth metal'})
el('element_al','Aluminium','🧪','Chemistry',['element','chemistry'],{description:'Aluminium (Al). A silvery-white, lightweight metal. Atomic number 13. Most abundant metal in Earth crust.','symbol':'Al','atomicNumber':13,'chemicalGroup':'Post-transition metal'})
el('element_si','Silicon','🧪','Chemistry',['element','chemistry'],{description:'Silicon (Si). A hard, brittle crystalline metalloid. Atomic number 14. Widely used in semiconductors and electronics.','symbol':'Si','atomicNumber':14,'chemicalGroup':'Metalloid'})
el('element_p','Phosphorus','🧪','Chemistry',['element','chemistry'],{description:'Phosphorus (P). A reactive nonmetal. Atomic number 15. Essential for DNA, RNA, and ATP.','symbol':'P','atomicNumber':15,'chemicalGroup':'Nonmetal'})
el('element_s','Sulfur','🧪','Chemistry',['element','chemistry'],{description:'Sulfur (S). A yellow crystalline nonmetal. Atomic number 16. Used in gunpowder and sulfuric acid.','symbol':'S','atomicNumber':16,'chemicalGroup':'Nonmetal'})
el('element_cl','Chlorine','🧪','Chemistry',['element','chemistry'],{description:'Chlorine (Cl). A yellow-green halogen gas. Atomic number 17. Used as a disinfectant and bleach.','symbol':'Cl','atomicNumber':17,'chemicalGroup':'Halogen'})
el('element_ar','Argon','🧪','Chemistry',['element','chemistry'],{description:'Argon (Ar). A colorless, odorless noble gas. Atomic number 18. Most abundant noble gas in Earth atmosphere.','symbol':'Ar','atomicNumber':18,'chemicalGroup':'Noble gas'})
el('element_k','Potassium','🧪','Chemistry',['element','chemistry'],{description:'Potassium (K). A soft, silvery alkali metal. Atomic number 19. Essential for nerve function and muscle contraction.','symbol':'K','atomicNumber':19,'chemicalGroup':'Alkali metal'})
el('element_ca','Calcium','🧪','Chemistry',['element','chemistry'],{description:'Calcium (Ca). A soft gray alkaline earth metal. Atomic number 20. Essential for bones, teeth, and cellular signaling.','symbol':'Ca','atomicNumber':20,'chemicalGroup':'Alkaline earth metal'})
el('element_sc','Scandium','🧪','Chemistry',['element','chemistry'],{description:'Scandium (Sc). A silvery-white metallic transition metal. Atomic number 21. Used in aerospace alloys.','symbol':'Sc','atomicNumber':21,'chemicalGroup':'Transition metal'})
el('element_ti','Titanium','🧪','Chemistry',['element','chemistry'],{description:'Titanium (Ti). A lustrous transition metal with low density and high strength. Atomic number 22.','symbol':'Ti','atomicNumber':22,'chemicalGroup':'Transition metal'})
el('element_v','Vanadium','🧪','Chemistry',['element','chemistry'],{description:'Vanadium (V). A hard, silvery-grey transition metal. Atomic number 23. Used in steel alloys.','symbol':'V','atomicNumber':23,'chemicalGroup':'Transition metal'})
el('element_cr','Chromium','🧪','Chemistry',['element','chemistry'],{description:'Chromium (Cr). A shiny grey transition metal. Atomic number 24. Provides corrosion resistance in stainless steel.','symbol':'Cr','atomicNumber':24,'chemicalGroup':'Transition metal'})
el('element_mn','Manganese','🧪','Chemistry',['element','chemistry'],{description:'Manganese (Mn). A hard, brittle silvery transition metal. Atomic number 25. Essential for steel production.','symbol':'Mn','atomicNumber':25,'chemicalGroup':'Transition metal'})
el('element_fe','Iron','🧪','Chemistry',['element','chemistry'],{description:'Iron (Fe). A strong, hard magnetic silvery-gray transition metal. Atomic number 26. Essential for steel and hemoglobin.','symbol':'Fe','atomicNumber':26,'chemicalGroup':'Transition metal'})
el('element_co','Cobalt','🧪','Chemistry',['element','chemistry'],{description:'Cobalt (Co). A hard, lustrous gray transition metal. Atomic number 27. Used in batteries and blue pigments.','symbol':'Co','atomicNumber':27,'chemicalGroup':'Transition metal'})
el('element_ni','Nickel','🧪','Chemistry',['element','chemistry'],{description:'Nickel (Ni). A silvery-white lustrous transition metal. Atomic number 28. Used in stainless steel and batteries.','symbol':'Ni','atomicNumber':28,'chemicalGroup':'Transition metal'})
el('element_cu','Copper','🧪','Chemistry',['element','chemistry'],{description:'Copper (Cu). A reddish-brown transition metal. Atomic number 29. Excellent conductor of electricity and heat.','symbol':'Cu','atomicNumber':29,'chemicalGroup':'Transition metal'})
el('element_zn','Zinc','🧪','Chemistry',['element','chemistry'],{description:'Zinc (Zn). A bluish-white transition metal. Atomic number 30. Essential for galvanization and biological enzymes.','symbol':'Zn','atomicNumber':30,'chemicalGroup':'Transition metal'})
el('element_ga','Gallium','🧪','Chemistry',['element','chemistry'],{description:'Gallium (Ga). A soft, silvery metal. Atomic number 31. Melts in the hand at 29.7°C.','symbol':'Ga','atomicNumber':31,'chemicalGroup':'Post-transition metal'})
el('element_ge','Germanium','🧪','Chemistry',['element','chemistry'],{description:'Germanium (Ge). A lustrous, hard-brittle metalloid. Atomic number 32. Used in fiber optics and semiconductors.','symbol':'Ge','atomicNumber':32,'chemicalGroup':'Metalloid'})
el('element_as','Arsenic','🧪','Chemistry',['element','chemistry'],{description:'Arsenic (As). A brittle, steel-gray metalloid. Atomic number 33. Known for its toxicity.','symbol':'As','atomicNumber':33,'chemicalGroup':'Metalloid'})
el('element_se','Selenium','🧪','Chemistry',['element','chemistry'],{description:'Selenium (Se). A nonmetal with reddish color. Atomic number 34. Essential trace element for living organisms.','symbol':'Se','atomicNumber':34,'chemicalGroup':'Nonmetal'})
el('element_br','Bromine','🧪','Chemistry',['element','chemistry'],{description:'Bromine (Br). A reddish-brown halogen liquid. Atomic number 35. The only nonmetallic element liquid at room temperature.','symbol':'Br','atomicNumber':35,'chemicalGroup':'Halogen'})
el('element_kr','Krypton','🧪','Chemistry',['element','chemistry'],{description:'Krypton (Kr). A colorless noble gas. Atomic number 36. Used in high-performance light bulbs.','symbol':'Kr','atomicNumber':36,'chemicalGroup':'Noble gas'})
el('element_rb','Rubidium','🧪','Chemistry',['element','chemistry'],{description:'Rubidium (Rb). A soft, silvery-white alkali metal. Atomic number 37. Highly reactive.','symbol':'Rb','atomicNumber':37,'chemicalGroup':'Alkali metal'})
el('element_sr','Strontium','🧪','Chemistry',['element','chemistry'],{description:'Strontium (Sr). A soft, silvery alkaline earth metal. Atomic number 38. Used in fireworks for red color.','symbol':'Sr','atomicNumber':38,'chemicalGroup':'Alkaline earth metal'})
el('element_y','Yttrium','🧪','Chemistry',['element','chemistry'],{description:'Yttrium (Y). A silvery-metallic transition metal. Atomic number 39. Used in LEDs and superconductors.','symbol':'Y','atomicNumber':39,'chemicalGroup':'Transition metal'})
el('element_zr','Zirconium','🧪','Chemistry',['element','chemistry'],{description:'Zirconium (Zr). A lustrous gray-white transition metal. Atomic number 40. Used in nuclear reactors.','symbol':'Zr','atomicNumber':40,'chemicalGroup':'Transition metal'})
el('element_nb','Niobium','🧪','Chemistry',['element','chemistry'],{description:'Niobium (Nb). A shiny gray transition metal. Atomic number 41. Used in superconducting magnets.','symbol':'Nb','atomicNumber':41,'chemicalGroup':'Transition metal'})
el('element_mo','Molybdenum','🧪','Chemistry',['element','chemistry'],{description:'Molybdenum (Mo). A silvery transition metal. Atomic number 42. Used in high-strength steel alloys.','symbol':'Mo','atomicNumber':42,'chemicalGroup':'Transition metal'})
el('element_tc','Technetium','🧪','Chemistry',['element','chemistry'],{description:'Technetium (Tc). A silvery-gray transition metal. Atomic number 43. The lightest element with no stable isotopes.','symbol':'Tc','atomicNumber':43,'chemicalGroup':'Transition metal'})
el('element_ru','Ruthenium','🧪','Chemistry',['element','chemistry'],{description:'Ruthenium (Ru). A hard, white transition metal. Atomic number 44. Used in electrical contacts.','symbol':'Ru','atomicNumber':44,'chemicalGroup':'Transition metal'})
el('element_rh','Rhodium','🧪','Chemistry',['element','chemistry'],{description:'Rhodium (Rh). A silvery-white transition metal. Atomic number 45. One of the rarest precious metals.','symbol':'Rh','atomicNumber':45,'chemicalGroup':'Transition metal'})
el('element_pd','Palladium','🧪','Chemistry',['element','chemistry'],{description:'Palladium (Pd). A lustrous silvery-white transition metal. Atomic number 46. Used in catalytic converters.','symbol':'Pd','atomicNumber':46,'chemicalGroup':'Transition metal'})
el('element_ag','Silver','🧪','Chemistry',['element','chemistry'],{description:'Silver (Ag). A white lustrous transition metal. Atomic number 47. Best conductor of electricity.','symbol':'Ag','atomicNumber':47,'chemicalGroup':'Transition metal'})
el('element_cd','Cadmium','🧪','Chemistry',['element','chemistry'],{description:'Cadmium (Cd). A soft, bluish-white transition metal. Atomic number 48. Used in rechargeable batteries.','symbol':'Cd','atomicNumber':48,'chemicalGroup':'Transition metal'})
el('element_in','Indium','🧪','Chemistry',['element','chemistry'],{description:'Indium (In). A soft, silvery post-transition metal. Atomic number 49. Used in touchscreens and solar panels.','symbol':'In','atomicNumber':49,'chemicalGroup':'Post-transition metal'})
el('element_sn','Tin','🧪','Chemistry',['element','chemistry'],{description:'Tin (Sn). A silvery post-transition metal. Atomic number 50. Used in alloys and food packaging.','symbol':'Sn','atomicNumber':50,'chemicalGroup':'Post-transition metal'})
el('element_sb','Antimony','🧪','Chemistry',['element','chemistry'],{description:'Antimony (Sb). A brittle, silvery metalloid. Atomic number 51. Used in flame retardants.','symbol':'Sb','atomicNumber':51,'chemicalGroup':'Metalloid'})
el('element_te','Tellurium','🧪','Chemistry',['element','chemistry'],{description:'Tellurium (Te). A brittle, silver-white metalloid. Atomic number 52. Used in thermoelectric materials.','symbol':'Te','atomicNumber':52,'chemicalGroup':'Metalloid'})
el('element_i','Iodine','🧪','Chemistry',['element','chemistry'],{description:'Iodine (I). A purple-black halogen. Atomic number 53. Essential for thyroid function.','symbol':'I','atomicNumber':53,'chemicalGroup':'Halogen'})
el('element_xe','Xenon','🧪','Chemistry',['element','chemistry'],{description:'Xenon (Xe). A colorless, heavy noble gas. Atomic number 54. Used in flash lamps and ion thrusters.','symbol':'Xe','atomicNumber':54,'chemicalGroup':'Noble gas'})
el('element_cs','Caesium','🧪','Chemistry',['element','chemistry'],{description:'Caesium (Cs). A soft, silvery-gold alkali metal. Atomic number 55. One of the most reactive metals.','symbol':'Cs','atomicNumber':55,'chemicalGroup':'Alkali metal'})
el('element_ba','Barium','🧪','Chemistry',['element','chemistry'],{description:'Barium (Ba). A soft, silvery alkaline earth metal. Atomic number 56. Used in medical X-ray imaging.','symbol':'Ba','atomicNumber':56,'chemicalGroup':'Alkaline earth metal'})
el('element_la','Lanthanum','🧪','Chemistry',['element','chemistry'],{description:'Lanthanum (La). A soft, malleable silvery-white rare earth metal. Atomic number 57.','symbol':'La','atomicNumber':57,'chemicalGroup':'Lanthanide'})
el('element_ce','Cerium','🧪','Chemistry',['element','chemistry'],{description:'Cerium (Ce). A soft, silvery rare earth metal. Atomic number 58. Most abundant rare earth element.','symbol':'Ce','atomicNumber':58,'chemicalGroup':'Lanthanide'})
el('element_pr','Praseodymium','🧪','Chemistry',['element','chemistry'],{description:'Praseodymium (Pr). A yellowish rare earth metal. Atomic number 59. Used in high-strength magnets.','symbol':'Pr','atomicNumber':59,'chemicalGroup':'Lanthanide'})
el('element_nd','Neodymium','🧪','Chemistry',['element','chemistry'],{description:'Neodymium (Nd). A silvery-gold rare earth metal. Atomic number 60. Used in powerful permanent magnets.','symbol':'Nd','atomicNumber':60,'chemicalGroup':'Lanthanide'})
el('element_pm','Promethium','🧪','Chemistry',['element','chemistry'],{description:'Promethium (Pm). A rare earth metal. Atomic number 61. Radioactive with no stable isotopes.','symbol':'Pm','atomicNumber':61,'chemicalGroup':'Lanthanide'})
el('element_sm','Samarium','🧪','Chemistry',['element','chemistry'],{description:'Samarium (Sm). A silvery rare earth metal. Atomic number 62. Used in high-temperature magnets.','symbol':'Sm','atomicNumber':62,'chemicalGroup':'Lanthanide'})
el('element_eu','Europium','🧪','Chemistry',['element','chemistry'],{description:'Europium (Eu). A silvery rare earth metal. Atomic number 63. Used in red phosphors for displays.','symbol':'Eu','atomicNumber':63,'chemicalGroup':'Lanthanide'})
el('element_gd','Gadolinium','🧪','Chemistry',['element','chemistry'],{description:'Gadolinium (Gd). A silvery-white rare earth metal. Atomic number 64. Used in MRI contrast agents.','symbol':'Gd','atomicNumber':64,'chemicalGroup':'Lanthanide'})
el('element_tb','Terbium','🧪','Chemistry',['element','chemistry'],{description:'Terbium (Tb). A silvery-gray rare earth metal. Atomic number 65. Used in solid-state devices.','symbol':'Tb','atomicNumber':65,'chemicalGroup':'Lanthanide'})
el('element_dy','Dysprosium','🧪','Chemistry',['element','chemistry'],{description:'Dysprosium (Dy). A silvery rare earth metal. Atomic number 66. Used in high-strength magnets.','symbol':'Dy','atomicNumber':66,'chemicalGroup':'Lanthanide'})
el('element_ho','Holmium','🧪','Chemistry',['element','chemistry'],{description:'Holmium (Ho). A silvery rare earth metal. Atomic number 67. Highest magnetic strength of any element.','symbol':'Ho','atomicNumber':67,'chemicalGroup':'Lanthanide'})
el('element_er','Erbium','🧪','Chemistry',['element','chemistry'],{description:'Erbium (Er). A silvery-white rare earth metal. Atomic number 68. Used in fiber optics.','symbol':'Er','atomicNumber':68,'chemicalGroup':'Lanthanide'})
el('element_tm','Thulium','🧪','Chemistry',['element','chemistry'],{description:'Thulium (Tm). A silvery-gray rare earth metal. Atomic number 69. Least abundant stable rare earth.','symbol':'Tm','atomicNumber':69,'chemicalGroup':'Lanthanide'})
el('element_yb','Ytterbium','🧪','Chemistry',['element','chemistry'],{description:'Ytterbium (Yb). A silvery rare earth metal. Atomic number 70. Used in atomic clocks.','symbol':'Yb','atomicNumber':70,'chemicalGroup':'Lanthanide'})
el('element_lu','Lutetium','🧪','Chemistry',['element','chemistry'],{description:'Lutetium (Lu). A silvery-white rare earth metal. Atomic number 71. Heaviest and hardest lanthanide.','symbol':'Lu','atomicNumber':71,'chemicalGroup':'Lanthanide'})
el('element_hf','Hafnium','🧪','Chemistry',['element','chemistry'],{description:'Hafnium (Hf). A lustrous silvery transition metal. Atomic number 72. Used in nuclear control rods.','symbol':'Hf','atomicNumber':72,'chemicalGroup':'Transition metal'})
el('element_ta','Tantalum','🧪','Chemistry',['element','chemistry'],{description:'Tantalum (Ta). A hard, blue-gray transition metal. Atomic number 73. Highly corrosion resistant.','symbol':'Ta','atomicNumber':73,'chemicalGroup':'Transition metal'})
el('element_w','Tungsten','🧪','Chemistry',['element','chemistry'],{description:'Tungsten (W). A hard, dense gray-white transition metal. Atomic number 74. Highest melting point of all metals.','symbol':'W','atomicNumber':74,'chemicalGroup':'Transition metal'})
el('element_re','Rhenium','🧪','Chemistry',['element','chemistry'],{description:'Rhenium (Re). A silvery-white transition metal. Atomic number 75. One of the rarest elements in Earth crust.','symbol':'Re','atomicNumber':75,'chemicalGroup':'Transition metal'})
el('element_os','Osmium','🧪','Chemistry',['element','chemistry'],{description:'Osmium (Os). A hard, brittle bluish-white transition metal. Atomic number 76. Densest naturally occurring element.','symbol':'Os','atomicNumber':76,'chemicalGroup':'Transition metal'})
el('element_ir','Iridium','🧪','Chemistry',['element','chemistry'],{description:'Iridium (Ir). A hard, brittle silvery-white transition metal. Atomic number 77. Most corrosion-resistant metal.','symbol':'Ir','atomicNumber':77,'chemicalGroup':'Transition metal'})
el('element_pt','Platinum','🧪','Chemistry',['element','chemistry'],{description:'Platinum (Pt). A dense, malleable silvery-white transition metal. Atomic number 78. Used in catalysts and jewelry.','symbol':'Pt','atomicNumber':78,'chemicalGroup':'Transition metal'})
el('element_au','Gold','🧪','Chemistry',['element','chemistry'],{description:'Gold (Au). A precious yellow transition metal. Atomic number 79. Highly malleable and resistant to corrosion.','symbol':'Au','atomicNumber':79,'chemicalGroup':'Transition metal'})
el('element_hg','Mercury','🧪','Chemistry',['element','chemistry'],{description:'Mercury (Hg). A silvery-white liquid transition metal. Atomic number 80. The only metal liquid at room temperature.','symbol':'Hg','atomicNumber':80,'chemicalGroup':'Transition metal'})
el('element_tl','Thallium','🧪','Chemistry',['element','chemistry'],{description:'Thallium (Tl). A soft, gray post-transition metal. Atomic number 81. Highly toxic.','symbol':'Tl','atomicNumber':81,'chemicalGroup':'Post-transition metal'})
el('element_pb','Lead','🧪','Chemistry',['element','chemistry'],{description:'Lead (Pb). A soft, dense post-transition metal. Atomic number 82. Used in batteries and radiation shielding.','symbol':'Pb','atomicNumber':82,'chemicalGroup':'Post-transition metal'})
el('element_bi','Bismuth','🧪','Chemistry',['element','chemistry'],{description:'Bismuth (Bi). A brittle, pinkish post-transition metal. Atomic number 83. Least toxic heavy metal.','symbol':'Bi','atomicNumber':83,'chemicalGroup':'Post-transition metal'})
el('element_po','Polonium','🧪','Chemistry',['element','chemistry'],{description:'Polonium (Po). A rare, highly radioactive metalloid. Atomic number 84. Highly toxic.','symbol':'Po','atomicNumber':84,'chemicalGroup':'Metalloid'})
el('element_at','Astatine','🧪','Chemistry',['element','chemistry'],{description:'Astatine (At). A radioactive halogen. Atomic number 85. Rarest naturally occurring element.','symbol':'At','atomicNumber':85,'chemicalGroup':'Halogen'})
el('element_rn','Radon','🧪','Chemistry',['element','chemistry'],{description:'Radon (Rn). A colorless, radioactive noble gas. Atomic number 86. Produced by decay of radium.','symbol':'Rn','atomicNumber':86,'chemicalGroup':'Noble gas'})
el('element_fr','Francium','🧪','Chemistry',['element','chemistry'],{description:'Francium (Fr). A highly radioactive alkali metal. Atomic number 87. Second rarest naturally occurring element.','symbol':'Fr','atomicNumber':87,'chemicalGroup':'Alkali metal'})
el('element_ra','Radium','🧪','Chemistry',['element','chemistry'],{description:'Radium (Ra). A radioactive alkaline earth metal. Atomic number 88. Undergoes radioactive decay.','symbol':'Ra','atomicNumber':88,'chemicalGroup':'Alkaline earth metal'})
el('element_ac','Actinium','🧪','Chemistry',['element','chemistry'],{description:'Actinium (Ac). A soft, silvery-white radioactive metal. Atomic number 89. First of the actinide series.','symbol':'Ac','atomicNumber':89,'chemicalGroup':'Actinide'})
el('element_th','Thorium','🧪','Chemistry',['element','chemistry'],{description:'Thorium (Th). A weakly radioactive actinide metal. Atomic number 90. Used in nuclear energy research.','symbol':'Th','atomicNumber':90,'chemicalGroup':'Actinide'})
el('element_pa','Protactinium','🧪','Chemistry',['element','chemistry'],{description:'Protactinium (Pa). A dense, silvery-gray radioactive actinide metal. Atomic number 91.','symbol':'Pa','atomicNumber':91,'chemicalGroup':'Actinide'})
el('element_u','Uranium','🧪','Chemistry',['element','chemistry'],{description:'Uranium (U). A silvery-gray radioactive actinide metal. Atomic number 92. Used as nuclear fuel.','symbol':'U','atomicNumber':92,'chemicalGroup':'Actinide'})
el('element_np','Neptunium','🧪','Chemistry',['element','chemistry'],{description:'Neptunium (Np). A silvery metallic radioactive actinide. Atomic number 93. First transuranium element.','symbol':'Np','atomicNumber':93,'chemicalGroup':'Actinide'})
el('element_pu','Plutonium','🧪','Chemistry',['element','chemistry'],{description:'Plutonium (Pu). A radioactive actinide metal. Atomic number 94. Used in nuclear weapons and power.','symbol':'Pu','atomicNumber':94,'chemicalGroup':'Actinide'})
el('element_am','Americium','🧪','Chemistry',['element','chemistry'],{description:'Americium (Am). A radioactive actinide metal. Atomic number 95. Used in smoke detectors.','symbol':'Am','atomicNumber':95,'chemicalGroup':'Actinide'})
el('element_cm','Curium','🧪','Chemistry',['element','chemistry'],{description:'Curium (Cm). A hard, dense radioactive actinide metal. Atomic number 96.','symbol':'Cm','atomicNumber':96,'chemicalGroup':'Actinide'})
el('element_bk','Berkelium','🧪','Chemistry',['element','chemistry'],{description:'Berkelium (Bk). A radioactive actinide metal. Atomic number 97. Named after Berkeley, California.','symbol':'Bk','atomicNumber':97,'chemicalGroup':'Actinide'})
el('element_cf','Californium','🧪','Chemistry',['element','chemistry'],{description:'Californium (Cf). A radioactive actinide metal. Atomic number 98. Used as a neutron source.','symbol':'Cf','atomicNumber':98,'chemicalGroup':'Actinide'})
el('element_es','Einsteinium','🧪','Chemistry',['element','chemistry'],{description:'Einsteinium (Es). A radioactive actinide metal. Atomic number 99. Named after Albert Einstein.','symbol':'Es','atomicNumber':99,'chemicalGroup':'Actinide'})
el('element_fm','Fermium','🧪','Chemistry',['element','chemistry'],{description:'Fermium (Fm). A radioactive actinide metal. Atomic number 100. Named after Enrico Fermi.','symbol':'Fm','atomicNumber':100,'chemicalGroup':'Actinide'})
el('element_md','Mendelevium','🧪','Chemistry',['element','chemistry'],{description:'Mendelevium (Md). A radioactive actinide metal. Atomic number 101. Named after Dmitri Mendeleev.','symbol':'Md','atomicNumber':101,'chemicalGroup':'Actinide'})
el('element_no','Nobelium','🧪','Chemistry',['element','chemistry'],{description:'Nobelium (No). A radioactive actinide metal. Atomic number 102. Named after Alfred Nobel.','symbol':'No','atomicNumber':102,'chemicalGroup':'Actinide'})
el('element_lr','Lawrencium','🧪','Chemistry',['element','chemistry'],{description:'Lawrencium (Lr). A radioactive actinide metal. Atomic number 103. Named after Ernest Lawrence.','symbol':'Lr','atomicNumber':103,'chemicalGroup':'Actinide'})
el('element_rf','Rutherfordium','🧪','Chemistry',['element','chemistry'],{description:'Rutherfordium (Rf). A radioactive transactinide metal. Atomic number 104. Named after Ernest Rutherford.','symbol':'Rf','atomicNumber':104,'chemicalGroup':'Transition metal'})
el('element_db','Dubnium','🧪','Chemistry',['element','chemistry'],{description:'Dubnium (Db). A radioactive transition metal. Atomic number 105. Named after Dubna, Russia.','symbol':'Db','atomicNumber':105,'chemicalGroup':'Transition metal'})
el('element_sg','Seaborgium','🧪','Chemistry',['element','chemistry'],{description:'Seaborgium (Sg). A radioactive transition metal. Atomic number 106. Named after Glenn T. Seaborg.','symbol':'Sg','atomicNumber':106,'chemicalGroup':'Transition metal'})
el('element_bh','Bohrium','🧪','Chemistry',['element','chemistry'],{description:'Bohrium (Bh). A radioactive transition metal. Atomic number 107. Named after Niels Bohr.','symbol':'Bh','atomicNumber':107,'chemicalGroup':'Transition metal'})
el('element_hs','Hassium','🧪','Chemistry',['element','chemistry'],{description:'Hassium (Hs). A radioactive transition metal. Atomic number 108. Named after the Latin name for Hesse.','symbol':'Hs','atomicNumber':108,'chemicalGroup':'Transition metal'})
el('element_mt','Meitnerium','🧪','Chemistry',['element','chemistry'],{description:'Meitnerium (Mt). A radioactive transition metal. Atomic number 109. Named after Lise Meitner.','symbol':'Mt','atomicNumber':109,'chemicalGroup':'Transition metal'})
el('element_ds','Darmstadtium','🧪','Chemistry',['element','chemistry'],{description:'Darmstadtium (Ds). A radioactive transition metal. Atomic number 110. Named after Darmstadt, Germany.','symbol':'Ds','atomicNumber':110,'chemicalGroup':'Transition metal'})
el('element_rg','Roentgenium','🧪','Chemistry',['element','chemistry'],{description:'Roentgenium (Rg). A radioactive transition metal. Atomic number 111. Named after Wilhelm Röntgen.','symbol':'Rg','atomicNumber':111,'chemicalGroup':'Transition metal'})
el('element_cn','Copernicium','🧪','Chemistry',['element','chemistry'],{description:'Copernicium (Cn). A radioactive transition metal. Atomic number 112. Named after Nicolaus Copernicus.','symbol':'Cn','atomicNumber':112,'chemicalGroup':'Transition metal'})
el('element_nh','Nihonium','🧪','Chemistry',['element','chemistry'],{description:'Nihonium (Nh). A radioactive post-transition metal. Atomic number 113. Named after Japan (Nihon).','symbol':'Nh','atomicNumber':113,'chemicalGroup':'Post-transition metal'})
el('element_fl','Flerovium','🧪','Chemistry',['element','chemistry'],{description:'Flerovium (Fl). A radioactive post-transition metal. Atomic number 114. Named after the Flerov Laboratory.','symbol':'Fl','atomicNumber':114,'chemicalGroup':'Post-transition metal'})
el('element_mc','Moscovium','🧪','Chemistry',['element','chemistry'],{description:'Moscovium (Mc). A radioactive post-transition metal. Atomic number 115. Named after Moscow.','symbol':'Mc','atomicNumber':115,'chemicalGroup':'Post-transition metal'})
el('element_lv','Livermorium','🧪','Chemistry',['element','chemistry'],{description:'Livermorium (Lv). A radioactive post-transition metal. Atomic number 116. Named after Livermore, California.','symbol':'Lv','atomicNumber':116,'chemicalGroup':'Post-transition metal'})
el('element_ts','Tennessine','🧪','Chemistry',['element','chemistry'],{description:'Tennessine (Ts). A radioactive halogen. Atomic number 117. Named after Tennessee.','symbol':'Ts','atomicNumber':117,'chemicalGroup':'Halogen'})
el('element_og','Oganesson','🧪','Chemistry',['element','chemistry'],{description:'Oganesson (Og). A radioactive noble gas. Atomic number 118. Named after Yuri Oganessian. Heaviest known element.','symbol':'Og','atomicNumber':118,'chemicalGroup':'Noble gas'})

/* ─── INTEGRATE ELEMENTS INTO DISCOVERY CHAINS ─── */
re('physics','energy','atom','strong')
re('atom','energy','nucleus','strong')
re('nucleus','energy','proton','strong')
re('nucleus','energy','neutron','strong')
re('proton','electron','element_h','strong')
re('star','energy','element_he','strong')
re('life','energy','element_c','strong')
re('plant','air','element_o','strong')
re('water','electricity','element_h','reasonable')
re('water','electricity','element_o','reasonable')
re('star','explosion','element_fe','reasonable')
re('star','supernova','element_au','reasonable')
re('star','supernova','element_ag','reasonable')
re('star','supernova','element_cu','reasonable')
re('star','supernova','element_pt','reasonable')
re('star','supernova','element_pb','reasonable')
re('star','supernova','element_u','reasonable')

/* ─── STRENGTHEN SCIENTIFIC CHAINS ─── */
re('water','cold','ice','strong')
re('water','heat','steam','strong')
re('cloud','cold','snow','strong')
re('sand','heat','glass','strong')
re('plant','time','tree','strong')
re('wood','fire','ash','strong')
re('wood','fire','charcoal','strong')
re('iron','carbon','steel','strong')
re('electricity','metal','wire','strong')

/* ─── GAMEPLAY LOGIC AUDIT REPAIRS ─── */
// These replace genuinely arbitrary or misleading legacy shortcuts. Each new
// route uses existing elements and describes a defensible relationship.
;[
  { from: ['mineral', 'water'], to: ['ash', 'water'], result: 'base', type: 'chemical', explanation: 'Water leaches alkaline compounds from wood ash, historically producing a basic lye solution.' },
  { from: ['planet', 'explosion'], to: ['space', 'stone'], result: 'asteroid', type: 'conceptual', explanation: 'An asteroid is a rocky body traveling through space; this is a classification abstraction.' },
  { from: ['mammal', 'big'], to: ['mammal', 'honey'], result: 'bear', type: 'conceptual', explanation: 'Bears are mammals strongly associated with seeking honey; this is an ecological association.' },
  { from: ['wheat', 'beer'], to: ['beer', 'factory'], result: 'brewery', type: 'industrial', explanation: 'A brewery is a production facility where beer is manufactured.' },
  { from: ['pine', 'mountain'], to: ['tree', 'mountain'], result: 'cedar', type: 'biological', explanation: 'Cedars are trees commonly associated with mountainous habitats.' },
  { from: ['frost', 'sun'], to: ['air', 'humidity'], result: 'dew', type: 'environmental', explanation: 'Dew forms when humid air cools enough for water vapor to condense on surfaces.' },
  { from: ['fish', 'human'], to: ['mammal', 'ocean'], result: 'dolphin', type: 'biological', explanation: 'Dolphins are marine mammals, not fish.' },
  { from: ['skin', 'fabric'], to: ['skin', 'tool'], result: 'leather', type: 'industrial', explanation: 'Leather is produced by processing animal hide; Tool abstracts the tanning and finishing process.' },
  { from: ['ice', 'city'], to: ['ice', 'shelter'], result: 'igloo', type: 'industrial', explanation: 'An igloo is a shelter constructed from blocks of compacted snow or ice.' },
  { from: ['desert', 'city'], to: ['oasis_geo', 'city'], result: 'oasis_city', type: 'conceptual', explanation: 'Settlements commonly grow around reliable oasis water sources in deserts.' },
  { from: ['water', 'sugar'], to: ['carbon_dioxide', 'water'], result: 'soda', type: 'physical', explanation: 'Dissolving carbon dioxide in water produces carbonated water, the physical basis of soda.' },
  { from: ['fish', 'ocean'], to: ['mammal', 'sea'], result: 'whale', type: 'biological', explanation: 'Whales are large marine mammals, not fish.' },
  { from: ['life', 'stone'], to: ['life', 'mineral'], result: 'egg', type: 'biological', explanation: 'An egg is a living reproductive structure whose shell is commonly mineralized.' },
  { from: ['vegetable', 'green'], to: ['tree', 'vegetable'], result: 'broccoli', type: 'conceptual', explanation: 'Broccoli is a vegetable with a branching, tree-like form.' },
  { from: ['fruit', 'warm'], to: ['fruit', 'pink'], result: 'peach', type: 'conceptual', explanation: 'Peach fruit gives its name to a familiar warm pink-orange color.' },
  { from: ['moss', 'swamp'], to: ['forest', 'rain'], result: 'mushroom', type: 'biological', explanation: 'Moist forest conditions support fungi that produce mushrooms.' },
  { from: ['algae', 'ocean'], to: ['colony', 'ocean'], result: 'coral', type: 'biological', explanation: 'Corals are colonies of marine animals; algae often live symbiotically within reef-building corals.' },
].forEach(replaceLegacyRecipe)

;[
  ['physics', 'energy', 'atom'],
  ['plant', 'time', 'coal'],
  ['human', 'robot', 'engineer'],
  ['energy', 'paper', 'book'],
  ['volcano', 'ice', 'obsidian'],
  ['rocket', 'space_exploration', 'moon'],
  ['cell', 'sun', 'solar_energy'],
].forEach(([a, b, result]) => removeLegacyRecipe(a, b, result))

// The deepest computing path uses real industrial carbothermic reduction of
// silica. Keep the compact inputs, but label and explain the process honestly.
const siliconRecipe = R[sortKey('sand', 'carbon')]
if (!siliconRecipe || siliconRecipe.result !== 'silicon') {
  throw new Error('Gameplay audit could not locate sand + carbon -> silicon')
}
siliconRecipe.type = 'industrial'
siliconRecipe.explanation = 'Industrial silicon is produced by reducing silica-rich sand with carbon at high temperature; the furnace is abstracted.'

const auditedElementUpdates = {
  astronaut_p: ['Spacefarer', 'A person traveling beyond Earth aboard a spacecraft; a broader gameplay synonym for an astronaut.'],
  automation_i: ['Industrial Automation', 'The use of control systems and robots to operate industrial production with reduced manual intervention.'],
  beach_g: ['Island Beach', 'A shoreline of sand or pebbles bordering an island and the surrounding water.'],
  butterfly_i: ['Colorful Butterfly', 'A butterfly whose patterned scales produce conspicuous colors used in signaling and camouflage.'],
  database_e: ['Software Database', 'A structured collection of information managed by database software.'],
  eagle_b: ['Cliff Eagle', 'An eagle associated with high cliffs used for nesting and surveying prey.'],
  earth_p: ['Habitable Planet', 'A planet with environmental conditions capable of supporting life; Earth is the known example.'],
  fear_e: ['Alarm Response', 'A protective fear response triggered when danger threatens survival.'],
  mars_p: ['Iron-rich Planet', 'A rocky planet whose iron-bearing surface minerals can produce a reddish appearance, as on Mars.'],
  microscope_g: ['Magnifying Microscope', 'An optical instrument that combines lenses to magnify structures too small for unaided vision.'],
  mushroom_f: ['Cave Fungus', 'A fungus adapted to the dark, humid conditions found in caves.'],
  music_genre: ['Music Genre', 'A category of music sharing cultural traditions, techniques, or stylistic conventions.'],
  owl_b: ['Forest Owl', 'An owl adapted to hunting and nesting in woodland habitats.'],
  server_c: ['Storage Server', 'A networked computer configured to store and provide data to other systems.'],
  street: ['Streetlight', 'An outdoor electric lamp that illuminates streets and public paths after dark.'],
  telescope_g: ['Optical Telescope', 'A telescope that uses lenses or mirrors in a tube to collect and focus visible light.'],
  tissue_bio: ['Biological Tissue', 'A coordinated group of similar cells that performs a shared function in an organism.'],
}
/* ─── FIX MISSING INTERMEDIATES ─── */
if (!Object.values(R).some(r => r.result === 'worm')) re('water','mud','worm','reasonable')
if (!Object.values(R).some(r => r.result === 'pressure')) re('air','weight','pressure','strong')
if (!Object.values(R).some(r => r.result === 'flat')) re('plains','earth','flat','reasonable')
if (!Object.values(R).some(r => r.result === 'heat')) re('fire','energy','heat','strong')

/* ─── POST-PROCESS: Give periodic elements unique recipes ─── */
// Use unique free pairs to give each periodic element its own recipe
const periodicIds = Object.keys(E).filter(id => id.startsWith('element_'))
const standbyInputs = ['chemistry','star','energy','mineral','metal','gas','rock','nucleus','atom','proton','mountain','fire','water','air','earth','life','plant','volcano','bone','salt']
const usedPairs = new Set(Object.keys(R))
const freePairs = []
for (let i = 0; i < standbyInputs.length; i++) {
  for (let j = i + 1; j < standbyInputs.length; j++) {
    const key = sortKey(standbyInputs[i], standbyInputs[j])
    if (!usedPairs.has(key)) freePairs.push([standbyInputs[i], standbyInputs[j], key])
  }
}
let fpIdx = 0
periodicIds.forEach(id => {
  // Remove any existing earth+id fallback
  const oldKey = sortKey('earth', id)
  if (R[oldKey] && R[oldKey].result === id) delete R[oldKey]
  // Remove any existing air+id fallback (from previous run)
  const oldKey2 = sortKey('air', id)
  if (R[oldKey2] && R[oldKey2].result === id) delete R[oldKey2]
  // Check if element already has a proper recipe (not self-referential)
  const existing = Object.values(R).find(r => r.result === id && r.a !== 'earth' && r.a !== 'air')
  if (existing) return // Already has proper recipe
  // Assign from free pairs
  while (fpIdx < freePairs.length) {
    const [a, b, key] = freePairs[fpIdx]
    fpIdx++
    if (!R[key] && E[a] && E[b]) {
      re(a, b, id, 'reasonable')
      break
    }
  }
})

/* ─── POST-PROCESS: Add descriptions for all elements ─── */
const ELEMENT_DESCRIPTIONS = {
  water: 'A transparent, tasteless liquid essential for all known forms of life. Covers most of Earth\'s surface.',
  fire: 'A rapid chemical reaction releasing heat, light, and flame. Early humans harnessed it for warmth, cooking, and protection.',
  air: 'The invisible mixture of gases that surrounds Earth. Primarily composed of nitrogen and oxygen.',
  earth: 'The solid surface of our planet. Composed of rock, soil, and minerals. The foundation for life and civilization.',
  archipelago: 'A chain or cluster of islands grouped together within a sea or ocean.',
  cliff: 'A steep, near-vertical rock face formed by erosion, faulting, or other geological processes.',
  emerald_g: 'A green variety of the mineral beryl, colored mainly by trace chromium or vanadium.',
  gem: 'A mineral or organic material valued for beauty, rarity, and durability, often cut and polished for decoration.',
  island: 'An area of land completely surrounded by water and smaller than a continent.',
  pond: 'A relatively small, shallow body of standing freshwater that can support aquatic ecosystems.',
  rose_garden: 'A cultivated garden designed primarily for growing and displaying roses.',
  anatomy: 'The scientific study of the structures and physical organization of living organisms.',
  organ: 'A body structure composed of multiple tissues working together to perform a specialized function.',
  surgery: 'Medical treatment that uses operative procedures to repair, remove, or examine body tissues.',
  vaccine: 'A biological preparation that trains the immune system to recognize and respond to a specific pathogen or disease.',
  '3d_printer': 'A machine that builds three-dimensional objects layer by layer from a digital model.',
  bulb: 'An electric lamp that produces light using a filament, gas discharge, or semiconductor light source.',
  cryptocurrency: 'A digital asset whose transactions are recorded and secured using cryptographic computer networks.',
  ecommerce: 'The buying and selling of goods or services through websites, apps, and other electronic networks.',
  hard_drive: 'A data-storage device that records digital information magnetically on rotating disks.',
  rocket_engine: 'An engine that produces thrust by expelling high-speed exhaust while carrying both fuel and oxidizer.',
  smartphone: 'A mobile phone that combines communication with a programmable computer, sensors, and internet access.',
  television: 'A system and display device for receiving synchronized moving images and sound.',
  amber: 'Fossilized tree resin, usually golden or brown, that can preserve ancient organisms and plant material.',
  clock: 'An instrument that measures and displays time using a regular mechanical, electrical, or atomic process.',
  dam: 'A barrier built across flowing water to store it, control floods, support irrigation, or generate power.',
  granite: 'A coarse-grained igneous rock composed mainly of quartz, feldspar, and mica.',
  lighthouse: 'A coastal tower carrying a powerful warning or navigation light for ships.',
  orange: 'A round citrus fruit with a fragrant rind and juicy segments rich in vitamin C.',
  quartz: 'A common crystalline mineral made of silicon dioxide, found in many rocks and sands.',
  smoothie: 'A thick drink made by blending fruit or vegetables, often with milk, yogurt, juice, or ice.',
  plant: 'A living organism that uses sunlight to produce its own food through photosynthesis. The base of most ecosystems.',
  lava: 'Molten rock that erupts from volcanoes. Temperatures typically range from 700 to 1,200°C.',
  steam: 'The gaseous phase of water. Water vapor becomes visible when it condenses into tiny droplets in the air.',
  dust: 'Fine particles of matter. Can be soil, pollen, ash, or tiny fragments of rock.',
  energy: 'The capacity to do work or produce heat. A fundamental concept in physics, appearing in electrical, thermal, nuclear, and kinetic forms.',
  rain: 'Liquid water falling from clouds. Formed when water vapor condenses in the atmosphere.',
  mud: 'A wet mixture of earth and water. Soft, sticky, and the raw material for clay and pottery.',
  stone: 'A hard, naturally occurring solid mineral material. One of the oldest building materials used by humans.',
  sand: 'Granular material composed of finely divided rock and mineral particles. The primary ingredient in glass.',
  glass: 'A hard, brittle, transparent material made by heating sand to extreme temperatures. Used in windows, containers, and optics.',
  metal: 'A solid material that is typically hard, shiny, malleable, and conducts electricity and heat well.',
  clay: 'A fine-grained natural soil material that becomes plastic when wet and hardens when fired. Used for pottery and bricks.',
  brick: 'A rectangular building block made from clay and fired in a kiln. One of the most fundamental construction materials.',
  wood: 'A porous, fibrous material from trees. Used for construction, tools, fuel, and paper since prehistoric times.',
  life: 'The characteristic that distinguishes living organisms from inorganic matter. Capable of growth, reproduction, and response to stimuli.',
  human: 'A highly intelligent primate species (Homo sapiens). Capable of abstract reasoning, language, technology, and civilization.',
  seed: 'A small embryonic plant enclosed in a protective coating. The beginning of a new plant\'s life cycle.',
  fruit: 'The mature ovary of a flowering plant, containing seeds. Often sweet and edible.',
  vegetable: 'An edible part of a plant, such as roots, stems, or leaves. A fundamental food source.',
  tree: 'A large perennial plant with a trunk, branches, and leaves. Provides wood, oxygen, and habitat for countless species.',
  flower: 'The reproductive structure of flowering plants. Often colorful and fragrant to attract pollinators.',
  grass: 'A group of plants with narrow leaves. Covers large areas of the Earth\'s surface and includes important crops like wheat, rice, and corn.',
  forest: 'A large area dominated by trees. Earth\'s largest terrestrial ecosystem, vital for oxygen production and biodiversity.',
  garden: 'An area of land where plants, flowers, or vegetables are cultivated. A blend of nature and human care.',
  egg: 'An organic vessel containing an embryo. Laid by birds, reptiles, amphibians, and some mammals.',
  beast: 'A large terrestrial animal, especially a mammal. Represents the wild animal kingdom.',
  fish: 'An aquatic animal with gills, fins, and typically a body covered in scales. One of the most diverse vertebrate groups.',
  bird: 'A warm-blooded vertebrate with feathers, wings, and a beak. The only animals with feathers.',
  insect: 'A small arthropod with six legs, a three-part body, and often wings. The most diverse group of animals on Earth.',
  reptile: 'A cold-blooded vertebrate with scales. Includes snakes, lizards, turtles, crocodiles, and dinosaurs.',
  mammal: 'A warm-blooded vertebrate with hair or fur. Females produce milk to nourish their young. Includes humans, whales, and many others.',
  science: 'The systematic study of the natural world through observation, experimentation, and evidence-based reasoning.',
  chemistry: 'The branch of science that studies the composition, structure, properties, and reactions of matter.',
  physics: 'The branch of science that studies matter, energy, motion, force, and the fundamental laws of the universe.',
  biology: 'The branch of science that studies living organisms, their structure, function, growth, evolution, and distribution.',
  astronomy: 'The branch of science that studies celestial objects, space, and the physical universe beyond Earth\'s atmosphere.',
  medicine: 'The science and practice of diagnosing, treating, and preventing disease and injury.',
  time: 'A fundamental dimension of the universe in which events occur in sequence from the past, through the present, into the future.',
  space: 'The boundless three-dimensional expanse in which all matter exists. Also refers to the region beyond Earth\'s atmosphere.',
  knowledge: 'Facts, information, and understanding acquired through experience, education, or discovery.',
  wisdom: 'The ability to apply knowledge and experience with good judgment.',
  magic: 'The use of supernatural forces, rituals, or mystical energy to influence events. A concept found in mythology and fantasy.',
  dragon: 'A legendary creature resembling a large, fire-breathing reptile. Appears in mythologies across many cultures.',
  electricity: 'A form of energy resulting from the flow of charged particles. Powers modern civilization.',
  computer: 'An electronic device that processes data according to a set of instructions. The foundation of the digital age.',
  internet: 'A global network connecting millions of computers. Enables instant communication and access to information worldwide.',
  robot: 'A machine capable of carrying out actions automatically or by remote control. Often programmable.',
  ai: 'Artificial Intelligence. The simulation of human intelligence by computer systems.',
  sun: 'The star at the center of our solar system. Provides light, heat, and energy essential for life on Earth.',
  moon: 'Earth\'s only natural satellite. Its gravity causes tides and its phases mark the passage of time.',
  star: 'A massive, luminous sphere of plasma held together by its own gravity. The fundamental luminous body of the universe.',
  planet: 'A large celestial body that orbits a star. Does not produce its own light but reflects its star\'s light.',
  galaxy: 'A massive system of stars, gas, dust, and dark matter bound together by gravity. Contains billions of stars.',
  rocket: 'A vehicle propelled by the expulsion of exhaust gases. Used for space travel, satellites, and exploration.',
  astronaut: 'A person trained to travel and work in space. Represents humanity\'s exploration beyond Earth.',
  city: 'A large, densely populated urban settlement. Centers of civilization, culture, economy, and governance.',
  car: 'A wheeled motor vehicle used for transportation. One of the most important inventions of the modern era.',
  tool: 'An instrument or device used to carry out a particular function. The foundation of human technological progress.',
  wheel: 'A circular device that rotates on an axle. One of humanity\'s most important inventions, enabling transport and machinery.',
  food: 'Any substance consumed to provide nutritional support for life. Essential for growth, energy, and survival.',
  bread: 'A staple food made from flour, water, and yeast, baked in an oven. One of the oldest prepared foods.',
  cheese: 'A dairy product made from milk curds. Thousands of varieties exist across different cultures.',
  wine: 'An alcoholic beverage made from fermented grapes. Has been produced for thousands of years.',
  beer: 'One of the oldest alcoholic beverages, made from fermented grains.',
  coffee: 'A caffeinated beverage made from roasted coffee beans. One of the world\'s most popular drinks.',
  tea: 'An aromatic beverage made by steeping cured leaves in hot water. The second most consumed drink after water.',
  chocolate: 'A food product made from roasted cacao beans. A popular treat worldwide.',
  milk: 'A nutrient-rich liquid produced by mammals to feed their young. A common food ingredient.',
  meat: 'The flesh of animals used as food. A major source of protein in the human diet.',
  ocean: 'A vast body of saltwater that covers about 71% of Earth\'s surface. The largest habitat on the planet.',
  mountain: 'A large natural elevation of the Earth\'s surface rising steeply from the surrounding level.',
  river: 'A large natural stream of water flowing through land. Essential for transport, irrigation, and ecosystems.',
  cloud: 'A visible mass of water droplets or ice crystals suspended in the atmosphere. Forms when water vapor condenses.',
  rain: 'Liquid precipitation falling from clouds. Essential for plant growth and fresh water supplies.',
  snow: 'Frozen precipitation in the form of ice crystals. Forms when atmospheric temperatures are below freezing.',
  ice: 'The solid phase of water. Forms when water freezes at or below 0°C (32°F).',
  storm: 'A disturbed state of the atmosphere characterized by strong winds, rain, thunder, and lightning.',
  lightning: 'A massive electrostatic discharge between clouds or between a cloud and the ground. Extremely hot and powerful.',
  wind: 'The natural movement of air caused by differences in atmospheric pressure.',
  volcano: 'A rupture in Earth\'s crust through which lava, ash, and gases erupt. Builds some of Earth\'s most dramatic landforms.',
  earthquake: 'The shaking of Earth\'s surface caused by the sudden release of energy in the crust. Generated by tectonic plate movement.',
  atom: 'The smallest unit of ordinary matter. Consists of a nucleus surrounded by electrons.',
  molecule: 'An electrically neutral group of two or more atoms bonded together.',
  proton: 'A positively charged particle found in the nucleus of an atom. The number of protons defines the element.',
  neutron: 'An electrically neutral particle found in the nucleus of an atom.',
  electron: 'A negatively charged particle that orbits the nucleus of an atom. Responsible for chemical bonding and electricity.',
  nucleus: 'The dense central core of an atom. Contains protons and neutrons.',
  gold: 'A precious yellow metal (Au). Soft, malleable, and resistant to corrosion. Used in jewelry, electronics, and currency.',
  silver: 'A white precious metal (Ag). Excellent electrical conductor. Used in electronics, jewelry, and photography.',
  copper: 'A reddish metal (Cu). Excellent conductor of electricity and heat. Widely used in electrical wiring.',
  iron: 'A strong, magnetic metal (Fe). The most widely used metal, combining with carbon to make steel.',
  steel: 'An alloy of iron and carbon. Strong, durable, and the most important construction and manufacturing material.',
  bronze: 'An alloy of copper and tin. Historically the first alloy developed by humans, ushering in the Bronze Age.',
  plastic: 'A synthetic material made from polymers. Versatile, durable, and widely used in modern manufacturing.',
  concrete: 'A composite building material made from cement, aggregate, and water. The most widely used construction material.',
  paper: 'A thin sheet material made from plant fibers. Used for writing, printing, packaging, and many other purposes.',
  culture: 'The shared customs, arts, social institutions, and achievements of a human group.',
  art: 'The expression of human creativity and imagination through visual, auditory, or performance works.',
  music: 'An art form combining vocal or instrumental sounds to create beauty of form and emotional expression.',
  sport: 'An activity involving physical exertion and skill, often competitive in nature.',
  war: 'A state of armed conflict between groups or nations. A destructive aspect of human history and society.',
  peace: 'A state of harmony, free from conflict, war, or violence. A fundamental goal of human civilization.',
  love: 'A profound, tender affection for another person. One of the most powerful human emotions.',
  honey: 'A sweet, viscous food substance produced by bees from flower nectar. The only food that never spoils.',
  sugar: 'A sweet crystalline substance derived from sugarcane or sugar beets. A fundamental food ingredient.',
  salt: 'A crystalline compound (NaCl) essential for life. Used for flavoring and preserving food throughout history.',
  society: 'A community of people sharing a common culture, territory, and institutions.',
  democracy: 'A system of government in which citizens elect their leaders. A cornerstone of modern political systems.',
  government: 'The governing body of a nation, state, or community. Responsible for making and enforcing laws.',
  law: 'A system of rules recognized by a government as regulating the actions of members of a society.',
  nation: 'A large community of people united by common history, culture, or language, inhabiting a particular territory.',
  civilization: 'An advanced state of human society with developed culture, government, writing, and technology.',
  history: 'The study of past events, particularly in human affairs. Records our collective journey as a species.',
  bone: 'A rigid organ that forms part of the internal skeleton. Provides structure, protection, and enables movement.',
  blood: 'A red fluid that circulates through the heart and blood vessels. Transports oxygen and nutrients.',
  brain: 'An organ that serves as the center of the nervous system. The seat of consciousness, thought, and emotion.',
  ecosystem: 'A community of living organisms interacting with their physical environment. Nature\'s integrated system.',
  fossil: 'The preserved remains or traces of ancient organisms. Key evidence for understanding evolution and Earth\'s history.',
  coal: 'A combustible black or dark brown rock formed from fossilized plant matter. Used as a fuel source.',
  oil: 'A viscous liquid petroleum formed from ancient organic matter. A major energy source and raw material.',
  gas: 'A flammable gaseous fuel derived from petroleum. Used for heating, cooking, and power generation.',
  microscope: 'An instrument that uses lenses to magnify small objects. Reveals the microscopic world of cells and microorganisms.',
  telescope: 'An instrument that collects and magnifies light from distant objects. Reveals the wonders of the cosmos.',
  lens: 'A curved transparent material that focuses or disperses light. The fundamental component of optical instruments.',
  laboratory: 'A controlled environment for scientific experiments and research. Where discoveries are made.',
  bacteria: 'A single-celled microorganism. The most abundant form of life on Earth, found in virtually every environment.',
  virus: 'A microscopic infective agent that replicates inside living cells. Can cause disease but also used in gene therapy.',
  genetics: 'The study of genes, genetic variation, and heredity in living organisms. Explains how traits are inherited.',
  dna: 'Deoxyribonucleic acid. The molecule that carries the genetic instructions for all known living organisms.',
  gene: 'A unit of heredity passed from parent to offspring. A segment of DNA that codes for a specific trait.',
  climate: 'The long-term pattern of weather conditions in a region. Shaped by temperature, precipitation, and atmospheric patterns.',
  earth_planet: 'The third planet from the Sun. The only known planet to harbor life, with a unique atmosphere and abundant water.',
  hydrogen: 'The simplest and most abundant element in the universe. Consists of one proton and one electron. A key component of stars and water.',
}

// Apply descriptions to any elements that have them defined
Object.entries(ELEMENT_DESCRIPTIONS).forEach(([id, desc]) => {
  if (E[id]) E[id].description = desc
})

// Auto-generate description for any element that still lacks one
Object.keys(E).forEach(id => {
  if (E[id].description) return
  const el = E[id]
  const cat = el.category || ''
  if (cat === 'Concept' || cat === 'Auto') {
    E[id].description = `${el.name}. An intermediate concept discovered through combination.`
  } else {
    E[id].description = `${el.name}. An element from the ${cat} category.`
  }
})

// Complete the catalog from authored recipe references before validating the
// curated modules. Curated entries may use these established intermediates,
// but they are not allowed to invent additional element IDs.
Object.values(R).forEach(recipe => {
  [recipe.a, recipe.b, recipe.result].forEach(id => {
    if (!E[id]) {
      el(id, id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' '), '🔮', 'Concept', ['concept'])
    }
  })
})

for (const [id, [name, description]] of Object.entries(auditedElementUpdates)) {
  if (!E[id]) throw new Error(`Gameplay audit could not update missing element ${id}`)
  E[id].name = name
  E[id].description = description
}

const CURATED_RECIPE_GROUPS = [
  ['foundation-a', foundationRecipesA],
  ['foundation-b', foundationRecipesB],
  ['foundation-core', foundationRecipesCore],
  ['foundation-domain', foundationRecipesDomain],
  ['periodic-table', periodicRecipes],
  ['periodic-uses', periodicUseRecipes],
]

// The earlier catalog expansion assigned unused input pairs to periodic
// elements only to make them reachable. Remove those arbitrary associations;
// the curated periodic set below is the sole discovery path for all 118
// chemical elements.
const periodicResultIds = new Set(periodicRecipes.map(recipe => recipe.result))
for (const [key, recipe] of Object.entries(R)) {
  if (periodicResultIds.has(recipe.result)) delete R[key]
}

// Curated recipes replace the old self-producing reachability fallbacks. Never
// let a curated pair silently displace an existing authored result: a pair can
// only be enriched when both definitions already produce the same element.
for (const [groupName, recipes] of CURATED_RECIPE_GROUPS) {
  for (const recipe of recipes) {
    const { a, b, result, type, explanation, quality = 'reasonable' } = recipe
    if (![a, b, result, type, explanation].every(value => (
      typeof value === 'string' && value.trim().length > 0
    ))) {
      throw new Error(`Invalid curated recipe in ${groupName}: ${JSON.stringify(recipe)}`)
    }
    if (!RECIPE_TYPES.has(type)) {
      throw new Error(`Invalid curated recipe type in ${groupName}: ${type}`)
    }
    if (result === a || result === b) {
      throw new Error(`Self-producing curated recipe in ${groupName}: ${a} + ${b} -> ${result}`)
    }
    const missingIds = [a, b, result].filter(id => !E[id])
    if (missingIds.length > 0) {
      throw new Error(
        `Unknown curated recipe ID in ${groupName}: ${missingIds.join(', ')} (${a} + ${b} -> ${result})`,
      )
    }

    const key = sortKey(a, b)
    const existing = R[key]
    if (existing && existing.result !== result) {
      throw new Error(
        `Curated recipe conflict at ${key}: ${existing.result} vs ${result} (${groupName})`,
      )
    }
    if (existing) {
      existing.type = type
      if (explanation) existing.explanation = explanation
      continue
    }

    re(a, b, result, quality, type, explanation)
  }
}

// Second description pass — cover Concept and Auto elements created above
Object.keys(E).forEach(id => {
  if (E[id].description) return
  const cat = E[id].category || ''
  if (cat === 'Concept' || cat === 'Auto') {
    E[id].description = `${E[id].name}. An intermediate concept discovered through combination.`
  } else {
    E[id].description = `${E[id].name}. An element from the ${cat} category.`
  }
})

const elementIds = Object.keys(E)
const recipeKeys = Object.keys(R)
const categories = [...new Set(elementIds.map(id => E[id].category))].sort()

const integrityFailures = []
for (const key of recipeKeys) {
  const recipe = R[key]
  const expectedKey = sortKey(recipe.a, recipe.b)
  if (key !== expectedKey) integrityFailures.push(`${key} is not canonical (${expectedKey})`)
  if (![recipe.a, recipe.b, recipe.result].every(id => E[id])) {
    integrityFailures.push(`${key} references an unknown element`)
  }
  if (recipe.result === recipe.a || recipe.result === recipe.b) {
    integrityFailures.push(`${key} is self-producing (${recipe.result})`)
  }
  if (!RECIPE_TYPES.has(recipe.type)) {
    integrityFailures.push(`${key} has invalid type ${JSON.stringify(recipe.type)}`)
  }
}

for (const [groupName, recipes] of CURATED_RECIPE_GROUPS) {
  for (const recipe of recipes) {
    const key = sortKey(recipe.a, recipe.b)
    const compiledRecipe = R[key]
    if (
      !compiledRecipe ||
      compiledRecipe.result !== recipe.result ||
      compiledRecipe.type !== recipe.type ||
      compiledRecipe.explanation !== recipe.explanation
    ) {
      integrityFailures.push(`${groupName} recipe was not preserved at ${key}`)
    }
  }
}

const reachableIds = new Set(STARTER_IDS)
let discoveredNewElement = true
while (discoveredNewElement) {
  discoveredNewElement = false
  for (const recipe of Object.values(R)) {
    if (
      reachableIds.has(recipe.a) &&
      reachableIds.has(recipe.b) &&
      !reachableIds.has(recipe.result)
    ) {
      reachableIds.add(recipe.result)
      discoveredNewElement = true
    }
  }
}
const unreachableIds = elementIds.filter(id => !reachableIds.has(id))
if (unreachableIds.length > 0) {
  integrityFailures.push(
    `${unreachableIds.length} unreachable elements: ${unreachableIds.join(', ')}`,
  )
}

if (integrityFailures.length > 0) {
  throw new Error(`Generated content failed integrity checks:\n- ${integrityFailures.join('\n- ')}`)
}

// Count quality
let strong = 0, reasonable = 0
Object.entries(QUALITY).forEach(([id, q]) => {
  if (q === 'strong') strong++
  else if (q === 'reasonable') reasonable++
})

const output = {
  version: 2,
  elements: Object.fromEntries(elementIds.map(id => [id, E[id]])),
  recipes: Object.fromEntries(recipeKeys.map(k => [k, R[k]])),
  categories,
  quality: QUALITY,
  metadata: {
    elementCount: elementIds.length,
    recipeCount: recipeKeys.length,
    categoryCount: categories.length,
    strongRecipes: strong,
    reasonableRecipes: reasonable
  }
}

const outPath = resolve(__dirname, '../src/data/compiled.json')
writeFileSync(outPath, JSON.stringify(output, null, 2))
console.log(`Generated ${elementIds.length} elements, ${recipeKeys.length} recipes, ${categories.length} categories`)
console.log(`Quality: ${strong} strong, ${reasonable} reasonable`)
console.log(`Output: ${outPath}`)
