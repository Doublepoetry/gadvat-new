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
