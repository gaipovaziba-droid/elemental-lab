# Work Card 08 — Content Integrity and Interaction Recovery

## Goal

Integrate the authored, typed recipe collections into the generated game content; make every non-starter discoverable without self-producing or circular fallback recipes; and restore reliable pointer, tap, and keyboard play. Keep every placed and combined element inside the laboratory, report discoveries truthfully, and finish with automated content validation plus the full V1 interaction proof.

## Inputs

- `build-status.md` — shipped V1 baseline and live proof
- `project-brief.md` — Version-One Success, core interaction loop, and Proof Target
- `architecture.md` — deterministic sorted-pair lookup, state model, persistence constraints, and verification notes
- `design.md` — Mobile Rules and Accessibility Basics
- `scripts/content/foundation-recipes-core.js` — curated foundation recipes
- `scripts/content/foundation-recipes-a.js` — curated foundation recipes
- `scripts/content/foundation-recipes-b.js` — curated foundation recipes
- `scripts/content/foundation-recipes-domain.js` — curated domain-specific replacements
- `scripts/content/periodic-recipes.js` — curated periodic-table recipes
- `scripts/validate-content.js` — content-integrity gate
- `work-cards/06-review-and-fix.md` — prior interaction and accessibility proof

## Files likely touched

- `scripts/generate-content.js` — integrate curated recipes and remove self-producing fallback generation
- `scripts/content/*.js` — correct a curated recipe only when validation exposes a specific data defect
- `scripts/validate-content.js` — enforce recipe schema, taxonomy, explanation, graph, and metadata invariants
- `src/data/compiled.json` — regenerate from authored sources; never hand-edit
- `src/data/engine.js` — expose the complete matching recipe/result metadata needed by interaction messaging
- `src/App.jsx` — coordinate drag, tap, keyboard combination, clamping, and accurate result messaging
- `src/hooks/usePointerDrag.js` — distinguish taps from drags without losing pointer behavior
- `src/hooks/useGameState.js` — normalize persisted workspace positions if required
- `src/components/CollectionPanel.jsx` — selection state and keyboard/tap entry points
- `src/components/ElementIcon.jsx` — operable collection controls and accessible selected state
- `src/components/Laboratory.jsx` — tap/keyboard placement and laboratory-boundary handling
- `src/components/WorkspaceElement.jsx` — tap/keyboard selection and combination
- `src/components/DiscoveryToast.jsx` — truthful, screen-reader-friendly result messaging
- `src/App.css` — selected, focus-visible, and interaction-state styles only

## Instructions for the coding agent

1. **Capture the baseline before editing**:
   - Run `npm run validate:content` and `npm run build` and keep the exact failures as the checklist to resolve.
   - Confirm the four starters remain `water`, `fire`, `air`, and `earth`.
   - Do not treat the current generated `src/data/compiled.json` as an authored source file.

2. **Integrate the curated typed recipes**:
   - Import every recipe collection under `scripts/content/` into `scripts/generate-content.js` and feed each entry through one canonical recipe-registration path.
   - Canonicalize each input pair with sorted IDs. Never depend on authoring order.
   - Preserve each curated recipe's `type` and non-empty `explanation` in the compiled recipe object. Accepted types are `chemical`, `physical`, `biological`, `industrial`, `environmental`, `technological`, and `conceptual`.
   - Validate `a`, `b`, and `result` against the element catalog before accepting a curated entry.
   - Handle pair collisions explicitly. An intentional curated replacement may replace a generated fallback, but duplicate or conflicting curated pairs must fail generation or validation with the exact pair named; they must not be silently ignored.
   - Regenerate `src/data/compiled.json` through `npm run generate` after changing authored content.

3. **Eliminate broken discovery content**:
   - Remove every recipe whose result is also either input, including generated `earth + element -> element` and `air + element -> element` fallbacks.
   - Remove the fallback behavior that invents a self-producing recipe merely to make an element appear to have a recipe.
   - Starting only from the four starters, require graph traversal to reach every catalog element through valid recipes.
   - Break circular unreachable dependency components with a defensible curated recipe whose inputs are already reachable. Do not fix graph metrics with placeholder names, duplicate pairs, or semantically empty recipes.
   - Keep all recipe references valid, all keys canonical, and all periodic-table metadata complete and unique.
   - If an element cannot be supported by a credible reachable recipe, remove or revise that content at its authored source rather than weakening validation.

