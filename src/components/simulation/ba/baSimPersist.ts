// Best-effort persistence for a completed Discovery Engagement. Saves the
// session, interview messages, captured findings, and 7-dimension scores to the
// ba_simulation* tables (apply migration 20260620120000 first). Silently no-ops
// when the user isn't authenticated or the tables don't exist yet, so the sim
// stays playable without a live DB. Tables aren't in the generated Supabase
// types, so calls are cast to `any` (esbuild build, no tsc type-check).
import { supabase } from '@/integrations/supabase/client';

export interface SavePayload {
  scenarioId?: string;
  total: number; grade: string; readiness: number; recommendation: string;
  report: unknown; story: unknown; dims: Record<string, number>;
  messages: { role: string; speaker: string; content: string }[];
  findings: { text: string; source: string }[];
}

export async function saveEngagement(p: SavePayload): Promise<string | null> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return null;
    const sb = supabase as any;
    const { data: sim, error } = await sb.from('ba_simulations').insert({
      user_id: user.id, scenario_id: p.scenarioId || 'aurora-returns', phase: 'recommendation', status: 'completed',
      score: p.total, grade: p.grade, readiness_score: p.readiness, recommendation: p.recommendation,
      report: p.report, story: p.story, completed_at: new Date().toISOString(),
    }).select('id').single();
    if (error || !sim?.id) return null;
    const id = sim.id as string;
    if (p.messages.length) await sb.from('ba_simulation_messages').insert(
      p.messages.map(m => ({ simulation_id: id, phase: 'interview', role: m.role, speaker: m.speaker, content: m.content })));
    if (p.findings.length) await sb.from('ba_simulation_findings').insert(
      p.findings.map(f => ({ simulation_id: id, text: f.text, source: f.source })));
    const dims = Object.entries(p.dims);
    if (dims.length) await sb.from('ba_simulation_scores').insert(
      dims.map(([dimension, score]) => ({ simulation_id: id, dimension, score })));
    return id;
  } catch {
    return null;
  }
}

// Simulation Readiness Score (v1) — a composite of simulation performance,
// portfolio quality (report completeness), interview readiness (story
// completeness), and a competency proxy. Future versions fold in real portfolio
// scoring, interview-engine results, and cross-module competency mastery.
export function readinessScore(opts: {
  total: number; reportComplete: boolean; storyComplete: boolean; competencyProxy: number;
}): number {
  const portfolio = opts.reportComplete ? 85 : 55;
  const interview = opts.storyComplete ? 85 : 55;
  return Math.round(opts.total * 0.45 + portfolio * 0.2 + interview * 0.15 + opts.competencyProxy * 0.2);
}
