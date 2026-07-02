import { describe, expect, it } from 'vitest';
import {
  BRAND_TOKENS,
  CLASS_TEMPLATES,
  INSTITUTIONAL_PROHIBITIONS,
  VISUAL_TAXONOMY,
  VisualSpecification,
  compilePrompt,
  validateSpec,
} from './promptCompiler';
import {
  DRAFT_EXPIRY_DAYS,
  approve,
  blockingGates,
  expire,
  gatesPassed,
  isExpired,
  newDraft,
  recordVerdict,
  reject,
} from './quarantine';
import { FIRST_APPROVED_RENDERER, enableRenderer, getRenderer, listRenderers, registerRenderer } from './renderer';

const spec = (over: Partial<VisualSpecification> = {}): VisualSpecification => ({
  specId: 'spec:test-1',
  visualClass: 'process-flow',
  purpose: 'Teach the work-order road.',
  audience: 'student',
  subject: 'The eight-step institutional change pipeline',
  requiredElements: ['founder decision step highlighted'],
  prohibitedElements: ['no company names'],
  brandTokens: ['brand-primary', 'neutral-slate'],
  altTextIntent: 'Sequential description of the eight steps for screen readers.',
  ...over,
});

describe('Prompt Compiler — governed source code for visuals (step 2)', () => {
  it('compiles deterministically: same spec → same prompt and version', () => {
    const a = compilePrompt(spec());
    const b = compilePrompt(spec());
    expect(a.text).toBe(b.text);
    expect(a.version).toBe(b.version);
  });

  it('institutional prohibitions are merged into EVERY prompt, non-removable', () => {
    const p = compilePrompt(spec({ prohibitedElements: [] }));
    for (const rule of INSTITUTIONAL_PROHIBITIONS) expect(p.prohibitions).toContain(rule);
    expect(p.text).toContain('risk colors (green/amber/red) never used decoratively');
  });

  it('brand tokens are validated by name — free-form styling is rejected', () => {
    const bad = spec({ brandTokens: ['electric-purple' as never] });
    expect(validateSpec(bad).join(' ')).toMatch(/unknown brand token/);
  });

  it('the textual twin is mandatory (accessibility floor)', () => {
    expect(validateSpec(spec({ altTextIntent: ' ' })).join(' ')).toMatch(/textual twin/);
  });

  it('credential class is founder-gated per instance (Reserved Powers)', () => {
    const cred = spec({ visualClass: 'credential' });
    expect(validateSpec(cred).join(' ')).toMatch(/Reserved Powers/);
    expect(validateSpec({ ...cred, signatureApproved: true })).toEqual([]);
  });

  it('the taxonomy is complete: every class has a template with prohibitions', () => {
    expect(VISUAL_TAXONOMY.length).toBe(12);
    for (const c of VISUAL_TAXONOMY) {
      expect(CLASS_TEMPLATES[c].framing.length).toBeGreaterThan(10);
      expect(CLASS_TEMPLATES[c].requiredElements.length).toBeGreaterThan(0);
    }
    expect(BRAND_TOKENS.length).toBeGreaterThan(5);
  });

  it('an invalid spec never becomes a prompt (throws with all violations)', () => {
    expect(() => compilePrompt(spec({ purpose: '', subject: '' }))).toThrowError(/purpose.*subject|subject.*purpose|Invalid visual specification/);
  });
});

