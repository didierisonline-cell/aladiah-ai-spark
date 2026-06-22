# BRANDING FREEZE — Official Aladiah Academy Logo Package
**Status:** ACTIVE FREEZE
**Effective:** 2026-06-21
**Authority:** Founder directive

---

## THE FREEZE

All marketing branding is frozen to the **official, ratified Aladiah Academy
logo package**. This is a single source of truth.

**Prohibited — effective immediately:**
- ❌ Experimental marks
- ❌ Alternate logos
- ❌ Shield versions (including the `Logo.tsx` SVG shield currently in the app)
- ❌ Temporary icons
- ❌ Any wordmark variant not in the official package

**Permitted:**
- ✅ The official ratified logo package only

---

## OFFICIAL MARK — DEFINING CHARACTERISTICS

The founder has specified the official mark contains:

| Element | Spec |
|---|---|
| Torch | Present |
| Hidden 9 | Present (the "9" concealed in the mark) |
| Global arc | Present |
| Cross | **Absent** — the official mark has NO cross |
| Colors | Gold + Blue |

Any candidate asset that does **not** match all five characteristics is **not**
the official mark and must not be used.

---

## ⛔ BLOCKER BLK-001 — UNRESOLVED

**The official logo package matching the spec above is NOT yet present in the
repository.** The existing assets in `src/assets/` are wordmarks and a circular
shield seal — none match the "Torch + Hidden 9 + Global arc + No cross +
Gold/Blue" specification.

**Required to clear BLK-001:**
1. Founder delivers the official logo package files (full lockup, mark-only,
   mono, favicon source) — preferably as SVG + high-res PNG.
2. Files are committed to `src/assets/brand/official/` and `public/brand/`.
3. This document is updated with the exact file paths.
4. All legacy logo references are swapped (see swap list below).

**Until BLK-001 clears, NO design asset is produced or published.** Copy and
scripts may continue through QA, but nothing visual ships.

---

## LEGACY ASSET SWAP LIST (execute once official package lands)

These currently render the **shield** or **wordmark** and must point to the
official package:

| Location | Current | Action |
|---|---|---|
| `src/components/Logo.tsx` | Inline shield SVG | Replace with official mark |
| `src/components/Header.tsx` | `<Logo variant="full">` | Inherits from Logo.tsx ✓ once swapped |
| `src/components/mobile/MobileTopBar.tsx` | `<Logo variant="full">` | Inherits ✓ |
| `src/pages/StudentPortal.tsx` | `<Logo variant="full">` | Inherits ✓ |
| `src/pages/Community.tsx` | `<Logo variant="full">` | Inherits ✓ |
| `src/components/Footer.tsx` | `aladiah-header-logo-new.png` | Repoint to official |
| `src/pages/Dashboard.tsx` | `aladiah-header-logo-new.png` | Repoint to official |
| `src/pages/Feedback.tsx` | `aladiah-header-logo-new.png` | Repoint to official |
| `index.html` favicon | `public/favicon.ico` | Regenerate from official mark |
| `index.html` OG / Twitter image | `aladiah-seal.png` (external) | Repoint to official hosted asset |

> The earlier shield→logo production swap is intentionally **paused** at this
> step. It resumes the moment the official package is delivered and committed.

---

## BRAND PALETTE (until official package confirms otherwise)

| Token | Hex | Use |
|---|---|---|
| Navy / Blue | `#0E1F44` | Primary |
| Gold | `#C9A24B` | Accent / the "9" |
| Crimson | `#A41E34` | Legacy shield only — **retire on swap** |
| Cream | `#F2E6C9` | Light text on dark |

> Official package may override these. When it lands, this table is updated to
> match the ratified Gold + Blue system and Crimson is retired.

---

**Storage:** `/docs/marketing/BRANDING_FREEZE.md`
**Owner:** Marketing QA Director (enforces) · Founder (ratifies the package)
