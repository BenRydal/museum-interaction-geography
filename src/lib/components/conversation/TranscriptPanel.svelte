<script lang="ts">
	import { onMount } from 'svelte';
	import { panelState, setPanelPosition, setPanelVisible, unlock } from '$lib/stores/conversationPanel.svelte';

	let audioEl: HTMLAudioElement | undefined = $state();
	let playing = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);

	let dragging = $state(false);
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	const PANEL_W = 320;
	const PANEL_H = 400;

	onMount(() => {
		if (panelState.panelX < 0 || panelState.panelY < 0) {
			setPanelPosition(16, 48);
		}

		const onResize = () => {
			const x = Math.max(0, Math.min(panelState.panelX, window.innerWidth - PANEL_W - 8));
			const y = Math.max(0, Math.min(panelState.panelY, window.innerHeight - 60));
			setPanelPosition(x, y);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	$effect(() => {
		const src = panelState.audioSrc;
		if (src && audioEl) {
			audioEl.src = src;
			audioEl.play().catch(() => {});
			playing = true;
		} else if (!src && audioEl) {
			audioEl.pause();
			playing = false;
			currentTime = 0;
			duration = 0;
		}
	});

	function togglePlayPause() {
		if (!audioEl || !panelState.audioSrc) return;
		if (playing) {
			audioEl.pause();
			playing = false;
		} else {
			audioEl.play().catch(() => {});
			playing = true;
		}
	}

	function seekTo(e: MouseEvent) {
		if (!audioEl || !duration) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		audioEl.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration;
	}

	function formatTime(seconds: number): string {
		if (!seconds || !isFinite(seconds)) return '0:00';
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragOffsetX = e.clientX - panelState.panelX;
		dragOffsetY = e.clientY - panelState.panelY;
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		setPanelPosition(
			Math.max(0, Math.min(window.innerWidth - PANEL_W - 8, e.clientX - dragOffsetX)),
			Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffsetY))
		);
	}

	function onPointerUp() {
		dragging = false;
	}

	function closePanel() {
		setPanelVisible(false);
		unlock();
		if (audioEl) { audioEl.pause(); playing = false; }
		(window as any)._igsConversationHover = { active: false };
	}

	const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<div
	data-transcript-panel
	class="pointer-events-auto fixed z-50 w-80 rounded-lg shadow-xl transition-opacity duration-200"
	class:opacity-0={!panelState.visible}
	class:pointer-events-none={!panelState.visible}
	style="left: {panelState.panelX}px; top: {panelState.panelY}px;"
>
	<audio
		bind:this={audioEl}
		ontimeupdate={() => { if (audioEl) currentTime = audioEl.currentTime; }}
		ondurationchange={() => { if (audioEl) duration = audioEl.duration || 0; }}
		onended={() => { playing = false; }}
		class="hidden"
	></audio>

	<!-- Title bar (drag handle) -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex cursor-grab items-center justify-between rounded-t-lg bg-gray-900 px-3 py-2 text-white active:cursor-grabbing"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
	>
		<span class="text-sm font-medium select-none">
			{panelState.hoveredIndex !== null ? `Conversation ${panelState.hoveredIndex}` : 'Conversations'}
		</span>
		<button
			class="flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
			onclick={closePanel}
			aria-label="Close transcript panel"
		>
			<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
				<path d="M1.5.4L5 3.9 8.5.4 9.6 1.5 6.1 5l3.5 3.5-1.1 1.1L5 6.1 1.5 9.6.4 8.5 3.9 5 .4 1.5z" />
			</svg>
		</button>
	</div>

	<!-- Audio controls -->
	{#if panelState.audioSrc}
		<div class="flex items-center gap-2 border-x border-gray-200 bg-gray-50 px-3 py-2">
			<button
				class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white transition-colors hover:bg-gray-700"
				onclick={togglePlayPause}
				aria-label={playing ? 'Pause' : 'Play'}
			>
				{#if playing}
					<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
						<rect x="1.5" y="1" width="2.5" height="8" rx="0.5" />
						<rect x="6" y="1" width="2.5" height="8" rx="0.5" />
					</svg>
				{:else}
					<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
						<polygon points="2,1 9,5 2,9" />
					</svg>
				{/if}
			</button>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="relative h-1.5 flex-1 cursor-pointer rounded-full bg-gray-300" onclick={seekTo}>
				<div
					class="absolute top-0 left-0 h-full rounded-full bg-gray-700 transition-[width] duration-100"
					style="width: {progressPct}%;"
				></div>
			</div>

			<span class="shrink-0 text-xs tabular-nums text-gray-500">
				{formatTime(currentTime)} / {formatTime(duration)}
			</span>
		</div>
	{/if}

	<!-- Transcript area -->
	<div
		class="overflow-y-auto rounded-b-lg border border-t-0 border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm"
		style="max-height: calc(100vh - {panelState.panelY}px - 100px);"
	>
		{#if panelState.lines.length > 0}
			{#each panelState.lines as line}
				{@const colonIdx = line.indexOf(':')}
				{#if colonIdx > 0 && colonIdx <= 3}
					<p class="text-sm leading-relaxed">
						<span class="font-semibold">{line.slice(0, colonIdx + 1)}</span>{line.slice(colonIdx + 1)}
					</p>
				{:else}
					<p class="text-sm leading-relaxed">{line}</p>
				{/if}
			{/each}
		{:else}
			<p class="text-sm italic text-gray-400">Hover over a conversation button to read the transcript</p>
		{/if}
	</div>
</div>
