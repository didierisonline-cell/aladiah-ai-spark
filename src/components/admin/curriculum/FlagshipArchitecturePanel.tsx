import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import {
  ASSESSMENT_ARCHITECTURE, FLAGSHIP_TOTALS, INTERVIEW_ARCHITECTURE,
  PORTFOLIO_DELIVERABLES, getFlagshipModules,
} from '@/services/agents/curriculum/flagshipArchitecture';

const MODULES = getFlagshipModules();

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-lg border border-border/60 p-3 bg-muted/20 text-center">
    <p className="text-xl font-bold text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground">{label}</p>
  </div>
);

const FlagshipArchitecturePanel = ({ onDelegate }: { onDelegate: (no: number) => void }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      <Stat label="Modules" value={FLAGSHIP_TOTALS.modules} />
      <Stat label="Simulations" value={FLAGSHIP_TOTALS.simulations} />
      <Stat label="Labs" value={FLAGSHIP_TOTALS.labs} />
      <Stat label="Module Quizzes" value={FLAGSHIP_TOTALS.moduleQuizzes} />
      <Stat label="Question Bank" value={FLAGSHIP_TOTALS.questionBank} />
      <Stat label="Portfolio Items" value={FLAGSHIP_TOTALS.portfolioDeliverables} />
    </div>

    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">Per-module architecture</CardTitle></CardHeader>
      <CardContent className="text-[11px] space-y-1 text-muted-foreground">
        <p><span className="font-medium text-foreground">Assessment:</span> {ASSESSMENT_ARCHITECTURE.moduleQuizQuestions}-q module quiz + {ASSESSMENT_ARCHITECTURE.competencyQuizQuestions}-q competency quiz + final certification · question bank {ASSESSMENT_ARCHITECTURE.questionBankSize}/module · rotating · adaptive · {ASSESSMENT_ARCHITECTURE.difficultyLevels.join('/')}</p>
        <p><span className="font-medium text-foreground">Simulations:</span> beginner + intermediate + advanced (3 per module = 54 total) — real company, stakeholders, constraints, conflict, decision tree, scoring, AI feedback</p>
        <p><span className="font-medium text-foreground">Interview:</span> {INTERVIEW_ARCHITECTURE.components.join(' · ')}</p>
        <p><span className="font-medium text-foreground">Portfolio (GitHub-stored):</span> {PORTFOLIO_DELIVERABLES.join(' · ')}</p>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {MODULES.map((m) => (
        <Card key={m.no}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>M{m.no}. {m.title}</span>
              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => onDelegate(m.no)}><Send className="w-3 h-3 mr-1" />Delegate</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] space-y-1">
            <p><span className="font-medium">Competencies:</span> {m.competencies.join(', ')}</p>
            <p><span className="font-medium">Lab:</span> {m.lab.name} ({m.lab.tool})</p>
            <div className="flex flex-wrap gap-1">
              {m.simulations.map((s) => <Badge key={s.level} variant="outline" className="text-[9px] capitalize">{s.level}</Badge>)}
              <Badge variant="secondary" className="text-[9px]">{m.assessment.moduleQuizQuestions}+{m.assessment.competencyQuizQuestions} q · adaptive</Badge>
              <Badge variant="secondary" className="text-[9px]">AI interview coach</Badge>
            </div>
            <p><span className="font-medium">Portfolio:</span> {m.portfolioArtifact}</p>
            <p className="text-muted-foreground">{m.careerOutcome}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FlagshipArchitecturePanel;
