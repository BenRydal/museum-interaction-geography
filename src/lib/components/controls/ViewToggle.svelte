<script lang="ts">
	import { appState, setView } from '$lib/stores/appState.svelte';
</script>

<button
	class="cursor-pointer rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-150 bg-gray-200/80 text-gray-600 hover:text-gray-900"
	onclick={() => setView('smallMultiple')}
>
	Show All
</button>
