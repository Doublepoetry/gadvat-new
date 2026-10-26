<script lang="ts">
  import FortCard from '#lib/components/FortCard.svelte';
  import { sortForts, getUniqueDistricts } from '#lib/data';
  import { language } from '#lib/stores/language';
  import type { Fort } from '#lib/types';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let selectedDistrict = $state<string | null>(null);
  let searchQuery = $state('');

  const districts = $derived(getUniqueDistricts(data.forts));

  const filteredForts = $derived.by(() => {
    return data.forts.filter((fort: Fort) => {
      if (selectedDistrict && fort.district !== selectedDistrict) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          fort.name.toLowerCase().includes(query) ||
          fort.nameMarathi.includes(searchQuery) ||
          fort.district.toLowerCase().includes(query)
        );
      }

      return true;
    });
  });

  const sortedForts = $derived(sortForts(filteredForts, $language));
</script>

<div class="page-content">
  <section class="hero">
    <h1>
      {$language === 'en'
        ? 'Explore Maharashtra\'s Forts'
        : 'महाराष्ट्राच्या किल्ल्यांचा अन्वेषण करा'}
    </h1>
    <p class="hero-subtitle">
      {$language === 'en'
        ? `Discover ${data.forts.length} historic forts across Maharashtra`
        : `महाराष्ट्र भरात ${data.forts.length} ऐतिहासिक किल्ले शोधा`}
    </p>
  </section>

  <section class="filters">
    <div class="search-box">
      <input
        type="text"
        placeholder={$language === 'en' ? 'Search forts...' : 'किल्ले शोधा...'}
        bind:value={searchQuery}
        class="search-input"
      />
    </div>

    <div class="district-filter">
      <label for="district-select">
        {$language === 'en' ? 'Filter by District' : 'जिल्ह्यानुसार फिल्टर करा'}
      </label>
      <select
        id="district-select"
        bind:value={selectedDistrict}
        class="district-select"
      >
        <option value={null}>
          {$language === 'en' ? 'All Districts' : 'सर्व जिल्हे'}
        </option>
        {#each districts as district}
          <option value={district}>{district}</option>
        {/each}
      </select>
    </div>
  </section>

  <section class="results">
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .hero {
    text-align: center;
  }

  .hero h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.25rem;
    color: #1f2937;
  }

  .hero-subtitle {
    margin: 0;
    font-size: 1.125rem;
    color: #6b7280;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    flex: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  .district-filter {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .district-filter label {
    font-weight: 500;
    color: #374151;
    white-space: nowrap;
  }

  .district-select {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    background-color: white;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .district-select:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  .results-header {
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1rem;
  }

  .results-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f2937;
  }

  .forts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .no-results {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  @media (max-width: 768px) {
    .page-content {
      gap: 1.5rem;
    }

    .hero h1 {
      font-size: 1.875rem;
    }

    .district-filter {
      flex-direction: column;
      align-items: stretch;
    }

    .district-filter label {
      white-space: normal;
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

    .hero h1 {
      font-size: 1.5rem;
    }

    .forts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
