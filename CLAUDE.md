# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive data visualization of "Interaction Geography" in a museum setting — showing 4 families (15 individuals) moving through 3 gallery spaces (Walkway, Bluegrass, Rotunda). Built with vanilla p5.js, no build system or package manager.

## Running the Project

Open `index.html` directly in a browser (Chrome recommended) or serve via any static HTTP server:

```bash
npx serve .
# or
python3 -m http.server
```

No build step, no dependencies to install. p5.js and p5.sound are loaded from CDN.

## Architecture

Four JavaScript files loaded via `<script>` tags in `index.html`:

- **main.js** — Entry point. Contains p5.js lifecycle (`preload`, `setup`, `draw`, `windowResized`), all global state variables, data loading functions, and the `Conversation`/`movementPath`/`movementZoom` classes. Assets are loaded lazily per-individual via `loadDataSmallMultiple()`, `loadDataZoom()`, and `loadDataConversation()`.
- **gui.js** — All mouse/keyboard interaction. `mousePressed()` dispatches to button handlers for individuals, modes, zoom, families, and spaces. `mouseMoved()` handles hover states. `keyPressed()` handles keyboard shortcuts.
- **zoomMethods.js** — `DrawZoom` class. Renders the single-space zoom view with per-individual movement paths, talk blocks, curation data, and conversation buttons.
- **smallMultipleMethods.js** — `DrawSmallMultiple` class. Renders the small-multiple overview with all spaces visible, plus conversation display and audio playback.

## Key Concepts

**Two views**: Zoom view (single space, default) and Small Multiple view (all spaces at once), toggled via exit/zoom buttons.

**Three modes**: Movement, Talk, and Curation — toggled via mode buttons (top-right). Each mode displays different data overlays for the selected individuals.

**Data per individual (0-14)**: Movement paths, talk blocks, and curation data are loaded as pre-rendered PNG images from `images/` (high-res) or `lowImages/` (low-res, selected when `windowWidth <= 900`).

**106 conversations**: Each has a transcript `.txt`, a conversation box `.png`, and an audio `.mp3` in `audio/`.

**Families**: Bluegrass (0-4), Gayle (5-8), Business (9-10), Mom (11-14).

**Data gaps**: Individuals 3, 11-14 have no Rotunda data. Individuals 2, 3, 4, 12 have no curation data.

## Asset Naming Convention

All image assets follow the pattern `{index}_{type}.png` where index is individual (0-14) or conversation (0-105) number:
- Movement: `{i}_movement.png`, `{i}_walkway.png`, `{i}_bluegrass.png`, `{i}_rotunda.png`
- Talk: `{i}_talk.png`, `{i}_walkwayTalk.png`, `{i}_bluegrassTalk.png`, `{i}_rotundaTalk.png`
- Curation: `{i}_curation.png`, `{i}_{space}Curation.png`
- Conversations: `{i}_conversation.txt`, `{i}_conversationBox.png`, `{i}_conversationBoxZoom.png`

## Global State

All state is in global variables in `main.js`. Key ones:
- `zoomView` — current view mode
- `movement`/`talk`/`curation` — current data mode (mutually exclusive)
- `displaySpace` (0-2) / `displayFamily` (0-3) — current zoom selections
- `mapMovement[]`, `mapTalk[]`, `mapCuration[]` — per-individual data arrays
- `mapConversation[]` — conversation data array (length 106)
- `animate`, `welcome`, `reveal` — animation/UI state
