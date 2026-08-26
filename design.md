# Design Direction

## Design Inspiration URL

https://designmd.ai/chef/typegallery-design-system

## What We Borrow

- Warm cream background (`#F5F0E8`) as the main surface — softer than white.
- Deep brown (`#3C1518`) for strong text and key UI borders — warm contrast without harsh black.
- Rust/terracotta accent (`#A44A3F`) for discovery notifications and special highlights.
- Clean, flat, shadowless aesthetic — nothing competes with the element icons.
- Thoughtful spacing and breathing room — no cramped UI.

## What We Do Not Copy

- Editorial/magazine layouts.
- Hero sections, large typography displays, or specimen-style text blocks.
- Content cards with text paragraphs.
- Formal or luxury branding feel.
- Any Intentionally designed for a graphic-design portfolio — we are making a discovery game.

## Visual Mood

Playful, tactile, warm, curious, magical, discovery-driven. The interface feels like a personal laboratory bench. Elements are the stars — charming collectible objects. The cream/brown palette keeps it calm and grounded; the rust accent adds a spark of excitement on discovery.

## Layout Rules

- Two-panel layout: fixed-width collection panel on the left, fluid laboratory workspace on the right.
- Laboratory takes the majority of screen width — an open, spacious surface.
- Collection panel scrolls vertically as more elements are discovered.
- No cards or boxed sections inside the laboratory — elements float freely on the workspace.
- Header is minimal: game title (small) and a subtle reset button.
- 12px or 16px base spacing unit (moderate, not tight).

## Color / Contrast Rules

- Background: `#F5F0E8` (warm cream).
- Primary text / borders: `#3C1518` (deep brown).
- Accent / discovery highlights: `#A44A3F` (rust/terracotta).
- Element icons: primarily displayed as emoji; background circle or subtle badge in a light tone.
- Empty workspace: subtle grid or dot pattern to suggest a lab surface.
- All text must pass WCAG AA contrast against the cream background.
- Never use pure white (`#FFFFFF`) as a background — only for element icon badges if needed.

## Typography Feel

- One clean sans-serif font family throughout (e.g. Manrope, Inter, or system-ui).
- No oversized headings. Title is small and discreet in the header.
- Element names appear on hover — use a smooth, readable weight (e.g. 500 or 600).
- Discovery notification text is slightly larger and uses the rust accent color.
- No serif or decorative typeface — keep it simple and game-appropriate.

## Component Style

- **Header**: thin bar at the top. Small game name on the left, subtle reset icon/button on the right.
- **Collection panel**: light cream background, slightly darker border than the main surface. Each element is a circular or softly rounded icon. Hover reveals a small tooltip with the element name.
- **Element icon in collection**: ~48px emoji on a subtle circular background. Shows grab-cursor. On drag, the icon becomes semi-transparent.
- **Laboratory workspace**: large open area, no internal dividers. Subtle dot-grid or light texture suggests a lab bench. Elements placed here are ~56px with a very light circular badge, freely movable.
- **Workspace element**: same emoji icon, slightly larger (56px). Drop shadow is very subtle or absent per the flat aesthetic. On drag within workspace, follows cursor.
- **Discovery notification**: a small centered toast or floating label appears when a new element is discovered. Uses the rust accent color. Auto-dismisses after 2 seconds.
- **Empty state**: laboratory shows a faint instructional hint (e.g. "Drag elements here to combine") in a muted brown tone. Disappears once an element is placed.

## Mobile Rules

- Below 640px width: panels stack vertically. Collection panel becomes a horizontal scrollable row at the top; laboratory takes the remaining space below.
- Element icons shrink slightly on small screens (40px collection, 48px workspace).
- Drag and drop is replaced by tap-to-select / tap-to-place on mobile touch. Combination is attempted by tapping one element then tapping another.
- Discovery toast adjusts to full-width at the top of the screen.
- Reset button remains accessible but small.

## Accessibility Basics

- All interactive elements are focusable and operable by keyboard.
- Element names in the collection are announced by screen readers on focus (aria-label).
- Discovery announcements use `aria-live="polite"`.
- Color is not the only differentiator — elements are identified by emoji icon and name.
- Touch targets at least 44px.
- Focus-visible ring uses the rust accent color.

## Anti-Slop Rules

- No fake logos, testimonials, or stats.
- No placeholder or lorem ipsum text in the final build.
- No copied brand identity, images, or content from any source.
- One clear primary action per screen: combine elements.
- Readable on phone width (stacked layout).
- No gradients, drop shadows, rounded corners larger than 8px, or ornamental graphics.
- No unused or dead UI — every visible element serves the core loop.

## Design Verification Checklist

- [ ] Warm cream background, deep brown text and borders, rust accent for discoveries.
- [ ] Two-panel layout (stacked on mobile).
- [ ] Collection panel scrolls; laboratory is open and spacious.
- [ ] Element icons are circular, emoji-based, visually prominent.
- [ ] Hover shows element name.
- [ ] Discovery toast appears and auto-dismisses.
- [ ] Empty-state hint in the laboratory.
- [ ] Mobile: horizontal collection, tap-to-combine.
- [ ] Keyboard focusable and screen-reader friendly.
- [ ] No editorial layout, no oversized text, no luxury branding.