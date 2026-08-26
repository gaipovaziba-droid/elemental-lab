# Build Blueprint

## Source Files

- `project-brief.md`
- `architecture.md`
- `design.md`

## Project Identity

**Elemental Lab** — a browser-based element combination discovery game.

## Build Shape

Browser-local tool

## Version-One Promise

A player opens the game, sees Water, Fire, Air, and Earth in the collection panel, drags them into an open laboratory workspace, drops one onto another to discover new elements, and watches their collection grow. Progress survives page refresh. The core loop is: drag → combine → discover → collect → experiment again.

## Scope Lock

### Now
- 4 starting elements (Water, Fire, Air, Earth)
- Drag from collection to workspace (native HTML DnD)
- Free movement of elements within the workspace
- Element-on-element drop detection for combination
- Deterministic combination rules (sorted-ID key, hand-authored map)
- Valid combination → discovery toast → auto-add to collection
- Invalid combination → silent no-op
- Collection panel derived from discovered-IDs array
- Hover on any element icon reveals its name
- Scrollable collection panel (grows as discoveries increase)
- `localStorage` persistence under key `elemental-lab-state`
- On load: restore from localStorage; fallback to 4 starters
- Reset button clears back to 4 starters
- 30–50 hand-crafted, logically consistent discoverable elements
- Desktop-first layout; mobile stacked layout with tap-to-combine

### Later
- Larger element library
- Animation polish on discovery
- Audio feedback (discovery sound)
- Workspace position persistence
- Accessibility refinements

### Never
- Multiplayer, social features, leaderboards
- Accounts, profiles, chat
- Payments, subscriptions, ads, in-game store
- RPG systems (combat, quests, levels, storylines)
- 3D or physics-heavy simulation
- AI-generated unpredictable combinations
- Large databases (hundreds+ of elements)
- Crafting with quantities, resources, or limits
- Backend, authentication, cloud database
- External API calls or network requests

## Architecture Summary

- **Stack:** Vite + React + plain CSS + browser `localStorage`
- **Layout:** Fixed-width collection panel (left), fluid laboratory workspace (right); stacks vertically below 640px
- **State:** React state at App level; serialised to `localStorage` on every meaningful change
- **Components:** App → Header, CollectionPanel, Laboratory; CollectionPanel → ElementIcon (many); Laboratory → WorkspaceElement (many)
- **Drag & Drop:** Native HTML Drag and Drop API

## Data / State / Storage Rules

- **ELEMENT_CATALOG** — flat object keyed by ID; each entry has `id`, `name`, `emoji` (3 fields max)
- **COMBINATIONS** — flat object keyed by `"sortedIdA+sortedIdB"` → `resultElementId`
- **Persisted state** — `{ discovered: string[], workspace: { id, x, y }[] }`
- **localStorage key:** `elemental-lab-state`
- On every discovery or workspace change, serialise to localStorage (debounced on drag)
- On load, read localStorage; if missing/corrupt, initialise with `["water","fire","air","earth"]` and empty workspace
- Collection panel is a derived view of `discovered` — not a separate data system
- Combination helper: accept two IDs, sort, look up in COMBINATIONS; return result ID or null

## Design Direction Summary

**Borrow from TypeGallery:** warm cream (`#F5F0E8`) background, deep brown (`#3C1518`) text/borders, rust/terracotta (`#A44A3F`) accent, clean flat aesthetic, thoughtful spacing.

**Do not copy:** editorial layouts, oversized typography, content cards, luxury formality, portfolio structure. This is a playful discovery game, not a design showcase.

**Visual mood:** playful + tactile + warm + curious + magical + discovery-driven. Element icons are the visual stars — emoji on circular badges, no competing decoration.

**Mobile:** panels stack; collection becomes horizontal scrollable row; DnD replaced by tap-to-select/tap-to-place.

## Implementation Rules

