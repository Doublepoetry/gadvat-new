# Fort Data Schema

This document defines the data format for fort markdown files in Gadvat.

## File Format

Each fort is stored as a single markdown file in the `forts/` directory:

```
forts/NNN-fort-name.md
```

Where `NNN` is a 3-digit zero-padded ID.

## YAML Frontmatter (Metadata)

The file begins with YAML frontmatter enclosed in triple dashes:

```yaml
---
id: 001
name: Fort Name
nameMarathi: किल्ल्याचे नाव
coordinates: [latitude, longitude]
type: Fort Type
district: District Name
---
```

### Required Fields

| Field | Type | Format | Example |
|-------|------|--------|---------|
| `id` | String | 3 digits, zero-padded | `"001"`, `"042"`, `"267"` |
| `name` | String | English name | `"Raigad Fort"` |
| `nameMarathi` | String | Marathi (Devanagari) | `"राइगड किल्ला"` |
| `coordinates` | Array | `[latitude, longitude]` | `[18.3545, 73.3433]` |
| `type` | String | See valid types below | `"Hill Fort"` |
| `district` | String | Maharashtra district | `"Pune"` |

### Optional Fields

| Field | Type | Format | Example |
|-------|------|--------|---------|
| `region` | String | Geographic region | `"Western Ghats"` |
| `altitude` | Number | Meters above sea level | `2700` |
| `area` | Number | Square kilometers | `270` |
| `foundedYear` | Number | Historical year | `1656` |
| `notable` | Boolean | Featured fort | `true` |
| `shortDescription` | String | One-line summary | `"Historic hill fort"` |
| `shortDescriptionMarathi` | String | One-line Marathi | `"ऐतिहासिक पहाड किल्ला"` |
| `description` | String | 2-3 sentences | `"Raigad Fort is..."` |
| `descriptionMarathi` | String | 2-3 sentences Marathi | `"राइगड किल्ला एक..."` |
| `tags` | Array | Keyword tags | `["trekking", "photography"]` |
| `mapsLink` | String | Google Maps URL | `"https://maps.google.com/..."` |
| `wikipediaLink` | String | Wikipedia URL | `"https://en.wikipedia.org/..."` |

## Field Specifications

### `id` (Required)

Unique 3-digit identifier for the fort. Must be zero-padded.

✅ Valid: `"001"`, `"042"`, `"267"`
❌ Invalid: `"1"`, `"01"`, `"1001"`

### `name` & `nameMarathi` (Required)

English and Marathi names of the fort.

✅ Valid: `"Raigad Fort"`, `"राइगड किल्ला"`
❌ Invalid: `""`, `null`, `"Raigad"` (incomplete)

**Marathi Notes**:
- Must use Devanagari script (not transliteration)
- Include fort designation if appropriate (किल्ला = fort, दुर्ग = fort, किला = fort)

### `coordinates` (Required)

Geographic location as `[latitude, longitude]` in decimal format (WGS84).

✅ Valid: `[18.3545, 73.3433]`, `[19.0, 72.5]`
❌ Invalid: `"18.3545, 73.3433"`, `[18.3545]`, `[190, 735]`

**Ranges**:
- Latitude: -90 to 90
- Longitude: -180 to 180

### `type` (Required)

Classification of the fort. Must be one of:

- `"Hill Fort"` — Fort built on elevated terrain
- `"Plain Fort"` — Fort built on flat ground
- `"Sea Fort"` — Coastal/maritime fort
- `"Island Fort"` — Fort on an island
- `"Underground Fort"` — Subterranean fort

✅ Valid: `"Hill Fort"`, `"Sea Fort"`
❌ Invalid: `"Mountain Fort"`, `"Coastal Fort"`, `"hill fort"` (case-sensitive)

### `district` (Required)

Maharashtra district name. Must match the official district list.

Valid Maharashtra districts:
```
Pune, Nashik, Aurangabad, Ahmednagar, Solapur,
Buldhana, Akola, Washim, Yavatmal, Amravati,
Nagpur, Wardha, Chandrapur, Gondia, Bhandara,
Ratnagiri, Sindhudurg, Kolhapur, Sangli, Satara
```

✅ Valid: `"Pune"`, `"Nashik"`
❌ Invalid: `"pune"` (case-sensitive), `"Maharahstra"`, `"Deccan"`

### `altitude` (Optional)

Height above sea level in meters.

✅ Valid: `2700`, `0`, `1500`
❌ Invalid: `"2700"` (must be number), `-1000` (negative)

### `tags` (Optional)

Array of keyword tags for filtering and discovery.

