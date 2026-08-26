# Work Card 03 — Element Catalog, Combination Rules, and Game State

## Goal

Implement the full element catalog (~50 elements), the deterministic combination map, the storage utility, and the game state hook. After this card, the data layer is fully functional — all elements and combinations exist, state loads/saves correctly, and the collection panel is driven by real data.

## Inputs

- `architecture.md` — Data / State Model, Storage Logic, File Expectations
- `build-blueprint.md` — Data / State / Storage Rules, Proof Ladder
- `project-brief.md` — Version-One Success, Now list

## Files likely touched

- `src/data/catalog.js` — full ELEMENT_CATALOG with ~50 elements
- `src/data/combinations.js` — full COMBINATIONS map + `getCombinationResult(a, b)` helper
- `src/utils/storage.js` — real `saveState(state)`, `loadState()`, `clearState()` functions
- `src/hooks/useGameState.js` — real React hook with `discovered`, `addDiscovery`, `reset`, initialization from localStorage
- `src/App.jsx` — wire up `useGameState` hook, pass props to CollectionPanel and Laboratory
- `src/components/CollectionPanel.jsx` — replace hardcoded elements with dynamic render from `discovered` prop
- `src/App.css` — minor adjustments if needed for scrollable collection

## Instructions for the coding agent

1. **catalog.js**: Create and export `ELEMENT_CATALOG` as a flat object. Include all ~50 elements with `id`, `name`, `emoji`. Start with the 4 basics. Organize into tiers so the player progresses logically. Use these tiers as a guide (IDs in parentheses):

   **Tier 0 — Basics (starting):**
   - water 💧, fire 🔥, air 💨, earth 🌍

   **Tier 1 — Simple combinations (2-element combos of basics):**
   - plant 🌱 (earth+water), lava 🌋 (fire+earth), steam ♨️ (fire+water), dust 🏜️ (air+earth), energy ⚡ (air+fire), rain 🌧️ (air+water), mud 🧴 (earth+water) — note: earth+water could yield both plant AND mud — pick plant as primary, or allow multiple results. Keep it simple: one deterministic result per pair.

   **Tier 2 — Nature & environment:**
   - stone 🪨 (lava+air), swamp 🏞️ (mud+plant), grass 🌿 (earth+plant), tree 🌳 (plant+earth), flower 🌸 (plant+energy), forest 🌲 (tree+tree), garden 🪴 (flower+earth)

   **Tier 3 — Materials & substances:**
   - glass 🪟 (sand+fire), metal 🔩 (stone+fire), clay 🏺 (mud+stone), brick 🧱 (clay+fire), paper 📄 (wood+water), rope 🪢 (grass+grass), fabric 🧵 (grass+thread) — if thread not yet in catalog, add thread as combination (plant+rope? keep it simple)

   **Tier 4 — Tools & simple objects:**
   - tool 🔧 (metal+wood), wheel ⚙️ (stone+wood), container 🪣 (clay+fire) or use bucket emoji, knife 🔪 (stone+metal), hammer 🔨 (wood+stone+metal — keep it 2-input), spear 🗡️ (wood+stone)

   **Tier 5 — Living things:**
   - egg 🥚 (life+stone? better to start simpler), bird 🐦 (egg+air), fish 🐟 (water+life?), beast 🐾 (earth+life) — need "life" as an intermediate: life = energy+earth? or swamp+energy? Make life a discoverable element.

   Design a logical, deterministic tree where each element has 1 or 2 parent recipes. ~50 elements total. Ensure no orphan elements (every non-starter has at least one recipe).

   The map keys must be `"sortedIdA+sortedIdB"` (alphabetically sorted, `+` separator).

2. **combinations.js**: Export:
   - `COMBINATIONS` — the full map object
   - `getCombinationResult(a, b)` — sorts the two IDs, looks up the key, returns the result ID or `null`

3. **storage.js**: Export:
   - `STORAGE_KEY = "elemental-lab-state"`
   - `saveState(state)` — `JSON.stringify` + `localStorage.setItem`
   - `loadState()` — `localStorage.getItem` + `JSON.parse`; return `null` on missing/corrupt
   - `clearState()` — `localStorage.removeItem(STORAGE_KEY)`

4. **useGameState.js**: Implement a custom hook that returns:
   - `discovered` — array of element IDs the player has found
   - `addDiscovery(elementId)` — adds to `discovered` if not already present; saves to localStorage
   - `reset()` — clears localStorage, resets `discovered` to the 4 starters
   - `isDiscovered(elementId)` — convenience check
   On mount: try `loadState()`. If valid, use it. Otherwise initialise with `["water","fire","air","earth"]`.

5. **App.jsx**: Import `useGameState`, call it at the top level. Pass `discovered` to `<CollectionPanel>`.

6. **CollectionPanel.jsx**: Accept a `discovered` prop (array of IDs). Map over it, look up each ID in `ELEMENT_CATALOG`, render `<ElementIcon>` for each. The panel should scroll if the list exceeds its height.

7. Wire the reset button in **Header.jsx** to call `reset()` from the hook (pass as prop from App).

## What not to do

- Do not implement drag and drop yet.
- Do not implement combination detection yet (that's the next card).
- Do not implement the laboratory workspace interactions yet.
- Do not add styles beyond what's needed for the scrollable panel.

## Done when

- `catalog.js` exports ~50 elements with IDs, names, and emojis.
- `combinations.js` exports a complete COMBINATIONS map where every non-starter element has at least one recipe.
- The collection panel dynamically renders all discovered elements from state.
- The reset button clears progress back to the 4 starters.
- Refresh page restores the previous state (or falls back to 4 starters).

## Verification steps

- [ ] `npm run dev` starts without errors
- [ ] Collection panel shows Water, Fire, Air, Earth on first load
- [ ] Looking at `catalog.js` — ~50 elements present with unique IDs
- [ ] Looking at `combinations.js` — every non-starter has at least one recipe
- [ ] `getCombinationResult("water", "earth")` returns `"plant"`
- [ ] `getCombinationResult("earth", "water")` also returns `"plant"` (order independence)
- [ ] `getCombinationResult("water", "water")` returns `null`
- [ ] Reset button clears state back to 4 starters
- [ ] No console errors
- [ ] Design check: collection panel scrolls if many elements, follows `design.md` spacing

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` — does it start without errors?
- Do you see the 4 starting elements (💧🔥💨🌍) in the left panel?
- Click the Reset button — does it stay on the 4 starters?
- There is no way to add new elements yet (no drag/drop). That's expected for this card.
- Open DevTools > Console — are there any errors?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If the combination map has orphan elements (no recipe), fix by adding missing recipes. If the catalog is too large to hand-author in one pass, reduce to 30 elements and expand later.

## Status

Not started