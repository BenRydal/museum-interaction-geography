<script lang="ts">
	import { appState, toggleIndividual, setFamily } from '$lib/stores/appState.svelte';

	let { navbarHeight = 0 }: { navbarHeight?: number } = $props();

	let showing = $state(Array(15).fill(false));

	$effect(() => {
		const interval = setInterval(() => {
			const mapMovement = (window as any).mapMovement;
			if (!mapMovement) return;
			for (let i = 0; i < 15; i++) {
				showing[i] = mapMovement[i]?.show === true;
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
		0: '#F26522', 9: '#F26522', 12: '#F26522',
		1: '#FFDE17', 5: '#FFDE17', 11: '#FFDE17',
		2: '#00A14B', 7: '#00A14B', 13: '#00A14B',
		3: '#7F3F98', 6: '#7F3F98', 10: '#7F3F98', 14: '#7F3F98',
		4: '#214099', 8: '#214099'
	};

	function isFamilyActive(id: number): boolean {
		return appState.view === 'zoom' && appState.family === id;
	}
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
	.frosted-bar {
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		pointer-events: none;
	}
	.toggles-inner {
		position: relative;
		z-index: 1;
		padding: 6px 0;
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
		color: #888;
		background: transparent;
		border: none;
		padding: 2px 8px;
		margin-bottom: 2px;
		cursor: pointer;
		white-space: nowrap;
		border-radius: 6px;
		transition: background-color 0.15s ease, color 0.15s ease;
	}
	.family-header:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
	.family-header.active {
		background-color: #333;
		color: #fff;
	}
	.family-header.active:hover {
		background-color: #444;
	}
	.names-row {
		display: flex;
		gap: 0.4rem;
	}
	.individual-btn {
		font-size: 13px;
		font-weight: 400;
		color: #999;
		background: transparent;
		border: none;
		padding: 2px 2px 3px;
		cursor: pointer;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 4px;
		transition: color 0.15s ease;
	}
	.individual-btn:hover {
		color: #333 !important;
	}
	.individual-btn.showing {
		color: #333;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
		opacity: 0.25;
		transition: opacity 0.15s ease;
	}
	.dot.visible {
		opacity: 1;
	}
	sup {
		font-size: 0.65em;
		vertical-align: super;
	}
</style>

<div class="toggles-container" style="top: {navbarHeight + 4}px;">
	<div class="frosted-bar"></div>
	<div class="toggles-inner">
		{#each families as family}
			<div class="family-group" style="left: {familyCenterPct[family.id]};">
				<button
					class="family-header"
					class:active={isFamilyActive(family.id)}
					onclick={() => setFamily(family.id)}
				>
					{family.name}
				</button>

				<div class="names-row">
					{#each family.members as member}
						<button
							class="individual-btn"
							class:showing={showing[member.idx]}
							title="{member.name} ({member.sup})"
							onclick={() => toggleIndividual(member.idx)}
						>
							<span
								class="dot"
								class:visible={showing[member.idx]}
								style="background-color: {colors[member.idx]};"
							></span>
							{member.name}<sup>{member.sup}</sup>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
