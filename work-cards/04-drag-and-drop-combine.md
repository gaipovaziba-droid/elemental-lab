# Work Card 04 — Drag-and-Drop and Combination Detection

## Goal

Implement the core interaction: drag elements from the collection sidebar into the laboratory workspace, move them freely within the workspace, and drop one workspace element onto another to trigger a combination. On a successful combination, both input elements are consumed and replaced by the resulting element at the midpoint. The new element is automatically discovered if not already in the collection. Invalid combinations silently do nothing.

## Inputs

- `architecture.md` — User Flow, Component Map, Constraints
- `build-blueprint.md` — Implementation Rules, Proof Ladder steps 2–6
- `design.md` — Component Style, Laboratory rules

## Structural changes (Little Alchemy reference)

- **Sidebar narrowed to ~76px** — an icon grid, not a dashboard panel. Maximizes laboratory space.
- **On successful combination: inputs consumed, result placed** — the two source elements are removed from the workspace and replaced by the new element at the combination midpoint. This matches Little Alchemy's interaction model.
- **Multiple instances allowed** — same element can be dragged into the workspace multiple times (each gets its own `uid`).
- **Warm cream TypeGallery colors kept** — no visual identity copied from Little Alchemy.

## Files likely touched

- `src/App.css` — narrow sidebar (~76px), larger workspace elements (64px), discovery toast, hover/active states
- `src/App.jsx` — wire up useGameState workspace handlers, combination logic, discovery toast state
- `src/hooks/useGameState.js` — add workspace state (array of `{ uid, elementId, x, y }`), addToWorkspace, moveInWorkspace, removeFromWorkspace, replacePairWithResult, clearWorkspace, persist workspace in localStorage
- `src/components/Header.jsx` — add Clear Lab button, keep Reset All
- `src/components/CollectionPanel.jsx` — set `draggable="true"` on elements, set `dataTransfer` with element ID
- `src/components/ElementIcon.jsx` — accept `onDragStart` prop from parent
- `src/components/Laboratory.jsx` — drop target from sidebar, manage workspace elements, detect workspace-element-on-workspace-element drops, invoke combination, replace pair with result
- `src/components/WorkspaceElement.jsx` — draggable within workspace, droppable for combination, visual drag-over indicator
- `src/components/DiscoveryToast.jsx` — new component: auto-dismissing toast for new discoveries

## Instructions for the coding agent

1. **useGameState.js**: Add workspace state management:
   - `workspace` — array of `{ uid, elementId, x, y }`
   - `addToWorkspace(elementId, x, y)` — adds a new item with a unique incrementing uid
   - `moveInWorkspace(uid, x, y)` — updates position of an existing item
   - `removeFromWorkspace(uid)` — removes by uid
   - `replacePairWithResult(uidA, uidB, resultId, x, y)` — removes two items, adds one new item at (x, y)
   - `clearWorkspace()` — empties all
   - Persist `{ discovered, workspace, nextId }` to localStorage on every change

2. **App.jsx**: Coordinate the full game loop:
   - Maintain `toast` state for the discovery notification
   - `handleDropFromCollection(elementId, x, y)` — calls `addToWorkspace`
   - `handleCombine(uidA, uidB, midX, midY)` — calls `getCombinationResult`, triggers discovery toast if new, calls `replacePairWithResult`
   - Pass all handlers down to Laboratory and CollectionPanel

3. **App.css**: Update layout:
   - `.collection-panel`: 76px wide, overflow-y scroll, flex-wrap for icon grid
   - `.element-icon`: 52x52px, rounded 8px (not circular), cursor grab, hover tooltip on the right (not top)
   - `.laboratory`: flex 1, dot-grid background
   - `.workspace-element`: 64x64px, rounded 8px, absolute positioning, hover border highlight, drag-over red border
   - `.discovery-toast`: fixed top center, rust accent, slide-in animation, auto-dismiss

