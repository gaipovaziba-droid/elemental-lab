import { readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { foundationRecipesCore } from './content/foundation-recipes-core.js'
import { foundationRecipesA } from './content/foundation-recipes-a.js'
import { foundationRecipesB } from './content/foundation-recipes-b.js'
import { foundationRecipesDomain } from './content/foundation-recipes-domain.js'
import { periodicRecipes } from './content/periodic-recipes.js'
import { periodicUseRecipes } from './content/periodic-use-recipes.js'

const STARTER_IDS = ['water', 'fire', 'air', 'earth']
const RECIPE_TYPES = [
  'chemical',
  'physical',
  'biological',
  'industrial',
  'environmental',
  'technological',
  'conceptual',
]
const REQUIRED_ELEMENT_STRING_FIELDS = [
  'id',
  'name',
  'emoji',
  'category',
  'description',
]
const SAMPLE_LIMIT = 16
const MAX_DESCRIPTION_LENGTH = 180
const REJECTED_LITERAL_RECIPES = [
  ['coal', 'pressure', 'oil'],
  ['coal', 'pressure', 'diamond'],
  ['sulfur', 'oxygen', 'acid'],
  ['bacteria', 'disease', 'virus'],
  ['life', 'microscope', 'dna'],
  ['dna', 'time', 'gene'],
  ['air', 'metal', 'electricity'],
  ['fire', 'metal', 'engine'],
  ['fire', 'stone', 'metal'],
  ['energy', 'glass', 'lamp'],
  ['cell', 'water', 'blood'],
]
const CURATED_RECIPE_SOURCES = [
  { name: 'foundation-recipes-core.js', recipes: foundationRecipesCore },
  { name: 'foundation-recipes-a.js', recipes: foundationRecipesA },
  { name: 'foundation-recipes-b.js', recipes: foundationRecipesB },
  { name: 'foundation-recipes-domain.js', recipes: foundationRecipesDomain },
  { name: 'periodic-recipes.js', recipes: periodicRecipes },
  { name: 'periodic-use-recipes.js', recipes: periodicUseRecipes },
]

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const defaultContentPath = resolve(projectRoot, 'src/data/compiled.json')
const contentPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : defaultContentPath

const failures = []

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function canonicalPair(a, b) {
  return [a, b].sort().join('+')
}

function percentage(count, total) {
  return total === 0 ? '0.00%' : `${((count / total) * 100).toFixed(2)}%`
}

function sample(values, formatter = String) {
  if (values.length === 0) return 'none'
  const shown = values.slice(0, SAMPLE_LIMIT).map(formatter)
  const omitted = values.length - shown.length
  return `${shown.join(', ')}${omitted > 0 ? `, ... (+${omitted} more)` : ''}`
}

function compactValue(value, maxLength = 96) {
  const rendered = JSON.stringify(value)
  if (rendered === undefined) return String(value)
  if (rendered.length <= maxLength) return rendered
  return `${rendered.slice(0, maxLength - 1)}…`
}

function failWhen(condition, message) {
  if (condition) failures.push(message)
}

function skipWhitespace(source, start) {
  let index = start
  while (/\s/.test(source[index] ?? '')) index += 1
  return index
}

function jsonStringEnd(source, start) {
  if (source[start] !== '"') throw new Error(`Expected JSON string at offset ${start}`)
  let index = start + 1
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2
      continue
    }
    if (source[index] === '"') return index + 1
    index += 1
  }
  throw new Error(`Unterminated JSON string at offset ${start}`)
}

function compositeValueEnd(source, start) {
  const opening = source[start]
  const expectedClosing = opening === '{' ? '}' : ']'
  const stack = [expectedClosing]
  let index = start + 1

  while (index < source.length) {
    const character = source[index]
    if (character === '"') {
      index = jsonStringEnd(source, index)
      continue
    }
    if (character === '{') stack.push('}')
    else if (character === '[') stack.push(']')
    else if (character === '}' || character === ']') {
      const expected = stack.pop()
      if (character !== expected) {
        throw new Error(`Mismatched JSON delimiter at offset ${index}`)
      }
      if (stack.length === 0) return index + 1
    }
    index += 1
  }

  throw new Error(`Unterminated JSON value at offset ${start}`)
}

function jsonValueEnd(source, start) {
  const character = source[start]
  if (character === '"') return jsonStringEnd(source, start)
  if (character === '{' || character === '[') return compositeValueEnd(source, start)

  let index = start
  while (index < source.length && source[index] !== ',' && source[index] !== '}') {
    index += 1
  }
  return index
}

