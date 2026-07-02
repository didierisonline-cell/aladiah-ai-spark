# Institutional Registry — Operational Playbook

**Status: DESIGN — awaiting founder approval.**

## P-1 Register a capability
1. Classify (Phase 0 categories) with evidence — no classification, no entry.
2. Create the record via reviewed commit (id, owner, department mandatory).
3. Artifacts honestly marked `missing`/`n/a` — maturity computed, never asserted.
4. CI validates; Brain sync mirrors on next founder session.

## P-2 Change a record
Reviewed commit + history in git; classification changes and
`legacy→archived` transitions require a work order; `unknown→anything`
requires founder-walk evidence cited in `evidence`.

## P-3 Retire a capability
Never delete the record. `status: retired`, `classification: archived`,
evidence of decommission attached. The scanner tolerates archived records
whose paths no longer exist (the only class exempt from existence checks).

## P-4 The Unknown queue
`unknown` records form a standing founder queue (surfaced by Dashboard Spec
04), ordered by risk (publish-direct + destructive first). Each resolves via
founder walk → decision (retire/govern/archive) → work order → record update.

## P-5 Review cadence
`constitutional` 90d · `strategic` 90d · `operational` 180d ·
`experimental` 30d · `legacy` 180d (with a retire-by question) ·
`unknown` 14d (they must not linger) · `archived` none.

## P-6 Onboarding a new capability class
Extend the class union + scanner + this playbook in one commit; requires a
founder directive (class creation is an institutional act).
