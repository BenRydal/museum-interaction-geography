// Shared reactive state for the draggable transcript panel.
// Bridges conversation buttons (hover) ↔ transcript panel (display).

interface PanelState {
	hoveredIndex: number | null;
	lines: string[];
	audioSrc: string;
	visible: boolean;
	locked: boolean;
	panelX: number;
	panelY: number;
}

const state = $state<PanelState>({
	hoveredIndex: null,
	lines: [],
	audioSrc: '',
	visible: true,
	locked: false,
	panelX: -1,
	panelY: -1
});

export const panelState = state;

function resetHover() {
	state.hoveredIndex = null;
	state.lines = [];
	state.audioSrc = '';
}

export function setHover(index: number, lines: string[], audioSrc: string) {
	state.hoveredIndex = index;
	state.lines = lines;
	state.audioSrc = audioSrc;
	state.visible = true;
}

export function clearHover() {
	if (!state.locked) resetHover();
}

export function lockHover() {
	state.locked = true;
}

export function unlock() {
	state.locked = false;
	resetHover();
}

export function setPanelVisible(visible: boolean) {
	state.visible = visible;
}

export function setPanelPosition(x: number, y: number) {
	state.panelX = x;
	state.panelY = y;
}
