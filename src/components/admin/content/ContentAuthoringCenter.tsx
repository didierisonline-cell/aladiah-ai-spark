import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, RefreshCw, Trash2, ChevronRight, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/services/aos/_internal';
import {
  ASSET_TYPES, AssetType, AssetStatus, STATUS_FLOW, metaFor,
  listAssets, createAsset, setStatus, updateAsset, removeAsset, archiveAsset,
  listAudit, type ContentAsset, type AuditEntry,
} from '@/services/curriculum/contentStore';
import { generateAssets, generateAllAssets } from '@/services/curriculum/productBuilder';

const STATUS_STYLE: Record<AssetStatus, string> = {
  draft: 'bg-slate-500/15 text-slate-400',
  in_review: 'bg-amber-500/15 text-amber-500',
  approved: 'bg-blue-500/15 text-blue-500',
  published: 'bg-green-500/15 text-green-500',
  archived: 'bg-zinc-700/30 text-zinc-500',
};
const sel = 'h-9 rounded-md border border-input bg-background px-3 text-sm';

const ContentAuthoringCenter = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const author = user?.email || 'founder';
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [courseId, setCourseId] = useState('');
  const [chapters, setChapters] = useState<{ id: string; title: string }[]>([]);
  const [type, setType] = useState<AssetType>('simulations');
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', chapterId: '', level: 'beginner', kind: 'behavioral', completion: 60 });

  const meta = metaFor(type);
  const course = courses.find((c) => c.id === courseId);
  const chapterName = useMemo(() => new Map(chapters.map((c) => [c.id, c.title])), [chapters]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await db.from('courses').select('id, title').eq('is_published', true).order('title');
        const list = (data ?? []) as any[];
        setCourses(list);
        if (list.length && !courseId) setCourseId(list[0].id);
      } catch { /* ignore */ }
    })();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const { data } = await db.from('chapters').select('id, title, order_index').eq('course_id', courseId).order('order_index');
        setChapters((data ?? []) as any[]);
      } catch { setChapters([]); }
    })();
  }, [courseId]);

  const refresh = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try { const [a, au] = await Promise.all([listAssets(courseId, type), listAudit(courseId, 15)]); setAssets(a); setAudit(au); }
    finally { setLoading(false); }
  }, [courseId, type]);
  useEffect(() => { refresh(); }, [refresh]);

  const create = async () => {
    if (!form.title.trim()) { toast({ title: 'Title required', variant: 'destructive' }); return; }
    setBusy(true);
    const r = await createAsset(type, {
      courseId, chapterId: meta.level === 'module' ? (form.chapterId || null) : null,
      title: form.title.trim(), author, completion_pct: form.completion,
      level: form.level, kind: form.kind, deliverable: form.title.trim(),
    });
    setBusy(false);
    if (r.ok) { toast({ title: `${meta.label} draft created` }); setShowNew(false); setForm({ ...form, title: '' }); refresh(); }
    else toast({ title: 'Create failed', description: r.error, variant: 'destructive' });
  };

  const generate = async () => {
    if (!course) return;
    setBusy(true);
    const r = await generateAssets(courseId, course.title, type, author);
    setBusy(false);
    if (r.created > 0) { toast({ title: `Product Builder drafted ${r.created} ${meta.label}` }); refresh(); }
    else toast({ title: 'Nothing generated', description: r.error || 'Already covered.', variant: r.error ? 'destructive' : 'default' });
  };

  const advance = async (a: ContentAsset) => {
    const i = STATUS_FLOW.indexOf(a.status);
    const next = STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)];
    if (next === a.status) return;
    if (await setStatus(type, a.id, next)) { toast({ title: `→ ${next.replace('_', ' ')}` }); refresh(); }
  };
  const editPct = async (a: ContentAsset, delta: number) => {
    const pct = Math.max(0, Math.min(100, (a.completion_pct ?? 0) + delta));
    if (await updateAsset(type, a.id, { completion_pct: pct, is_published: a.is_published })) refresh();
  };
  const del = async (a: ContentAsset) => { if (await removeAsset(type, a.id, author)) { toast({ title: 'Deleted' }); refresh(); } };
  const archive = async (a: ContentAsset) => { if (await archiveAsset(type, a.id, author)) { toast({ title: 'Archived' }); refresh(); } };
  const generateAll = async () => {
    if (!course) return;
    setBusy(true);
    const r = await generateAllAssets(courseId, course.title, author);
    setBusy(false);
    if (r.total > 0) { toast({ title: `Product Builder drafted ${r.total} assets`, description: Object.entries(r.byType).map(([k, v]) => `${k}:${v}`).join(' · ') }); refresh(); }
    else toast({ title: 'Nothing generated', description: r.error || 'Already covered.', variant: r.error ? 'destructive' : 'default' });
  };

  const published = assets.filter((a) => a.is_published).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Content Authoring Center</h2>
          <p className="text-sm text-muted-foreground">Single source of truth for curriculum creation · founder-only · writes to Supabase</p>
        </div>
        <div className="flex items-center gap-2">
          <select className={sel} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.length === 0 && <option value="">No published programs</option>}
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
        </div>
      </div>

      {/* type tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ASSET_TYPES.map((m) => (
          <button key={m.type} onClick={() => setType(m.type)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${type === m.type ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{assets.length}</span> {meta.label.toLowerCase()} · <span className="text-green-500 font-bold">{published}</span> published · target {meta.target}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowNew((s) => !s)}><Plus className="w-4 h-4 mr-1.5" /> New</Button>
          <Button size="sm" variant="outline" onClick={generate} disabled={busy || !courseId}><Sparkles className="w-4 h-4 mr-1.5" /> Generate {meta.label}</Button>
          <Button size="sm" onClick={generateAll} disabled={busy || !courseId}><Sparkles className="w-4 h-4 mr-1.5" /> Generate Full Program</Button>
        </div>
      </div>

      {/* new asset form */}
      {showNew && (
        <Card><CardContent className="p-4 grid gap-3 sm:grid-cols-2">
          <Input placeholder={`${meta.label} title`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="sm:col-span-2" />
          {meta.level === 'module' && (
            <select className={sel} value={form.chapterId} onChange={(e) => setForm({ ...form, chapterId: e.target.value })}>
              <option value="">— module (optional) —</option>
              {chapters.map((ch) => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
            </select>
          )}
          {type === 'simulations' && (
            <select className={sel} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {['beginner', 'intermediate', 'advanced'].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          )}
          {type === 'interview' && (
            <select className={sel} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              {['behavioral', 'scenario', 'leadership'].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Completion</span>
            <Input type="number" min={0} max={100} value={form.completion} onChange={(e) => setForm({ ...form, completion: Number(e.target.value) })} className="w-20" /><span className="text-muted-foreground">%</span>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button size="sm" onClick={create} disabled={busy}>Create draft</Button>
          </div>
        </CardContent></Card>
      )}

      {/* list */}
      {assets.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <p className="text-sm font-medium">{loading ? 'Loading…' : `No ${meta.label.toLowerCase()} yet.`}</p>
          {!loading && <p className="text-[12px] mt-1">Use <strong>New</strong> or <strong>Generate with Product Builder</strong>. (Requires the content migration applied in Supabase.)</p>}
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {assets.map((a) => (
            <Card key={a.id}><CardContent className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground truncate">{a.title || a.credential_name}</span>
                  <Badge className={`text-[9px] ${STATUS_STYLE[a.status]}`}>{a.status.replace('_', ' ')}</Badge>
                  <span className="text-[10px] text-muted-foreground">v{a.version}</span>
                  {a.chapter_id && <span className="text-[10px] text-muted-foreground truncate">· {chapterName.get(a.chapter_id) || 'module'}</span>}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  readiness {a.readiness_score}% · completion {a.completion_pct}% · {a.author || '—'} · {new Date(a.updated_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => editPct(a, -10)}>−</Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => editPct(a, +10)}>+</Button>
                {a.status !== 'published' && a.status !== 'archived' && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => advance(a)}>
                    {a.status === 'approved' ? 'Publish' : a.status === 'in_review' ? 'Approve' : 'Review'} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
                {a.status !== 'archived' && (
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground" title="Archive" onClick={() => archive(a)}><Archive className="w-3.5 h-3.5" /></Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive" onClick={() => del(a)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {audit.length > 0 && (
        <Card><CardContent className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Audit trail · recent</div>
          <div className="space-y-1">
            {audit.map((e) => (
              <div key={e.id} className="text-[12px] flex gap-2 items-baseline">
                <span className="font-semibold text-foreground">{e.action}</span>
                <span className="text-muted-foreground">{e.asset_type}</span>
                <span className="text-muted-foreground">· {e.actor}</span>
                <span className="ml-auto text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}
    </div>
  );
};

export default ContentAuthoringCenter;
