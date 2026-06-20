# Aladiah Academy — Brand Standard (single source of truth)

This folder (`public/brand/official/`) is the **only** approved home for brand
logo assets. Any logo outside it is **deprecated** — do not introduce new ones.

## Canonical assets

| File | What it is | Use for |
| --- | --- | --- |
| **`official-header-logo.svg`** | Horizontal lockup: mark + `ALADIAH ACADEMY` + tagline | **Header · Footer · Mobile nav · Login · Dashboard** (all chrome). Transparent, scalable, tiny. |
| **`official-logo.svg`** | Full vertical lockup (large) | Hero · About · brand pages · large brand placements. |
| **`official-mark.svg`** | Icon only — A-spire + hidden-9 + global arc | Favicon source · app icon · watermark · loading screens. |
| **`official-seal.svg`** | Circular academic seal | Certificates · diplomas · verification pages (wired at #48). |
| `Aladiah_Academy_Official_Logo.png` | The approved **poster** render (1024×1536, navy bg, 1.6 MB) | **Brand poster / supporting art / OG image only** — NOT a chrome logo (vertical + opaque navy bg + heavy). |

Code reference: `src/components/Logo.tsx` renders `official-header-logo.svg`
(`variant="full"`) and `official-mark.svg` (`variant="mark"`). Footer/Dashboard/
ScrumSimulation/Feedback reference `official-header-logo.svg` directly.

## How the SVGs relate to the PNG (honest note)
The SVGs are **clean vector reproductions of the approved design** (silver A-spire,
gold hidden-9, gold global arc with dotted world, `ALADIAH ACADEMY` wordmark — no
torch). They are **flat/gradient vectors**, not a pixel copy of the PNG's
photoreal 3D-metallic/glow render. For a pixel-exact vector, run the PNG through a
vectorizer (Illustrator image-trace) and replace these files. The PNG stays as the
premium poster.

## Deprecated (do not use; pending removal)
- `public/brand/aladiah-logo.svg` — old horizontal lockup (replaced by `official/official-header-logo.svg`).
- The previous **inline SVG** in `Logo.tsx` (the "torch" variation) — removed.
- `src/assets/store-seal-blue.png` — merch seal, not brand.
- Orphaned hero videos in `src/assets/` (`hero-video.mp4`, `story-scene1-5.mp4`).

> `aladiah-mark.svg` / `aladiah-watermark.svg` are retained intentionally as the
> current hero/background emblem until an official mark is derived from these
> assets (kept per founder instruction).

## Still needed (NOT generated in this PR — binaries require a generator)
- `favicon.ico` (multi-size) — generate from `official-mark.svg`.
- `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png` — from `official-mark.svg`.
- A landscape **OG image** (1200×630) — current OG points at the portrait poster as a stopgap.
- `index.html` favicon/manifest already reference these paths; drop the files in to light them up.