4. **CollectionPanel.jsx**: Map over `discovered` IDs, render `ElementIcon` with `onDragStart` setting `e.dataTransfer.setData('text/plain', elementId)` and `effectAllowed = 'copy'`.

5. **ElementIcon.jsx**: Accept `onDragStart` prop, set `draggable="true"`, call `onDragStart(e, name)` with the element ID.

6. **Laboratory.jsx**: 
   - Accept drops on the main div. If the dropped data is a non-numeric string (sidebar element ID), add it to workspace at the drop position. If it's a numeric string (workspace UID), reposition it.
   - Each rendered `WorkspaceElement` is a drop target. If a sidebar element is dropped on it, add the sidebar element near the target. If a workspace element is dropped on it, attempt combination. On success, both inputs are removed and the result appears at the midpoint.

7. **WorkspaceElement.jsx**: 
   - `draggable="true"`, on `onDragStart` set `dataTransfer` to the uid.
   - On `onDragOver`/`onDragLeave` show/hide a visual indicator (red border via CSS class).
   - On `onDrop`, call the lab's handler.
   - Accept `isDragOver` prop for styling.

8. **DiscoveryToast.jsx**: Renders a centered toast when `toast` is non-null. Auto-dismisses after 2 seconds via `setTimeout`. Uses `aria-live="polite"`.

## What not to do

- Do not use any external drag-and-drop library — use native HTML Drag and Drop API only.
- Do not implement mobile tap-to-combine yet.
- Do not add audio, confetti, or celebration effects.

## Done when

- Dragging an element from the sidebar into the workspace places it at the drop position.
- Dragging within the workspace repositions elements.
- Dropping one workspace element onto another triggers a combination check.
- A valid combination: removes both inputs, places the result at the midpoint, shows discovery toast if new.
- An invalid combination: silently does nothing.
- Multiple instances of the same element can exist in the workspace.
- Refresh preserves workspace state and discovered collection.
- Reset All returns to 4 starters and empty workspace.
- Clear Lab empties workspace without resetting discoveries.

## Verification steps

- [ ] Drag Water from sidebar into workspace — Water appears at drop position
- [ ] Drag Earth from sidebar into workspace next to Water
- [ ] Drag Water onto Earth — both consumed, Plant appears at midpoint, discovery toast: "Discovered: 🌱 Plant!"
- [ ] Plant appears in the sidebar collection
- [ ] Drag another Water and Earth from sidebar — they appear even though already discovered
- [ ] Try combining two of the same element (Water onto Water) — nothing happens
- [ ] Drag a workspace element to new position — it moves
- [ ] Refresh browser — workspace state and discovered collection persist
- [ ] Clear Lab button empties workspace only
- [ ] Reset All returns to 4 starters and empty workspace
- [ ] No console errors
- [ ] Design check: narrow sidebar, warm cream, dot-grid lab, discovery toast in rust accent, hover tooltips on sidebar elements

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` — does it start without errors?
- Drag 💧 Water from the left sidebar into the workspace — does it appear where you dropped it?
- Drag 🌍 Earth into the workspace next to Water.
- Drag Water onto Earth — do both disappear and get replaced by 🌱 Plant at the midpoint? Do you see "Discovered: 🌱 Plant!" toast?
- Is 🌱 Plant now in the sidebar collection?
- Drag more Water from the sidebar — can you have multiple Water instances in the workspace?
- Drag another Water onto another Water — does nothing happen (no error)?
- Refresh the page — is Plant still in the sidebar, and are workspace elements still in place?
- Click "Clear Lab" — does the workspace empty while keeping all discoveries?
- Click "Reset All" — does everything go back to just the 4 starters with an empty workspace?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If native HTML Drag and Drop API behaves inconsistently across browsers, note the issue and proceed. Major breakage may require switching to pointer events. If it cannot be fixed in 20 minutes, ask for direction.

## Status

Not started