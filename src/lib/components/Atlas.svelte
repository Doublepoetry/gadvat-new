<script lang="ts">
	import FortCard from '#lib/components/FortCard.svelte';
	import FortMap from '#lib/components/FortMap.svelte';
	import FortPanel from '#lib/components/FortPanel.svelte';
	import MapFilters from '#lib/components/MapFilters.svelte';
	import SearchPill from '#lib/components/SearchPill.svelte';
	import type { ColorBy } from '#lib/elevation';
	import { sortForts, getUniqueDistricts } from '#lib/data';
	import { language } from '#lib/stores/language';
	import type { Fort, FortType } from '#lib/types';
	// The home page, and every fort page, which opens with that fort's panel showing
	let {
		forts,
		districtNames,
		initialId = null
	}: {
		forts: Fort[];
		districtNames: Record<string, string>;
		initialId?: string | null;
	} = $props();

	// Follows the page's fort when the route changes; picking another fort overrides it
	let selectedFort = $derived<string | null>(initialId);
	let selectedDistrict = $state<string | null>(null);
	let types = $state<FortType[]>([]);
	let colorBy = $state<ColorBy>('stars');
	let search: SearchPill;

	const selected = $derived(forts.find((f) => f.id === selectedFort) ?? null);

	const districts = $derived(getUniqueDistricts(forts));

	const filteredForts = $derived.by(() => {
		return forts.filter((fort: Fort) => {
			if (selectedDistrict && fort.district !== selectedDistrict) {
				return false;
			}

			if (types.length && !types.includes(fort.type)) {
				return false;
			}

			return true;
		});
	});

	const sortedForts = $derived(sortForts(filteredForts, $language));

	// `/` focuses search; Esc closes the search dropdown first, then the selected fort
	function handleKeydown(e: KeyboardEvent) {
		const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
		if (e.key === 'Escape') {
			if (!search.close() && selectedFort) selectedFort = null;
		} else if (e.key === '/' && !typing) {
			e.preventDefault();
			search.focus();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<section class="map-section">
	<SearchPill bind:this={search} {forts} {selected} onselect={(id) => (selectedFort = id)} />
	<FortMap
		{forts}
		{districtNames}
		selectedId={selectedFort}
		onselect={(id) => (selectedFort = id)}
		{selectedDistrict}
		{types}
		{colorBy}
	/>
	<MapFilters {forts} bind:types bind:colorBy docked={!!selected} />
	{#if selected}
		<FortPanel
			fort={selected}
			{forts}
			onselect={(id) => (selectedFort = id)}
			onclose={() => (selectedFort = null)}
		/>
	{/if}
</section>

<!-- The original site's search and list replace this in later slices -->
<div class="page-content">
	<section class="filters">
		<div class="filter-row">
			<div class="district-filter">
				<label for="district-select">
					{$language === 'en' ? 'Filter by District' : 'जिल्ह्यानुसार फिल्टर करा'}
				</label>
				<select id="district-select" bind:value={selectedDistrict} class="district-select">
					<option value={null}>
						{$language === 'en' ? 'All Districts' : 'सर्व जिल्हे'}
					</option>
					{#each districts as district (district)}
						<option value={district}>{district}</option>
					{/each}
				</select>
			</div>
		</div>
	</section>

	<section class="results" id="forts">
		<div class="results-header">
			<h2>
				{$language === 'en' ? 'Results' : 'परिणाम'} ({sortedForts.length})
			</h2>
		</div>

		{#if sortedForts.length > 0}
			<div class="forts-grid">
				{#each sortedForts as fort (fort.id)}
					<FortCard {fort} />
				{/each}
			</div>
		{:else}
			<div class="no-results">
				<p>
					{$language === 'en'
						? 'No forts found. Try adjusting your search.'
						: 'कोणतेही किल्ले सापडले नाही. आपला शोध समायोजित करने पहा.'}
				</p>
			</div>
		{/if}
	</section>
</div>

<style>
	.page-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 24px 40px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.map-section {
		position: relative;
		height: 100vh;
		height: 100dvh;
	}

	.filters {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.filter-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.district-filter {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.district-filter label {
		font-weight: 500;
		color: var(--ink2);
		font-size: 0.875rem;
	}

	.district-select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid rgba(var(--lr), 0.18);
		border-radius: 0.375rem;
		font-size: 1rem;
		background-color: var(--card);
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.district-select:focus {
		outline: none;
		border-color: var(--acc);
		box-shadow: 0 0 0 3px rgba(var(--lr), 0.12);
	}

	.results-header {
		border-bottom: 2px solid rgba(var(--lr), 0.14);
		padding-bottom: 1rem;
	}

	.results-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--ink);
	}

	.forts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.no-results {
		text-align: center;
		padding: 2rem;
		color: var(--mut);
	}

	@media (max-width: 768px) {
		.page-content {
			gap: 1.5rem;
		}

		.filter-row {
			grid-template-columns: 1fr;
		}

		.forts-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1rem;
		}
	}

	@media (max-width: 640px) {
		.page-content {
			gap: 1rem;
		}

		.filter-row {
			grid-template-columns: 1fr;
		}

		.forts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
