import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { KeywordStatus, SeoKeyword, SeoPriority } from '@/types/seo';

const PRIORITY: Record<SeoPriority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};
const STATUS: Record<KeywordStatus, string> = {
  opportunity: 'bg-blue-100 text-blue-700 border-blue-200',
  targeted: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  ranking: 'bg-amber-100 text-amber-700 border-amber-200',
  won: 'bg-green-100 text-green-700 border-green-200',
  dropped: 'bg-slate-100 text-slate-500 border-slate-200',
};

interface Props {
  keywords: SeoKeyword[];
  requestingKeyword: string | null;
  onRequest: (keyword: string) => void;
}

const KeywordTable = ({ keywords, requestingKeyword, onRequest }: Props) => {
  const [cat, setCat] = useState<string>('all');
  const categories = ['all', ...Array.from(new Set(keywords.map((k) => k.category).filter(Boolean) as string[]))];
  const rows = cat === 'all' ? keywords : keywords.filter((k) => k.category === cat);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Keyword Opportunities</CardTitle>
        <div className="flex flex-wrap gap-1 pt-2">
          {categories.map((c) => (
            <Button key={c} size="sm" variant={cat === c ? 'default' : 'outline'} className="h-7 px-2 text-xs" onClick={() => setCat(c)}>
              {c}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto max-h-[560px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b">
              <th className="py-2 pr-3">Keyword</th>
              <th className="py-2 pr-3">Intent</th>
              <th className="py-2 pr-3">Vol</th>
              <th className="py-2 pr-3">Diff</th>
              <th className="py-2 pr-3">Priority</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No keywords yet — run keyword research.</td></tr>
            ) : (
              rows.map((k) => (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="py-2 pr-3">
                    <p className="font-medium text-foreground">{k.keyword}</p>
                    <p className="text-[10px] text-muted-foreground">{k.category}{k.cluster ? ` · ${k.cluster}` : ''}</p>
                  </td>
                  <td className="py-2 pr-3 text-xs">{k.intent}</td>
                  <td className="py-2 pr-3">{k.search_volume.toLocaleString()}</td>
                  <td className="py-2 pr-3">{k.difficulty}</td>
                  <td className="py-2 pr-3"><Badge className={`text-[9px] border ${PRIORITY[k.priority]}`}>{k.priority}</Badge></td>
                  <td className="py-2 pr-3"><Badge className={`text-[9px] border ${STATUS[k.status]}`}>{k.status}</Badge></td>
                  <td className="py-2 pr-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      disabled={requestingKeyword === k.keyword}
                      onClick={() => onRequest(k.keyword)}
                    >
                      <Send className={`w-3 h-3 mr-1 ${requestingKeyword === k.keyword ? 'animate-pulse' : ''}`} />
                      Request content
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default KeywordTable;
