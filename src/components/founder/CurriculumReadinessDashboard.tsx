import { useEffect, useMemo, useState } from 'react';
import {
  getProgramReadiness, getModuleReadiness, colorFor, DIM_DEFS,
  type ProgramReadinessReport, type ProgramRow, type ModuleReadinessRow,
} from '@/services/curriculum/programReadiness';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  RefreshCw, Loader2, CheckCircle2, Rocket, Wrench, AlertTriangle,
  Boxes, ClipboardList, FileQuestion, GraduationCap,
} from 'lucide-react';

const BAR: Record<string, string> = { green: 'bg-emerald-500', blue: 'bg-blue-500', yellow: 'bg-amber-500', red: 'bg-rose-500' };
const TEXT: Record<string, string> = { green: 'text-emerald-700', blue: 'text-blue-700', yellow: 'text-amber-700', red: 'text-rose-700' };

const Gauge = ({ pct, showFraction, have, target }: { pct: number; showFraction?: boolean; have?: number; target?: number }) => {
  const c = colorFor(pct);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${BAR[c]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[11px] ${TEXT[c]}`}>{showFraction && target != null ? `${have}/${target} · ` : ''}{pct}%</span>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone?: string }) => (
  <Card className="p-4 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tone ?? 'bg-primary/10 text-primary'}`}><Icon className="w-4.5 h-4.5" /></div>
    <div>
      <div className="text-xl font-bold leading-none">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  </Card>
);

const LaunchBadge = ({ p }: { p: ProgramRow }) =>
  p.launchReady
    ? <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" />Launch Ready</Badge>
    : <Badge variant="outline" className="text-muted-foreground">In Development</Badge>;

