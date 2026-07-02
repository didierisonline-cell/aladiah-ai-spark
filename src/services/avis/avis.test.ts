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
