// =============================================================================
// Aladiah Chief Growth Officer (CGO) Agent — service
// =============================================================================
// A first-class AOS citizen. It:
//  - is registered in the Agent Registry (see services/aos/bootstrap.ts)
//  - logs every action to Execution Logs
//  - stores growth themes / winning assets in Agent Memory
//  - runs through the Orchestrator
//  - accepts delegated tasks via the Task Manager + Communication Layer
//  - respects the Permissions Framework (publish is gated; human approval required)
//
// APPROVAL RULE: every generated asset lands at status 'pending_approval'.
// Nothing publishes automatically. Low-risk assets (organic copy, hooks,
// calendars) are auto-staged; high-risk assets (spend, pricing, outcomes
// claims, partnerships) require explicit founder sign-off.
//
// Architecture: 12 sub-agent engines are wired here in v1 (deterministic).
// Phase 2 swaps each engine for a Claude call (server-side edge function)
// behind the same GrowthAsset contract.
// =============================================================================

import { db, nowISO } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { reportToCeo } from '@/services/aos/communication';
import { guard, ApprovalRequiredError } from '@/services/aos/permissions';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  GrowthAsset,
  HookBankEntry,
  ScoredHook,
  LaunchDayAssets,
  DailyGrowthBrief,
  EmailAsset,
  LeadMagnetSpec,
  FounderBrandPlan,
  buildHookBank,
  generateHooks,
  selectTopHooks,
  linkedinAuthorityPosts,
  shortVideoScripts,
  launchEmailSequence,
  buildLaunchCampaign,
  cameroonGrowthAssets,
  dominicanRepublicGrowthAssets,
  employerTrustAssets,
  leadMagnetSpecs,
  founderBrandPlan,
  buildDailyBrief,
} from './growth/engines';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CGO_AGENT_SLUG = 'chief-growth-officer';
const GROWTH_ASSETS = 'cgo_growth_assets';
const GROWTH_CAMPAIGNS = 'cgo_growth_campaigns';
const HOOK_BANK = 'cgo_hook_bank';
const GROWTH_BRIEFS = 'cgo_growth_briefs';

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

async function persistGrowthAsset(
  asset: GrowthAsset,
  opts: { campaignId?: string; runId?: string | null } = {},
): Promise<string | null> {
  // Gate logic: rejected assets are logged but not persisted
  if (asset.excellence?.gate === 'reject') {
    await logAction(CGO_AGENT_SLUG, 'asset_rejected_by_gate', {
      runId: opts.runId,
      level: 'warn',
      result: 'rejected',
      message: `Score ${asset.score} < 80 — "${asset.title}" rejected by Content Excellence Gate`,
      detail: { channel: asset.channel, score: asset.score, excellence: asset.excellence },
    });
    return null;
  }

  // 'revise' gate: staged but marked for revision, not publish
  const status = asset.excellence?.gate === 'revise' ? 'needs_revision' : 'pending_approval';

  const row = {
    agent_slug: CGO_AGENT_SLUG,
    sub_agent: asset.sub_agent,
    channel: asset.channel,
    content_type: asset.content_type,
    audience: asset.audience,
    flywheel_stage: asset.flywheel_stage,
    risk_tier: asset.risk_tier,
    title: asset.title,
    hook: asset.hook,
    body: asset.body,
    cta: asset.cta,
    proof_source: asset.proof_source,
    kpi_target: asset.kpi_target,
    score: asset.score,
    hashtags: asset.hashtags,
    // Store full 5-gate breakdown in metadata for founder review
    metadata: {
      ...asset.metadata,
      excellence: asset.excellence,
      kane_score: asset.excellence?.kane?.total,
      hormozi_score: asset.excellence?.hormozi?.total,
      trust_score: asset.excellence?.trust?.total,
      transformation_score: asset.excellence?.transformation?.total,
      employment_score: asset.excellence?.employment?.total,
      gate: asset.excellence?.gate,
    },
    status,
    campaign_id: opts.campaignId ?? null,
    created_by_agent: CGO_AGENT_SLUG,
  };

  const { data, error } = await db.from(GROWTH_ASSETS).insert(row).select('id').single();
  if (error) {
    await logAction(CGO_AGENT_SLUG, 'persist_asset', {
      runId: opts.runId,
      level: 'error',
      result: 'error',
      error: error.message,
      detail: { channel: asset.channel, title: asset.title },
    });
    return null;
  }
  return data?.id ?? null;
}