// JSON.parse keeps only the final occurrence of a duplicate object key. Read the
// direct entries of the recipes object as well so exact duplicate keys and
// conflicts remain detectable in generated JSON.
function readRawRecipeEntries(source) {
  const propertyToken = '"recipes"'
  let propertyIndex = source.indexOf(propertyToken)
  let objectStart = -1

  while (propertyIndex !== -1) {
    let index = skipWhitespace(source, propertyIndex + propertyToken.length)
    if (source[index] === ':') {
      index = skipWhitespace(source, index + 1)
      if (source[index] === '{') {
        objectStart = index
        break
      }
    }
    propertyIndex = source.indexOf(propertyToken, propertyIndex + propertyToken.length)
  }

  if (objectStart === -1) throw new Error('Could not locate the recipes object')

  const entries = []
  let index = objectStart + 1
  while (index < source.length) {
    index = skipWhitespace(source, index)
    if (source[index] === '}') return entries
    if (source[index] === ',') {
      index += 1
      continue
    }
    if (source[index] !== '"') {
      throw new Error(`Expected recipe key at offset ${index}`)
    }

    const keyEnd = jsonStringEnd(source, index)
    const key = JSON.parse(source.slice(index, keyEnd))
    index = skipWhitespace(source, keyEnd)
    if (source[index] !== ':') {
      throw new Error(`Expected ':' after recipe key ${key}`)
    }

    index = skipWhitespace(source, index + 1)
    const valueEnd = jsonValueEnd(source, index)
    const recipe = JSON.parse(source.slice(index, valueEnd))
    entries.push({ key, recipe })
    index = valueEnd
  }

  throw new Error('Unterminated recipes object')
}

function calculateDiscoveryDepths(elementIds, recipes) {
  const depths = new Map()
  for (const starter of STARTER_IDS) {
    if (elementIds.has(starter)) depths.set(starter, 0)
  }

  let changed = true
  while (changed) {
    changed = false
    const updates = new Map()

    for (const recipe of recipes) {
      if (!depths.has(recipe.a) || !depths.has(recipe.b)) continue
      const candidate = Math.max(depths.get(recipe.a), depths.get(recipe.b)) + 1
      const current = updates.has(recipe.result)
        ? updates.get(recipe.result)
        : depths.get(recipe.result)
      if (current === undefined || candidate < current) {
        updates.set(recipe.result, candidate)
      }
    }

    for (const [elementId, depth] of updates) {
      if (!depths.has(elementId) || depth < depths.get(elementId)) {
        depths.set(elementId, depth)
        changed = true
      }
    }
  }

  return depths
}

function circularComponents(nodes, adjacency) {
  let nextIndex = 0
  const nodeIndex = new Map()
  const lowLink = new Map()
  const stack = []
  const onStack = new Set()
  const components = []

  function connect(node) {
    nodeIndex.set(node, nextIndex)
    lowLink.set(node, nextIndex)
    nextIndex += 1
    stack.push(node)
    onStack.add(node)

    const neighbors = [...(adjacency.get(node) ?? [])].sort()
    for (const neighbor of neighbors) {
      if (!nodeIndex.has(neighbor)) {
        connect(neighbor)
        lowLink.set(node, Math.min(lowLink.get(node), lowLink.get(neighbor)))
      } else if (onStack.has(neighbor)) {
        lowLink.set(node, Math.min(lowLink.get(node), nodeIndex.get(neighbor)))
      }
    }

    if (lowLink.get(node) !== nodeIndex.get(node)) return

    const component = []
    let member
    do {
      member = stack.pop()
      onStack.delete(member)
      component.push(member)
    } while (member !== node)

    component.sort()
    if (
      component.length > 1 ||
      (component.length === 1 && adjacency.get(component[0])?.has(component[0]))
    ) {
      components.push(component)
    }
  }

  for (const node of [...nodes].sort()) {
    if (!nodeIndex.has(node)) connect(node)
  }

  return components.sort((left, right) => (
    right.length - left.length || left.join(',').localeCompare(right.join(','))
  ))
}

let rawContent
let content
try {
  rawContent = readFileSync(contentPath, 'utf8')
  content = JSON.parse(rawContent)
} catch (error) {
  console.error(`Content validation failed: ${error.message}`)
  process.exit(1)
}

