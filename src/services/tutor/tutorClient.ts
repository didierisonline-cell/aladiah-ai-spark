// =============================================================================
// Professor Didier™ — transport (WO-0015). One thin call through ai-proxy:
// keys stay in Supabase secrets, the model is allowlisted server-side, and
// every prompt is compiled by the pure core (professorDidier.ts) — no
// free-form persona text leaves the components.
// =============================================================================
import { supabase } from '@/integrations/supabase/client';
import { TUTOR_MAX_TOKENS, TUTOR_MODEL, TutorMessage, clampConversation } from './professorDidier';

export async function askProfessorDidier(system: string, messages: TutorMessage[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-proxy', {
    body: {
      model: TUTOR_MODEL,
      max_tokens: TUTOR_MAX_TOKENS,
      system,
      messages: clampConversation(messages).map((m) => ({ role: m.role, content: m.content })),
    },
  });
  if (error) throw new Error(error.message);
  const reply = data?.content?.[0]?.text;
  if (!reply) throw new Error(data?.error?.message || 'Prof. Didier did not answer — please try again.');
  return reply as string;
}