async function persistHookBank(
  hooks: HookBankEntry[],
  runId?: string | null,
): Promise<number> {
  let saved = 0;
  for (const h of hooks) {
    const { error } = await db.from(HOOK_BANK).insert({
      agent_slug: CGO_AGENT_SLUG,
      hook: h.hook,
      bucket: h.bucket,
      audience: h.audience,
      channel: h.channel,
      emotional_trigger: h.emotional_trigger,
      shareability: h.shareability,
      controversy: h.controversy,
      trust: h.trust,
    });
    if (!error) saved++;
  }
  await logAction(CGO_AGENT_SLUG, 'persist_hook_bank', {
    runId,
    result: 'success',
    message: `Saved ${saved} of ${hooks.length} hooks`,
  });
  return saved;
}

// ---------------------------------------------------------------------------
// Public API — used by dashboard, admin panel, and the orchestrator runner
// ---------------------------------------------------------------------------

/** Generate the full 100-hook bank and persist it. */
export async function generateHookBank(
  count = 100,
  runId?: string | null,
): Promise<HookBankEntry[]> {
  const hooks = buildHookBank(count);
  await persistHookBank(hooks, runId);
  await remember({
    agentSlug: CGO_AGENT_SLUG,
    content: `Generated ${hooks.length} hooks across 9 buckets`,
    summary: 'hook_bank_v1',
    type: 'long_term',
    tags: ['hook_bank', 'launch'],
    source: runId ?? undefined,
  });
  return hooks;
}

/** Generate LinkedIn authority posts (founder-led, proof-heavy). */
export async function generateLinkedInPosts(
  count = 10,
  campaignId?: string,
  runId?: string | null,
): Promise<GrowthAsset[]> {
  const assets = linkedinAuthorityPosts(count);
  for (const a of assets) {
    await persistGrowthAsset(a, { campaignId, runId });
  }
  await logAction(CGO_AGENT_SLUG, 'generate_linkedin_posts', {
    runId,
    result: 'success',
    message: `${assets.length} LinkedIn posts staged for approval`,
    detail: { count: assets.length },
  });
  return assets;
}

/** Generate short-form video scripts (Reels / TikTok / Shorts). */
export async function generateVideoScripts(
  count = 10,
  campaignId?: string,
  runId?: string | null,
): Promise<GrowthAsset[]> {
  const assets = shortVideoScripts(count);
  for (const a of assets) {
    await persistGrowthAsset(a, { campaignId, runId });
  }
  await logAction(CGO_AGENT_SLUG, 'generate_video_scripts', {
    runId,
    result: 'success',
    message: `${assets.length} video scripts staged for approval`,
  });
  return assets;
}

/** Generate full launch email sequence. */
export async function generateLaunchEmails(
  runId?: string | null,
): Promise<EmailAsset[]> {
  const emails = launchEmailSequence();
  const { error } = await db.from(GROWTH_ASSETS).insert(
    emails.map((e) => ({
      agent_slug: CGO_AGENT_SLUG,
      sub_agent: 'email-revenue',
      channel: 'email',
      content_type: e.content_type ?? 'launch_email',
      audience: 'career_changers',
      flywheel_stage: e.flywheel_stage,
      risk_tier: 'low',
      title: e.subject,
      hook: e.preview_text,
      body: e.body,
      cta: e.cta_text,
      proof_source: 'Aladiah launch system',
      kpi_target: 'open rate + CTOR + conversion',
      score: 88,
      hashtags: [],
      metadata: { sequence: e.sequence, position: e.position, trigger: e.trigger },
      status: 'pending_approval',
      created_by_agent: CGO_AGENT_SLUG,
    })),
  );
  await logAction(CGO_AGENT_SLUG, 'generate_launch_emails', {
    runId,
    result: error ? 'error' : 'success',
    message: error ? error.message : `${emails.length} emails staged for approval`,
  });
  return emails;
}

/** Build the complete June 19 launch campaign (T-4 through T+7). */
export async function generateLaunchCampaign(
  runId?: string | null,
): Promise<{ campaignId: string | null; days: LaunchDayAssets[] }> {
  // Create parent campaign record
  const { data: campaign, error: camErr } = await db
    .from(GROWTH_CAMPAIGNS)
    .insert({
      name: 'June 19 Launch — AI-Powered Career Transformation Ecosystem',
      objective: 'Launch Aladiah as the category-defining AI career transformation ecosystem',
      status: 'active',
      theme: 'launch',
      launch_date: '2026-06-19',
      created_by_agent: CGO_AGENT_SLUG,
    })
    .select('id')
    .single();

  const campaignId: string | null = camErr ? null : (campaign?.id ?? null);

  const days = buildLaunchCampaign();
  for (const day of days) {
    const assets: GrowthAsset[] = [
      day.linkedin_post,
      day.instagram_caption,
      day.reel_script,
      day.tiktok_script,
      day.email,
      day.community_post,
    ];
    for (const a of assets) {
      await persistGrowthAsset(a, { campaignId: campaignId ?? undefined, runId });
    }
  }

  await logAction(CGO_AGENT_SLUG, 'generate_launch_campaign', {
    runId,
    result: 'success',
    message: `Launch campaign: ${days.length} days × 6 assets = ${days.length * 6} assets staged`,
    detail: { campaignId, days: days.length },
  });

  await remember({
    agentSlug: CGO_AGENT_SLUG,
    content: `Launch campaign created. ${days.length} days, ${days.length * 6} assets. Campaign ID: ${campaignId}`,
    summary: 'launch_campaign_june_19',
    type: 'long_term',
    tags: ['launch', 'june_19', 'campaign'],
    source: runId ?? undefined,
  });

  return { campaignId, days };
}