if (!isObject(content.elements) || !isObject(content.recipes)) {
  console.error('Content validation failed: compiled data must contain elements and recipes objects')
  process.exit(1)
}

let rawRecipeEntries
try {
  rawRecipeEntries = readRawRecipeEntries(rawContent)
} catch (error) {
  console.error(`Content validation failed while scanning recipe pairs: ${error.message}`)
  process.exit(1)
}

const elementEntries = Object.entries(content.elements)
const elementIds = new Set(elementEntries.map(([id]) => id))
const runtimeRecipeEntries = Object.entries(content.recipes).map(([key, recipe]) => ({
  key,
  recipe,
}))

const curatedCollectionErrors = []
const curatedEntries = []
for (const source of CURATED_RECIPE_SOURCES) {
  if (!Array.isArray(source.recipes)) {
    curatedCollectionErrors.push(`${source.name} exports ${typeof source.recipes}, expected an array`)
    continue
  }

  source.recipes.forEach((recipe, index) => {
    curatedEntries.push({
      source: source.name,
      index,
      location: `${source.name}[${index}]`,
      recipe,
    })
  })
}

const curatedInvalidShapes = []
const curatedInvalidTypes = []
const curatedMissingExplanations = []
const curatedPairOwners = new Map()
const curatedMissingCompiledPairs = []
const curatedResultMismatches = []
const curatedTypeMismatches = []
const curatedExplanationMismatches = []
let curatedValidEntries = 0
let curatedCompiledMatches = 0

for (const entry of curatedEntries) {
  const { location, recipe } = entry
  const validShape = (
    isObject(recipe) &&
    isNonEmptyString(recipe.a) &&
    isNonEmptyString(recipe.b) &&
    isNonEmptyString(recipe.result)
  )

  if (!validShape) {
    curatedInvalidShapes.push(location)
    continue
  }

  const pair = canonicalPair(recipe.a, recipe.b)
  if (!curatedPairOwners.has(pair)) curatedPairOwners.set(pair, [])
  curatedPairOwners.get(pair).push(entry)

  const validType = isNonEmptyString(recipe.type) && RECIPE_TYPES.includes(recipe.type)
  const validExplanation = isNonEmptyString(recipe.explanation)
  if (!validType) {
    curatedInvalidTypes.push(`${location} (${pair}) -> ${compactValue(recipe.type)}`)
  }
  if (!validExplanation) {
    curatedMissingExplanations.push(`${location} (${pair})`)
  }
  if (validType && validExplanation) curatedValidEntries += 1

  const compiledRecipe = content.recipes[pair]
  if (!isObject(compiledRecipe)) {
    curatedMissingCompiledPairs.push(`${location} (${pair})`)
    continue
  }

  const resultMatches = compiledRecipe.result === recipe.result
  const typeMatches = compiledRecipe.type === recipe.type
  const explanationMatches = compiledRecipe.explanation === recipe.explanation

  if (!resultMatches) {
    curatedResultMismatches.push(
      `${location} (${pair}): expected ${compactValue(recipe.result)}, compiled ${compactValue(compiledRecipe.result)}`,
    )
  }
  if (!typeMatches) {
    curatedTypeMismatches.push(
      `${location} (${pair}): expected ${compactValue(recipe.type)}, compiled ${compactValue(compiledRecipe.type)}`,
    )
  }
  if (!explanationMatches) {
    curatedExplanationMismatches.push(
      `${location} (${pair}): expected ${compactValue(recipe.explanation)}, compiled ${compactValue(compiledRecipe.explanation)}`,
    )
  }
  if (resultMatches && typeMatches && explanationMatches) curatedCompiledMatches += 1
}

const curatedDuplicatePairs = [...curatedPairOwners.entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([pair, entries]) => (
    `${pair}: ${entries
      .map(entry => `${entry.location} -> ${entry.recipe.result}`)
      .join(' | ')}`
  ))

const missingStarters = STARTER_IDS.filter(id => !elementIds.has(id))
const invalidRecipeShapes = []
const badReferences = []
const unsortedKeys = []
const selfProducingRecipes = []
const graphRecipes = []

