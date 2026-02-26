<script lang="ts">
	interface Props {
		visible: boolean;
		ondismiss: () => void;
	}

	let { visible, ondismiss }: Props = $props();

	const galleries = [
		{ src: '/images/gallery_walkway.jpg', caption: 'Folk Roots' },
		{ src: '/images/gallery_bluegrass.jpg', caption: 'Bluegrass' },
		{ src: '/images/gallery_rotunda.jpg', caption: 'Rotunda' }
	];

	function stop(e: Event) {
		e.stopPropagation();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
			ondismiss();
		}
	}
</script>

{#if visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9999] flex items-center justify-center"
		style="background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(8px);"
		onclick={ondismiss}
		onkeydown={handleKeydown}
	>
		<div
			class="mx-4 max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-2xl"
			onclick={stop}
		>
			<!-- Gallery images as a hero strip -->
			<div class="grid grid-cols-3">
				{#each galleries as { src, caption }}
					<div class="group relative h-52 overflow-hidden md:h-72">
						<img
							{src}
							alt={caption}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
						<span
							class="absolute bottom-3 left-0 w-full text-center text-xs font-medium tracking-widest text-white/90 uppercase md:text-sm"
							style="font-family: 'Inter', sans-serif;"
						>
							{caption}
						</span>
					</div>
				{/each}
			</div>

			<!-- Content -->
			<div class="px-10 py-10 text-center md:px-16 md:py-12">
				<h1
					class="mb-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl"
					style="font-family: 'Playfair Display', serif;"
				>
					Museum Interaction Geography
				</h1>
				<p
					class="mx-auto mb-10 max-w-[600px] text-base leading-relaxed text-gray-500 md:text-lg"
					style="font-family: 'Inter', sans-serif;"
				>
					See how 4 families explore 3 gallery spaces in a cultural heritage museum.
					Explore how they move, talk, and curate their experience through phones and social media.
				</p>

				<button
					class="mb-8 inline-block cursor-pointer rounded-full bg-gray-900 px-10 py-3.5 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-gray-700 hover:shadow-xl"
					style="font-family: 'Inter', sans-serif;"
					onclick={ondismiss}
				>
					Start Exploring
				</button>

				<a
					href="https://par.nsf.gov/servlets/purl/10074100"
					class="inline-block rounded-md bg-gray-100 px-5 py-2.5 text-sm leading-relaxed text-gray-600 italic transition-colors hover:text-gray-800"
					style="font-family: 'Inter', sans-serif;"
					target="_blank"
					rel="noopener noreferrer"
					onclick={stop}
				>
					<span class="not-italic">Read more:</span> Shapiro, Hall, &amp; Owens (2017). Developing &amp; using interaction geography in a museum.
				</a>
			</div>
		</div>
	</div>
{/if}
