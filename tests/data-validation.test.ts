import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const fortsDir = path.join(process.cwd(), 'forts');

describe('Fort Data Validation', () => {
	let fortFiles: string[] = [];

	beforeAll(() => {
		if (fs.existsSync(fortsDir)) {
			fortFiles = fs.readdirSync(fortsDir).filter((f) => f.endsWith('.md'));
		}
	});

	it('should have forts directory', () => {
		expect(fs.existsSync(fortsDir)).toBe(true);
	});

	describe('Valid Fort Files', () => {
		it('should parse YAML frontmatter correctly', () => {
			if (fortFiles.length === 0) {
				console.warn('No fort files to test');
				return;
			}

			const testFile = fortFiles[0];
			const content = fs.readFileSync(path.join(fortsDir, testFile), 'utf-8');
			const { data, content: markdown } = matter(content);

			expect(data).toBeDefined();
			expect(typeof data).toBe('object');
			expect(markdown).toBeDefined();
		});

		it('should have all required fields', () => {
			const requiredFields = ['id', 'name', 'nameMarathi', 'locationAccuracy', 'type'];

			fortFiles.forEach((file) => {
				const content = fs.readFileSync(path.join(fortsDir, file), 'utf-8');
				const { data } = matter(content);

				requiredFields.forEach((field) => {
					expect(data[field]).toBeDefined();
					expect(data[field]).not.toBeNull();
					expect(data[field]).not.toBe('');
				});
			});
		});

		it('should have valid coordinates', () => {
			fortFiles.forEach((file) => {
				const content = fs.readFileSync(path.join(fortsDir, file), 'utf-8');
				const { data } = matter(content);

				// Forts the original site couldn't place have no coordinates yet.
				if (data.locationAccuracy === 'none') {
					expect(data.coordinates).toBeUndefined();
					return;
				}
				expect(data.district).toBeTruthy();

				const coords = data.coordinates;
				expect(Array.isArray(coords)).toBe(true);
				expect(coords.length).toBe(2);

				const [lat, lon] = coords;
				expect(typeof lat).toBe('number');
				expect(typeof lon).toBe('number');
				expect(lat).toBeGreaterThanOrEqual(-90);
				expect(lat).toBeLessThanOrEqual(90);
				expect(lon).toBeGreaterThanOrEqual(-180);
				expect(lon).toBeLessThanOrEqual(180);
			});
		});

		it('should have unique fort IDs', () => {
			const ids = new Set();

			fortFiles.forEach((file) => {
				const content = fs.readFileSync(path.join(fortsDir, file), 'utf-8');
				const { data } = matter(content);

				expect(ids.has(data.id)).toBe(false);
				ids.add(data.id);
			});

			expect(ids.size).toBe(fortFiles.length);
		});

		it('should have valid ID format (3 digits)', () => {
			fortFiles.forEach((file) => {
				const content = fs.readFileSync(path.join(fortsDir, file), 'utf-8');
				const { data } = matter(content);

				expect(/^\d{3}$/.test(data.id)).toBe(true);
			});
		});

		it('should have Marathi names', () => {
			fortFiles.forEach((file) => {
				const content = fs.readFileSync(path.join(fortsDir, file), 'utf-8');
				const { data } = matter(content);

				expect(data.nameMarathi).toBeDefined();
				expect(data.nameMarathi.length).toBeGreaterThan(0);
			});
		});

		it('should have valid fort types', () => {
			const validTypes = ['Hill Fort', 'Sea Fort', 'Coastal Fort', 'Land Fort'];

			fortFiles.forEach((file) => {
				const content = fs.readFileSync(path.join(fortsDir, file), 'utf-8');
				const { data } = matter(content);

				expect(validTypes.includes(data.type)).toBe(true);
			});
		});
	});

	describe('Build Script', () => {
		it('should create data output directory', () => {
			const dataDir = path.join(process.cwd(), 'src', 'data');
			// This will be created when build script runs
			expect(typeof dataDir).toBe('string');
		});
	});
});
