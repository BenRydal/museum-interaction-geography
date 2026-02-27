<script lang="ts">
	import { appState, setWelcome } from '$lib/stores/appState.svelte';
</script>

<button
	class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-150
		{appState.welcome
		? 'border-1.5 border-gray-700 bg-gray-800 text-white'
		: 'border-1.5 border-gray-400 bg-transparent text-gray-500 hover:border-gray-600 hover:text-gray-700'}"
	style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; line-height: 1;"
	onclick={() => setWelcome(!appState.welcome)}
	aria-label="About"
	title="About"
>
	?
</button>