/** Generate regional assets — Cameroon/Africa. */
export async function generateCameroonAssets(
  runId?: string | null,
): Promise<GrowthAsset[]> {
  const assets = cameroonGrowthAssets();
  for (const a of assets) {
    await persistGrowthAsset(a, { runId });
  }
  await logAction(CGO_AGENT_SLUG, 'generate_cameroon_assets', {
    runId,
    result: 'success',
    message: `${assets.length} Cameroon/Africa assets staged`,
  });
  return assets;
}

/** Generate regional assets — Dominican Republic. */
export async function generateDRAssets(
  runId?: string | null,
): Promise<GrowthAsset[]> {
  const assets = dominicanRepublicGrowthAssets();
  for (const a of assets) {
    await persistGrowthAsset(a, { runId });
  }
  await logAction(CGO_AGENT_SLUG, 'generate_dr_assets', {
    runId,
    result: 'success',
    message: `${assets.length} Dominican Republic assets staged`,
  });
  return assets;
}

/** Generate employer trust assets (risk_tier: medium — requires founder review). */
export async function generateEmployerAssets(
  runId?: string | null,
): Promise<GrowthAsset[]> {
  await guard({ agentSlug: CGO_AGENT_SLUG, action: 'generate_employer_content', risk: 'medium' });
  const assets = employerTrustAssets();
  for (const a of assets) {
    await persistGrowthAsset(a, { runId });
  }
  await logAction(CGO_AGENT_SLUG, 'generate_employer_assets', {
    runId,
    result: 'success',
    message: `${assets.length} employer trust assets staged (medium risk — founder review required)`,
  });
  return assets;
}

/** Return the 5 lead magnet specs (spec only; creative production delegated to Marketing Content Agent). */
export function getLeadMagnetSpecs(): LeadMagnetSpec[] {
  return leadMagnetSpecs();
}

/** Return the founder personal brand plan. */
export function getFounderBrandPlan(): FounderBrandPlan {
  return founderBrandPlan();
}

/** Build and persist today's Daily Growth Brief. */
export async function generateDailyBrief(
  date: string,
  launchDayRelative: string,
  assetsCreated: number,
  approvalsPending: string[],
  risks: string[],
  runId?: string | null,
): Promise<DailyGrowthBrief> {
  const brief = buildDailyBrief(date, launchDayRelative, assetsCreated, approvalsPending, risks);

  await db.from(GROWTH_BRIEFS).insert({
    agent_slug: CGO_AGENT_SLUG,
    date,
    launch_day_relative: launchDayRelative,
    overall_status: brief.overall_status,
    created_count: brief.created_count,
    flywheel_coverage: brief.flywheel_coverage,
    platform_coverage: brief.platform_coverage,
    top_priorities: brief.top_priorities,
    approval_queue: brief.approval_queue,
    risks: brief.risks,
    recommendation: brief.recommendation,
    created_by_agent: CGO_AGENT_SLUG,
  });

  await logAction(CGO_AGENT_SLUG, 'generate_daily_brief', {
    runId,
    result: 'success',
    message: `Daily brief ${date} — status: ${brief.overall_status}`,
  });

  return brief;
}

// ---------------------------------------------------------------------------
// Orchestrator runner
// ---------------------------------------------------------------------------

/**
 * Full CGO run: generates the launch campaign system on first run,
 * then produces a daily brief on subsequent runs.
 */