4. **Restore tap interaction without regressing drag**:
   - A short mouse or touch tap on a collection element selects it and exposes a visible selected state; tapping the laboratory background places it at the tapped point.
   - Tapping one workspace element selects it; tapping a different workspace element attempts their combination.
   - Tapping the laboratory background with no collection element selected clears workspace selection. Provide a clear cancellation path and prevent a completed drag from also firing a tap action.
   - Keep pointer dragging from the collection, repositioning in the workspace, and element-on-element combining functional for mouse, pen, and touch pointers.
   - Invalid combinations leave both elements unchanged and remain silent.

5. **Restore complete keyboard operation**:
   - Collection and workspace elements must be reachable in a logical tab order and have action-oriented accessible names.
   - `Enter` and `Space` select or activate the focused element using the same state transition as tap; do not maintain a separate combination implementation.
   - Provide a keyboard-operable laboratory placement target for the selected collection element, using a safe visible default position.
   - Allow two workspace elements to be selected and combined entirely from the keyboard. `Escape` cancels the active selection.
   - Expose selection with an appropriate accessible state such as `aria-pressed`, retain a visible rust focus ring, and keep discovery announcements in an `aria-live="polite"` status region.

6. **Clamp every placement and drop to the laboratory**:
   - Centralize coordinate calculation and clamping instead of duplicating offsets across pointer, tap, keyboard, and combination paths.
   - Account for the rendered workspace-element dimensions so the full badge remains visible: clamp both axes to the laboratory's usable bounds.
   - A collection drop outside the laboratory must not create an element. A workspace drag released outside it must not move the element off-canvas.
   - Clamp new placements, repositioned elements, combination midpoints, keyboard placements, and restored persisted coordinates.
   - Re-clamp safely when the viewport/laboratory becomes smaller; never persist `NaN`, infinite, or negative coordinates.

7. **Make discovery messaging accurate**:
   - Determine whether the result was previously discovered before mutating discovery state.
   - Say `Discovered` only for a first-time discovery. If an already-known recipe creates another workspace instance, use accurate non-discovery wording such as `Created`, or omit the toast; never announce it as newly discovered.
   - Use the actual result element's name and emoji. Do not announce invalid combinations, canceled drops, or failed placements.
   - Restart the existing toast timer cleanly for consecutive messages and leave the `aria-live` announcement usable.

8. **Strengthen and run the content gate**:
   - Extend validation where needed so the compiled output fails on invalid recipe shape/reference, unsorted key, self-producing recipe, duplicate key/pair, conflicting pair, unreachable element, circular unreachable component, missing/invalid type, missing required curated explanation, invalid element schema/category, or incomplete/duplicate periodic metadata.
   - Validation output must include useful counts and samples, then exit non-zero for any failed invariant.
   - Run `npm run generate`, `npm run validate:content`, and `npm run build` in that order after the final source change.
   - Run the generator and validator once more to confirm the compiled recipe graph and counts are stable, apart from intentionally volatile metadata such as a generation timestamp.

9. **Run the interaction regression proof**:
   - Verify the Water + Earth → Plant proof through pointer drag, touch/tap, and keyboard-only operation.
   - Verify first-time versus already-known result messaging, invalid-combination silence, outside-drop cancellation, edge clamping, refresh persistence, Clear Lab, and Reset All.
   - Test at desktop width and below 640px, and confirm there are no console errors or React warnings.

## What not to do

- Do not add another bulk catalog expansion in this card.
- Do not hand-edit `src/data/compiled.json`; regenerate it from authored source modules.
- Do not restore reachability with self-producing, circular-only, placeholder, duplicate, or conflicting recipes.
- Do not weaken, skip, or convert validation failures into warnings merely to make the command pass.
- Do not replace the pointer system with an external drag-and-drop library.
- Do not create separate combination rules for drag, tap, and keyboard; all input modes must call the same game action.
- Do not redesign the visual system, add a backend, add authentication, or add network requests.
- Do not clear valid player discoveries during migration; filter invalid IDs and normalize unsafe positions narrowly.