✅ Valid: `["trekking", "photography", "history"]`
❌ Invalid: `"trekking"` (must be array), `["Trekking"]` (use lowercase)

Suggested tags:
```
trekking, photography, history, architecture,
monsoon, scenic, accessible, difficult,
ancient, medieval, colonial
```

### Links (`mapsLink`, `wikipediaLink`) (Optional)

Full URLs to external resources.

✅ Valid: `"https://maps.google.com/?q=18.3545,73.3433"`
❌ Invalid: `"maps.google.com"` (no protocol), `"https://google.com"` (not specific)

## Markdown Content

Content below the frontmatter uses standard Markdown.

### Allowed Markdown

- Headings: `## Section`, `### Subsection` (level 2-3 only)
- Lists: `- Item`, `1. Numbered`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- Code: `` `code` ``
- Blockquotes: `> quote`
- Horizontal rules: `---`

### Prohibited

- HTML tags (sanitized on display)
- Level 1 headings (`#`) — reserved for app layout
- Images in markdown — refer to them via description and links

### Content Structure (Recommended)

```markdown
## History
Historical background and significance.

## Architecture
Structural features and design.

## Route Information
### From City
- Distance
- Duration
- Best season

## Things to See
- Feature 1
- Feature 2

## Photography Tips
Suggestions for visiting photographers.

## References & Sources
- [Wikipedia](...)
- [Source](...)
```

## Complete Example

**File**: `forts/001-raigad.md`

```markdown
---
id: 001
name: Raigad Fort
nameMarathi: राइगड किल्ला
coordinates: [18.3545, 73.3433]
type: Hill Fort
district: Pune
region: Western Ghats
altitude: 2700
foundedYear: 1656
notable: true
shortDescription: Historic hill fort and seat of Marathi power
shortDescriptionMarathi: मराठी शक्तिचा आसन आणि ऐतिहासिक किल्ला
description: Raigad Fort is a historic hill fort built by Chhatrapati Shivaji Maharaj in 1656. Located in the Western Ghats of Maharashtra, it served as the capital of the Marathi Empire.
descriptionMarathi: राइगड किल्ला हा छत्रपती शिवाजी महाराजांनी १६५६ मध्ये बांधलेला ऐतिहासिक पहाड किल्ला आहे.
tags:
  - trekking
  - photography
  - history
  - architecture
  - monsoon
mapsLink: https://maps.google.com/?q=18.3545,73.3433
wikipediaLink: https://en.wikipedia.org/wiki/Raigad_Fort
---

## History

Raigad Fort was built by Chhatrapati Shivaji Maharaj in 1656 as the capital of his empire. The fort served as the administrative and military center of the Marathi kingdom for several decades.

### Key Historical Events

- **1656**: Construction began under Shivaji's rule
- **1674**: Coronation ceremony held
- **1818**: British occupation

## Architecture

The fort features typical Mughal-influenced architecture with some indigenous elements.

### Major Structures

- Raj Mahal (Royal Palace)
- Takmak Tok (observation platform)
- Durbar Hall
- Water reservoirs

## Route Information

### From Pune

- **Distance**: 50 km
- **Duration**: 2 hours by road + 3-4 hours trek
- **Best Season**: October-May
- **Difficulty**: Moderate to challenging

### Trekking Route

The trek starts from the base village of Raigad and climbs approximately 650m in elevation.

**Estimated Time**: 3-4 hours ascent, 2-3 hours descent

## Photography Tips

- Golden hour light from the Takmak Tok platform
- Monsoon clouds over the surrounding valleys
- Panoramic views during sunset
- Avoid harsh midday sun

## Things to See

- Raj Mahal ruins
- Takmak Tok (cliff platform)
- Ancient water supply system
- Ramparts and gates
- Temple of Shiva

## References & Sources

- [Wikipedia: Raigad Fort](https://en.wikipedia.org/wiki/Raigad_Fort)
- Marathi Historical Records
- Local guides and community knowledge
```

## Validation Checklist

Before submitting a fort file, verify:

- [ ] ID is 3 digits, zero-padded, unique
- [ ] Name and nameMarathi are filled
- [ ] Coordinates are valid `[lat, lon]` in decimal format
- [ ] Type is one of the valid options
- [ ] District matches the valid list
- [ ] Marathi text uses Devanagari script (not Romanized)
- [ ] Content sections use level 2-3 headings only
- [ ] No duplicate fort IDs
- [ ] Links are valid URLs
- [ ] No HTML tags in markdown

## Questions?

See `CONTRIBUTING.md` for the contribution workflow.
