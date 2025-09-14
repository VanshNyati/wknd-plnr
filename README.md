# Weekendly — plan a delightful weekend

> A weekend planner to browse activities, build a Saturday–Sunday schedule, drag to rearrange, edit details, and share as a poster.

**Live demo:** _<https://wknd-plnr.vercel.app>_  
**Walkthrough video:** _<link here>_

---

## ✨ Features

**Core**

- Activity **catalog** with search + filters (Category, Vibe).
- **Add** activities to **Saturday** or **Sunday**.
- **Visual schedule**: clean cards with day totals.
- **Edit** item (notes, duration chips, optional start time).
- **Remove** item.

**Bonus / Polish**

- **Drag & Drop** reordering (and cross-day move) via `@hello-pangea/dnd` with a locked clone for stable visuals.
- **Overlap analyzer**: inline warning when times conflict (e.g., “overlaps with Hiking 08:00–10:00”).
- **Presets**: Lazy / Adventurous / Family starter plans.
- **Theme toggle** (light/dark) using CSS variables (mini design-system tokens).
- **Share / Save Image**: export `#plan-panel` as a poster (Web Share API when supported; otherwise download).
- **Persistence**: plan stored in localStorage.
- **Responsive** layout (mobile → desktop).

**Super-stretch touches**

- **Performance**: conditional list virtualization (catalog) with `react-window`, `content-visibility` on heavy panes, Zustand partialization to reduce re-renders.
- **Testing**: unit tests for time utils + overlap analyzer (Vitest).

---

## 🧱 Tech & Architecture

- **React + Vite**
- **Tailwind CSS** (utility-first + a few component classes in `App.css`)
- **Zustand** state (`/src/store`)
  - `planStore`: blocks, add/remove/update/move, persisted
  - `uiStore`: filters + theme
- **D&D**: `@hello-pangea/dnd`
- **Virtualization**: `react-window` (catalog when large)
- **Export**: `html2canvas` (+ optional `canvas-confetti`)
- **Tests**: Vitest

**Block shape**

```ts
{
  id: string;
  activityId: string;
  title: string;
  icon: string;
  category: 'Food'|'Outdoor'|'Indoor'|'Social'|'Fitness';
  day: 'sat'|'sun';
  startMins: number | null; // minutes since 00:00
  durationMins: number;
  notes: string;
}
```

**Overlap idea**: Sort scheduled blocks by startMins; while scanning, if curr.start < prev.end, flag both with a human message.

---

## 🚀 Getting Started

```
# install deps
npm i

# dev server
npm run dev

# production build
npm run build

# preview build
npm run preview

# unit tests (Vitest)
npm test
```

No environment variables are required.

---

## 📂 Project Structure

```
src/
  assets/
  components/
    atoms/ (Button, Modal, Tag, Toast…)
    molecules/ (ActivityCard, FilterBar, PresetBar, DayColumn)
    organisms/ (CatalogPanel, PlannerBoard)
    catalog/ (ActivityList - virtualized)
  data/ (activities, presets)
  pages/ (Planner.jsx)
  store/ (planStore.js, toastStore.js, uiStore.js)
  utils/ (time.js, share.js, persist.js)
    __tests__/ (time.test.js, overlaps.test.js)
  App.jsx
  App.css
  main.jsx
```

---

## 🎨 Design System & Themes

- **Tokens** are defined as CSS variables in `App.css`:
  - `--bg`, `--panel`, `--muted`, `--ring`, `--brand`, `--brand-600`, `--shadow`.
- **Theme switch** toggles `data-theme="light"` on `<html>`.
- Component classes (`.btn-*`, `.card`, `.panel`, `.heading-*`, etc.) consume tokens so the whole app restyles consistently.
- This is the “mini design system” that demonstrates reuse across atoms → organisms.

---

## ♿ Accessibility

- **Skip link** at the top (“Skip to content”).
- All inputs have labels or `aria-label`.
- Buttons with only icons have descriptive labels.
- Modal traps focus on open and closes via **Esc** / backdrop.
- Drag handles are clearly indicated; tabbing still reaches Edit/Remove.
- Color contrast checked for light/dark themes.

---

## 🧲 Drag & Drop Behavior

- Library: `@hello-pangea/dnd`.
- **Vertical-only** sort inside each day; cross-day move by dropping into the other day.
- A **locked clone** keeps the dragged card’s **width aligned** with the column to prevent “jumping”.
- Column placeholder preserves layout to avoid CLS (layout shift) during drag.

---

## 🖼️ Share / Save Export

- One-click “Share / Save Image” exports the `#plan-panel`:
  - Uses `html2canvas` at device-pixel-friendly scale.
  - Adds white **margin** and a subtle **watermark**.
  - Tries **Web Share API** with a PNG; falls back to a download.
- This is great for sending the weekend plan to friends / socials.

---

## ⚙️ Performance Notes

- **Virtualization**: When the catalog grows beyond ~30 items, it switches to `react-window` to render only visible cards.
- **Content-visibility**: `content-visibility: auto` on heavier panes defers offscreen work.
- **Zustand partialization** reduces re-renders by persisting only relevant slices.
- CSS-only animations - no layout thrash during drag thanks to prepared dimensions.

---

## 🧪 Tests (Vitest)

Tests live in `src/utils/__tests__/`:

- `time.test.js` — `minsToHhmm`, `hhmmToMins`, `formatRange`
- `overlaps.test.js` — `analyzeOverlaps` (no overlap, overlapping windows, unscheduled ignored)

Run:

```bash
npm test
```

---

## 🔎 Lighthouse Checklist

Target: ≥ 95 across Performance, A11y, Best Practices, SEO.

1) Open the app in Incognito.

2) DevTools → Lighthouse → Mode Navigation, Device Desktop.

3) Disable cache, Simulate throttling ON (default).

4) Analyze and export the report (keep the JSON/HTML for submission).

5) If any score dips:

- Perf: keep the page idle (no animations), confirm images/fonts are small, watch Total     Blocking Time (<150ms).
- A11y: ensure all interactive controls have names; check contrast in both themes.
- SEO: unique <title>, <meta name="description">, and semantic headings.

---

## ⚙️ How It Works

**Flow**

1. Catalog data is loaded from `src/data/activities.js`.
2. Interactions (search, filters, theme) update **uiStore** (Zustand).
3. Adding to a day creates a **block** in **planStore** → persisted via `localStorage`.
4. On every plan change:
   - `analyzeOverlaps()` recomputes conflicts for visible cards.
   - Day totals (count + time) are derived from store selectors.
5. Export uses `html2canvas` on `#plan-panel` and triggers Share/Download.

**Why these choices**

- **Zustand** → tiny API, simple selectors, no boilerplate.
- **hello-pangea/dnd** → most stable DnD for lists, great accessibility story.
- **react-window (conditional)** → only kicks in when needed; keeps code small.
- **Tailwind + tokens** → fast iteration; instant theme swap via CSS variables.

---

#### Made with ❤️ by Vansh Nyati
