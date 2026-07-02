# Capability Genome — Worked Example (design)

**Status: DESIGN illustration.** A real capability, chosen because its
lineage demonstrates Amendment I: the flagship program was born in the shadow
factory era and was superseded by the governed publish flow — the genome
preserves that history permanently.

```jsonc
{
  // §1 Identity
  "id": "program:ai-scrum-master-v3",
  "mission": "Transform learners into employable AI-era Scrum Masters (Covenant Art. V, XIII: learners, employers).",
  "purpose": "The flagship certification program proving the Aladiah career-transformation model.",
  "type": "program",
  "classification": "strategic",
  "owner": "curriculum-excellence",
  "authority": "canonical",
  "institute": null,                       // reserved until Organizational Charter (Vol III)
  "department": "curriculum-excellence",

  // §2 Canonical references
  "constitutionVolumes": ["02", "10"],     // Constitution · Academic Canon
  "founderStandards": { "na": "Volume II reserved; LAUNCH_DECISION_PRINCIPLE governs directly" },
  "referenceModel": "docs/curriculum/PROGRAM_ARCHITECTURE.md",
  "playbook": "docs/governance/manuals/validation-walks/ba-flagship-walk.md",
  "standards": ["capability-genome-standard", "program-standard-v1", "competency-taxonomy", "qa-standard"],
  "dashboardSpec": "src/pages/founder/FounderReadiness.tsx (readiness dashboard)",
  "workforceSpec": "docs/agents/curriculum-excellence/AGENT_SPEC.md",
  "kpiDictionary": "missing",              // honest — F-2: no program KPI dictionary yet

  // §3 Interfaces
  "dependencies": ["standard:competency-taxonomy", "service:quiz-engine"],
  "inputs": [
    { "name": "authored curriculum (docs/curriculum/scrum-master-v3)", "kind": "document" },
    { "name": "founder-applied publish migrations", "kind": "human-action" }
  ],
  "outputs": [
    { "name": "published course + 18 modules + tagged questions", "kind": "artifact",
      "writesProduction": true,
      "approvalGate": "QA review → founder-applied SQL → founder walk (ba-flagship-walk doctrine)" },
    { "name": "competency-tagged attempt data", "kind": "data", "writesProduction": true,
      "approvalGate": "student-driven via governed quiz engine (RLS)" }
  ],

  // §4 Assurance (all computed)
  "security": { "level": "student", "posture": "RLS per-user; founder-gated authoring", "gateChain": "QA→Security→Founder" },
  "accessibility": "posture",
  "translation": "partial",                // computed: flagship chapter coverage probe
  "qaStatus": "passing",                   // computed: readiness audit green

  // §5 Operation
  "workforce": [
    { "agent": "curriculum-excellence", "role": "stewards" },
    { "agent": "product-builder", "role": "operates" },
    { "agent": "qa-authority", "role": "reviews" }
  ],
  "kpis": "missing",
  "maturity": 3,                           // computed: 6/8 artifacts present
  "lifecycle": "measured",
  "lastReview": "2026-06-19", "nextReview": "2026-09-19",

  // §6 Lineage — WHY THIS EXAMPLE
  "parentCapability": "department:curriculum-excellence",
  "childCapabilities": ["course:scrum-flagship", "assessment:scrum-final-exam-pool"],
  "derivedFrom": ["edge-function:seed-scrum-course"],   // born in the shadow era
  "supersedes": ["edge-function:seed-scrum-course"],    // …and superseded it
  "replacedBy": null,
  "constitutionalAuthority": "academic-canon",
  "founderDirectives": ["flagship v3 rebuild decision (migrations 20260619*)"],
  "engineeringDecisions": ["publish-by-founder-applied-migration (canon)", "18-module blueprint"],
  "architectureDecisions": ["competency snapshot at submit (append-only taxonomy)"],
  "createdOn": "2026-06-19", "ratifiedOn": null, "retiredOn": null,
  "evolution": [
    { "on": "2026-05-01", "kind": "created", "by": "founder", "evidence": "seed-scrum-course era (git history)" },
    { "on": "2026-06-19", "kind": "superseded", "by": "founder", "evidence": "flagship_scrum_18_modules migrations replace seeder output" },
    { "on": "2026-06-19", "kind": "measured", "by": "qa-authority", "evidence": "FLAGSHIP_SCRUM_READINESS_AUDIT.md" }
  ],

  // §7 Memory
  "brainLink": "genome:program:ai-scrum-master-v3:v1",
  "improvementHistory": [
    { "on": "2026-06-19", "kind": "lesson-learned", "by": "curriculum-excellence",
      "evidence": "Seeder-era content lacked competency tags; v3 tags at insert (canon rule born here)." }
  ]
}
```

Validation result under the v2.0 rules: **genome-complete** (all loci
present; `missing` KPI dictionary honest and visible) · maturity 3
(genome-mature) · V5 satisfied (both production writes name gates) · V6/V7
lineage resolves with creation authority.
