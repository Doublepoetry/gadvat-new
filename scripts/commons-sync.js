// Fetch Commons metadata for every image listed in forts/*.md and write
// src/data/commons.json, which is committed so builds never touch the network.
//
//   npm run commons:sync            rewrite src/data/commons.json
//   npm run commons:sync -- --check fail if a file is missing on Commons, has a
//                                   non-free licence, or the committed JSON is stale

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { API_URL, THUMB_WIDTH, isFreeLicense, normalizeFilename, toCommonsEntry } from './commons.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fortsDir = path.join(__dirname, '../forts');
const outputFile = path.join(__dirname, '../src/data/commons.json');

// Wikimedia asks API clients to identify themselves.
const USER_AGENT = 'gadvat-commons-sync/1.0 (https://github.com/Doublepoetry/gadvat-new)';
const BATCH = 50; // API limit for titles per request

// Fields whose drift changes what we show or whether we may show it.
const CRITICAL_FIELDS = ['src', 'license', 'licenseCode', 'licenseUrl'];

function listImageFiles() {
	const files = new Set();
	for (const name of fs.readdirSync(fortsDir).filter((f) => f.endsWith('.md'))) {
		const { data } = matter(fs.readFileSync(path.join(fortsDir, name), 'utf-8'));
		for (const image of Array.isArray(data.images) ? data.images : []) {
			if (image?.file) files.add(normalizeFilename(image.file));
		}
	}
	return [...files].sort();
}

async function fetchBatch(files) {
	const params = new URLSearchParams({
		action: 'query',
		format: 'json',
		formatversion: '2',
		redirects: '1',
		prop: 'imageinfo',
		iiprop: 'url|size|extmetadata',
		iiurlwidth: String(THUMB_WIDTH),
		iiextmetadatafilter: 'Artist|Credit|LicenseShortName|License|LicenseUrl',
		titles: files.map((f) => `File:${f}`).join('|')
	});
	const response = await fetch(`${API_URL}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
	if (!response.ok) throw new Error(`Commons API: HTTP ${response.status}`);
	const { query } = await response.json();

	// Map each final page title back to the name the fort file asked for.
	const finalTitle = new Map(files.map((f) => [f, `File:${f}`]));
	for (const step of [...(query.normalized ?? []), ...(query.redirects ?? [])]) {
		for (const [file, title] of finalTitle) if (title === step.from) finalTitle.set(file, step.to);
	}
	const pages = new Map(query.pages.map((p) => [p.title, p]));
	return files.map((file) => [file, toCommonsEntry(pages.get(finalTitle.get(file)) ?? { missing: true })]);
}

async function main() {
	const check = process.argv.includes('--check');
	const files = listImageFiles();
	console.log(`🖼️  ${files.length} Commons files referenced by forts/\n`);

	const fresh = {};
	const errors = [];
	for (let i = 0; i < files.length; i += BATCH) {
		for (const [file, entry] of await fetchBatch(files.slice(i, i + BATCH))) {
			if (!entry) {
				errors.push(`  ✗ ${file}: not found on Commons`);
			} else if (!isFreeLicense(entry.licenseCode)) {
				errors.push(`  ✗ ${file}: licence "${entry.license}" is not CC BY, CC BY-SA, CC0 or public domain`);
			} else {
				fresh[file] = entry;
			}
		}
	}

	if (check) {
		const committed = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile, 'utf-8')) : {};
		for (const [file, entry] of Object.entries(fresh)) {
			const old = committed[file];
			if (!old) {
				errors.push(`  ✗ ${file}: missing from src/data/commons.json (run npm run commons:sync)`);
				continue;
			}
			for (const key of Object.keys(entry)) {
				if (old[key] === entry[key]) continue;
				const msg = `${file}: ${key} changed on Commons (run npm run commons:sync)`;
				if (CRITICAL_FIELDS.includes(key)) errors.push(`  ✗ ${msg}`);
				else console.warn(`  ⚠️  ${msg}`);
			}
		}
		for (const file of Object.keys(committed)) {
			if (!files.includes(file)) console.warn(`  ⚠️  ${file}: in commons.json but no fort uses it`);
		}
	}

	if (errors.length > 0) {
		errors.forEach((err) => console.error(err));
		console.error('\n❌ Commons check failed.\n');
		process.exit(1);
	}

	if (check) {
		console.log('✅ src/data/commons.json matches Commons\n');
		return;
	}
	fs.mkdirSync(path.dirname(outputFile), { recursive: true });
	fs.writeFileSync(outputFile, JSON.stringify(fresh, null, '\t') + '\n');
	console.log(`✅ Wrote ${Object.keys(fresh).length} entries to ${outputFile}\n`);
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
