# Capability Genome — Schema (design)

**Status: DESIGN — companion to the Standard v2.0; no implementation.**
The schema is expressed as TypeScript for precision; upon ratification it is
implemented verbatim in `src/services/aos/` next to the governance registry.

```ts
type GenomeId = `${CapabilityType}:${string}`;            // immutable, append-only
type Ref = string | 'missing' | { na: string };           // n/a requires justification

type CapabilityType =
  | 'program' | 'course' | 'lesson' | 'simulation' | 'assessment' | 'dashboard'
  | 'policy' | 'standard' | 'playbook' | 'reference-model' | 'ai-role'
  | 'institute' | 'department' | 'team' | 'work-order' | 'founder-directive'
  | 'research-report' | 'translation' | 'visual-asset' | 'knowledge-article'
  | 'edge-function' | 'service';

type Classification = 'constitutional'|'strategic'|'operational'|'experimental'|'legacy'|'archived'|'unknown';
type Lifecycle = 'proposed'|'draft'|'governed'|'implemented'|'measured'|'institutionalized'|'deprecated'|'retired';

interface LineageEvent { on: string; kind: 'created'|'amended'|'superseded'|'migrated'|'measured'|'deprecated'|'retired'; by: string; evidence: string; }
interface ImprovementEvent { on: string; kind: 'impact-measured'|'lesson-learned'; by: string; evidence: string; outcome?: 'positive'|'neutral'|'negative'; }
interface KPI { key: string; formula: string; target: string; owner: string; cadence: string; source: string; }

interface CapabilityGenome {
  // §1 Identity
  id: GenomeId; mission: string; purpose: string; type: CapabilityType;
  classification: Classification; owner: string; authority: 'foundational'|'constitutional'|'canonical'|'operational'|'informational';
  institute: string | null; department: string;
  // §2 Canonical references
  constitutionVolumes: string[];        // Founding Library shelf numbers
  founderStandards: Ref;                // reserved until Volume II is authored
  referenceModel: Ref; playbook: Ref; standards: string[]; // registry keys; always ⊇ ['capability-genome-standard']
  dashboardSpec: Ref; workforceSpec: Ref; kpiDictionary: Ref;
  // §3 Interfaces
  dependencies: GenomeId[];
  inputs: { name: string; kind: 'data'|'document'|'human-action'|'event' }[];
  outputs: { name: string; kind: 'data'|'artifact'|'decision'|'side-effect'; writesProduction: boolean; approvalGate: string | null }[];
  // §4 Assurance (computed loci marked ⚙)
  security: { level: 'public'|'student'|'founder'|'secret'; posture: string; gateChain: string | null };
  accessibility: 'unmeasured'|'posture'|'audited'|'n/a';   // ⚙ from audit evidence
  translation: 'n/a'|'none'|'partial'|'full';               // ⚙ from coverage probes
  qaStatus: 'untested'|'planned'|'passing'|'failing'|'n/a'; // ⚙ from test/QA evidence
  // §5 Operation
  workforce: { agent: string; role: 'operates'|'stewards'|'reviews' }[];
  kpis: KPI[] | 'missing';
  maturity: 0|1|2|3|4|5;                                    // ⚙ computed, never hand-set
  lifecycle: Lifecycle; lastReview: string; nextReview: string;
  // §6 Lineage
  parentCapability: GenomeId | null; childCapabilities: GenomeId[];
  derivedFrom: GenomeId[] | 'none'; supersedes: GenomeId[] | 'none'; replacedBy: GenomeId | null;
  constitutionalAuthority: string;      // spine position (registry key)
  founderDirectives: string[]; engineeringDecisions: string[]; architectureDecisions: string[];
  createdOn: string; ratifiedOn: string | null; retiredOn: string | null;
  evolution: LineageEvent[];            // append-only; ≥1 (creation)
  // §7 Memory
  brainLink: `genome:${string}:v${number}`;
  improvementHistory: ImprovementEvent[];
}
```
