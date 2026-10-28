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

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			navigateToFort();
		}
	}
</script>

<div class="fort-card" onclick={navigateToFort} onkeydown={handleKeydown} role="link" tabindex="0">
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
		background: var(--card);
		border-radius: 0.5rem;
		border: 1px solid rgba(var(--lr), 0.14);
		padding: 1rem;
		transition: all 0.2s ease;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
	}

	.fort-card:hover {
		border-color: var(--acc);
		box-shadow: 0 4px 12px rgba(var(--lr), 0.12);
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
		color: var(--ink);
	}

	.fort-type {
		margin: 0;
		font-size: 0.875rem;
		color: var(--mut);
	}

	.fort-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.badge {
		display: inline-block;
		background-color: var(--acc);
		color: var(--bg);
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.badge.secondary {
		background-color: rgba(var(--lr), 0.08);
		color: var(--ink2);
	}

	.fort-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--mut);
		line-height: 1.5;
	}

	.fort-actions {
		display: flex;
		gap: 0.5rem;
	}

	.link-button {
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--acc);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.link-button:hover {
		color: var(--ink);
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
