import { writable } from 'svelte/store';

export type Theme = 'dark' | 'light';

// Same localStorage keys as the original Gadvat site, so returning visitors keep their settings
const THEME_KEY = 'gadvat:theme';
const SHOW_MR_KEY = 'gadvat:showMr';

function read(key: string): string | null {
	if (typeof window === 'undefined') return null;
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function write(key: string, value: string) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(key, value);
	} catch {
		// Storage can be unavailable (private mode); the setting just won't persist
	}
}

export const theme = writable<Theme>(read(THEME_KEY) === 'light' ? 'light' : 'dark');

theme.subscribe((value) => {
	write(THEME_KEY, value);
	if (typeof document !== 'undefined') document.documentElement.dataset.theme = value;
});

// Marathi is shown alongside English, not instead of it. On by default.
export const showMr = writable<boolean>(read(SHOW_MR_KEY) !== '0');

showMr.subscribe((value) => write(SHOW_MR_KEY, value ? '1' : '0'));
