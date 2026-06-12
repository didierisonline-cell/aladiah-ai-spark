import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  loadReviewCourses, loadModules, listQuestions, tallyByStatus, bulkSetStatus,
  type ReviewQuestion, type QuestionStatus, type ReviewAction, type ModuleOption,
} from '@/services/curriculum/questionReview';
import type { ManagedCourse } from '@/services/curriculum/courses';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Eye, Send, RotateCcw, Archive, ChevronRight, Loader2 } from 'lucide-react';

const STATUSES: { key: QuestionStatus; label: string }[] = [
  { key: 'draft', label: 'Draft' },
  { key: 'in_review', label: 'In Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'archived', label: 'Archived' },
];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const COMPETENCIES = ['Scrum', 'Agile', 'SAFe', 'Leadership', 'AI', 'Metrics', 'Stakeholders', 'Scaling'];

const statusBadge = (s: QuestionStatus) => {
  const map: Record<QuestionStatus, string> = {
    draft: 'bg-amber-100 text-amber-800',
    in_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-emerald-100 text-emerald-800',
    archived: 'bg-muted text-muted-foreground',
  };
  return map[s];
};

/** Question Review Queue — Draft → In Review → Approved, plus Archived. */
const QuestionReviewQueue = () => {
  const { user } = useAuth();
  const reviewer = (user?.email ?? 'founder').toLowerCase();

  const [courses, setCourses] = useState<ManagedCourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [module, setModule] = useState<number | ''>('');
  const [competency, setCompetency] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [status, setStatus] = useState<QuestionStatus>('draft');

  const [rows, setRows] = useState<ReviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>('');

  // initial course load
  useEffect(() => { loadReviewCourses().then((c) => {
    setCourses(c); if (c.length) setCourseId(c[0].id);
  }); }, []);

  // modules when course changes
  useEffect(() => { if (!courseId) return; setModule(''); loadModules(courseId).then(setModules); }, [courseId]);

  // load questions for the active filters (status is applied client-side via tabs
  // so the per-status counts stay visible without a refetch per tab)
  const refresh = async () => {
    if (!courseId) { setRows([]); return; }
    setLoading(true); setSelected(new Set());
    const data = await listQuestions({
      courseId,
      module: module === '' ? undefined : Number(module),
      competency: competency || undefined,
      difficulty: difficulty || undefined,
    });
    setRows(data); setLoading(false);
  };
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [courseId, module, competency, difficulty]);

  const tally = useMemo(() => tallyByStatus(rows), [rows]);
  const visible = useMemo(() => rows.filter((r) => r.status === status), [rows, status]);

  const allChecked = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) visible.forEach((r) => next.delete(r.id));
    else visible.forEach((r) => next.add(r.id));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected); next.has(id) ? next.delete(id) : next.add(id); setSelected(next);
  };

  const act = async (action: ReviewAction) => {
    const ids = [...selected];
    if (!ids.length) return;
    setBusy(true); setMsg('');
    const res = await bulkSetStatus(ids, action, reviewer);
    setBusy(false);
    if (res.error) { setMsg(`Failed: ${res.error}`); return; }
    setMsg(`${action === 'review' ? 'Sent to review' : action.charAt(0).toUpperCase() + action.slice(1) + 'd'} ${res.updated} question${res.updated === 1 ? '' : 's'}.`);
    await refresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="Course">
            <select className="filter" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>
          <Field label="Module">
            <select className="filter" value={module} onChange={(e) => setModule(e.target.value === '' ? '' : Number(e.target.value))}>
              <option value="">All modules</option>
              {modules.map((m) => <option key={m.module} value={m.module}>M{m.module} · {m.title}</option>)}
            </select>
          </Field>
          <Field label="Competency">
            <select className="filter" value={competency} onChange={(e) => setCompetency(e.target.value)}>
              <option value="">All competencies</option>
              {COMPETENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Difficulty">
            <select className="filter" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">All difficulties</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUSES.map((s) => (
          <button key={s.key} onClick={() => { setStatus(s.key); setSelected(new Set()); }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              status === s.key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
            {s.label}<span className="ml-0.5 rounded-full bg-background/30 px-1.5">{tally[s.key]}</span>
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{selected.size} selected</span>
        <Button size="sm" variant="outline" disabled={busy || !selected.size} onClick={() => act('approve')}>
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
        </Button>
        <Button size="sm" variant="outline" disabled={busy || !selected.size} onClick={() => act('review')}>
          <Send className="w-3.5 h-3.5 mr-1" /> Send to Review
        </Button>
        <Button size="sm" variant="outline" disabled={busy || !selected.size} onClick={() => act('reject')}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reject
        </Button>
        <Button size="sm" variant="outline" disabled={busy || !selected.size} onClick={() => act('archive')}>
          <Archive className="w-3.5 h-3.5 mr-1" /> Archive
        </Button>
        {busy && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        {msg && <span className="text-xs text-emerald-700">{msg}</span>}
      </div>

      {/* Queue */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b px-4 py-2 text-xs font-medium text-muted-foreground">
          <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="Select all" />
          <span className="flex-1">Question ({visible.length})</span>
          <span className="hidden md:block w-28">Competency</span>
          <span className="hidden lg:block w-40">Topic</span>
          <span className="hidden sm:block w-20">Difficulty</span>
          <span className="hidden lg:block w-24">Created</span>
          <span className="w-10 text-right">v</span>
          <span className="w-6" />
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : visible.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No {status.replace('_', ' ')} questions for these filters.</div>
        ) : visible.map((r) => (
          <div key={r.id} className="border-b last:border-0">
            <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
              <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleOne(r.id)} aria-label="Select" />
              <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="flex-1 text-left text-sm">
                <span className="text-muted-foreground mr-1.5">M{r.module}</span>{r.question_text}
              </button>
              <Badge variant="secondary" className="hidden md:inline-flex w-28 justify-center truncate">{r.competency ?? '—'}</Badge>
              <span className="hidden lg:block w-40 text-xs text-muted-foreground truncate">{r.topic ?? '—'}</span>
              <span className="hidden sm:block w-20 text-xs capitalize">{r.difficulty ?? '—'}</span>
              <span className="hidden lg:block w-24 text-xs text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</span>
              <span className="w-10 text-right text-xs text-muted-foreground">{r.version}</span>
              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === r.id ? 'rotate-90' : ''}`} />
            </div>
            {expanded === r.id && (
              <div className="px-12 pb-4 pt-1 text-sm space-y-2 bg-muted/20">
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={statusBadge(r.status)}>{r.status.replace('_', ' ')}</Badge>
                  {r.competency && <Badge variant="outline">{r.competency}</Badge>}
                  {r.difficulty && <Badge variant="outline" className="capitalize">{r.difficulty}</Badge>}
                </div>
                {r.scenario_context && <p className="text-muted-foreground italic">{r.scenario_context}</p>}
                <p className="font-medium">{r.question_text}</p>
                <ul className="space-y-1">
                  {r.options.map((o, i) => (
                    <li key={i} className={`pl-2 ${i === r.correct_answer_index ? 'text-emerald-700 font-medium' : ''}`}>
                      {String.fromCharCode(65 + i)}) {o}{i === r.correct_answer_index && ' ✓'}
                    </li>
                  ))}
                </ul>
                {r.explanation && <p className="text-muted-foreground"><span className="font-medium text-foreground">Rationale:</span> {r.explanation}</p>}
              </div>
            )}
          </div>
        ))}
      </Card>

      <style>{`.filter{width:100%;border:1px solid hsl(var(--border));border-radius:.5rem;background:hsl(var(--background));padding:.4rem .6rem;font-size:.8rem}`}</style>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
    {children}
  </label>
);

export default QuestionReviewQueue;
