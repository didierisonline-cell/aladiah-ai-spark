import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import {
  AI_READINESS_DIMENSIONS,
  AI_READY_BAR,
  scoreProgramAIReadiness,
} from '@/services/standards/aiReadiness';
import { SCRUM_18_BLUEPRINT } from '@/services/agents/curriculum/blueprint18';

/**
 * AI-Readiness panel — renders the enforceable AI-Readiness Score (7 dimensions)
 * for the flagship blueprint: program score + dimension averages + per-module
 * pass/fail against the AI_READY_BAR (95). Complements the CES (Program Standard).
 */
const AIReadinessPanel = () => {
  const r = scoreProgramAIReadiness(SCRUM_18_BLUEPRINT);

  return (
    <div className="space-y-4">
      <Card className="border-primary/30">
        <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Bot className="w-3.5 h-3.5" /> AI-Readiness Score · launch bar {AI_READY_BAR}+ (every module)</p>
            <p className={`text-4xl font-bold ${r.ready ? 'text-green-600' : 'text-amber-600'}`}>{r.programScore}/100</p>
          </div>
          <Badge className={r.ready ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}>
            {r.ready ? `AI-READY (≥${AI_READY_BAR}, 0 modules below bar)` : `Not AI-ready — ${r.belowBar.length} module(s) below ${AI_READY_BAR}`}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">7 AI-readiness dimensions (program averages)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {AI_READINESS_DIMENSIONS.map((d) => {
            const score = r.dimensionAverages[d.id] ?? 0;
            const met = score >= AI_READY_BAR;
            return (
              <div key={d.id}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-foreground">{d.name} <span className="text-muted-foreground">· weight {d.weight}</span></span>
                  <span className={met ? 'text-green-600' : 'text-amber-600'}>{score}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted"><div className={`h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${score}%` }} /></div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Per-module AI-readiness</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {r.modules.map((m) => (
              <div key={m.no} className="rounded-lg border border-border/60 p-2.5 bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground truncate">M{m.no}. {m.title}</p>
                  <Badge className={`text-[9px] shrink-0 ${m.ready ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>{m.score}</Badge>
                </div>
                {!m.ready && <p className="text-[10px] text-amber-600 mt-0.5">Weakest: {m.weakest.map((w) => `${w.name} ${w.score}`).join(' · ')}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIReadinessPanel;
