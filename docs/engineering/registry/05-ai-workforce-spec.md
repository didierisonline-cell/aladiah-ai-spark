# Institutional Registry — AI Workforce Specification

**Status: DESIGN — awaiting founder approval.**

| Role | Department | Responsibility |
|---|---|---|
| **Registrar (owner)** | operations-platform | Runs the scanner observer each intelligence cycle; keeps scanner↔registry parity; raises drift findings with evidence |
| Classifier support | analytics-intelligence | Proposes classifications for new capabilities as evidence-scored intelligence findings (confidence + basis); never auto-classifies — founder or owning department confirms |
| Per-class stewards | owning departments | Curriculum records → curriculum-excellence; dashboards/UX → interface-experience; marketing assets → marketing-content; etc. Stewards keep artifact paths current |
| Quality | qa-authority | Registry changes ride the standard work-order QA gate |
| Founder | — | Classification of `unknown` records; class creation; archival decisions |

## Integration points (all existing AOS machinery — nothing parallel)

- Scanner runs as a **department observer** in the Continuous Intelligence
  registry (operations-platform), emitting findings for unregistered
  capabilities (confidence 0.9+, basis: filesystem scan).
- Registry changes above P-2 thresholds flow as **work orders** through the
  existing gates.
- Every record mirrors to the **Company Brain** via the same idempotent sync
  pattern (`registry:record:<id>:v<n>` markers).
- Cockpit surfaces via the Dashboard Spec (04).
