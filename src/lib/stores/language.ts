import { writable } from 'svelte/store';
import type { Language } from '../types';

// Initialize with browser language or default to English
const getInitialLanguage = (): Language => {
	if (typeof window === 'undefined') return 'en';

	const stored = localStorage.getItem('gadvat-language');
	if (stored === 'en' || stored === 'mr') {
		return stored;
	}

	// Detect browser language
	const browserLang = navigator.language.toLowerCase();
	if (browserLang.startsWith('mr')) {
		return 'mr';
	}

	return 'en';
};

export const language = writable<Language>(getInitialLanguage());

export const translations = {
	en: {
		home: 'Home',
		forts: 'Forts',
		search: 'Search',
		filter: 'Filter',
		language: 'Language',
		english: 'English',
		marathi: 'मराठी',
		aboutGadvat: 'About Gadvat',
		fortDetails: 'Fort Details',
		district: 'District',
		type: 'Type',
		region: 'Region',
		coordinates: 'Coordinates',
		altitude: 'Altitude',
		viewOnMap: 'View on Map',
		readMore: 'Read More',
		backToList: 'Back to List',
		noDescription: 'No description available',
		totalForts: 'Total Forts'
	},
	mr: {
		home: 'मुख्यपृष्ठ',
		forts: 'किल्ले',
		search: 'शोध',
		filter: 'फिल्टर',
		language: 'भाषा',
		english: 'English',
		marathi: 'मराठी',
		aboutGadvat: 'गडवाट बद्दल',
		fortDetails: 'किल्ल्याचे तपशील',
		district: 'जिल्हा',
		type: 'प्रकार',
		region: 'क्षेत्र',
		coordinates: 'निर्देशांक',
		altitude: 'उंची',
		viewOnMap: 'नकाशावर पहा',
		readMore: 'अधिक वाचा',
		backToList: 'सूचीकडे परत जा',
		noDescription: 'वर्णन उपलब्ध नाही',
		totalForts: 'एकूण किल्ले'
	}
};

language.subscribe((lang) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('gadvat-language', lang);
	}
});

export const getTranslation = (key: keyof typeof translations.en, lang: Language): string => {
	return translations[lang][key] || translations.en[key] || key;
};