- All combination logic must be deterministic — same two inputs always produce the same output.
- Combination keys must be sorted alphabetically so order of inputs does not matter.
- No backend, no network requests, no authentication, no external secrets.
- All text must pass WCAG AA contrast against cream background.
- Element names must be readable on hover (tooltip or aria-label).
- Discovery toast must auto-dismiss (2 seconds).
- Reset button must clear localStorage and reload to starting state.
- Empty workspace must show a faint instructional hint.
- No lorem ipsum, placeholder text, fake testimonials, or fake stats.
- No gradients, drop shadows, or rounded corners larger than 8px.

## File and Folder Expectations

```
/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── data/
│   │   ├── catalog.js
│   │   └── combinations.js
│   ├── hooks/
│   │   └── useGameState.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── CollectionPanel.jsx
│   │   ├── ElementIcon.jsx
│   │   ├── Laboratory.jsx
│   │   └── WorkspaceElement.jsx
│   └── utils/
│       └── storage.js
```

## Work Card Plan

1. **Work Card 01** — Scaffold the Vite + React project, install deps, create folder structure and placeholder components.
2. **Work Card 02** — Implement `catalog.js` with 4 starting elements and the full 30–50 element catalog. Implement `combinations.js` with the combination map and helper function.
3. **Work Card 03** — Implement `storage.js` (localStorage get/set wrapper) and `useGameState.js` (state management hook with load/save logic).
4. **Work Card 04** — Implement `Header.jsx` (title, reset button).
5. **Work Card 05** — Implement `ElementIcon.jsx` (emoji display, hover name tooltip, drag source).
6. **Work Card 06** — Implement `CollectionPanel.jsx` (scrollable list of ElementIcons derived from discovered state).
7. **Work Card 07** — Implement `WorkspaceElement.jsx` (positioned element in lab, draggable within workspace, droppable for combination).
8. **Work Card 08** — Implement `Laboratory.jsx` (drop target from collection, manages workspace elements, handles element-on-element drop for combination).
9. **Work Card 09** — Implement `App.jsx` and `App.css` (wire components, apply design system colors/layout, empty-state hint, discovery toast, mobile layout with media queries).
10. **Work Card 10** — Final integration, manual verification against the Proof Ladder, fix any issues.

## Review Mirror

After each Work Card:
- Run the verification steps listed in the card.
- Update `build-status.md` with completed card, any blockers, and next card number.
- If a card passes, stop and wait for the learner to say `Start Work Card NN`.
- If a card fails, make the single smallest useful fix, re-verify, and report.

## Proof Ladder

1. `npm run dev` starts without errors.
2. Browser opens to a warm cream page with 4 starting elements in the left panel.
3. Drag Water into workspace — it appears at the drop position.
4. Drag Earth into workspace — both elements movable.
5. Drop Water onto Earth — Plant discovery toast appears; Plant appears in collection.
6. Refresh page — Plant is still in collection.
7. Try invalid combination — nothing happens, no console errors.
8. Click Reset — collection returns to 4 starters, workspace clears.
9. Shrink browser to 640px width — panels stack, collection scrolls horizontally, touch/tap works.
10. Tab through UI — all interactive elements are focusable.

## 60-Second Explanation Template

"Elemental Lab is a browser-based discovery game. You start with Water, Fire, Air, and Earth. Drag them into the laboratory, drop one onto another, and discover new elements — like Water + Earth makes Plant. Each discovery gets added to your collection and can be used in future experiments. Progress saves automatically. No login, no backend, just a warm little lab of curiosity."

## Guardrails for the Coding Agent

- Read `build-status.md`, `build-blueprint.md`, and the current work card before editing.
- Implement only the current work card. Do not jump ahead.
- Stop after verification. Update `build-status.md` after each work card.
- Do not add backend, auth, database, or API unless the blueprint explicitly allows it.
- Do not add secrets or keys to code.
- Do not invent claims, testimonials, logos, or real numbers.
- Apply the guardrails for the **browser-local tool** build shape.
- If a legacy file uses `Build Mode`, treat it as `Build Shape` without stopping.
- The chat is not the source of truth. Only the planning files are.
- Before implementing any work card, wait for the learner to say `Start Work Card NN`.