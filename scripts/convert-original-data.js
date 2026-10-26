import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fortsDir = path.join(__dirname, '../forts');
const originalDataPath = '/tmp/original-gadvat/data/forts.json';

// Type mapping from original to new format
const typeMap = {
  'Hill': 'Hill Fort',
  'Land': 'Plain Fort',
  'Sea': 'Sea Fort',
  'Island': 'Island Fort',
  'Underground': 'Underground Fort'
};

function convertType(originalType) {
  return typeMap[originalType] || 'Hill Fort';
}

function sanitizeId(id) {
  // Convert F001 to 001
  const num = parseInt(id.replace(/[^\d]/g, ''), 10);
  return String(num).padStart(3, '0');
}

function normalizeDistrict(district) {
  // Map old district names to current ones
  const districtMap = {
    'Ahilyanagar': 'Pune',
    'Yavatmal': 'Yavatmal',
    'Kolhapur': 'Kolhapur',
    'Ratnagiri': 'Ratnagiri',
    'Sindhudurg': 'Sindhudurg'
  };
  return districtMap[district] || district;
}

function createMarkdown(fort) {
  const id = sanitizeId(fort.id);
  const name = fort.name;
  const nameMarathi = fort.name_marathi;
  const coordinates = [parseFloat(fort.latitude), parseFloat(fort.longitude)];
  const type = convertType(fort.type);
  const district = normalizeDistrict(fort.district);
  const region = fort.region || '';

  // Build frontmatter
  const frontmatter = {
    id,
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

  // Build content
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

  // Format as markdown
  let yamlStr = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (key === 'id') {
      // ID must always be quoted string
      yamlStr += `${key}: "${value}"\n`;
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
      const fortName = fort.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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

convertData().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
