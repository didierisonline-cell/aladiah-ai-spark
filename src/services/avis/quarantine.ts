// =============================================================================
// AVIS — Draft Quarantine (roadmap step 3, WO-0009).
// Generated candidates are quarantined at birth: never publishable, never
// public, expiring if unreviewed — no shadow inventory of images can exist
// (Integration Architecture §3). Release requires ALL human gates; rejection
// requires a typed reason (rejection is knowledge). Approved assets become
// immutable governed assets (step 4 wires registration + Brain).
// =============================================================================
import { VisualClass } from './promptCompiler';

export type DraftState = 'draft' | 'in-review' | 'approved' | 'rejected' | 'expired';

export type GateKind = 'qa' | 'accessibility' | 'brand';
export type RejectionType = 'accuracy' | 'brand' | 'accessibility' | 'technical' | 'pedagogy';

export interface GateVerdict {
  gate: GateKind;
  passed: boolean;
  reviewer: string; // human/steward identity — accountability per act
  on: string;
  note: string;
}

export interface DraftRecord {
  candidateId: string;
  visualClass: VisualClass;
  specId: string;
  promptVersion: string;
  state: DraftState;
  createdAt: string;
  verdicts: GateVerdict[];
  rejection: { type: RejectionType; reason: string; by: string; on: string } | null;
  /** Founder per-instance approval — required for 'credential' class release. */
  founderApproved: boolean;
}

/** Drafts expire unreviewed after this many days (founder-settable). */
export const DRAFT_EXPIRY_DAYS = 30;

export const REQUIRED_GATES: readonly GateKind[] = ['qa', 'accessibility', 'brand'];

export function newDraft(input: Pick<DraftRecord, 'candidateId' | 'visualClass' | 'specId' | 'promptVersion' | 'createdAt'>): DraftRecord {
  return { ...input, state: 'draft', verdicts: [], rejection: null, founderApproved: false };
}

export function isExpired(d: DraftRecord, today: Date): boolean {
  if (d.state === 'approved' || d.state === 'rejected') return false; // decided drafts never expire
  const age = (today.getTime() - new Date(d.createdAt).getTime()) / 86400000;
  return age > DRAFT_EXPIRY_DAYS;
}

export function recordVerdict(d: DraftRecord, verdict: GateVerdict): DraftRecord {
  if (d.state === 'approved' || d.state === 'rejected' || d.state === 'expired') {
    throw new Error(`Cannot review a ${d.state} draft — decided and expired drafts are immutable.`);
  }
  if (!verdict.reviewer?.trim()) throw new Error('A verdict without a reviewer identity is invalid (accountability per act).');
  // Latest verdict per gate wins; history preserved by append.
  return { ...d, state: 'in-review', verdicts: [...d.verdicts, verdict] };
}

function latestVerdict(d: DraftRecord, gate: GateKind): GateVerdict | undefined {
  return [...d.verdicts].reverse().find((v) => v.gate === gate);
}

/** All required gates passed (latest verdict per gate)? */
export function gatesPassed(d: DraftRecord): boolean {
  return REQUIRED_GATES.every((g) => latestVerdict(d, g)?.passed === true);
}

/** What still blocks release — for the review dashboard, always explicit. */
export function blockingGates(d: DraftRecord): string[] {
  const blocks: string[] = REQUIRED_GATES
    .filter((g) => latestVerdict(d, g)?.passed !== true)
    .map((g) => `${g}: ${latestVerdict(d, g) ? 'failed' : 'not reviewed'}`);
  if (d.visualClass === 'credential' && !d.founderApproved) {
    blocks.push('founder: credential class requires per-instance founder approval (non-delegable)');
  }
  return blocks;
}

/**
 * Release from quarantine. Impossible unless every required gate passed —
 * and for credential-class assets, the founder approved this instance.
 */
export function approve(d: DraftRecord): DraftRecord {
  const blocks = blockingGates(d);
  if (blocks.length) {
    throw new Error(`Release blocked: ${blocks.join(' · ')}`);
  }
  return { ...d, state: 'approved' };
}

/** Rejection requires a typed reason — rejection is knowledge (Blueprint §3). */
export function reject(d: DraftRecord, rejection: NonNullable<DraftRecord['rejection']>): DraftRecord {
  if (d.state === 'approved') throw new Error('Approved assets are immutable — supersede, never reject retroactively.');
  if (!rejection.reason?.trim()) throw new Error('Rejection requires a reason — rejection is knowledge.');
  return { ...d, state: 'rejected', rejection };
}

export function expire(d: DraftRecord, today: Date): DraftRecord {
  if (!isExpired(d, today)) return d;
  return { ...d, state: 'expired' };
}
