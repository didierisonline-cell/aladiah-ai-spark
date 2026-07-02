// =============================================================================
// Institutional Knowledge — the machine-readable governance registry.
// Governing documents are not markdown files that happen to exist; they are
// registered institutional objects with authority, lineage, ownership, review
// obligations, and history. The registry is CODE on purpose — every change to
// institutional authority is a reviewed, git-versioned commit — and it is
// ENFORCED by the drift check: a governance document that is not registered,
// or a registered document that does not exist, fails CI.
//
// Designed for decades, not sprints: the registry survives AI-model changes,
// technology changes, and leadership changes because it is plain data, plain
// git, and mirrored into the Company Brain (syncGovernanceToBrain).
//
// Human-readable map: docs/governance/README.md
// Lifecycle rules:    docs/governance/constitution/ratification.md
// =============================================================================
import { recordDecision, listBrain, BrainEntry } from './brain';
import { emitEvent } from './events';

export type DocumentStatus = 'draft' | 'review' | 'ratified' | 'deprecated';
export type AuthorityLevel = 'foundational' | 'constitutional' | 'canonical' | 'operational' | 'informational';

/** One entry in a document's approval/change history. */
export interface DocumentEvent {
  on: string; // YYYY-MM-DD
  kind: 'created' | 'amended' | 'migrated' | 'sent-to-review' | 'approved' | 'ratified' | 'deprecated';
  by: string; // 'founder' or agent slug
  note: string;
}

export interface GoverningDocument {
  key: string;
  name: string;
  /** One sentence: why this document exists. */
  purpose: string;
  path: string;
  version: string;
  status: DocumentStatus;
  /** Single-threaded owner (agent slug or 'founder'). */
  owner: string;
  authority: AuthorityLevel;
  /** Registry key of the governing parent; null only for the Covenant (the
   *  root of the Aladiah Canon — Founder Constitutional Decision, 2026-07-02). */
  parent: string | null;
  /** Registry keys this document depends on (beyond its parent). */
  dependencies: string[];
  /** Department slugs bound by or consuming this document. */
  relatedDepartments: string[];
  /** AI agent slugs that operationally implement it (often = departments). */
  relatedAgents: string[];
  /** Registry keys of standards that apply to this document. */
  relatedStandards: string[];
  /** Routes/dashboards that display this document's state. */
  displayedOn: string[];
  /** Days between mandatory reviews. */
  reviewCadenceDays: number;
  lastReview: string; // YYYY-MM-DD
  nextReview: string; // YYYY-MM-DD
  ratified: { on: string; by: string } | null;
  /** Approval + change history, oldest first. */
  history: DocumentEvent[];
  /** Founding Library shelf number ('00'–'14') when this document has a shelf. */
  shelf: string | null;
}

/** Concise entry definition: required core + sensible empty defaults. */
type DocInput =
  Pick<GoverningDocument, 'key' | 'name' | 'purpose' | 'path' | 'version' | 'status' | 'owner' | 'authority' | 'parent' | 'lastReview' | 'nextReview'> &
  Partial<GoverningDocument>;

function doc(d: DocInput): GoverningDocument {
  return {
    dependencies: [],
    relatedDepartments: [],
    relatedAgents: [],
    relatedStandards: [],
    displayedOn: ['/founder'],
    reviewCadenceDays: d.status === 'ratified' ? 90 : 14,
    ratified: null,
    history: [],
    shelf: null,
    ...d,
  };
}

const CANON_RATIFIED: DocumentEvent = { on: '2026-06-21', kind: 'ratified', by: 'founder', note: 'Canon established (LAUNCH_DECISION_PRINCIPLE era).' };

