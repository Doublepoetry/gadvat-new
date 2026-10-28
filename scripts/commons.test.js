import { describe, expect, it } from 'vitest';
import { isFreeLicense, normalizeFilename, toCommonsEntry, validateImages } from './commons.js';

describe('isFreeLicense', () => {
	it.each(['cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-sa-2.0', 'cc-zero', 'cc0', 'pd'])(
		'accepts %s',
		(code) => {
			expect(isFreeLicense(code)).toBe(true);
		}
	);

	it.each(['cc-by-nc-4.0', 'cc-by-nd-4.0', 'cc-by-nc-sa-4.0', 'fair use', '', undefined])(
		'rejects %s',
		(code) => {
			expect(isFreeLicense(code)).toBe(false);
		}
	);
});

describe('normalizeFilename', () => {
	it('strips the File: prefix, turns underscores into spaces and capitalizes', () => {
		expect(normalizeFilename(' file:torna_fort  gate.jpg ')).toBe('Torna fort gate.jpg');
	});

	it('leaves a canonical name alone', () => {
		expect(normalizeFilename('Budhla Machi.jpg')).toBe('Budhla Machi.jpg');
	});
});

describe('toCommonsEntry', () => {
	it('returns null for a missing page', () => {
		expect(toCommonsEntry({ title: 'File:Nope.jpg', missing: true })).toBeNull();
	});

	it('maps imageinfo and strips HTML from the credit', () => {
		const entry = toCommonsEntry({
			title: 'File:Torna.jpg',
			imageinfo: [
				{
					url: 'https://upload.wikimedia.org/a/Torna.jpg',
					thumburl: 'https://upload.wikimedia.org/thumb/a/1280px-Torna.jpg?x=1',
					thumbwidth: 1280,
					thumbheight: 853,
					descriptionurl: 'https://commons.wikimedia.org/wiki/File:Torna.jpg',
					extmetadata: {
						Artist: { value: '<a href="/wiki/User:A">A &amp; B</a>' },
						LicenseShortName: { value: 'CC BY-SA 4.0' },
						License: { value: 'cc-by-sa-4.0' },
						LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' }
					}
				}
			]
		});
		expect(entry).toMatchObject({
			file: 'Torna.jpg',
			src: 'https://upload.wikimedia.org/thumb/a/1280px-Torna.jpg',
			width: 1280,
			height: 853,
			credit: 'A & B',
			license: 'CC BY-SA 4.0',
			licenseCode: 'cc-by-sa-4.0'
		});
	});
});

describe('validateImages', () => {
	const cache = {
		'Free.jpg': { licenseCode: 'cc-by-sa-4.0', license: 'CC BY-SA 4.0' },
		'Nc.jpg': { licenseCode: 'cc-by-nc-4.0', license: 'CC BY-NC 4.0' }
	};

	it('passes a cached, free, captioned image', () => {
		expect(validateImages([{ file: 'free.jpg', alt: 'x' }], cache)).toEqual([]);
	});

	it('flags missing alt, uncached files and non-free licences', () => {
		const errors = validateImages(
			[{ file: 'Free.jpg' }, { file: 'Gone.jpg', alt: 'x' }, { file: 'Nc.jpg', alt: 'x' }],
			cache
		);
		expect(errors).toHaveLength(3);
		expect(errors.join('\n')).toMatch(
			/missing alt text[\s\S]*not in src\/data\/commons.json[\s\S]*CC BY-NC/
		);
	});
});
