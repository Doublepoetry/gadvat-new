<script lang="ts">
  import { getMapsUrl, getFortDisplay, formatCoordinates } from '#lib/data';
  import { language, translations } from '#lib/stores/language';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $: display = getFortDisplay(data.fort, $language);
  $: mapsUrl = getMapsUrl(data.fort.coordinates);
</script>

<div class="fort-detail">
  <div class="breadcrumb">
    <a href="/">← {$language === 'en' ? 'Back to List' : 'सूचीकडे परत जा'}</a>
  </div>

  <div class="detail-header">
    <h1>{display.name}</h1>
    <p class="marathi-name">{data.fort.nameMarathi}</p>
    <div class="badges">
      <span class="badge badge-primary">{display.type}</span>
      <span class="badge badge-secondary">{display.district}</span>
      {#if display.region}
        <span class="badge badge-tertiary">{display.region}</span>
      {/if}
    </div>
  </div>

  <section class="detail-sections">
    <section class="detail-section">
      <h2>{translations[$language]['fortDetails']}</h2>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">{translations[$language]['district']}</span>
          <span class="detail-value">{display.district}</span>
        </div>

        {#if display.region}
          <div class="detail-item">
            <span class="detail-label">{translations[$language]['region']}</span>
            <span class="detail-value">{display.region}</span>
          </div>
        {/if}

        <div class="detail-item">
          <span class="detail-label">{translations[$language]['type']}</span>
          <span class="detail-value">{display.type}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">{translations[$language]['coordinates']}</span>
          <span class="detail-value">{formatCoordinates(data.fort.coordinates)}</span>
        </div>

        {#if data.fort.altitude}
          <div class="detail-item">
            <span class="detail-label">{translations[$language]['altitude']}</span>
            <span class="detail-value">{data.fort.altitude} m</span>
          </div>
        {/if}

        {#if data.fort.area}
          <div class="detail-item">
            <span class="detail-label">Area</span>
            <span class="detail-value">{data.fort.area} km²</span>
          </div>
        {/if}

        {#if data.fort.foundedYear}
          <div class="detail-item">
            <span class="detail-label">Founded</span>
            <span class="detail-value">{data.fort.foundedYear}</span>
          </div>
        {/if}
      </div>
    </section>

    {#if data.fort.content || data.fort.description || data.fort.descriptionMarathi}
      <section class="detail-section">
        <h2>{$language === 'en' ? 'About' : 'विषयी'}</h2>
        <div class="detail-text">
          {#if $language === 'en' && data.fort.content}
            {@html data.fort.content}
          {:else if $language === 'mr' && data.fort.descriptionMarathi}
            <p>{data.fort.descriptionMarathi}</p>
          {:else if $language === 'en' && data.fort.description}
            <p>{data.fort.description}</p>
          {:else if $language === 'mr' && data.fort.content}
            {@html data.fort.content}
          {:else}
            <p>{translations[$language]['noDescription']}</p>
          {/if}
        </div>
      </section>
    {/if}

    <section class="detail-section">
      <h2>{translations[$language]['viewOnMap']}</h2>
      <p>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" class="button button-primary">
          📍 {translations[$language]['viewOnMap']}
        </a>
      </p>
      {#if data.fort.wikipediaLink}
        <p>
          <a href={data.fort.wikipediaLink} target="_blank" rel="noopener noreferrer" class="button">
            📖 Wikipedia
          </a>
        </p>
      {/if}
    </section>

    {#if data.fort.tags && data.fort.tags.length > 0}
      <section class="detail-section">
        <h2>Tags</h2>
        <div class="tags">
          {#each data.fort.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </section>
    {/if}
  </section>
</div>

<style>
  .fort-detail {
    max-width: 800px;
    margin: 0 auto;
  }

  .breadcrumb {
    margin-bottom: 1.5rem;
  }

  .breadcrumb a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .breadcrumb a:hover {
    color: #4338ca;
  }

  .detail-header {
    margin-bottom: 2rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1.5rem;
  }

  .detail-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #1f2937;
  }

  .marathi-name {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: #6b7280;
    font-weight: 500;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .badge-primary {
    background-color: #4f46e5;
    color: white;
  }

  .badge-secondary {
    background-color: #f3f4f6;
    color: #374151;
  }

  .badge-tertiary {
    background-color: #ede9fe;
    color: #6d28d9;
  }

  .detail-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .detail-section {
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .detail-section h2 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #1f2937;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-label {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
  }

  .detail-value {
    color: #6b7280;
    font-size: 1rem;
  }

  .detail-text {
    color: #6b7280;
    line-height: 1.6;
  }

  .detail-text p {
    margin: 0 0 1rem 0;
  }

  .detail-text p:last-child {
    margin-bottom: 0;
  }

  .button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    color: #4f46e5;
    border: 1px solid #4f46e5;
  }

  .button-primary {
    background-color: #4f46e5;
    color: white;
    border-color: #4f46e5;
  }

  .button:hover {
    opacity: 0.9;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: #e5e7eb;
    color: #374151;
    border-radius: 9999px;
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    .detail-header h1 {
      font-size: 1.5rem;
    }

    .marathi-name {
      font-size: 1.25rem;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }

    .detail-section {
      padding: 1rem;
    }
  }
</style>
