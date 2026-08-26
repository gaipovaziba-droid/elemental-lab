# Project Brief

## Project Identity

Elemental Lab — a browser-based element combination discovery game.

## One-Sentence Concept

A virtual laboratory where players drag and combine basic elements (Water, Fire, Air, Earth) to discover increasingly complex creations, all inside a single browser page with persistent progress.

## Target User

Casual players, teenagers, students, and adults who enjoy logic, puzzles, discovery, experimentation, and collecting. Accessible to beginners; rewarding for curious players.

## User Goal

Drag elements from a collection panel into a workspace, combine them logically, discover new items, watch the collection grow, and feel a sense of exploration and progression.

## Build Shape

Browser-local tool

## Shape Confirmation

Confirmed by the learner. The main value is creating and collecting discovered elements with `localStorage` persistence. No backend, accounts, or cloud storage required for V1.

## Version-One Success

V1 is done when the core loop works smoothly:
- Player starts with 4 basic elements (Water, Fire, Air, Earth).
- Left panel shows the collection; right workspace is the laboratory.
- Elements drag from collection into workspace and can be moved freely.
- Dragging one element onto another attempts a combination.
- Valid combinations create a new element; invalid combinations do nothing.
- New discoveries auto-add to the collection for unlimited reuse.
- Hovering shows the element name.
- Collection scrolls as it grows.
- Progress survives page refresh via `localStorage`.
- 30–50 discoverable elements demonstrate meaningful progression.

## Now / Later / Never

### Now
- 4 starting elements
- Drag-and-drop from collection to workspace
- Free movement in workspace
- Element-on-element combination detection
- Deterministic combination logic
- New discovery → auto-add to collection
- Hover-to-reveal names
- Scrollable collection
- localStorage persistence
- 30–50 hand-crafted, logically consistent combinations
- Clean, intuitive UI

### Later
- Larger element library
- Animation polish on discovery
- Audio feedback (discovery sound)
- Additional quality-of-life features
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

## Assumptions

- Desktop/laptop browser is the primary target (responsive for mobile stretch goal).
- All element icons can be simple emoji or CSS-based visuals.
- Player runs a single-page HTML/CSS/JS app via a local dev server or file.
- Combination data is hand-authored in a JavaScript object or JSON file.

## Proof Target

Open the game in a browser, combine Water + Earth to get Plant, refresh the page, and confirm Plant remains in the collection.

## Trainer / Learner Notes

N/A for this session.