<script lang="ts">
	import { appState, zoomInto } from '$lib/stores/appState.svelte';

	// Row top edges aligned with visible horizontal grid lines in pre-rendered images
	const rowTops = [8, 35.5, 66.5, 100];

	// 4 families × 3 spaces, minus Mom/Rotunda (no data) = 11 cells
	const cells = Array.from({ length: 12 }, (_, i) => ({
		col: i % 4,
		row: Math.floor(i / 4),
		index: i
	})).filter((c) => !(c.row === 2 && c.col === 3));
</script>

{#if appState.view === 'smallMultiple'}
	{#each cells as { row, col, index }}
		<button
			class="pointer-events-auto fixed z-30 cursor-pointer bg-transparent transition-colors duration-150 hover:bg-white/10"
			style="
				left: {col * 25}%;
				top: {rowTops[row]}%;
				width: 25%;
				height: {rowTops[row + 1] - rowTops[row]}%;
			"
			onclick={() => zoomInto(index)}
			aria-label="Zoom into cell"
		></button>
	{/each}
{/if}