describe('Draft Quarantine — no shadow inventory of images (step 3)', () => {
  const draft = () => newDraft({
    candidateId: 'sha:abc', visualClass: 'process-flow', specId: 'spec:test-1',
    promptVersion: 'v1.x', createdAt: '2026-07-02T00:00:00Z',
  });
  const verdict = (gate: 'qa' | 'accessibility' | 'brand', passed = true) =>
    ({ gate, passed, reviewer: 'steward-1', on: '2026-07-02', note: 'checked' });

  it('release is impossible until every required gate passes', () => {
    let d = draft();
    expect(() => approve(d)).toThrowError(/Release blocked/);
    d = recordVerdict(d, verdict('qa'));
    d = recordVerdict(d, verdict('accessibility'));
    expect(blockingGates(d).join(' ')).toMatch(/brand: not reviewed/);
    d = recordVerdict(d, verdict('brand'));
    expect(gatesPassed(d)).toBe(true);
    expect(approve(d).state).toBe('approved');
  });

  it('a failed gate blocks until re-reviewed; latest verdict per gate wins', () => {
    let d = draft();
    d = recordVerdict(d, verdict('qa', false));
    d = recordVerdict(d, verdict('accessibility'));
    d = recordVerdict(d, verdict('brand'));
    expect(() => approve(d)).toThrowError(/qa: failed/);
    d = recordVerdict(d, verdict('qa', true));
    expect(approve(d).state).toBe('approved');
  });

  it('credential-class release additionally requires founder per-instance approval', () => {
    let d = newDraft({ candidateId: 'sha:cred', visualClass: 'credential', specId: 's', promptVersion: 'v', createdAt: '2026-07-02T00:00:00Z' });
    d = recordVerdict(d, verdict('qa'));
    d = recordVerdict(d, verdict('accessibility'));
    d = recordVerdict(d, verdict('brand'));
    expect(() => approve(d)).toThrowError(/non-delegable/);
    expect(approve({ ...d, founderApproved: true }).state).toBe('approved');
  });

  it('rejection requires a typed reason; approved assets are immutable', () => {
    const d = draft();
    expect(() => reject(d, { type: 'accuracy', reason: ' ', by: 'steward-1', on: '2026-07-02' })).toThrowError(/rejection is knowledge/i);
    let ok = recordVerdict(d, verdict('qa'));
    ok = recordVerdict(ok, verdict('accessibility'));
    ok = recordVerdict(ok, verdict('brand'));
    const approved = approve(ok);
    expect(() => reject(approved, { type: 'brand', reason: 'x', by: 's', on: 'd' })).toThrowError(/immutable/);
  });

  it('unreviewed drafts expire; decided drafts never do', () => {
    const d = draft();
    const later = new Date(new Date(d.createdAt).getTime() + (DRAFT_EXPIRY_DAYS + 1) * 86400000);
    expect(isExpired(d, later)).toBe(true);
    expect(expire(d, later).state).toBe('expired');
    let ok = recordVerdict(d, verdict('qa'));
    ok = recordVerdict(ok, verdict('accessibility'));
    ok = recordVerdict(ok, verdict('brand'));
    expect(isExpired(approve(ok), later)).toBe(false);
  });

  it('a verdict without reviewer identity is invalid (accountability per act)', () => {
    expect(() => recordVerdict(draft(), { gate: 'qa', passed: true, reviewer: '', on: 'd', note: 'n' }))
      .toThrowError(/accountability/);
  });
});

describe('Visual Renderer Interface — the permanent adapter seam (step 1)', () => {
  it('renderers require founder enablement; unregistered/unenabled renderers resolve to null', () => {
    expect(getRenderer('nonexistent')).toBeNull();
    registerRenderer({
      id: 'test-renderer', version: '0.0',
      capabilities: () => ({ sizes: ['1x1'], formats: ['png'], supportsVariations: false, supportsEdits: false, maxCandidates: 1 }),
      render: async () => ({ promptVersion: 'v', candidates: [], cost: { estimatedUsd: null, basis: 'test' } }),
      cost: async () => ({ estimatedUsd: null, basis: 'test' }),
    });
    expect(getRenderer('test-renderer')).toBeNull(); // registered but NOT enabled
    expect(enableRenderer('test-renderer')).toBe(true);
    expect(getRenderer('test-renderer')).not.toBeNull();
    expect(enableRenderer('ghost')).toBe(false);
  });

  it('the first approved renderer is named without any vendor SDK present', () => {
    expect(FIRST_APPROVED_RENDERER).toBe('open-gen-ai');
    // Its adapter ships with the server-side edge-function work order — by design,
    // no adapter for it exists in the client bundle:
    expect(listRenderers().some((r) => r.id === FIRST_APPROVED_RENDERER)).toBe(false);
  });
});

// =============================================================================
// WO-0010 (step 4) — Asset Registry & Brain integration
// =============================================================================
import { AssetRegistrationError, assetGenome, recordUsage, registerApprovedAsset, supersede, validateRegistration } from './assetRegistry';
import { computeMaturity, validateGenome } from '../aos/genome';
import { genomeExists } from '../aos/institutionalRegistry';

