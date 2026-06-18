# Aladiah Academy — Brand Assets (single source of truth)

Every logo/icon/social reference across the platform points here. Update a file
in this folder and the whole site updates — no code changes required.

## Live now (scalable vector — already wired & rendering)

| File | Used by |
|---|---|
| `aladiah-logo.svg` | Full horizontal lockup (mark + ALADIAH ACADEMY + tagline). Footer, Dashboard, ScrumSimulation, Feedback. |
| `aladiah-mark.svg`  | Square mark only. Creed gate, CTA, Founder welcome. |
| `favicon.svg`       | Browser tab icon (modern browsers). Referenced in `index.html` + `site.webmanifest`. |

The header/nav logo (`Header`, `MobileTopBar`, `Community`) is rendered inline by
`src/components/Logo.tsx`, which uses the **same** vector identity as these files.

## Drop-in raster slots (referenced everywhere; add the files and they go live)

These paths are already wired in `index.html` / `site.webmanifest` / OG tags.
Export them from the master artwork at the exact names/sizes below and commit —
nothing else needs to change:

| File | Size | Purpose |
|---|---|---|
| `favicon.ico`          | 16/32/48 multi | Legacy-browser tab icon fallback |
| `apple-touch-icon.png` | 180×180 | iOS home-screen icon |
| `icon-192.png`         | 192×192 | PWA / Android icon |
| `icon-512.png`         | 512×512 | PWA splash / maskable icon |
| `og-image.png`         | 1200×630 | Open Graph + Twitter social preview |

Until the raster files are dropped, `favicon.svg` already covers all modern
browsers; only legacy `.ico` fallback and social-share preview images wait on them.

## Palette

- Navy `#0B1124` · Silver `#F4F8FF→#9FB2CE` · Gold `#F6D27A→#C8902E` · Globe `#3E7BD6`
