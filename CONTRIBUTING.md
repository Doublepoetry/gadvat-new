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

## Adding a Photo

Fort photos live on [Wikimedia Commons](https://commons.wikimedia.org), not in this repository. Commons stores the file, its author and its licence; Gadvat lists the filename and shows the photo with a credit line. A photo you add here also becomes part of the public record of the fort, usable by Wikipedia and anyone else.

### Step 1: Upload to Commons

Only upload photos you took yourself. Photos copied from other websites, Google Maps or social media will be deleted by Commons.

1. Open the [Upload Wizard](https://commons.wikimedia.org/wiki/Special:UploadWizard) and sign in (creating an account is free).
2. Choose **This file is my own work** and keep the default licence, **CC BY-SA 4.0**.
3. Give the file a descriptive title that names the fort and the subject, e.g. `Torna Fort north rampart.jpg`. Renaming a Commons file later needs a request, so get it right now.
4. Add a short description of what the photo shows.
5. Add the fort's category, e.g. `Torna Fort`. Search Commons for `Category:<fort name>` to find the right one. If the fort has no category yet, use `Forts in Maharashtra`.

If the photo you want is already on Commons, skip this step. It must be under a Creative Commons licence or in the public domain; the file page shows the licence.

### Step 2: Add the Filename to the Fort File

Copy the filename from the Commons page title without the `File:` prefix, and add it to the fort's `images` list:

```yaml
images:
  - file: Battlements of torna fort.jpg
    alt: Stone bastion on the walls of Torna Fort
    caption: One of the bastions on the fort walls
    captionMarathi: किल्ल्याच्या तटबंदीवरील एक बुरूज
```

- **file** (required): the Commons filename, exactly as it appears on Commons.
- **alt** (required): what the photo shows, for readers who cannot see it.
- **caption** and **captionMarathi** (optional): context shown under the photo.

Images appear in the gallery in the order you list them; put the best overall view first.

Do not write the author or licence yourself. They are fetched from Commons and shown on every photo automatically.

### Step 3: Sync and Open a Pull Request

```bash
npm run commons:sync
```

This fetches the photo's size, thumbnail URL, author and licence from Commons and writes them to a data file in the repository. Commit that file together with your fort file, then open a pull request as described in [Submitting Your Contribution](#submitting-your-contribution). If you cannot run the command, open the pull request anyway and say so; a maintainer will run it.

CI fails if a filename does not exist on Commons, or if its licence is not Creative Commons or public domain.

### Writing Alt Text

- Describe what is in the frame: the structure, the viewpoint, the landscape. `Mahadarwaja gate seen from the lower steps` beats `Raigad Fort`.
- Keep it to one sentence, about 125 characters or fewer.
- Do not start with "Photo of" or "Image of"; screen readers already announce an image.
- Leave out the photographer, licence and date. Those belong in the credit line or the caption.

### Writing Captions

- Add what the photo cannot show on its own: which part of the fort, the season, the trail it was taken from.
- Keep captions to one or two short sentences.
- Write `captionMarathi` in Devanagari. If you cannot write Marathi, leave it out; someone else can add it later.
- Do not repeat the alt text.

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
- **images**: Photos from Wikimedia Commons (see [Adding a Photo](#adding-a-photo))

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