export const cgoRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const runId = ctx.runId ?? null;
  const today = new Date().toISOString().slice(0, 10);

  await ctx.log('cgo_start', { message: 'CGO Agent starting daily growth execution' });

  // Check if launch campaign has already been created this week
  const { data: existingCampaign } = await db
    .from(GROWTH_CAMPAIGNS)
    .select('id')
    .eq('theme', 'launch')
    .limit(1);

  const isFirstRun = !existingCampaign || existingCampaign.length === 0;

  let assetsCreated = 0;
  const risks: string[] = [];
  const approvalsPending: string[] = [];

  try {
    if (isFirstRun) {
      // === FULL SYSTEM BOOTSTRAP ===
      await ctx.log('cgo_bootstrap', { message: 'First run: bootstrapping full CGO system' });

      // 1. Hook bank
      await generateHookBank(100, runId);
      assetsCreated += 100;
      await ctx.log('hook_bank', { result: 'success', message: '100 hooks generated' });

      // 2. LinkedIn posts
      const li = await generateLinkedInPosts(10, undefined, runId);
      assetsCreated += li.length;
      await ctx.log('linkedin_posts', { result: 'success', message: `${li.length} posts staged` });

      // 3. Video scripts
      const vid = await generateVideoScripts(10, undefined, runId);
      assetsCreated += vid.length;
      await ctx.log('video_scripts', { result: 'success', message: `${vid.length} scripts staged` });

      // 4. Launch campaign (T-4 to T+7)
      const { campaignId, days } = await generateLaunchCampaign(runId);
      assetsCreated += days.length * 6;
      approvalsPending.push(`Launch campaign (${days.length * 6} assets) — campaign ID: ${campaignId}`);
      await ctx.log('launch_campaign', { result: 'success', message: `${days.length * 6} launch assets staged` });

      // 5. Email sequence
      const emails = await generateLaunchEmails(runId);
      assetsCreated += emails.length;
      approvalsPending.push(`Email sequences (${emails.length} emails) — review before activation`);
      await ctx.log('launch_emails', { result: 'success', message: `${emails.length} emails staged` });

      // 6. Regional assets
      const cam = await generateCameroonAssets(runId);
      const dr = await generateDRAssets(runId);
      assetsCreated += cam.length + dr.length;
      await ctx.log('regional_assets', { result: 'success', message: `${cam.length + dr.length} regional assets staged` });

      // 7. Employer assets (medium risk — auto-staged, founder review required)
      try {
        const emp = await generateEmployerAssets(runId);
        assetsCreated += emp.length;
        approvalsPending.push(`Employer trust assets (${emp.length}) — medium risk, founder approval required before publish`);
      } catch (e) {
        if (e instanceof ApprovalRequiredError) {
          risks.push('Employer assets blocked pending approval — check permissions');
        }
      }

    } else {
      // === DAILY GROWTH BRIEF ===
      await ctx.log('cgo_daily', { message: 'Generating daily growth brief' });

      // Generate 25 hooks per daily topic, rank by Kane score, persist top scorers
      const dailyTopics = ['AI Scrum Master', 'career transformation', 'Talent Score', 'AI workforce'];
      let hookCount = 0;
      for (const topic of dailyTopics) {
        const scored = generateHooks(topic, 25);
        const top3 = selectTopHooks(scored, 3);
        const bankEntries = scored.map((h) => ({
          hook: h.hook,
          bucket: h.bucket,
          audience: 'career_changers' as const,
          channel: 'linkedin' as const,
          emotional_trigger: h.emotion_trigger,
          shareability: h.shareability,
          controversy: h.controversy,
          trust: 7,
        }));
        hookCount += await persistHookBank(bankEntries, runId);
        await logAction(CGO_AGENT_SLUG, 'daily_hook_test', {
          runId,
          result: 'success',
          message: `Topic "${topic}": top hook score ${top3[0]?.kane_score ?? 0} — "${top3[0]?.hook}"`,
          detail: { topic, top3: top3.map((h) => ({ hook: h.hook, score: h.kane_score })) },
        });
      }
      assetsCreated += hookCount;
    }

    // Build and persist the daily brief
    const daysToLaunch = Math.ceil(
      (new Date('2026-06-19').getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24),
    );
    const relative = daysToLaunch > 0 ? `T-${daysToLaunch}` : daysToLaunch === 0 ? 'Launch' : `T+${Math.abs(daysToLaunch)}`;

    const brief = await generateDailyBrief(today, relative, assetsCreated, approvalsPending, risks, runId);

    // Report to CEO agent
    await reportToCeo({
      fromAgent: CGO_AGENT_SLUG,
      subject: `CGO Daily Brief ${today} — ${relative} — ${assetsCreated} assets, status: ${brief.overall_status}`,
      body: JSON.stringify({
        date: today,
        launch_day: relative,
        assets_created: assetsCreated,
        approvals_pending: approvalsPending,
        risks,
        recommendation: brief.recommendation,
        is_first_run: isFirstRun,
      }),
      priority: brief.overall_status === 'red' ? 'high' : 'normal',
    });

    await ctx.log('cgo_complete', {
      result: 'success',
      message: `CGO run complete. ${assetsCreated} assets created. Status: ${brief.overall_status}.`,
    });

    return {
      ok: true,
      output: {
        date: today,
        launch_day_relative: relative,
        assets_created: assetsCreated,
        approvals_pending: approvalsPending,
        risks,
        brief_status: brief.overall_status,
        is_first_run: isFirstRun,
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logAction(CGO_AGENT_SLUG, 'cgo_runner_error', {
      runId,
      level: 'error',
      result: 'error',
      error: msg,
    });
    return { ok: false, error: msg };
  }
};
