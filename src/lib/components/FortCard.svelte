<script lang="ts">
  import { language } from '../stores/language';
  import { getFortDisplay, getMapsUrl } from '../data';
  import type { Fort } from '../types';

  const { fort }: { fort: Fort } = $props();

  const display = $derived(getFortDisplay(fort, $language));
  const mapsUrl = $derived(getMapsUrl(fort.coordinates));

  function navigateToFort() {
    window.location.href = `/${fort.id}`;
  }

  function openMap(e: MouseEvent) {
    e.stopPropagation();
    window.open(mapsUrl, '_blank');
  }
</script>

<div class="fort-card" onclick={navigateToFort} role="link" tabindex="0">
  <div class="card-content">
    <h2 class="fort-name">{display.name}</h2>
    <p class="fort-type">{display.type}</p>

    <div class="fort-meta">
      <span class="badge">{display.district}</span>
      {#if display.region}
        <span class="badge secondary">{display.region}</span>
      {/if}
    </div>

    {#if display.description}
      <p class="fort-description">{display.description}</p>
    {/if}

    <div class="fort-actions">
      <button onclick={openMap} class="link-button">
        📍 {$language === 'en' ? 'View on Map' : 'नकाशावर पहा'}
      </button>
    </div>
  </div>
</div>

<style>
  .fort-card {
    display: block;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .fort-card:hover {
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .fort-name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }

  .fort-type {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .fort-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .badge {
    display: inline-block;
    background-color: #4f46e5;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .badge.secondary {
    background-color: #f3f4f6;
    color: #374151;
  }

  .fort-description {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .fort-actions {
    display: flex;
    gap: 0.5rem;
  }

  .link-button {
    font-size: 0.875rem;
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .link-button:hover {
    color: #4338ca;
  }

  @media (max-width: 640px) {
    .fort-card {
      padding: 0.75rem;
    }

    .fort-name {
      font-size: 1rem;
    }
  }
</style>