describe('Visual Asset Registry — quarantine is the sole entrance (step 4)', () => {
  const approvedDraft = () => {
    let d = newDraft({ candidateId: 'sha256abc', visualClass: 'process-flow', specId: 'spec:test-1', promptVersion: 'v1.x', createdAt: '2026-07-02T00:00:00Z' });
    for (const g of ['qa', 'accessibility', 'brand'] as const) {
      d = recordVerdict(d, { gate: g, passed: true, reviewer: 'steward-1', on: '2026-07-02', note: 'ok' });
    }
    return approve(d);
  };
  const registration = () => ({
    draft: approvedDraft(),
    prompt: { version: 'v1.x', specId: 'spec:test-1', visualClass: 'process-flow' as const, text: 't', prohibitions: [], brandTokens: [], compiledAt: 'now' },
    renderer: { id: 'open-gen-ai', version: '2026-07' },
    requestedBy: 'curriculum-excellence', approvedBy: 'steward-1', approvedOn: '2026-07-02',
    altText: 'Sequential description of the flow.', license: 'institution-owned (generated under contract terms)',
  });

  it('registers only APPROVED drafts; provenance chain must be intact', () => {
    const a = registerApprovedAsset(registration());
    expect(a.brainMarker).toBe('visual:sha256abc:v1');
    const unapproved = { ...registration(), draft: newDraft({ candidateId: 'x', visualClass: 'process-flow', specId: 'spec:test-1', promptVersion: 'v1.x', createdAt: 'now' }) };
    expect(() => registerApprovedAsset(unapproved)).toThrowError(/sole entrance/);
    const mismatched = { ...registration(), prompt: { ...registration().prompt, version: 'v2.other' } };
    expect(validateRegistration(mismatched).join(' ')).toMatch(/provenance chain broken/);
  });

  it('the textual twin, license, and identities are mandatory', () => {
    expect(validateRegistration({ ...registration(), altText: ' ' }).join(' ')).toMatch(/textual twin/);
    expect(validateRegistration({ ...registration(), license: '' }).join(' ')).toMatch(/unlicensed/);
    expect(validateRegistration({ ...registration(), approvedBy: '' }).join(' ')).toMatch(/accountability/);
  });

  it('every asset genome validates under the ratified rules, computed loci intact', () => {
    const g = assetGenome(registerApprovedAsset(registration()));
    // maturity is computed (V3): recompute before validating, as the registry does
    g.maturity = computeMaturity(g);
    expect(validateGenome(g, (id) => genomeExists(id) || id.startsWith('visual-asset:')), g.id).toEqual([]);
    expect(g.accessibility).toBe('audited'); // computed: impossible without the passed verdict
  });

  it('supersession never overwrites: both assets persist, cross-linked', () => {
    const oldAsset = registerApprovedAsset(registration());
    const successorDraft = { ...registration(), draft: { ...approvedDraft(), candidateId: 'sha256new' }, supersedes: oldAsset.assetId };
    const successor = registerApprovedAsset(successorDraft);
    const { old, successor: next } = supersede(oldAsset, successor);
    expect(old.replacedBy).toBe('sha256new');
    expect(next.supersedes).toBe('sha256abc');
    expect(() => supersede(oldAsset, { ...successor, supersedes: 'wrong' })).toThrowError(AssetRegistrationError);
  });

  it('usage sites append idempotently — the Brain knows where every visual teaches', () => {
    let a = registerApprovedAsset(registration());
    a = recordUsage(a, 'lesson:ba-v1:module-03');
    a = recordUsage(a, 'lesson:ba-v1:module-03');
    expect(a.usageSites).toEqual(['lesson:ba-v1:module-03']);
  });
});

// =============================================================================
// WO-0011 (step 5) — the Enterprise Diagram Library
// =============================================================================
import { ENTERPRISE_DIAGRAMS } from './enterpriseDiagrams';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Enterprise Diagram Library — the Institution drawn from its own documents (step 5)', () => {
  it('every spec compiles deterministically through the governed compiler', () => {
    for (const d of ENTERPRISE_DIAGRAMS) {
      const a = compilePrompt(d.spec);
      const b = compilePrompt(d.spec);
      expect(a.version, d.spec.specId).toBe(b.version);
      expect(a.prohibitions).toContain('no elements absent from the governing document');
    }
  });

  it('every diagram cites a governing document that exists — amendments stale their diagrams', () => {
    const repoRoot = resolve(__dirname, '../../..');
    for (const d of ENTERPRISE_DIAGRAMS) {
      expect(existsSync(resolve(repoRoot, d.governedBy)), `${d.spec.specId} → ${d.governedBy}`).toBe(true);
    }
  });

  it('the library covers the core institutional systems', () => {
    const ids = ENTERPRISE_DIAGRAMS.map((d) => d.spec.specId);
    for (const core of ['constitutional-spine', 'operating-hierarchy', 'work-order-road', 'intelligence-loop', 'aos-architecture', 'learning-loop', 'genome-pipeline']) {
      expect(ids.some((i) => i.includes(core)), core).toBe(true);
    }
    expect(ENTERPRISE_DIAGRAMS.every((d) => d.spec.altTextIntent.length > 20)).toBe(true);
  });
});
