// =============================================================================
// AVIS — the Enterprise Diagram Library (step 5, WO-0011).
// The Institution's own systems, specified once, governed forever
// (Blueprint §13): the ASCII diagrams in the governed documents ARE the
// specs — this library expresses them as VisualSpecifications that compile
// deterministically today and render when the edge function ships. Every
// spec cites its governing document; an amendment there flags its diagram
// stale (drift applied to imagery).
// =============================================================================
import { VisualSpecification } from './promptCompiler';

export interface EnterpriseDiagramSpec {
  spec: VisualSpecification;
  /** The governing document whose amendment stales this diagram. */
  governedBy: string;
}

const base = {
  audience: 'founder' as const,
  brandTokens: ['brand-primary', 'neutral-slate', 'risk-green', 'risk-amber', 'risk-red'] as VisualSpecification['brandTokens'],
  prohibitedElements: ['no elements absent from the governing document'],
};

export const ENTERPRISE_DIAGRAMS: EnterpriseDiagramSpec[] = [
  {
    governedBy: 'docs/governance/README.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:constitutional-spine',
      visualClass: 'architecture',
      purpose: 'One glance shows which text governs which text — the CI-enforced authority chain.',
      subject: 'The constitutional spine: Covenant → Constitution → Founder Standards → Organizational Charter → Enterprise Architecture → Intelligence Architecture → AIOS → Department Charters → Operational Policies → Implementation',
      requiredElements: ['the Covenant visually distinct as the root', 'ten ordered tiers', 'ratified canon attached at the Constitution tier'],
      altTextIntent: 'Ordered list of the ten authority tiers from Covenant to Implementation, noting the Covenant as root.',
    },
  },
  {
    governedBy: 'docs/governance/book-of-knowledge/README.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:operating-hierarchy',
      visualClass: 'architecture',
      purpose: 'The fourteen-level Permanent Authority of the Institution, as clarified by FD-2026-012.',
      subject: 'Founder → Founder Covenant → Founder Constitution → Book of Knowledge → Management System → Executive Office → Institutes → Departments → AI Workforce → Projects & Work Orders → Quality Assurance → Evidence → Company Brain → Continuous Improvement',
      requiredElements: ['fourteen ordered levels', 'the learning loop returning from Continuous Improvement upward'],
      altTextIntent: 'The fourteen operating levels in order, with the improvement loop returning to knowledge.',
    },
  },
  {
    governedBy: 'docs/governance/management-system/manuals/M07-work-order-execution.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:work-order-road',
      visualClass: 'process-flow',
      purpose: 'The one governed road for institutional change (M07 §3).',
      subject: 'Open (Five Questions) → Gates (QA, Security, Translation, UX) → Founder Decision (evidence-gated) → Execute (gated surfaces) → Complete → Measure Impact → Learn (Brain)',
      requiredElements: ['seven ordered stages', 'the founder decision step highlighted', 'evidence entering at the decision and measurement steps'],
      altTextIntent: 'Seven sequential stages of the work-order road with the founder decision emphasized.',
    },
  },
  {
    governedBy: 'docs/governance/architecture/intelligence-architecture.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:intelligence-loop',
      visualClass: 'process-flow',
      purpose: 'The continuous-intelligence operating loop (observers to recommendations to learning).',
      subject: 'Observers over live telemetry → evidence-gated findings → confidence with basis → deduplicated recommendations → governance pipeline → impact measurement → Company Brain → improved observation',
      requiredElements: ['the evidence gate visually distinct', 'the loop closing through the Brain'],
      altTextIntent: 'Circular flow from observation through evidence, recommendation, governance, measurement, memory, and back.',
    },
  },
  {
    governedBy: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:aos-architecture',
      visualClass: 'architecture',
      purpose: 'The AOS: seventeen subsystems every agent plugs into — no parallel systems.',
      subject: 'The Aladiah Operating System: registry, memory, tasks, orchestrator, logs, permissions, health, communication, work orders, orchestration, brain, event bus, intelligence, governance, genome, institutional registry, AVIS — over aos_* tables, under admin RLS',
      requiredElements: ['subsystems grouped by function', 'the shared-infrastructure boundary explicit'],
      altTextIntent: 'The seventeen AOS subsystems grouped by function over shared governed storage.',
    },
  },
  {
    governedBy: 'docs/governance/book-of-knowledge/README.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:learning-loop',
      visualClass: 'process-flow',
      purpose: 'The permanent institutional learning loop (FD-2026-011, the organizing law).',
      subject: 'Books contain Manuals → Manuals contain Standards → Standards contain Procedures → Procedures generate Work Orders → Work Orders produce Evidence → Evidence updates the Company Brain → the Brain improves future Standards',
      requiredElements: ['seven stages closing into a loop', 'doctrine flowing down, evidence flowing up'],
      altTextIntent: 'The seven-stage loop from Books through Evidence and the Brain back to Standards.',
    },
  },
  {
    governedBy: 'docs/governance/standards/capability-genome-standard.md',
    spec: {
      ...base,
      specId: 'spec:enterprise:genome-pipeline',
      visualClass: 'process-flow',
      purpose: 'How a capability comes to exist: the genome pipeline (M03 §3).',
      subject: 'Discover → Classify (evidence) → Genome (35 loci, validated V1–V12) → Register (reviewed commit) → Operate (measured) → Retire (never deleted, permanently discoverable)',
      requiredElements: ['the classification gate before registration', 'retirement shown as a preserved state, not an exit'],
      altTextIntent: 'Six stages from discovery to preserved retirement, with validation gates marked.',
    },
  },
];
