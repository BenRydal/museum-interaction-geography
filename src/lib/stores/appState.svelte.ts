// Svelte 5 reactive store — single source of truth for UI state.
// Syncs to window._igsState so the p5 canvas can read it each frame.

export type Mode = 'movement' | 'talk' | 'curation';
export type ViewMode = 'zoom' | 'smallMultiple';

interface AppState {
	view: ViewMode;
	mode: Mode;
	space: number; // 0 | 1 | 2
	family: number; // 0 | 1 | 2 | 3
	individuals: boolean[]; // which of the 15 are toggled on
	animate: boolean;
	welcome: boolean;
}

// Initial state matching p5 defaults
const state = $state<AppState>({
	view: 'zoom',
	mode: 'movement',
	space: 1,
	family: 0,
	individuals: Array(15).fill(false),
	animate: true,
	welcome: true
});

export const appState = state;

// Sync to window so p5 draw() can read it
function syncToWindow() {
	(window as any)._igsState = {
		view: state.view,
		mode: state.mode,
		space: state.space,
		family: state.family,
		individuals: [...state.individuals],
		animate: state.animate,
		welcome: state.welcome
	};
}

// Call after any state change — we use $effect in the component that mounts this
export function setupBridge() {
	// Initial sync
	syncToWindow();

	// Expose functions for p5 → Svelte communication
	(window as any)._igsLoadIndividual = (i: number) => {
		toggleIndividual(i);
	};

}

export function syncState() {
	syncToWindow();
}

// --- Actions ---

export function setMode(mode: Mode) {
	state.mode = mode;
	// Reset animation reveal when changing modes
	(window as any)._igsResetTransition?.();
	syncToWindow();
}

export function setSpace(space: number) {
	state.space = space;
	// Tell p5 to update space selection
	(window as any)._igsSpaceSelect?.(space);
	syncToWindow();
}

export function setFamily(family: number) {
	state.family = family;
	// Tell p5 to highlight this family
	const ranges: [number, number][] = [[0, 4], [5, 8], [9, 10], [11, 14]];
	const [start, end] = ranges[family];
	(window as any)._igsFamilyHighlight?.(start, end);
	syncToWindow();
}

export function toggleIndividual(i: number) {
	// Delegate to p5's individualDisplay which handles lazy loading
	(window as any)._igsIndividualDisplay?.(i);
	// Update our state to match p5's state after toggle
	requestAnimationFrame(() => {
		const mapMovement = (window as any).mapMovement;
		if (mapMovement && mapMovement[i]) {
			state.individuals[i] = mapMovement[i].show === true;
			syncToWindow();
		}
	});
}

export function setView(view: ViewMode) {
	state.view = view;
	if (view === 'smallMultiple') {
		// When exiting zoom, show all individuals (like overZoomExitButton)
		(window as any)._igsFamilyHighlight?.(0, 14);
	}
	syncToWindow();
}

export function setAnimate(animate: boolean) {
	state.animate = animate;
	(window as any)._igsResetReveal?.();
	syncToWindow();
}

export function setWelcome(visible: boolean) {
	state.welcome = visible;
	syncToWindow();
}

export function resetAll() {
	if (state.view === 'zoom') {
		// In zoom view, reset to showing just the current family
		const ranges: [number, number][] = [[0, 4], [5, 8], [9, 10], [11, 14]];
		const [start, end] = ranges[state.family];
		(window as any)._igsFamilyHighlight?.(start, end);
	} else {
		(window as any)._igsFamilyHighlight?.(0, 14);
	}
	syncToWindow();
}

export function zoomInto(index: number) {
	state.view = 'zoom';
	(window as any)._igsZoomSelect?.(index);
	syncToWindow();
	// Read back family/space that p5 set
	requestAnimationFrame(() => {
		const ds = (window as any).displaySpace;
		const df = (window as any).displayFamily;
		if (ds !== undefined) state.space = ds;
		if (df !== undefined) state.family = df;
		syncToWindow();
	});
}