export const GOVERNING_DOCUMENTS: GoverningDocument[] = [
  // ---- L1: Constitution ------------------------------------------------------
  doc({
    key: 'constitution',
    shelf: '02',
    name: 'The Aladiah Constitution',
    purpose: 'The founding document — single chain of authority for every department, agent, workflow, and feature.',
    path: 'docs/governance/constitution/constitution.md',
    version: '0.1',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'covenant', // the Constitution derives its authority from the Covenant (Founder Constitutional Decision, 2026-07-02)
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'v0.1 composed from the ratified canon.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-rooted under the Covenant per Founder Constitutional Decision.' },
    ],
  }),
  doc({
    key: 'ratification-process',
    name: 'Ratification Process',
    purpose: 'How documents gain and lose authority: Draft → Review → Ratified → Deprecated.',
    path: 'docs/governance/constitution/ratification.md',
    version: '0.1',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'founder', note: 'Lifecycle defined.' }],
  }),

  // ---- Ratified canon (the constitutional core) -------------------------------
  doc({
    key: 'launch-decision-principle',
    name: 'Launch Decision Principle (root operating principle)',
    purpose: 'Hypothesis ≠ fact: evidence creates truth, truth creates priorities, priorities create work.',
    path: 'docs/standards/LAUNCH_DECISION_PRINCIPLE.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    relatedDepartments: ['qa-authority'],
    relatedAgents: ['qa-authority'],
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
    history: [CANON_RATIFIED],
  }),
  doc({
    key: 'north-star',
    name: 'North Star',
    purpose: 'Why Aladiah exists: career transformation, not course completion. Orders what to build now.',
    path: 'docs/standards/NORTH_STAR.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
    history: [CANON_RATIFIED],
  }),
  doc({
    key: 'architecture-principle',
    name: 'Architecture Principle',
    purpose: 'What qualifies to be built: serve ≥1 Core System, block 0.',
    path: 'docs/standards/ARCHITECTURE_PRINCIPLE.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
    history: [CANON_RATIFIED],
  }),
  doc({
    key: 'competency-taxonomy',
    name: 'Competency Taxonomy',
    purpose: 'The only approved source of competency slugs — append-only, never renamed.',
    path: 'docs/standards/COMPETENCY_TAXONOMY.md',
    version: '1.0',
    status: 'ratified',
    owner: 'curriculum-excellence',
    authority: 'constitutional',
    parent: 'constitution',
    relatedDepartments: ['curriculum-excellence', 'product-builder', 'student-success'],
    relatedAgents: ['curriculum-excellence', 'product-builder'],
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
    history: [CANON_RATIFIED, { on: '2026-06-20', kind: 'amended', by: 'founder', note: 'V2 merged: PM/BA/DA registries (§6–§11), commit #55.' }],
  }),
  doc({
    key: 'competency-taxonomy-v2-rationale',
    name: 'Competency Taxonomy V2 (design rationale, merged into canon)',
    purpose: 'Design rationale + Program Outcome Definitions retained after the V2 merge; canon §6–§11 prevails.',
    path: 'docs/standards/COMPETENCY_TAXONOMY_V2_FINAL.md',
    version: '2.0',
    status: 'ratified',
    owner: 'curriculum-excellence',
    authority: 'informational',
    parent: 'competency-taxonomy',
    lastReview: '2026-07-01',
    nextReview: '2026-10-01',
    ratified: { on: '2026-06-20', by: 'founder' },
    history: [{ on: '2026-06-20', kind: 'ratified', by: 'founder', note: 'Ratified-as-merged (commit #55).' }],
  }),
  doc({
    key: 'qa-standard',
    name: 'QA Standard',
    purpose: 'DoR/DoD evidence gates feeding blocker classification.',
    path: 'docs/standards/QA_STANDARD.md',
    version: '1.0',
    status: 'ratified',
    owner: 'qa-authority',
    authority: 'canonical',
    parent: 'launch-decision-principle',
    relatedDepartments: ['qa-authority'],
    relatedAgents: ['qa-authority'],
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
    history: [CANON_RATIFIED],
  }),
  doc({
    key: 'founder-standards',
    shelf: '03',
    name: 'Founder Standards',
    purpose: 'The operational interpretation of the Constitution — how every decision is made. STRUCTURE ONLY until the founder authors it.',
    path: 'docs/governance/standards/founder-standards.md',
    version: '0.0',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    dependencies: ['covenant', 'launch-decision-principle', 'ratification-process'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'founder', note: 'Structural scaffold reserved — content is founder-authored, never invented.' }],
  }),
  doc({
    key: 'flagship-production-doctrine',
    name: 'Flagship Production Doctrine',
    purpose: 'Founder doctrine (FD-2026-017): one flagship program at a time in the fixed five-program order; each completed flagship becomes the institutional benchmark; capabilities inherit and compound — never lowered; the Platform evolves through flagships.',
    path: 'docs/governance/standards/flagship-production-doctrine.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'north-star', // orders the program portfolio that NORTH_STAR's career transformation is delivered through
    dependencies: ['qa-standard'], // completion is judged by the ratified gates, never redefined here
    relatedDepartments: ['curriculum-excellence'],
    relatedAgents: ['curriculum-excellence'],
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Issued verbatim in the founder session of record; number FD-2026-017 assigned by sequence (directive arrived unnumbered).' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Founder doctrine carries authority on issuance. Production order: Scrum Master → Business Analyst → Project Manager → Data Analyst → Cybersecurity.' },
    ],
  }),

  // ---- Architecture (L3–L5) ---------------------------------------------------
  doc({
    key: 'enterprise-architecture',
    shelf: '05',
    name: 'Enterprise Architecture',
    purpose: 'The whole-system view: layers, constraints, departments, dependencies, declared debts.',
    path: 'docs/governance/architecture/enterprise-architecture.md',
    version: '0.1',
    status: 'draft',
    owner: 'operations-platform',
    authority: 'canonical',
    parent: 'organizational-charter', // spine: Organizational Charter → Enterprise Architecture
    dependencies: ['architecture-principle'],
    relatedDepartments: ['operations-platform'],
    relatedAgents: ['operations-platform'],
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'operations-platform', note: 'v0.1 from verified repo facts.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented into the constitutional spine; Architecture Principle retained as dependency.' },
    ],
  }),
  doc({
    key: 'intelligence-architecture',
    shelf: '06',
    name: 'Intelligence Architecture',
    purpose: 'The ten-component intelligence layer: sources, evidence gates, confidence, approval chains.',
    path: 'docs/governance/architecture/intelligence-architecture.md',
    version: '1.0',
    status: 'review',
    owner: 'analytics-intelligence',
    authority: 'canonical',
    parent: 'enterprise-architecture', // spine: Enterprise Architecture → Intelligence Architecture
    dependencies: ['launch-decision-principle', 'agent-operating-system'],
    relatedDepartments: ['analytics-intelligence'],
    relatedAgents: ['analytics-intelligence', 'operations-platform', 'interface-experience'],
    relatedStandards: ['qa-standard'],
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'analytics-intelligence', note: 'v1 implemented + tested.' },
      { on: '2026-07-01', kind: 'migrated', by: 'founder', note: 'Moved into docs/governance/architecture/.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented into the constitutional spine; AOS canon retained as dependency.' },
    ],
  }),
  doc({
    key: 'aladiah-operating-system',
    shelf: '07',
    name: 'The Aladiah Operating System (AIOS v1.0 design)',
    purpose: 'The seven-level operating system design: authority down, evidence up, 60-second cockpit.',
    path: 'docs/governance/architecture/ALADIAH_OPERATING_SYSTEM.md',
    version: '1.0',
    status: 'draft',
    owner: 'founder',
    authority: 'canonical',
    parent: 'intelligence-architecture', // spine: Intelligence Architecture → AIOS
    dependencies: ['enterprise-architecture', 'agent-operating-system'],
    displayedOn: ['/founder'],
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'Phase-5 design blueprint (no code).' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented into the constitutional spine.' },
    ],
  }),
  doc({
    key: 'agent-operating-system',
    name: 'Agent Operating System (AI Workforce Manual)',
    purpose: 'The infrastructure canon every agent plugs into — and the operating manual for the AI workforce.',
    path: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
    version: '1.2',
    status: 'ratified',
    owner: 'operations-platform',
    authority: 'canonical',
    parent: 'constitution',
    relatedDepartments: ['operations-platform'],
    relatedAgents: [
      'ceo-chief-of-staff', 'marketing-content', 'seo-strategy', 'product-builder', 'qa-authority',
      'admissions-authority', 'student-success', 'placement-authority', 'analytics-intelligence',
      'operations-platform', 'curriculum-excellence', 'interface-experience',
    ],
    displayedOn: ['/founder', '/admin/agent-os', '/admin/ai-workforce'],
    lastReview: '2026-07-01',
    nextReview: '2026-10-01',
    ratified: { on: '2026-06-10', by: 'founder' },
    history: [
      { on: '2026-06-10', kind: 'ratified', by: 'founder', note: 'AOS canon established with migration 20260610130000.' },
      { on: '2026-07-01', kind: 'amended', by: 'founder', note: 'Subsystems 9–12 documented (work orders, orchestration, brain, event bus).' },
    ],
  }),
  doc({
    key: 'continuous-improvement',
    name: 'Continuous Improvement Doctrine',
    purpose: 'Every department as an always-observing intelligence unit; the operating loop.',
    path: 'docs/agents/CONTINUOUS_IMPROVEMENT.md',
    version: '1.0',
    status: 'review',
    owner: 'analytics-intelligence',
    authority: 'operational',
    parent: 'agent-operating-system',
    dependencies: ['intelligence-architecture'],
    relatedAgents: ['analytics-intelligence'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'analytics-intelligence', note: 'Doctrine + honesty constraints.' }],
  }),

  // ---- L6 charters & manuals ---------------------------------------------------
  doc({
    key: 'department-charters',
    shelf: '08',
    name: 'Department Charters (index)',
    purpose: 'The 12 department charters (AGENT_SPECs) + 2 personas — who does what, under whose authority.',
    path: 'docs/governance/departments/README.md',
    version: '1.0',
    status: 'review',
    owner: 'founder',
    authority: 'operational',
    parent: 'aladiah-operating-system', // spine: AIOS → Department Charters
    dependencies: ['agent-operating-system'],
    relatedAgents: [
      'ceo-chief-of-staff', 'marketing-content', 'seo-strategy', 'product-builder', 'qa-authority',
      'admissions-authority', 'student-success', 'placement-authority', 'analytics-intelligence',
      'operations-platform', 'curriculum-excellence', 'interface-experience',
    ],
    lastReview: '2026-07-02',
    nextReview: '2026-10-01',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: '12/12 specs verified by drift check.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented into the constitutional spine.' },
    ],
  }),
  doc({
    key: 'founder-validation-manual',
    name: 'Founder Validation Manual',
    purpose: 'The consolidated doctrine for founder walks: verify-after-write, BLK logging, explicit Go/No-Go.',
    path: 'docs/governance/manuals/FOUNDER_VALIDATION_MANUAL.md',
    version: '0.1',
    status: 'draft',
    owner: 'founder',
    authority: 'operational',
    parent: 'launch-decision-principle',
    relatedStandards: ['qa-standard'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'founder', note: 'Consolidates runbook + playbook; walks migrated intact.' }],
  }),
  doc({
    key: 'launch-command-center',
    name: 'Launch Command Center (blocker registry)',
    purpose: 'The permanent, evidence-closed registry of what blocks launch.',
    path: 'docs/governance/manuals/LAUNCH_COMMAND_CENTER.md',
    version: '1.0',
    status: 'ratified',
    owner: 'qa-authority',
    authority: 'operational',
    parent: 'launch-decision-principle',
    relatedDepartments: ['qa-authority'],
    relatedAgents: ['qa-authority'],
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
    history: [
      { on: '2026-06-21', kind: 'ratified', by: 'founder', note: 'Named operational registry by the root principle.' },
      { on: '2026-07-01', kind: 'migrated', by: 'founder', note: 'Moved from repo root into governance/manuals/.' },
    ],
  }),

  // ---- Framework slots scaffolded, never invented -------------------------------
  doc({
    key: 'academic-canon',
    shelf: '10',
    name: 'Academic Canon (index)',
    purpose: 'The academic governance set: curriculum framework, program standards, validation gates.',
    path: 'docs/governance/academic/README.md',
    version: '0.1',
    status: 'draft',
    owner: 'curriculum-excellence',
    authority: 'canonical',
    parent: 'north-star',
    dependencies: ['competency-taxonomy'],
    relatedDepartments: ['curriculum-excellence', 'product-builder', 'qa-authority'],
    relatedAgents: ['curriculum-excellence'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'curriculum-excellence', note: 'Index of existing academic governance; no content invented.' }],
  }),
  doc({
    key: 'avis-design-bible',
    shelf: '11',
    name: 'AVIS Design Bible (scaffold)',
    purpose: 'The visual-experience authority: tokens, hierarchy, accessibility, premium consistency.',
    path: 'docs/governance/design/avis-design-bible.md',
    version: '0.1',
    status: 'draft',
    owner: 'interface-experience',
    authority: 'canonical',
    parent: 'constitution',
    relatedDepartments: ['interface-experience'],
    relatedAgents: ['interface-experience'],
    displayedOn: ['/founder', '/admin/interface-agent'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'interface-experience', note: 'Scaffold indexing the live token system + UX posture; content pending.' }],
  }),
  doc({
    key: 'research-institute-handbook',
    shelf: '12',
    name: 'Research Institute Handbook (scaffold)',
    purpose: 'Governance for external research and market intelligence — sources, approval, attribution.',
    path: 'docs/governance/research/README.md',
    version: '0.1',
    status: 'draft',
    owner: 'analytics-intelligence',
    authority: 'operational',
    parent: 'intelligence-architecture',
    relatedAgents: ['analytics-intelligence'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'analytics-intelligence', note: 'Scaffold — external ingestion is NOT CONNECTED; handbook precedes the integration.' }],
  }),
  doc({
    key: 'brand-media-bible',
    shelf: '13',
    name: 'Brand & Media Bible (scaffold)',
    purpose: 'Brand authority: story canon, asset inventory, voice, media standards.',
    path: 'docs/governance/brand/README.md',
    version: '0.1',
    status: 'draft',
    owner: 'marketing-content',
    authority: 'operational',
    parent: 'north-star',
    relatedDepartments: ['marketing-content'],
    relatedAgents: ['marketing-content'],
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'marketing-content', note: 'Scaffold indexing FOUNDER_STORY_CANON + brand assets; content pending.' }],
  }),

  doc({
    key: 'capability-genome-standard',
    name: 'Capability Genome Standard',
    purpose: 'The canonical 35-locus permanent identity of every institutional capability — lineage, canonical references, computed truth, lifecycle; no capability exists without a genome.',
    path: 'docs/governance/standards/capability-genome-standard.md',
    version: '2.0',
    status: 'ratified', // FOUNDER DECISION 2026-07-02: adopted into the Aladiah Canon
    owner: 'founder',
    authority: 'constitutional',
    parent: 'founder-standards',
    dependencies: ['launch-decision-principle', 'architecture-principle'],
    relatedDepartments: ['operations-platform', 'analytics-intelligence'],
    relatedAgents: ['operations-platform'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'v1.0 designed on founder commission as the foundation of the Institutional Registry.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'v2.0 per FD-2026-004: Amendments I–VI (Lineage, Canonical References, Computed Truth, Lifecycle, Identity, Registry Conformance). Ratification package delivered; sent to review.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'FOUNDER DECISION: adopted as the official constitutional specification for institutional capability; part of the Aladiah Canon. Registry engineering authorized.' },
    ],
  }),

  doc({
    key: 'permanent-engineering-mission',
    name: 'Permanent Engineering Mission (v1.0)',
    purpose: 'Founder-issued standing doctrine governing all engineering activity: the engineering cycle, quality/knowledge/measurement principles, founder authority, self-improvement duty; v1.1 adds the Phase-I doctrine and the Five Questions.',
    path: 'docs/governance/manuals/PERMANENT_ENGINEERING_MISSION.md',
    version: '1.1',
    status: 'ratified', // founder-issued in force ("until amended by the Founder")
    owner: 'founder',
    authority: 'canonical',
    parent: 'founder-standards',
    dependencies: ['launch-decision-principle', 'capability-genome-standard'],
    relatedDepartments: ['operations-platform'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Issued verbatim; supersedes individual engineering prompts.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'In force on issuance until amended by the Founder.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'v1.1 on Phase I completion: Founder Doctrine (implementation over expansion; simplicity is a constitutional value) + the Engineering Law (the Five Questions every work order must answer).' },
    ],
  }),

  doc({
    key: 'ams-framework',
    name: 'Aladiah Management System — Framework',
    purpose: 'The operating system by which the Institution is managed for decades: the universal manual template, governance/versioning/ownership/review/approval rules, and the bindings to genomes, Brain, KPIs, dashboards, and the AI workforce.',
    path: 'docs/governance/management-system/FRAMEWORK.md',
    version: '1.1',
    status: 'ratified', // FD-2026-010: AMS v1.0 adopted; the Permanent Management Rule (8-step lifecycle) is canon
    owner: 'founder',
    authority: 'canonical',
    parent: 'department-charters', // the Operational Policies tier of the spine
    dependencies: ['capability-genome-standard', 'ratification-process', 'permanent-engineering-mission'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Framework designed per FD-2026-009.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'FD-2026-010 Permanent Management Rule: the 8-step manual lifecycle (Draft → Engineering Review → QA Review → Company Brain Review → Founder Review → Ratification → Publication → Continuous Improvement) supersedes §8; no manual may bypass it.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'FD-2026-010: M01 adopted as AMS v1.0 — the framework it demonstrates carries founder authority.' },
    ],
  }),
  doc({
    key: 'ams-manual-catalog',
    name: 'AMS Manual Catalog (M01–M20)',
    purpose: 'The twenty permanent manuals: accession numbers, owners, scopes, evidence grounding, sequencing. Design only — no manual is written.',
    path: 'docs/governance/management-system/MANUAL_CATALOG.md',
    version: '1.0',
    status: 'review',
    owner: 'founder',
    authority: 'canonical',
    parent: 'ams-framework',
    lastReview: '2026-07-02',
    nextReview: '2026-07-16',
    history: [{ on: '2026-07-02', kind: 'created', by: 'founder', note: 'Catalog designed per FD-2026-009.' }],
  }),

  doc({
    key: 'm01-executive-office',
    name: 'M01 — Executive Office Manual',
    purpose: 'The operational blueprint for the Executive Office and the Gold Standard structure every Management Manual inherits: directives, decisions, ratifications, briefings, escalations, walks, continuity.',
    path: 'docs/governance/management-system/manuals/M01-executive-office.md',
    version: '1.0',
    status: 'ratified', // FD-2026-010: adopted as Version 1.0 of the Aladiah Management System
    owner: 'founder',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['permanent-engineering-mission', 'capability-genome-standard', 'ratification-process'],
    relatedDepartments: ['ceo-chief-of-staff', 'qa-authority'],
    relatedAgents: ['ceo-chief-of-staff'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Authored under WO-0001 per the AMS Framework Universal Template; QA structural conformance complete.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'FD-2026-010: adopted as AMS v1.0; its structure is the standard template for every future Management Manual unless amended by Founder Directive.' },
    ],
  }),

  doc({
    key: 'm02-governance-operations',
    name: 'M02 — Governance Operations Manual',
    purpose: 'How governance is executed throughout the Institution: document/policy/standard lifecycles, directives, work orders, engineering decisions, amendments, escalations, audits.',
    path: 'docs/governance/management-system/manuals/M02-governance-operations.md',
    version: '1.0',
    status: 'ratified', // FD-2026-011: adopted; governance principles are binding institutional practice
    owner: 'founder',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['m01-executive-office', 'ratification-process', 'capability-genome-standard'],
    relatedDepartments: ['operations-platform', 'analytics-intelligence', 'qa-authority'],
    relatedAgents: ['operations-platform'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Authored under WO-0002 to the M01 gold-standard template; Permanent Rule steps 1–4 recorded in the manual.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'FD-2026-011: adopted into the AMS; its governance principles become binding institutional practice.' },
    ],
  }),

  doc({
    key: 'book-of-knowledge',
    name: 'The Aladiah Book of Knowledge',
    purpose: 'The permanent library of institutional knowledge: five Books shelving all governed doctrine, and the permanent learning loop (Books → Manuals → Standards → Procedures → Work Orders → Evidence → Brain → improved Standards).',
    path: 'docs/governance/book-of-knowledge/README.md',
    version: '1.0',
    status: 'ratified', // established by FD-2026-011 on issuance
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution', // hierarchy: Founder → Constitution → Book of Knowledge → Management System
    dependencies: ['founding-library', 'ams-framework'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Established by FD-2026-011: five Books, the organizing law, the operating hierarchy.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Founder-established on issuance; organizing view only — no files move, nothing duplicated.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'FD-2026-012 constitutional clarification: spine NOT amended; Covenant supreme; permanent WHY/WHAT/WHAT-IS-KNOWN/HOW/HOW-TO-IMPROVE definitions; the four instruments never merge.' },
    ],
  }),

  doc({
    key: 'm03-registry-genome-operations',
    name: 'M03 — Institutional Registry & Capability Genome Operations Manual',
    purpose: 'How every institutional asset is registered, versioned, governed, traced, and retired — the operating procedures of the constitutional catalog.',
    path: 'docs/governance/management-system/manuals/M03-registry-genome-operations.md',
    version: '1.0',
    status: 'ratified', // FD-2026-012: adopted; registry + capability management standards binding
    owner: 'operations-platform',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['m02-governance-operations', 'capability-genome-standard'],
    relatedDepartments: ['operations-platform', 'analytics-intelligence', 'qa-authority'],
    relatedAgents: ['operations-platform'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'operations-platform', note: 'Authored under WO-0003 to the M01 gold-standard template; Permanent Rule steps 1–4 recorded.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'FD-2026-012: adopted into the AMS; governance, registry, and capability management standards binding.' },
    ],
  }),

  doc({
    key: 'm04-company-brain',
    name: 'M04 — Company Brain & Institutional Knowledge Management Manual',
    purpose: 'How the Institution remembers, validates, retrieves, and learns: the Remember Invariant, knowledge/learning lifecycles, AI learning rules, evidence management, Brain governance.',
    path: 'docs/governance/management-system/manuals/M04-company-brain.md',
    version: '1.0',
    status: 'ratified', // Founder decision: adopted; Phase I constitutional foundation complete
    owner: 'analytics-intelligence',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['m03-registry-genome-operations', 'launch-decision-principle'],
    relatedDepartments: ['analytics-intelligence', 'operations-platform'],
    relatedAgents: ['analytics-intelligence'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'analytics-intelligence', note: 'Authored under WO-0004; the Brain reviewed its own manual (step 4).' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Adopted into the AMS. With M04, the Founder declares PHASE I COMPLETE: Covenant, Constitution, Book of Knowledge, Management System, Registry, Company Brain — the permanent constitutional foundation. Future work extends; it does not redesign.' },
    ],
  }),

  doc({
    key: 'm05-ai-workforce-management',
    name: 'M05 — AI Workforce Management Manual',
    purpose: 'The governance of every AI employee, specialist, department, executive function, and future autonomous workforce: hiring, charter, operation, performance, learning, discipline, retirement.',
    path: 'docs/governance/management-system/manuals/M05-ai-workforce-management.md',
    version: '1.1',
    status: 'ratified', // FD-2026-014: binding doctrine; v1.1 adds the founder's Employee/Equality/Autonomy doctrine verbatim
    owner: 'operations-platform',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['m04-company-brain', 'agent-operating-system', 'founder-reserved-powers'],
    relatedDepartments: ['operations-platform', 'ceo-chief-of-staff', 'qa-authority'],
    relatedAgents: ['operations-platform', 'ceo-chief-of-staff'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'operations-platform', note: 'Authored under WO-0005 — the first work order to answer the Five Questions.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'FD-2026-014: adopted as binding institutional doctrine.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'v1.1: the Employee Principle, the Institutional Equality Principle, and the Autonomy Doctrine appended verbatim (FD-2026-014).' },
    ],
  }),

  doc({
    key: 'm06-institutional-intelligence',
    name: 'M06 — Institutional Intelligence & Decision Support Manual',
    purpose: 'How the Institution knows, warns, forecasts, and supports decisions: dashboards, the KPI framework, reporting, early warnings, analytics, AI decision assistants, the strategic review.',
    path: 'docs/governance/management-system/manuals/M06-institutional-intelligence.md',
    version: '1.0',
    status: 'ratified', // Master Operating Order (Phase II): ratified; proceed to execution
    owner: 'analytics-intelligence',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['m05-ai-workforce-management', 'intelligence-architecture', 'launch-decision-principle'],
    relatedDepartments: ['analytics-intelligence', 'ceo-chief-of-staff', 'operations-platform'],
    relatedAgents: ['analytics-intelligence', 'ceo-chief-of-staff'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'analytics-intelligence', note: 'Authored under WO-0006 (Five Questions answered §0).' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Master Operating Order (Phase II Execution Campaign): ratified; the Institution proceeds to execution.' },
    ],
  }),

  doc({
    key: 'm07-work-order-execution',
    name: 'M07 — Work Order & Execution Management Manual',
    purpose: 'The one governed road for institutional change: opened with purpose, gated by evidence, decided by authority, measured by outcome, remembered forever.',
    path: 'docs/governance/management-system/manuals/M07-work-order-execution.md',
    version: '1.0',
    status: 'ratified', // Founder decision: ratified in principle; published via PR #103
    owner: 'ceo-chief-of-staff',
    authority: 'operational',
    parent: 'ams-framework',
    dependencies: ['m06-institutional-intelligence', 'm01-executive-office'],
    relatedDepartments: ['ceo-chief-of-staff', 'qa-authority', 'interface-experience'],
    relatedAgents: ['ceo-chief-of-staff'],
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'ceo-chief-of-staff', note: 'Authored under WO-0007; self-referential: the manual governs the instrument that produced it.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Ratified in principle; published (PR #103). AVIS elevated to foundational institutional capability in the same decision; WO-0008 issued.' },
    ],
  }),

  doc({
    key: 'avis-blueprint',
    name: 'AVIS — Complete Engineering Blueprint (Institutional Visual Intelligence Platform)',
    purpose: 'The constitutional foundation for Visual Intelligence: architecture, engine, visual Brain, asset registry, standards (quality/prompt/accessibility/brand/signature), taxonomies, frameworks, and the design-only integration/security/cost models.',
    path: 'docs/engineering/avis/BLUEPRINT.md',
    version: '1.0',
    status: 'ratified', // Founder Approved: adopted as AVIS v1.0; renderer abstraction is permanent institutional architecture
    owner: 'interface-experience',
    authority: 'canonical',
    parent: 'avis-design-bible',
    dependencies: ['capability-genome-standard', 'm03-registry-genome-operations', 'launch-decision-principle'],
    relatedDepartments: ['interface-experience', 'curriculum-excellence', 'marketing-content'],
    relatedAgents: ['interface-experience'],
    lastReview: '2026-07-02',
    nextReview: '2026-07-16',
    reviewCadenceDays: 90,
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'interface-experience', note: 'WO-0008: all 20 blueprint sections; design only.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'FD-2026-016: the Institutional Visual Intelligence Platform; Open-Gen-AI primary renderer — executes standards, never defines them.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Adopted as AVIS v1.0; the renderer abstraction is PERMANENT institutional architecture — the Institution shall never depend upon a single rendering provider. Five-step implementation approved.' },
    ],
  }),

  doc({
    key: 'avis-integration-architecture',
    name: 'AVIS — Open-Gen-AI Integration Architecture',
    purpose: 'The fifteen-section integration design (FD-2026-016): server-side rendering behind ai-proxy patterns, prompt compilation from governed specs, storage, metadata, gates, budgets, rate limits, and the renderer adapter seam — the renderer executes standards, never defines them.',
    path: 'docs/engineering/avis/INTEGRATION_ARCHITECTURE.md',
    version: '1.0',
    status: 'ratified', // Founder Approved: adopted as AVIS v1.0; renderer abstraction is permanent institutional architecture
    owner: 'interface-experience',
    authority: 'canonical',
    parent: 'avis-blueprint',
    dependencies: ['avis-blueprint', 'capability-genome-standard'],
    relatedDepartments: ['interface-experience', 'marketing-content', 'curriculum-excellence', 'operations-platform'],
    relatedAgents: ['interface-experience'],
    lastReview: '2026-07-02',
    nextReview: '2026-07-16',
    reviewCadenceDays: 90,
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'interface-experience', note: 'FD-2026-016: all fifteen sections; design only.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Approved; OpenAI is the first approved renderer; future renderers implement the same interface; implementation proceeds through work orders in the approved five-step order.' },
    ],
  }),

  // ---- The Founding Library (Directive 003) -----------------------------------
  doc({
    key: 'founder-reserved-powers',
    name: "The Founder's Reserved Powers",
    purpose: 'The nine powers permanently reserved to the Founder while living — never delegated to AI, never inferred, never assumed. Informs the Constitution and the Organizational Charter.',
    path: 'docs/governance/constitution/founder-reserved-powers.md',
    version: '1.0',
    status: 'ratified', // founder-authored doctrine, constitutional authority on issuance (FD-2026-014)
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    reviewCadenceDays: 90,
    lastReview: '2026-07-02',
    nextReview: '2026-10-02',
    ratified: { on: '2026-07-02', by: 'founder' },
    history: [
      { on: '2026-07-02', kind: 'created', by: 'founder', note: 'Issued verbatim in FD-2026-014.' },
      { on: '2026-07-02', kind: 'ratified', by: 'founder', note: 'Constitutional authority on issuance; boundary no delegation may cross.' },
    ],
  }),
  doc({
    key: 'founding-library',
    name: 'The Aladiah Founding Library (catalog)',
    purpose: 'The permanent institutional archive: fifteen numbered shelves holding ratified text or pointing to working drafts; the accession policy.',
    path: 'docs/governance/founding-library/README.md',
    version: '1.0',
    status: 'review',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'Established by Founder Executive Directive 003.' },
      { on: '2026-07-01', kind: 'approved', by: 'founder', note: 'Architecture APPROVED and FROZEN. Tagged constitutional-baseline-v1.0. Structural changes are henceforth constitutional acts. Authoring begins: Volume 0 (Covenant), founder-authored only.' },
    ],
  }),
  doc({
    key: 'covenant',
    shelf: '00',
    name: 'The Aladiah Covenant',
    purpose: 'Defines the spirit and purpose of Aladiah — the principles every decision shall honor, beyond any individual, technology, or generation.',
    path: 'docs/governance/founding-library/00-covenant.md',
    version: '1.0',
    status: 'review', // Founder Approved Draft v1.0 — pending Founder Signature
    owner: 'founder',
    authority: 'foundational',
    parent: null, // THE ROOT of the Aladiah Canon (Founder Constitutional Decision, 2026-07-02)
    lastReview: '2026-07-02',
    nextReview: '2026-07-16',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'Shelf 00 established; content reserved (Directive 003).' },
      { on: '2026-07-02', kind: 'approved', by: 'founder', note: 'Founder-authored Covenant v1.0 placed verbatim; approved as Founder Approved Draft (Directive 004). Ratification: pending Founder Signature.' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Founder Constitutional Decision: the Covenant is the ROOT of the Aladiah Canon; the Constitution derives its authority from it.' },
    ],
  }),
  doc({
    key: 'declaration',
    shelf: '01',
    name: 'The Declaration (reserved)',
    purpose: 'Reserved for the declaration of founding — why Aladiah exists as an institution. Founder-authored only.',
    path: 'docs/governance/founding-library/01-declaration.md',
    version: '0.0',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'covenant', // the Declaration stands directly under the root of purpose
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'Shelf 01 established; content reserved (Directive 003).' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented under the Covenant (root).' },
    ],
  }),
  doc({
    key: 'organizational-charter',
    shelf: '04',
    name: 'Organizational Charter (reserved)',
    purpose: 'Reserved for the legal/organizational structure: entities, roles, succession, signatory authority. Founder-authored only.',
    path: 'docs/governance/founding-library/04-organizational-charter.md',
    version: '0.0',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'founder-standards', // spine: Founder Standards → Organizational Charter (Founder Constitutional Decision)
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'Shelf 04 established; content reserved (Directive 003).' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented under Founder Standards per the constitutional spine.' },
    ],
  }),
  doc({
    key: 'faculty-handbook',
    shelf: '09',
    name: 'Faculty Handbook (reserved)',
    purpose: 'Reserved for how AI faculty and human staff operate together: conduct, duties, escalation, review. Distinct from the AI Workforce Manual (infrastructure).',
    path: 'docs/governance/founding-library/09-faculty-handbook.md',
    version: '0.0',
    status: 'draft',
    owner: 'founder',
    authority: 'operational',
    parent: 'department-charters', // spine: Department Charters → Operational Policies
    dependencies: ['agent-operating-system'],
    lastReview: '2026-07-02',
    nextReview: '2026-07-15',
    history: [
      { on: '2026-07-01', kind: 'created', by: 'founder', note: 'Shelf 09 established; content reserved (Directive 003).' },
      { on: '2026-07-02', kind: 'amended', by: 'founder', note: 'Re-parented into the constitutional spine (operational-policy tier).' },
    ],
  }),
  doc({
    key: 'founder-operating-manual',
    shelf: '14',
    name: 'Founder Operating Manual (reserved)',
    purpose: 'Reserved for how the founder personally operates the institution: cadences, walks, decision sessions, delegation boundaries. Founder-authored only.',
    path: 'docs/governance/founding-library/14-founder-operating-manual.md',
    version: '0.0',
    status: 'draft',
    owner: 'founder',
    authority: 'operational',
    parent: 'founder-standards',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    history: [{ on: '2026-07-01', kind: 'created', by: 'founder', note: 'Shelf 14 established; content reserved (Directive 003).' }],
  }),
];