for (const { key, recipe } of runtimeRecipeEntries) {
  if (
    !isObject(recipe) ||
    !isNonEmptyString(recipe.a) ||
    !isNonEmptyString(recipe.b) ||
    !isNonEmptyString(recipe.result)
  ) {
    invalidRecipeShapes.push(key)
    continue
  }

  const expectedKey = canonicalPair(recipe.a, recipe.b)
  if (key !== expectedKey) unsortedKeys.push(`${key} (expected ${expectedKey})`)
  if (recipe.result === recipe.a || recipe.result === recipe.b) {
    selfProducingRecipes.push(`${key} -> ${recipe.result}`)
  }

  for (const field of ['a', 'b', 'result']) {
    if (!elementIds.has(recipe[field])) {
      badReferences.push(`${key}.${field} -> ${recipe[field]}`)
    }
  }

  if (
    elementIds.has(recipe.a) &&
    elementIds.has(recipe.b) &&
    elementIds.has(recipe.result)
  ) {
    graphRecipes.push(recipe)
  }
}

const rawKeys = new Map()
const rawCanonicalPairs = new Map()
for (const entry of rawRecipeEntries) {
  if (!rawKeys.has(entry.key)) rawKeys.set(entry.key, [])
  rawKeys.get(entry.key).push(entry)

  if (
    isObject(entry.recipe) &&
    isNonEmptyString(entry.recipe.a) &&
    isNonEmptyString(entry.recipe.b)
  ) {
    const pair = canonicalPair(entry.recipe.a, entry.recipe.b)
    if (!rawCanonicalPairs.has(pair)) rawCanonicalPairs.set(pair, [])
    rawCanonicalPairs.get(pair).push(entry)
  }
}

const duplicateRawKeys = [...rawKeys.entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([key, entries]) => `${key} (${entries.length} occurrences)`)

const duplicatePairs = []
const conflictingPairs = []
for (const [pair, entries] of rawCanonicalPairs) {
  if (entries.length < 2) continue
  const results = new Set(entries.map(entry => entry.recipe?.result))
  const detail = `${pair} -> ${[...results].sort().join(' | ')}`
  if (results.size > 1) conflictingPairs.push(detail)
  else duplicatePairs.push(`${detail} (${entries.length} occurrences)`)
}

const depths = calculateDiscoveryDepths(elementIds, graphRecipes)
const unreachableIds = [...elementIds].filter(id => !depths.has(id)).sort()
const unreachableSet = new Set(unreachableIds)
const depthDistribution = new Map()
for (const depth of depths.values()) {
  depthDistribution.set(depth, (depthDistribution.get(depth) ?? 0) + 1)
}
const maxDepth = depths.size > 0 ? Math.max(...depths.values()) : null
const deepestElements = maxDepth === null
  ? []
  : [...depths.entries()]
    .filter(([, depth]) => depth === maxDepth)
    .map(([id]) => id)
    .sort()

const unreachableAdjacency = new Map(unreachableIds.map(id => [id, new Set()]))
for (const recipe of graphRecipes) {
  if (!unreachableSet.has(recipe.result)) continue
  for (const input of [recipe.a, recipe.b]) {
    if (unreachableSet.has(input)) {
      unreachableAdjacency.get(input).add(recipe.result)
    }
  }
}
const dependencyCycles = circularComponents(unreachableIds, unreachableAdjacency)
const elementsInCycles = new Set(dependencyCycles.flat())

const taxonomyCounts = Object.fromEntries(RECIPE_TYPES.map(type => [type, 0]))
const missingRecipeTypes = []
const invalidRecipeTypes = []
for (const { key, recipe } of runtimeRecipeEntries) {
  if (!isObject(recipe) || !hasOwn(recipe, 'type') || !isNonEmptyString(recipe.type)) {
    missingRecipeTypes.push(key)
  } else if (!RECIPE_TYPES.includes(recipe.type)) {
    invalidRecipeTypes.push(`${key} -> ${JSON.stringify(recipe.type)}`)
  } else {
    taxonomyCounts[recipe.type] += 1
  }
}

const missingElementFields = Object.fromEntries(
  REQUIRED_ELEMENT_STRING_FIELDS.map(field => [field, []]),
)
const invalidElementTags = []
const mismatchedElementIds = []
const overlongDescriptions = []
for (const [key, element] of elementEntries) {
  if (!isObject(element)) {
    for (const field of REQUIRED_ELEMENT_STRING_FIELDS) missingElementFields[field].push(key)
    invalidElementTags.push(key)
    continue
  }

  for (const field of REQUIRED_ELEMENT_STRING_FIELDS) {
    if (!isNonEmptyString(element[field])) missingElementFields[field].push(key)
  }
  if (element.id !== key) mismatchedElementIds.push(`${key} -> ${JSON.stringify(element.id)}`)
  if (
    isNonEmptyString(element.description) &&
    [...element.description.trim()].length > MAX_DESCRIPTION_LENGTH
  ) {
    overlongDescriptions.push(`${key} (${[...element.description.trim()].length} characters)`)
  }
  if (!Array.isArray(element.tags) || element.tags.some(tag => !isNonEmptyString(tag))) {
    invalidElementTags.push(key)
  }
}

