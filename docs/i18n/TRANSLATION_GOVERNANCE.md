# Aladiah — Translation Governance Report & Multilingual Roadmap

**Launch languages (8):** EN · ES · FR · PT · DE · AR · ZH · HI
**Measured from source** on `main`+`i18n-cleanup-2`. DB-row coverage marked *audit-required* (only a live Supabase query can confirm; see `translation_coverage_audit.sql`).

## 0. The 4-bucket architecture (where every student string lives)

| Bucket | Store | What | Coverage status |
|---|---|---|---|
| **A. Database** | `courses.translations`, `chapters.translations`, `videos.translations` (JSONB) | program/chapter/video title + description | **Audit-required** (run audit SQL); code now reads `translations[lang]` |
| **B. Dictionary** | `LanguageContext.tsx` + `overviewStrings.ts` (`t('key')`) | nav, sidebar, dashboard, portal chrome, settings, homepage, buttons, labels, empty states | **1,599 keys × 8 langs = 100% parity** |
| **C. Structured code** | `src/data/simulations.ts`, curriculum `aiScrumMasterFull.ts`, `resourcesData.ts` | simulation scenarios, curriculum titles/objectives, resource lists | **Not localized** (English-only data) |
| **D. Protected** | inline constants | Aladiah Academy, Talent Score™, All-Access Pass™, Prof. Didier, Scrum, AI, AWS, GitHub, Microsoft, PMI, Stripe, ElevenLabs, LinkedIn | intentionally untranslated |

## 1. Coverage report by route

Legend: ✅ fully localized (chrome) · ◑ partial · ❌ hardcoded · ⟂ DB data dependency

| Route | Chrome (dict) | Hardcoded EN found | DB translation dep | Notes |
|---|---|---|---|---|
| Homepage | ✅ | none (blog article body = content) | — | Hero/About/Programs/CTA/Footer via t() |
| Dashboard | ✅ | none | — | overview/sidebar/stat modals localized |
| Courses (My Academy) | ✅ | none | ⟂ `courses.translations` | card title+desc now read DB JSONB |
| Program Details | ✅ | none | ⟂ `courses/chapters.translations` | localized render; chapter titles DB-dep |
| Flagship | ✅ chrome | curriculum titles (rule-7 course content / Scrum) | — | stats/cards/labels localized |
| Simulations | ✅ chrome | **scenario content (C)** | — | catalog labels + runner chrome localized; scenarios English |
| Talent Score | ✅ | none | — | dimension labels via labelKey |
| Career Path | ◑ | review needed (MyCareerPath data arrays) | — | partially keyed |
| Interview | ✅ | none | — | catalog titles/descriptions localized |
| Portfolio | ✅ | none | — | keyed |
| AI Mentor | ✅ | none | — | MentorHub/VoiceTutor localized |
| Certifications | ✅ | none | — | code dictionary |
| Community | ✅ | none | — | keyed |

## 2. Translation debt report (measured)

| Debt category | Count | Bucket |
|---|---|---|
| Hardcoded student-facing strings (chrome) | ~0 on audited live routes (was ~300+) | B |
| Missing dictionary keys (8-lang parity) | **0** (1,599/1,599) | B |
| Simulation content not localized | **~375 strings × 8 = ~3,000 entries** | C |
| Interview content not localized | 0 (localized) | C |
| Curriculum titles/objectives (Flagship) | ~507 lines (rule-7 course content) | C/D |
| `resourcesData.ts` | ~525 lines (review) | C |
| Missing JSONB translations (courses/chapters/videos) | **UNKNOWN — audit-required** | A |
| Legacy local maps missing PT/HI | 7 files (blog/insights/course/enroll/community utils) | B-legacy |

## 3. Translation Registry

Machine-generated → `docs/i18n/translation_registry.csv` (970 rows). Schema:
`translation_key, source_type (dictionary|database|simulation|structured-code), route, owner, status`.
964 dictionary keys mapped across 19 route groups + 3 DB columns + 3 structured-code sources.

## 4. Launch readiness score

| Language | Dictionary (B) | DB (A) | Structured (C) | **Effective student-facing** |
|---|---|---|---|---|
| English | 100% | 100% (base) | 100% | **100%** |
| Spanish | 100% | audit-required | 0% (sims) | **chrome 100% / content pending** |
| French | 100% | audit-required | 0% | chrome 100% / content pending |
| Portuguese | 100%* | audit-required | 0% | chrome 100%* / content pending |
| German | 100% | audit-required | 0% | chrome 100% / content pending |
| Arabic | 100% (+RTL) | audit-required | 0% | chrome 100% / content pending |
| Chinese | 100% | audit-required | 0% | chrome 100% / content pending |
| Hindi | 100%* | audit-required | 0% | chrome 100%* / content pending |

\* PT/HI: 7 legacy local maps (blog/insights/course/enroll/community) still miss PT/HI → fix by folding into the central dictionary or adding PT/HI blocks.

**Interpretation:** the **dictionary tier is launch-ready in all 8**. The gap to "100% student experience" is two data/content workstreams: **(A)** populate `courses/chapters/videos.translations`, and **(C)** translate simulation scenarios (+ resolve PT/HI legacy maps).

## 5. Fastest path to 100% per language (before African expansion)

**Phase 1 — Data tier (unblocks ES/FR/PT/DE/AR/ZH/HI courses simultaneously)**
1. Run `translation_coverage_audit.sql` → quantify JSONB gaps.
2. Invoke the existing `supabase/functions/translate-content` edge function to batch-fill `courses/chapters/videos.translations` for the 8 langs (idempotent). Review output, apply by hand per canon.
*Effort: 1 batch job. Impact: localizes all program/chapter/video title+description in every language at once.*

**Phase 2 — Legacy map cleanup (closes PT/HI chrome gaps)**
Fold the 7 `*ja*`-bearing local maps into the central dictionary (or add PT/HI blocks). *Effort: ~1 day.*

**Phase 3 — Simulation content (largest)**
Localize `simulations.ts` (~375 strings) via the translate pipeline into a `simulations.<lang>.ts` or a `sim_translations` keyset. *Effort: pipeline + review; the one genuinely large content batch.*

**Phase 4 — Governance (keep it from regressing)**
- CI check: fail build if a new `t('key')` lacks all 8 languages, or if a new student-facing JSX literal is hardcoded (extend the scanner used here).
- Registry (`translation_registry.csv`) regenerated in CI; PRs update `status`.

**Sequencing to "100% Spanish/French/Portuguese/Arabic/Chinese":** Phase 1 → Phase 2 → Phase 3. Only after these five are green should Basaa/Bamiléké/Hausa/Igbo expansion begin (they inherit the same registry + pipeline; the central dictionary already has fallback infrastructure).

## Honest limitations
- DB-row coverage (bucket A) is **not measurable from this repo** — requires running the audit SQL against live Supabase.
- "100% student-facing" is gated on the **content tiers (A + C)**, which are data/translation-pipeline work, not code. The code render-paths and dictionary are ready.