// =============================================================================
// The Founding Library — the permanent shelf catalog (Directive 003).
// Shelf files carry institutional metadata + placeholders; working drafts
// prevail until ratification enshrines their text into the shelf.
// =============================================================================
export interface LibraryShelf {
  shelf: string; // '00'–'14'
  file: string;  // the shelf document in founding-library/
  registryKey: string;
}

export const FOUNDING_LIBRARY: LibraryShelf[] = [
  { shelf: '00', file: 'docs/governance/founding-library/00-covenant.md', registryKey: 'covenant' },
  { shelf: '01', file: 'docs/governance/founding-library/01-declaration.md', registryKey: 'declaration' },
  { shelf: '02', file: 'docs/governance/founding-library/02-constitution.md', registryKey: 'constitution' },
  { shelf: '03', file: 'docs/governance/founding-library/03-founder-standards.md', registryKey: 'founder-standards' },
  { shelf: '04', file: 'docs/governance/founding-library/04-organizational-charter.md', registryKey: 'organizational-charter' },
  { shelf: '05', file: 'docs/governance/founding-library/05-enterprise-architecture.md', registryKey: 'enterprise-architecture' },
  { shelf: '06', file: 'docs/governance/founding-library/06-intelligence-architecture.md', registryKey: 'intelligence-architecture' },
  { shelf: '07', file: 'docs/governance/founding-library/07-aios.md', registryKey: 'aladiah-operating-system' },
  { shelf: '08', file: 'docs/governance/founding-library/08-department-charters.md', registryKey: 'department-charters' },
  { shelf: '09', file: 'docs/governance/founding-library/09-faculty-handbook.md', registryKey: 'faculty-handbook' },
  { shelf: '10', file: 'docs/governance/founding-library/10-academic-canon.md', registryKey: 'academic-canon' },
  { shelf: '11', file: 'docs/governance/founding-library/11-avis-design-bible.md', registryKey: 'avis-design-bible' },
  { shelf: '12', file: 'docs/governance/founding-library/12-research-institute-handbook.md', registryKey: 'research-institute-handbook' },
  { shelf: '13', file: 'docs/governance/founding-library/13-brand-media-bible.md', registryKey: 'brand-media-bible' },
  { shelf: '14', file: 'docs/governance/founding-library/14-founder-operating-manual.md', registryKey: 'founder-operating-manual' },
];

