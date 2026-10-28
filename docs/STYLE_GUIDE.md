# Gadvat UI Style Guide

The look of Gadvat, taken from the original site (**Doublepoetry/Gadvat**, `index.html` at ba30454). The rewrite ports this design. New UI should match it.

**In code:** every value below is a CSS variable in `src/routes/layout.css`. Components use the variables and never hardcode a colour. Variable names follow this guide, with these exceptions: `--landOn` is `--land-on`, and the panel palette is `--paper`, `--paper-ink`, `--paper-ink2`, `--paper-rule`, `--paper-guide`, `--paper-hover`, `--signal` and `--signal-hover`. Fonts are self-hosted via Fontsource. Inter is the variable build with optical sizing, so large text automatically gets the Display cut. There is no Tailwind: styles are scoped `<style>` blocks.

## 1. Character

The site is **map-first and full-bleed**. The map fills the viewport, and every piece of UI floats over it. The night theme is the default: deep teal-black land under a "starfield" of twinkling fort dots, with warm parchment accents. A selected fort opens a **cream "field-card" panel**. The panel is laid out like a printed museum label or trail marker: hairline grid rules, an oversized display name, a yellow "get there" block and a small dark elevation sticker.

The moods are quiet, editorial and warm. Latin and Devanagari text sit side by side as equals. Nothing is loud except the fort name.

## 2. Colour

### Theme tokens (CSS variables on `:root`; light overrides on `:root[data-theme=light]`)

| Token                  | Dark (default)                          | Light                                       | Role                                                        |
| ---------------------- | --------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| `--bg`                 | `#0E1B20`                               | `#F4F0E6`                                   | page and sea                                                |
| `--bg2`                | `#101F25`                               | `#EDE6D6`                                   | list sheet                                                  |
| `--card`               | `#132830`                               | `#FFFDF8`                                   | search-results dropdown                                     |
| `--glass`              | `rgba(20,40,48,.94)`                    | `rgba(255,253,248,.96)`                     | search pill (+ `blur(16px)`)                                |
| `--ink`                | `#F3EAD8`                               | `#1B2A2E`                                   | primary text                                                |
| `--ink2`               | `#E6E0D2`                               | `#2A3A3E`                                   | header controls, chips                                      |
| `--mut`                | `#9FB0B3`                               | `#56676B`                                   | secondary text, icons                                       |
| `--mut2`               | `#7F9398`                               | `#66767A`                                   | tertiary text, counts                                       |
| `--ph`                 | `#6F8287`                               | `#8A8F8C`                                   | placeholder                                                 |
| `--acc`                | `#F1D2A1` parchment                     | `#A4511C` burnt sienna                      | accent: links, active chip, toggle on, Marathi wordmark     |
| `--acc2`               | `#C9B48F`                               | `#8A6232`                                   | Marathi secondary names, letter headings                    |
| `--land` / `--landOn`  | `#14303A` / `#1C3F4B`                   | `#FFFCF5` / `#F6E7CC`                       | district fill / the selected fort's district                |
| `--edge`               | `#2F4C55`                               | `#CFC3AC`                                   | coastline, sea label                                        |
| `--lab` / `--lab2`     | `#5C747A` / `#6A8288`                   | `#9A8E78` / `#8A7E68`                       | district labels EN / MR                                     |
| `--lr`                 | `241,210,161`                           | `27,42,46`                                  | RGB triplet for **every** tint: `rgba(var(--lr), α)`        |
| `--shadow` / `--scrim` | `rgba(0,0,0,.85)` / `rgba(8,16,19,.72)` | `rgba(60,45,20,.18)` / `rgba(60,50,35,.28)` | drop shadows / modal scrim                                  |
| `--spark`              | `#FFF6E0`                               | _(empty)_                                   | fort-dot core in dark mode; light mode uses the type colour |

**Tints are always `rgba(var(--lr), α)`.** That keeps them correct in both themes. The alpha steps in use:

