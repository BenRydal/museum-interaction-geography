<script lang="ts">
	import { appState, setMode, type Mode } from '$lib/stores/appState.svelte';

	const modes: { id: Mode; label: string }[] = [
		{ id: 'movement', label: 'Movement' },
		{ id: 'talk', label: 'Talk' },
		{ id: 'curation', label: 'Curation' }
	];
</script>

<div class="flex items-center gap-0.5 rounded-full bg-gray-200/80 p-0.5">
	{#each modes as { id, label }}
		<button
			class="cursor-pointer rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-150
				{appState.mode === id
				? 'bg-gray-900 text-white shadow-sm'
				: 'text-gray-600 hover:text-gray-900'}"
			onclick={() => setMode(id)}
		>
			{label}
		</button>
	{/each}
</div>
