# Interaction Geography Sierras -- Museum

An interactive data visualization for exploring how families move through, talk in, and engage with museum gallery spaces. Built on the concept of **Interaction Geography** -- an approach that extends Torsten Hagerstrand's time geography with contemporary learning sciences research to visualize collaborative human interaction across space and time.

The visualization tracks **4 families (15 individuals)** as they visit **3 gallery spaces** at the Country Music Hall of Fame and Museum, revealing patterns in movement, conversation, and engagement with exhibits.

<p align="center">
  <img src="static/images/gallery_walkway.jpg" width="32%" alt="Walkway gallery" />
  <img src="static/images/gallery_bluegrass.jpg" width="32%" alt="Bluegrass gallery" />
  <img src="static/images/gallery_rotunda.jpg" width="32%" alt="Rotunda gallery" />
</p>
<p align="center"><em>The three gallery spaces: Walkway, Bluegrass, and Rotunda</em></p>

---

## Features

**Two Views**
- **Zoom View** -- Focus on a single gallery space with detailed per-individual data
- **Small Multiple View** -- See all three spaces at once for cross-space comparison

**Three Data Modes**
- **Movement** -- Trace each person's path through a gallery over time
- **Talk** -- See when and where conversations happened, with full audio playback and transcripts
- **Curation** -- Visualize engagement with specific exhibits and displays

**Rich Conversation Data**
- 106 recorded conversations with synchronized audio and transcripts
- Draggable transcript panel with built-in audio player
- Click a conversation button to pin it; click elsewhere to dismiss

**Interactive Controls**
- Toggle individual family members on/off to compare paths
- Switch between families and gallery spaces
- Animated or static display
- Responsive layout for different screen sizes

## Gallery Spaces

| Space | Description |
|-------|-------------|
| **Walkway** | A long corridor lined with exhibits spanning country music history |
| **Bluegrass** | A gallery focused on bluegrass music heritage and instruments |
| **Rotunda** | A circular hall anchored by "Will the Circle Be Unbroken" |

## Families

| Family | Individuals | Colors |
|--------|-------------|--------|
| Bluegrass | 0--4 (5 members) | Orange, Yellow, Green, Purple, Blue |
| Gayle | 5--8 (4 members) | Orange, Yellow, Green, Purple |
| Business | 9--10 (2 members) | Orange, Yellow |
| Mom | 11--14 (4 members) | Orange, Yellow, Green, Purple |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/)

### Install & Run

```bash
git clone https://github.com/benrydal/IGS_Museum.git
cd IGS_Museum
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in **Google Chrome** (recommended).

### Build for Production

```bash
yarn build
```

Output goes to `build/` -- a fully static site you can deploy anywhere.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [SvelteKit](https://kit.svelte.dev/) with static adapter |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Visualization | [p5.js](https://p5js.org/) canvas |
| Audio | HTML5 `<audio>` |
| Language | TypeScript + JavaScript |
| Build | [Vite](https://vitejs.dev/) |

## Architecture

```
src/
  routes/+page.svelte        Main page -- composes all UI overlays
  lib/
    stores/                   Svelte 5 reactive state ($state)
      appState.svelte.ts      View, mode, family, space, individuals
      conversationPanel.svelte.ts   Transcript panel hover/lock/position
    components/
      controls/               Top bar: mode selector, animation, reset, about
      conversation/           Conversation buttons + draggable transcript panel
      welcome/                Welcome/info overlay

static/
  sketch/                     p5.js visualization (4 files)
    main.js                   Entry point, data loading, p5 lifecycle
    gui.js                    Mouse/keyboard interaction handlers
    zoomMethods.js            Single-space zoom rendering
    smallMultipleMethods.js   Small-multiple overview rendering
  images/                     High-res visualization assets
  lowImages/                  Low-res assets (screens <= 900px)
  audio/                      106 conversation audio files (.mp3)
```

**Svelte ↔ p5 Bridge**: The Svelte UI writes state to `window._igsState` each frame. The p5 `draw()` loop reads it to stay in sync. Conversation hover state flows through `window._igsConversationHover`. This lets the interactive HTML controls and the canvas visualization coexist without either owning the other.

## Data

All visualization data is pre-rendered as PNG images following the naming convention `{index}_{type}.png`:

- **Movement**: `0_movement.png`, `0_walkway.png`, `0_bluegrass.png`, `0_rotunda.png`
- **Talk**: `0_talk.png`, `0_walkwayTalk.png`, `0_bluegrassTalk.png`, `0_rotundaTalk.png`
- **Curation**: `0_curation.png`, `0_walkwayCuration.png`, etc.
- **Conversations**: `0_conversation.txt`, `0_conversationBox.png`, `0_conversationAudio.mp3`

> **Data gaps**: Individuals 3, 11--14 have no Rotunda data. Individuals 2, 3, 4, 12 have no curation data.

## Credits

Copyright (C) 2018 Ben Rydal Shapiro. All rights reserved.

Originally developed at Vanderbilt University as part of the dissertation [*Interaction Geography & the Learning Sciences*](https://etd.library.vanderbilt.edu/available/etd-03212018-140140/unrestricted/Shapiro_Dissertation.pdf).
