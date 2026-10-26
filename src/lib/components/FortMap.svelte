<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import type { Fort } from '../types';

	let { forts }: { forts: Fort[] } = $props();
	let mapContainer: HTMLDivElement;
	let map: L.Map;

	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const mapMarkers = new Map<string, L.Marker>();

	function navigateToFort(fortId: string) {
		window.location.href = `/${fortId}`;
	}

	onMount(() => {
		if (!mapContainer) return;

		// Initialize map centered on Maharashtra
		map = L.map(mapContainer).setView([19.5, 75], 7);

		// Add OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		// Add fort markers
		forts.forEach((fort) => {
			const [lat, lon] = fort.coordinates;
			const marker = L.marker([lat, lon], {
				title: fort.name
			});

			// Bind popup with fort info
			const popupContent = `
				<div class="fort-popup">
					<h3>${fort.name}</h3>
					<p class="marathi-name">${fort.nameMarathi}</p>
					<p class="fort-type">${fort.type}</p>
					<button class="popup-button" onclick="window.location.href='/${fort.id}'">
						View Details →
					</button>
				</div>
			`;

			marker.bindPopup(popupContent);
			marker.on('click', () => navigateToFort(fort.id));
			marker.addTo(map);
			mapMarkers.set(fort.id, marker);
		});

		// Fit bounds to show all markers
		if (mapMarkers.size > 0) {
			const group = L.featureGroup(Array.from(mapMarkers.values()));
			map.fitBounds(group.getBounds(), { padding: [50, 50] });
		}

		return () => {
			if (map) map.remove();
		};
	});

	function highlightFort(fortId: string) {
		const marker = mapMarkers.get(fortId);
		if (marker) {
			marker.openPopup();
			map.setView(marker.getLatLng(), 12);
		}
	}

	export { highlightFort };
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
	.map-container {
		width: 100%;
		height: 500px;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.fort-popup) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		padding: 0;
		min-width: 200px;
	}

	:global(.fort-popup h3) {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
	}

	:global(.fort-popup .marathi-name) {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		color: #6b7280;
	}

	:global(.fort-popup .fort-type) {
		margin: 0 0 1rem 0;
		font-size: 0.75rem;
		color: #4f46e5;
		font-weight: 500;
	}

	:global(.popup-button) {
		width: 100%;
		padding: 0.5rem;
		background-color: #4f46e5;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		font-weight: 500;
		font-size: 0.875rem;
		transition: background-color 0.2s ease;
	}

	:global(.popup-button:hover) {
		background-color: #4338ca;
	}

	@media (max-width: 768px) {
		.map-container {
			height: 350px;
		}
	}
</style>
