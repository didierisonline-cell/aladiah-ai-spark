import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layers, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CalendarScope, LeadMagnetKind, Platform } from '@/types/marketing';
import {
  generateCampaign,
  generateContent,
  generateContentCalendar,
  generateLeadMagnet,
  generateWebinar,
  repurposeIdea,
} from '@/services/agents/marketingContentAgent';

const PLATFORMS: Platform[] = [
  'linkedin', 'facebook', 'instagram', 'blog', 'email', 'youtube', 'webinar', 'lead_magnet',
];
const LEAD_MAGNETS: LeadMagnetKind[] = ['checklist', 'pdf_guide', 'career_roadmap', 'interview_guide'];
const SCOPES: CalendarScope[] = ['daily', 'weekly', 'monthly'];

const ContentGeneratorPanel = ({ onGenerated }: { onGenerated: () => void }) => {
  const { toast } = useToast();
  const [idea, setIdea] = useState('How to transform your career with AI-powered learning');
  const [theme, setTheme] = useState('career transformation');
  const [audience, setAudience] = useState('career changers in Africa & the Caribbean');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [campaignName, setCampaignName] = useState('Q3 Enrollment Push');
  const [leadKind, setLeadKind] = useState<LeadMagnetKind>('checklist');
  const [scope, setScope] = useState<CalendarScope>('weekly');
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<unknown>, success: string) => {
    if (!idea.trim()) {
      toast({ title: 'Add an idea or topic first', variant: 'destructive' });
      return;
    }
    setBusy(key);
    try {
      await fn();
      toast({ title: success, description: 'Sent to the approval queue.' });
      onGenerated();
    } catch (e) {
      toast({
        title: 'Generation failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Content Generator
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          One idea in — assets out, straight to the approval queue.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Idea / topic</Label>
          <Textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Theme</Label>
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Audience</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
          </div>
        </div>

        {/* Repurposing engine — the headline action */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs font-medium flex items-center gap-1 mb-2">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Repurposing Engine
          </p>
          <p className="text-[11px] text-muted-foreground mb-2">
            1 idea → 1 blog · 3 LinkedIn · 2 Facebook · 1 email · 2 Instagram · 1 YouTube · 3 Shorts
          </p>
          <Button
            className="w-full"
            disabled={busy !== null}
            onClick={() => run('repurpose', () => repurposeIdea(idea, theme, audience), 'Repurposed into 13 assets')}
          >
            {busy === 'repurpose' ? 'Generating…' : 'Repurpose this idea'}
          </Button>
        </div>

        {/* Single asset */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Single asset — platform</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            disabled={busy !== null}
            onClick={() => run('single', () => generateContent({ idea, platform, theme, audience }), 'Asset generated')}
          >
            Generate
          </Button>
        </div>

        {/* Campaign */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Campaign name</Label>
            <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
          </div>
          <Button
            variant="outline"
            disabled={busy !== null}
            onClick={() =>
              run('campaign', () => generateCampaign({ name: campaignName, objective: idea, theme, audience }), 'Campaign generated')
            }
          >
            Campaign
          </Button>
        </div>

        {/* Lead magnet */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Lead magnet type</Label>
            <Select value={leadKind} onValueChange={(v) => setLeadKind(v as LeadMagnetKind)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LEAD_MAGNETS.map((k) => (
                  <SelectItem key={k} value={k}>{k.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            disabled={busy !== null}
            onClick={() => run('lead', () => generateLeadMagnet({ kind: leadKind, topic: idea, audience }), 'Lead magnet generated')}
          >
            Lead magnet
          </Button>
        </div>

        {/* Webinar + Calendar */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            disabled={busy !== null}
            onClick={() => run('webinar', () => generateWebinar({ topic: idea, audience }), 'Webinar pack generated')}
          >
            Webinar pack
          </Button>
          <div className="flex gap-1">
            <Select value={scope} onValueChange={(v) => setScope(v as CalendarScope)}>
              <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SCOPES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              disabled={busy !== null}
              onClick={() => run('calendar', () => generateContentCalendar(scope, theme), `${scope} calendar generated`)}
            >
              Calendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentGeneratorPanel;
