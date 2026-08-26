# Work Card 05 — Persistence and Polish

## Goal

Ensure the full game state (discovered elements and workspace positions) survives page refresh via `localStorage`. Add mobile tap-to-combine fallback, finalize the empty-state behavior, and polish the discovery toast and element hover interactions.

## Inputs

- `architecture.md` — Storage Logic, User Flow step 8
- `design.md` — Mobile Rules (tap-to-combine), Accessibility Basics
- `build-blueprint.md` — Proof Ladder steps 5–8, Implementation Rules
- `project-brief.md` — Proof Target

## Files likely touched

- `src/hooks/useGameState.js` — finalize localStorage save/load for both discovered and workspace
- `src/utils/storage.js` — ensure error handling for corrupt data
- `src/components/Laboratory.jsx` — add tap-to-select / tap-to-combine for mobile, improve empty-state transition
- `src/components/WorkspaceElement.jsx` — add click handler for mobile selection state
- `src/components/CollectionPanel.jsx` — add click handler for mobile tap-to-place
- `src/components/DiscoveryToast.jsx` — polish animation timing
- `src/App.css` — mobile styles for tap interaction, toast animation polish
- `src/components/ElementIcon.jsx` — ensure hover tooltip works on touch devices (show on tap instead)

## Instructions for the coding agent

1. **localStorage finalization**: In `useGameState.js`:
   - On every state change (discovery, workspace add/move), debounce the save to avoid excessive writes during drag (300ms debounce).
   - On mount, load state from localStorage. If the parsed data has both `discovered` and `workspace` arrays, use them. If the data is missing, corrupt, or any field is invalid, fall back to the default initial state `{ discovered: ["water","fire","air","earth"], workspace: [] }`.
   - After reset, immediately clear localStorage and reinitialize.

2. **Mobile tap-to-combine**:
   - Below 640px (or when touch is detected), replace drag-and-drop with tap interaction:
     - Tapping an element in the collection selects it (highlighted state). Tapping in the empty workspace places it there.
     - Tapping a workspace element selects it. Tapping another workspace element attempts a combination between the two.
     - Tapping the workspace background deselects.
   - On desktop, continue using native Drag and Drop.
   - Detect touch capability with a simple check: `'ontouchstart' in window` or use a media query + feature detect.

3. **Empty state hint**: When the workspace is empty, show "Drag elements here to combine" in muted brown. When the first element is placed, smoothly fade the hint out (CSS transition, opacity 0 over 300ms). When workspace becomes empty again (all elements removed), fade the hint back in.

4. **Discovery toast polish**:
   - The toast should animate in (slide down + fade) over 300ms, stay visible for 2 seconds, then animate out (fade up) over 300ms.
   - If a second discovery happens while the toast is still visible, replace the toast content and restart the timer (don't stack toasts).
   - Use `aria-live="polite"` on the toast container for screen readers.

5. **Hover tooltip on mobile**: On touch devices, tapping an element icon in the collection shows the name. Tapping again (or tapping elsewhere) hides it. Use a simple toggle state.

6. **CSS finalization**: Review `App.css` for any edge cases:
   - Long element names in tooltips should not overflow (max-width, text-overflow ellipsis or word-break).
   - Scrollable collection panel should have a subtle scrollbar or be styled to match the design.
   - Mobile stacked layout below 640px should have proper spacing and no cutoff.
   - Focus-visible ring should use the rust accent color (`#A44A3F`).

## What not to do

- Do not add audio, animations beyond toast, or confetti effects.
- Do not refactor the drag-and-drop system — mobile tap is an additional input method, not a replacement.
- Do not add a tutorial, onboarding overlay, or instructions beyond the empty-state hint.
- Do not add a search or filter for the collection.

## Done when

- Open the game, discover Plant (Water + Earth), refresh the page — Plant is still in the collection.
- Add elements to workspace, refresh — workspace elements are restored at their positions.
- On a mobile-width browser or touch device, elements can be tapped to select, tap workspace to place, and tap two workspace elements to combine.
- Empty-state hint fades in/out smoothly.
- Discovery toast animates cleanly and supports consecutive discoveries.
- Hover tooltips work on desktop; tap-to-reveal works on touch.

## Verification steps

- [ ] Discover Plant (Water + Earth), refresh browser — Plant persists in collection
- [ ] Place elements in workspace, refresh — workspace restores positions
- [ ] On mobile width (<640px): tap an element in collection to select it, tap workspace to place it
- [ ] On mobile: tap two workspace elements to attempt a combination
- [ ] Empty workspace shows hint; after placing an element, hint fades out
- [ ] Empty the workspace — hint fades back in
- [ ] Discover a new element — toast slides in, stays 2 seconds, slides out
- [ ] Discover another element while toast is visible — toast content replaces, timer resets
- [ ] No console errors
- [ ] Design check: toast uses rust accent, mobile stacking follows `design.md`, focus rings use rust color

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` — does it start without errors?
- Discover Plant (Water + Earth), then refresh the page — is Plant still in the collection?
- Place a few elements in the workspace, refresh — are they still there in the same positions?
- Open DevTools and switch to mobile view (<640px). Tap Water in the collection — is it selected/highlighted?
- Tap in the workspace — does Water appear there?
- Tap Earth in the workspace, then tap Water — does the combination work? Does Plant appear?
- Does the empty-state hint fade in/out smoothly?
- When you discover something, does the toast animate nicely?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If localStorage persistence is unreliable across browsers, add a try/catch wrapper. If mobile tap interactions feel clunky, simplify to a basic working version and note the improvement for later.

## Status

Not started