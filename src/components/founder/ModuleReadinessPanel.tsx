import { useEffect, useState } from 'react';
import {
  loadReviewCourses, getModuleReadiness,
  type ModuleReadinessRow,
} from '@/services/curriculum/questionReview';
import type { ManagedCourse } from '@/services/curriculum/courses';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const barColor = (pct: number) =>
  pct >= 90 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 30 ? 'bg-amber-500' : 'bg-rose-500';

/**
 * Module Readiness — each module across the seven dimensions:
 * Lessons · Quiz Questions · Simulations · Projects · Interview Scenarios ·
 * Portfolio Work · Certification Readiness, with readiness percentages.
 */
const ModuleReadinessPanel = () => {
  const [courses, setCourses] = useState<ManagedCourse[]>([]);
  const [courseId, setCourseId] = useState('');
  const [rows, setRows] = useState<ModuleReadinessRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadReviewCourses().then((c) => { setCourses(c); if (c.length) setCourseId(c[0].id); }); }, []);
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getModuleReadiness(courseId).then((r) => { setRows(r); setLoading(false); });
  }, [courseId]);

  const dimKeys = rows[0]?.dims ?? [];

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <label className="block max-w-md">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Course</span>
          <select className="w-full rounded-lg border bg-background px-2.5 py-2 text-sm"
            value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
      </Card>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : rows.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No modules found for this course.</Card>
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
                  <td className="px-4 py-3">
                    <div className="font-medium">M{m.module}</div>
                    <div className="text-xs text-muted-foreground max-w-[14rem] truncate">{m.title}</div>
                  </td>
                  {m.dims.map((d) => (
                    <td key={d.key} className="px-3 py-3 align-middle">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${barColor(d.pct)}`} style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {d.key === 'certification' ? `${d.pct}%` : `${d.have}/${d.target} · ${d.pct}%`}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <p className="text-xs text-muted-foreground">
        Quiz Questions counts <span className="font-medium">approved</span> bank items only (drafts awaiting review are excluded).
        Certification Readiness is the module's roll-up across the other six dimensions.
      </p>
    </div>
  );
};

export default ModuleReadinessPanel;
