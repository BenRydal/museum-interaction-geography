<script lang="ts">
	import { onMount } from 'svelte';
	import { appState, setSpace } from '$lib/stores/appState.svelte';
	import IndividualToggles from './IndividualToggles.svelte';

	let { navbarHeight = 0 }: { navbarHeight?: number } = $props();

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

	const galleries = [
		{ name: 'FOLK ROOTS', spaceId: 0 },
		{ name: 'BLUEGRASS', spaceId: 1 },
		{ name: 'ROTUNDA', spaceId: 2 }
	];

	// Gallery label Y center positions (centered in each gallery section)
	function galleryY(id: number): number {
		if (id === 0) return h * 0.30;
		if (id === 1) return h * 0.57;
		return h * 0.85;
	}
</script>

<!-- Full-screen text overlay replacing baseGrid.png text -->
{#if w > 0}
<div class="pointer-events-none fixed inset-0 z-40" style="font-family: 'Playfair Display', serif;">
	<!-- Individual toggles with family headers -->
	<IndividualToggles {navbarHeight} />

	<!-- Vertical guide lines (matching original baseGrid.png) -->
	<div
		class="absolute"
		style="
			left: {w * 0.02}px;
			top: {h * 0.12}px;
			width: 1.5px;
			height: {h * 0.835}px;
			background: #BCBEC0;
		"
	></div>
	<div
		class="absolute"
		style="
			left: {w * 0.025}px;
			top: {h * 0.12}px;
			width: 1px;
			height: {h * 0.835}px;
			background: rgba(35, 31, 32, 0.25);
		"
	></div>

	<!-- Gallery labels (left edge, vertical text, clickable to select space) -->
	{#each galleries as { name, spaceId }}
			{@const textWidth = name.length * 9}
			<button
				class="pointer-events-auto absolute cursor-pointer border-none bg-transparent p-0 transition-colors duration-150"
				style="
					left: {w * 0.005}px;
					top: {galleryY(spaceId) + textWidth / 2}px;
					transform: rotate(-90deg);
					transform-origin: left top;
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-weight: 500;
					color: {appState.view === 'zoom' && appState.space === spaceId ? '#333' : '#bbb'};
					letter-spacing: 0.12em;
					text-transform: uppercase;
					white-space: nowrap;
				"
				onclick={() => setSpace(spaceId)}
			>
				{name}
			</button>
		{/each}
</div>
{/if}
