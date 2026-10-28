export interface Fort {
	id: string;
	name: string;
	nameMarathi: string;
	coordinates: [number, number]; // [latitude, longitude]
	type: 'Hill Fort' | 'Plain Fort' | 'Sea Fort' | 'Island Fort' | 'Underground Fort';
	district: string;
	region?: string;
	altitude?: number;
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
	images?: GalleryImage[];
}

// A Wikimedia Commons photo, resolved at build time from a fort's `images` frontmatter
export interface GalleryImage {
	file: string; // Commons filename
	src: string; // thumbnail URL
	width: number;
	height: number;
	alt: string;
	caption?: string;
	captionMarathi?: string;
	credit: string; // author, plain text
	license: string; // e.g. "CC BY-SA 4.0"
	licenseUrl: string;
	sourceUrl: string; // Commons file page
}

export interface FortData {
	forts: Fort[];
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
	coordinates: [number, number];
}
