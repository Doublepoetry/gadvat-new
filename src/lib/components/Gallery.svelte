<script lang="ts">
	import { language, translations } from '../stores/language';
	import type { GalleryImage } from '../types';

	const { images, label }: { images: GalleryImage[]; label: string } = $props();

	let index = $state(0);
	let touchStartX: number | null = null;

	const t = $derived(translations[$language]);
	const current = $derived(images[index]);
	const caption = $derived(
		$language === 'mr' ? (current.captionMarathi ?? current.caption) : current.caption
	);

	function go(step: number) {
		index = (index + step + images.length) % images.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			go(-1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			go(1);
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (touchStartX === null) return;
		const dx = e.changedTouches[0].clientX - touchStartX;
		touchStartX = null;
		if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div
	class="gallery"
	role="region"
	aria-roledescription="carousel"
	aria-label={label}
	tabindex="0"
	onkeydown={handleKeydown}
>
	<figure class="slide" aria-roledescription="slide" aria-label="{index + 1} / {images.length}">
		<!-- svelte-ignore a11y_no_static_element_interactions (swipe is a shortcut for the buttons) -->
		<div class="stage" ontouchstart={handleTouchStart} ontouchend={handleTouchEnd}>
			{#key current.file}
				<img
					src={current.src}
					alt={current.alt}
					width={current.width}
					height={current.height}
					loading={index === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
			{/key}

			{#if images.length > 1}
				<button class="nav prev" onclick={() => go(-1)} aria-label={t.previousPhoto}>‹</button>
				<button class="nav next" onclick={() => go(1)} aria-label={t.nextPhoto}>›</button>
				<span class="counter" aria-hidden="true">{index + 1} / {images.length}</span>
			{/if}
		</div>

		<figcaption aria-live="polite">
			{#if caption}
				<span class="caption">{caption}</span>
			{/if}
			<span class="credit">
				{t.photo}:
				<a href={current.sourceUrl} target="_blank" rel="noopener noreferrer">{current.credit}</a>
				·
				<a href={current.licenseUrl} target="_blank" rel="noopener noreferrer license"
					>{current.license}</a
				>
			</span>
		</figcaption>
	</figure>

	{#if images.length > 1}
		<div class="dots">
			{#each images as image, i (image.file)}
				<button
					class="dot"
					class:active={i === index}
					onclick={() => (index = i)}
					aria-label="{t.photo} {i + 1}"
					aria-current={i === index}
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.gallery {
		border-radius: 0.5rem;
		outline: none;
	}

	.gallery:focus-visible {
		box-shadow: 0 0 0 3px #a5b4fc;
	}

	.slide {
		margin: 0;
	}

	.stage {
		position: relative;
		aspect-ratio: 16 / 10;
		background-color: #111827;
		border-radius: 0.5rem;
		overflow: hidden;
		touch-action: pan-y;
	}

	.stage img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	.nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 2.75rem;
		height: 2.75rem;
		border: none;
		border-radius: 9999px;
		background-color: rgb(255 255 255 / 0.85);
		color: #1f2937;
		font-size: 1.75rem;
		line-height: 1;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.nav:hover {
		background-color: white;
	}

	.nav:focus-visible {
		outline: 3px solid #a5b4fc;
		outline-offset: 2px;
	}

	.prev {
		left: 0.75rem;
	}

	.next {
		right: 0.75rem;
	}

	.counter {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		background-color: rgb(17 24 39 / 0.7);
		color: white;
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
	}

	figcaption {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.75rem;
	}

	.caption {
		color: #374151;
		font-weight: 500;
	}

	.credit {
		color: #6b7280;
		font-size: 0.8125rem;
	}

	.credit a {
		color: #4f46e5;
	}

	.dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.dot {
		width: 0.625rem;
		height: 0.625rem;
		padding: 0;
		border: none;
		border-radius: 9999px;
		background-color: #d1d5db;
		cursor: pointer;
	}

	.dot.active {
		background-color: #4f46e5;
	}

	@media (max-width: 640px) {
		.stage {
			aspect-ratio: 4 / 3;
		}

		.nav {
			width: 2.25rem;
			height: 2.25rem;
			font-size: 1.5rem;
		}
	}
</style>
