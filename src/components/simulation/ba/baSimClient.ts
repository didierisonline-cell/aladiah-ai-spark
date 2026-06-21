// Client wrapper for the ba-simulation edge function. Every call degrades
// gracefully: if the function isn't deployed (or AI is unavailable), it returns
// null and the simulation falls back to its deterministic behaviour, so the
// experience is always playable. The dynamic-AI path lights up once the function
// is deployed (supabase functions deploy ba-simulation) with LOVABLE_API_KEY set.
import { supabase } from '@/integrations/supabase/client';

async function call(action: string, payload: Record<string, unknown>): Promise<any | null> {
  try {
    const { data, error } = await supabase.functions.invoke('ba-simulation', {
      body: { action, ...payload },
    });
    if (error || !data || (data as any).error) return null;
    return data;
  } catch {
    return null;
  }
}

export interface AiFinding { text: string; source: string; reliability: string; keySignal?: boolean }

export const baSim = {
  interview: (payload: { persona: any; question: string; history: any[]; company: string }) =>
    call('interview', payload) as Promise<{ reply: string; finding: AiFinding | null } | null>,
  evaluate: (payload: any) =>
    call('evaluate', payload) as Promise<{ dimensions: Record<string, number>; total: number; grade: string; feedback: string } | null>,
  report: (payload: any) =>
    call('report', payload) as Promise<{ problem: string; opportunities: string[]; evidence: string[]; recommendation: string; risks: string[]; confidence: string } | null>,
  story: (payload: any) =>
    call('story', payload) as Promise<{ situation: string; task: string; action: string; result: string; lessons: string } | null>,
};
