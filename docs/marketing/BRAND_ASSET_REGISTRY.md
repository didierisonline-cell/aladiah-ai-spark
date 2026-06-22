# BRAND ASSET REGISTRY
**The single source of truth for every official Aladiah Academy brand asset.**
**Updated:** 2026-06-22
**Owner:** Marketing QA Director

---

## THE LAW

> **No asset that bears the Aladiah brand may use any logo, mark, wordmark, or seal
> that is not listed here with status APPROVED.**

If it's not in this registry as APPROVED, it is not authorized.

**Status values:**
- `APPROVED` — official, ratified, cleared for all use
- `PENDING` — awaiting file delivery or final ratification
- `RETIRED` — was used, no longer authorized; must be replaced on sight

---

## OFFICIAL ASSETS

| # | Asset | File | Location | Approved By | Date | Status |
|---|---|---|---|---|---|---|
| 001 | Primary Mark (PNG) | `aladiah-primary-mark.png` | `/brand/official/` | Founder | 2026-06-21 | PENDING — Founder to commit official PNG |
| 002 | Full Lockup (PNG) | `aladiah-full-lockup.png` | `/brand/official/` | Founder | 2026-06-21 | PENDING — Founder to commit official PNG |
| 003 | Primary Mark (SVG) | `aladiah-primary-mark.svg` | `/brand/official/` | Founder | 2026-06-22 | APPROVED — SVG master committed |
| 004 | Full Lockup (SVG) | `aladiah-full-lockup.svg` | `/brand/official/` | Founder | 2026-06-22 | APPROVED — SVG master committed |
| 005 | Mono variant (SVG) | `aladiah-mark-mono.svg` | `/brand/official/` | Founder | 2026-06-22 | APPROVED — white/cream on transparent |
| 006 | Favicon source (SVG) | `aladiah-favicon-source.svg` | `/brand/official/` | Founder | 2026-06-22 | APPROVED — export at 16/32/48/180/512px |

> SVG masters (#003–006) are committed and canonical. PNGs (#001–002) are the Founder-delivered
> raster exports — commit them to `/brand/official/` and `/public/brand/official/` to close
> the final remaining step of BLK-001.
>
> **Production rule:** SVG is source of truth. PNG is the export. Canva, CapCut, website,
> certificates, and press kit all reference `/brand/official/` as the origin.

---

## RETIRED ASSETS (do not use)

| File | Location | Reason | Replaced By |
|---|---|---|---|
| `aladiah-seal.png` | `/public/` | Legacy shield seal — retired | #001 Primary Mark |
| `aladiah-full-seal.png` | `/public/` | Legacy full seal — retired | #002 Full Lockup |
| `aladiah-seal-circle.png` | `/public/` | Circular seal — retired | #001 Primary Mark |
| `aladiah-seal-cropped.png` | `/public/` | Circular seal crop — retired | #001 Primary Mark |
| `aladiah-seal-isolated.png` | `/public/` | Circular seal — retired | #001 Primary Mark |
| `aladiah-seal-only.png` | `/public/` | Circular seal — retired | #001 Primary Mark |
| `aladiah-seal-transparent.png` | `/public/` | Circular seal — retired | #001 Primary Mark |
| `aladiah-store-seal.png` | `/public/` | Store seal — retired | #001 Primary Mark |
| `aladiah-header-logo.png` | `/public/` | Legacy wordmark — retired | #002 Full Lockup |
| `aladiah-header-logo-new.png` | `/public/` | Legacy wordmark — retired | #002 Full Lockup |
| `aladiah-header-logo-clean.png` | `/public/` | Legacy wordmark — retired | #002 Full Lockup |
| `aladiah-header-logo-transparent.png` | `/public/` | Legacy wordmark — retired | #002 Full Lockup |
| `aladiah-header-logo-v2.png` | `/public/` | Legacy wordmark — retired | #002 Full Lockup |
| `aladiah-logo.png` | `/public/` | Legacy wordmark — retired | #002 Full Lockup |
| `aladiah-logo-nobg.png` | `/public/` | Legacy wordmark — retired | #001 Primary Mark |
| `aladiah-logo-noborder.png` | `/public/` | Legacy wordmark — retired | #001 Primary Mark |
| `aladiah-logo-trimmed.png` | `/public/` | Legacy wordmark — retired | #001 Primary Mark |
| `aladiah-academy-seal.svg` | `/public/` | Shield SVG — retired | #003 Primary Mark SVG |
| Logo.tsx inline SVG | `src/components/Logo.tsx` | Inline shield — retired | #001/#002 |

---

## SWAP EXECUTION STATUS

SVG masters (#003–006) are committed — swap execution may begin. PNG files (#001–002) still pending Founder commit.

| Location | Current | Target | Status |
|---|---|---|---|
| `src/components/Logo.tsx` | Inline shield SVG | `#003 primary-mark.svg` (or `#004 full-lockup.svg`) | READY — SVG committed |
| `src/components/Footer.tsx` | `aladiah-header-logo-new.png` | `#004 full-lockup.svg` | READY — SVG committed |
| `src/pages/Dashboard.tsx` | `aladiah-header-logo-new.png` | `#004 full-lockup.svg` | READY — SVG committed |
| `src/pages/Feedback.tsx` | `aladiah-header-logo-new.png` | `#004 full-lockup.svg` | READY — SVG committed |
| `index.html` favicon | `public/favicon.ico` | Regenerate from `#006` | READY — favicon source committed |
| `index.html` OG image | `aladiah-seal.png` (external) | `#003` hosted at `/public/brand/official/` | READY |

---

**Storage:** `/docs/marketing/BRAND_ASSET_REGISTRY.md`
**Owner:** Marketing QA Director · Founder ratifies new entries
