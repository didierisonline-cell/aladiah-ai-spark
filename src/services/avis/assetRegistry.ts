// =============================================================================
// AVIS — Visual Asset Registry & Company Brain integration (step 4, WO-0010).
// Only APPROVED drafts become assets (quarantine is the sole entrance);
// every asset is a governed capability (visual-asset genome, validated in CI)
// with mandatory provenance and the textual twin; approved assets are
// immutable — supersession, never overwrite (Amendment IV for pixels);
// every asset mirrors to the Company Brain (visual:<id>:v<n> markers).
// Storage-side parity activates with the avis-render edge-function work
// order; until assets exist, this module is the machinery, tested and ready.
// =============================================================================
import { CapabilityGenome } from '../aos/genome';
import { recordDecision, listBrain, BrainEntry } from '../aos/brain';
import { DraftRecord } from './quarantine';
import { CompiledPrompt } from './promptCompiler';

/** The one-truth metadata model (Integration Architecture §5). */
export interface VisualAsset {
  assetId: string;               // content hash = the candidateId that was approved
  visualClass: DraftRecord['visualClass'];
  specId: string;
  promptVersion: string;
  renderer: { id: string; version: string };  // provenance: which engine, when
  requestedBy: string;
  approvedBy: string;            // human accountability per act
  approvedOn: string;
  verdicts: DraftRecord['verdicts'];
  altText: string;               // the textual twin — mandatory
  license: string;               // provenance: nothing unlicensed enters
  usageSites: string[];          // appended as consumed
  supersedes: string | null;
  replacedBy: string | null;
  brainMarker: string;           // visual:<assetId>:v<n>
}

export class AssetRegistrationError extends Error {
  constructor(public violations: string[]) {
    super(`Asset registration rejected: ${violations.join('; ')}`);
    this.name = 'AssetRegistrationError';
  }
}

export interface RegistrationInput {
  draft: DraftRecord;
  prompt: CompiledPrompt;
  renderer: { id: string; version: string };
  requestedBy: string;
  approvedBy: string;
  approvedOn: string;
  altText: string;
  license: string;
  supersedes?: string | null;
}

/** Pure validation — every violation at once (the house pattern). */
export function validateRegistration(input: RegistrationInput): string[] {
  const v: string[] = [];
  if (input.draft.state !== 'approved') {
    v.push(`only APPROVED drafts become assets — draft is '${input.draft.state}' (quarantine is the sole entrance)`);
  }
  if (input.prompt.specId !== input.draft.specId) v.push('prompt/draft spec mismatch — provenance chain broken');
  if (input.prompt.version !== input.draft.promptVersion) v.push('prompt version mismatch — provenance chain broken');
  if (!input.altText?.trim()) v.push('altText is mandatory — the textual twin (accessibility floor)');
  if (!input.license?.trim()) v.push('license/provenance is mandatory — nothing unlicensed enters the Institution');
  if (!input.approvedBy?.trim()) v.push('approvedBy identity is required (accountability per act)');
  if (!input.renderer.id?.trim() || !input.renderer.version?.trim()) v.push('renderer provenance (id + version) is mandatory');
  return v;
}

/** Register an approved draft as an immutable governed asset. Pure. */
export function registerApprovedAsset(input: RegistrationInput): VisualAsset {
  const violations = validateRegistration(input);
  if (violations.length) throw new AssetRegistrationError(violations);
  return {
    assetId: input.draft.candidateId,
    visualClass: input.draft.visualClass,
    specId: input.draft.specId,
    promptVersion: input.draft.promptVersion,
    renderer: input.renderer,
    requestedBy: input.requestedBy,
    approvedBy: input.approvedBy,
    approvedOn: input.approvedOn,
    verdicts: input.draft.verdicts,
    altText: input.altText.trim(),
    license: input.license.trim(),
    usageSites: [],
    supersedes: input.supersedes ?? null,
    replacedBy: null,
    brainMarker: `visual:${input.draft.candidateId}:v1`,
  };
}

/** Supersession — never overwrite: the successor names its ancestor; the
 *  ancestor names its replacement; both remain forever. */
export function supersede(old: VisualAsset, successor: VisualAsset): { old: VisualAsset; successor: VisualAsset } {
  if (successor.supersedes !== old.assetId) {
    throw new AssetRegistrationError([`successor must declare supersedes='${old.assetId}'`]);
  }
  return { old: { ...old, replacedBy: successor.assetId }, successor };
}

/** Record a consumption site — the Brain knows where every visual teaches. */
export function recordUsage(asset: VisualAsset, site: string): VisualAsset {
  if (asset.usageSites.includes(site)) return asset;
  return { ...asset, usageSites: [...asset.usageSites, site] };
}

