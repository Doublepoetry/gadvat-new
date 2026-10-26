import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fortsDir = path.join(__dirname, '../forts');
const outputDir = path.join(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'forts.json');

// Required fields for each fort
const REQUIRED_FIELDS = ['id', 'name', 'nameMarathi', 'coordinates', 'type', 'district'];

// Valid fort types
const VALID_TYPES = ['Hill Fort', 'Plain Fort', 'Sea Fort', 'Island Fort', 'Underground Fort'];

// Valid Maharashtra districts
const VALID_DISTRICTS = [
  'Pune', 'Nashik', 'Aurangabad', 'Ahmednagar', 'Solapur',
  'Buldhana', 'Akola', 'Washim', 'Yavatmal', 'Amravati',
  'Nagpur', 'Wardha', 'Chandrapur', 'Gondia', 'Bhandara',
  'Ratnagiri', 'Sindhudurg', 'Kolhapur', 'Sangli', 'Satara',
  'Visakhapatnam', 'Bangalore', 'Belgaum'
];

function validateCoordinates(coords) {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lat, lon] = coords;
  return typeof lat === 'number' && typeof lon === 'number' &&
         lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

function validateFortData(id, frontmatter) {
  const errors = [];

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      errors.push(`  ✗ Missing required field: ${field}`);
    }
  }

  // Validate coordinates
  if (frontmatter.coordinates && !validateCoordinates(frontmatter.coordinates)) {
    errors.push(`  ✗ Invalid coordinates format: ${JSON.stringify(frontmatter.coordinates)}`);
  }

  // Validate type
  if (frontmatter.type && !VALID_TYPES.includes(frontmatter.type)) {
    errors.push(`  ✗ Invalid type: ${frontmatter.type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Validate district
  if (frontmatter.district && !VALID_DISTRICTS.includes(frontmatter.district)) {
    errors.push(`  ✗ Invalid district: ${frontmatter.district}`);
  }

  // Validate id format (3 digits)
  if (!/^\d{3}$/.test(id)) {
    errors.push(`  ✗ Invalid ID format: ${id}. Must be 3 digits (e.g., 001)`);
  }

  return errors;
}

async function buildData() {
  console.log('🔨 Building Gadvat data...\n');

  if (!fs.existsSync(fortsDir)) {
    console.error(`❌ Forts directory not found: ${fortsDir}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(fortsDir).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.warn('⚠️  No markdown files found in forts/ directory');
    console.log('📝 Creating empty forts.json...');
    fs.writeFileSync(outputFile, JSON.stringify({ forts: [], updated: new Date().toISOString() }, null, 2));
    console.log(`✅ Data built successfully: ${outputFile}\n`);
    return;
  }

  const forts = [];
  const ids = new Set();
  let hasErrors = false;

  console.log(`📂 Processing ${files.length} fort files...\n`);

  for (const file of files) {
    const filePath = path.join(fortsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: markdown } = matter(content);

    const id = data.id;
    const errors = validateFortData(id, data);

    if (errors.length > 0) {
      console.error(`❌ Validation failed for ${file}:`);
      errors.forEach(err => console.error(err));
      hasErrors = true;
      continue;
    }

    if (ids.has(id)) {
      console.error(`❌ Duplicate fort ID: ${id} (in ${file})`);
      hasErrors = true;
      continue;
    }

    ids.add(id);

    const fort = {
      id,
      name: data.name,
      nameMarathi: data.nameMarathi,
      coordinates: data.coordinates,
      type: data.type,
      district: data.district,
      region: data.region || null,
      altitude: data.altitude || null,
      area: data.area || null,
      foundedYear: data.foundedYear || null,
      notable: data.notable || false,
      shortDescription: data.shortDescription || null,
      shortDescriptionMarathi: data.shortDescriptionMarathi || null,
      description: data.description || null,
      descriptionMarathi: data.descriptionMarathi || null,
      tags: data.tags || [],
      mapsLink: data.mapsLink || null,
      wikipediaLink: data.wikipediaLink || null,
      content: markdown.trim() || null,
      filename: file
    };

    forts.push(fort);
    console.log(`✅ ${id} - ${data.name}`);
  }

  if (hasErrors) {
    console.error('\n❌ Build failed with validation errors. Fix the issues above and try again.\n');
    process.exit(1);
  }

  // Sort by ID for consistency
  forts.sort((a, b) => a.id.localeCompare(b.id));

  const output = {
    forts,
    meta: {
      total: forts.length,
      updated: new Date().toISOString(),
      version: '1.0'
    }
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

  console.log(`\n✅ Data built successfully!`);
  console.log(`📊 Total forts: ${forts.length}`);
  console.log(`📁 Output: ${outputFile}\n`);
}

buildData().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
