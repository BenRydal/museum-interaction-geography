# IGS Museum — Improvement Plan

## Phase 1 (Complete)
SvelteKit + Tailwind scaffolding. Welcome screen migrated from canvas-drawn PNG to a Svelte HTML/CSS modal. Minimal bridge between Svelte and legacy p5 code. Hand cursor on interactive elements.

---

## Phase 2: Pull UI Chrome Out of Canvas into Real HTML

The highest-leverage change. Every button (individuals, families, spaces, modes, animation, about) is currently drawn on the p5 canvas with hardcoded pixel math. Move these to Svelte components so the canvas only handles the data visualization area.

**What this unlocks:**
- Real hover/focus states, tooltips, accessibility
- Responsive layout that doesn't break on resize
- Native cursor behavior (removes the `mouseMoved()` hack)
- Much easier to restyle and iterate on

**Scope:** Individual toggle buttons, family buttons, space buttons, mode buttons (Movement/Talk/Curation), animation toggle, about button, exit/zoom buttons, reset button. The canvas shrinks to just the visualization region.

### Architecture

**Svelte state store** (`src/lib/stores/appState.ts`) becomes the single source of truth. The p5 canvas reads from it, Svelte components write to it. Communication flows one way: HTML buttons → store → canvas reads store each frame.

**Bridge pattern:** Replace p5 globals with a shared state object on `window._igsState`. The Svelte store syncs to it. The p5 `draw()` loop reads from it instead of its own globals. This lets us migrate incrementally — one button group at a time.

### Svelte Store

```
appState:
  view: 'zoom' | 'smallMultiple'
  mode: 'movement' | 'talk' | 'curation'
  space: 0 | 1 | 2
  family: 0 | 1 | 2 | 3
  individuals: boolean[15]        // which are toggled on
  animate: boolean
  welcome: boolean
  grayScaleToggle: boolean
```

### Component Tree

```
+page.svelte
├── WelcomeOverlay.svelte          (exists)
├── TopBar.svelte
│   ├── FamilySelector.svelte      (4 family groups, zoom view)
│   ├── IndividualToggles.svelte   (15 colored lines/buttons)
│   └── ModeSelector.svelte        (Movement / Talk / Curation)
├── Sidebar.svelte
│   └── SpaceSelector.svelte       (3 space buttons, zoom view)
├── BottomBar.svelte
│   ├── AnimationToggle.svelte     (on/off)
│   └── AboutButton.svelte         (re-opens welcome)
├── ViewToggle.svelte              (exit zoom / enter zoom buttons)
└── <canvas> (p5 — just the visualization)
```

### Implementation Steps

#### Step 1: Create the Svelte store + window bridge

Create `src/lib/stores/appState.ts` with a Svelte 5 reactive store. On every change, sync to `window._igsState` so p5 can read it.

Modify `static/sketch/main.js` to read from `window._igsState` instead of local globals at the top of `draw()`. Keep the globals as fallbacks so the app works even if the store hasn't loaded yet:

```js
// Top of draw()
var s = window._igsState;
if (s) {
    zoomView = s.view === 'zoom';
    movement = s.mode === 'movement';
    talk = s.mode === 'talk';
    curation = s.mode === 'curation';
    displaySpace = s.space;
    displayFamily = s.family;
    animate = s.animate;
    welcome = s.welcome;
    grayScaleToggle = s.grayScaleToggle;
}
```

Also expose a `window._igsLoadIndividual(i)` function for Svelte to call when toggling individuals (triggers data loading in p5).

#### Step 2: Mode selector (Movement / Talk / Curation)

Create `ModeSelector.svelte` — 3 buttons in a row, top-right. Styled as pill/tab group. Writes to `appState.mode`.

Remove `overMapButton()` from gui.js click handling. Remove the `rect()` drawing calls for mode buttons from `drawMovementZoom()`, `drawTalkZoom()`, `drawCurationZoom()`, `drawMovement()`, `drawTalk()`, `drawCuration()`.

#### Step 3: Individual toggle buttons

Create `IndividualToggles.svelte` — 4 family groups, each with colored toggle lines/buttons. Reads `appState.individuals[]`, calls `window._igsLoadIndividual(i)` on click.

Remove `drawIndividualDisplayButtons()` from gui.js. Remove `overIndividualButton()` from `mousePressed()`.