/** One shelf's dashboard row: catalog + registry state joined. */
export interface LibraryStatus {
  shelf: string;
  file: string;
  doc: GoverningDocument;
  reviewDue: boolean;
}

/** The Founding Library data model for the (future) Governance Center. */
export function getFoundingLibrary(today = new Date()): LibraryStatus[] {
  return FOUNDING_LIBRARY.map((s) => {
    const d = getDocument(s.registryKey)!;
    return { shelf: s.shelf, file: s.file, doc: d, reviewDue: isReviewDue(d, today) };
  });
}

/** Everything currently waiting on the founder, across the library. */
export interface PendingFounderAction {
  kind: 'ratify' | 'review-due' | 'author' | 'affirm-amendment';
  documentKey: string;
  shelf: string | null;
  detail: string;
}

export function getPendingFounderActions(today = new Date()): PendingFounderAction[] {
  const actions: PendingFounderAction[] = [];
  for (const d of GOVERNING_DOCUMENTS) {
    if (d.version === '0.0') {
      actions.push({ kind: 'author', documentKey: d.key, shelf: d.shelf, detail: `${d.name} is reserved and awaits founder authorship.` });
    } else if (d.status === 'draft' || d.status === 'review') {
      actions.push({ kind: 'ratify', documentKey: d.key, shelf: d.shelf, detail: `${d.name} (v${d.version}, ${d.status}) awaits founder ratification.` });
    }
    if (isReviewDue(d, today)) {
      actions.push({ kind: 'review-due', documentKey: d.key, shelf: d.shelf, detail: `${d.name} review is due (next: ${d.nextReview}).` });
    }
    const lastRatified = [...d.history].reverse().find((h) => h.kind === 'ratified');
    const amendedAfter = lastRatified && d.history.some((h) => h.kind === 'amended' && h.on > lastRatified.on);
    if (d.status === 'ratified' && amendedAfter) {
      actions.push({ kind: 'affirm-amendment', documentKey: d.key, shelf: d.shelf, detail: `${d.name} was amended after ratification — founder affirmation pending.` });
    }
  }
  return actions;
}

