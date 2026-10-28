<script lang="ts">
	import { showMr } from '../stores/preferences';
	import { RAMP_CSS, elevationRange, type ColorBy } from '../elevation';
	import type { Fort, FortType } from '../types';

	let {
		forts,
		types = $bindable([]),
		colorBy = $bindable('stars'),
		docked = false
	}: {
		forts: Fort[];
		docked?: boolean; // the fort panel is open, so stay left of it
		types?: FortType[];
		colorBy?: ColorBy;
	} = $props();

	const TYPES: { type: FortType; cls: string }[] = [
		{ type: 'Hill Fort', cls: 'hill' },
		{ type: 'Sea Fort', cls: 'sea' },
		{ type: 'Coastal Fort', cls: 'coastal' },
		{ type: 'Land Fort', cls: 'land' }
	];

	const COLOR_MODES: { value: ColorBy; label: string }[] = [
		{ value: 'stars', label: 'Plain' },
		{ value: 'type', label: 'Type' },
		{ value: 'height', label: 'Height' }
	];

	const chips = $derived(
		TYPES.map((t) => {
			const ofType = forts.filter((f) => f.type === t.type);
			return { ...t, count: ofType.length, mr: ofType[0]?.typeMarathi ?? '' };
		})
	);
	const range = $derived(elevationRange(forts));
	const withAltitude = $derived(forts.filter((f) => f.altitude).length);

	// A radio group: one tab stop, arrow keys move the choice
	function handleColorKeydown(e: KeyboardEvent) {
		const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
		if (!step) return;
		e.preventDefault();
		const i = COLOR_MODES.findIndex((m) => m.value === colorBy);
		colorBy = COLOR_MODES[(i + step + COLOR_MODES.length) % COLOR_MODES.length].value;
		const group = e.currentTarget as HTMLElement;
		requestAnimationFrame(() => group.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
	}

	function toggle(type: FortType) {
		types = types.includes(type) ? types.filter((t) => t !== type) : [...types, type];
	}
</script>

<div class="filters" class:docked>
	<div class="row" role="group" aria-label="Filter by fort type">
		{#each chips as t (t.type)}
			<button
				class="chip"
				class:on={types.includes(t.type)}
				aria-pressed={types.includes(t.type)}
				onclick={() => toggle(t.type)}
			>
				<span class="glyph {t.cls}" aria-hidden="true"></span>
				{t.type.replace(' Fort', '')}
				{#if $showMr && t.mr}<span class="mr" lang="mr">{t.mr}</span>{/if}
				<span class="count">{t.count}</span>
			</button>
		{/each}

		<span class="divider" aria-hidden="true"></span>

		<div
			class="segmented"
			role="radiogroup"
			aria-label="Colour the forts by"
			tabindex="-1"
			onkeydown={handleColorKeydown}
		>
			<span class="seg-label" aria-hidden="true">Colour</span>
			{#each COLOR_MODES as m (m.value)}
				<button
					role="radio"
					aria-checked={colorBy === m.value}
					tabindex={colorBy === m.value ? 0 : -1}
					class:on={colorBy === m.value}
					onclick={() => (colorBy = m.value)}>{m.label}</button
				>
			{/each}
		</div>
	</div>

	{#if colorBy === 'height' && range}
		<div class="legend">
			<span>{range[0].toLocaleString('en-IN')} m</span>
			<span class="ramp" style="background: {RAMP_CSS}" aria-hidden="true"></span>
			<span>{range[1].toLocaleString('en-IN')} m</span>
			<span class="note">{withAltitude} of {forts.length} forts have an elevation so far</span>
		</div>
	{/if}
</div>

<style>
	/* Floats under the search pill */
	.filters {
		position: absolute;
		z-index: 30;
		top: 68px;
		left: 12px;
		right: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		pointer-events: none;
	}

	.row,
	.legend {
		pointer-events: auto;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 6px;
		max-width: 100%;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.chip,
	.segmented {
		flex: none;
		display: flex;
		align-items: center;
		height: 36px;
		border: 1px solid rgba(var(--lr), 0.18);
		border-radius: var(--radius-pill);
		background: var(--glass);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		font-size: 13px;
		color: var(--ink2);
	}

	.chip {
		gap: 8px;
		padding: 0 14px 0 12px;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}

	.chip:hover {
		border-color: rgba(var(--lr), 0.32);
	}

	.chip.on {
		border-color: rgba(var(--lr), 0.55);
		background: rgba(var(--lr), 0.14);
		color: var(--ink);
	}

	.mr {
		font-family: var(--font-mr);
		color: var(--acc2);
	}

	.count {
		color: var(--mut2);
		font-variant-numeric: tabular-nums;
	}

	.glyph {
		display: block;
	}

	.glyph.hill {
		width: 11px;
		height: 9px;
		background: var(--type-hill);
		clip-path: polygon(50% 0, 100% 100%, 0 100%);
	}

	.glyph.sea {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--type-sea);
	}

	.glyph.coastal {
		width: 7px;
		height: 7px;
		background: var(--type-coastal);
		transform: rotate(45deg);
	}

	.glyph.land {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: var(--type-land);
	}

	.divider {
		flex: none;
		width: 1px;
		height: 20px;
		margin: 0 4px;
		background: rgba(var(--lr), 0.18);
	}

	.segmented {
		padding: 3px;
		gap: 2px;
	}

	.seg-label {
		padding: 0 8px 0 10px;
		color: var(--mut2);
	}

	.segmented button {
		height: 28px;
		padding: 0 12px;
		border: 0;
		border-radius: var(--radius-pill);
		background: transparent;
		font-size: 13px;
		color: var(--ink2);
		cursor: pointer;
	}

	.segmented button.on {
		background: rgba(var(--lr), 0.16);
		color: var(--ink);
	}

	.legend {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: var(--radius-pill);
		background: var(--glass);
		font-size: 12px;
		color: var(--mut);
	}

	.ramp {
		width: 120px;
		height: 6px;
		border-radius: 3px;
	}

	.note {
		color: var(--mut2);
	}

	/* Matches the fort panel's width and its 20px inset; the row wraps instead of hiding under it */
	.filters.docked {
		right: calc(clamp(380px, 40vw, 540px) + 32px);
	}

	.docked .row {
		flex-wrap: wrap;
		justify-content: center;
		overflow-x: visible;
	}

	.docked .divider {
		display: none;
	}

	@media (max-width: 759px) {
		.filters,
		.filters.docked {
			top: 124px;
			right: 12px;
			align-items: stretch;
		}

		.docked .row {
			flex-wrap: nowrap;
			justify-content: flex-start;
			overflow-x: auto;
		}
	}
</style>
