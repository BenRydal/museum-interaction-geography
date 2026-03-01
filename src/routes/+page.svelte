<script lang="ts">
	import { onMount } from 'svelte';
	import { appState, setupBridge, syncState, setWelcome } from '$lib/stores/appState.svelte';
	import WelcomeOverlay from '$lib/components/welcome/WelcomeOverlay.svelte';
	import HeaderOverlay from '$lib/components/controls/HeaderOverlay.svelte';
	import ModeSelector from '$lib/components/controls/ModeSelector.svelte';

	import AnimationToggle from '$lib/components/controls/AnimationToggle.svelte';
	import AboutButton from '$lib/components/controls/AboutButton.svelte';
	import ViewToggle from '$lib/components/controls/ViewToggle.svelte';
	import ResetControls from '$lib/components/controls/ResetControls.svelte';
	import ZoomButtons from '$lib/components/controls/ZoomButtons.svelte';
	import ConversationButtons from '$lib/components/conversation/ConversationButtons.svelte';
	import TranscriptPanel from '$lib/components/conversation/TranscriptPanel.svelte';
	import { panelState, setPanelVisible } from '$lib/stores/conversationPanel.svelte';

	let ready = $state(false);

	onMount(() => {
		setupBridge();

		// Wait for fonts before showing any UI
		document.fonts.ready.then(() => {
			ready = true;
		});

		// Listen for p5 welcome toggle events (legacy bridge)
		const welcomeHandler = (e: Event) => {
			const visible = (e as CustomEvent).detail.visible;
			setWelcome(visible);
		};
		document.addEventListener('igsWelcomeToggle', welcomeHandler);

		return () => {
			document.removeEventListener('igsWelcomeToggle', welcomeHandler);
		};
	});

	// Keep window bridge in sync whenever reactive state changes
	$effect(() => {
		void appState.view;
		void appState.mode;
		void appState.space;
		void appState.family;
		void appState.individuals;
		void appState.animate;
		void appState.welcome;
		syncState();
	});

	function dismissWelcome() {
		setWelcome(false);
		(window as any)._igsWelcomeDismiss();
	}
</script>

{#if ready}

<!-- Header overlay: family headers, individual names, gallery labels, grid lines -->
<HeaderOverlay />

<!-- Navbar: mode selector centered, utility buttons on the right -->
<nav class="pointer-events-auto fixed top-0 right-0 left-0 z-50 flex items-center justify-center border-b border-gray-200 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
	<div class="flex items-center gap-2">
		<ModeSelector />
		{#if appState.view === 'zoom'}
			<ViewToggle />
		{/if}
	</div>
	<div class="absolute right-3 flex items-center gap-2">
		<ResetControls />
		{#if appState.mode === 'talk' && !panelState.visible}
			<button
				class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-1.5 border-gray-400 bg-transparent text-gray-500 transition-colors duration-150 hover:border-gray-600 hover:text-gray-700"
				onclick={() => setPanelVisible(true)}
				aria-label="Open transcript panel"
				title="Open transcript panel"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			</button>
		{/if}
		<AnimationToggle />
		<AboutButton />
	</div>
</nav>

<!-- Zoom buttons (small multiple view) -->
<ZoomButtons />

<!-- Conversation buttons overlay -->
<ConversationButtons />

<!-- Draggable transcript panel (talk mode only) -->
{#if appState.mode === 'talk'}
	<TranscriptPanel />
{/if}

<!-- Welcome overlay -->
<WelcomeOverlay visible={appState.welcome} ondismiss={dismissWelcome} />

{/if}
