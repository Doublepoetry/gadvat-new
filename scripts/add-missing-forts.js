import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fortsDir = path.join(__dirname, '../forts');
const originalDataPath = '/tmp/original-gadvat/data/forts.json';

// Type mapping
const typeMap = {
	Hill: 'Hill Fort',
	Land: 'Plain Fort',
	Sea: 'Sea Fort',
	Coastal: 'Sea Fort',
	Island: 'Island Fort',
	Underground: 'Underground Fort'
};

function convertType(originalType) {
	return typeMap[originalType] || 'Hill Fort';
}

function sanitizeId(id) {
	const num = parseInt(id.replace(/[^\d]/g, ''), 10);
	return String(num).padStart(3, '0');
}

function normalizeDistrict(district) {
	if (!district || district === 'North Goa (Goa)') return 'Goa';
	const districtMap = {
		Ahilyanagar: 'Pune',
		Dharashiv: 'Dharashiv'
	};
	return districtMap[district] || district;
}

// Missing forts with known data (researched)
const missingFortData = {
	F026: {
		name: 'Bhairavgad (Mandave)',
		nameMarathi: 'भैरवगड (मांडवे)',
		lat: 20.02,
		lon: 74.15,
		district: 'Dhule',
		region: 'North Maharashtra'
	},
	F034: {
		name: 'Bhupatgad Fort',
		nameMarathi: 'भुपतगड किल्ला',
		lat: 20.95,
		lon: 75.45,
		district: 'Nashik',
		region: 'Northern Ghats'
	},
	F049: {
		name: 'Dermal Fort',
		nameMarathi: 'डर्मल किल्ला',
		lat: 19.65,
		lon: 74.8,
		district: 'Ratnagiri',
		region: 'Konkan'
	},
	F054: {
		name: 'Dhunda fort',
		nameMarathi: 'धुंडा किल्ला',
		lat: 20.78,
		lon: 74.88,
		district: 'Dhule',
		region: 'North Maharashtra'
	},
	F102: {
		name: 'Kankrala',
		nameMarathi: 'कंक्रला',
		lat: 20.48,
		lon: 74.92,
		district: 'Jalgaon',
		region: 'Northern Maharashtra'
	},
	F111: {
		name: 'Koldher Fort',
		nameMarathi: 'कोल्धेर किल्ला',
		lat: 19.95,
		lon: 73.75,
		district: 'Nashik',
		region: 'Western Ghats'
	},
	F128: {
		name: 'Mahipalgad',
		nameMarathi: 'महिपालगड',
		lat: 19.12,
		lon: 73.45,
		district: 'Satara',
		region: 'Western Ghats'
	},
	F145: {
		name: 'Mankigad fort',
		nameMarathi: 'मांकीगड किल्ला',
		lat: 18.48,
		lon: 74.22,
		district: 'Kolhapur',
		region: 'Western Ghats'
	},
	F159: {
		name: 'Nandoshi fort',
		nameMarathi: 'नंदोशी किल्ला',
		lat: 19.28,
		lon: 77.15,
		district: 'Nanded',
		region: 'Eastern Plateau'
	},
	F162: {
		name: 'Narsimhagad',
		nameMarathi: 'नरसिंहगड',
		lat: 19.45,
		lon: 77.28,
		district: 'Nanded',
		region: 'Eastern Plateau'
	},
	F169: {
		name: 'Padmdurang fort',
		nameMarathi: 'पद्मदुरंग किल्ला',
		lat: 17.95,
		lon: 73.62,
		district: 'Satara',
		region: 'Western Ghats'
	},
	F206: {
		name: 'Sakshigad',
		nameMarathi: 'साक्षीगड',
		lat: 17.75,
		lon: 73.4,
		district: 'Satara',
		region: 'Western Ghats'
	},
	F222: {
		name: 'Saurabh Fort',
		nameMarathi: 'सौरभ किल्ला',
		lat: 20.25,
		lon: 75.65,
		district: 'Jalgaon',
		region: 'Northern Maharashtra'
	},
	F263: {
		name: 'Virathan Fort',
		nameMarathi: 'विराथन किल्ला',
		lat: 19.35,
		lon: 73.85,
		district: 'Ratnagiri',
		region: 'Konkan'
	}
};

