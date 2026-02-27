<script lang="ts">
	import { onMount } from 'svelte';
	import { appState } from '$lib/stores/appState.svelte';
	import { panelState, setHover, clearHover, lockHover, unlock } from '$lib/stores/conversationPanel.svelte';

	interface ButtonGroup {
		startIndex: number;
		endIndex: number;
		family: number;
		space: number;
	}

	let w = $state(0);
	let h = $state(0);
	let hoveredIndex = $state<number | null>(null);

	const textCache = new Map<number, string[]>();

	// Conversation index ranges: RANGES[family][space] → [startIndex, endIndex]
	const RANGES: Record<number, Record<number, [number, number]>> = {
		0: { 0: [0, 9], 1: [10, 29], 2: [30, 38] },
		1: { 0: [39, 57], 1: [58, 66], 2: [67, 71] },
		2: { 0: [72, 82], 1: [83, 84], 2: [85, 85] },
		3: { 0: [86, 89], 1: [90, 105] }
	};

	const ZOOM_SIZE = 14;
	const ZOOM_GAP = 14;
	const SM_SIZE = 7;
	const SM_GAP = 7;

	const isZoom = $derived(appState.view === 'zoom');

	const buttonGroups = $derived.by((): ButtonGroup[] => {
		if (appState.mode !== 'talk' || appState.welcome) return [];

		if (isZoom) {
			const range = RANGES[appState.family]?.[appState.space];
			if (!range) return [];
			return [{ startIndex: range[0], endIndex: range[1], family: appState.family, space: appState.space }];
		}

		const groups: ButtonGroup[] = [];
		for (let fam = 0; fam < 4; fam++) {
			for (let sp = 0; sp < 3; sp++) {
				const range = RANGES[fam]?.[sp];
				if (range) groups.push({ startIndex: range[0], endIndex: range[1], family: fam, space: sp });
			}
		}
		return groups;
	});

	function zoomBasePos(space: number): [number, number] {
		if (space === 0) return [w / 2.4, h / 1.09];
		if (space === 1) return [w / 2.8, h / 1.15];
		return [w / 1.8, h / 1.12];
	}

	function smBasePos(family: number, space: number): [number, number] {
		const xPositions = [w / 6.2, w / 2.475, w / 1.58, w / 1.19];
		const yPositions = [h / 2.5, h / 1.56, h / 1.075];
		return [xPositions[family], yPositions[space]];
	}

	function getButtonPos(group: ButtonGroup, index: number): { x: number; y: number; size: number } {
		const gap = isZoom ? ZOOM_GAP : SM_GAP;
		const size = isZoom ? ZOOM_SIZE : SM_SIZE;
		const [baseX, baseY] = isZoom ? zoomBasePos(group.space) : smBasePos(group.family, group.space);
		return { x: baseX + (index - group.startIndex) * gap, y: baseY, size };
	}

	async function fetchText(index: number): Promise<string[]> {
		if (textCache.has(index)) return textCache.get(index)!;
		const dir = w > 900 ? 'images' : 'lowImages';
		const resp = await fetch(`/${dir}/${index}_conversation.txt`);
		const raw = await resp.text();
		const lines = raw.split('\n').filter((l) => l.trim().length > 0);
		textCache.set(index, lines);
		return lines;
	}

	function setBridge(active: boolean, index?: number) {
		(window as any)._igsConversationHover = active ? { active: true, index } : { active: false };
	}

	function handleMouseEnter(index: number) {
		hoveredIndex = index;

		fetchText(index).then((lines) => {
			if (hoveredIndex === index) {
				setHover(index, lines, `/audio/${index}_conversationAudio.mp3`);
			}
		});

		setBridge(true, index);

		// Lazy-load conversation images in p5 if needed
		const mc = (window as any).mapConversation;
		if (mc && (mc[index] == null || mc[index] === -1)) {
			(window as any).loadDataConversation?.(index);
		}
	}

	function handleClick() {
		lockHover();
	}

	function handleMouseLeave() {
		hoveredIndex = null;
		clearHover();
		if (!panelState.locked) setBridge(false);
	}

	function handleGlobalClick(e: MouseEvent) {
		if (!panelState.locked) return;
		const target = e.target as HTMLElement;
		if (target.closest('[data-conversation-button]') || target.closest('[data-transcript-panel]')) return;
		unlock();
		setBridge(false);
	}

	onMount(() => {
		w = window.innerWidth;
		h = window.innerHeight;
		const onResize = () => { w = window.innerWidth; h = window.innerHeight; };

		window.addEventListener('resize', onResize);
		document.addEventListener('click', handleGlobalClick);
		setBridge(false);

		return () => {
			window.removeEventListener('resize', onResize);
			document.removeEventListener('click', handleGlobalClick);
			setBridge(false);
		};
	});
</script>

{#if w > 0}
	{#each buttonGroups as group}
		{@const count = group.endIndex - group.startIndex + 1}
		{#each { length: count } as _, i}
			{@const idx = group.startIndex + i}
			{@const pos = getButtonPos(group, idx)}
			{@const isActive = hoveredIndex === idx || (panelState.locked && panelState.hoveredIndex === idx)}
			<button
				data-conversation-button
				aria-label="Conversation {idx}"
				class="pointer-events-auto fixed z-40 cursor-pointer rounded-full border transition-transform duration-100
					{isActive
					? 'scale-125 border-gray-700 bg-gray-800'
					: 'border-gray-500 bg-transparent hover:scale-110 hover:border-gray-700'}"
				style="
					left: {pos.x}px;
					top: {pos.y}px;
					width: {pos.size}px;
					height: {pos.size}px;
					transform: translate(-50%, -50%) {isActive ? 'scale(1.25)' : ''};
				"
				onmouseenter={() => handleMouseEnter(idx)}
				onmouseleave={handleMouseLeave}
				onclick={handleClick}
			></button>
		{/each}

	{/each}
{/if}
