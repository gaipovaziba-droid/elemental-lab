# Architecture

## Build Shape

Browser-local tool

## Stack Decision

- Vite (dev server and build)
- React (component UI)
- plain CSS (no Tailwind unless the session is already using it)
- `localStorage` for all persistence
- No backend, no database, no authentication, no external API

## Structure Overview

A single-page React app. The player sees a two-panel layout:

- **Left panel** — scrollable collection of all discovered elements. Each element shows its emoji icon; hovering reveals the name.
- **Right panel** — the laboratory workspace. Elements can be dragged in from the collection, moved freely, and dropped onto another element to attempt a combination.

The game state lives in a single React context or in top-level component state. On every meaningful change, the full relevant state is serialised to `localStorage`.

## Component Map

```
App
├── Header (title, reset button)
├── CollectionPanel (left sidebar)
│   └── ElementIcon (repeated, draggable)
└── Laboratory (right workspace)
    └── WorkspaceElement (positioned, droppable, draggable)
```

- **App** — owns all state, reads/writes `localStorage`, provides add-discovered handler.
- **CollectionPanel** — maps over discovered IDs, looks up full catalog data, renders `ElementIcon` for each.
- **ElementIcon** — displays the emoji, shows name on hover, initiates drag.
- **Laboratory** — accepts drops from collection, manages positions of placed elements, detects element-on-element drops, invokes the combination check.
- **WorkspaceElement** — a single element placed on the workspace, draggable within it, droppable for combination.

## Data / State Model

```js
// Full element catalog (hand-authored, not persisted per player)
const ELEMENT_CATALOG = {
  water:   { id: "water",   name: "Water",   emoji: "💧" },
  fire:    { id: "fire",    name: "Fire",    emoji: "🔥" },
  air:     { id: "air",     name: "Air",     emoji: "💨" },
  earth:   { id: "earth",   name: "Earth",   emoji: "🌍" },
  plant:   { id: "plant",   name: "Plant",   emoji: "🌱" },
  // ... up to 30-50 elements
}

// Combination rules (deterministic, hand-authored)
const COMBINATIONS = {
  // key: "firstId+secondId" (sorted alphabetically)
  "air+earth":   "dust",
  "air+fire":    "energy",
  "air+water":   "steam",
  "earth+water": "plant",
  "fire+earth":  "lava",
  "fire+water":  "steam",
  // ...
}

// Persisted player state (one localStorage key)
const STORAGE_KEY = "elemental-lab-state"

// Shape of persisted state:
{
  discovered: ["water", "fire", "air", "earth"],  // IDs the player has found
  workspace: [
    { id: "water", x: 120, y: 200 },
    { id: "earth", x: 300, y: 200 },
  ]
}
```

## Storage Logic

- Key: `elemental-lab-state`
- Serialise on every state change (debounced to avoid excessive writes on drag).
- On app load, read from `localStorage`. If absent or corrupt, initialise with the 4 starting elements and an empty workspace.
- `discovered` array holds only element IDs; full data is looked up from `ELEMENT_CATALOG`.
- The collection panel is derived from `discovered` — it is not a separate system.

## User Flow

1. Player opens the app.
2. Left panel shows Water, Fire, Air, Earth. Workspace is empty.
3. Player drags Water from panel into workspace. Water appears at the drop position.
4. Player drags Earth from panel into workspace next to Water.
5. Player drags Water onto Earth (or Earth onto Water). The app looks up `COMBINATIONS["earth+water"]` → `"plant"`.
6. A brief discovery notification appears. `"plant"` is added to `discovered[]`. State is saved to `localStorage`.
7. The plant icon now appears in the collection panel.
8. Player refreshes the page. `localStorage` restores `discovered`, and the 4 starters plus Plant are shown.
9. Invalid combinations (e.g. Water + Water) silently do nothing — no error, no new element.

## File Expectations

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
│   │   ├── catalog.js        (ELEMENT_CATALOG)
│   │   └── combinations.js   (COMBINATIONS, plus a helper function)
│   ├── hooks/
│   │   └── useGameState.js   (state management + localStorage)
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── CollectionPanel.jsx
│   │   ├── ElementIcon.jsx
│   │   ├── Laboratory.jsx
│   │   └── WorkspaceElement.jsx
│   └── utils/
│       └── storage.js        (get/load wrapper for localStorage)
```

## Constraints

- Deterministic combinations only — same two inputs always produce the same result.
- Combination lookup is keyed by sorted IDs (`"air+earth"` not `"earth+air"`) so order does not matter.
- No more than 3–5 fields per catalog entry.
- No backend, no network requests, no authentication, no cloud sync.
- Workspace state persistence is V1-nice-to-have; persistence of `discovered` is required.

## Technical Non-Goals

- No accounts, login, or multi-player.
- No backend, database, or API.
- No real-time sync or cloud storage.
- No audio system (V1).
- No animation framework — plain CSS transitions if any.
- No drag-and-drop library unless the HTML Drag and Drop API proves insufficient — start with native HTML DnD.

## Verification Notes

1. Open the app — 4 starting elements appear in the left panel.
2. Drag Water into workspace — it appears on the right.
3. Drag Earth into workspace — both elements are movable.
4. Drop Water onto Earth — Plant discovery triggers, Plant appears in collection.
5. Refresh the page — Plant is still in the collection.
6. Try invalid combination — nothing happens, no errors.
7. Reset button clears all progress back to the 4 starters.