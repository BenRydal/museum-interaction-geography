<script lang="ts">
	import { onMount } from 'svelte';
	import { appState, toggleIndividual, setFamily } from '$lib/stores/appState.svelte';

	let { navbarHeight = 0 }: { navbarHeight?: number } = $props();

	// Track which individuals are showing by reading p5 state
	let showing = $state(Array(15).fill(false));

	// Window dimensions for positioning (matches p5 canvas)
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

	// Poll p5 state to stay in sync
	$effect(() => {
		const interval = setInterval(() => {
			const mapMovement = (window as any).mapMovement;
			if (mapMovement) {
				for (let i = 0; i < 15; i++) {
					if (mapMovement[i] && mapMovement[i].show !== undefined) {
						showing[i] = mapMovement[i].show === true;
					}
				}
			}
			// View mode sync: p5 → Svelte is handled via igsStateSync events
			// (dispatched by overZoomButton in gui.js), not polling, to avoid race conditions
		}, 100);
		return () => clearInterval(interval);
	});

	// Family starting X positions — shifted right to center over visualizations
	const xOffset = $derived(w * 0.018);
	function familyX(familyIdx: number): number {
		if (familyIdx === 0) return w / 15 + xOffset;
		if (familyIdx === 1) return w / 3.15 + xOffset;
		if (familyIdx === 2) return w / 1.68 + xOffset;
		return w / 1.24 + xOffset;
	}

	const nameGap = $derived(w / 30);
	const headerY = $derived(Math.max(h * 0.058, navbarHeight + 4));
	const nameY = $derived(Math.max(h * 0.08, navbarHeight + 22));

	interface Member {
		idx: number;
		name: string;
		sup: string;
	}

	interface Family {
		id: number;
		name: string;
		members: Member[];
	}

	const families: Family[] = [
		{
			id: 0,
			name: 'BLUEGRASS FAMILY',
			members: [
				{ idx: 0, name: 'Adhir', sup: '23' },
				{ idx: 1, name: 'Lily', sup: '20' },
				{ idx: 2, name: 'Jeans', sup: '10' },
				{ idx: 3, name: 'Mae', sup: 'Mom' },
				{ idx: 4, name: 'Blake', sup: '6' }
			]
		},
		{
			id: 1,
			name: 'WOMEN IN MUSIC FAMILY',
			members: [
				{ idx: 5, name: 'Rachel', sup: '22' },
				{ idx: 6, name: 'Hsu', sup: 'Mom' },
				{ idx: 7, name: 'Amy', sup: '21' },
				{ idx: 8, name: 'Maya', sup: '22' }
			]
		},
		{
			id: 2,
			name: 'BUSINESS PARTNERS',
			members: [
				{ idx: 9, name: 'Andy', sup: '30s' },
				{ idx: 10, name: 'Kate', sup: '30s' }
			]
		},
		{
			id: 3,
			name: 'TAYLOR SWIFT FAMILY',
			members: [
				{ idx: 11, name: 'Allison', sup: '9' },
				{ idx: 12, name: 'Dave', sup: 'Dad' },
				{ idx: 13, name: 'Shay', sup: '15' },
				{ idx: 14, name: 'Mika', sup: 'Mom' }
			]
		}
	];

	// Color map: individual index → hex color
	const colors: Record<number, string> = {
		0: '#F26522',
		9: '#F26522',
		12: '#F26522',
		1: '#FFDE17',
		5: '#FFDE17',
		11: '#FFDE17',
		2: '#00A14B',
		7: '#00A14B',
		13: '#00A14B',
		3: '#7F3F98',
		6: '#7F3F98',
		10: '#7F3F98',
		14: '#7F3F98',
		4: '#214099',
		8: '#214099'
	};

	const uiFont = `'Inter', sans-serif`;
</script>

<style>
	.individual-btn {
		transition: color 0.15s ease, border-color 0.15s ease;
		padding-bottom: 2px;
		border-bottom: 2px solid transparent;
	}
	.individual-btn:hover {
		color: #333 !important;
	}
</style>

{#if w > 0}
{#each families as family}
	{@const startX = familyX(family.id)}
	{@const groupWidth = (family.members.length - 1) * nameGap}
	{@const groupCenterX = startX + groupWidth / 2}

	<!-- Family header (clickable to select family) -->
	<button
		class="pointer-events-auto fixed z-50 cursor-pointer border-none bg-transparent p-0"
		style="
			left: {groupCenterX}px;
			top: {headerY}px;
			transform: translateX(-50%);
			font-family: {uiFont};
			font-size: clamp(8px, 0.85vw, 13px);
			font-weight: 500;
			color: {appState.view === 'zoom' && appState.family === family.id ? '#333' : '#888'};
			letter-spacing: 0.08em;
		"
		onclick={() => setFamily(family.id)}
	>
		{family.name}
	</button>

	<!-- Individual name buttons -->
	{#each family.members as member, memberIdx}
		{@const x = startX + memberIdx * nameGap}
		<button
			class="individual-btn pointer-events-auto fixed z-50 cursor-pointer bg-transparent p-0"
			style="
				left: {x}px;
				top: {nameY}px;
				transform: translateX(-50%);
				font-family: {uiFont};
				font-size: clamp(9px, 0.85vw, 14px);
				font-weight: 400;
				color: {showing[member.idx] ? '#333' : '#999'};
				border-bottom-color: {showing[member.idx] ? colors[member.idx] : 'transparent'};
				white-space: nowrap;
			"
			title="{member.name} ({member.sup})"
			onclick={() => toggleIndividual(member.idx)}
		>
			{member.name}<sup style="font-size: 0.65em; vertical-align: super;">{member.sup}</sup>
		</button>
	{/each}
{/each}
{/if}