const rejectedLiteralRecipes = REJECTED_LITERAL_RECIPES
  .filter(([a, b, result]) => content.recipes[canonicalPair(a, b)]?.result === result)
  .map(([a, b, result]) => `${a} + ${b} -> ${result}`)

const actualCategories = new Set(
  elementEntries
    .map(([, element]) => element?.category)
    .filter(isNonEmptyString),
)
const listedCategories = Array.isArray(content.categories) ? content.categories : []
const invalidListedCategories = listedCategories.filter(category => !isNonEmptyString(category))
const duplicateListedCategories = listedCategories.filter(
  (category, index) => listedCategories.indexOf(category) !== index,
)
const listedCategorySet = new Set(listedCategories.filter(isNonEmptyString))
const categoriesMissingFromIndex = [...actualCategories]
  .filter(category => !listedCategorySet.has(category))
  .sort()
const unusedListedCategories = [...listedCategorySet]
  .filter(category => !actualCategories.has(category))
  .sort()

const periodicElementEntries = elementEntries
  .filter(([id, element]) => (
    id.startsWith('element_') ||
    (isObject(element) && hasOwn(element, 'atomicNumber'))
  ))
const periodicElementIds = new Set(periodicElementEntries.map(([id]) => id))
const periodicElements = periodicElementEntries
  .map(([, element]) => element)
const curatedPeriodicPairs = new Set(
  periodicRecipes.map(recipe => canonicalPair(recipe.a, recipe.b)),
)
const compiledPeriodicRecipes = runtimeRecipeEntries.filter(({ recipe }) => (
  isObject(recipe) && periodicElementIds.has(recipe.result)
))
const unexpectedPeriodicRecipes = compiledPeriodicRecipes
  .filter(({ key }) => !curatedPeriodicPairs.has(key))
  .map(({ key, recipe }) => `${key} -> ${recipe.result}`)
const periodicMissingSymbols = []
const periodicMissingAtomicNumbers = []
const periodicMissingChemicalGroups = []
const periodicByAtomicNumber = new Map()
const periodicBySymbol = new Map()

for (const element of periodicElements) {
  const id = element?.id ?? '(missing id)'
  if (!isNonEmptyString(element?.symbol)) {
    periodicMissingSymbols.push(id)
  } else {
    const symbolKey = element.symbol.toLowerCase()
    if (!periodicBySymbol.has(symbolKey)) periodicBySymbol.set(symbolKey, [])
    periodicBySymbol.get(symbolKey).push(id)
  }

  if (
    !Number.isInteger(element?.atomicNumber) ||
    element.atomicNumber < 1 ||
    element.atomicNumber > 118
  ) {
    periodicMissingAtomicNumbers.push(id)
  } else {
    if (!periodicByAtomicNumber.has(element.atomicNumber)) {
      periodicByAtomicNumber.set(element.atomicNumber, [])
    }
    periodicByAtomicNumber.get(element.atomicNumber).push(id)
  }

  if (!isNonEmptyString(element?.chemicalGroup)) {
    periodicMissingChemicalGroups.push(id)
  }
}

const missingAtomicNumbers = Array.from({ length: 118 }, (_, index) => index + 1)
  .filter(number => !periodicByAtomicNumber.has(number))
const duplicateAtomicNumbers = [...periodicByAtomicNumber.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([number, ids]) => `${number}: ${ids.join(' | ')}`)
const duplicatePeriodicSymbols = [...periodicBySymbol.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([symbol, ids]) => `${symbol}: ${ids.join(' | ')}`)
const periodicChemicalGroups = new Set(
  periodicElements
    .map(element => element?.chemicalGroup)
    .filter(isNonEmptyString),
)

console.log(`Elemental Lab content validation: ${relative(projectRoot, contentPath) || contentPath}`)