// =============================================================================
// Lookup + graph
// =============================================================================
export function getDocument(key: string): GoverningDocument | undefined {
  return GOVERNING_DOCUMENTS.find((d) => d.key === key);
}

/** Children derived from parent links — one edge list, no double bookkeeping. */
export function childrenOf(key: string): GoverningDocument[] {
  return GOVERNING_DOCUMENTS.filter((d) => d.parent === key);
}

/** The six questions every governing document must answer. */
export interface GovernanceNode {
  doc: GoverningDocument;
  governedBy: GoverningDocument | null;        // who governs me?
  governs: GoverningDocument[];                // what do I govern?
  dependents: GoverningDocument[];             // who depends on me?
  standardsApplying: GoverningDocument[];      // what standards apply?
  departmentsConsuming: string[];              // who consumes me?
  dashboardsDisplaying: string[];              // where am I visible?
}

export function getGovernanceNode(key: string): GovernanceNode | null {
  const d = getDocument(key);
  if (!d) return null;
  return {
    doc: d,
    governedBy: d.parent ? getDocument(d.parent) ?? null : null,
    governs: childrenOf(key),
    dependents: GOVERNING_DOCUMENTS.filter((x) => x.dependencies.includes(key)),
    standardsApplying: d.relatedStandards.map((k) => getDocument(k)).filter((x): x is GoverningDocument => !!x),
    departmentsConsuming: d.relatedDepartments,
    dashboardsDisplaying: d.displayedOn,
  };
}

