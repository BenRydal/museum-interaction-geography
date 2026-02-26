<script lang="ts">
	import { onMount } from 'svelte';
	import { appState, zoomInto } from '$lib/stores/appState.svelte';

	let w = $state(0);
	let h = $state(0);

	onMount(() => {
		w = window.innerWidth;
		h = window.innerHeight;
		const onResize = () => {
			w = window.innerWidth;
			h = window.innerHeight;
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	// Matches positionButtons() in main.js
	const xPositions = $derived([
		w / 6.83,   // zoomX1 — Bluegrass family
		w / 2.615,  // zoomX2 — Gayle family
		w / 1.595,  // zoomX3 — Business family
		w / 1.145   // zoomX4 — Mom family
	]);

	const yPositions = $derived([
		h / 2.5,    // yPosWalkway
		h / 1.56,   // yPosBluegrass
		h / 1.075   // yPosRotunda
	]);

	// 11 zoom buttons: 4 families × 3 spaces, minus Mom/Rotunda (no data)
	const buttons: { row: number; col: number; index: number }[] = [
		// Walkway row (indices 0-3)
		{ row: 0, col: 0, index: 0 },
		{ row: 0, col: 1, index: 1 },
		{ row: 0, col: 2, index: 2 },
		{ row: 0, col: 3, index: 3 },
		// Bluegrass row (indices 4-7)
		{ row: 1, col: 0, index: 4 },
		{ row: 1, col: 1, index: 5 },
		{ row: 1, col: 2, index: 6 },
		{ row: 1, col: 3, index: 7 },
		// Rotunda row (indices 8-10, no Mom family)
		{ row: 2, col: 0, index: 8 },
		{ row: 2, col: 1, index: 9 },
		{ row: 2, col: 2, index: 10 }
	];
</script>

{#if appState.view === 'smallMultiple' && w > 0}
	{#each buttons as { row, col, index }}
		<button
			class="pointer-events-auto fixed z-50 cursor-pointer rounded border border-gray-300 bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 backdrop-blur-sm transition-all duration-150 hover:border-gray-700 hover:bg-gray-800 hover:text-white"
			style="
				left: {xPositions[col]}px;
				top: {yPositions[row]}px;
				transform: translate(-50%, -50%);
			"
			onclick={() => zoomInto(index)}
		>
			Zoom
		</button>
	{/each}
{/if}