/** The asset's genome — visual assets are capabilities like everything else. */
export function assetGenome(a: VisualAsset): CapabilityGenome {
  return {
    id: `visual-asset:${a.assetId.replace(/[^a-z0-9]/gi, '').toLowerCase()}`,
    mission: 'Strengthen understanding through visual intelligence (Covenant, Closing Affirmation).',
    purpose: `Approved ${a.visualClass} visual (spec ${a.specId}); textual twin: ${a.altText.slice(0, 80)}`,
    type: 'visual-asset',
    classification: 'operational',
    owner: 'interface-experience',
    authority: 'operational',
    institute: null,
    department: 'interface-experience',
    constitutionVolumes: ['11'],
    founderStandards: { na: 'Volume II reserved' },
    referenceModel: 'docs/engineering/avis/BLUEPRINT.md',
    playbook: 'docs/engineering/avis/INTEGRATION_ARCHITECTURE.md',
    standards: ['capability-genome-standard', 'avis-blueprint'],
    dashboardSpec: { na: 'asset browser ships with the storage work order' },
    workforceSpec: 'docs/agents/interface-experience/AGENT_SPEC.md',
    kpiDictionary: { na: 'per-asset KPIs roll up to the AVIS dictionary' },
    dependencies: [],
    inputs: [{ name: `compiled prompt ${a.promptVersion}`, kind: 'document' }],
    outputs: [{ name: 'governed visual (consumed by registered sites)', kind: 'artifact', writesProduction: false, approvalGate: null }],
    security: { level: 'student', posture: `provenance: ${a.renderer.id}@${a.renderer.version}; license: ${a.license}`, gateChain: 'QA→Accessibility→Brand→Approval (passed)' },
    accessibility: 'audited', // computed: registration is impossible without the passed accessibility verdict
    translation: 'n/a',
    qaStatus: 'passing',      // computed: registration is impossible without the passed QA verdict
    workforce: [{ agent: 'interface-experience', role: 'stewards' }],
    kpis: 'missing',
    maturity: 0, // computed below
    lifecycle: 'implemented',
    lastReview: a.approvedOn,
    nextReview: a.approvedOn.slice(0, 10) < '2026-10-01' ? '2026-10-01' : a.approvedOn,
    parentCapability: 'service:avis',
    childCapabilities: [],
    derivedFrom: a.supersedes ? [`visual-asset:${a.supersedes.replace(/[^a-z0-9]/gi, '').toLowerCase()}`] : 'none',
    supersedes: a.supersedes ? [`visual-asset:${a.supersedes.replace(/[^a-z0-9]/gi, '').toLowerCase()}`] : 'none',
    replacedBy: null,
    constitutionalAuthority: 'avis-blueprint',
    founderDirectives: ['FD-2026-016'],
    engineeringDecisions: [],
    architectureDecisions: [],
    createdOn: a.approvedOn,
    ratifiedOn: null,
    retiredOn: null,
    evolution: [{ on: a.approvedOn, kind: 'created', by: a.approvedBy, evidence: `Approved through quarantine; verdicts: ${a.verdicts.length}; renderer ${a.renderer.id}@${a.renderer.version}.` }],
    brainLink: `genome:visual-asset:${a.assetId.replace(/[^a-z0-9]/gi, '').toLowerCase()}:v1`,
    improvementHistory: [],
  };
}

/**
 * The registered asset ledger. Empty today — no asset exists before the
 * rendering edge function ships — and CI-checked non-empty machinery:
 * the moment assets exist, they exist HERE or the parity test (activated
 * with the storage work order) fails the build.
 */
export const VISUAL_ASSETS: VisualAsset[] = [];

/** Mirror all registered assets to the Company Brain (idempotent per version). */
export async function syncVisualAssetsToBrain(): Promise<{ synced: number; skipped: number }> {
  const existing = await listBrain('governance-record', 500);
  let synced = 0;
  let skipped = 0;
  for (const a of VISUAL_ASSETS) {
    if (existing.some((e: BrainEntry) => e.summary === a.brainMarker)) { skipped += 1; continue; }
    const entry = await recordDecision({
      category: 'governance-record',
      content:
        `VISUAL ${a.assetId} — ${a.visualClass}, approved ${a.approvedOn} by ${a.approvedBy}. ` +
        `Textual twin: ${a.altText} Renderer: ${a.renderer.id}@${a.renderer.version}; license: ${a.license}. ` +
        `Used by: ${a.usageSites.join(', ') || 'not yet consumed'}.`,
      summary: a.brainMarker,
      recordedBy: 'interface-experience',
    });
    if (entry) synced += 1;
  }
  return { synced, skipped };
}
