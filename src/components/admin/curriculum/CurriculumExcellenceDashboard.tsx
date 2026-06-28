import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BookOpen, Bot, GitBranch, GraduationCap, Layers, Play, RefreshCw, Rocket, Send, ShieldCheck, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import { CURRICULUM_AGENT_SLUG, CurriculumAudit } from '@/types/curriculum';
import { CURRICULUM_STANDARDS } from '@/services/agents/curriculum/standards';
import { SCRUM_18_BLUEPRINT, SCRUM_18_TITLE } from '@/services/agents/curriculum/blueprint18';
import { delegateModule, delegateRedesign, getLatestAudit } from '@/services/agents/curriculumExcellenceAgent';
import { PROGRAM_ARCHITECTURES, WORLD_CLASS_CES, scoreBlueprint } from '@/services/standards/programStandard';
import { CANONICAL_MODULE_STRUCTURE, FUTURE_SPECS, REFERENCE_SPEC } from '@/services/standards/programFactory';
import { scoreProgramAIReadiness, AI_READY_BAR } from '@/services/standards/aiReadiness';
import ProgramScorecard from './ProgramScorecard';
import FlagshipArchitecturePanel from './FlagshipArchitecturePanel';
import FullCurriculumPanel from './FullCurriculumPanel';
import AIReadinessPanel from './AIReadinessPanel';

const STANDARD_EVAL = scoreBlueprint(SCRUM_18_BLUEPRINT, 'scrum');
const AI_READINESS = scoreProgramAIReadiness(SCRUM_18_BLUEPRINT);

