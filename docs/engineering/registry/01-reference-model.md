# Institutional Registry — Reference Model

**Status: DESIGN — awaiting founder approval. No implementation authorized.**

## Concept

The Institutional Registry is the master inventory of the Institution: one
typed record per capability, no capability outside it. It **generalizes the
proven Governance Registry pattern** (typed records as code → CI drift check →
Brain sync → cockpit surface) from 26 governing documents to every capability
class — it does not replace the Governance Registry; governing documents
remain one class among many, linked by key.

## The record (FD-002 schema, normalized)

```ts
interface InstitutionalRecord {
  id: string;                     // stable: <class>:<slug>  e.g. 'edge-fn:seed-ai-auditor'
  class: CapabilityClass;         // program|course|lesson|simulation|assessment|dashboard|
                                  // policy|standard|playbook|reference-model|ai-role|institute|
                                  // department|team|work-order|founder-directive|research-report|
                                  // translation|visual-asset|knowledge-article|edge-function|service
  name: string;
  owner: string;                  // single-threaded owner (agent slug or 'founder')
  institute: string | null;       // future org unit; null until Organizational Charter
  department: string;             // one of the 12 (or 'founder')
  classification: 'constitutional'|'strategic'|'operational'|'experimental'|'legacy'|'archived'|'unknown';
  status: string;                 // class-specific lifecycle state
  maturity: 0|1|2|3|4|5;          // engineering maturity: 0 none → 5 all 8 artifacts + measured
  artifacts: {                    // the 8 mandatory artifacts, each: path | 'missing' | 'n/a'
    referenceModel: string; playbook: string; standards: string; dashboardSpec: string;
    workforceSpec: string; kpis: string; qualityGates: string; brainLink: string;
  };
  dependencies: string[];         // record ids
  security: 'public'|'student'|'founder'|'secret';
  qaStatus: 'untested'|'planned'|'passing'|'failing'|'n/a';
  accessibilityStatus: 'unmeasured'|'posture'|'audited'|'n/a';
  translationStatus: 'n/a'|'none'|'partial'|'full';
  lastReview: string; nextReview: string;
  readinessScore: number | null;  // honest: null = unmeasured, never 0
  evidence: string;               // where the record's claims can be verified
}
```

## Invariants (all CI-enforced, same as the governance drift check)

1. Ids unique; dependency references resolve; dependency graph acyclic.
2. `classification` must exist BEFORE registration (Phase 0 rule).
3. `unknown`-classified records cannot claim maturity > 0 or a readinessScore.
4. Records of class `edge-function`/`service`/`dashboard` must correspond to
   real paths on disk (existence-checked), and — inverse — every edge
   function/page discovered by the scanner must have a record: **no capability
   outside the Registry** becomes a failing test, not a policy sentence.
5. Registry is code (git-reviewed), mirrored to the Company Brain, rendered on
   the cockpit. Three redundant stores; git is authoritative.

## Position in the constitutional spine

Governed by AIOS (parent), consumes the Governance Registry (governing docs
are its `policy|standard|...` classes), feeds the Dashboard Spec (04) and the
KPI Dictionary (06).