// =============================================================================
// Health
// =============================================================================
/** A ratified document past nextReview is due — silence is not compliance. */
export function isReviewDue(docu: GoverningDocument, today = new Date()): boolean {
  return new Date(docu.nextReview).getTime() <= today.getTime();
}

export interface DocumentHealth {
  key: string;
  healthy: boolean;
  issues: string[];
}

/** Pure per-document health: lineage intact, schedule current, history coherent. */
export function getDocumentHealth(d: GoverningDocument, today = new Date()): DocumentHealth {
  const issues: string[] = [];
  if (d.parent && !getDocument(d.parent)) issues.push(`parent '${d.parent}' is not registered`);
  for (const dep of d.dependencies) if (!getDocument(dep)) issues.push(`dependency '${dep}' is not registered`);
  for (const std of d.relatedStandards) if (!getDocument(std)) issues.push(`standard '${std}' is not registered`);
  if (isReviewDue(d, today)) issues.push(`review overdue (next: ${d.nextReview})`);
  if (d.status === 'ratified' && !d.ratified) issues.push('ratified without a ratification record');
  if (d.status === 'ratified' && !d.history.some((h) => h.kind === 'ratified')) issues.push('ratified without a ratification history event');
  if (!d.purpose.trim()) issues.push('missing purpose');
  return { key: d.key, healthy: issues.length === 0, issues };
}

