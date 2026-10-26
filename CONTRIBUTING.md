# Contributing to Gadvat

Thank you for your interest in contributing to Gadvat! This guide will help you add new forts or improve existing data.

## Philosophy

Gadvat is built on principles of **privacy**, **minimalism**, and **community**. We believe historical knowledge should be freely accessible, easy to contribute to, and independent of corporate infrastructure.

## Adding a New Fort

### Step 1: Create a Fort File

Create a new markdown file in the `forts/` directory following this naming convention:

```
forts/NNN-fort-name.md
```

Where `NNN` is a 3-digit ID (e.g., `001`, `042`, `267`).

### Step 2: Add Frontmatter

Start your file with YAML frontmatter containing the fort's metadata:

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
shortDescriptionMarathi: मराठी शक्तिचा आसन
tags:
  - monsoon-trekking
  - photography
  - historical
mapsLink: https://maps.google.com/?q=18.3545,73.3433
wikipediaLink: https://en.wikipedia.org/wiki/Raigad_Fort
---
```

### Step 3: Write Content

Add content below the frontmatter in markdown format:

```markdown
## History

Detailed history of the fort, architectural features, and cultural significance.

## Route Information

### From Pune
- Distance: 50 km
- Duration: 2 hours by road
- Best season: October-May

## Things to See

- Main Palace
- Ramparts and gates
- Water reservoirs

## Photography Tips

Golden hour views from the western edge...

## References & Sources

- [Wikipedia](https://en.wikipedia.org/wiki/Raigad_Fort)
- [Fort Records](https://example.com)
```

## Field Reference

### Required Fields

- **id**: 3-digit unique identifier (e.g., `001`)
- **name**: English name of the fort
- **nameMarathi**: Marathi name in Devanagari script
- **coordinates**: `[latitude, longitude]` in decimal format
- **type**: One of: `Hill Fort`, `Plain Fort`, `Sea Fort`, `Island Fort`, `Underground Fort`
- **district**: Maharashtra district name

### Optional Fields

- **region**: Geographic region (e.g., "Western Ghats")
- **altitude**: Height in meters above sea level
- **area**: Area in square kilometers
- **foundedYear**: Historical founding year
- **notable**: Boolean (`true`/`false`) - for featured forts
- **shortDescription**: One-line summary
- **shortDescriptionMarathi**: One-line Marathi summary
- **description**: 2-3 sentence overview
- **descriptionMarathi**: 2-3 sentence Marathi overview
- **tags**: Array of tags (e.g., `["trekking", "photography"]`)
- **mapsLink**: Google Maps link
- **wikipediaLink**: Wikipedia article link

## Validation

Before submitting, ensure:

✅ ID is unique (3 digits, zero-padded)
✅ Coordinates are valid (lat: -90 to 90, lon: -180 to 180)
✅ All required fields are present
✅ Marathi text is in Devanagari script
✅ Markdown syntax is valid
✅ No duplicate IDs in other fort files

The CI pipeline will automatically validate your submission.

## Submitting Your Contribution

1. Fork the repository
2. Create a branch: `git checkout -b add-fort-name`
3. Add or edit fort files in the `forts/` directory
4. Commit with a clear message: `git commit -m "Add Raigad Fort (ID: 001)"`
5. Push to your fork: `git push origin add-fort-name`
6. Create a Pull Request with a description of what you added

## Code of Conduct

- Be respectful and inclusive
- Use historically accurate information
- Credit your sources
- Maintain privacy—no personal information in fort data
- Keep commits clean and focused

## Questions?

Open an issue or discussion in the repository. We're here to help!

Thank you for helping preserve Maharashtra's rich history. 🏰
