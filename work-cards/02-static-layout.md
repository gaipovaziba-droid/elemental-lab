# Work Card 02 — Static Layout and Design System

## Goal

Implement the full visual design: warm cream background, deep brown text, two-panel layout (left collection panel, right laboratory workspace), header with title and reset button, and the empty-state hint in the laboratory. No drag-and-drop or game logic yet — just a static, beautiful shell.

## Inputs

- `design.md` — full color palette, layout rules, component style, typography
- `architecture.md` — component map, structure overview
- `build-blueprint.md` — File and Folder Expectations, Design Direction Summary
- `work-cards/01-project-skeleton.md` — existing placeholder components to fill in

## Files likely touched

- `src/App.jsx` — implement two-panel layout with correct component structure
- `src/App.css` — all layout, color, typography, and responsive rules
- `src/components/Header.jsx` — game title (small, left) and reset button (right)
- `src/components/CollectionPanel.jsx` — left sidebar frame (empty for now, just the container styled)
- `src/components/ElementIcon.jsx` — visual placeholder showing an emoji circle (hardcoded for now)
- `src/components/Laboratory.jsx` — right workspace with dot-grid background and empty-state hint text
- `src/components/WorkspaceElement.jsx` — visual placeholder for an element in the workspace

## Instructions for the coding agent

1. In `App.css`, set:
   - `body` background: `#F5F0E8` (warm cream)
   - `body` font-family: system-ui or `"Inter", sans-serif`
   - Text color: `#3C1518` (deep brown)
   - Two-panel layout using CSS Grid or Flexbox: left panel fixed ~220px, right panel `flex: 1`
   - Header bar: thin, `display: flex`, `justify-content: space-between`, small title, subtle reset button
   - CollectionPanel: left sidebar with a slightly darker border-right, `overflow-y: auto`, padding
   - Laboratory: `flex: 1`, dot-grid or subtle pattern on background, centered empty-state hint
   - Below 640px: panels stack vertically, collection becomes a horizontal scrollable row at top
2. In `App.jsx`: render `<Header />` at the top, then a flex container with `<CollectionPanel />` on the left and `<Laboratory />` on the right, as children of a wrapper div.
3. **Header.jsx**: render `<h1>Elemental Lab</h1>` in small text on the left, and a subtle `<button>Reset</button>` on the right. No logic yet.
4. **CollectionPanel.jsx**: render a container div. For now, manually render a few hardcoded `<ElementIcon>` components (Water, Fire, Air, Earth) to show the panel is working.
5. **ElementIcon.jsx**: accept `name` and `emoji` props. Render a circular div with the emoji centered. On hover, show a tooltip with the name. Use CSS for the circle `(border-radius: 50%, background: light cream, ~48px)`.
6. **Laboratory.jsx**: render the workspace area. Show a faint centered hint: `"Drag elements here to combine"` in muted brown (`#8B7E74`). This hint disappears when the first element is placed (use a simple `hasElements` state — set to false for now).
7. **WorkspaceElement.jsx**: accept `id`, `emoji`, `x`, `y` props. Render an absolutely-positioned div at (`x`, `y`) with the emoji inside a ~56px circle. No drag logic yet.
8. Ensure the `.jsx` files use `.jsx` extension and Vite serves them correctly.
9. All colors, sizes, and spacing must match `design.md`.

## What not to do

- Do not implement any game logic (no drag/drop, no combination, no discovery).
- Do not wire up the reset button yet.
- Do not use Tailwind or any CSS framework.
- Do not add gradients, drop shadows, or rounded corners larger than 8px.
- Do not add animations yet.

## Done when

- The browser shows the full design: cream background, header, left panel with 4 emoji circles, right workspace with dot-grid and empty-state hint.
- The layout is clean and matches `design.md`.
- Shrinking the browser below 640px shows the mobile stacked layout.

## Verification steps

- [ ] `npm run dev` starts without errors
- [ ] Warm cream background (`#F5F0E8`) renders
- [ ] Header shows "Elemental Lab" title and a reset button
- [ ] Left panel shows 4 emoji circles (Water 💧, Fire 🔥, Air 💨, Earth 🌍)
- [ ] Hovering over an emoji circle shows the element name in a tooltip
- [ ] Right panel shows an open area with a faint "Drag elements here to combine" hint
- [ ] Right panel has a subtle dot-grid or pattern
- [ ] Below 640px width: panels stack vertically, collection becomes horizontal scrollable row
- [ ] No console errors
- [ ] Design check: colors, layout, spacing, typography, and mobile rules follow `design.md`

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` — does the dev server start without errors?
- Do you see a warm cream page with "Elemental Lab" in the header?
- Do you see 4 emoji circles (💧🔥💨🌍) in the left panel?
- Hover over each emoji — does the element name appear?
- Is the right side a large open space with a faint "Drag elements here to combine" hint?
- Shrink the browser to under 640px — do the panels stack vertically?

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If the layout does not match the design spec, iterate on CSS. If it takes longer than 15 minutes, ask for confirmation to simplify.

## Status

Not started