/** The framework slots every future standard plugs into. */
export const FRAMEWORK_SLOTS: { slot: string; registryKey: string }[] = [
  { slot: 'Constitution', registryKey: 'constitution' },
  { slot: 'Founder Standards', registryKey: 'founder-standards' },
  { slot: 'Enterprise Architecture', registryKey: 'enterprise-architecture' },
  { slot: 'Intelligence Architecture', registryKey: 'intelligence-architecture' },
  { slot: 'AIOS', registryKey: 'aladiah-operating-system' },
  { slot: 'Department Charters', registryKey: 'department-charters' },
  { slot: 'AI Workforce Manual', registryKey: 'agent-operating-system' },
  { slot: 'Academic Canon', registryKey: 'academic-canon' },
  { slot: 'AVIS Design Bible', registryKey: 'avis-design-bible' },
  { slot: 'Research Institute Handbook', registryKey: 'research-institute-handbook' },
  { slot: 'Brand & Media Bible', registryKey: 'brand-media-bible' },
];

export interface GovernanceHealth {
  /** 0–100: authority coverage × document health × review currency. */
  score: number;
  documents: DocumentHealth[];
  slots: { slot: string; registryKey: string; present: boolean; status: DocumentStatus | null }[];
  missingSlots: string[];
  reviewsDue: number;
  unhealthy: number;
}

