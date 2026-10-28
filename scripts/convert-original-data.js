import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fortsDir = path.join(__dirname, '../forts');
const originalDataPath = '/tmp/original-gadvat/data/forts.json';

// Type mapping from original to new format
const typeMap = {
	Hill: 'Hill Fort',
	Sea: 'Sea Fort',
	Coastal: 'Coastal Fort',
	Land: 'Land Fort'
};

function convertType(originalType) {
	const type = typeMap[originalType];
	if (!type) throw new Error(`unknown type "${originalType}"`);
	return type;
}

function sanitizeId(id) {
	// Convert F001 to 001
	const num = parseInt(id.replace(/[^\d]/g, ''), 10);
	return String(num).padStart(3, '0');
}

function yamlValue(value) {
	if (Array.isArray(value)) return `[${value.join(', ')}]`;
	if (typeof value === 'string') return JSON.stringify(value);
	return String(value);
}

function createMarkdown(fort) {
	// Forts the original site couldn't place (location_accuracy "none") have no
	// coordinates, district or region there; keep them that way.
	const located = fort.latitude !== '' && fort.longitude !== '';
	const frontmatter = {
		id: sanitizeId(fort.id),
		name: fort.name,
		nameMarathi: fort.name_marathi,
		...(located && { coordinates: [parseFloat(fort.latitude), parseFloat(fort.longitude)] }),
		locationAccuracy: fort.location_accuracy,
		type: convertType(fort.type),
		...(fort.district && { district: fort.district }),
		...(fort.region && { region: fort.region }),
		...(fort.elevation_m && { altitude: parseInt(fort.elevation_m, 10) }),
		...(fort.built_by_or_era && { builtByOrEra: fort.built_by_or_era }),
		...(fort.associated_with && { associatedWith: fort.associated_with }),
		...(fort.check_flag && { checkFlag: fort.check_flag }),
		notable: false,
		...(fort.notes && { shortDescription: fort.notes }),
		...(fort.google_maps && { mapsLink: fort.google_maps }),
		...(fort.wikipedia_search && { wikipediaLink: fort.wikipedia_search })
	};

	const lines = Object.entries(frontmatter).map(([key, value]) => `${key}: ${yamlValue(value)}`);
	return `---\n${lines.join('\n')}\n---\n`;
}

async function convertData() {
	console.log('🔄 Converting original Gadvat data to markdown format...\n');

	if (!fs.existsSync(originalDataPath)) {
		console.error(`❌ Original data not found: ${originalDataPath}`);
		console.error('Clone the original repo first:');
		console.error('git clone https://github.com/Doublepoetry/Gadvat.git /tmp/original-gadvat');
		process.exit(1);
	}

	if (!fs.existsSync(fortsDir)) {
		fs.mkdirSync(fortsDir, { recursive: true });
	}

	const rawData = fs.readFileSync(originalDataPath, 'utf-8');
	const forts = JSON.parse(rawData);

	console.log(`📂 Converting ${forts.length} forts...\n`);

	let successCount = 0;
	let errorCount = 0;

	for (const fort of forts) {
		try {
			const markdown = createMarkdown(fort);
			const id = sanitizeId(fort.id);
			const fortName = fort.name
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '');
			const filename = `${id}-${fortName}.md`;
			const filePath = path.join(fortsDir, filename);

			fs.writeFileSync(filePath, markdown);
			console.log(`✅ ${id} - ${fort.name}`);
			successCount++;
		} catch (err) {
			console.error(`❌ Error converting ${fort.name}: ${err.message}`);
			errorCount++;
		}
	}

	console.log(`\n✨ Conversion complete!`);
	console.log(`📊 Success: ${successCount}, Errors: ${errorCount}`);
	console.log(`📁 Output: ${fortsDir}\n`);

	if (errorCount === 0) {
		console.log('✅ All forts converted successfully!');
	}
}

convertData().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