| Alpha   | Use                                        |
| ------- | ------------------------------------------ |
| .07–.09 | hover fill, active row                     |
| .10–.14 | dividers, dropdown border, scrollbar thumb |
| .16–.18 | input and chip borders                     |
| .32     | district edges                             |
| .45     | focused search border                      |

### Fort-panel palette (fixed, the same in both themes)

| Value                               | Role                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| `#ECE5D4`                           | panel paper                                             |
| `#12392F`                           | panel ink (deep forest green), sticker fill             |
| `#3F5F55`                           | panel secondary ink, labels, Marathi                    |
| `rgba(18,57,47,.2)` / `.12` / `.14` | grid rules: section / inner guides / list rows          |
| `rgba(18,57,47,.06–.07)`            | hover                                                   |
| `#F2C230` → hover `#E9B71F`         | "Directions" block and sticker numerals (signal yellow) |

### Fort-type colours

One colour and one glyph per type, used on map dots, pins and list rows:

| Type    | Colour       | Glyph                          |
| ------- | ------------ | ------------------------------ |
| Hill    | `var(--acc)` | ▲ triangle 12×10               |
| Sea     | `#7CC6D6`    | ● circle 10                    |
| Coastal | `#B2BD47`    | ◆ diamond 8 (a rotated square) |
| Land    | `#E2704F`    | ■ rounded square 9, r 2        |

**Colour never carries meaning alone.** The glyph shape always goes with it.

## 3. Typography

| Family                                                                               | Role                                                                                                             |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Inter** (variable, optical sizing = Inter Display at large sizes), `ss01` + `cv11` | all Latin UI. **The body weight is 300**, and display text uses 400. Nothing is bold except map pin labels (600) |
| **Mukta** 400–700                                                                    | Devanagari inside the fort panel: the big Marathi name (700, 38px), Marathi facts and place lines                |
| **Tiro Devanagari Marathi**                                                          | Devanagari in the chrome: wordmark गडवाट, the मराठी toggle, Marathi names in search, list and map labels         |
| **Instrument Sans** 500                                                              | map labels only (district names, ARABIAN SEA, the pin name at 600)                                               |

### Scale (px)

