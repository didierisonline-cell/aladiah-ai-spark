# BRAND ASSET REGISTRY
**The single source of truth for every official Aladiah Academy brand asset.**
**Updated:** 2026-06-21
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
| 001 | Primary Mark (PNG) | `aladiah-primary-mark.png` | `/brand/official/` | Founder | 2026-06-21 | PENDING FILE DELIVERY |
| 002 | Full Lockup (PNG) | `aladiah-full-lockup.png` | `/brand/official/` | Founder | 2026-06-21 | PENDING FILE DELIVERY |
| 003 | Primary Mark (SVG) | `aladiah-primary-mark.svg` | `/brand/official/` | Founder | — | PENDING |
| 004 | Full Lockup (SVG) | `aladiah-full-lockup.svg` | `/brand/official/` | Founder | — | PENDING |
| 005 | Mono variant (SVG) | `aladiah-mark-mono.svg` | `/brand/official/` | Founder | — | PENDING |
| 006 | Favicon source | `aladiah-favicon.svg` | `/brand/official/` | Founder | — | PENDING |

> Assets 001 and 002 were ratified by Founder on 2026-06-21 as the official Aladiah Academy
> brand mark and full lockup. Files are pending commit to `/brand/official/` — deliver via
> Founder's local copy or direct upload to repo.

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

These changes are required once `#001` and `#002` files are committed:

| Location | Current | Target | Status |
|---|---|---|---|
| `src/components/Logo.tsx` | Inline shield SVG | Official mark (#001 or #002) | PENDING file delivery |
| `src/components/Footer.tsx` | `aladiah-header-logo-new.png` | `#002 full-lockup` | PENDING |
| `src/pages/Dashboard.tsx` | `aladiah-header-logo-new.png` | `#002 full-lockup` | PENDING |
| `src/pages/Feedback.tsx` | `aladiah-header-logo-new.png` | `#002 full-lockup` | PENDING |
| `index.html` favicon | `public/favicon.ico` | Regenerate from `#006` | PENDING |
| `index.html` OG image | `aladiah-seal.png` (external) | Official hosted asset | PENDING |

---

**Storage:** `/docs/marketing/BRAND_ASSET_REGISTRY.md`
**Owner:** Marketing QA Director · Founder ratifies new entries
