# BRAND CANON — Aladiah Academy
**Status:** RATIFIED v1.0
**Ratified:** 2026-06-21
**Authority:** Founder directive
**Enforced by:** Marketing QA Director

---

## THE BRAND MISSION

Aladiah Academy exists to transform careers through intelligence, purpose, and impact.
The brand mark is not decoration — it is a compressed statement of that mission.
Every visual element in the official mark carries meaning. Nothing is arbitrary.

---

## THE OFFICIAL MARK

### Required Elements (all five must be present)

| Element | Meaning | Visual |
|---|---|---|
| **Torch** | The light of education that guides transformation; rising upward = forward momentum | Central vertical form, geometric/architectural |
| **Hidden 9** | The nine pillars of mastery; the hidden truth that only the initiated see; excellence concealed in plain sight | The "9" shape in gold at the crown of the torch |
| **Global Arc** | We operate without borders; careers transform across continents; the world is the classroom | Golden arc / Earth horizon at the base of the torch |
| **Gold accent** | Excellence; what is earned, not given | Gold outlines, hidden 9, global arc |
| **Deep blue field** | Authority; trust; the infinite horizon of potential | Background / primary field color |

### Prohibited Elements

| Element | Why |
|---|---|
| **Cross** | Not in the official mark — any cross shape is a legacy error |
| **Shield / circular seal** | Retired design — not the ratified mark |
| **Wordmark-only** | The mark must accompany any wordmark use in official contexts |
| **Any color not in the palette** | The mark is Gold + Blue only |

---

## BRAND PALETTE (RATIFIED)

| Token | Hex | Use |
|---|---|---|
| Deep Blue | `#0E1F44` | Primary field / background |
| Gold | `#C9A24B` | Accent / hidden 9 / global arc / excellence |
| Cream | `#F2E6C9` | Light text on dark backgrounds |
| Silver/Chrome | (match official mark) | Torch body — match the delivered asset exactly |

> Crimson (`#A41E34`) is **retired**. It was used in the legacy shield seal only.
> Do not introduce Crimson into any new asset.

---

## TAGLINE

**Official:** "Solo Excelencia"
**Secondary (English):** "Intelligence. Purpose. Impact."

- "Solo Excelencia" is the canonical brand promise and must appear on the full lockup.
- "Intelligence. Purpose. Impact." may be used as a sub-tagline in English-market contexts.
- Do not use "Only Excellence" (translation), motivational variants, or shortened versions.
- Do not invent tagline variants without Founder approval.

---

## ASSET FILES

All official files live in `/brand/official/`.

| File | Type | Use |
|---|---|---|
| `aladiah-primary-mark.png` | PNG | Mark only — app headers, social profiles, favicons |
| `aladiah-full-lockup.png` | PNG | Full brand — print, cover slides, email headers, press |
| `aladiah-primary-mark.svg` | SVG | Source of truth for mark — use when SVG required |
| `aladiah-full-lockup.svg` | SVG | Source of truth for lockup — use when SVG required |

SVG is source of truth. PNG is the approved export. When both exist, use SVG for production tools and PNG for platforms that don't support SVG.

---

## USAGE RULES

### Always use the mark when

- Signing off on any official communication
- Header and footer of the website and app
- Social profile photos and channel art
- Video intro/outro cards
- Student certificates and credentials
- Press kit and partner materials

### Full lockup (mark + wordmark + tagline) when

- First impression contexts: homepage hero, email header, pitch decks, print
- Any context where the viewer may not already know the brand

### Mark only when

- Favicon, app icon, watermark
- Space-constrained contexts (profile photos, small thumbnails)
- Repeated use within a document where full lockup already appeared

### Never

- Stretch, rotate, or distort the mark
- Use on a background that reduces contrast below WCAG AA
- Recreate the mark in any tool — use the delivered files only
- Combine with any other logo or mark without Founder approval
- Use any asset from `/public/aladiah-seal*.png` or legacy `/src/assets/` files

---

## QA ENFORCEMENT

Any asset entering QA that uses a non-ratified logo **automatically fails** the Brand Gate.
"Non-ratified" means: any file not from `/brand/official/`, any shield, any circular seal, any
mark with a cross, any unrecognized wordmark variant.

A failed Brand Gate requires:
1. Replace the asset with the official mark from `/brand/official/`
2. Re-submit for Brand Gate review
3. The asset may not advance to CMO Review or Founder Queue until Brand Gate = PASS

---

## REVISION HISTORY

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-06-21 | Initial ratification — Torch + Hidden 9 + Global arc + Gold/Blue | Founder |

---

**Storage:** `/docs/standards/BRAND_CANON.md`
**Owner:** Marketing QA Director (enforces) · Founder (sole authority to amend)
