<script lang="ts">
	import type { TransitionConfig } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { showMr } from '../stores/preferences';
	import type { Fort } from '../types';

	let {
		fort,
		forts,
		onselect,
		onclose
	}: {
		fort: Fort;
		forts: Fort[];
		onselect: (id: string) => void;
		onclose: () => void;
	} = $props();

	const MOBILE = 760; // the panel becomes a bottom sheet below this width, as on the original site
	const INDENT = 0.2; // the name's second line starts 20% in

	const ACCURACY_NOTE: Partial<Record<Fort['locationAccuracy'], string>> = {
		approx: 'The pin is near the fort, but the exact spot hasn’t been confirmed.',
		rough: 'Rough placement — the fort may be some distance from the pin.',
		none: 'This fort isn’t on the map yet.'
	};

	let panel: HTMLElement;
	let panelWidth = $state(0);

	// The name fills the panel: every word on line 1 but the last, which goes on line 2, indented
	const words = $derived(fort.name.split(' '));
	const line1 = $derived(words.length > 1 ? words.slice(0, -1).join(' ') : fort.name);
	const line2 = $derived(words.length > 1 ? words[words.length - 1] : '');
	const nameSize = $derived.by(() => {
		const inner = (panelWidth || 420) - 44;
		const longest = Math.max(...line1.split(' ').map((w) => w.length), 3);
		const fitLine2 = line2 ? (inner * (1 - INDENT)) / (line2.length * 0.6) : Infinity;
		return Math.round(0.85 * Math.max(40, Math.min(116, inner / (longest * 0.6), fitLine2)));
	});

	const typeWord = $derived(fort.type.split(' ')[0]);
	const sticker = $derived(
		fort.altitude
			? { big: fort.altitude.toLocaleString('en-IN'), small: 'metres', mr: false }
			: $showMr
				? { big: fort.typeMarathi, small: 'fort', mr: true }
				: { big: typeWord, small: 'fort', mr: false }
	);

	const place = $derived(
		[fort.district && `${fort.district} district`, fort.region].filter(Boolean).join(', ') + '.'
	);
	const placeMr = $derived([fort.districtMarathi, fort.regionMarathi].filter(Boolean).join(', '));

	const facts = $derived(
		[
			{ label: 'Built by / era', value: fort.builtByOrEra },
			{ label: 'Associated with', value: fort.associatedWith }
		].filter((f) => f.value)
	);

	const accuracyNote = $derived(fort.address ? null : ACCURACY_NOTE[fort.locationAccuracy]);

	const nearby = $derived(
		fort.nearby.flatMap((n) => {
			const other = forts.find((f) => f.id === n.id);
			return other
				? [{ fort: other, km: n.km < 10 ? `${n.km.toFixed(1)} km` : `${Math.round(n.km)} km` }]
				: [];
		})
	);

	const coords = $derived.by(() => {
		if (!fort.coordinates) return null;
		const [lat, lon] = fort.coordinates;
		return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}  ·  ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
	});

	// A newly chosen fort (from nearby, search or the map) starts at the top of the panel
	$effect(() => {
		void fort.id;
		if (panel) panel.scrollTop = 0;
	});

	// Slides in from the right, or up from the bottom on a phone, as on the original site
	function slide(node: HTMLElement): TransitionConfig {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { duration: 0 };
		const mobile = window.innerWidth < MOBILE;
		return {
			delay: mobile ? 0 : 150,
			duration: mobile ? 450 : 500,
			easing: cubicOut,
			css: (_t, u) =>
				mobile
					? `transform: translateY(${u * 100}%)`
					: `transform: translateX(${u * (node.offsetWidth + 40)}px)`
		};
	}
</script>

<aside
	class="panel"
	bind:this={panel}
	bind:clientWidth={panelWidth}
	transition:slide
	aria-label={fort.name}