/** Program-level Curriculum Readiness — the founder curriculum operating screen. */
const CurriculumReadinessDashboard = () => {
  const [report, setReport] = useState<ProgramReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setReport(await getProgramReadiness()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const s = report?.summary;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Program-level readiness · launch gate · live Supabase</p>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Executive summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        <Stat icon={GraduationCap} label="Total Programs" value={s?.totalPrograms ?? 0} />
        <Stat icon={Rocket} label="Launch Ready" value={s?.launchReady ?? 0} tone="bg-emerald-100 text-emerald-700" />
        <Stat icon={Wrench} label="In Development" value={s?.inDevelopment ?? 0} tone="bg-blue-100 text-blue-700" />
        <Stat icon={AlertTriangle} label="Below 80%" value={s?.below80 ?? 0} tone="bg-rose-100 text-rose-700" />
        <Stat icon={Boxes} label="Total Assets" value={s?.totalAssets ?? 0} />
        <Stat icon={ClipboardList} label="Assets Pending Review" value={s?.assetsPendingReview ?? 0} tone="bg-amber-100 text-amber-700" />
        <Stat icon={FileQuestion} label="Questions Pending Review" value={s?.questionsPendingReview ?? 0} tone="bg-amber-100 text-amber-700" />
      </div>

      {loading ? (
        <div className="p-10 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin inline" /></div>
      ) : (
        <Tabs defaultValue="program">
          <TabsList>
            <TabsTrigger value="school">By School</TabsTrigger>
            <TabsTrigger value="program">By Program</TabsTrigger>
            <TabsTrigger value="module">By Module</TabsTrigger>
          </TabsList>

          <TabsContent value="school"><SchoolView report={report!} /></TabsContent>
          <TabsContent value="program"><ProgramView report={report!} /></TabsContent>
          <TabsContent value="module"><ModuleView report={report!} /></TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// ---- By Program -------------------------------------------------------------
const ProgramTable = ({ programs }: { programs: ProgramRow[] }) => (
  <Card className="p-0 overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-xs text-muted-foreground">
          <th className="px-4 py-2 text-left font-medium">Program</th>
          <th className="px-2 py-2 text-center font-medium">Modules</th>
          <th className="px-2 py-2 text-center font-medium">Readiness</th>
          <th className="px-2 py-2 text-center font-medium">Launch</th>
          {DIM_DEFS.map((d) => <th key={d.key} className="px-2 py-2 text-center font-medium whitespace-nowrap">{d.label}</th>)}
          <th className="px-3 py-2 text-center font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {programs.map((p) => (
          <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 align-middle">
            <td className="px-4 py-3">
              <div className="font-medium max-w-[16rem] truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.school}</div>
            </td>
            <td className="px-2 py-3 text-center text-xs">{p.completedModules}/{p.totalModules}</td>
            <td className="px-2 py-3"><Gauge pct={p.readinessScore} /></td>
            <td className="px-2 py-3"><Gauge pct={p.launchScore} /></td>
            {p.dims.map((d) => <td key={d.key} className="px-2 py-3"><Gauge pct={d.pct} showFraction={d.key !== 'certification' && d.key !== 'capstone'} have={d.have} target={d.target} /></td>)}
            <td className="px-3 py-3 text-center"><LaunchBadge p={p} /></td>
          </tr>
        ))}
        {!programs.length && <tr><td colSpan={DIM_DEFS.length + 5} className="px-4 py-8 text-center text-sm text-muted-foreground">No managed programs found.</td></tr>}
      </tbody>
    </table>
  </Card>
);
const ProgramView = ({ report }: { report: ProgramReadinessReport }) => (
  <div className="space-y-3">
    <ProgramTable programs={report.programs} />
    <p className="text-xs text-muted-foreground">
      Launch Ready requires the 7 gate dimensions (Lessons, Quiz Questions, Simulations, Projects, Interview Scenarios,
      Portfolio Work, Certification) all at 100%. Capstone &amp; AI Mentor inform readiness but do not gate launch.
    </p>
  </div>
);

// ---- By School --------------------------------------------------------------
const SchoolView = ({ report }: { report: ProgramReadinessReport }) => (
  <div className="space-y-6">
    {report.schools.map((g) => (
      <div key={g.school} className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{g.school}</h3>
          <Badge variant="secondary">{g.programs.length} program{g.programs.length === 1 ? '' : 's'}</Badge>
          <Badge className="bg-emerald-100 text-emerald-800">{g.launchReady} launch ready</Badge>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>avg readiness</span><Gauge pct={g.readiness} /></div>
        </div>
        <ProgramTable programs={g.programs} />
      </div>
    ))}
    {!report.schools.length && <Card className="p-8 text-center text-sm text-muted-foreground">No programs to group.</Card>}
  </div>
);

// ---- By Module --------------------------------------------------------------
const ModuleView = ({ report }: { report: ProgramReadinessReport }) => {
  const [courseId, setCourseId] = useState(report.programs[0]?.id ?? '');
  const [rows, setRows] = useState<ModuleReadinessRow[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getModuleReadiness(courseId).then((r) => { setRows(r); setLoading(false); });
  }, [courseId]);
  const dimKeys = useMemo(() => rows[0]?.dims ?? [], [rows]);

  return (
    <div className="space-y-3">
      <select className="rounded-lg border bg-background px-2.5 py-2 text-sm max-w-md" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        {report.programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
      </select>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : (
        <Card className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">Module</th>
                {dimKeys.map((d) => <th key={d.key} className="px-3 py-2 text-center font-medium whitespace-nowrap">{d.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.module} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="font-medium">M{m.module}</div><div className="text-xs text-muted-foreground max-w-[14rem] truncate">{m.title}</div></td>
                  {m.dims.map((d) => <td key={d.key} className="px-3 py-3"><Gauge pct={d.pct} showFraction={d.key !== 'certification'} have={d.have} target={d.target} /></td>)}
                </tr>
              ))}
              {!rows.length && <tr><td className="px-4 py-8 text-center text-sm text-muted-foreground">No modules for this program.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default CurriculumReadinessDashboard;
