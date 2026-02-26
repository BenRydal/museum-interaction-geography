<script lang="ts">
	import { appState, setAnimate } from '$lib/stores/appState.svelte';
</script>

<button
	class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-1.5 border-gray-400 bg-transparent text-gray-500 transition-colors duration-150 hover:border-gray-600 hover:text-gray-700"
	onclick={() => setAnimate(!appState.animate)}
	aria-label={appState.animate ? 'Pause animation' : 'Play animation'}
>
	{#if appState.animate}
		<!-- Pause icon (two bars) -->
		<svg width="15" height="15" viewBox="0 0 12 12" fill="currentColor">
			<rect x="2" y="1" width="3" height="10" rx="0.5" />
			<rect x="7" y="1" width="3" height="10" rx="0.5" />
		</svg>
	{:else}
		<!-- Play icon (triangle) -->
		<svg width="15" height="15" viewBox="0 0 12 12" fill="currentColor">
			<polygon points="2,1 11,6 2,11" />
		</svg>
	{/if}
</button>