Colors per individual:
- Orange (#F26522): 0, 9, 12
- Yellow (#FFDE17): 1, 5, 11
- Green (#00A14B): 2, 7, 13
- Purple (#7F3F98): 3, 6, 10, 14
- Blue (#214099): 4, 8

#### Step 4: Family selector (zoom view)

Create `FamilySelector.svelte` — 4 buttons (Bluegrass, Gayle, Business, Mom). Writes to `appState.family`, triggers `familyHighlight()` via bridge.

Remove family button drawing from `DrawZoom.draw()`. Remove `overZoomFamilyButton()` from `mousePressed()`.

#### Step 5: Space selector (zoom view)

Create `SpaceSelector.svelte` — 3 buttons (Walkway, Bluegrass, Rotunda). Writes to `appState.space`, triggers `spaceSelect()` via bridge.

Remove space button drawing from `DrawZoom.draw()`. Remove `overZoomSpaceButton()` from `mousePressed()`.

#### Step 6: Animation toggle + About button

Create `BottomBar.svelte` with animation on/off toggle and "About" button. About button sets `appState.welcome = true`.

Remove `drawIntroMsgs()` call and function. Remove `overIntroButtons()` from `mousePressed()`.

#### Step 7: View toggle (zoom ↔ small multiple)

Create `ViewToggle.svelte`:
- In zoom view: "View All" button (replaces the large exit ellipse)
- In small multiple view: 11 zoom-in buttons overlaid on the canvas at the family×space intersections (these may stay as canvas-drawn or become positioned HTML buttons)

Remove `overZoomExitButton()` and `overZoomButton()` from `mousePressed()`.

#### Step 8: Remove `mouseMoved()` cursor hack

With all buttons in HTML, native CSS `cursor: pointer` handles everything. Delete the entire `mouseMoved()` function from gui.js. The only remaining cursor logic is for conversation buttons (Phase 3).

#### Step 9: Reset + grayscale toggle (small multiple view)

Create a small control for "Reset" and "Show/Hide paths" in the sidebar area. Remove `reset()` function call from `mousePressed()`.

### Migration Strategy

Each step is independently shippable. After each step:
1. The new Svelte component renders and works
2. The corresponding canvas drawing code is removed
3. The corresponding click handler in gui.js is removed
4. Everything else still works

We go in the order above because mode selector and individual toggles are the most visually impactful and have the simplest bridge requirements. View toggle is last because the 11 zoom-in buttons have complex positioning tied to the canvas layout.

### Files Modified

| File | Changes |
|------|---------|
| `src/lib/stores/appState.ts` | New — reactive store + window bridge |
| `src/routes/+page.svelte` | Add layout with TopBar, Sidebar, BottomBar, ViewToggle |
| `src/lib/components/` | New components for each button group |
| `static/sketch/main.js` | Read from `window._igsState` in `draw()`, expose load functions |
| `static/sketch/gui.js` | Progressively remove drawing + click handler functions |
| `static/sketch/zoomMethods.js` | Remove button drawing from `DrawZoom.draw()` |
| `static/sketch/smallMultipleMethods.js` | No changes until Step 7 (zoom buttons) |

---

## Phase 3: Better Conversation Experience

Conversations currently trigger on hover (easy to accidentally activate), play audio immediately with no controls, and show raw text in a canvas-drawn bubble. Replace with a Svelte conversation panel.

**Improvements:**
- Click to open instead of hover
- Audio player with play/pause/scrub controls
- Scrollable transcript with speaker labels
- Panel that doesn't block the visualization

---

## Phase 4: Responsive / Mobile Support

The layout assumes a large screen. Button positions are ratios of `width`/`height` that don't adapt well. With HTML UI from Phase 2, build a proper responsive layout.

**Improvements:**
- Stacked layout on mobile, side-by-side on desktop
- Touch-friendly controls
- Breakpoints for tablet/phone

---

## Phase 5: URL State / Deep Linking

No way to share a specific view. Add hash-based routing so the current state (family, space, mode, selected individuals) is reflected in the URL.

**Improvements:**
- Shareable links to specific views (e.g. `#family=bluegrass&space=walkway&mode=talk`)
- Browser back/forward navigation between views
- Bookmarkable states

---

## Phase 6: Progressive Data Loading with Feedback

Clicking an individual silently triggers `loadImage()` calls with no loading indicator. Users see nothing until images finish loading.

**Improvements:**
- Loading spinner or progress bar when data is being fetched
- Preload commonly-viewed data (e.g. default family on startup)
- Graceful error handling for failed asset loads

---

## Phase 7: Visual Design Refresh

The data imagery (movement paths, talk blocks) is pre-rendered PNGs, so the data rendering itself can't change. But the surrounding UI can be modernized.

**Improvements:**
- Updated typography, spacing, and color palette
- Clearer legends and labels
- Consistent visual language between the HTML UI and canvas content
- Better use of whitespace and visual hierarchy