## Done when

- Every curated recipe collection is part of generation, and its recipe type and explanation survive into compiled content.
- `npm run validate:content` passes with zero unreachable elements, self-producing recipes, invalid references, unsorted keys, duplicate/conflicting pairs, circular unreachable components, taxonomy errors, schema/category errors, and periodic metadata errors.
- Every catalog element is discoverable from the four starters through the compiled recipe graph.
- Pointer drag, short tap, and keyboard-only flows can place and combine elements through shared game logic.
- No placement, move, restored position, or combination result can render outside the laboratory.
- First-time discoveries and already-known creations are messaged accurately; invalid combinations remain silent.
- Refresh persistence, Clear Lab, Reset All, responsive layout, tooltips, focus states, and screen-reader announcements still work.
- `npm run build` completes without errors or warnings introduced by this card.

## Verification steps

- [ ] `npm run generate` completes and writes compiled content from the authored sources
- [ ] Every curated recipe appears under its canonical sorted pair with valid `type` and non-empty `explanation`
- [ ] `npm run validate:content` exits 0
- [ ] Content validation reports zero unreachable elements
- [ ] Content validation reports zero self-producing recipes
- [ ] Content validation reports zero circular unreachable components
- [ ] Content validation reports zero invalid references, unsorted keys, duplicate pairs, or conflicting pairs
- [ ] Recipe taxonomy, element schema/category, and all 118 periodic-element metadata checks pass
- [ ] `npm run build` exits 0 with no new warnings
- [ ] Pointer: drag Water and Earth into the lab, then combine them to create Plant
- [ ] Touch/tap: select from the collection, tap the lab to place, then tap two workspace elements to combine
- [ ] Keyboard: select and place Water and Earth, then combine them without using a pointer
- [ ] `Escape` cancels an active tap/keyboard selection and visible/accessibility state stays synchronized
- [ ] Dropping a collection element outside the laboratory creates nothing
- [ ] Releasing a workspace element outside the laboratory leaves it at a valid in-bounds position
- [ ] Placements at all four edges and a combination midpoint remain fully visible inside the laboratory
- [ ] Persisted invalid or out-of-range positions are restored to finite, non-negative, in-bounds coordinates
- [ ] First Water + Earth result announces `Discovered: 🌱 Plant!`
- [ ] Repeating a known Water + Earth recipe does not claim Plant was newly discovered
- [ ] Invalid combinations preserve both inputs and make no announcement
- [ ] Refresh preserves discoveries and safe workspace positions
- [ ] Clear Lab keeps discoveries; Reset All returns to four starters and an empty workspace
- [ ] Desktop and below-640px layouts remain usable with no console errors or React warnings

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run validate:content` — does it finish with `PASSED` and zero unreachable or self-producing recipes?
- Run `npm run build` — does the production build complete without errors?
- Drag Water and Earth into the laboratory and combine them — does Plant appear and stay fully inside the lab?
- Repeat Water + Earth — does the app avoid calling the already-known Plant a new discovery?
- Drop near every edge and release an existing element outside the lab — do all workspace elements remain fully visible?
- At mobile width, tap Water in the collection and tap the lab — is Water placed at the tapped point? Can two workspace taps combine Water and Earth?
- Using only `Tab`, `Enter`/`Space`, and `Escape`, can you place, combine, and cancel selections with a visible focus/selected state?
- Try an invalid pair — do both inputs stay in place with no discovery announcement?
- Refresh — are discoveries and in-bounds positions preserved?
- Open the browser console — are there no errors or React warnings?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the failing command output or describe the exact interaction.

## Stop condition

If curated entries conflict on the same canonical pair, stop adding recipes and report the exact pair, both proposed results, and their source files before choosing one. If an input-mode bug cannot be reproduced consistently, record the browser, viewport, input type, and precise gesture/key sequence, then fix the smallest shared state transition rather than adding a mode-specific workaround.

## Status

In progress
