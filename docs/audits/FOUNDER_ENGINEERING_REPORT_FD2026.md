# Founder Engineering Report — FD-2026-003 (Institutional Inventory)

**Status: Inventory only — nothing fixed, per Directive 003.**
Prepared by the Chief Institutional Engineer, 2026-07-02. Every count below is
reproducible from the repository at branch `claude/institutional-engineering`.
Baseline: the constitutional architecture as approved (Covenant-rooted spine,
tag `constitutional-baseline-v1.0`).

---

## 1. Capability inventory (the future Institutional Registry's seed data)

| Capability class | Count | Where | Governed today? |
|---|---|---|---|
| **AI Workforce roles** | 12 agents + 2 personas | `bootstrap.ts`, charters 12/12 | ✅ registry, charters, health, CI |
| **Governing documents** | 26 registered · 15 library shelves | `governance.ts`, `docs/governance/` | ✅ full contract + drift check |
| **Documented programs** | 3 (Scrum v3, BA v1, Cyber) | `docs/curriculum/`, `docs/programs/` | ◐ authored + audited, publish by hand |
| **⚠️ SHADOW PROGRAMS (seeders)** | **44 `seed-*` edge functions** (~40 distinct role-programs: agent-engineer, auditor, cloud, data, devops, mlops, security, solutions-architect, UX, ethics, governance…) | `supabase/functions/seed-*` | ❌ **ZERO** — referenced in no doc, no standard, no QA path, no registry |
| **Operational edge functions** | 25 (ai-proxy, ai-grading, student-assistant, lesson-qa, interview-simulator, scrum-simulation, enrollment-chat, payments, 6 email senders, translate-content, recompute-learning-profiles…) | `supabase/functions/` | ◐ security-hardened (SEC-001/2) but no per-function spec, owner, or KPI |
| **Dashboards / surfaces** | 73 pages (33 top + 18 admin + 15 founder + 7 portal/legal) | `src/pages/` | ◐ founder cockpit governed; student surfaces have no dashboard specs |
| **Components** | 217 | `src/components/` | ◐ shadcn system + UX posture; no component-level standards doc (AVIS shelf reserved) |
| **Services** | 70 files (22 AOS) | `src/services/` | ◐ AOS canon-governed; agent domain services ungoverned individually |
| **DB migrations** | 117 | `supabase/migrations/` | ✅ founder-applied by canon |
| **Knowledge articles** | 142 markdown docs across 14 domains | `docs/` | ◐ 26 registered; ~116 outside the governance registry |
| **Translations** | 13 i18n assets + pipeline + protected terms | `docs/i18n/`, `translate-content` fn | ◐ governance doc exists; coverage measured for flagship only |
| **Tests** | 4 files, 61 passing | `src/**/*.test.ts` | ◐ governance/intelligence covered; **zero product-code tests** |
| **Work orders / directives** | runtime (aos_tasks) + 4 founder directives this epoch | AOS + this report | ◐ work orders governed; directives not yet a registry class |
| **Visual assets** | brand inventory + tokens | `docs/branding/`, `src/index.css` | ◐ AVIS Bible shelf reserved |

## 2. The headline finding

**F-1 (CRITICAL, governance): 44 ungoverned course seeders.** The
`seed-*` edge functions constitute a shadow curriculum factory — roughly 40
role-programs' worth of content-generating capability with **no documentation,
no QA gate, no competency-taxonomy compliance check, no registry record, and
no founder-approval path**. They can write course content to production
outside the pipeline the Constitution mandates (Research → Evidence → Work
Order → QA → Security → Founder Approval). The canon taxonomy defines slugs
for 4 programs; these seeders imply ~40. Whether they were one-time bootstraps
or remain callable is **unverified from the client repo** — determining their
live status is the first engineering question for the founder walk.
*Not fixed, per directive. Highest-priority registry entries.*

## 3. Gap matrix (what Directive 001's artifact standard requires vs. what exists)

| Artifact | AI Workforce | Governance | Programs (3) | Shadow programs (44) | Edge fns (25) | Dashboards | Translations |
|---|---|---|---|---|---|---|---|
| Reference Model | ◐ AOS canon | ✅ | ◐ PROGRAM_ARCHITECTURE | ❌ | ❌ | ◐ AIOS design | ✅ pipeline doc |
| Operational Playbook | ◐ CI doctrine | ✅ ratification | ◐ publish packages | ❌ | ❌ | ❌ | ✅ |
| Standards Spec | ✅ charters | ✅ | ✅ PROGRAM_STANDARD_V1 | ❌ | ❌ | ❌ (AVIS reserved) | ✅ |
| Dashboard Spec | ✅ cockpit | ✅ panel | ◐ readiness dash | ❌ | ❌ | ❌ | ◐ TranslationTruth |
| AI Workforce Spec | ✅ | ✅ | ◐ curriculum agent | ❌ | ❌ | ◐ interface agent | ❌ |
| KPI Dictionary | ❌ **none exists anywhere** — KPIs are named in prompts (CTIS, placement rate, CTS) but no dictionary defines formula/owner/target/cadence | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quality Gates | ✅ 4 gates + founder | ✅ lifecycle | ◐ QA_STANDARD | ❌ | ❌ | ❌ | ◐ checklist |
| Brain Integration | ✅ | ✅ sync ready | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend:** ✅ exists · ◐ partial · ❌ missing.

## 4. Ranked findings (after F-1)

- **F-2 (HIGH): No KPI Dictionary exists.** The AIOS Score Contract design
  (draft) is the natural home; until ratified+built, "measurable" is
  aspiration for every capability class.
- **F-3 (HIGH): Zero product-code tests.** 61 tests guard governance and
  intelligence logic; quizzes, payments UI, enrollment, progress — untested.
  The E2E_TEST_PLAN.md exists as a document only.
- **F-4 (MEDIUM): ~116 knowledge documents outside the registry** (curriculum
  modules, audits, ops packages, marketing). The registry currently governs
  governance; the Institutional Registry (FD-002) must govern *everything*.
- **F-5 (MEDIUM): 25 operational edge functions lack owners, specs, and
  KPIs** — including revenue-critical (`create-checkout`,
  `handle-payment-webhook`) and student-facing AI (`student-assistant`,
  `ai-grading`).
- **F-6 (MEDIUM): Accessibility is posture-only.** 27 components carry aria
  attributes; no WCAG target is ratified (AVIS shelf reserved), no
  assistive-tech walk recorded.
- **F-7 (LOW): Founder Directives are not yet a registry class** — FD-001–004
  and Directives 003/004 live in chat history and commit messages; the
  Institutional Registry should accession them.
- **F-8 (LOW): CI workflow still not installed** (token `workflow` scope) —
  drift enforcement remains local-only.

## 5. Engineering sequence proposal (per FD-002; awaiting go-ahead)

1. **Institutional Registry** — extend the proven governance-registry pattern
   (typed records + drift check + Brain sync) to all capability classes, with
   FD-002's full record schema. Seed it from THIS report's inventory.
   Priority records: the 44 shadow seeders (status: `unverified`).
2. **KPI Dictionary** — one typed contract (the AIOS Score Contract),
   every KPI with formula/owner/target/cadence; closes F-2.
3. **Founder walk on F-1** — determine seeder live status; founder decides
   retire / govern / archive per seeder.
4. Then artifact-by-artifact gap closure in registry-priority order, each
   through the quality gate.

*Nothing above has been implemented. Inventory first — understanding precedes
engineering.*