console.log('\nCurated recipe integration')
for (const source of CURATED_RECIPE_SOURCES) {
  const count = Array.isArray(source.recipes) ? source.recipes.length : 'invalid export'
  console.log(`  ${source.name.padEnd(38)}${count}`)
}
console.log(`  Source arrays:        ${CURATED_RECIPE_SOURCES.length}`)
console.log(`  Source entries:       ${curatedEntries.length}`)
console.log(`  Valid entries:        ${curatedValidEntries}`)
console.log(`  Canonical pairs:      ${curatedPairOwners.size}`)
console.log(`  Invalid exports:      ${curatedCollectionErrors.length}`)
console.log(`  Invalid shapes:       ${curatedInvalidShapes.length}`)
console.log(`  Invalid types:        ${curatedInvalidTypes.length}`)
console.log(`  Missing explanations: ${curatedMissingExplanations.length}`)
console.log(`  Duplicate pairs:      ${curatedDuplicatePairs.length}`)
console.log(`  Compiled matches:     ${curatedCompiledMatches}/${curatedEntries.length}`)
console.log(`  Missing compiled:     ${curatedMissingCompiledPairs.length}`)
console.log(`  Result mismatches:    ${curatedResultMismatches.length}`)
console.log(`  Type mismatches:      ${curatedTypeMismatches.length}`)
console.log(`  Explanation mismatch: ${curatedExplanationMismatches.length}`)
console.log(`  Export error sample:  ${sample(curatedCollectionErrors)}`)
console.log(`  Shape error sample:   ${sample(curatedInvalidShapes)}`)
console.log(`  Type error sample:    ${sample(curatedInvalidTypes)}`)
console.log(`  Explanation sample:   ${sample(curatedMissingExplanations)}`)
console.log(`  Duplicate sample:     ${sample(curatedDuplicatePairs)}`)
console.log(`  Missing pair sample:  ${sample(curatedMissingCompiledPairs)}`)
console.log(`  Result sample:        ${sample(curatedResultMismatches)}`)
console.log(`  Type mismatch sample: ${sample(curatedTypeMismatches)}`)
console.log(`  Explanation diff:     ${sample(curatedExplanationMismatches)}`)

console.log('\nProgression')
console.log(`  Total elements:       ${elementIds.size}`)
console.log(`  Reachable:            ${depths.size} (${percentage(depths.size, elementIds.size)})`)
console.log(`  Unreachable:          ${unreachableIds.length} (${percentage(unreachableIds.length, elementIds.size)})`)
console.log(`  Unreachable sample:   ${sample(unreachableIds)}`)
console.log(`  Max discovery depth:  ${maxDepth ?? 'n/a'}`)
console.log(`  Depth distribution:   ${[...depthDistribution.entries()]
  .sort(([left], [right]) => left - right)
  .map(([depth, count]) => `${depth}:${count}`)
  .join(', ') || 'none'}`)
console.log(`  Deepest elements:     ${sample(deepestElements)}`)

console.log('\nRecipe integrity')
console.log(`  Runtime recipe pairs: ${runtimeRecipeEntries.length}`)
console.log(`  Raw recipe entries:   ${rawRecipeEntries.length}`)
console.log(`  Invalid shapes:       ${invalidRecipeShapes.length}`)
console.log(`  Bad references:       ${badReferences.length}`)
console.log(`  Unsorted keys:        ${unsortedKeys.length}`)
console.log(`  Self-producing:       ${selfProducingRecipes.length}`)
console.log(`  Duplicate JSON keys:  ${duplicateRawKeys.length}`)
console.log(`  Duplicate pairs:      ${duplicatePairs.length}`)
console.log(`  Conflicting pairs:    ${conflictingPairs.length}`)
console.log(`  Bad refs sample:      ${sample(badReferences)}`)
console.log(`  Unsorted sample:      ${sample(unsortedKeys)}`)
console.log(`  Self-producing sample:${selfProducingRecipes.length ? ` ${sample(selfProducingRecipes)}` : ' none'}`)
console.log(`  Duplicate sample:     ${sample([...duplicateRawKeys, ...duplicatePairs])}`)
console.log(`  Conflict sample:      ${sample(conflictingPairs)}`)

console.log('\nUnreachable dependency graph')
console.log(`  Circular SCCs:        ${dependencyCycles.length}`)
console.log(`  Elements in SCCs:     ${elementsInCycles.size}`)
console.log(`  Largest SCC size:     ${dependencyCycles[0]?.length ?? 0}`)
console.log(`  SCC sample:           ${sample(
  dependencyCycles,
  component => `[${component.join(' -> ')}]`,
)}`)

