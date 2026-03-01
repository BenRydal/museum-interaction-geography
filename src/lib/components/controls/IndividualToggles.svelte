<script lang="ts">
	import { appState, toggleIndividual, setFamily } from '$lib/stores/appState.svelte';

	let { navbarHeight = 0 }: { navbarHeight?: number } = $props();

	// Track which individuals are showing by reading p5 state
	let showing = $state(Array(15).fill(false));

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
		}, 100);
		return () => clearInterval(interval);
	});

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

	// Center positions matching visualization columns (from ZoomButtons.svelte)
	const familyCenterPct = ['14.64%', '38.24%', '62.70%', '87.34%'];

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

	const colors: Record<number, string> = {
		0: '#F26522', 9: '#F26522', 12: '#F26522',  // orange
		1: '#FFDE17', 5: '#FFDE17', 11: '#FFDE17',  // yellow
		2: '#00A14B', 7: '#00A14B', 13: '#00A14B',  // green
		3: '#7F3F98', 6: '#7F3F98', 10: '#7F3F98', 14: '#7F3F98', // purple
		4: '#214099', 8: '#214099'                    // blue
	};
</script>

<style>
	.toggles-container {
		position: fixed;
		z-index: 50;
		left: 0;
		right: 0;
		pointer-events: none;
		font-family: 'Inter', sans-serif;
	}
	.family-group {
		position: absolute;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: auto;
	}
	.family-header {
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.08em;
		background: transparent;
		border: none;
		padding: 0;
		margin-bottom: 2px;
		cursor: pointer;
		white-space: nowrap;
	}
	.names-row {
		display: flex;
		gap: 0.6rem;
	}
	.individual-btn {
		font-size: 13px;
		font-weight: 400;
		background: transparent;
		border: none;
		padding: 0 0 2px;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s ease, border-color 0.15s ease;
	}
	.individual-btn:hover {
		color: #333 !important;
	}
</style>

<div class="toggles-container" style="top: {navbarHeight + 4}px;">
	{#each families as family}
		<div class="family-group" style="left: {familyCenterPct[family.id]};">
			<button
				class="family-header"
				style="color: {appState.view === 'zoom' && appState.family === family.id ? '#333' : '#888'};"
				onclick={() => setFamily(family.id)}
			>
				{family.name}
			</button>

			<div class="names-row">
				{#each family.members as member}
					<button
						class="individual-btn"
						style="
							color: {showing[member.idx] ? '#333' : '#999'};
							border-bottom-color: {showing[member.idx] ? colors[member.idx] : 'transparent'};
						"
						title="{member.name} ({member.sup})"
						onclick={() => toggleIndividual(member.idx)}
					>
						{member.name}<sup style="font-size: 0.65em; vertical-align: super;">{member.sup}</sup>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>
