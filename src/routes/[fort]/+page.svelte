<script lang="ts">
	import { resolve } from '$app/paths';
	import { getMapsUrl, getFortDisplay, formatCoordinates } from '#lib/data';
	import { language, translations } from '#lib/stores/language';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const display = $derived(getFortDisplay(data.fort, $language));
	const mapsUrl = $derived(getMapsUrl(data.fort));
</script>

<div class="fort-detail">
	<div class="breadcrumb">
		<a href={resolve('/')}>← {$language === 'en' ? 'Back to List' : 'सूचीकडे परत जा'}</a>
	</div>

	<div class="detail-header">
		<h1>{display.name}</h1>
		<p class="marathi-name">{data.fort.nameMarathi}</p>
		<div class="badges">
			<span class="badge badge-primary">{display.type}</span>
			{#if display.district}
				<span class="badge badge-secondary">{display.district}</span>
			{/if}
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

				{#if data.fort.coordinates}
					<div class="detail-item">
						<span class="detail-label">{translations[$language]['coordinates']}</span>
						<span class="detail-value">{formatCoordinates(data.fort.coordinates)}</span>
					</div>
				{/if}

				{#if data.fort.altitude}
					<div class="detail-item">
						<span class="detail-label">{translations[$language]['altitude']}</span>
						<span class="detail-value">{data.fort.altitude} m</span>
					</div>
				{/if}

				{#if data.fort.builtByOrEra}
					<div class="detail-item">
						<span class="detail-label">{translations[$language]['builtByOrEra']}</span>
						<span class="detail-value">{data.fort.builtByOrEra}</span>
					</div>
				{/if}

				{#if data.fort.associatedWith}
					<div class="detail-item">
						<span class="detail-label">{translations[$language]['associatedWith']}</span>
						<span class="detail-value">{data.fort.associatedWith}</span>
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
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html data.fort.content}
					{:else if $language === 'mr' && data.fort.descriptionMarathi}
						<p>{data.fort.descriptionMarathi}</p>
					{:else if $language === 'en' && data.fort.description}
						<p>{data.fort.description}</p>
					{:else if $language === 'mr' && data.fort.content}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
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
					<a
						href={data.fort.wikipediaLink}
						target="_blank"
						rel="noopener noreferrer"
						class="button"
					>
						📖 Wikipedia
					</a>
				</p>
			{/if}
		</section>

		{#if data.fort.tags && data.fort.tags.length > 0}
			<section class="detail-section">
				<h2>Tags</h2>
				<div class="tags">
					{#each data.fort.tags as tag (tag)}
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
		padding: 76px 24px 40px;
	}

	.breadcrumb {
		margin-bottom: 1.5rem;
	}

	.breadcrumb a {
		color: var(--acc);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.breadcrumb a:hover {
		color: var(--ink);
	}

	.detail-header {
		margin-bottom: 2rem;
		border-bottom: 2px solid rgba(var(--lr), 0.14);
		padding-bottom: 1.5rem;
	}

	.detail-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		color: var(--ink);
	}

	.marathi-name {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		color: var(--mut);
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
		background-color: var(--acc);
		color: var(--bg);
	}

	.badge-secondary {
		background-color: rgba(var(--lr), 0.08);
		color: var(--ink2);
	}

	.badge-tertiary {
		background-color: rgba(var(--lr), 0.08);
		color: var(--acc2);
	}

	.detail-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.detail-section {
		padding: 1.5rem;
		background-color: var(--card);
		border-radius: 0.5rem;
		border: 1px solid rgba(var(--lr), 0.14);
	}

	.detail-section h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: var(--ink);
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
		color: var(--ink2);
		font-size: 0.875rem;
	}

	.detail-value {
		color: var(--mut);
		font-size: 1rem;
	}

	.detail-text {
		color: var(--mut);
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
		color: var(--acc);
		border: 1px solid var(--acc);
	}

	.button-primary {
		background-color: var(--acc);
		color: var(--bg);
		border-color: var(--acc);
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
		background-color: rgba(var(--lr), 0.14);
		color: var(--ink2);
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
