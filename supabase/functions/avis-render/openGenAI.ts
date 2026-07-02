// =============================================================================
// AVIS — the Open-Gen-AI adapter (WO-0014). THE ONLY PLACE THE VENDOR EXISTS.
// Implements the permanent VisualRenderer seam (Integration Architecture §15)
// against the OpenAI Images API. Open-Gen-AI is the FIRST adapter, not the
// architecture (FEO-2026-001): replacing it is one new file behind the same
// seam + founder enablement — nothing above the seam changes.
// Keys live in Supabase secrets (OPENAI_API_KEY), never in the browser.
// The renderer executes standards; it defines nothing (FD-2026-016).
// =============================================================================
import type { CompiledPrompt } from '../../../src/services/avis/promptCompiler.ts';
import type { CandidateSet, CostEstimate, RenderCandidate, RendererCapabilities, RenderOptions } from '../../../src/services/avis/renderer.ts';
import { fingerprintBytes } from '../../../src/services/avis/renderPlatform.ts';

export const ADAPTER_ID = 'open-gen-ai';

/** Model is founder-applied configuration; the published default, not a router. */
function model(): string {
  return Deno.env.get('AVIS_RENDER_MODEL') ?? 'gpt-image-1';
}

export function adapterVersion(): string {
  return model();
}

export function capabilities(): RendererCapabilities {
  // Declared per the published gpt-image-1 surface — not assumed beyond it.
  return {
    sizes: ['1024x1024', '1536x1024', '1024x1536'],
    formats: ['png', 'webp', 'jpeg'],
    supportsVariations: false,
    supportsEdits: true,
    maxCandidates: 4,
  };
}

/**
 * Unit price is founder-applied configuration (AVIS_RENDER_UNIT_COST_USD),
 * read at call time and recorded to the ledger — never a hardcoded
 * assumption. Absent configuration is an honest null (unmeasured).
 */
export function costEstimate(opts: RenderOptions): CostEstimate {
  const configured = Deno.env.get('AVIS_RENDER_UNIT_COST_USD');
  const unit = configured == null ? null : Number(configured);
  return {
    estimatedUsd: unit == null || Number.isNaN(unit) ? null : unit * opts.candidates,
    basis: unit == null
      ? 'AVIS_RENDER_UNIT_COST_USD not applied — unmeasured, never estimated'
      : `founder-applied unit price ${unit} USD × ${opts.candidates} candidate(s), model ${model()}`,
  };
}

/**
 * Render N candidates and return the raw bytes for draft-quarantine upload
 * (this module never touches storage). The compiled prompt is the ONLY text
 * that reaches the vendor — raw user input never arrives here (§2, §11).
 */
export async function renderWithBytes(prompt: CompiledPrompt, opts: RenderOptions): Promise<{ set: CandidateSet; bytes: Map<string, Uint8Array> }> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured (Supabase secrets — founder-applied)');

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: model(),
      prompt: prompt.text,
      n: Math.min(opts.candidates, capabilities().maxCandidates),
      size: opts.size,
      output_format: opts.format,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`renderer error ${response.status}: ${body.slice(0, 400)}`);
  }
  const data = await response.json();
  const renderedAt = new Date().toISOString();

  const bytesById = new Map<string, Uint8Array>();
  const candidates: RenderCandidate[] = [];
  for (const item of data.data ?? []) {
    const bytes = Uint8Array.from(atob(item.b64_json), (c) => c.charCodeAt(0));
    const candidateId = await fingerprintBytes(bytes);
    bytesById.set(candidateId, bytes);
    candidates.push({
      candidateId,
      draftRef: `drafts/${candidateId}.${opts.format}`,
      rendererId: ADAPTER_ID,
      rendererVersion: adapterVersion(),
      promptVersion: prompt.version,
      renderedAt,
    });
  }
  return { set: { promptVersion: prompt.version, candidates, cost: costEstimate(opts) }, bytes: bytesById };
}
