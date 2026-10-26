import type { Fort, FortData, Language, FortDisplay } from './types';

let fortsData: FortData | null = null;

export async function loadForts(): Promise<FortData> {
	if (fortsData !== null) {
		return fortsData;
	}

	try {
		const response = await fetch('/data/forts.json');
		if (!response.ok) {
			throw new Error(`Failed to load forts: ${response.statusText}`);
		}
		fortsData = (await response.json()) as FortData;
		return fortsData;
	} catch (error) {
		console.error('Error loading forts:', error);
		throw error;
	}
}

export async function getFort(id: string): Promise<Fort | null> {
	const data = await loadForts();
	return data.forts.find((f) => f.id === id) || null;
}

export async function getAllForts(): Promise<Fort[]> {
	const data = await loadForts();
	return data.forts;
}

export function getFortDisplay(fort: Fort, language: Language): FortDisplay {
	return {
		id: fort.id,
		name: language === 'en' ? fort.name : fort.nameMarathi,
		description:
			language === 'en'
				? fort.shortDescription || fort.description || ''
				: fort.shortDescriptionMarathi || fort.descriptionMarathi || '',
		type: fort.type,
		district: fort.district,
		region: fort.region || '',
		coordinates: fort.coordinates
	};
}

export function formatCoordinates(coords: [number, number]): string {
	const [lat, lon] = coords;
	return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

export function getMapsUrl(coords: [number, number]): string {
	const [lat, lon] = coords;
	return `https://maps.google.com/?q=${lat},${lon}`;
}

export function sortForts(forts: Fort[], language: Language): Fort[] {
	return [...forts].sort((a, b) => {
		const nameA = language === 'en' ? a.name : a.nameMarathi;
		const nameB = language === 'en' ? b.name : b.nameMarathi;
		return nameA.localeCompare(nameB);
	});
}

export function filterFortsByDistrict(forts: Fort[], district: string): Fort[] {
	return forts.filter((f) => f.district === district);
}

export function filterFortsByType(forts: Fort[], type: string): Fort[] {
	return forts.filter((f) => f.type === type);
}

export function getUniqueDistricts(forts: Fort[]): string[] {
	const districts = new Set(forts.map((f) => f.district));
	return Array.from(districts).sort();
}

export function getUniqueFortTypes(forts: Fort[]): string[] {
	const types = new Set(forts.map((f) => f.type));
	return Array.from(types).sort();
}