const CurriculumExcellenceDashboard = () => {
  const { toast } = useToast();
  const [audit, setAudit] = useState<CurriculumAudit | null>(null);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [a, h] = await Promise.all([getLatestAudit(), aos.health.getAgentHealth(CURRICULUM_AGENT_SLUG)]);
      setAudit(a); setHealth(h);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const runAudit = useCallback(async () => {
    setRunning('audit');
    try {
      const o = await aos.orchestrator.runAgent(CURRICULUM_AGENT_SLUG, 'manual');
      toast({ title: o.ok ? 'Curriculum audit complete' : 'Audit failed', description: o.ok ? `Excellence ${(o.output as any)?.excellenceScore ?? '—'}% · ${(o.output as any)?.gaps ?? '—'} gaps.` : o.error ?? 'Unknown', variant: o.ok ? 'default' : 'destructive' });
    } finally { setRunning(null); refresh(); }
  }, [toast, refresh]);

  const delegateAll = useCallback(async () => {
    setRunning('all');
    try { const n = await delegateRedesign(); toast({ title: 'Redesign delegated', description: `${n} build task(s) queued to the Product Builder (QA-gated → founder approval).` }); }
    finally { setRunning(null); refresh(); }
  }, [toast, refresh]);

  const delegate = async (no: number) => { const n = await delegateModule(no); toast({ title: `Module ${no} delegated`, description: `${n} build task(s) queued.` }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> Curriculum Excellence</h1>
          <p className="text-sm text-muted-foreground">Course Completion → Career Transformation · pilot: AI Scrum Master (18-module redesign)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
          <Button variant="outline" onClick={runAudit} disabled={running !== null}><Play className={`w-4 h-4 mr-2 ${running === 'audit' ? 'animate-pulse' : ''}`} /> Run Audit</Button>
          <Button onClick={delegateAll} disabled={running !== null}><Rocket className={`w-4 h-4 mr-2 ${running === 'all' ? 'animate-pulse' : ''}`} /> Delegate Full Redesign</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Tile icon={Award} label={`CES (Standard ${STANDARD_EVAL.version})`} value={`${audit?.ces ?? STANDARD_EVAL.ces}/100`} accent={(audit?.ces ?? STANDARD_EVAL.ces) >= WORLD_CLASS_CES ? 'text-green-600' : 'text-amber-600'} />
        <Tile icon={Bot} label={`AI-Readiness (bar ${AI_READY_BAR})`} value={`${AI_READINESS.programScore}/100`} accent={AI_READINESS.ready ? 'text-green-600' : 'text-amber-600'} />
        <Tile icon={Target} label="Build Progress" value={`${audit?.excellence_score ?? 0}%`} accent={(audit?.excellence_score ?? 0) >= 70 ? 'text-green-600' : 'text-amber-600'} />
        <Tile icon={Layers} label="Target Modules" value={SCRUM_18_BLUEPRINT.length} />
        <Tile icon={BookOpen} label="Elements Present" value={audit?.present_count ?? 0} accent="text-green-600" />
        <Tile icon={GitBranch} label="Gaps" value={audit?.gap_count ?? 0} accent={(audit?.gap_count ?? 0) > 0 ? 'text-amber-600' : 'text-green-600'} />
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="scorecard"><Award className="w-3.5 h-3.5 mr-1" />Scorecard</TabsTrigger>
          <TabsTrigger value="full"><BookOpen className="w-3.5 h-3.5 mr-1" />Full Curriculum</TabsTrigger>
          <TabsTrigger value="standard"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Program Standard</TabsTrigger>
          <TabsTrigger value="ai-readiness"><Bot className="w-3.5 h-3.5 mr-1" />AI Readiness</TabsTrigger>
          <TabsTrigger value="audit"><Target className="w-3.5 h-3.5 mr-1" />Audit &amp; Gaps</TabsTrigger>
          <TabsTrigger value="standards"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Framework</TabsTrigger>
          <TabsTrigger value="blueprint"><Layers className="w-3.5 h-3.5 mr-1" />18-Module Blueprint</TabsTrigger>
          <TabsTrigger value="career"><GraduationCap className="w-3.5 h-3.5 mr-1" />Career Map</TabsTrigger>
          <TabsTrigger value="integration"><GitBranch className="w-3.5 h-3.5 mr-1" />Integration</TabsTrigger>
          <TabsTrigger value="health"><Award className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>

        <TabsContent value="scorecard"><ProgramScorecard /></TabsContent>
        <TabsContent value="full"><FullCurriculumPanel /></TabsContent>
        <TabsContent value="ai-readiness"><AIReadinessPanel /></TabsContent>

        <TabsContent value="standard" className="space-y-4">
          <Card className="border-primary/30">
            <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Aladiah Program Standard {STANDARD_EVAL.version} · Curriculum Excellence Score</p>
                <p className={`text-4xl font-bold ${STANDARD_EVAL.ces >= WORLD_CLASS_CES ? 'text-green-600' : 'text-amber-600'}`}>{STANDARD_EVAL.ces}/100</p>
              </div>
              <Badge className={STANDARD_EVAL.worldClass ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}>
                {STANDARD_EVAL.worldClass ? 'WORLD-CLASS (≥85, all critical met)' : `Below world-class — failed: ${STANDARD_EVAL.failedCritical.join(', ') || 'none'}`}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">10 Architectures &amp; dimension scores (reference: AI Scrum Master)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {STANDARD_EVAL.dimensions.map((d) => {
                const arch = PROGRAM_ARCHITECTURES.find((a) => a.id === d.id)!;
                return (
                  <div key={d.id}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-foreground">{d.name} <span className="text-muted-foreground">· weight {arch.weight} · min {d.threshold}{d.critical ? ' · critical' : ''}</span></span>
                      <span className={d.met ? 'text-green-600' : 'text-red-600'}>{d.score}{d.met ? ' ✓' : ' ✗'}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted"><div className={`h-1.5 rounded-full ${d.met ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${d.score}%` }} /></div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{arch.components.join(' · ')}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Program Factory</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Future programs are generated from the standard. Reference + planned specs:</p>
              {[REFERENCE_SPEC, ...FUTURE_SPECS].map((s) => (
                <div key={s.key} className="rounded-lg border border-border/60 p-3 bg-muted/20">
                  <p className="text-sm font-medium text-foreground">{s.name} {s.key === REFERENCE_SPEC.key && <Badge className="text-[8px] bg-primary text-primary-foreground ml-1">REFERENCE</Badge>}</p>
                  <p className="text-[11px] text-muted-foreground">{s.moduleCount} modules · program key {s.programKey} · {s.description}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold mb-1">Canonical module structure (every module)</p>
                <ul className="list-disc pl-5 text-[11px] text-muted-foreground space-y-0.5">{CANONICAL_MODULE_STRUCTURE.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">{SCRUM_18_TITLE}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{audit?.summary ?? 'Run the audit to analyze the current program against the Curriculum Excellence Framework.'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {(audit?.gaps ?? []).map((g) => (
                  <div key={g.no} className="rounded-lg border border-border/60 p-2.5 bg-muted/20">
                    <div className="flex items-center justify-between"><p className="text-xs font-medium text-foreground">M{g.no}. {g.title}</p><Badge variant={g.missing.length === 0 ? 'secondary' : 'outline'} className="text-[9px]">{g.present.length}/{g.present.length + g.missing.length}</Badge></div>
                    {g.missing.length > 0 && <p className="text-[10px] text-amber-600 mt-0.5">Missing: {g.missing.map((x) => x.replace(/_/g, ' ')).join(', ')}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {CURRICULUM_STANDARDS.map((s) => (
              <Card key={s.id}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{s.name}</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex flex-wrap gap-1">{s.requirements.map((r) => <Badge key={r} variant="outline" className="text-[9px]">{r}</Badge>)}</div>
                  <p className="text-[11px] text-muted-foreground">Target: {s.target}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blueprint"><FlagshipArchitecturePanel onDelegate={delegate} /></TabsContent>

        <TabsContent value="career">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Career Transformation Mapping</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {SCRUM_18_BLUEPRINT.map((m) => (
                <div key={m.no} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-1.5 bg-muted/20">
                  <span className="text-xs text-foreground">M{m.no}. {m.title}</span>
                  <span className="text-[11px] text-muted-foreground">{m.careerOutcome}</span>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground pt-2">Outcomes flow to the Student Success Agent (readiness scores) and the Placement Authority (employability + portfolio), closing the loop to employment.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Workforce Integration</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>The Curriculum Excellence Authority orchestrates the existing workforce — it does not duplicate it:</p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground/90">
                <li><span className="font-medium">Curriculum Excellence</span> audits the program and delegates module builds.</li>
                <li><span className="font-medium">Product Builder</span> generates the module/quiz/simulation/lab/portfolio artifacts.</li>
                <li><span className="font-medium">QA Authority</span> reviews each artifact (13 engines + benchmarks + validations).</li>
                <li><span className="font-medium">Founder</span> approves in the Founder Approval Queue (nothing auto-publishes).</li>
                <li><span className="font-medium">Student Success</span> &amp; <span className="font-medium">Placement</span> consume the resulting employability outcomes.</li>
              </ol>
              <Button onClick={delegateAll} disabled={running !== null} className="mt-2"><Rocket className="w-4 h-4 mr-2" /> Delegate Full 18-Module Redesign</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          {health ? <Card><CardContent className="p-5 text-sm"><p className="font-medium">{health.name}</p><p className="text-muted-foreground capitalize">Health: {health.health} · perf {health.performanceScore} · success {health.uptimePct}% · errors {health.errorCount}</p></CardContent></Card> : <p className="text-sm text-muted-foreground">Run the agent once to populate health.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Tile = ({ icon: Icon, label, value, accent = 'text-primary' }: { icon: React.ElementType; label: string; value: number | string; accent?: string }) => (
  <Card><CardContent className="p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${accent}`} /></div>
    <div className="min-w-0"><p className="text-lg font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>
  </CardContent></Card>
);

export default CurriculumExcellenceDashboard;
