import type { Fort } from './types';

export type ColorBy = 'stars' | 'type' | 'height';

// Low to high: sea-teal, parchment, then the land-fort orange
const STOPS: [number, number, number][] = [
	[0x7c, 0xc6, 0xd6],
	[0xf1, 0xd2, 0xa1],
	[0xe2, 0x70, 0x4f]
];

export const RAMP_CSS = `linear-gradient(90deg, ${STOPS.map(([r, g, b]) => `rgb(${r} ${g} ${b})`).join(', ')})`;

export function elevationRange(forts: Fort[]): [number, number] | null {
	const alts = forts.map((f) => f.altitude).filter((a): a is number => !!a);
	return alts.length ? [Math.min(...alts), Math.max(...alts)] : null;
}

/** Colour for an elevation within [min, max], interpolated across the three stops. */
export function elevationColor(alt: number, [min, max]: [number, number]): string {
	const t = max > min ? Math.min(1, Math.max(0, (alt - min) / (max - min))) : 0.5;
	const i = t < 0.5 ? 0 : 1;
	const local = t < 0.5 ? t * 2 : (t - 0.5) * 2;
	const [a, b] = [STOPS[i], STOPS[i + 1]];
	const mix = (k: number) => Math.round(a[k] + (b[k] - a[k]) * local);
	return `rgb(${mix(0)} ${mix(1)} ${mix(2)})`;
}
