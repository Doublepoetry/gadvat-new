// Wikimedia Commons helpers shared by commons-sync.js and build-data.js.
// Fort photos live on Commons; we only store filenames and the metadata
// commons-sync.js caches in src/data/commons.json.

export const API_URL = 'https://commons.wikimedia.org/w/api.php';
export const THUMB_WIDTH = 1280;

// Commons only hosts free licences, but CC BY-NC/ND and "fair use" files exist
// on other wikis. Accept CC BY, CC BY-SA, CC0 and public domain only.
const FREE_LICENSE = /^(cc-by(-sa)?-[\d.]+|cc-zero|cc0|pd)\b/i;

/** Canonical Commons filename: no "File:" prefix, spaces not underscores, first letter upper-case. */
export function normalizeFilename(name) {
	const bare = String(name)
		.trim()
		.replace(/^file:/i, '')
		.replace(/_/g, ' ')
		.replace(/\s+/g, ' ');
	return bare.charAt(0).toUpperCase() + bare.slice(1);
}

export function isFreeLicense(license) {
	return typeof license === 'string' && FREE_LICENSE.test(license);
}

/** Commons metadata values are HTML fragments; keep the text only. */
export function stripHtml(html) {
	return String(html ?? '')
		.replace(/<[^>]*>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function dropQuery(url) {
	return url ? url.split('?')[0] : url;
}

/** Turn one `pages[]` entry from the imageinfo API into a cache entry, or null if the file is missing. */
export function toCommonsEntry(page) {
	const info = page.imageinfo?.[0];
	if (page.missing || !info) return null;
	const meta = info.extmetadata ?? {};
	const value = (key) => meta[key]?.value;
	const licenseName = stripHtml(value('LicenseShortName'));

	return {
		file: normalizeFilename(page.title),
		src: dropQuery(info.thumburl ?? info.url),
		width: info.thumbwidth ?? info.width,
		height: info.thumbheight ?? info.height,
		credit: stripHtml(value('Artist')) || stripHtml(value('Credit')) || 'Unknown author',
		license: licenseName || value('License') || '',
		licenseCode: value('License') || '',
		licenseUrl: value('LicenseUrl') || info.descriptionurl,
		sourceUrl: info.descriptionurl
	};
}

/** Check a fort's `images` frontmatter. Returns error strings, like validateFortData. */
export function validateImages(images, cache) {
	if (images === undefined) return [];
	if (!Array.isArray(images)) return ['  ✗ images must be a list'];

	const errors = [];
	images.forEach((image, i) => {
		if (!image || typeof image.file !== 'string' || !image.file.trim()) {
			errors.push(`  ✗ images[${i}]: missing file`);
			return;
		}
		const file = normalizeFilename(image.file);
		if (typeof image.alt !== 'string' || !image.alt.trim()) {
			errors.push(`  ✗ images[${i}] (${file}): missing alt text`);
		}
		const entry = cache[file];
		if (!entry) {
			errors.push(
				`  ✗ images[${i}]: ${file} is not in src/data/commons.json (run npm run commons:sync)`
			);
		} else if (!isFreeLicense(entry.licenseCode)) {
			errors.push(
				`  ✗ images[${i}]: ${file} has licence "${entry.license}"; only CC BY, CC BY-SA, CC0 and public domain are allowed`
			);
		}
	});
	return errors;
}

/** Merge frontmatter entries with cached Commons metadata into GalleryImage objects. */
export function toGalleryImages(images, cache) {
	return (images ?? []).map((image) => {
		const entry = cache[normalizeFilename(image.file)];
		return {
			file: entry.file,
			src: entry.src,
			width: entry.width,
			height: entry.height,
			alt: image.alt,
			...(image.caption && { caption: image.caption }),
			...(image.captionMarathi && { captionMarathi: image.captionMarathi }),
			credit: entry.credit,
			license: entry.license,
			licenseUrl: entry.licenseUrl,
			sourceUrl: entry.sourceUrl
		};
	});
}
