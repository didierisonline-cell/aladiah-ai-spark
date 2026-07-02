# The Aladiah Founding Library

**Status: Permanent institutional archive — ARCHITECTURE FROZEN by founder
approval, 2026-07-01 (tag: `constitutional-baseline-v1.0`). Structural changes
to this library are constitutional acts.** Established by Founder Executive
Directive 003. This library is the permanent constitutional record of Aladiah
— the shelf every department, AI faculty, workflow, dashboard, curriculum,
policy, and future decision ultimately inherits from.

## Accession policy (the librarian's rules)

1. **Fifteen numbered shelves (00–14).** The catalog below is closed; adding a
   shelf is a constitutional act recorded in the registry and changelog.
2. **Shelves hold ratified text or point to the working draft.** Working
   documents live where the ratification sequence references them; a shelf
   document carries the full institutional metadata and points to its working
   draft until ratification.
3. **Enshrinement.** Upon founder ratification, the ratified text moves INTO
   its numbered shelf (git mv, history preserved), the working location
   becomes a pointer, and the registry path updates in the same reviewed
   commit. The library never contains unratified content presented as
   ratified.
4. **Nothing is invented.** Reserved shelves (covenant, declaration,
   organizational charter, faculty handbook, founder operating manual) hold
   structure only until the founder authors them.
5. **The registry is the catalog.** Every shelf is a first-class governance
   asset: `FOUNDING_LIBRARY` in `src/services/aos/governance.ts` binds shelf
   numbers to registry keys, the drift check enforces shelf↔file↔registry
   consistency in CI, and `syncGovernanceToBrain()` makes each discoverable to
   every future AI worker.

## The catalog

| Shelf | Document | Registry key | Working draft / content state |
|---|---|---|---|
| 00 | Covenant | `covenant` | **Founder Approved Draft v1.0 — pending Founder Signature** (authored 2026-07-02) |
| 01 | Declaration | `declaration` | Reserved — founder-authored |
| 02 | Constitution | `constitution` | Working draft: `../constitution/constitution.md` (v0.1) |
| 03 | Founder Standards | `founder-standards` | Reserved structure: `../standards/founder-standards.md` |
| 04 | Organizational Charter | `organizational-charter` | Reserved — founder-authored |
| 05 | Enterprise Architecture | `enterprise-architecture` | Working draft: `../architecture/enterprise-architecture.md` (v0.1) |
| 06 | Intelligence Architecture | `intelligence-architecture` | Working draft: `../architecture/intelligence-architecture.md` (v1.0, review) |
| 07 | AIOS | `aladiah-operating-system` | Working draft: `../architecture/ALADIAH_OPERATING_SYSTEM.md` (v1.0 design) |
| 08 | Department Charters | `department-charters` | Working index: `../departments/README.md` (12 charters) |
| 09 | Faculty Handbook | `faculty-handbook` | Reserved — how AI faculty + humans operate together |
| 10 | Academic Canon | `academic-canon` | Working index: `../academic/README.md` |
| 11 | AVIS Design Bible | `avis-design-bible` | Working scaffold: `../design/avis-design-bible.md` |
| 12 | Research Institute Handbook | `research-institute-handbook` | Working scaffold: `../research/README.md` |
| 13 | Brand & Media Bible | `brand-media-bible` | Working scaffold: `../brand/README.md` |
| 14 | Founder Operating Manual | `founder-operating-manual` | Reserved — founder-authored |

Ratification order and merge gate: see the Constitutional Ratification
Checklist (delivered 2026-07-01) and `../constitution/ratification.md`.

## Authoring protocol (founder decree, 2026-07-01)

1. **Only the Founder authors constitutional doctrine.** No AI invents,
   drafts, or ghost-writes doctrine — ever.
2. **AI assists with**: editing, formatting, indexing, cross-referencing,
   validation, dependency analysis, versioning, and governance integration —
   of text the founder provides.
3. **Intake per volume**: the founder provides the text → AI places it in the
   shelf's Document Body verbatim (editorial suggestions offered separately,
   never applied silently) → metadata, TOC, cross-references, and registry
   version are updated → the drift check validates → the founder reviews the
   diff and ratifies per `../constitution/ratification.md`.
4. **Authoring order** begins with **Volume 0 — The Aladiah Covenant**
   (shelf 00), and proceeds one volume at a time as the founder directs.
