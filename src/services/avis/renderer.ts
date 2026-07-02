// =============================================================================
// AVIS — the Visual Renderer Interface (roadmap step 1, WO-0009).
// PERMANENT INSTITUTIONAL ARCHITECTURE (Founder approval, 2026-07-02):
// "The Institution shall never depend upon a single rendering provider."
// Everything in AVIS consumes this interface; a vendor exists ONLY as an
// adapter behind it. OpenAI is the first approved renderer — its adapter
// ships with the server-side edge function work order (avis-render), never
// client-side (keys stay in Supabase secrets, per the ai-proxy pattern).
// Standards live in the Design Bible / Brand Standards / AVIS; the renderer
// executes them and defines nothing (FD-2026-016).
// =============================================================================
import { CompiledPrompt } from './promptCompiler';

export interface RendererCapabilities {
  /** e.g. ['1024x1024', '1792x1024'] — declared, not assumed. */
  sizes: string[];
  formats: string[];
  supportsVariations: boolean;
  supportsEdits: boolean;
  /** Max candidates per render call. */
  maxCandidates: number;
}

export interface RenderOptions {
  size: string;
  format: string;
  candidates: number;
  /** The department budget this spend draws from (cost ledger, §12). */
  budgetKey: string;
}

export interface CostEstimate {
  /** Unit price read from the provider AT CALL TIME — never hardcoded. */
  estimatedUsd: number | null; // null = provider not queried yet (honest)
  basis: string;
}

export interface RenderCandidate {
  /** Content hash — the future asset id if approved. */
  candidateId: string;
  /** Storage reference inside draft quarantine (never a public URL). */
  draftRef: string;
  rendererId: string;
  rendererVersion: string;
  promptVersion: string;
  renderedAt: string;
}

export interface CandidateSet {
  promptVersion: string;
  candidates: RenderCandidate[];
  cost: CostEstimate;
}

/**
 * The adapter seam — the ONLY place a rendering vendor exists in AVIS.
 * Adding or replacing a renderer is one adapter + founder enablement;
 * specs, prompts, standards, gates, storage, registry, and the Brain are
 * untouched (Integration Architecture §15).
 */
export interface VisualRenderer {
  id: string;
  version: string;
  capabilities(): RendererCapabilities;
  render(prompt: CompiledPrompt, opts: RenderOptions): Promise<CandidateSet>;
  cost(opts: RenderOptions): Promise<CostEstimate>;
}

// ---- Renderer registry (founder-enabled adapters only) -----------------------
const renderers = new Map<string, VisualRenderer>();
const enabled = new Set<string>();

export function registerRenderer(r: VisualRenderer): void {
  renderers.set(r.id, r);
}

/** Enablement is a founder decision executed as configuration, never assumed. */
export function enableRenderer(id: string): boolean {
  if (!renderers.has(id)) return false;
  enabled.add(id);
  return true;
}

export function getRenderer(id: string): VisualRenderer | null {
  return enabled.has(id) ? renderers.get(id) ?? null : null;
}

export function listRenderers(): { id: string; version: string; enabled: boolean }[] {
  return [...renderers.values()].map((r) => ({ id: r.id, version: r.version, enabled: enabled.has(r.id) }));
}

/**
 * The first approved renderer's identity (Founder decision, 2026-07-02).
 * The ADAPTER for it lives server-side (edge function `avis-render`) and is
 * registered by that work order — importing this constant is how the rest of
 * AVIS names the approved default without touching a vendor SDK.
 */
export const FIRST_APPROVED_RENDERER = 'open-gen-ai';
