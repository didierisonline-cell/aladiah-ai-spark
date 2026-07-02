// =============================================================================
// AVIS — the client seam to the Visual Render Platform (WO-0014).
// A thin, keyless caller: the browser sends the governed spec; EVERYTHING
// that matters happens server-side in avis-render (authoritative compile,
// rate limit, budget, cache, adapter, quarantine, ledger). No API key exists
// in this bundle — the SEC-002/3 lesson is structural, not aspirational.
// Callers must be founder/steward (admin): students never invoke generation.
// =============================================================================
import { supabase } from '@/integrations/supabase/client';
import { VisualSpecification } from './promptCompiler';
import { CandidateSet, CostEstimate, RendererCapabilities } from './renderer';

export interface RenderRequestOptions {
  size?: string;
  format?: string;
  candidates?: number;
  /** The founder-set budget this spend draws from; omitted = fails closed server-side. */
  budgetKey?: string;
}

async function invoke<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('avis-render', { body });
  if (error) throw new Error(`avis-render: ${error.message}`);
  if (data?.error) throw new Error(`avis-render: ${data.error}${data.violations ? ` — ${data.violations.join('; ')}` : ''}`);
  return data as T;
}

export function fetchRendererCapabilities(): Promise<{ rendererId: string; rendererVersion: string; capabilities: RendererCapabilities }> {
  return invoke({ action: 'capabilities' });
}

/** Cost before spend — feeds review UIs; the server reads founder-applied prices. */
export function estimateRenderCost(options: RenderRequestOptions): Promise<CostEstimate> {
  return invoke({ action: 'estimate', options });
}

/** Render governed candidates into draft quarantine. Admin-gated server-side. */
export function requestRender(spec: VisualSpecification, options: RenderRequestOptions = {}): Promise<CandidateSet & { cacheHit: boolean }> {
  return invoke({ action: 'render', spec, options });
}

/** Finalize an APPROVED draft into an immutable registered asset. */
export function registerAsset(input: { candidateId: string; altText: string; license: string; approvedBy: string; supersedes?: string | null }): Promise<{ assetId: string; storagePath: string; brainMarker: string }> {
  return invoke({ action: 'register', ...input });
}
