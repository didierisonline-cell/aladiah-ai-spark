import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_SCRUM_MASTER_CURRICULUM, AI_SCRUM_MASTER_PROGRAM_META } from '@/services/agents/curriculum/programs/aiScrumMasterFull';

const META = AI_SCRUM_MASTER_PROGRAM_META;
const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><span className="font-medium text-foreground">{label}: </span><span className="text-muted-foreground">{children}</span></div>
);

const FullCurriculumPanel = () => (
  <div className="space-y-4">
    <Card className="border-primary/30">
      <CardHeader className="pb-2"><CardTitle className="text-base">{META.name} — {META.standard}</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-[11px]">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
          {Object.entries(META.totals).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border/60 p-2 bg-muted/20"><p className="text-base font-bold">{v as number}</p><p className="text-[10px] text-muted-foreground">{k.replace(/([A-Z])/g, ' $1')}</p></div>
          ))}
        </div>
        <Section label="GitHub portfolio">{META.githubPortfolioPath}</Section>
        <Section label="Alignment">{META.alignment.join(' · ')}</Section>
        <div className="flex flex-wrap gap-1 pt-1">
          {Object.values(META.readiness).map((r: any) => (
            <Badge key={r.label} variant="secondary" className="text-[9px]">{r.label}: M{r.modules.join(', M')}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>

    {AI_SCRUM_MASTER_CURRICULUM.map((m) => (
      <Card key={m.no}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Module {m.no}: {m.title}</span>
            <Badge variant="outline" className="text-[9px]">{m.phase}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-[11px] space-y-1.5">
          <Section label="Learning objectives">{m.learningObjectives.join(' · ')}</Section>
          <Section label="Competencies">{m.competencyMapping.map((c) => `${c.competency} (${c.weight}%)`).join(', ')}</Section>
          <Section label="Lessons">{m.lessons.map((l) => l.title).join(' · ')}</Section>
          <Section label="Readings">{m.readings.join(' · ')}</Section>
          <Section label="Videos">{m.videos.join(' · ')}</Section>
          <Section label="AI mentor activities">{m.aiMentorActivities.join(' · ')}</Section>
          <Section label={`Lab (${m.lab.tool})`}>{m.lab.name} — {m.lab.task} → <em>{m.lab.deliverable}</em></Section>
          <div className="rounded-lg border border-border/60 p-2 bg-muted/20 space-y-1">
            <p className="font-medium">Simulations (beginner / intermediate / advanced)</p>
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
              const s = m.simulations[lvl];
              return <p key={lvl} className="text-muted-foreground"><span className="capitalize font-medium text-foreground">{lvl}:</span> {s.title} — {s.company}. Conflict: {s.conflict}. Decisions: {s.decisionPoints.join(', ')}. {s.scoring}.</p>;
            })}
          </div>
          <Section label="Portfolio deliverable">{m.portfolioDeliverable}</Section>
          <Section label="Interview prep">Behavioral: {m.interviewPrep.behavioral.join('; ')} | Scenario: {m.interviewPrep.scenario.join('; ')} | Leadership: {m.interviewPrep.leadership.join('; ')}</Section>
          <Section label="Assessment blueprint">{m.assessmentBlueprint.moduleQuiz}-q module quiz + {m.assessmentBlueprint.competencyQuiz}-q competency quiz · bank {m.assessmentBlueprint.questionBank} · easy/med/hard {Math.round(m.assessmentBlueprint.difficulty.easy * 100)}/{Math.round(m.assessmentBlueprint.difficulty.medium * 100)}/{Math.round(m.assessmentBlueprint.difficulty.hard * 100)} · adaptive · pass {m.assessmentBlueprint.passing}%</Section>
          <Section label="Aligned to">{m.alignment.join(' · ')}</Section>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default FullCurriculumPanel;
