<script lang="ts">
	import { resolve } from '$app/paths';
	import { showMr } from '../stores/preferences';
	import type { Fort, FortType } from '../types';

	let {
		forts,
		selected = null,
		onselect
	}: {
		forts: Fort[];
		selected?: Fort | null;
		onselect?: (id: string) => void;
	} = $props();

	const MAX_RESULTS = 8;

	const GLYPH: Record<FortType, string> = {
		'Hill Fort': 'hill',
		'Sea Fort': 'sea',
		'Coastal Fort': 'coastal',
		'Land Fort': 'land'
	};

	let input: HTMLInputElement;
	// The pill shows the selected fort's name, and clears when it is deselected; typing overrides it
	let q = $derived(selected?.name ?? '');
	let open = $state(false);
	let act = $state(0);

	const norm = (s: string) =>
		s
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');

	// Same ranking as the original: name prefix, then word prefix or Marathi match, then substring
	const results = $derived.by(() => {
		const raw = q.trim();
		if (!open || !raw) return [];
		const nq = norm(raw);
		return forts
			.map((f) => {
				const n = norm(f.name);
				const score = n.startsWith(nq)
					? 0
					: (' ' + n).includes(' ' + nq) || f.nameMarathi.includes(raw)
						? 1
						: n.includes(nq)
							? 2
							: -1;
				return { f, score };
			})
			.filter((r) => r.score >= 0)
			.sort((a, b) => a.score - b.score || a.f.name.localeCompare(b.f.name))
			.slice(0, MAX_RESULTS)
			.map((r) => r.f);
	});

	const active = $derived(Math.min(act, Math.max(0, results.length - 1)));
	const showPanel = $derived(open && q.trim() !== '');

	const placeholder = $derived(
		$showMr ? `Search ${forts.length} forts · किल्ला शोधा` : `Search ${forts.length} forts by name`
	);

	export function focus() {
		input.focus();
	}

	/** Closes the dropdown if it is open. Returns whether it was. */
	export function close() {
		if (!open) return false;
		open = false;
		input.blur();
		return true;
	}

	function pick(f: Fort) {
		open = false;
		input.blur();
		onselect?.(f.id);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			act = Math.min(results.length - 1, active + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			act = Math.max(0, active - 1);
		} else if (e.key === 'Enter' && results[active]) {
			e.preventDefault();
			pick(results[active]);
		}
	}

	function clear() {
		q = '';
		act = 0;
		input.focus();
	}
</script>

<div class="search" class:docked={selected}>
	<div class="pill" class:open={showPanel}>
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg
		>
		<input
			bind:this={input}
			bind:value={q}
			oninput={() => {
				open = true;
				act = 0;
			}}
			onfocus={() => {
				open = true;
				input.select();
			}}
			onblur={() => (open = false)}
			onkeydown={handleKeydown}
			{placeholder}
			aria-label="Search forts"
			role="combobox"
			aria-expanded={showPanel}
			aria-controls="search-results"
			aria-autocomplete="list"
			aria-activedescendant={showPanel && results[active]
				? `result-${results[active].id}`
				: undefined}
			autocomplete="off"
			spellcheck="false"
		/>
		{#if q}
			<button class="clear" onclick={clear} aria-label="Clear">×</button>
		{/if}
	</div>

	{#if showPanel}
		<div class="results" id="search-results" role="listbox" aria-label="Forts">
			{#each results as f, i (f.id)}
				<!-- mousedown, not click, so the pick lands before the input's blur closes the list -->
				<div
					id="result-{f.id}"
					class="row"
					class:active={i === active}
					role="option"
					tabindex="-1"
					aria-selected={i === active}
					onmousedown={(e) => {
						e.preventDefault();
						pick(f);
					}}
					onmouseenter={() => (act = i)}
				>
					<span class="glyph-box"><span class="glyph {GLYPH[f.type] ?? 'hill'}"></span></span>
					<span class="names">
						<span class="en">{f.name}</span>
						{#if $showMr}<span class="mr" lang="mr">{f.nameMarathi}</span>{/if}
					</span>
					<span class="sub">{f.district ?? ''}</span>
				</div>
			{/each}
			{#if !results.length}
				<p class="empty">
					No fort by that name. Try another spelling, or browse
					<a href={resolve('/#forts')} onmousedown={(e) => e.preventDefault()}>all forts</a>.
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Docked in the header row, where the original moves it once a fort is selected */
	.search {
		position: absolute;
		z-index: 35;
		top: 4px;
		left: 50%;
		transform: translateX(-50%);
		width: min(580px, calc(100% - 520px));
		transition: width 0.7s var(--ease);
	}

	.search.docked {
		width: min(420px, calc(100% - 520px));
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 56px;
		padding: 0 8px 0 20px;
		background: var(--glass);
		border: 1px solid rgba(var(--lr), 0.18);
		border-radius: var(--radius-pill);
		box-shadow: 0 18px 40px -22px var(--shadow);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		color: var(--mut);
		transition: border-color 0.2s;
	}

	.pill.open {
		border-color: rgba(var(--lr), 0.45);
	}

	/* The pill's border carries focus; the input itself needs no ring */
	.pill:focus-within {
		border-color: rgba(var(--lr), 0.45);
	}

	svg {
		flex: none;
	}

	input {
		flex: 1;
		min-width: 0;
		height: 100%;
		background: transparent;
		border: 0;
		outline: none;
		font-size: 16px;
		color: var(--ink);
	}

	.clear {
		flex: none;
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--mut);
		font-size: 18px;
		cursor: pointer;
	}

	.clear:hover {
		background: rgba(var(--lr), 0.08);
	}

	.results {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
		padding: 6px;
		background: var(--card);
		border: 1px solid rgba(var(--lr), 0.14);
		border-radius: 18px;
		box-shadow: 0 24px 50px -24px var(--shadow);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 11px 14px;
		border-radius: var(--radius-row);
		cursor: pointer;
	}

	.row.active {
		background: rgba(var(--lr), 0.09);
	}

	.glyph-box {
		flex: none;
		width: 14px;
		display: flex;
		justify-content: center;
	}

	.glyph {
		display: block;
	}

	.glyph.hill {
		width: 12px;
		height: 10px;
		background: var(--type-hill);
		clip-path: polygon(50% 0, 100% 100%, 0 100%);
	}

	.glyph.sea {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--type-sea);
	}

	.glyph.coastal {
		width: 8px;
		height: 8px;
		background: var(--type-coastal);
		transform: rotate(45deg);
	}

	.glyph.land {
		width: 9px;
		height: 9px;
		border-radius: 2px;
		background: var(--type-land);
	}

	.names {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 10px;
	}

	.en {
		font-size: 15px;
		font-weight: 400;
		color: var(--ink);
	}

	.mr {
		font-family: var(--font-mr);
		font-size: 15px;
		color: var(--acc2);
	}

	.sub {
		flex: none;
		font-size: 12px;
		color: var(--mut2);
	}

	.empty {
		margin: 0;
		padding: 14px;
		font-size: 14px;
		color: var(--mut);
	}

	@media (max-width: 759px) {
		.search,
		.search.docked {
			top: 60px;
			width: calc(100% - 24px);
		}
	}
</style>
