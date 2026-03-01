<script lang="ts">
	import { onMount } from 'svelte';
	import { appState, setSpace } from '$lib/stores/appState.svelte';
	import IndividualToggles from './IndividualToggles.svelte';

	let { navbarHeight = 0 }: { navbarHeight?: number } = $props();

	let w = $state(0);
	let h = $state(0);

	onMount(() => {
		const onResize = () => {
			w = window.innerWidth;
			h = window.innerHeight;
		};
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	const galleries = [
		{ name: 'FOLK ROOTS', spaceId: 0 },
		{ name: 'BLUEGRASS', spaceId: 1 },
		{ name: 'ROTUNDA', spaceId: 2 }
	];

	const galleryYPct = [0.30, 0.57, 0.85];
</script>

<style>
	.gallery-label {
		position: absolute;
		transform: rotate(-90deg);
		transform-origin: left top;
		pointer-events: auto;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
		padding: 3px 8px;
		border: none;
		border-radius: 5px;
		background: transparent;
		color: #aaa;
		cursor: pointer;
		transition: color 0.15s ease, background-color 0.15s ease;
	}
	.gallery-label:hover {
		background-color: rgba(0, 0, 0, 0.06);
		color: #666;
	}
	.gallery-label.active {
		background-color: #333;
		color: #fff;
	}
	.gallery-label.active:hover {
		background-color: #444;
		color: #fff;
	}
</style>

{#if w > 0}
<div class="pointer-events-none fixed inset-0 z-40">
	<IndividualToggles {navbarHeight} />

	<!-- Vertical guide lines -->
	<div
		class="absolute"
		style="left: {w * 0.02}px; top: {h * 0.12}px; width: 1.5px; height: {h * 0.835}px; background: #BCBEC0;"
	></div>
	<div
		class="absolute"
		style="left: {w * 0.025}px; top: {h * 0.12}px; width: 1px; height: {h * 0.835}px; background: rgba(35, 31, 32, 0.25);"
	></div>

	<!-- Gallery space labels -->
	{#each galleries as { name, spaceId }}
		{@const textWidth = name.length * 9}
		<button
			class="gallery-label"
			class:active={appState.view === 'zoom' && appState.space === spaceId}
			style="left: {w * 0.005}px; top: {h * galleryYPct[spaceId] + textWidth / 2}px;"
			onclick={() => setSpace(spaceId)}
		>
			{name}
		</button>
	{/each}
</div>
{/if}