>
	<div class="strip">
		<div class="type">{fort.type}</div>
		<div class="place">
			<span>{place}</span>
			{#if $showMr && placeMr}<span class="mr" lang="mr">{placeMr}</span>{/if}
		</div>
		<button class="close" onclick={onclose} aria-label="Close">×</button>
	</div>

	<div class="name-block">
		<div class="guide-v"></div>
		<div class="guide-h"></div>
		<h2 class="name" style="font-size: {nameSize}px">
			<span>{line1}</span>
			{#if line2}<span style="padding-left: {INDENT * 100}%">{line2}</span>{/if}
		</h2>
		<div class="name-foot">
			<p class="name-mr" lang="mr">{fort.nameMarathi || fort.name}</p>
			<p class="sticker">
				<span class="sticker-big" lang={sticker.mr ? 'mr' : undefined}>{sticker.big}</span>
				<span class="sticker-small">{sticker.small}</span>
			</p>
		</div>
	</div>

	{#if fort.address}
		<div class="location">
			<div class="where">
				<span class="eyebrow">
					{fort.locationAccuracy === 'close' ? 'Location' : 'Location · approx.'}
				</span>
				<span class="base">{fort.address.base}</span>
				<span class="line">{fort.address.line}</span>
			</div>
			<a class="directions" href={fort.mapsLink} target="_blank" rel="noopener">
				<span class="small">get there ↘&#xFE0E;</span>
				<span class="label">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M12 2.5c-3.9 0-7 3-7 6.9 0 5.1 7 12.1 7 12.1s7-7 7-12.1c0-3.9-3.1-6.9-7-6.9z"
							fill="currentColor"
						/>
						<circle cx="12" cy="9.4" r="2.6" fill="var(--signal)" />
					</svg>
					Directions
				</span>
				<span class="small faint">on Google Maps</span>
			</a>
		</div>
	{/if}

	{#if facts.length}
		<dl class="facts">
			{#each facts as f (f.label)}
				<div class="fact">
					<dt class="eyebrow">{f.label}</dt>
					<dd>{f.value}</dd>
				</div>
			{/each}
		</dl>
	{/if}

	{#if fort.shortDescription}
		<div class="notes">
			<span class="node"></span>
			<p>{fort.shortDescription}</p>
		</div>
	{/if}

	{#if fort.wikipediaLink}
		<a class="story" href={fort.wikipediaLink} target="_blank" rel="noopener">
			<span class="small">read the story ↘&#xFE0E;</span>
			<span class="title">History of the Fort</span>
		</a>
	{/if}

	{#if accuracyNote}
		<p class="accuracy"><span class="dashed"></span>{accuracyNote}</p>
	{/if}

	{#if nearby.length}
		<div class="nearby">
			<h3>Nearby forts</h3>
			<ol>
				{#each nearby as n, i (n.fort.id)}
					<li>
						<button onclick={() => onselect(n.fort.id)}>
							<span class="no">0{i + 1}</span>
							<span class="nearby-name">
								<span>{n.fort.name}</span>
								{#if $showMr}<span class="mr" lang="mr">{n.fort.nameMarathi}</span>{/if}
							</span>
							<span class="km">{n.km}</span>
						</button>
					</li>
				{/each}
			</ol>
		</div>
	{/if}

	<footer>
		<span class="wordmark"
			>Gadvat{#if $showMr}<span class="wordmark-mr" lang="mr">गडवाट</span>{/if}</span
		>
		{#if coords}
			<span class="coords">
				<span class="eyebrow">Coordinates</span>
				<span class="coords-value">{coords}</span>
			</span>
		{/if}
	</footer>
</aside>

<style>
	/* The field card: fixed paper palette on a hairline grid, docked right or a bottom sheet */
	.panel {
		position: absolute;
		z-index: 32;
		top: 76px;
		right: 20px;
		bottom: 20px;
		width: clamp(380px, 40vw, 540px);
		overflow-y: auto;
		overscroll-behavior: contain;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		color: var(--paper-ink);
		border-radius: var(--radius-panel);
		box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.8);
		font-weight: 400;
	}

	.panel > * {
		flex: none;
	}

	p,
	h2,
	h3,
	dl,
	dd,
	ol {
		margin: 0;
	}

	.mr,
	.name-mr,
	.wordmark-mr {
		font-family: var(--font-mr-panel);
	}

	.mr {
		color: var(--paper-ink2);
	}

	.eyebrow {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--paper-ink2);
	}

	.small {
		font-size: 10px;
		letter-spacing: 0.06em;
	}

	.strip {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) auto;
		border-bottom: 1px solid var(--paper-rule);
	}

	.type {
		padding: 18px 16px 16px 22px;
		border-right: 1px solid var(--paper-rule);
		font-size: 17.5px;
		line-height: 0.95;
		letter-spacing: -0.03em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.place {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 18px 16px 16px;
		border-right: 1px solid var(--paper-rule);
		font-size: 11.5px;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.place .mr {
		font-size: 13.5px;
	}

	.close {
		width: 56px;
		border: 0;
		background: transparent;
		color: var(--paper-ink);
		font-size: 23px;
		line-height: 1;
		cursor: pointer;
	}

	.close:hover {
		background: var(--paper-hover);
	}

	.name-block {
		position: relative;
		overflow: hidden;
		padding: 26px 22px 22px;
		border-bottom: 1px solid var(--paper-rule);
	}

	.guide-v {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 33%;
		border-left: 1px solid var(--paper-guide);
	}

	.guide-h {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		border-top: 1px solid var(--paper-guide);
	}

	.name {
		position: relative;
		display: flex;
		flex-direction: column;
		font-weight: 400;
		line-height: 0.84;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}

	.name-foot {
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-top: 18px;
	}

	.name-mr {
		min-width: 0;
		font-size: 38px;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	/* Elevation sticker: dark plate, yellow numerals */
	.sticker {
		flex: none;
		display: flex;
		align-items: baseline;
		gap: 6px;
		margin-bottom: 6px;
		padding: 7px 10px 6px;
		background: var(--paper-ink);
		color: var(--signal);
	}

	.sticker-big {
		font-size: 18px;
		line-height: 1;
		letter-spacing: -0.025em;
	}

	.sticker-big:lang(mr) {
		font-family: var(--font-mr-panel);
	}

	.sticker-small {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--acc);
	}

	.location {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(112px, 32%);
		border-bottom: 1px solid var(--paper-rule);
	}

	.where {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 18px 18px 20px 22px;
		border-right: 1px solid var(--paper-rule);
		overflow-wrap: anywhere;
	}

	.base {
		font-size: 23px;
		line-height: 1.02;
		letter-spacing: -0.025em;
	}

	.line {
		font-size: 13px;
		line-height: 1.45;
		letter-spacing: -0.005em;
		text-wrap: pretty;
	}

	/* The yellow "get there" block */
	.directions {
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 4px;
		padding: 18px 16px 20px;
		background: var(--signal);
		color: var(--paper-ink);
		text-decoration: none;
	}

	.directions:hover {
		background: var(--signal-hover);
	}

	.directions .label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.directions svg {
		flex: none;
	}

	.faint {
		opacity: 0.75;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		border-bottom: 1px solid var(--paper-rule);
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px 22px 18px;
		box-shadow: 1px 0 0 var(--paper-rule);
	}

	.fact dd {
		font-size: 14px;
		line-height: 1.38;
		letter-spacing: -0.01em;
		text-wrap: pretty;
	}

	.notes {
		position: relative;
		padding: 22px 22px 26px;
		border-bottom: 1px solid var(--paper-rule);
	}

	/* Marker node, sitting on the name block's 33% guide */
	.node {
		position: absolute;
		top: -5px;
		left: 33%;
		width: 9px;
		height: 9px;
		margin-left: -4px;
		border: 1.5px solid var(--paper-ink);
		background: var(--paper);
	}

	.notes p {
		font-size: 19px;
		line-height: 1.22;
		letter-spacing: -0.025em;
		text-wrap: pretty;
	}

	.story {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px 22px;
		border-bottom: 1px solid var(--paper-rule);
		color: var(--paper-ink);
		text-decoration: none;
	}

	.story:hover {
		background: var(--paper-hover);
	}

	.story .small {
		color: var(--paper-ink2);
	}

	.story .title {
		font-size: 16.5px;
		letter-spacing: -0.03em;
	}

	.accuracy {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 22px;
		border-bottom: 1px solid var(--paper-rule);
		color: var(--paper-ink2);
		font-size: 12px;
		line-height: 1.45;
	}

	.dashed {
		flex: none;
		width: 9px;
		height: 9px;
		margin-top: 4px;
		border: 1.5px dashed var(--paper-ink);
	}

	.nearby {
		padding: 18px 0 6px;
	}

	.nearby h3 {
		padding: 0 22px 8px;
		font-size: 14px;
		font-weight: 400;
		letter-spacing: -0.02em;
		text-transform: uppercase;
	}

	.nearby ol {
		padding: 0;
		list-style: none;
	}

	.nearby button {
		width: 100%;
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 10px;
		padding: 11px 22px;
		border: 0;
		border-top: 1px solid rgba(18, 57, 47, 0.14);
		background: transparent;
		color: var(--paper-ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.nearby button:hover {
		background: var(--paper-hover);
	}

	.no,
	.km,
	.coords-value {
		font-variant-numeric: tabular-nums;
	}

	.no {
		font-size: 10px;
		color: var(--paper-ink2);
	}

	.km {
		font-size: 11px;
		color: var(--paper-ink2);
	}

	.nearby-name {
		min-width: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 10px;
		font-size: 16px;
		letter-spacing: -0.03em;
	}

	.nearby-name .mr {
		font-size: 15px;
		letter-spacing: 0;
	}

	footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-top: auto;
		padding: 18px 22px 22px;
		border-top: 1px solid var(--paper-rule);
	}

	.wordmark {
		font-size: 16.5px;
		letter-spacing: -0.025em;
	}

	.wordmark-mr {
		margin-left: 6px;
		font-weight: 700;
		letter-spacing: 0;
	}

	.coords {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 5px;
		text-align: right;
	}

	.coords-value {
		font-size: 13px;
		letter-spacing: -0.01em;
		white-space: pre;
	}

	.close:focus-visible,
	.directions:focus-visible,
	.story:focus-visible,
	.nearby button:focus-visible {
		outline: 2px solid var(--paper-ink);
		outline-offset: -2px;
	}

	@media (max-width: 759px) {
		.panel {
			top: auto;
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			height: 58%;
			border-radius: 6px 6px 0 0;
			box-shadow: 0 -24px 60px -20px rgba(0, 0, 0, 0.8);
		}
	}
</style>