console.log('\nRecipe taxonomy')
console.log(`  Allowed values:       ${RECIPE_TYPES.join(', ')}`)
for (const type of RECIPE_TYPES) {
  console.log(
    `  ${type.padEnd(20)}${taxonomyCounts[type]} (${percentage(taxonomyCounts[type], runtimeRecipeEntries.length)})`,
  )
}
console.log(`  Missing:              ${missingRecipeTypes.length} (${percentage(missingRecipeTypes.length, runtimeRecipeEntries.length)})`)
console.log(`  Invalid:              ${invalidRecipeTypes.length}`)
console.log(`  Missing sample:       ${sample(missingRecipeTypes)}`)
console.log(`  Invalid sample:       ${sample(invalidRecipeTypes)}`)

console.log('\nElement schema and categories')
console.log(`  Indexed categories:   ${listedCategorySet.size}`)
console.log(`  Actual categories:    ${actualCategories.size}`)
for (const field of REQUIRED_ELEMENT_STRING_FIELDS) {
  console.log(`  Missing ${field.padEnd(12)}${missingElementFields[field].length}`)
}
console.log(`  Invalid tags:         ${invalidElementTags.length}`)
console.log(`  ID/key mismatches:    ${mismatchedElementIds.length}`)
console.log(`  Over ${MAX_DESCRIPTION_LENGTH} chars:      ${overlongDescriptions.length}`)
console.log(`  Missing field sample: ${sample(
  REQUIRED_ELEMENT_STRING_FIELDS.flatMap(field => (
    missingElementFields[field].map(id => `${id}.${field}`)
  )),
)}`)
console.log(`  Category index gaps:  ${sample(categoriesMissingFromIndex)}`)
console.log(`  Unused categories:    ${sample(unusedListedCategories)}`)

console.log('\nScientific audit sentinels')
console.log(`  Rejected literals:    ${rejectedLiteralRecipes.length}`)
console.log(`  Rejected sample:      ${sample(rejectedLiteralRecipes)}`)

console.log('\nPeriodic table')
console.log(`  Periodic elements:    ${periodicElements.length}/118`)
console.log(`  Discovery recipes:    ${compiledPeriodicRecipes.length}/118`)
console.log(`  Uncurated recipes:    ${unexpectedPeriodicRecipes.length}`)
console.log(`  Complete symbols:     ${periodicElements.length - periodicMissingSymbols.length}/118`)
console.log(`  Complete atomic nums: ${periodicElements.length - periodicMissingAtomicNumbers.length}/118`)
console.log(`  Complete groups:      ${periodicElements.length - periodicMissingChemicalGroups.length}/118`)
console.log(`  Chemical groups:      ${periodicChemicalGroups.size}`)
console.log(`  Missing numbers:      ${sample(missingAtomicNumbers)}`)
console.log(`  Duplicate numbers:    ${sample(duplicateAtomicNumbers)}`)
console.log(`  Duplicate symbols:    ${sample(duplicatePeriodicSymbols)}`)
console.log(`  Metadata gaps:        ${sample([
  ...periodicMissingSymbols.map(id => `${id}.symbol`),
  ...periodicMissingAtomicNumbers.map(id => `${id}.atomicNumber`),
  ...periodicMissingChemicalGroups.map(id => `${id}.chemicalGroup`),
])}`)