| Size             | Where                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| fluid **40–116** | fort name in the panel, computed to fit the panel width (×0.85), line-height **.84**, tracking −.025em |
| 38               | Marathi fort name (Mukta 700)                                                                          |
| 23               | location base village                                                                                  |
| 19               | notes paragraph (line-height 1.22)                                                                     |
| 18               | wordmark "Gadvat"; sticker numerals                                                                    |
| 16–17.5          | panel section titles, the "Directions" label, the TYPE cell (uppercase)                                |
| 16               | search input (16 on purpose, so iOS doesn't zoom in)                                                   |
| 14–15            | list rows, results, chips, body                                                                        |
| 12–13            | sub-lines, counts, district column                                                                     |
| **10**           | **eyebrow labels**: uppercase, tracking **.14em**, weight 400, secondary ink                           |

### Tracking and line-height

- **Display text is tight:** −.025 to −.03em.
- **Body:** −.01em.
- **Eyebrows:** +.14em uppercase. "Kicker" lines like "get there ↘" use +.06em lowercase.
- **Numerals** use `font-variant-numeric: tabular-nums`.
- Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`.

## 4. Shape, depth, motion

### Radius

| Radius    | Where                                             |
| --------- | ------------------------------------------------- |
| **999px** | pills: search, header buttons, chips, toggle      |
| 50%       | icon buttons                                      |
| 18–20px   | floating sheets (results dropdown, list modal)    |
| 10–12px   | rows inside them                                  |
| **6px**   | the fort panel. Deliberately squarer, like paper  |
| 0         | the sticker, the Directions block, the grid cells |

### Depth

Soft, long, low shadows that are heavily offset downward:

| Element  | Shadow                             |
| -------- | ---------------------------------- |
| search   | `0 18px 40px -22px var(--shadow)`  |
| dropdown | `0 24px 50px -24px`                |
| panel    | `0 24px 60px -24px rgba(0,0,0,.8)` |
| list     | `0 40px 80px -30px`                |

Glass effects: `blur(16px)` on the search pill, and `blur(6px)` plus the scrim on the modal backdrop.

### Motion

- **One easing everywhere:** `cubic-bezier(.2,.8,.2,1)`.
- **Panel:** slides in over .5s with a .15s delay (desktop: from the right; mobile: a bottom sheet over .45s).
- **Search pill:** in the original it glides from the middle of the screen to the top bar over .7s when a fort is selected, and narrows to 240–420px. The port keeps it in the top bar throughout (see Idle state) and only narrows it, 580px → 420px.
- **Map:** flies to the fort over 1100ms.
- **Pin:** drops in (`gvDrop` .6s, overshoot), then sends a sonar ring (radius 6→34, 2.4s, looping). The label fades in .4s.
- **Fort dots:** twinkle (opacity .7↔1, 2.2–4.2s, staggered per fort; the original's .35 floor lost dots against the land).
- **Small state changes:** .2s.

## 5. Layout

- **Shell:** `100dvh`, `overflow: hidden`. The map is `inset: 0`. The **header** is 64px with 20px padding, transparent, and `pointer-events: none` except on its controls. The wordmark (+ गडवाट) sits on the left. On the right: the theme icon button, the मराठी switch, and the **Forts** pill (filled `--acc` while the list is open).
- **Idle state:** the search pill is centred, up to 580px wide and 56px tall, sitting at 26% of the viewport height (20% on mobile), with the map fitted below it. **In the port it stays docked in the header row** (top 4px; 60px on mobile), so the map keeps its full size and its district names stay readable. Placeholder: "Search 267 forts · किल्ला शोधा". It's a **single bilingual** placeholder.
- **Selected state:** the panel docks right at `top: 76px; right/bottom: 20px`, with width `clamp(380px, 40vw, 540px)`. The map re-centres the fort in the space left over. The selected district lightens to `--landOn`.
- **Mobile (< 760px):** the panel becomes a bottom sheet at 58% height with radius `6 6 0 0`. The search pill runs full width, 12px from each edge.
- **List modal:** max 820px, scrim behind it. The header has a title + Marathi + count, a filter input, and type chips with counts. Rows are grouped under sticky letters (11px, .14em, `--acc2`) in three columns: name+MR / district / type. The type column is hidden on mobile.

## 6. The fort panel (signature component)

Built on a **hairline grid**: 1px `rgba(18,57,47,.2)` rules between bands. From top to bottom:

1. **Top strip:** three cells. The TYPE ("HILL FORT", 17.5px uppercase, line-height .95), then "District district, Region." with its Marathi below, then a 56px × close button.
2. **Name block:** the oversized name on two lines (last word on line 2, indented 20%). Faint guides sit at 33% vertical and 50% horizontal (`.12`). The Marathi name (Mukta 700) is bottom-left. The **elevation sticker** is bottom-right: `#12392F` with yellow numerals and "METRES" as a 10px eyebrow. A fort with no elevation shows its type word instead ("Hill", or गिरिदुर्ग in MR mode) and "FORT".
3. **Location + Directions:** the left cell holds an eyebrow ("LOCATION" or "LOCATION · APPROX."), the base village at 23px, and the address line. The right cell, min 112px, is the **yellow block** with "get there ↘", a pin + "Directions" and "on Google Maps".
4. **Facts:** an auto-fit grid of `minmax(150px,1fr)` cells, each an eyebrow plus a 14px value (· Marathi).
5. **Notes:** a 19px paragraph with a 9px square **marker node** sitting on the 33% guide line.
6. **Link row:** "read the story ↘" kicker + "History of the Fort".
7. **Accuracy note:** a dashed 9px square + 12px text. Only shown when the location is approximate.
8. **Nearby forts:** a numbered list (01–05, tabular) with name + Marathi + distance in km.
9. **Footer:** the Gadvat wordmark + गडवाट on the left, COORDINATES and `lat° N · lon° E` (4 decimals, tabular) on the right.

**Patterns to reuse:** eyebrow + value pairs; kicker + title links with "↘"; corner-anchored small marks (marker node, dashed square). **Never add an icon where a word does.** The only icons are search, sun/moon and the map pin.

## 7. Map

- **A custom SVG of district shapes, not tiles** (`src/data/districts.json`, pan and zoom by d3-zoom). It's flat with no relief. District stroke is `.22` alpha (`.32` when selected; the original used `.1`, raised so borders read at a glance), and the coastline is 2.4px at `.32`.
- **District names show from the first view on a large screen:** uppercase Instrument Sans 10px, tracking 1.6. Labels fade in by on-screen scale (English from 0.5–0.65 px per map unit, so a phone shows them once zoomed in), and the Marathi line below in Tiro 13px from 1.0–1.4. "ARABIAN SEA" / अरबी समुद्र appears in `--edge`. (The original faded all labels in with zoom.)
- **Fort dots:** a 6px halo at .18–.22 alpha plus a 3px core with a 0.8px outline (`--spark` with a `--bg` stroke in dark mode, the type colour with a cream stroke in light mode). They keep that size on screen at the fitted view and grow with the square root of the zoom, up to 2×. (The original's 1.8px core was hard to see.)
- **Hover preview** (new): once zoomed past 2× the fitted view, hovering or focusing a dot shows a small paper tag above it with the type kicker, name, Marathi name, district and elevation. Below that zoom, the browser tooltip shows the name. A click still opens the details card.
- **Selected pin:** a teardrop in the type colour with a `--bg` stroke and centre, a ground ellipse shadow and the sonar ring.
- **Selecting a fort:** a click, a search result or a nearby fort flies the map to it, centred in the space the panel leaves, and opens the §6 panel. On desktop it's docked on the right (`clamp(380px, 40vw, 540px)` wide, 76px from the top, 20px from the other edges) and slides in from the right; under 760px it's a bottom sheet 58% tall that slides up. The pin carries the name beside it (Instrument Sans 600, 15px, with the Marathi in Tiro below in MR mode), haloed in `--bg`. The filter row wraps to stay left of the panel. A fort page (`/[fort]`) is the same map with that fort's panel open.
- **Filter row** (new, not in the original): glass chips under the search pill, one per fort type with its glyph, Marathi name and count, multi-select; non-matching dots dim to .2. Beside them, a **Colour** segmented control: Plain (the starfield), Type (dot cores take the type colour), Height (teal → parchment → orange from lowest to highest elevation, with a legend; forts without an elevation dim). On mobile the row scrolls sideways under the pill.
- **Controls:** drag to pan, wheel or pinch to zoom, click a dot to select, `Esc` to go back out. Panning stays within Maharashtra. (The original only allowed pan and zoom while a fort was selected, and its dots weren't clickable.)

## 8. Language

- The **मराठी switch adds Marathi alongside English**. It doesn't replace it: Marathi names, place lines and labels appear next to the English, in `--acc2` or panel secondary ink. It defaults to on, and the setting persists in `localStorage` (`gadvat:showMr`; theme in `gadvat:theme`, default `dark`).
- Marathi numerals are used in MR mode (`०१२…`), along with Marathi type names (गिरिदुर्ग, जलदुर्ग, सागरी किनारा, भुईकोट).

## 9. Interaction and accessibility

- **Keyboard:** `/` focuses search. `Esc` closes, in order: the list, then the search dropdown, then the panel. ↑/↓ + Enter work in the results. **Map dots:** one dot is in the tab order; the arrow keys move focus to the nearest dot in that direction (a 2px `--acc` ring), and Enter or Space selects it.
- **Hit targets** are at least 36–40px. Icon buttons carry an `aria-label`.
- **Focus:** every focusable element gets a `:focus-visible` ring, 2px `--acc` with a 2px offset. The original had none.
- **Still to do in the port:** announce the fort panel when it opens (`aria-live`, and move focus to it).

## 10. Open questions

1. **Fort page:** the original has no separate fort page. Everything lives in the panel. Should `/[fort]` reuse the panel design?
