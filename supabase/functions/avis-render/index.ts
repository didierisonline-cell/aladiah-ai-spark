// =============================================================================
// avis-render — the Visual Render Platform (Phase IV step 3, WO-0014,
// FEO-2026-001), built to the proven ai-proxy pattern (Integration
// Architecture §1). One function, one responsibility: execute governed
// renders and finalize approved assets.
//
//   action: 'capabilities' — the enabled adapter's declared surface
//   action: 'estimate'     — cost before spend (feeds the ledger, §12)
//   action: 'render'       — spec → server-side compile → adapter → QUARANTINE
//   action: 'register'     — approved draft → immutable asset (+ registry row)
//
// The gates, in order, for 'render': caller authorization (admin — students
// NEVER invoke generation, §10) → server-side prompt compilation from the
// governed spec (no raw user text reaches the renderer, §2/§11) → per-caller
// rate ceiling (§13, fail-closed configuration) → founder-set budget (§12,
// the hard limiter) → cache (reuse-before-regenerate, §8) → adapter. Every
// call writes the cost ledger; drafts land in private storage (drafts/) and
// the avis_drafts quarantine table — never publishable, never public (§3).
// Keys live in Supabase secrets. Deployment is founder-applied (Supabase
// CLI), per canon. THE RENDERER DEFINES NOTHING (FD-2026-016).
// =============================================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
import { compilePrompt, validateSpec } from "../../../src/services/avis/promptCompiler.ts";
import type { VisualSpecification } from "../../../src/services/avis/promptCompiler.ts";
import {
  AVIS_BUCKET,
  approvedStoragePath,
  decideBudget,
  decideRateLimit,
  draftStoragePath,
  ledgerEntry,
  renderCacheKey,
  sumLedgerUsd,
} from "../../../src/services/avis/renderPlatform.ts";
import { ADAPTER_ID, adapterVersion, capabilities, costEstimate, renderWithBytes } from "./openGenAI.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function service() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

async function callerId(req: Request): Promise<string> {
  const auth = req.headers.get("Authorization") ?? "";
  const caller = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await caller.auth.getUser();
  return user?.id ?? "unknown";
}

// ---- render ------------------------------------------------------------------
async function handleRender(req: Request, body: { spec: VisualSpecification; options?: { size?: string; format?: string; candidates?: number; budgetKey?: string } }): Promise<Response> {
  const db = service();
  const caller = await callerId(req);

  // 1) The governed spec compiles server-side — the authoritative compile.
  const violations = validateSpec(body.spec);
  if (violations.length) return json(422, { error: "spec rejected", violations });
  const prompt = compilePrompt(body.spec);

  const caps = capabilities();
  const opts = {
    size: body.options?.size ?? caps.sizes[0],
    format: body.options?.format ?? "png",
    candidates: Math.min(body.options?.candidates ?? 1, caps.maxCandidates),
    // No budgetKey → 'department:unassigned', which has no founder-set budget
    // row and therefore fails closed at the budget gate below.
    budgetKey: body.options?.budgetKey ?? "department:unassigned",
  };
  if (!caps.sizes.includes(opts.size)) return json(422, { error: `size '${opts.size}' not in adapter capabilities` });
  if (!caps.formats.includes(opts.format)) return json(422, { error: `format '${opts.format}' not in adapter capabilities` });

  // 2) Rate ceiling (fail-closed founder configuration).
  const configured = Deno.env.get("AVIS_RENDER_MAX_PER_HOUR");
  const maxPerHour = configured == null ? null : Number(configured);
  const hourAgo = new Date(Date.now() - 3600_000).toISOString();
  const { count: callsThisHour } = await db
    .from("avis_cost_ledger").select("id", { count: "exact", head: true })
    .eq("caller", caller).eq("cache_hit", false).gte("rendered_at", hourAgo);
  const rate = decideRateLimit(callsThisHour ?? 0, Number.isNaN(maxPerHour as number) ? null : maxPerHour);
  if (!rate.allowed) return json(429, { error: rate.reason });

  // 3) Budget — the hard limiter. spent is COMPUTED from the ledger.
  const { data: budgetRow } = await db
    .from("avis_budgets").select("budget_key, cap_usd").eq("budget_key", opts.budgetKey).maybeSingle();
  let budget: { capUsd: number; spentUsd: number } | null = null;
  if (budgetRow) {
    const { data: rows } = await db
      .from("avis_cost_ledger").select("total_usd").eq("budget_key", opts.budgetKey);
    const { knownUsd } = sumLedgerUsd((rows ?? []).map((r) => ({ totalUsd: r.total_usd })));
    budget = { capUsd: Number(budgetRow.cap_usd), spentUsd: knownUsd };
  }
  const budgetDecision = decideBudget(budget);
  if (!budgetDecision.allowed) return json(429, { error: budgetDecision.reason });

  // 4) Cache — reuse-before-regenerate. A hit spends nothing.
  const cacheKey = renderCacheKey(prompt, ADAPTER_ID, opts);
  const { data: cached } = await db
    .from("avis_render_cache").select("candidate_set").eq("cache_key", cacheKey).maybeSingle();
  const unitConfigured = Deno.env.get("AVIS_RENDER_UNIT_COST_USD");
  const unitCostUsd = unitConfigured == null || Number.isNaN(Number(unitConfigured)) ? null : Number(unitConfigured);
  const ledgerBase = {
    caller,
    budgetKey: opts.budgetKey,
    visualClass: body.spec.visualClass,
    rendererId: ADAPTER_ID,
    rendererVersion: adapterVersion(),
    promptVersion: prompt.version,
    size: opts.size,
    candidates: opts.candidates,
    unitCostUsd,
    renderedAt: new Date().toISOString(),
  };
  if (cached) {
    const entry = ledgerEntry({ ...ledgerBase, cacheHit: true });
    await db.from("avis_cost_ledger").insert(toLedgerRow(entry));
    return json(200, { ...cached.candidate_set, cacheHit: true });
  }

  // 5) The adapter executes. Candidates land in QUARANTINE, never public.
  const { set, bytes } = await renderWithBytes(prompt, opts);
  for (const c of set.candidates) {
    const raw = bytes.get(c.candidateId)!;
    await db.storage.from(AVIS_BUCKET).upload(draftStoragePath(c.candidateId, opts.format), raw, {
      contentType: `image/${opts.format}`,
      upsert: true, // content-addressed: identical bytes are the same object
    });
    await db.from("avis_drafts").upsert({
      candidate_id: c.candidateId,
      visual_class: body.spec.visualClass,
      spec_id: prompt.specId,
      prompt_version: prompt.version,
      state: "draft",
      created_at: c.renderedAt,
      renderer_id: ADAPTER_ID,
      renderer_version: adapterVersion(),
      requested_by: caller,
      storage_path: draftStoragePath(c.candidateId, opts.format),
    }, { onConflict: "candidate_id" });
  }
  const entry = ledgerEntry({ ...ledgerBase, cacheHit: false });
  await db.from("avis_cost_ledger").insert(toLedgerRow(entry));
  await db.from("avis_render_cache").upsert({ cache_key: cacheKey, candidate_set: set }, { onConflict: "cache_key" });
  return json(200, { ...set, cacheHit: false });
}

