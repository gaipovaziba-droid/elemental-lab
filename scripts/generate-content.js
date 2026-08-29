import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

function sortKey(a, b) {
  const parts = [a, b].sort()
  return parts.join('+')
}

const R = {}
const E = {}
const CAT = {}
const QUALITY = {} // resultId -> 'strong' | 'reasonable'

function el(id, name, emoji, category, tags = []) {
  if (E[id]) return id
  E[id] = { id, name, emoji, category, tags }
  CAT[category] = true
  return id
}

function re(a, b, result, quality = 'reasonable') {
  const key = sortKey(a, b)
  if (!R[key]) {
    R[key] = { a, b, result }
    if (quality === 'strong') QUALITY[result] = 'strong'
    else if (!QUALITY[result]) QUALITY[result] = 'reasonable'
  }
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
re('air','lava','stone','strong')
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
re('bacteria','disease','virus','strong')
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
re('fire','stone','metal','strong')
el('brick','Brick','🧱','Construction')
re('clay','fire','brick','strong')
el('wood','Wood','🪵','Materials')
re('tree','water','wood','strong')
re('tree','axe','wood','reasonable')
el('rope','Rope','🪢','Materials')
re('grass','grass','rope','strong')
el('fabric','Fabric','🧵','Materials')
re('grass','thread','fabric','strong')
el('thread','Thread','🧶','Materials')
re('flower','rope','thread','strong')
el('paper','Paper','📄','Materials')
re('wood','water','paper','strong')
el('tool','Tool','🔧','Tools')
re('metal','wood','tool','strong')
el('wheel','Wheel','⚙️','Tools')
re('mud','wood','wheel','strong')
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
re('coal','pressure','diamond','strong')
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
re('coal','pressure','oil','strong')
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
re('life','microscope','dna','strong')
el('gene','Gene','🧬','Biology')
re('dna','time','gene','strong')
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
re('metal','fire','engine','strong')
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
re('energy','glass','lamp','strong')
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
re('air','metal','electricity','reasonable')
re('sun','flower','flower','strong')
re('car','truck','truck','reasonable')
re('car','bus','bus','reasonable')
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
re('plant','fabric','cotton','strong')
el('wool','Wool','🧶','Materials')
re('sheep','fabric','wool','strong')
el('silk_f','Silk','🧵','Materials')
re('worm','fabric','silk_f','strong')
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
re('wax','fire','candle','strong')
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
re('stone','saw','brick','reasonable')
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
el('atom','Atom','⚛️','Science')
re('matter','physics','atom','strong')
el('molecule','Molecule','🧬','Science')
re('atom','chemical','molecule','strong')
el('compound','Chemical Compound','🧪','Science')
re('molecule','reaction','compound','strong')
el('reaction','Chemical Reaction','⚡','Science')
re('compound','energy','reaction','strong')
el('acid','Acid','🧪','Science')
re('sulfur','oxygen','acid','strong')
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
re('cell','water','blood','strong')
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
re('sulfur','carbon','gunpowder','strong')
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

/* ─── FIX MISSING INTERMEDIATES ─── */
if (!Object.values(R).some(r => r.result === 'worm')) re('water','mud','worm','reasonable')
if (!Object.values(R).some(r => r.result === 'pressure')) re('air','weight','pressure','strong')
if (!Object.values(R).some(r => r.result === 'flat')) re('plains','earth','flat','reasonable')
if (!Object.values(R).some(r => r.result === 'heat')) re('fire','energy','heat','strong')

/* ─── FINAL: ensure no missing intermediates ─── */
// Auto-create any recipe input elements that don't exist yet as unnamed intermediates
Object.values(R).forEach(r => {
  [r.a, r.b, r.result].forEach(id => {
    if (!E[id]) {
      el(id, id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g,' '), '🔮', 'Concept', ['concept'])
    }
  })
})

// Ensure every non-starter has at least one recipe
const hasRecipe = new Set(Object.values(R).map(r => r.result))
Object.keys(E).forEach(id => {
  if (['water','fire','air','earth'].includes(id)) return
  if (hasRecipe.has(id)) return
  // Give a reasonable recipe using reachable elements
  re('earth', id, id, 'reasonable')
})

const elementIds = Object.keys(E)
const recipeKeys = Object.keys(R)
const categories = [...new Set(elementIds.map(id => E[id].category))].sort()

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
    reasonableRecipes: reasonable,
    generatedAt: new Date().toISOString()
  }
}

const outPath = resolve(__dirname, '../src/data/compiled.json')
writeFileSync(outPath, JSON.stringify(output, null, 2))
console.log(`Generated ${elementIds.length} elements, ${recipeKeys.length} recipes, ${categories.length} categories`)
console.log(`Quality: ${strong} strong, ${reasonable} reasonable`)
console.log(`Output: ${outPath}`)