export type FortType = 'Hill Fort' | 'Sea Fort' | 'Coastal Fort' | 'Land Fort';

/** close: pin checked; approx: near the fort; rough: may be some way off; none: not on the map. */
export type LocationAccuracy = 'close' | 'approx' | 'rough' | 'none';

export interface FortAddress {
	base: string; // village or town treks start from, e.g. "Velhe"
	line: string; // e.g. "Velhe Taluka, Pune District, Maharashtra 412212"
}

export interface NearbyFort {
	id: string;
	km: number; // great-circle distance, one decimal
}

export interface Fort {
	id: string;
	name: string;
	nameMarathi: string;
	coordinates: [number, number] | null; // [latitude, longitude]; null when locationAccuracy is 'none'
	locationAccuracy: LocationAccuracy;
	type: FortType;
	typeMarathi: string;
	district: string | null; // null when locationAccuracy is 'none'
	districtMarathi: string | null;
	region?: string;
	regionMarathi?: string | null;
	altitude?: number;
	builtByOrEra?: string | null;
	associatedWith?: string | null;
	checkFlag?: string | null; // open data question, e.g. "Pin falls in Pune district, listed as Thane"
	address: FortAddress | null; // nearest settlement, from OpenStreetMap
	nearby: NearbyFort[]; // five closest located forts, nearest first
	area?: number;
	foundedYear?: number;
	notable?: boolean;
	shortDescription?: string;
	shortDescriptionMarathi?: string;
	description?: string;
	descriptionMarathi?: string;
	tags?: string[];
	mapsLink?: string;
	wikipediaLink?: string;
	content?: string;
	filename?: string;
}

export interface FortData {
	forts: Fort[];
	districts: Record<string, string>; // English district name → Marathi
	meta: {
		total: number;
		updated: string;
		version: string;
	};
}

export type Language = 'en' | 'mr';

export interface FortDisplay {
	id: string;
	name: string;
	description: string;
	type: string;
	district: string;
	region: string;
	coordinates: [number, number] | null;
}
