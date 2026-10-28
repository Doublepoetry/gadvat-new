<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { select } from 'd3-selection';
	import 'd3-transition';
	import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
	import { easeCubicInOut } from 'd3-ease';
	import geo from '../../data/districts.json';
	import { showMr } from '../stores/preferences';
	import type { Fort, FortType } from '../types';

	let {
		forts,
		districtNames,
		selectedId = null,
		onselect,
		selectedDistrict = null,
		selectedType = null
	}: {
		forts: Fort[];
		districtNames: Record<string, string>; // English → Marathi, for the labels
		selectedId?: string | null;
		onselect?: (id: string | null) => void;
		selectedDistrict?: string | null;
		selectedType?: string | null;
	} = $props();

	// The district map's own coordinate space (projected from lat/lon by geo.proj)
	const VBW = 977;
	const VBH = 816;
	const HEADER = 64;
	const MOBILE = 760; // below this width the search pill sits under the header
	const MOBILE_TOP = 124;
	const FLIGHT_MS = 1100;
	const SELECTED_ZOOM = 7; // relative to the fitted view, as on the original site

	const TYPE_CLASS: Record<FortType, string> = {
		'Hill Fort': 'hill',
		'Sea Fort': 'sea',
		'Coastal Fort': 'coastal',
		'Land Fort': 'land'
	};

	function project([lat, lon]: [number, number]) {
		return { x: geo.proj.ax * lon + geo.proj.bx, y: geo.proj.ay * lat + geo.proj.by };
	}

	const located = $derived(
		forts
			.filter((f) => f.coordinates)
			.map((f, i) => ({
				fort: f,
				...project(f.coordinates as [number, number]),
				cls: TYPE_CLASS[f.type] ?? 'hill',
				// Each dot twinkles on its own rhythm
				twinkle: `animation-duration: ${2.2 + (((i * 53) % 100) / 100) * 2}s; animation-delay: -${(((i * 37) % 100) / 100) * 3.2}s`
			}))
	);

	const selected = $derived(located.find((p) => p.fort.id === selectedId) ?? null);

	function matchesFilters(f: Fort) {
		if (selectedDistrict && f.district !== selectedDistrict) return false;
		if (selectedType && f.type !== selectedType) return false;
		return true;
	}

	let svg: SVGSVGElement;
	let width = $state(0);
	let height = $state(0);
	let t = $state<ZoomTransform>(zoomIdentity);
	let behavior: ZoomBehavior<SVGSVGElement, unknown> | undefined;

	// Scale at which the whole state fits below the header
	const top = $derived(width < MOBILE ? MOBILE_TOP : HEADER);
	const fitK = $derived(Math.max(0.01, Math.min((width - 48) / VBW, (height - top - 48) / VBH)));
	const u = $derived(1 / t.k); // one screen pixel, in map units
	// Labels fade in by on-screen scale, so a large screen shows district names from the start
	// and a phone shows them once zoomed in far enough for them not to overlap
	const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
	const labelOpacity = $derived(clamp01((t.k - 0.5) / 0.15));
	const mrLabelOpacity = $derived(clamp01((t.k - 1) / 0.4));

	// Where the selected pin sits on screen, for the details card
	const pinX = $derived(selected ? t.applyX(selected.x) : 0);
	const pinY = $derived(selected ? t.applyY(selected.y) : 0);

	function fitTransform() {
		const x = (width - VBW * fitK) / 2;
		const y = top + (height - top - VBH * fitK) / 2;
		return zoomIdentity.translate(x, y).scale(fitK);
	}

	function focusTransform(p: { x: number; y: number }) {
		const k = fitK * SELECTED_ZOOM;
		return zoomIdentity
			.translate(width / 2, top + (height - top) / 2)
			.scale(k)
			.translate(-p.x, -p.y);
	}

	function flyTo(target: ZoomTransform) {
		if (!behavior) return;
		select(svg)
			.transition()
			.duration(reducedMotion() ? 0 : FLIGHT_MS)
			.ease(easeCubicInOut)
			.call(behavior.transform, target);
	}

	function reducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	onMount(() => {
		behavior = d3zoom<SVGSVGElement, unknown>()
			.on('zoom', (e) => (t = e.transform))
			// Ignore double-click zoom so a quick second tap on a fort doesn't jump the map
			.filter((e) => !e.button && e.type !== 'dblclick');

		const ro = new ResizeObserver(() => {
			width = svg.clientWidth;
			height = svg.clientHeight;
			if (!behavior) return;
			// Keep panning and zooming inside Maharashtra
			behavior.scaleExtent([fitK * 0.9, fitK * 40]).translateExtent([
				[-VBW * 0.15, -VBH * 0.15],
				[VBW * 1.15, VBH * 1.15]
			]);
			select(svg).call(behavior.transform, selected ? focusTransform(selected) : fitTransform());
		});
		ro.observe(svg);
		select(svg).call(behavior);

		return () => {
			ro.disconnect();
			select(svg).on('.zoom', null);
		};
	});

	// Fly to the selected fort, or back out to the whole state
	let lastSelected: string | null = null;
	$effect(() => {
		const id = selected?.fort.id ?? null;
		if (!width || id === lastSelected) return;
		lastSelected = id;
		flyTo(selected ? focusTransform(selected) : fitTransform());
	});

	// Keyboard: one dot is in the tab order; arrow keys move to the nearest dot that way
	let rovingId = $state<string | null>(null);
	const tabbableId = $derived(
		(rovingId !== selectedId ? rovingId : null) ??
			located.find((p) => p.fort.id !== selectedId)?.fort.id ??
			null
	);

	const ARROWS: Record<string, [number, number]> = {
		ArrowLeft: [-1, 0],
		ArrowRight: [1, 0],
		ArrowUp: [0, -1],
		ArrowDown: [0, 1]
	};

	function nearestToward(from: { x: number; y: number }, [dx, dy]: [number, number]) {
		let best: (typeof located)[number] | null = null;
		let bestCost = Infinity;
		for (const p of located) {
			if (p.fort.id === selectedId) continue;
			const along = (p.x - from.x) * dx + (p.y - from.y) * dy;
			if (along <= 0) continue;
			const across = Math.abs((p.x - from.x) * dy - (p.y - from.y) * dx);
			const cost = along + 2 * across;
			if (cost < bestCost) {
				bestCost = cost;
				best = p;
			}
		}
		return best;
	}

	function handleDotKeydown(e: KeyboardEvent, p: (typeof located)[number]) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onselect?.(p.fort.id);
			return;
		}
		const dir = ARROWS[e.key];
		if (!dir) return;
		e.preventDefault();
		const next = nearestToward(p, dir);
		if (!next) return;
		rovingId = next.fort.id;
		svg.querySelector<SVGGElement>(`[data-id="${next.fort.id}"]`)?.focus();
	}
