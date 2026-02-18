import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Shield, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BoardStory, DayScore, ExecutiveReport, RiskItem, SPRINT_SCHEDULE } from './SimulationTypes';

interface ReportsDashboardProps {
  stories: BoardStory[];
  scores: DayScore[];
  executiveReports: ExecutiveReport[];
  risks: RiskItem[];
  currentDay: number;
}

const ReportsDashboard = ({ stories, scores, executiveReports, risks, currentDay }: ReportsDashboardProps) => {
  const totalPoints = stories.reduce((s, st) => s + st.points, 0);
  const donePoints = stories.filter(s => s.status === 'Done').reduce((s, st) => s + st.points, 0);
  const inProgressPoints = stories.filter(s => ['In Progress', 'Code Review', 'QA'].includes(s.status)).reduce((s, st) => s + st.points, 0);
  const completionPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, sc) => s + sc.total_score, 0) / scores.length) : 0;
  const openRisks = risks.filter(r => r.status === 'open').length;
  const latestReport = executiveReports.length > 0 ? executiveReports[executiveReports.length - 1] : null;

  const healthColor = (h: string) => h === 'green' ? 'text-primary' : h === 'yellow' ? 'text-accent' : 'text-destructive';
  const healthEmoji = (h: string) => h === 'green' ? '🟢' : h === 'yellow' ? '🟡' : '🔴';

  // Ideal burndown line
  const idealBurnPerDay = totalPoints / 8;

  return (
    <div className="h-full overflow-y-auto bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Sprint Reports & Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Project Nebula — Sprint 21 • Day {currentDay}/8</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-display font-bold">{completionPct}%</p>
              <p className="text-[10px] text-muted-foreground">Sprint Completion</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-5 h-5 text-secondary mx-auto mb-1" />
              <p className="text-2xl font-display font-bold">{donePoints}/{totalPoints}</p>
              <p className="text-[10px] text-muted-foreground">Story Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-2xl font-display font-bold">{openRisks}</p>
              <p className="text-[10px] text-muted-foreground">Open Risks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-2xl font-display font-bold">{avgScore}/100</p>
              <p className="text-[10px] text-muted-foreground">Avg SM Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Burndown Chart (visual) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Burndown Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-40 border-l-2 border-b-2 border-border ml-8">
              {/* Y-axis labels */}
              <span className="absolute -left-8 top-0 text-[10px] text-muted-foreground">{totalPoints}</span>
              <span className="absolute -left-8 bottom-0 text-[10px] text-muted-foreground">0</span>
              {/* Ideal line */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                  {/* Actual progress */}
                  <polyline
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    points={Array.from({ length: currentDay + 1 }, (_, i) => {
                      const remaining = totalPoints - (i === 0 ? 0 : Math.min(donePoints, (donePoints / currentDay) * i));
                      const x = (i / 8) * 100;
                      const y = (1 - remaining / totalPoints) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                </svg>
              </div>
              {/* X-axis day labels */}
              <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] text-muted-foreground">
                {SPRINT_SCHEDULE.map(d => (
                  <span key={d.day} className={d.day === currentDay ? 'font-bold text-primary' : ''}>{d.day}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-8 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-muted-foreground opacity-50" style={{ borderTop: '1px dashed' }} /> Ideal</div>
              <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-primary" /> Actual</div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Scores */}
        {scores.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Daily Scrum Master Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scores.map((score, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs w-16 text-muted-foreground">Day {i + 1}</span>
                    <Progress value={score.total_score} className="flex-1 h-2" />
                    <span className={`text-xs font-bold w-12 text-right ${score.total_score >= 75 ? 'text-primary' : score.total_score >= 50 ? 'text-secondary' : 'text-destructive'}`}>
                      {score.total_score}/100
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Executive Report */}
        {latestReport && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Executive Sprint Report — Day {latestReport.day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Overall Health:</span>
                <span className={healthColor(latestReport.health)}>
                  {healthEmoji(latestReport.health)} {latestReport.health.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-xs text-muted-foreground mb-1">Summary</p>
                <p className="text-sm">{latestReport.summary}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-muted-foreground mb-1">Risks</p>
                <p className="text-sm">{latestReport.risks}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-muted-foreground mb-1">Next Focus</p>
                <p className="text-sm">{latestReport.next_focus}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Story Status Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Story Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Done', 'Ready for Release', 'QA', 'Code Review', 'In Progress', 'Ready', 'Backlog'].map(status => {
                const count = stories.filter(s => s.status === status).length;
                const pts = stories.filter(s => s.status === status).reduce((s, st) => s + st.points, 0);
                if (count === 0) return null;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs w-32 text-muted-foreground">{status}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${status === 'Done' ? 'bg-primary' : status === 'In Progress' ? 'bg-secondary' : 'bg-accent'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(pts / totalPoints) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-16 text-right">{count} ({pts}pts)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsDashboard;
