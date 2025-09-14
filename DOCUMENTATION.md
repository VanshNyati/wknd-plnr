# Weekendly – Design Notes

> Short documentation covering why things look the way they do, how state & components are organised, and what small touches make the UI feel polished.

## Overview & Goals

**What it is.** A tiny, fast weekend planner: browse a catalogue, add items to Saturday/Sunday, reorder with drag & drop, optionally schedule times, see overlap warnings, and export a shareable image.

**Goals.**

- Feel instant on first load and smooth during drag.
- Be accessible (labels, keyboard, colour contrast).
- Keep the codebase simple enough to read in one sitting.
- Demonstrate a reusable “mini design system” via tokens + utilities.

**Non-goals.**

- Multi-user sync/realtime collab.
- Complex recurrence or calendar integrations.

---

## Major Design Decisions & Trade-offs

### 1) Stack: React + Vite

- **Why:** Fast dev cycle, tiny production output, simple code-splitting.
- **Trade-off:** No framework-level routing/data layer (not needed for a single page).

### 2) Styling: Tailwind + CSS Variables (tokens)

- **Why:** Utilities make layout work fast, tokens (`--bg`, `--panel`, `--brand`, etc.) power the **light/dark theme** without touching components.
- **Trade-off:** Tailwind classes in markup, mitigated by small component classes (`.btn`, `.panel`, `.card`) in `App.css`.

### 3) State: Zustand stores (`planStore`, `uiStore`, `toastStore`)

- **Why:** Minimal API, opt-in subscriptions via selectors, easy persistence with `localStorage` (partialize only what we need).
- **Trade-off:** Fewer guardrails than Redux Toolkit, kept safe via a small action surface and derived selectors.

### 4) Drag & Drop: `@hello-pangea/dnd`

- **Why:** Stable, accessible list DnD (successor of `react-beautiful-dnd`). Simple intra-list and cross-list moves.
- **Trade-off:** Needs a portal for the drag clone to avoid transform/blur offset. Implemented a **locked ghost** so the dragged card matches column width.

### 5) Export: `html2canvas` (+ optional Web Share API)

- **Why:** One-click share/download of the plan panel, works across browsers.
- **Trade-off:** Rasterised export, acceptable for a poster screenshot. **Lazy-loaded** so it doesn't affect initial TBT.

### 6) Virtualisation: `react-window` for the catalogue (conditional)

- **Why:** Render only visible rows once the list is big (> ~30).
- **Trade-off:** Slightly more code than a plain list, activated only when useful.

### 7) Overlap detection: single pass on sorted items

- **Why:** Sort by `startMins`, scan once, flag both sides with human message (ex: *“overlaps with Hiking 08:00–10:00”*). O(n log n) + O(n).
- **Trade-off:** Assumes within-day comparisons, good for this use case.

### 8) Persistence: `localStorage`

- **Why:** Offline by default, instant save/restore.
- **Trade-off:** No multi-device sync. Fine for a personal weekend plan.

### 9) Accessibility-first

- **Why:** Skip link, labelled controls, icon buttons with `aria-label`, focus-trap modal, Esc to close, visible focus rings.
- **Trade-off:** A bit more code, but pays off in Lighthouse and real usability.

---

## Component Design Approach

**Atomic-ish layering**

- **Atoms:** Button, Tag/Badge, Modal, Toast.
- **Molecules:** `ActivityCard`, `FilterBar`, `DayColumn` (droppable list + items).
- **Organisms:** `CatalogPanel` (filters + list), `PlannerBoard` (Saturday/Sunday columns).
- **Page:** `Planner.jsx`.

**Patterns used**

- **Presentational vs. connected:** molecules are mostly presentational, organisms wire them to Zustand selectors.
- **Derived data at the edge:** totals and overlaps are computed via selectors/util helpers to keep components lean.
- **Portal for DnD clone:** ensures ghost width/position remains stable under transforms/blur.

**Key files to skim**

- `store/planStore.js` — single source of truth for blocks and actions.
- `components/molecules/DayColumn.jsx` — droppable column + item render.
- `utils/overlaps.js` — small, testable algorithm.
- `components/catalogue/ActivityList.jsx` — virtualised list wrapper.

---

## State Management Details

**Block shape**

- `id`
- `activityId`
- `title`
- `icon`
- `category`
- `day ('sat'|'sun')`
- `startMins (number|null)`
- `durationMins`
- `notes`

**Actions**

- `addToDay(activity, 'sat'|'sun')`
- `updateBlock(id, patch)`
- `removeBlock(id)`
- `moveBlock(id, fromDay, toDay, newIndex)`

**Derived selectors**

- `selectDayBlocks(day)` (already sorted)
- `selectTotals(day)` (items count + summed minutes)
- `selectOverlaps(day)` (Map: blockId → message)

**Persistence**

- Zustand `persist` with `partialize` (store only plan data).
- UI store persists theme/filters separately.

---

## UI Polish & Micro-interactions

- **Design tokens** drive consistent theming (light/dark).
- **Panel spacing/rounded corners** create a readable rhythm across breakpoints.
- **Duration chips** in the modal = one-tap edits.
- **Inline overlap pill** near the time range, no hidden error state.
- **Keyboard**: focus trap in modal, Esc to close, visible focus outlines.
- **Performance feels**: content-visibility on heavy panes, virtualisation when needed, export libraries are lazy.

---

## Creative Features & Integrations

- **Presets bar** (Lazy / Adventurous / Family) → one-click starter plans.
- **Share / Save Image** with a watermark and white margin, Web Share API path or file download fallback.
- **Locked DnD ghost**: prevents width/position jitter while dragging.
- **Mini design system**: tokens + a few component classes (`.btn`, `.panel`, `.card`) reused everywhere.

---

## Testing & Quality

- **Vitest** unit tests for:
  - `time.js` (formatting & parsing)
  - `overlaps.js` (no overlap/overlap / ignore unscheduled)
- **Lighthouse** target ≥95 across Perf/A11y/BP/SEO in production build (run in Incognito).

---

## Known Trade-offs / Future Hooks

- No server sync, easy future path is a tiny CRUD API or Supabase.
- Export is raster (PNG). If a vector is needed, a dedicated template renderer would be required.
- DnD is list-based, time-grid drag/resizing could be added if the use case grows.

---

**Author:** Vansh Nyati
