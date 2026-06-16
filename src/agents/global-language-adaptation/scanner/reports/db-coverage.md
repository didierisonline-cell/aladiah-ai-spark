# DB Content Coverage Report

_Generated 2026-06-16T15:38:59.870Z · scanner v0.2-db_
_Scope: db-content (courses/chapters/videos translations + quiz_questions probe)_
_Supabase: vgujnkxylipfwmkpwzvb.supabase.co · reachable: false_

## Tables probed
```json
{
  "courses": {
    "ok": false,
    "status": 403,
    "error": "egress-blocked"
  }
}
```

## Per-language DB content coverage (English/French first, Basaa add-on last)

| Lang | DB coverage % | Surfaces measured |
|---|---|---|
| fr | n/a (not measured) | 0 |
| es | n/a (not measured) | 0 |
| zh | n/a (not measured) | 0 |
| ar | n/a (not measured) | 0 |
| de | n/a (not measured) | 0 |
| ja | n/a (not measured) | 0 |
| pt | n/a (not measured) | 0 |
| hi | n/a (not measured) | 0 |
| ko | n/a (not measured) | 0 |
| it | n/a (not measured) | 0 |
| ru | n/a (not measured) | 0 |
| nl | n/a (not measured) | 0 |
| pl | n/a (not measured) | 0 |
| tr | n/a (not measured) | 0 |
| sw | n/a (not measured) | 0 |
| yo | n/a (not measured) | 0 |
| ha | n/a (not measured) | 0 |
| ig | n/a (not measured) | 0 |
| vi | n/a (not measured) | 0 |
| th | n/a (not measured) | 0 |
| bas | n/a (not measured) | 0 |

## Per-surface detail

| Lang | Surface | Table | Translated | Total | Coverage % |
|---|---|---|---|---|---|
_no rows_

## Notes
- Supabase host is NOT reachable from this environment (network egress allowlist). Add the Supabase host to the environment egress settings, or run this scanner where outbound access to *.supabase.co is allowed. No DB coverage was measured.

> Coverage denominator = count of rows whose **baseline (en)** field is non-empty (the set
> of items that actually need translating). Quiz surfaces are schema-pending until the
> additive `quiz_questions.translations` migration is applied.
