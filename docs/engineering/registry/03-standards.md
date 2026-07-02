# Institutional Registry — Standards Specification

**Status: DESIGN — awaiting founder approval.**

1. **Id format**: `<class>:<kebab-slug>`, immutable once created (append-only
   like competency slugs — renames orphan history).
2. **Honesty**: unmeasured is `null`/`unmeasured`, never zero or fabricated;
   `unknown` classification blocks maturity/readiness claims (CI rule).
3. **Single-threaded ownership**: every record names one owner; "shared" is
   not an owner. Departments map to the 12 charters.
4. **Evidence field is mandatory** for classification, status, and every
   `unknown→X` transition (LAUNCH_DECISION_PRINCIPLE applied to inventory).
5. **Maturity is computed**: count of the 8 artifacts present (n/a counts as
   present when justified) mapped to 0–5; never hand-set.
6. **Scanner parity**: the automated scanner (edge functions, pages, services,
   docs) and the registry must agree in both directions; discrepancies fail CI
   with the missing/extra ids named.
7. **No parallel inventories**: existing registries (governance docs, Founding
   Library, agent registry) are consumed by reference, not duplicated —
   one fact, one home, links everywhere else.
8. **Naming**: registry-native artifacts kebab-case; migrated artifacts keep
   their historical names (per the governance naming convention).
