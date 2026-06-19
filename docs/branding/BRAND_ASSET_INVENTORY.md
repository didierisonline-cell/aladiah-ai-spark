# Brand Asset Inventory — Aladiah Academy

Single approved logo family. Anything not listed under **Approved** has been removed.

## Approved assets (the only logos that may be used)

| File | Location | Role | Used by | Status |
|---|---|---|---|---|
| `aladiah-logo.svg` | `/public/brand/` | **Horizontal lockup** (mark + ALADIAH ACADEMY + tagline) | Footer, Dashboard, ScrumSimulation, Feedback | ✅ Approved |
| `aladiah-mark.svg` | `/public/brand/` | **Icon only** (spire-A + gold torch + hidden-9 + globe, no text) | Creed gate, CTA, Founder welcome, Auth card | ✅ Approved |
| `favicon.svg` | `/public/brand/` | **Icon** (simplified for ≤32px) | `index.html`, `site.webmanifest` (browser tab) | ✅ Approved |
| `Logo.tsx` (inline SVG) | `src/components/` | Renders the same artwork as `variant="full"` (horizontal) / `variant="mark"` (icon) | Header/navbar, MobileTopBar, Community, Auth | ✅ Approved |
| `site.webmanifest` | `/public/` | PWA manifest → `/brand/*` icons | install / PWA | ✅ Approved |

**Canonical master format = SVG.** Navbar (Header) and the public homepage share the
same `<Header>` → `<Logo variant="full">`, so they render the identical lockup.

## Drop-in raster slots (wired, awaiting binary files — optional)

| Path | Referenced by | Status |
|---|---|---|
| `/brand/favicon.ico` | `index.html` | ⏳ wired slot |
| `/brand/apple-touch-icon.png` | `index.html`, manifest | ⏳ wired slot |
| `/brand/icon-192.png`, `/brand/icon-512.png` | manifest | ⏳ wired slot |
| `/brand/og-image.png` | OG + Twitter meta | ⏳ wired slot |

Commit any of these files and they go live with no code change. (SVG favicon already
covers modern browsers.)

## Removed (legacy — eliminated)

| File | Why |
|---|---|
| `public/favicon.ico` | Lovable heart favicon |
| `public/aladiah-academy-seal.svg`, `public/brand/seal.svg` | old shield seals |
| `src/assets/aladiah-header-logo{,-new,-clean,-v2,-transparent}.png` (5) | superseded header rasters |
| `src/assets/aladiah-logo{,-nobg,-trimmed,-noborder}.png` (4) | duplicate logo rasters |
| `src/assets/aladiah{-seal,-seal-only,-seal-isolated,-seal-circle,-seal-transparent,-seal-cropped,-full-seal,-store-seal}.png` (8) | duplicate seal rasters |
| `src/assets/aladiah-academy-seal.svg` | duplicate of removed public seal |
| `lovable-tagger`, `componentTagger`, Lovable README | Lovable build/branding |

→ **18 orphaned `src/assets` rasters deleted** here, on top of the 3 public legacy files
removed in the P0 branding commit. None were imported anywhere.

## Kept intentionally (not a brand logo)

| File | Location | Why kept |
|---|---|---|
| `store-seal-blue.png` | `src/assets/` | Merch product graphic used by `Store.tsx` — a store asset, not the brand logo. Flagged for separate review. |

## Note on the 3-tier system request

- **Horizontal** (navbars) → `aladiah-logo.svg` / `<Logo variant="full">` ✅ exists
- **Icon-only** (favicon/app/mobile) → `aladiah-mark.svg` / `favicon.svg` / `<Logo variant="mark">` ✅ exists
- **Master (vertical, as uploaded)** for hero/about/press → not yet a distinct asset; the
  horizontal lockup is used everywhere today. Adding a dedicated vertical master and placing
  it large in the homepage hero is a design change — flagged for go-ahead, not done unilaterally.