failWhen(curatedCollectionErrors.length > 0, `invalid curated recipe exports (${curatedCollectionErrors.length})`)
failWhen(curatedInvalidShapes.length > 0, `invalid curated recipe shapes (${curatedInvalidShapes.length})`)
failWhen(curatedInvalidTypes.length > 0, `curated recipes with invalid taxonomy (${curatedInvalidTypes.length})`)
failWhen(curatedMissingExplanations.length > 0, `curated recipes missing explanations (${curatedMissingExplanations.length})`)
failWhen(curatedDuplicatePairs.length > 0, `duplicate curated canonical pairs (${curatedDuplicatePairs.length})`)
failWhen(curatedMissingCompiledPairs.length > 0, `curated recipes missing from compiled content (${curatedMissingCompiledPairs.length})`)
failWhen(curatedResultMismatches.length > 0, `curated compiled result mismatches (${curatedResultMismatches.length})`)
failWhen(curatedTypeMismatches.length > 0, `curated compiled type mismatches (${curatedTypeMismatches.length})`)
failWhen(curatedExplanationMismatches.length > 0, `curated compiled explanation mismatches (${curatedExplanationMismatches.length})`)
failWhen(elementIds.size === 0, 'no elements found')
failWhen(runtimeRecipeEntries.length === 0, 'no recipes found')
failWhen(missingStarters.length > 0, `missing starters (${missingStarters.length})`)
failWhen(unreachableIds.length > 0, `unreachable elements (${unreachableIds.length})`)
failWhen(invalidRecipeShapes.length > 0, `invalid recipe shapes (${invalidRecipeShapes.length})`)
failWhen(badReferences.length > 0, `bad recipe references (${badReferences.length})`)
failWhen(unsortedKeys.length > 0, `unsorted recipe keys (${unsortedKeys.length})`)
failWhen(selfProducingRecipes.length > 0, `self-producing recipes (${selfProducingRecipes.length})`)
failWhen(duplicateRawKeys.length > 0, `duplicate JSON recipe keys (${duplicateRawKeys.length})`)
failWhen(duplicatePairs.length > 0, `duplicate canonical pairs (${duplicatePairs.length})`)
failWhen(conflictingPairs.length > 0, `conflicting canonical pairs (${conflictingPairs.length})`)
failWhen(dependencyCycles.length > 0, `circular unreachable dependency components (${dependencyCycles.length})`)
failWhen(missingRecipeTypes.length > 0, `recipes missing taxonomy (${missingRecipeTypes.length})`)
failWhen(invalidRecipeTypes.length > 0, `recipes with invalid taxonomy (${invalidRecipeTypes.length})`)
for (const field of REQUIRED_ELEMENT_STRING_FIELDS) {
  failWhen(
    missingElementFields[field].length > 0,
    `elements missing ${field} (${missingElementFields[field].length})`,
  )
}
failWhen(invalidElementTags.length > 0, `elements with invalid tags (${invalidElementTags.length})`)
failWhen(mismatchedElementIds.length > 0, `element ID/key mismatches (${mismatchedElementIds.length})`)
failWhen(overlongDescriptions.length > 0, `overlong element descriptions (${overlongDescriptions.length})`)
failWhen(rejectedLiteralRecipes.length > 0, `rejected literal recipes returned (${rejectedLiteralRecipes.length})`)
failWhen(!Array.isArray(content.categories), 'categories index is not an array')
failWhen(invalidListedCategories.length > 0, `invalid category names (${invalidListedCategories.length})`)
failWhen(duplicateListedCategories.length > 0, `duplicate indexed categories (${duplicateListedCategories.length})`)
failWhen(categoriesMissingFromIndex.length > 0, `categories missing from index (${categoriesMissingFromIndex.length})`)
failWhen(unusedListedCategories.length > 0, `unused indexed categories (${unusedListedCategories.length})`)
failWhen(periodicElements.length !== 118, `periodic element count is ${periodicElements.length}, expected 118`)
failWhen(compiledPeriodicRecipes.length !== 118, `periodic discovery recipe count is ${compiledPeriodicRecipes.length}, expected 118`)
failWhen(unexpectedPeriodicRecipes.length > 0, `uncurated periodic discovery recipes (${unexpectedPeriodicRecipes.length}): ${sample(unexpectedPeriodicRecipes)}`)
failWhen(periodicMissingSymbols.length > 0, `periodic elements missing symbols (${periodicMissingSymbols.length})`)
failWhen(periodicMissingAtomicNumbers.length > 0, `periodic elements missing/invalid atomic numbers (${periodicMissingAtomicNumbers.length})`)
failWhen(periodicMissingChemicalGroups.length > 0, `periodic elements missing chemical groups (${periodicMissingChemicalGroups.length})`)
failWhen(missingAtomicNumbers.length > 0, `missing atomic numbers (${missingAtomicNumbers.length})`)
failWhen(duplicateAtomicNumbers.length > 0, `duplicate atomic numbers (${duplicateAtomicNumbers.length})`)
failWhen(duplicatePeriodicSymbols.length > 0, `duplicate periodic symbols (${duplicatePeriodicSymbols.length})`)

if (failures.length > 0) {
  console.error(`\nFAILED — ${failures.length} validation check${failures.length === 1 ? '' : 's'}:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log('\nPASSED — content is structurally valid and fully discoverable.')
}
