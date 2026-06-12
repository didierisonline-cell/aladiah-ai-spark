import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, RefreshCw, Trash2, ChevronRight, ChevronDown, Archive, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  ASSET_TYPES, AssetType, AssetStatus, STATUS_FLOW, metaFor,
  listAssets, createAsset, setStatus, updateAsset, removeAsset, archiveAsset,
  approveAllForCourse, publishAllForCourse,
  listAudit, getCourseIntel, getProgramSummary,
  type ContentAsset, type AuditEntry, type CourseIntel, type ProgramSummary,
} from '@/services/curriculum/contentStore';
import { generateAssets, generateAllAssets } from '@/services/curriculum/productBuilder';
import { listManagedCourses, FLAGSHIP_V2_NAME } from '@/services/curriculum/courses';
import { buildFlagshipV2, upgradeToFlagshipV3 } from '@/services/curriculum/flagshipBuilder';
import { getAcademyReadiness, recomputeLaunch } from '@/services/curriculum/readiness';

const STATUS_STYLE: Record<AssetStatus, string> = {
  draft: 'bg-slate-500/15 text-slate-400', in_review: 'bg-amber-500/15 text-amber-500',
  approved: 'bg-blue-500/15 text-blue-500', published: 'bg-green-500/15 text-green-500',
  archived: 'bg-zinc-700/30 text-zinc-500',
};
const sel = 'h-9 rounded-md border border-input bg-background px-3 text-sm';
const TYPE_FIELDS: Record<AssetType, string[]> = {
  simulations: ['scenario_type', 'industry', 'complexity', 'role', 'expected_deliverables', 'grading_rubric'],
  portfolios: ['portfolio_category', 'employer_value_score', 'interview_relevance_score'],
  interview: ['company_type', 'interview_stage', 'expected_answers', 'evaluation_criteria'],
  mentor: ['mentor_persona', 'coaching_type', 'competency_area'],
  certifications: ['passing_score', 'exam_duration', 'credential_level'],
  capstones: ['project_type', 'business_domain', 'estimated_hours'],
  labs: ['tool', 'task', 'deliverable'],
  executive: ['crisis_type', 'exec_stakeholders', 'board_presentation', 'scenario', 'grading_rubric'],
  copilot: ['ai_tool', 'challenge', 'expected_output', 'evaluation_criteria'],
  employer: ['employer', 'checkpoint', 'validation_criteria'],
};
const LABEL: Record<string, string> = {
  scenario_type: 'Scenario', industry: 'Industry', complexity: 'Complexity', role: 'Role', expected_deliverables: 'Deliverables', grading_rubric: 'Rubric',
  portfolio_category: 'Category', employer_value_score: 'Employer value', interview_relevance_score: 'Interview relevance',
  company_type: 'Company', interview_stage: 'Stage', expected_answers: 'Expected answers', evaluation_criteria: 'Criteria',
  mentor_persona: 'Persona', coaching_type: 'Coaching', competency_area: 'Competency',
  passing_score: 'Passing', exam_duration: 'Duration (min)', credential_level: 'Level',
  project_type: 'Project', business_domain: 'Domain', estimated_hours: 'Hours',
  tool: 'Tool', task: 'Task', deliverable: 'Deliverable', scenario: 'Scenario',
  crisis_type: 'Crisis', exec_stakeholders: 'Stakeholders', board_presentation: 'Board presentation',
  ai_tool: 'AI tool', challenge: 'Challenge', expected_output: 'Expected output',
  employer: 'Employer', checkpoint: 'Checkpoint', validation_criteria: 'Validation criteria',
};
const fmt = (v: any): string => {
  if (v == null || v === '') return '—';
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
  if (typeof v === 'object') { const k = Object.keys(v); return k.length ? k.join(', ') : '—'; }
  return String(v);
};
const date = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : '—');

