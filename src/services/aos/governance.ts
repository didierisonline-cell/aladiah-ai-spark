// =============================================================================
// Institutional Knowledge — the machine-readable governance registry.
// Governing documents stop being disconnected markdown: each carries name,
// version, status, owner, authority level, parent/children, review dates,
// and ratification record. The registry is CODE on purpose — every change to
// institutional authority is a reviewed, git-versioned commit, and the
// Founder Cockpit renders it. Human-readable map: docs/governance/README.md.
// Lifecycle rules: docs/governance/constitution/ratification.md.
// =============================================================================
import { recordDecision, BrainEntry } from './brain';
import { emitEvent } from './events';

export type DocumentStatus = 'draft' | 'review' | 'ratified' | 'deprecated';
export type AuthorityLevel = 'constitutional' | 'canonical' | 'operational' | 'informational';

export interface GoverningDocument {
  key: string;
  name: string;
  path: string;
  version: string;
  status: DocumentStatus;
  /** Who answers for this document (agent slug or 'founder'). */
  owner: string;
  authority: AuthorityLevel;
  /** Registry key of the parent document; null = root. */
  parent: string | null;
  lastReview: string; // YYYY-MM-DD
  nextReview: string; // YYYY-MM-DD
  ratified: { on: string; by: string } | null;
}

/**
 * The registry. Statuses are honest: 'ratified' only where the canon header
 * says Canonical and the founder has operated under it; new compositions
 * (constitution, enterprise architecture) start as drafts.
 */
export const GOVERNING_DOCUMENTS: GoverningDocument[] = [
  {
    key: 'constitution',
    name: 'The Aladiah Constitution',
    path: 'docs/governance/constitution/constitution.md',
    version: '0.1',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: null,
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    ratified: null,
  },
  {
    key: 'launch-decision-principle',
    name: 'Launch Decision Principle (root operating principle)',
    path: 'docs/standards/LAUNCH_DECISION_PRINCIPLE.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
  },
  {
    key: 'north-star',
    name: 'North Star',
    path: 'docs/standards/NORTH_STAR.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
  },
  {
    key: 'architecture-principle',
    name: 'Architecture Principle',
    path: 'docs/standards/ARCHITECTURE_PRINCIPLE.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
  },
  {
    key: 'competency-taxonomy',
    name: 'Competency Taxonomy',
    path: 'docs/standards/COMPETENCY_TAXONOMY.md',
    version: '1.0',
    status: 'ratified',
    owner: 'curriculum-excellence',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
  },
  {
    key: 'founder-standards',
    name: 'Founder Standards (the /docs/standards canon set)',
    path: 'docs/governance/standards/README.md',
    version: '1.0',
    status: 'ratified',
    owner: 'founder',
    authority: 'canonical',
    parent: 'constitution',
    lastReview: '2026-07-01',
    nextReview: '2026-10-01',
    ratified: { on: '2026-06-21', by: 'founder' },
  },
  {
    key: 'agent-operating-system',
    name: 'Agent Operating System (AOS canon)',
    path: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
    version: '1.2',
    status: 'ratified',
    owner: 'operations-platform',
    authority: 'canonical',
    parent: 'constitution',
    lastReview: '2026-07-01',
    nextReview: '2026-10-01',
    ratified: { on: '2026-06-10', by: 'founder' },
  },
  {
    key: 'enterprise-architecture',
    name: 'Enterprise Architecture',
    path: 'docs/governance/architecture/enterprise-architecture.md',
    version: '0.1',
    status: 'draft',
    owner: 'operations-platform',
    authority: 'canonical',
    parent: 'architecture-principle',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    ratified: null,
  },
  {
    key: 'intelligence-architecture',
    name: 'Intelligence Architecture',
    path: 'docs/governance/architecture/intelligence-architecture.md',
    version: '1.0',
    status: 'review',
    owner: 'analytics-intelligence',
    authority: 'canonical',
    parent: 'agent-operating-system',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    ratified: null,
  },
  {
    key: 'continuous-improvement',
    name: 'Continuous Improvement Doctrine',
    path: 'docs/agents/CONTINUOUS_IMPROVEMENT.md',
    version: '1.0',
    status: 'review',
    owner: 'analytics-intelligence',
    authority: 'operational',
    parent: 'agent-operating-system',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    ratified: null,
  },
  {
    key: 'qa-standard',
    name: 'QA Standard',
    path: 'docs/standards/QA_STANDARD.md',
    version: '1.0',
    status: 'ratified',
    owner: 'qa-authority',
    authority: 'canonical',
    parent: 'launch-decision-principle',
    lastReview: '2026-06-21',
    nextReview: '2026-09-21',
    ratified: { on: '2026-06-21', by: 'founder' },
  },
  {
    key: 'ratification-process',
    name: 'Ratification Process',
    path: 'docs/governance/constitution/ratification.md',
    version: '0.1',
    status: 'draft',
    owner: 'founder',
    authority: 'constitutional',
    parent: 'constitution',
    lastReview: '2026-07-01',
    nextReview: '2026-07-15',
    ratified: null,
  },
];

export function getDocument(key: string): GoverningDocument | undefined {
  return GOVERNING_DOCUMENTS.find((d) => d.key === key);
}

/** Children derived from parent links — one edge list, no double bookkeeping. */
export function childrenOf(key: string): GoverningDocument[] {
  return GOVERNING_DOCUMENTS.filter((d) => d.parent === key);
}

/** A ratified document past nextReview is due — silence is not compliance. */
export function isReviewDue(doc: GoverningDocument, today = new Date()): boolean {
  return new Date(doc.nextReview).getTime() <= today.getTime();
}

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
  const doc = getDocument(input.documentKey);
  const by = input.decidedBy ?? 'founder';
  const entry = await recordDecision({
    category: 'governance-record',
    content: `Governance: "${doc?.name ?? input.documentKey}" ${input.decision} by ${by}. Evidence: ${input.evidence}`,
    summary: `governance:${input.decision}:${input.documentKey}`,
    recordedBy: by,
  });
  await emitEvent('brain.decision.recorded', by, `Governance: ${input.documentKey} ${input.decision}`, {
    document: input.documentKey,
    decision: input.decision,
  });
  return entry;
}