</script>

<div class="map-wrap">
	<svg
		bind:this={svg}
		class="fort-map"
		class:ready={width > 0}
		role="application"
		aria-label="Map of Maharashtra's forts. Drag to pan, scroll or pinch to zoom. Tab to the forts, then use the arrow keys."
	>
		<g transform={t.toString()}>
			<g class="edge">
				{#each geo.districts as d (d.name)}
					<path d={d.d} stroke-width={2.4 * u} />
				{/each}
			</g>
			<g class="districts">
				{#each geo.districts as d (d.name)}
					<path
						d={d.d}
						class:on={selected && d.name.replace(/-/g, ' ') === selected.fort.district}
						stroke-width={0.8 * u}
					/>
				{/each}
			</g>

			<g class="labels" opacity={labelOpacity} visibility={labelOpacity > 0 ? 'visible' : 'hidden'}>
				<text class="sea-label" x="36" y="640" font-size={10 * u} letter-spacing={6 * u}
					>ARABIAN SEA</text
				>
				{#if $showMr}
					<text class="sea-label sea-mr" x="36" y={640 + 18 * u} font-size={14 * u} lang="mr"
						>अरबी समुद्र</text
					>
				{/if}
				{#each geo.labels as l (l.name)}
					{@const mr = districtNames[l.name.replace('Chh. ', 'Chhatrapati ')]}
					<text class="district" x={l.x} y={l.y} font-size={10 * u} letter-spacing={1.6 * u}
						>{l.name.toUpperCase()}</text
					>
					{#if $showMr && mr && mrLabelOpacity > 0}
						<text
							class="district-mr"
							x={l.x}
							y={l.y + 15 * u}
							font-size={13 * u}
							opacity={mrLabelOpacity}
							lang="mr">{mr}</text
						>
					{/if}
				{/each}
			</g>

			<g class="dots">
				{#each located as p (p.fort.id)}
					{#if p.fort.id !== selectedId}
						<g
							class="dot {p.cls}"
							class:dim={!matchesFilters(p.fort)}
							transform="translate({p.x} {p.y}) scale({u})"
							data-id={p.fort.id}
							role="button"
							tabindex={p.fort.id === tabbableId ? 0 : -1}
							aria-label={p.fort.district ? `${p.fort.name}, ${p.fort.district}` : p.fort.name}
							onclick={() => onselect?.(p.fort.id)}
							onkeydown={(e) => handleDotKeydown(e, p)}
							onfocus={() => (rovingId = p.fort.id)}
						>
							<g class="twinkle" style={p.twinkle}>
								<circle class="halo" r="4" />
								<circle class="core" r="1.8" />
							</g>
							<circle class="ring" r="7" />
							<!-- Larger invisible target so dots are easy to hit -->
							<circle class="hit" r="9">
								<title>{p.fort.name}</title>
							</circle>
						</g>
					{/if}
				{/each}
			</g>

			{#if selected}
				{#key selected.fort.id}
					<g class="pin {selected.cls}" transform="translate({selected.x} {selected.y}) scale({u})">
						<ellipse rx="7" ry="2.6" class="ground" />
						<circle r="8" class="sonar" />
						<g class="drop">
							<path
								d="M0 0C-3 -9 -13 -15 -13 -27A13 13 0 1 1 13 -27C13 -15 3 -9 0 0Z"
								class="body"
							/>
							<circle cy="-27" r="5" class="eye" />
						</g>
					</g>
				{/key}
			{/if}
		</g>
	</svg>

	{#if selected}
		{@const f = selected.fort}
		{#key f.id}
			<div
				class="details"
				data-type={selected.cls}
				style="--pin-x: {pinX}px; --pin-y: {pinY}px"
				role="dialog"
				aria-label={f.name}
			>
				<button class="close" onclick={() => onselect?.(null)} aria-label="Close">×</button>
				<p class="kicker"><span class="swatch"></span>{f.type}</p>
				<h2>{f.name}</h2>
				{#if $showMr}
					<p class="name-mr" lang="mr">{f.nameMarathi}</p>
				{/if}
				<dl>
					{#if f.district}
						<dt>District</dt>
						<dd>
							{f.district}
							{#if $showMr && f.districtMarathi}<span lang="mr">· {f.districtMarathi}</span>{/if}
						</dd>
					{/if}
					{#if f.altitude}
						<dt>Elevation</dt>
						<dd>{f.altitude.toLocaleString('en-IN')} m</dd>
					{/if}
					{#if f.builtByOrEra}
						<dt>Era</dt>
						<dd>{f.builtByOrEra}</dd>
					{/if}
					{#if f.address}
						<dt>Base village</dt>
						<dd>{f.address.base} <span class="source">from OpenStreetMap</span></dd>
					{/if}
				</dl>
				<a class="open" href={resolve('/[fort]', { fort: f.id })}>Open fort page →</a>
			</div>
		{/key}
	{/if}
</div>

<style>
	.map-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.fort-map {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: none;
		user-select: none;
		cursor: grab;
		/* Hidden until the first measure, so the server-rendered map doesn't flash at the wrong scale */
		opacity: 0;
		transition: opacity 0.3s;
	}

	.fort-map.ready {
		opacity: 1;
	}

	.fort-map:active {
		cursor: grabbing;
	}

	.edge path {
		fill: var(--land);
		stroke: rgba(var(--lr), 0.32);
		stroke-linejoin: round;
	}

	.districts path {
		fill: var(--land);
		stroke: rgba(var(--lr), 0.22);
		stroke-linejoin: round;
		transition: fill 0.5s;
	}

	.districts path.on {
		fill: var(--land-on);
		stroke: rgba(var(--lr), 0.32);
	}

	.labels {
		pointer-events: none;
	}

	.labels text {
		font-family: var(--font-map);
		font-weight: 500;
	}

	.sea-label {
		fill: var(--edge);
	}

	.district {
		fill: var(--lab);
		text-anchor: middle;
	}

	.district-mr {
		fill: var(--lab2);
		text-anchor: middle;
	}

	.labels .sea-mr,
	.labels .district-mr {
		font-family: var(--font-mr);
		font-weight: 400;
	}

	/* Fort types: one colour each, shared by dots and pins */
	.hill {
		color: var(--type-hill);
	}
	.sea {
		color: var(--type-sea);
	}
	.coastal {
		color: var(--type-coastal);
	}
	.land {
		color: var(--type-land);
	}

	.dot {
		transition: opacity 0.2s;
	}

	.dot.dim {
		opacity: 0.2;
	}

	.twinkle {
		animation: twinkle ease-in-out infinite;
	}

	.halo {
		fill: currentColor;
		opacity: 0.18;
	}

	.core {
		fill: var(--spark);
	}

	:global(:root[data-theme='light']) .halo {
		opacity: 0.22;
	}

	:global(:root[data-theme='light']) .core {
		fill: currentColor;
		stroke: #fffcf5;
		stroke-width: 0.6;
	}

	.hit {
		fill: transparent;
		cursor: pointer;
	}

	.dot:focus {
		outline: none;
	}

	.ring {
		fill: none;
		stroke: var(--acc);
		stroke-width: 2;
		opacity: 0;
	}

	.dot:focus-visible .ring {
		opacity: 1;
	}

	.dot:focus-visible {
		opacity: 1;
	}

	.pin {
		pointer-events: none;
	}

	.ground {
		fill: rgba(0, 0, 0, 0.55);
	}

	.sonar {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		animation: sonar 2.4s ease-out 1s infinite both;
	}

	.drop {
		animation: drop 0.6s cubic-bezier(0.3, 1.2, 0.5, 1) 0.95s both;
	}

	.body {
		fill: currentColor;
		stroke: var(--bg);
		stroke-width: 1.5;
	}

	.eye {
		fill: var(--bg);
	}

	/* Details card: paper palette, beside the pin on wide screens, a bottom sheet on narrow ones */
	.details {
		position: absolute;
		left: calc(var(--pin-x) + 44px);
		top: calc(var(--pin-y) - 72px);
		width: 300px;
		padding: 18px 20px 16px;
		border-radius: var(--radius-panel);
		background: var(--paper);
		color: var(--paper-ink);
		box-shadow: 0 18px 50px var(--shadow);
		animation: rise 0.45s var(--ease) 1.1s both;
	}

	.close {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 32px;
		height: 32px;
		border: 0;
		border-radius: var(--radius-pill);
		background: none;
		color: var(--paper-ink2);
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
	}

	.close:hover {
		background: var(--paper-hover);
	}

	.kicker {
		display: flex;
		align-items: center;
		gap: 7px;
		margin: 0 0 6px;
		color: var(--paper-ink2);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.swatch {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		/* Outlined, since the type colours are tuned for the dark map, not paper */
		box-shadow: 0 0 0 1px var(--paper-rule);
	}

	[data-type='hill'] .swatch {
		background: #c9a46a;
	}
	[data-type='sea'] .swatch {
		background: var(--type-sea);
	}
	[data-type='coastal'] .swatch {
		background: var(--type-coastal);
	}
	[data-type='land'] .swatch {
		background: var(--type-land);
	}

	h2 {
		margin: 0;
		padding-right: 28px;
		font-size: 22px;
		font-weight: 500;
		line-height: 1.2;
	}

	.name-mr {
		margin: 2px 0 0;
		font-family: var(--font-mr-panel);
		font-size: 18px;
		font-weight: 500;
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 6px 14px;
		margin: 14px 0 0;
		padding-top: 12px;
		border-top: 1px solid var(--paper-rule);
		font-size: 13px;
	}

	dt {
		color: var(--paper-ink2);
	}

	dd {
		margin: 0;
		font-weight: 400;
	}

	dd [lang='mr'] {
		font-family: var(--font-mr-panel);
	}

	.source {
		display: block;
		color: var(--paper-ink2);
		font-size: 11px;
	}

	.open {
		display: inline-block;
		margin-top: 14px;
		padding: 8px 14px;
		border-radius: var(--radius-pill);
		background: var(--signal);
		color: var(--paper-ink);
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
	}

	.open:hover {
		background: var(--signal-hover);
	}

	@media (max-width: 640px) {
		.details {
			left: 12px;
			right: 12px;
			top: auto;
			bottom: 12px;
			width: auto;
			border-radius: var(--radius-sheet);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes sonar {
		from {
			r: 6;
			opacity: 0.8;
		}
		to {
			r: 34;
			opacity: 0;
		}
	}

	@keyframes drop {
		0% {
			transform: translateY(-70px);
			opacity: 0;
		}
		55% {
			opacity: 1;
		}
		75% {
			transform: translateY(4px);
		}
		100% {
			transform: none;
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.twinkle,
		.sonar,
		.drop,
		.details {
			animation: none;
		}
	}
</style>
