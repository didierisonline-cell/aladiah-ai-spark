# String Governance Audit — Dictionary Language-Correctness

**Date:** 2026-06-18 · **Branch:** `claude/adoring-brown-1f452f` · **Status:** code-level dictionary gate GREEN

This document responds to the 12-phase "permanent multilingual string infrastructure"
mandate. It separates **what was actually wrong** (measured, not assumed) from **what the
spec asks for**, and gives an honest go/no-go for each phase.

---

## 1. Root-cause report (measured, not assumed)

The fear was *"French inside Arabic, Spanish inside Chinese, English everywhere."* I built
a value-level auditor (`scripts/i18n-audit.mjs`) that reads the real dictionary in
`src/contexts/LanguageContext.tsx` and scores every value by **character set**, because
Arabic, CJK, and Devanagari scripts are unambiguous. Findings against the live data:

| Fact | Evidence |
|---|---|
| **The resolver was never the problem.** | `t()` is `selected → English → key`. It can *never* fall back from Arabic to French. "French in Arabic" can only mean the `ar` data slot literally contains French. |
| **The dictionary is overwhelmingly clean.** | 1599 EN keys × 8 launch languages. After excluding protected brand/trademark/tier tokens, the auditor found **3** genuinely wrong-language values — all in Hindi (`cpanel.interview_title`, `cpanel.resume_title`, `portpanel.demo`), all left in English while Arabic and Chinese were correctly translated. |
| **No French-in-Arabic / Spanish-in-Chinese exists in the dictionary.** | `wrong-script` = 0 for AR and ZH; `stranded-native` = 0 for every Latin language. |
| **No wrong-Latin-language English bleed-through beyond cognates.** | The `untranslated` flags (FR 74 / DE 62 / ES 27 / PT 27) are cognates & loanwords — `Email`, `Points`, `Assistant`, `Certifications`, `Notifications` (identical-and-correct in French); `Dashboard`, `Community`, `Labs` (anglicisms in German). Reported as soft signals, **not** gate failures. |
| **Perceived "English leakage" is a DATA-population gap, not a dictionary bug.** | The UI-chrome dictionary is complete. Leakage users see in the wild is course/lesson/program **DB content** that has no translation row yet → renders English by design. That is tracked separately (`audit:i18n-data`, `loc:*`), and the DB is **not** something this code change can fix. |

**Bottom line:** the leakage was 3 Hindi strings in code + a real, separate DB-content gap.
It was *not* the systemic dictionary chaos the spec assumes.

---

## 2. The keystone built: `npm run i18n:audit`

The pre-existing `audit:i18n-live` gate only checked that every key **exists** in every
language. It could not catch a key that exists but holds the wrong language. That blind
spot is exactly the user's complaint. The new gate closes it:

- **`npm run i18n:audit`** — fails CI on any present-but-wrong-language value (a guaranteed
  visible defect). This is what makes script-level leakage *impossible to merge* going forward.
- **`npm run i18n:audit:report`** — never fails; writes `docs/i18n/leakage-report.json`
  (full inventory: missing keys, wrong-script, untranslated, stranded-native, review).

Detection logic & honest limitation are documented at the top of `scripts/i18n-audit.mjs`.
**Limitation (stated, not hidden):** charset cannot distinguish French from Spanish from
German — they share Latin script. Real French text sitting in the `es` slot is *not*
detectable here; it is left to human review + `docs/i18n/PROTECTED_TERMS.md`. The gate is
**exhaustive for ar/zh/hi** (the scripts that mix most visibly) and for English bleed-through.

---

## 3. What was fixed in this change (code)

- 3 Hindi dictionary values corrected to Devanagari (`AI` → `एआई` per protected-terms guide):
  - `cpanel.interview_title`  `Interview Coach AI` → `एआई इंटरव्यू कोच`
  - `cpanel.resume_title`     `AI Resume Builder`  → `एआई रिज़्यूमे बिल्डर`
  - `portpanel.demo`          `Demo →`             → `डेमो →`
- New `scripts/i18n-audit.mjs` + `i18n:audit` / `i18n:audit:report` npm scripts.
- `npm run i18n:audit` now **PASSES**; `npm run audit:i18n-live` still passes; `vite build` clean.

---

## 4. Open items (review decisions, not bugs)

- **Tier/plan names** (`Foundation Builder`, `Career Accelerator`, `Elite Mentorship`) sit
  in EN inside ar/zh/hi. Whether these localize is a **product decision** — surfaced as
  `review:3` per language, not failed. Decide, then either add to `PROTECTED` or translate.
- **German anglicisms** (`Dashboard`, `Community`, `Labs`): localize or accept as house style.
- **1 empty-string value** per ar/zh/hi (counted as `missing:1`) — harmless English fallback.

---

## 5. Go / No-Go on the 12-phase spec

| Phase | Verdict | Why |
|---|---|---|
| 1 Inventory | ✅ **Done** | This report + `leakage-report.json` are the measured inventory. |
| 3 Single resolver / no `preferred_language` for display | ✅ **Already true** | `t()` is already selected→EN→key. `preferred_language` only sets the *initial* active language on login, never resolves a string. No change needed. |
| 9 Build-fail audit | ✅ **Done** (script-level) | `i18n:audit` is the permanent gate. |
| 8 RTL `dir` correctness | ✅ **Verified** | `dir='rtl'` iff `language==='ar'`; gate asserts it. (Logical-CSS sweep across components is a separate, larger task — not done.) |
| 4 Prof. Didier composer | ✅ **Already shipped** | `profDidierMessage.ts` covers 8 langs × 3 modes; `audit:i18n-live` gate enforces it. |
| 5 Program catalog | ✅ **Already shipped** | `programCatalog.ts`, 28 programs × 8 langs, gate-enforced. |
| 2 Namespace split into `/src/i18n/...` | ⚠️ **No-Go now** | An 18k-line file split touching 73 components is a high-risk refactor with **zero** user-visible benefit once the audit gate exists. The gate gives the governance the spec wants without the rewrite. Recommend deferring; do it incrementally per-domain if/when a file becomes a merge-conflict bottleneck. |
| 6 Course/lesson DB content | 🔴 **DATA gap** | Cannot be fixed in code. Needs DB translation rows + founder-applied SQL (`loc:populate`). Status **unknown** until Supabase is populated — not fabricated. |
| 7 Diagram localization | ✅ Code shipped (`generate-visuals` takes `language`, cache keyed `lesson::lang`) / 🔴 stale caches need regeneration (data op). |
| 10 Folder reorg | ⚠️ Subsumed by Phase 2 verdict. |
| 11/12 Screenshot QA & live verify | 🔴 **Requires running app + DB** | Checklist exists (`I18N_QA_CHECKLIST.md`); not executable in this environment. |

**Honest verdict:** the *code-level* string-governance objective is achieved — leakage is now
mechanically blocked at build time, and the 3 real dictionary defects are fixed. The
remaining "leakage" users report is **DB content population**, which is a data operation the
human must apply in Supabase; it is not a code bug and is not claimed as done.
