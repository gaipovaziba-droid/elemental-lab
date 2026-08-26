# Work Card 06 — Review and Fix

## Goal

Run the full Proof Ladder from `build-blueprint.md`, identify any broken or rough edges, and make the single smallest useful fix for each issue found. The game should feel complete and polished for V1.

## Inputs

- `build-blueprint.md` — Proof Ladder, Implementation Rules, Review Mirror
- `project-brief.md` — Version-One Success criteria
- `design.md` — Design Verification Checklist
- All previous work cards

## Files likely touched

Any file that has a bug or visual issue discovered during the review. Likely candidates:
- `src/App.css` — layout or responsive edge cases
- `src/components/Laboratory.jsx` — drop detection edge cases
- `src/components/WorkspaceElement.jsx` — positioning or drag edge cases
- `src/hooks/useGameState.js` — state edge cases
- `src/data/catalog.js` — missing or incorrect element data
- `src/data/combinations.js` — missing or incorrect combination recipes

## Instructions for the coding agent

1. Run through the entire Proof Ladder from `build-blueprint.md`:
   - `npm run dev` starts without errors.
   - Browser opens to a warm cream page with 4 starting elements in the left panel.
   - Drag Water into workspace — it appears at the drop position.
   - Drag Earth into workspace — both elements movable.
   - Drop Water onto Earth — Plant discovery toast appears; Plant appears in collection.
   - Refresh page — Plant is still in collection.
   - Try invalid combination — nothing happens, no console errors.
   - Click Reset — collection returns to 4 starters, workspace clears.
   - Shrink browser to 640px width — panels stack, collection scrolls horizontally, touch/tap works.
   - Tab through UI — all interactive elements are focusable.

2. For each step that fails or looks wrong:
   - Identify the root cause (bug in code, missing style, edge case).
   - Make the single smallest useful fix.
   - Re-run the failing step to confirm the fix.

3. Run through the Design Verification Checklist from `design.md`:
   - Warm cream background, deep brown text/borders, rust accent for discoveries.
   - Two-panel layout (stacked on mobile).
   - Collection panel scrolls; laboratory is open and spacious.
   - Element icons are circular, emoji-based, visually prominent.
   - Hover shows element name.
   - Discovery toast appears and auto-dismisses.
   - Empty-state hint in the laboratory.
   - Mobile: horizontal collection, tap-to-combine.
   - Keyboard focusable and screen-reader friendly.
   - No editorial layout, no oversized text, no luxury branding.

4. For any design check that fails: make the smallest style fix to align with `design.md`.

5. Check for console errors, warnings, or React strict-mode double-render issues. Fix any that appear.

6. Check that the catalog has no orphan elements (every non-starter has at least one recipe). If there are orphans, add the missing recipes or flag them for the learner.

## What not to do

- Do not add new features.
- Do not redesign or refactor the layout.
- Do not add animations beyond existing toast.
- Do not add a tutorial, onboarding, or help text.
- Do not add a combination log or history.
- Do not change the element catalog size.
- Do not replace emoji icons with custom images.

## Done when

- All 10 Proof Ladder steps pass.
- All 10 Design Verification Checklist items pass.
- No console errors.
- No orphan elements in the catalog.
- The game feels complete, polished, and ready for V1.

## Verification steps

- [ ] Proof Ladder step 1: `npm run dev` starts
- [ ] Proof Ladder step 2: 4 starters visible
- [ ] Proof Ladder step 3: drag to workspace works
- [ ] Proof Ladder step 4: elements movable in workspace
- [ ] Proof Ladder step 5: Water + Earth → Plant with toast
- [ ] Proof Ladder step 6: refresh persistence works
- [ ] Proof Ladder step 7: invalid combination silent
- [ ] Proof Ladder step 8: reset works
- [ ] Proof Ladder step 9: mobile layout stacks correctly
- [ ] Proof Ladder step 10: keyboard navigation works
- [ ] Design checklist: all 10 items pass
- [ ] No console errors or warnings
- [ ] Every non-starter element has at least one recipe

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` — does it start without errors?
- Open the game. Do you see 4 starting elements (💧🔥💨🌍)?
- Drag Water into workspace — does it appear where you drop it?
- Drag Earth next to it — is it movable?
- Drop Water onto Earth — do you see "Discovered: 🌱 Plant!" toast? Does Plant appear in the collection?
- Refresh the page — is Plant still in the collection?
- Try combining two elements that shouldn't work (e.g. Water + Water) — nothing happens, right?
- Click Reset — does everything go back to the 4 starters and an empty workspace?
- Shrink browser below 640px — do the panels stack with a horizontal collection at top?
- Tab through the UI — can you focus on all interactive elements?
- Open browser DevTools Console — are there any errors or warnings?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If a bug cannot be fixed in 10 minutes, note it in `build-status.md` as a known issue and proceed. If the game is fundamentally broken (e.g. drag-and-drop never works), stop and diagnose before continuing.

## Status

Complete