function toLedgerRow(e: ReturnType<typeof ledgerEntry>) {
  return {
    caller: e.caller,
    budget_key: e.budgetKey,
    visual_class: e.visualClass,
    renderer_id: e.rendererId,
    renderer_version: e.rendererVersion,
    prompt_version: e.promptVersion,
    size: e.size,
    candidates: e.candidates,
    unit_cost_usd: e.unitCostUsd,
    total_usd: e.totalUsd,
    cache_hit: e.cacheHit,
    rendered_at: e.renderedAt,
  };
}

// ---- register -----------------------------------------------------------------
// Finalizes an APPROVED draft into an immutable asset (§3/§5). The quarantine
// state machine lives in the reviewed client machinery; the server re-verifies
// the row's verdicts before anything becomes permanent — trust, then verify.
async function handleRegister(req: Request, body: {
  candidateId: string;
  altText: string;
  license: string;
  approvedBy: string;
  supersedes?: string | null;
}): Promise<Response> {
  const db = service();
  const { data: draft } = await db.from("avis_drafts").select("*").eq("candidate_id", body.candidateId).maybeSingle();
  if (!draft) return json(404, { error: "draft not found in quarantine" });
  if (draft.state !== "approved") return json(409, { error: `only APPROVED drafts become assets — draft is '${draft.state}' (quarantine is the sole entrance)` });
  if (!body.altText?.trim()) return json(422, { error: "altText is mandatory — the textual twin" });
  if (!body.license?.trim()) return json(422, { error: "license/provenance is mandatory" });
  if (!body.approvedBy?.trim()) return json(422, { error: "approvedBy identity is required (accountability per act)" });

  const format = (draft.storage_path as string).split(".").pop() ?? "png";
  const approvedPath = approvedStoragePath(draft.visual_class, draft.candidate_id, format);
  const { error: moveError } = await db.storage.from(AVIS_BUCKET).move(draft.storage_path, approvedPath);
  if (moveError && !/not found/i.test(moveError.message)) return json(500, { error: `storage move failed: ${moveError.message}` });

  const approvedOn = new Date().toISOString();
  const { error: insertError } = await db.from("avis_assets").insert({
    asset_id: draft.candidate_id,
    visual_class: draft.visual_class,
    spec_id: draft.spec_id,
    prompt_version: draft.prompt_version,
    renderer_id: draft.renderer_id,
    renderer_version: draft.renderer_version,
    requested_by: draft.requested_by,
    approved_by: body.approvedBy,
    approved_on: approvedOn,
    alt_text: body.altText.trim(),
    license: body.license.trim(),
    usage_sites: [],
    supersedes: body.supersedes ?? null,
    replaced_by: null,
    storage_path: approvedPath,
    brain_marker: `visual:${draft.candidate_id}:v1`,
  });
  if (insertError) return json(500, { error: `asset insert failed: ${insertError.message}` });
  if (body.supersedes) {
    await db.from("avis_assets").update({ replaced_by: draft.candidate_id }).eq("asset_id", body.supersedes);
  }
  return json(200, { assetId: draft.candidate_id, storagePath: approvedPath, brainMarker: `visual:${draft.candidate_id}:v1` });
}

// ---- entry ----------------------------------------------------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Founder/steward only — students never invoke generation (§10).
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    switch (body.action) {
      case "capabilities":
        return json(200, { rendererId: ADAPTER_ID, rendererVersion: adapterVersion(), capabilities: capabilities() });
      case "estimate": {
        const caps = capabilities();
        return json(200, costEstimate({
          size: body.options?.size ?? caps.sizes[0],
          format: body.options?.format ?? "png",
          candidates: body.options?.candidates ?? 1,
          budgetKey: body.options?.budgetKey ?? "unassigned",
        }));
      }
      case "render":
        return await handleRender(req, body);
      case "register":
        return await handleRegister(req, body);
      default:
        return json(400, { error: `unknown action '${body.action}' — one of capabilities|estimate|render|register` });
    }
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : String(e) });
  }
});
