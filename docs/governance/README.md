# Aladiah Governance — the institutional root

Status: **Governance index.** This tree is how Aladiah operates as an
institution rather than a software project: every department, AI agent,
workflow, curriculum, dashboard, and feature inherits its authority from the
documents mapped here.

## Structure

```
docs/governance/
├── README.md                  ← you are here: map + dependency graph
├── constitution/
│   ├── constitution.md        ← the founding document (DRAFT until ratified)
│   ├── changelog.md           ← constitutional amendment history
│   └── ratification.md        ← how documents gain and lose authority
├── architecture/
│   ├── ALADIAH_OPERATING_SYSTEM.md  ← the seven-level OS design (DRAFT v1.0)
│   ├── enterprise-architecture.md   ← the whole-system view (DRAFT)
│   ├── intelligence-architecture.md ← the intelligence layer (migrated here)
│   └── diagrams.md            ← dependency + authority diagrams
├── standards/                 ← canon index + founder-standards.md (reserved scaffold)
├── manuals/                   ← validation manual + walks + Launch Command Center
├── departments/               ← Department Charters (12 + 2 personas)
├── academic/                  ← Academic Canon index
├── design/                    ← AVIS Design Bible (scaffold)
├── research/                  ← Research Institute Handbook (scaffold)
├── brand/                     ← Brand & Media Bible (scaffold)
└── playbooks/                 ← repeatable operating procedures index
```

**Naming convention (decided in the framework build):** new governance-native
documents use `kebab-case.md`; migrated canon-era documents keep their
`SCREAMING_SNAKE` names to preserve history and references. Renames are
founder decisions — flag, don't churn.

## Where the canon physically lives (and why it does not move)

The constitutional core remains at **`/docs/standards/`**:
`NORTH_STAR.md` · `ARCHITECTURE_PRINCIPLE.md` · `COMPETENCY_TAXONOMY.md` ·
`LAUNCH_DECISION_PRINCIPLE.md` · `QA_STANDARD.md` · `PROGRAM_STANDARD_V1.md` ·
`PROGRAM_VALIDATION_GATE.md` · `EMPLOYMENT_VALUE_GATE.md` · `PUBLISH_LAYER.md` ·
`COMPETENCY_TAXONOMY_V2_FINAL.md`.

Three reasons, all evidence-backed:
1. **Code references those paths** (`src/services/standards/`, agent prompts,
   competency taxonomy readers).
2. **CLAUDE.md instructs every session** to read `/docs/standards/*` by path.
3. **The canon's own header** says changes are platform-level decisions —
   relocating the files is a founder decision, not a refactor.

This tree therefore *indexes and governs* the canon; it does not fork it.
Single source of truth is preserved everywhere.

## Machine-readable registry

The Institutional Knowledge registry —
**`src/services/aos/governance.ts`** — is the machine-readable version of this
map: every governing document's name, version, status
(draft/review/ratified/deprecated), owner, authority level, parent/children,
and review dates. The Founder Cockpit's Governance panel renders it. The
registry is code, so every change to institutional status is itself
git-versioned, reviewable, and founder-approved.

## Authority hierarchy (dependency map)

**The constitutional spine (Founder Constitutional Decision, 2026-07-02 —
CI-enforced in `governance.test.ts`):**

```
THE COVENANT (root of the Aladiah Canon — Foundational)
    ↓
THE CONSTITUTION
    ↓
FOUNDER STANDARDS
    ↓
ORGANIZATIONAL CHARTER
    ↓
ENTERPRISE ARCHITECTURE
    ↓
INTELLIGENCE ARCHITECTURE
    ↓
AIOS
    ↓
DEPARTMENT CHARTERS
    ↓
OPERATIONAL POLICIES
    ↓
IMPLEMENTATION
```

The ratified canon and supporting documents attach to the spine:

```
CONSTITUTION (derives from THE COVENANT)
│
├── LAUNCH_DECISION_PRINCIPLE (ratified)     ← the root decision law
│      └── QA_STANDARD · LAUNCH_COMMAND_CENTER (root) · validation runbooks
├── NORTH_STAR (ratified)                    ← why we exist; ordering of work
│      └── PROGRAM_STANDARD_V1 · EMPLOYMENT_VALUE_GATE
├── ARCHITECTURE_PRINCIPLE (ratified)        ← what qualifies to be built
│      └── enterprise-architecture (draft) ← SHELL_ARCHITECTURE
├── COMPETENCY_TAXONOMY (ratified)           ← the only source of slugs
│      └── quiz tagging · Phase-2 analytics · program registries
│
├── AGENT_OPERATING_SYSTEM (ratified)        ← the AOS infrastructure canon
│      ├── CONTINUOUS_IMPROVEMENT (review)   ← the operating doctrine
│      │      └── intelligence-architecture (review)
│      └── departments/ (12 AGENT_SPECs)
│
└── domain governance (operational)
       ├── TRANSLATION_GOVERNANCE · PROTECTED_TERMS (i18n)
       ├── SECURITY_EXPOSURE_REPORT + apply packages (security)
       ├── CURRICULUM_EXCELLENCE_FRAMEWORK · PROGRAM_ARCHITECTURE (curriculum)
       └── ALADIAH_OPERATING_METRICS_FRAMEWORK (ops)
```

**Overlaps found in the audit — resolved in the Founder Governance Review:**
- Taxonomy V1/V2: **resolved by evidence** — V2's own header says it was merged
  into canon (`COMPETENCY_TAXONOMY.md` §6–§11 is the source of truth); V2 is
  retained as design rationale (authority: informational).
- Validation guidance: **consolidated** into
  `manuals/FOUNDER_VALIDATION_MANUAL.md` with both walks migrated intact as
  chapters under `manuals/validation-walks/`.
- `LAUNCH_COMMAND_CENTER.md`: **moved** from the repo root into
  `manuals/` (git history preserved; canon reference updated).

## Change discipline

New governing documents enter through `constitution/ratification.md`'s
lifecycle (Draft → Review → Ratified → Deprecated), get a registry entry, and
are recorded in the Company Brain (`governance-record`). Nothing gains
authority silently.