const ContentAuthoringCenter = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const author = user?.email || 'founder';
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [courseId, setCourseId] = useState('');
  const [intel, setIntel] = useState<CourseIntel | null>(null);
  const [summary, setSummary] = useState<ProgramSummary | null>(null);
  const [academy, setAcademy] = useState<{ above: number; below: number }>({ above: 0, below: 0 });
  const [chapters, setChapters] = useState<{ id: string; title: string }[]>([]);
  const [type, setType] = useState<AssetType>('simulations');
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ title: '', chapterId: '', level: 'beginner', kind: 'behavioral', completion: 60 });
  const [f, setF] = useState({ status: 'all', chapterId: '', qualityMin: 0, readinessMin: 0, ai: 'all', human: 'all', published: 'all' });

  const meta = metaFor(type);
  const course = courses.find((c) => c.id === courseId);
  const chapterName = useMemo(() => new Map(chapters.map((c) => [c.id, c.title])), [chapters]);

  useEffect(() => { (async () => {
    const list = await listManagedCourses(); setCourses(list);
    if (list.length && !courseId) setCourseId(list[0].id);
    const r = await getAcademyReadiness();
    setAcademy({ above: r.programs.filter((p) => p.readiness >= 90).length, below: r.programs.filter((p) => p.readiness < 90).length });
  })(); }, []); // eslint-disable-line

  useEffect(() => { if (!courseId) return; (async () => {
    const [chs, ci, sm] = await Promise.all([
      (async () => { try { const { data } = await (await import('@/services/aos/_internal')).db.from('chapters').select('id, title, order_index').eq('course_id', courseId).order('order_index'); return (data ?? []) as any[]; } catch { return []; } })(),
      getCourseIntel(courseId), getProgramSummary(courseId),
    ]);
    setChapters(chs); setIntel(ci); setSummary(sm);
  })(); }, [courseId]);

  const refresh = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try { const [a, au, sm] = await Promise.all([listAssets(courseId, type), listAudit(courseId, 15), getProgramSummary(courseId)]); setAssets(a); setAudit(au); setSummary(sm); }
    finally { setLoading(false); }
  }, [courseId, type]);
  useEffect(() => { refresh(); }, [refresh]);

  const create = async () => {
    if (!form.title.trim()) { toast({ title: 'Title required', variant: 'destructive' }); return; }
    setBusy(true);
    const r = await createAsset(type, { courseId, chapterId: meta.level === 'module' ? (form.chapterId || null) : null, title: form.title.trim(), author, completion_pct: form.completion, level: form.level, kind: form.kind, deliverable: form.title.trim() });
    setBusy(false);
    if (r.ok) { toast({ title: `${meta.label} draft created` }); setShowNew(false); setForm({ ...form, title: '' }); refresh(); }
    else toast({ title: 'Create failed', description: r.error, variant: 'destructive' });
  };
  const generate = async () => { if (!course) return; setBusy(true); const r = await generateAssets(courseId, course.title, type, author); setBusy(false); if (r.created > 0) { toast({ title: `Drafted ${r.created} ${meta.label}` }); refresh(); } else toast({ title: 'Nothing generated', description: r.error, variant: r.error ? 'destructive' : 'default' }); };
  const generateAll = async () => { if (!course) return; setBusy(true); const r = await generateAllAssets(courseId, course.title, author); setBusy(false); if (r.total > 0) { toast({ title: `Drafted ${r.total} assets` }); refresh(); } else toast({ title: 'Nothing generated', description: r.error, variant: r.error ? 'destructive' : 'default' }); };
  const buildFlagship = async () => { setBusy(true); const r = await buildFlagshipV2(author); setBusy(false); if (r.ok) { toast({ title: 'Flagship v2 built', description: `${r.modules} modules · ${r.lessons} lessons · ${r.quizzes} quizzes · ${r.assets} assets` }); const list = await listManagedCourses(); setCourses(list); const fl = list.find((c) => c.title === FLAGSHIP_V2_NAME); if (fl) setCourseId(fl.id); } else toast({ title: 'Build failed', description: r.error, variant: 'destructive' }); };
  const upgradeV3 = async () => {
    if (!window.confirm('Upgrade the flagship to v3? Adds labs, executive sims, AI co-pilot challenges, employer validation, and the Enterprise Transformation capstone. Existing assets are preserved.')) return;
    setBusy(true); const r = await upgradeToFlagshipV3(author); setBusy(false);
    if (r.ok) { toast({ title: 'Upgraded to Flagship v3', description: `${r.assets} assets ensured · ${Object.entries(r.byType || {}).map(([k, v]) => `${k}:${v}`).join(' · ')}` }); const list = await listManagedCourses(); setCourses(list); const fl = list.find((c) => c.title === FLAGSHIP_V2_NAME); if (fl) setCourseId(fl.id); refresh(); }
    else toast({ title: 'Upgrade failed', description: r.error, variant: 'destructive' });
  };
  const syncLaunch = async () => { try { await recomputeLaunch(courseId); setIntel(await getCourseIntel(courseId)); const r = await getAcademyReadiness(); setAcademy({ above: r.programs.filter((p) => p.readiness >= 90).length, below: r.programs.filter((p) => p.readiness < 90).length }); } catch { /* ignore */ } };
  const advance = async (a: ContentAsset) => { const i = STATUS_FLOW.indexOf(a.status); const next = STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)]; if (next !== a.status && await setStatus(type, a.id, next, author)) { toast({ title: `→ ${next.replace('_', ' ')}` }); refresh(); syncLaunch(); } };
  const editPct = async (a: ContentAsset, d: number) => { const pct = Math.max(0, Math.min(100, (a.completion_pct ?? 0) + d)); if (await updateAsset(type, a.id, { completion_pct: pct, is_published: a.is_published }, author)) refresh(); };
  const del = async (a: ContentAsset) => { if (await removeAsset(type, a.id, author)) { toast({ title: 'Deleted' }); refresh(); } };
  const archive = async (a: ContentAsset) => { if (await archiveAsset(type, a.id, author)) { toast({ title: 'Archived' }); refresh(); } };
  const toggle = (id: string) => setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const approveAll = async () => {
    if (!courseId || !window.confirm('Approve ALL non-archived assets for this program?')) return;
    setBusy(true); const r = await approveAllForCourse(courseId, author); setBusy(false);
    toast({ title: `Approved ${r.updated} assets`, description: Object.entries(r.byType).map(([k, v]) => `${k}:${v}`).join(' · ') }); refresh(); syncLaunch();
  };
  const publishAll = async () => {
    if (!courseId || !window.confirm('Publish ALL non-archived assets for this program? They become shippable and count toward launch readiness.')) return;
    setBusy(true); const r = await publishAllForCourse(courseId, author); setBusy(false);
    toast({ title: `Published ${r.updated} assets`, description: Object.entries(r.byType).map(([k, v]) => `${k}:${v}`).join(' · ') }); refresh(); syncLaunch();
  };

  const filtered = assets.filter((a) => {
    if (f.status !== 'all' && a.status !== f.status) return false;
    if (f.chapterId && a.chapter_id !== f.chapterId) return false;
    if ((a.quality_score ?? 0) < f.qualityMin) return false;
    if ((a.readiness_score ?? 0) < f.readinessMin) return false;
    if (f.ai !== 'all' && Boolean(a.ai_generated) !== (f.ai === 'yes')) return false;
    if (f.human !== 'all' && Boolean(a.human_reviewed) !== (f.human === 'yes')) return false;
    if (f.published !== 'all' && Boolean(a.is_published) !== (f.published === 'yes')) return false;
    return true;
  });

  const money = (n?: number) => (n ? `$${(n / 1000).toFixed(0)}k` : '—');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Content Authoring Center</h2>
          <p className="text-sm text-muted-foreground">Single source of truth for curriculum creation · curriculum intelligence · founder-only</p>
        </div>
        <div className="flex items-center gap-2">
          <select className={sel} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.length === 0 && <option value="">No programs</option>}
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <Button size="sm" onClick={buildFlagship} disabled={busy}>🏗 Build Flagship v2</Button>
          <Button size="sm" onClick={upgradeV3} disabled={busy}>⬆️ Upgrade to v3</Button>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
        </div>
      </div>

      {/* 1. Course Header Intelligence */}
      {intel && (
        <Card><CardContent className="p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            {intel.is_flagship && <Badge className="bg-amber-500/15 text-amber-500"><Crown className="w-3 h-3 mr-1" />Flagship</Badge>}
            <span className="text-sm font-bold text-foreground">{intel.title}</span>
          </div>
          <Field k="Flagship ver" v={intel.flagship_version} />
          <Field k="Curriculum ver" v={intel.curriculum_version} />
          <Field k="Launch status" v={intel.launch_status} />
          <Field k="Launch score" v={intel.launch_score != null ? `${intel.launch_score}` : undefined} />
          <Field k="Target market" v={intel.target_market} />
          <Field k="Salary band" v={intel.target_salary_low || intel.target_salary_high ? `${money(intel.target_salary_low)}–${money(intel.target_salary_high)}` : undefined} />
          <Field k="Owner" v={intel.owner} />
        </CardContent></Card>
      )}

      {/* 6. Dashboard Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        <Tile label="Total assets" value={summary?.total ?? '—'} />
        <Tile label="Published" value={summary?.published ?? '—'} accent="#22c55e" />
        <Tile label="Draft" value={summary?.draft ?? '—'} accent="#94a3b8" />
        <Tile label="Avg readiness" value={summary ? `${summary.avgReadiness}%` : '—'} accent="#4A90F5" />
        <Tile label="Avg quality" value={summary ? `${summary.avgQuality}%` : '—'} accent="#a855f7" />
        <Tile label="Missing launch" value={summary?.missingLaunch ?? '—'} accent="#ef4444" />
        <Tile label="Programs ≥90%" value={academy.above} accent="#22c55e" />
        <Tile label="Programs <90%" value={academy.below} accent="#f59e0b" />
      </div>

      {/* 3. Asset Type tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ASSET_TYPES.map((m) => (
          <button key={m.type} onClick={() => setType(m.type)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${type === m.type ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>{m.label}</button>
        ))}
      </div>

      {/* 5. Filters */}
      <Card><CardContent className="p-3 flex flex-wrap items-center gap-2">
        <select className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
          <option value="all">All status</option>{['draft', 'in_review', 'approved', 'published', 'archived'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        {meta.level === 'module' && (
          <select className={sel} value={f.chapterId} onChange={(e) => setF({ ...f, chapterId: e.target.value })}>
            <option value="">All modules</option>{chapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
        <select className={sel} value={f.ai} onChange={(e) => setF({ ...f, ai: e.target.value })}><option value="all">AI: any</option><option value="yes">AI generated</option><option value="no">Not AI</option></select>
        <select className={sel} value={f.human} onChange={(e) => setF({ ...f, human: e.target.value })}><option value="all">Reviewed: any</option><option value="yes">Human reviewed</option><option value="no">Not reviewed</option></select>
        <select className={sel} value={f.published} onChange={(e) => setF({ ...f, published: e.target.value })}><option value="all">Published: any</option><option value="yes">Published</option><option value="no">Unpublished</option></select>
        <label className="flex items-center gap-1 text-xs text-muted-foreground">Quality ≥<Input type="number" min={0} max={100} value={f.qualityMin} onChange={(e) => setF({ ...f, qualityMin: Number(e.target.value) })} className="w-16 h-9" /></label>
        <label className="flex items-center gap-1 text-xs text-muted-foreground">Readiness ≥<Input type="number" min={0} max={100} value={f.readinessMin} onChange={(e) => setF({ ...f, readinessMin: Number(e.target.value) })} className="w-16 h-9" /></label>
      </CardContent></Card>

      {/* actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> / {assets.length} {meta.label.toLowerCase()} · target {meta.target}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowNew((s) => !s)}><Plus className="w-4 h-4 mr-1.5" /> New</Button>
          <Button size="sm" variant="outline" onClick={generate} disabled={busy || !courseId}><Sparkles className="w-4 h-4 mr-1.5" /> Generate {meta.label}</Button>
          <Button size="sm" onClick={generateAll} disabled={busy || !courseId}><Sparkles className="w-4 h-4 mr-1.5" /> Generate Full Program</Button>
          <Button size="sm" variant="outline" onClick={approveAll} disabled={busy || !courseId}>✅ Approve All</Button>
          <Button size="sm" onClick={publishAll} disabled={busy || !courseId}>🚀 Publish All</Button>
        </div>
      </div>

      {/* new asset form */}
      {showNew && (
        <Card><CardContent className="p-4 grid gap-3 sm:grid-cols-2">
          <Input placeholder={`${meta.label} title`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="sm:col-span-2" />
          {meta.level === 'module' && <select className={sel} value={form.chapterId} onChange={(e) => setForm({ ...form, chapterId: e.target.value })}><option value="">— module (optional) —</option>{chapters.map((ch) => <option key={ch.id} value={ch.id}>{ch.title}</option>)}</select>}
          {type === 'simulations' && <select className={sel} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>{['beginner', 'intermediate', 'advanced'].map((l) => <option key={l} value={l}>{l}</option>)}</select>}
          {type === 'interview' && <select className={sel} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{['behavioral', 'scenario', 'leadership'].map((k) => <option key={k} value={k}>{k}</option>)}</select>}
          <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Completion</span><Input type="number" min={0} max={100} value={form.completion} onChange={(e) => setForm({ ...form, completion: Number(e.target.value) })} className="w-20" />%</div>
          <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setShowNew(false)}>Cancel</Button><Button size="sm" onClick={create} disabled={busy}>Create draft</Button></div>
        </CardContent></Card>
      )}

      {/* 2 + 4. Asset Intelligence Cards */}
      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <p className="text-sm font-medium">{loading ? 'Loading…' : `No ${meta.label.toLowerCase()} match.`}</p>
          {!loading && <p className="text-[12px] mt-1">Use <strong>New</strong>, <strong>Generate</strong>, or <strong>Build Flagship v2</strong>. (Requires migrations applied.)</p>}
        </CardContent></Card>
      ) : (
        <div className="space-y-2">{filtered.map((a) => {
          const open = expanded.has(a.id);
          const needsWork = (a.readiness_score ?? 0) < 60 || (a.quality_score ?? 0) < 60;
          const ready = a.is_published && a.human_reviewed;
          return (
            <Card key={a.id}><CardContent className="p-3">
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(a.id)} className="text-muted-foreground shrink-0">{open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">{a.title || a.credential_name}</span>
                    <Badge className={`text-[9px] ${STATUS_STYLE[a.status]}`}>{a.status.replace('_', ' ')}</Badge>
                    {a.ai_generated && <Badge className="text-[9px] bg-purple-500/15 text-purple-400">AI</Badge>}
                    {a.human_reviewed && <Badge className="text-[9px] bg-blue-500/15 text-blue-400">Reviewed</Badge>}
                    {ready && <Badge className="text-[9px] bg-green-500/15 text-green-500">Launch Ready</Badge>}
                    {needsWork && <Badge className="text-[9px] bg-red-500/15 text-red-400">Needs Work</Badge>}
                    <span className="text-[10px] text-muted-foreground">v{a.version}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">readiness {a.readiness_score ?? 0}% · quality {a.quality_score ?? 0}% · {a.chapter_id ? (chapterName.get(a.chapter_id) || 'module') + ' · ' : ''}{a.author || '—'}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => editPct(a, -10)}>−</Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => editPct(a, +10)}>+</Button>
                  {a.status !== 'published' && a.status !== 'archived' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => advance(a)}>{a.status === 'approved' ? 'Publish' : a.status === 'in_review' ? 'Approve' : 'Review'} <ChevronRight className="w-3 h-3 ml-1" /></Button>}
                  {a.status !== 'archived' && <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground" onClick={() => archive(a)}><Archive className="w-3.5 h-3.5" /></Button>}
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive" onClick={() => del(a)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              {open && (
                <div className="mt-3 pt-3 border-t border-border/50 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-[12px]">
                  <KV k="Difficulty" v={a.difficulty_level} />
                  <KV k="Est. minutes" v={a.estimated_completion_minutes} />
                  <KV k="Approved by" v={a.approved_by} />
                  <KV k="Approved at" v={date(a.approved_at)} />
                  <KV k="Last reviewed" v={date(a.last_reviewed_at)} />
                  <KV k="AI reviewed" v={a.ai_reviewed ? 'yes' : 'no'} />
                  <KV k="Competency tags" v={fmt(a.competency_tags)} span />
                  <KV k="Learning objectives" v={fmt(a.learning_objectives)} span />
                  <KV k="Industry alignment" v={fmt(a.industry_alignment)} span />
                  {TYPE_FIELDS[type].map((key) => <KV key={key} k={LABEL[key] || key} v={fmt(a[key])} span={['expected_deliverables', 'grading_rubric', 'expected_answers', 'evaluation_criteria'].includes(key)} />)}
                </div>
              )}
            </CardContent></Card>
          );
        })}</div>
      )}

      {/* Audit trail */}
      {audit.length > 0 && (
        <Card><CardContent className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Audit trail · recent</div>
          <div className="space-y-1">{audit.map((e) => <div key={e.id} className="text-[12px] flex gap-2 items-baseline"><span className="font-semibold text-foreground">{e.action}</span><span className="text-muted-foreground">{e.asset_type}</span><span className="text-muted-foreground">· {e.actor}</span><span className="ml-auto text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span></div>)}</div>
        </CardContent></Card>
      )}
    </div>
  );
};

const Field = ({ k, v }: { k: string; v?: string }) => v ? <span className="text-[12px]"><span className="text-muted-foreground">{k}: </span><span className="font-semibold text-foreground">{v}</span></span> : null;
const Tile = ({ label, value, accent }: { label: string; value: string | number; accent?: string }) => (
  <Card><CardContent className="p-2.5"><div className="text-lg font-black" style={{ color: accent || undefined }}>{value}</div><div className="text-[10px] text-muted-foreground leading-tight">{label}</div></CardContent></Card>
);
const KV = ({ k, v, span }: { k: string; v: any; span?: boolean }) => (
  <div className={span ? 'sm:col-span-2 lg:col-span-3' : ''}><span className="text-muted-foreground">{k}: </span><span className="text-foreground">{v ?? '—'}</span></div>
);

export default ContentAuthoringCenter;