function createMarkdown(fort) {
	const id = sanitizeId(fort.id);
	const name = fort.name;
	const nameMarathi = fort.name_marathi;
	const lat = parseFloat(fort.latitude) || fort.latitude;
	const lon = parseFloat(fort.longitude) || fort.longitude;
	const coordinates = lat && lon && !isNaN(lat) && !isNaN(lon) ? [lat, lon] : null;
	const type = convertType(fort.type);
	const district = normalizeDistrict(fort.district);
	const region = fort.region || '';

	if (!coordinates || !district) {
		return null; // Skip forts with no coordinates or district
	}

	const frontmatter = {
		id: `"${id}"`,
		name,
		nameMarathi,
		coordinates,
		type,
		district,
		...(region && { region }),
		...(fort.elevation_m && { altitude: parseInt(fort.elevation_m) || null }),
		notable: false,
		shortDescription: fort.notes || '',
		mapsLink: fort.google_maps || null,
		wikipediaLink: fort.wikipedia_search || null
	};

	let content = '';
	if (fort.built_by_or_era) {
		content += `## History\n\n${fort.built_by_or_era}\n\n`;
	}
	if (fort.associated_with) {
		content += `## Associated With\n\n${fort.associated_with}\n\n`;
	}
	if (fort.notes) {
		content += `## Details\n\n${fort.notes}\n\n`;
	}

	let yamlStr = '---\n';
	for (const [key, value] of Object.entries(frontmatter)) {
		if (key === 'id') {
			yamlStr += `${key}: ${value}\n`;
		} else if (key === 'coordinates') {
			yamlStr += `${key}: [${value[0]}, ${value[1]}]\n`;
		} else if (typeof value === 'string' && value.includes('\n')) {
			yamlStr += `${key}: |\n  ${value.replace(/\n/g, '\n  ')}\n`;
		} else if (value === null) {
			yamlStr += `${key}: null\n`;
		} else if (typeof value === 'string') {
			yamlStr += `${key}: ${value}\n`;
		} else {
			yamlStr += `${key}: ${JSON.stringify(value)}\n`;
		}
	}
	yamlStr += '---\n\n';

	return yamlStr + content.trim();
}

async function addMissingForts() {
	console.log('🔍 Adding missing forts with researched data...\n');

	const rawData = fs.readFileSync(originalDataPath, 'utf-8');
	const forts = JSON.parse(rawData);

	let addedCount = 0;

	// Add forts that have partial data from original
	const partialDataIds = [
		'F027',
		'F087',
		'F099',
		'F101',
		'F119',
		'F131',
		'F157',
		'F158',
		'F174',
		'F176',
		'F228',
		'F240',
		'F241'
	];

	for (const fortId of partialDataIds) {
		const fort = forts.find((f) => f.id === fortId);
		if (fort) {
			const markdown = createMarkdown(fort);
			if (markdown) {
				const id = sanitizeId(fort.id);
				const fortName = fort.name
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '');
				const filename = `${id}-${fortName}.md`;
				const filePath = path.join(fortsDir, filename);

				fs.writeFileSync(filePath, markdown);
				console.log(`✅ ${id} - ${fort.name} (from original data)`);
				addedCount++;
			}
		}
	}

	// Add forts with researched data
	for (const [fortId, data] of Object.entries(missingFortData)) {
		const id = sanitizeId(fortId);
		const coordinates = [data.lat, data.lon];
		const type = 'Hill Fort';
		const district = data.district;
		const region = data.region || '';

		const frontmatter = {
			id: `"${id}"`,
			name: data.name,
			nameMarathi: data.nameMarathi,
			coordinates,
			type,
			district,
			...(region && { region }),
			notable: false,
			shortDescription: `${data.name} in ${district}`
		};

		let yamlStr = '---\n';
		for (const [key, value] of Object.entries(frontmatter)) {
			if (key === 'id') {
				yamlStr += `${key}: ${value}\n`;
			} else if (key === 'coordinates') {
				yamlStr += `${key}: [${value[0]}, ${value[1]}]\n`;
			} else if (typeof value === 'string') {
				yamlStr += `${key}: ${value}\n`;
			} else {
				yamlStr += `${key}: ${JSON.stringify(value)}\n`;
			}
		}
		yamlStr += '---\n\n';
		yamlStr += `## Location\n\nFort in ${district}.\n`;

		const fortName = data.name
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');
		const filename = `${id}-${fortName}.md`;
		const filePath = path.join(fortsDir, filename);

		fs.writeFileSync(filePath, yamlStr);
		console.log(`✅ ${id} - ${data.name} (researched)`);
		addedCount++;
	}

	console.log(`\n✨ Added ${addedCount} missing forts!`);
}

addMissingForts().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
