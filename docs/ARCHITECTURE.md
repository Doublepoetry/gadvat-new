# Gadvat Architecture

## Overview

Gadvat is a SvelteKit-based web application that displays an interactive map of Maharashtra's forts. The architecture prioritizes **privacy**, **minimal dependencies**, and **contributor-friendly data management**.

## Tech Stack

- **Frontend**: SvelteKit 3.0 + Svelte 5
- **Styling**: scoped Svelte styles on CSS design tokens (`src/routes/layout.css`); see [STYLE_GUIDE.md](STYLE_GUIDE.md)
- **Language**: TypeScript
- **Testing**: Vitest
- **CI/CD**: GitHub Actions
- **Deployment**: Containerized (Docker)

## Project Structure

```
gadvat-rewrite/
├── forts/                    # Data source (Markdown files)
│   ├── 001-raigad.md
│   ├── 002-daulatabad.md
│   └── ...
├── scripts/
│   └── build-data.js        # Markdown → JSON converter
├── src/
│   ├── routes/              # SvelteKit pages
│   │   ├── +page.svelte     # Home/map view
│   │   └── [fort]/
│   │       └── +page.svelte # Fort detail view
│   ├── lib/
│   │   ├── components/      # Reusable Svelte components
│   │   ├── utils/           # Helper functions
│   │   └── index.js         # Exports
│   └── data/
│       └── forts.json       # Generated from build script
├── static/                  # Public assets (images, logos)
├── docs/                    # Documentation
├── tests/                   # Test files
├── .github/
│   └── workflows/
│       └── validate.yml     # CI/CD pipeline
├── package.json
├── tsconfig.json
├── vite.config.ts
```

## Data Flow

```
forts/*.md (Markdown)
    ↓
[build-data.js script]
    ↓
src/data/forts.json (Generated JSON)
    ↓
[SvelteKit server-side data loading]
    ↓
[Svelte components render on frontend]
    ↓
Interactive map + fort detail pages
```

## Key Components

### 1. Data Sources (`forts/`)

Fort data is stored as **Markdown files with YAML frontmatter**. This approach:

- Enables non-technical contributors (markdown is familiar)
- Provides version control history
- Allows rich content (History, Routes, Tips, etc.)
- Keeps data separate from application logic

**Example**: `forts/001-raigad.md`

```markdown
---
id: 001
name: Raigad Fort
nameMarathi: राइगड किल्ला
coordinates: [18.3545, 73.3433]
type: Hill Fort
district: Pune
---

## History

...content...
```

### 2. Build Script (`scripts/build-data.js`)

Runs during build or deployment:

- Reads all markdown files from `forts/`
- Parses YAML frontmatter with `gray-matter`
- **Validates** against schema (required fields, coordinate format, etc.)
- **Outputs** to `src/data/forts.json`
- **Reports** errors with clear messages

```bash
npm run build-data
```

### 3. Validation

**CI Pipeline** (`validate.yml`) ensures:

- ✅ YAML frontmatter is valid
- ✅ All required fields present
- ✅ Coordinates are valid (lat/lon ranges)
- ✅ No duplicate fort IDs
- ✅ Marathi text is Devanagari script
- ✅ Markdown syntax is valid
- ✅ Build script succeeds
- ✅ Tests pass

Runs on every PR → catches issues before merge.

### 4. Frontend (`src/routes/`)

**Home page** (`+page.svelte`):

- Loads `forts.json` server-side
- Renders interactive map (Leaflet + Svelte)
- Displays fort list/search

**Detail page** (`[fort]/+page.svelte`):

- Dynamic route parameter (fort ID)
- Renders fort details + content
- Bilingual UI (English + Marathi)

### 5. Components (`src/lib/components/`)

Reusable Svelte components:

- `FortMap.svelte` — Interactive map
- `FortCard.svelte` — Fort summary card
- `FortDetail.svelte` — Full fort page
- `SearchBar.svelte` — Find forts
- `LanguageToggle.svelte` — EN/MR switch

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build data (when you add/edit forts)
npm run build-data

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Adding a New Fort

1. Create `forts/NNN-fort-name.md`
2. Fill in frontmatter + content
3. Run `npm run build-data` to validate
4. Check `src/data/forts.json` was generated
5. Test locally: `npm run dev` → visit new fort
6. Commit and push → CI validates automatically

### CI/CD Pipeline

**Triggers**: Push to `main` or `rewrite` branch, or any PR

**Steps**:

1. Node.js setup (18.x, 20.x matrix)
2. Install dependencies
3. Lint code
4. Type check
5. Build data (validate forts)
6. Run tests
7. Build app
8. Upload coverage

**Failure** → PR blocked, error shown to contributor

## Philosophy

### Privacy First

- No analytics, telemetry, or user tracking
- No external API calls (except optional Wikipedia links)
- Self-hosted, works offline
- No cookies or sessions

### Minimal

- Minimal dependencies (gray-matter, SvelteKit)
- No heavy libraries (no Redux, no Apollo)
- Server-side rendering for performance
- Static export capability (future)

### Collaborative

- Markdown data = easy contributions
- CI validation = safe merges
- Clear documentation = low barrier to entry
- Version control = transparency

## Deployment

(Coming in Phase 2)

Options:

- Static hosting (Netlify, Vercel, GitHub Pages)
- Docker container (self-hosted)
- Node.js server (production)

## Testing Strategy

### Unit Tests (`tests/data-validation.test.ts`)

- Validate fort markdown files
- Check required fields
- Validate coordinates
- Ensure unique IDs
- Test build script

### Component Tests (TBD)

- Render components in isolation
- Test user interactions
- Verify accessibility

### E2E Tests (TBD)

- Full user journey
- Map interactions
- Search functionality

## Performance Considerations

- **Build-time generation**: JSON created once during build, not runtime
- **Server-side loading**: Forts data loaded server-side, sent as HTML
- **Client-side map**: Lazy-load map library only on map pages
- **Static assets**: Images cached, optimized
- **No runtime parsing**: Markdown parsed once during build

## Future Enhancements

- [ ] Full-text search
- [ ] Export to CSV/GeoJSON
- [ ] Contribution form UI
- [ ] Admin dashboard (minimal)
- [ ] Image gallery per fort
- [ ] Offline mode (PWA)
- [ ] Multi-language support (Hindi, etc.)

## Questions?

See `CONTRIBUTING.md` for contributor guide.
See `FORT_SCHEMA.md` for data format details.
