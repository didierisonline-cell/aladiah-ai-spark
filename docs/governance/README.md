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
│   ├── enterprise-architecture.md   ← the whole-system view (DRAFT)
│   ├── intelligence-architecture.md ← the intelligence layer (migrated here)
│   └── diagrams.md            ← dependency + authority diagrams
├── standards/                 ← index of the canonical standards (see below)
├── manuals/                   ← operational runbooks index
├── departments/               ← the 12 departments + 2 personas index
└── playbooks/                 ← repeatable operating procedures index
```

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

```
CONSTITUTION (draft — composes, does not replace, the ratified canon)
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
