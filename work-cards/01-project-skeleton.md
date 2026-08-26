# Work Card 01 — Project Skeleton

## Goal

Scaffold the Vite + React project, install dependencies, and create the full folder structure with placeholder components so the app starts and renders an empty shell.

## Inputs

- `architecture.md` — Stack Decision, File Expectations
- `build-blueprint.md` — File and Folder Expectations

## Files likely touched

- `package.json`
- `vite.config.js`
- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/App.css`
- `src/components/Header.jsx`
- `src/components/CollectionPanel.jsx`
- `src/components/ElementIcon.jsx`
- `src/components/Laboratory.jsx`
- `src/components/WorkspaceElement.jsx`
- `src/hooks/useGameState.js`
- `src/utils/storage.js`
- `src/data/catalog.js`
- `src/data/combinations.js`

## Instructions for the coding agent

1. Run `npm create vite@latest . -- --template react` in the project root. If the folder is non-empty, scaffold into a temp dir and move files, or manually create `package.json`, `vite.config.js`, `index.html`, and `src/main.jsx` with the standard Vite React template content.
2. `npm install`
3. Create all folders: `src/components/`, `src/hooks/`, `src/utils/`, `src/data/`
4. Create each file listed above as a **placeholder** (minimal component that renders its name for now, e.g. `<div>Header</div>`). `App.jsx` should import and render all five components in a rough two-panel layout using `<div>` only; no logic yet.
5. `App.css` can have a single rule making body margin zero.
6. `catalog.js` should export an empty `ELEMENT_CATALOG` object.
7. `combinations.js` should export an empty `COMBINATIONS` object and a stub `getCombinationResult(a, b)` that returns `null`.
8. `storage.js` should export stub `saveState(state)` and `loadState()` functions.
9. `useGameState.js` should be a stub that returns `{ discovered: [], addDiscovery: () => {} }`.

## What not to do

- Do not implement any game logic yet.
- Do not write the actual element catalog or combinations.
- Do not implement drag and drop.
- Do not style beyond the bare minimum to see components.
- Do not implement localStorage reads/writes.
- Do not use any external libraries beyond React and Vite defaults.

## Done when

- `npm run dev` starts without errors.
- The browser shows a page with placeholder text for Header, CollectionPanel, Laboratory, and any child components.
- No console errors.

## Verification steps

- [ ] `npm run dev` exits without errors
- [ ] Browser loads at localhost and shows component placeholders
- [ ] Console has no errors
- [ ] Design check: none yet — no visual design applied

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` — does the dev server start without errors?
- Open the localhost URL in a browser — do you see placeholder text for Header, CollectionPanel, and Laboratory?
- Open the browser DevTools console — are there any errors?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If `npm create vite` or `npm install` fails, check Node version, clear npm cache, or create files manually. If it cannot be fixed, ask for Pair Mode.

## Status

Not started