/** The Governance Center data model: one call answers 'how governed are we?'. */
export function getGovernanceHealth(today = new Date()): GovernanceHealth {
  const documents = GOVERNING_DOCUMENTS.map((d) => getDocumentHealth(d, today));
  const slots = FRAMEWORK_SLOTS.map((s) => {
    const d = getDocument(s.registryKey);
    return { ...s, present: !!d, status: d?.status ?? null };
  });
  const missingSlots = slots.filter((s) => !s.present).map((s) => s.slot);
  const unhealthy = documents.filter((d) => !d.healthy).length;
  const reviewsDue = GOVERNING_DOCUMENTS.filter((d) => isReviewDue(d, today)).length;

  const slotCoverage = slots.filter((s) => s.present).length / slots.length;
  const docHealth = documents.length ? (documents.length - unhealthy) / documents.length : 1;
  const ratifiedShare =
    GOVERNING_DOCUMENTS.filter((d) => d.status === 'ratified').length / GOVERNING_DOCUMENTS.length;
  // Weighted: structure exists (40) · documents healthy (40) · authority ratified (20).
  const score = Math.round(slotCoverage * 40 + docHealth * 40 + ratifiedShare * 20);

  return { score, documents, slots, missingSlots, reviewsDue, unhealthy };
}

// =============================================================================
// Summary (cockpit) + Brain integration + records
// =============================================================================
export interface GovernanceSummary {
  total: number;
  byStatus: Record<DocumentStatus, number>;
  reviewsDue: number;
  headline: Pick<GoverningDocument, 'key' | 'name' | 'version' | 'status'>[];
}

/** What the cockpit shows: the headline four + registry totals. */
export function getGovernanceSummary(today = new Date()): GovernanceSummary {
  const byStatus = { draft: 0, review: 0, ratified: 0, deprecated: 0 } as Record<DocumentStatus, number>;
  for (const d of GOVERNING_DOCUMENTS) byStatus[d.status] += 1;
  const HEADLINE_KEYS = ['constitution', 'founder-standards', 'enterprise-architecture', 'intelligence-architecture'];
  return {
    total: GOVERNING_DOCUMENTS.length,
    byStatus,
    reviewsDue: GOVERNING_DOCUMENTS.filter((d) => isReviewDue(d, today)).length,
    headline: HEADLINE_KEYS.map((k) => getDocument(k)!).map((d) => ({
      key: d.key, name: d.name, version: d.version, status: d.status,
    })),
  };
}

/**
 * Mirror the registry into the Company Brain so institutional knowledge is
 * discoverable through recall() and survives model/technology/leadership
 * changes. Idempotent per document version — re-running never duplicates.
 */
export async function syncGovernanceToBrain(): Promise<{ synced: number; skipped: number }> {
  const existing = await listBrain('governance-record', 500);
  let synced = 0;
  let skipped = 0;
  for (const d of GOVERNING_DOCUMENTS) {
    const marker = `governance:doc:${d.key}:v${d.version}`;
    if (existing.some((e) => e.summary === marker)) {
      skipped += 1;
      continue;
    }
    const entry = await recordDecision({
      category: 'governance-record',
      content:
        `${d.name} (${d.key}) v${d.version} — ${d.status.toUpperCase()}, authority ${d.authority}, owner ${d.owner}. ` +
        `Purpose: ${d.purpose} Path: ${d.path}. Governed by: ${d.parent ?? 'root'}.` +
        (d.ratified ? ` Ratified ${d.ratified.on} by ${d.ratified.by}.` : ''),
      summary: marker,
      recordedBy: d.owner,
    });
    if (entry) synced += 1;
  }
  return { synced, skipped };
}

/**
 * Record a ratification decision in the Company Brain + Event Bus. The
 * registry itself changes via a reviewed commit (ratification.md rule 2) —
 * this records the founder's decision durably alongside it.
 */
export async function recordRatification(input: {
  documentKey: string;
  decision: 'ratified' | 'deprecated' | 'sent-to-review' | 'returned-to-draft';
  evidence: string;
  decidedBy?: string;
}): Promise<BrainEntry | null> {
  const d = getDocument(input.documentKey);
  const by = input.decidedBy ?? 'founder';
  const entry = await recordDecision({
    category: 'governance-record',
    content: `Governance: "${d?.name ?? input.documentKey}" ${input.decision} by ${by}. Evidence: ${input.evidence}`,
    summary: `governance:${input.decision}:${input.documentKey}`,
    recordedBy: by,
  });
  await emitEvent('brain.decision.recorded', by, `Governance: ${input.documentKey} ${input.decision}`, {
    document: input.documentKey,
    decision: input.decision,
  });
  return entry;
}
