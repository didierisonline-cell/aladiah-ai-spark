# MARKETING_CLAIMS_REGISTRY.md
**The single source of truth for every public claim Aladiah makes.**
**Updated:** 2026-06-21

---

## THE LAW

> **No number, statistic, salary, count, or outcome may appear in any published
> marketing asset unless it exists in this registry with a verified source.**

A claim is anything a reasonable reader would treat as a fact:
- Counts ("30+ programs", "20 languages", "500 students")
- Rates ("95% pass rate", "40% salary increase")
- Salaries ("Scrum Masters earn $90K–$140K")
- Market statistics ("87M PM shortage by 2027")
- Outcomes ("placed at Company X")

**Status values:**
- `VERIFIED` — source confirmed, evidence on file, cleared for publication
- `BLOCKED` — no acceptable source yet; **must not be published**
- `RETIRED` — was used, now outdated; do not reuse

---

## INTERNAL CLAIMS (about Aladiah itself)

| # | Claim | Source | Evidence Location | Status |
|---|---|---|---|---|
| I-01 | Number of programs offered | Curriculum inventory (DB `courses` table) | TBD — pull live count | BLOCKED |
| I-02 | Number of supported languages | i18n system (`LanguageContext`) | TBD — confirm count from code | BLOCKED |
| I-03 | Number of enrolled students | Supabase `profiles` count | TBD — pull live count | BLOCKED |
| I-04 | Student pass / completion rate | `user_progress` + `quiz` data | TBD — compute from DB | BLOCKED |
| I-05 | Number of placements | Employment Outcomes records | None yet — role unfilled | BLOCKED |
| I-06 | Average salary increase | Employment Outcomes + consent | None yet | BLOCKED |
| I-07 | Employer partnership count | Placement Partnerships records | None yet | BLOCKED |

> **None of the internal claims are cleared.** Until Employment Outcomes and the
> live database produce verified counts, marketing assets must use the *market*
> claims below (external, sourced) — never invented internal numbers.

---

## EXTERNAL / MARKET CLAIMS (about the industry)

These appear in current content (video scripts, LinkedIn, carousels) and **must
be verified before those assets pass QA.**

| # | Claim | Used In | Required Source | Status |
|---|---|---|---|---|
| E-01 | "87M project management professionals needed by 2027" | LinkedIn 09, Video 03 | PMI *Talent Gap Report* — confirm year & exact figure | BLOCKED |
| E-02 | "Scrum Master US salary $90K–$140K" | Video 02 | Glassdoor / LinkedIn Salary / PayScale — pull current ranges | BLOCKED |
| E-03 | "Scrum Master EU salary €65K–€100K" | Video 02 | LinkedIn Salary / Glassdoor EU | BLOCKED |
| E-04 | "DR certified professionals earn 40–60% more" | Video 02 | **Needs primary source — likely unverifiable, consider removing** | BLOCKED |
| E-05 | "Cybersecurity demand in sub-Saharan Africa +350% by 2030" | Video 08 | IFC / (ISC)² Workforce Study / AfricaCERT — verify | BLOCKED |
| E-06 | "47 new DR free zone companies in 18 months" | Video 09 | CNZFE (Consejo Nacional de Zonas Francas) report | BLOCKED |
| E-07 | "Africa tech VC grew 44% last year" | Video 14 | Partech Africa Report / Briter Bridges — verify year & figure | BLOCKED |
| E-08 | "PMP holders earn 22% more on average" | Carousel 03 | PMI *Earning Power Salary Survey* — confirm % & edition | BLOCKED |
| E-09 | "Data Analysts earn 35–50% more than non-credentialed peers" | Carousel 03 | **Needs primary source — refine or remove** | BLOCKED |
| E-10 | "WEF: 85M jobs displaced / 97M created by 2025" | Founder Story (email W... / video) | WEF *Future of Jobs Report 2020* — confirm; note 2025 horizon is now past, may need 2023/2025 edition | BLOCKED |
| E-11 | "PMI projects 22% higher pay" / "Agile Manifesto 2001" | Carousel 03, Video 22 | Historical fact (2001) = VERIFIED; pay stat = see E-08 | PARTIAL |

---

## VERIFICATION PROCESS

1. QA Director or Growth Director locates the **primary** source (not a blog citing a blog).
2. Capture: publisher, title, year/edition, exact figure, URL or PDF.
3. Store evidence in `/docs/marketing/qa/evidence/` (PDF or screenshot + link).
4. Update the row: status → `VERIFIED`, fill Evidence Location.
5. Update the inline citation in the asset to match the verified figure exactly.
6. Only then does the asset clear the Accuracy gate.

**If no primary source exists → the claim is removed from the asset.** Rewrite
the line to make the point without the number. A weaker true statement beats a
stronger false one, every time.

---

## RETIRED / FORBIDDEN CLAIMS

| Claim | Reason |
|---|---|
| Any "guaranteed job" language | We promise transformation + outcome tracking, never a guarantee |
| Any "get rich" / income-promise framing | Violates content rules — forbidden |
| Invented student counts or success rates | No evidence = forbidden until I-03/I-04 verified |

---

**Storage:** `/docs/marketing/MARKETING_CLAIMS_REGISTRY.md`
**Owner:** Marketing QA Director (maintains) · Growth Director (sources data)
