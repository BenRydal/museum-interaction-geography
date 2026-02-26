<script lang="ts">
	import { resetAll } from '$lib/stores/appState.svelte';
</script>

<button
	class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-1.5 border-gray-400 bg-transparent text-gray-500 transition-colors duration-150 hover:border-gray-600 hover:text-gray-700"
	onclick={() => resetAll()}
	aria-label="Reset"
>
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
		<path d="M1 1v5h5" />
		<path d="M3.5 10a6 6 0 1 0 1.2-6.2L1 6" />
	</svg>
</button>
