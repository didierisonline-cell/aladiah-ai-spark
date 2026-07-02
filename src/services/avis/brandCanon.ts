// =============================================================================
// AVIS — The Brand Canon (Phase IV step 2, WO-0013, FEO-2026-001).
// The official brand assets registered as governed capabilities. AVIS governs
// ALL institutional visuals (FD-2026-016) — brand marks included — but brand
// marks are FOUNDER-PROVIDED artwork, not AI renders: no prompt was compiled,
// no renderer ran, so routing them through the draft quarantine would
// fabricate provenance. Computed truth forbids that. This canon records the
// truthful entrance instead: provenance is the literal 'founder-provided',
// which no rendered candidate can carry — renders still have exactly one
// entrance (the quarantine); founder artwork has exactly one record (here).
// The Brand Standard (public/brand/official/BRAND_STANDARD.md) remains the
// single source of truth for WHICH files are official; this module makes that
// truth machine-readable, genome-validated, and Brain-mirrored — and CI fails
// if a registered file leaves the repository.
// =============================================================================
import { CapabilityGenome, computeMaturity } from '../aos/genome';
import { recordDecision, listBrain, BrainEntry } from '../aos/brain';

export type BrandAssetRole = 'header-logo' | 'logo' | 'mark' | 'seal' | 'poster';

export interface OfficialBrandAsset {
  key: string;                     // kebab identity within the canon
  role: BrandAssetRole;
  name: string;
  path: string;                    // repo path — existence is CI-checked
  purpose: string;                 // where it serves, per the Brand Standard
  altText: string;                 // the textual twin — mandatory (accessibility floor)
  license: string;                 // nothing unlicensed enters the Institution
  provenance: 'founder-provided';  // the truthful entrance — never an AI render
  approvedBy: 'founder';           // brand identity is a founder act
  approvedOn: string;
  usageSurfaces: string[];         // per the Brand Standard's decision table
  brainMarker: string;             // brand:<key>:v1
}

/** The single source of truth for which files are official (human-readable). */
export const BRAND_STANDARD_PATH = 'public/brand/official/BRAND_STANDARD.md';

const LICENSE = 'Aladiah Academy — founder-provided original artwork; all rights reserved';
const RATIFIED = '2026-07-02'; // FEO-2026-001: the Product Era launch order

function officialAsset(a: Pick<OfficialBrandAsset, 'key' | 'role' | 'name' | 'path' | 'purpose' | 'altText' | 'usageSurfaces'>): OfficialBrandAsset {
  return {
    ...a,
    license: LICENSE,
    provenance: 'founder-provided',
    approvedBy: 'founder',
    approvedOn: RATIFIED,
    brainMarker: `brand:${a.key}:v1`,
  };
}

/** The official brand assets — mirrors the Brand Standard's canonical table. */
export const OFFICIAL_BRAND_ASSETS: OfficialBrandAsset[] = [
  officialAsset({
    key: 'official-header-logo',
    role: 'header-logo',
    name: 'Official header logo (horizontal lockup)',
    path: 'public/brand/official/official-header-logo.svg',
    purpose: 'The horizontal lockup — mark + ALADIAH ACADEMY + tagline — for all application chrome: header, footer, mobile nav, login, dashboard.',
    altText: 'Aladiah Academy horizontal lockup: the silver A-spire mark with gold hidden-9 and gold global arc beside the ALADIAH ACADEMY wordmark and tagline.',
    usageSurfaces: ['header', 'footer', 'mobile-nav', 'login', 'dashboard'],
  }),
  officialAsset({
    key: 'official-logo',
    role: 'logo',
    name: 'Official logo (full vertical lockup)',
    path: 'public/brand/official/official-logo.svg',
    purpose: 'The full vertical lockup for large brand placements: hero, about, brand pages.',
    altText: 'Aladiah Academy full vertical lockup: the silver A-spire mark with gold hidden-9 and gold global arc above the ALADIAH ACADEMY wordmark.',
    usageSurfaces: ['hero', 'about', 'brand-pages'],
  }),
  officialAsset({
    key: 'official-mark',
    role: 'mark',
    name: 'Official mark (icon only)',
    path: 'public/brand/official/official-mark.svg',
    purpose: 'The icon-only mark — A-spire, hidden-9, global arc — the favicon source, app icon, watermark, and loading screens.',
    altText: 'The Aladiah Academy mark: a silver A-spire with the gold hidden-9 and a gold global arc over a dotted world.',
    usageSurfaces: ['favicon', 'app-icon', 'watermark', 'loading-screens'],
  }),
  officialAsset({
    key: 'official-seal',
    role: 'seal',
    name: 'Official institutional seal',
    path: 'public/brand/official/official-seal.svg',
    purpose: 'The circular academic seal — certificates, diplomas, and verification pages.',
    altText: 'The circular academic seal of Aladiah Academy, used on certificates, diplomas, and verification pages.',
    usageSurfaces: ['certificates', 'diplomas', 'verification-pages'],
  }),
  officialAsset({
    key: 'official-poster',
    role: 'poster',
    name: 'Official brand poster (approved render)',
    path: 'public/brand/official/Aladiah_Academy_Official_Logo.png',
    purpose: 'The approved poster render (1024×1536, navy) — brand poster, supporting art, and OG image only; never application chrome.',
    altText: 'The Aladiah Academy brand poster: a photoreal metallic rendering of the official logo on a deep navy background.',
    usageSurfaces: ['brand-poster', 'supporting-art', 'og-image'],
  }),
];

/** Pure validation — every violation at once (the house pattern). */
export function validateBrandCanon(assets: OfficialBrandAsset[] = OFFICIAL_BRAND_ASSETS): string[] {
  const v: string[] = [];
  const keys = new Set<string>();
  const paths = new Set<string>();
  for (const a of assets) {
    if (keys.has(a.key)) v.push(`duplicate brand asset key '${a.key}'`);
    keys.add(a.key);
    if (paths.has(a.path)) v.push(`duplicate brand asset path '${a.path}'`);
    paths.add(a.path);
    if (!a.altText?.trim()) v.push(`'${a.key}': altText is mandatory — the textual twin (accessibility floor)`);
    if (!a.license?.trim()) v.push(`'${a.key}': license/provenance is mandatory — nothing unlicensed enters the Institution`);
    if (!a.usageSurfaces.length) v.push(`'${a.key}': a canonical asset must declare where it serves`);
    if (a.brainMarker !== `brand:${a.key}:v1`) v.push(`'${a.key}': brain marker must be brand:<key>:v1`);
    if (!a.path.startsWith('public/brand/official/')) {
      v.push(`'${a.key}': official assets live ONLY in public/brand/official/ (the Brand Standard's one home)`);
    }
  }
  // FEO-2026-001 Step 2 names the logo and the institutional seal explicitly:
  // the canon is invalid without exactly one of each anchor role.
  for (const role of ['logo', 'seal', 'header-logo', 'mark'] as const) {
    const n = assets.filter((a) => a.role === role).length;
    if (n !== 1) v.push(`exactly one '${role}' asset must be canonical (found ${n})`);
  }
  return v;
}

/** The asset's genome — brand marks are capabilities like everything else. */
export function brandAssetGenome(a: OfficialBrandAsset): CapabilityGenome {
  const draft: CapabilityGenome = {
    id: `visual-asset:brand-${a.key}`,
    mission: 'Present one Institution, unmistakably, on every surface where Aladiah appears.',
    purpose: a.purpose,
    type: 'visual-asset',
    classification: 'strategic',
    owner: 'marketing-content',
    authority: 'canonical',
    institute: null,
    department: 'marketing-content',
    constitutionVolumes: ['11'],
    founderStandards: { na: 'Volume II reserved' },
    referenceModel: BRAND_STANDARD_PATH,
    playbook: { na: 'the Brand Standard is the operating rule; Brand & Media Bible chapters (brand-media-bible) will extend it' },
    standards: ['capability-genome-standard', 'brand-media-bible'],
    dashboardSpec: { na: 'brand assets render on product surfaces, not a dashboard of their own' },
    workforceSpec: 'docs/agents/marketing-content/AGENT_SPEC.md',
    kpiDictionary: { na: 'brand KPIs roll up to the marketing dictionary' },
    dependencies: ['service:avis'],
    inputs: [{ name: 'founder-provided artwork', kind: 'document' }],
    outputs: [{ name: `official ${a.role} on: ${a.usageSurfaces.join(', ')}`, kind: 'artifact', writesProduction: false, approvalGate: null }],
    security: { level: 'public', posture: `provenance: founder-provided; license: ${a.license}`, gateChain: 'founder approval (FEO-2026-001)' },
    accessibility: 'posture', // the textual twin is mandated by the canon; no audit verdict is claimed
    translation: 'n/a',
    qaStatus: 'n/a', // static founder artwork — QA gate verdicts apply to rendered candidates in quarantine
    workforce: [
      { agent: 'marketing-content', role: 'stewards' },
      { agent: 'interface-experience', role: 'reviews' },
    ],
    kpis: 'missing',
    maturity: 0, // recomputed below — V3 (computed truth) by construction
    lifecycle: 'institutionalized',
    lastReview: RATIFIED,
    nextReview: '2026-10-02',
    parentCapability: 'service:avis',
    childCapabilities: [],
    derivedFrom: 'none',
    supersedes: 'none',
    replacedBy: null,
    constitutionalAuthority: 'brand-media-bible',
    founderDirectives: ['FEO-2026-001 (Step 2 — Brand Canon)'],
    engineeringDecisions: [],
    architectureDecisions: [],
    createdOn: a.approvedOn,
    ratifiedOn: RATIFIED,
    retiredOn: null,
    evolution: [
      { on: a.approvedOn, kind: 'created', by: 'founder', evidence: `Founder-provided artwork in ${a.path}; canonical per the Brand Standard (${BRAND_STANDARD_PATH}).` },
      { on: RATIFIED, kind: 'ratified', by: 'founder', evidence: 'FEO-2026-001 Step 2: the official logo and institutional seal registered as the Brand Canon.' },
    ],
    brainLink: `genome:visual-asset:brand-${a.key}:v1`,
    improvementHistory: [],
  };
  return { ...draft, maturity: computeMaturity(draft) };
}

/** Mirror the Brand Canon to the Company Brain (idempotent per version). */
export async function syncBrandCanonToBrain(): Promise<{ synced: number; skipped: number }> {
  const existing = await listBrain('governance-record', 500);
  let synced = 0;
  let skipped = 0;
  for (const a of OFFICIAL_BRAND_ASSETS) {
    if (existing.some((e: BrainEntry) => e.summary === a.brainMarker)) { skipped += 1; continue; }
    const entry = await recordDecision({
      category: 'governance-record',
      content:
        `BRAND ${a.key} — official ${a.role} (${a.name}), founder-provided, ratified ${a.approvedOn} (FEO-2026-001). ` +
        `Path: ${a.path}. Textual twin: ${a.altText} License: ${a.license}. ` +
        `Serves: ${a.usageSurfaces.join(', ')}.`,
      summary: a.brainMarker,
      recordedBy: 'marketing-content',
    });
    if (entry) synced += 1;
  }
  return { synced, skipped };
}
