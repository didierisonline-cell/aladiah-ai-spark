import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mail, Eye, Send, CheckSquare, Square, BarChart3, Target, Shield, TrendingUp, Clock, Zap, Bug, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BoardStory, DayScore, ExecutiveReport, RiskItem, SPRINT_SCHEDULE } from './SimulationTypes';

interface ReportGeneratorProps {
  stories: BoardStory[];
  scores: DayScore[];
  executiveReports: ExecutiveReport[];
  risks: RiskItem[];
  currentDay: number;
}

interface MetricOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'sprint' | 'quality' | 'team' | 'risk';
}

const AVAILABLE_METRICS: MetricOption[] = [
  { id: 'completion', label: 'Sprint Completion %', icon: <Target className="w-3.5 h-3.5" />, category: 'sprint' },
  { id: 'velocity', label: 'Velocity Trend', icon: <Activity className="w-3.5 h-3.5" />, category: 'sprint' },
  { id: 'burndown', label: 'Burndown Progress', icon: <TrendingUp className="w-3.5 h-3.5" />, category: 'sprint' },
  { id: 'story_points', label: 'Story Points Delivered', icon: <BarChart3 className="w-3.5 h-3.5" />, category: 'sprint' },
  { id: 'throughput', label: 'Throughput (stories/day)', icon: <Zap className="w-3.5 h-3.5" />, category: 'sprint' },
  { id: 'cycle_time', label: 'Cycle Time', icon: <Clock className="w-3.5 h-3.5" />, category: 'quality' },
  { id: 'defect_rate', label: 'Defect Escape Rate', icon: <Bug className="w-3.5 h-3.5" />, category: 'quality' },
  { id: 'predictability', label: 'Sprint Predictability', icon: <Target className="w-3.5 h-3.5" />, category: 'quality' },
  { id: 'sm_score', label: 'Scrum Master Score', icon: <BarChart3 className="w-3.5 h-3.5" />, category: 'team' },
  { id: 'team_breakdown', label: 'Status Breakdown', icon: <BarChart3 className="w-3.5 h-3.5" />, category: 'team' },
  { id: 'open_risks', label: 'Open Risks Summary', icon: <Shield className="w-3.5 h-3.5" />, category: 'risk' },
  { id: 'risk_trend', label: 'Risk Trend Over Sprint', icon: <TrendingUp className="w-3.5 h-3.5" />, category: 'risk' },
  { id: 'health', label: 'Overall Sprint Health', icon: <Activity className="w-3.5 h-3.5" />, category: 'risk' },
];

const CATEGORY_LABELS: Record<string, string> = {
  sprint: 'Sprint Progress',
  quality: 'Quality Metrics',
  team: 'Team Performance',
  risk: 'Risk & Health',
};

const ReportGenerator = ({ stories, scores, executiveReports, risks, currentDay }: ReportGeneratorProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['completion', 'story_points', 'sm_score', 'open_risks', 'health']);
  const [showPreview, setShowPreview] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    setSent(false);
  };

  const selectAll = () => {
    setSelectedMetrics(AVAILABLE_METRICS.map(m => m.id));
    setSent(false);
  };

  const clearAll = () => {
    setSelectedMetrics([]);
    setSent(false);
  };

  // Computed metrics for the report
  const metrics = useMemo(() => {
    const totalPoints = stories.reduce((s, st) => s + st.points, 0);
    const donePoints = stories.filter(s => s.status === 'Done').reduce((s, st) => s + st.points, 0);
    const doneCount = stories.filter(s => s.status === 'Done').length;
    const inProgressCount = stories.filter(s => ['In Progress', 'Code Review', 'QA'].includes(s.status)).length;
    const completionPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, sc) => s + sc.total_score, 0) / scores.length) : 0;
    const openRisks = risks.filter(r => r.status === 'open');
    const mitigatedRisks = risks.filter(r => r.status === 'mitigated');
    const throughput = currentDay > 0 ? (doneCount / currentDay).toFixed(1) : '0';
    const cycleTime = doneCount > 0 ? Math.max(1.2, 2.4 - (currentDay * 0.05)).toFixed(1) : '—';
    const totalQA = stories.filter(s => ['QA', 'Done', 'Ready for Release'].includes(s.status)).length;
    const escapedDefects = currentDay >= 5 ? 1 : 0;
    const defectRate = totalQA > 0 ? Math.round((escapedDefects / totalQA) * 100) : 0;
    const predictability = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
    const latestReport = executiveReports.length > 0 ? executiveReports[executiveReports.length - 1] : null;
    const pastVelocities = [42, 48, 51, 46];
    const avgVelocity = Math.round([...pastVelocities, donePoints].reduce((a, b) => a + b, 0) / 5);

    return {
      totalPoints, donePoints, doneCount, inProgressCount, completionPct, avgScore,
      openRisks, mitigatedRisks, throughput, cycleTime, defectRate, predictability,
      latestReport, avgVelocity, totalQA, escapedDefects,
    };
  }, [stories, scores, risks, currentDay, executiveReports]);

  const dayInfo = SPRINT_SCHEDULE.find(d => d.day === currentDay) || SPRINT_SCHEDULE[0];

  const renderMetricRow = (id: string): string => {
    switch (id) {
      case 'completion': return `Sprint Completion: ${metrics.completionPct}%`;
      case 'velocity': return `Avg Velocity (S17–S21): ${metrics.avgVelocity} pts/sprint`;
      case 'burndown': return `Burndown: ${metrics.totalPoints - metrics.donePoints} pts remaining (Day ${currentDay}/8)`;
      case 'story_points': return `Story Points: ${metrics.donePoints} delivered / ${metrics.totalPoints} committed`;
      case 'throughput': return `Throughput: ${metrics.throughput} stories/day (${metrics.doneCount} total)`;
      case 'cycle_time': return `Avg Cycle Time: ${metrics.cycleTime} days/story`;
      case 'defect_rate': return `Defect Escape Rate: ${metrics.defectRate}% (${metrics.escapedDefects}/${metrics.totalQA})`;
      case 'predictability': return `Sprint Predictability: ${metrics.predictability}%`;
      case 'sm_score': return `Scrum Master Avg Score: ${metrics.avgScore}/100 (${scores.length} days scored)`;
      case 'team_breakdown': {
        const statusCounts = ['Done', 'In Progress', 'Code Review', 'QA', 'Ready', 'Backlog'].map(s => {
          const c = stories.filter(st => st.status === s).length;
          return c > 0 ? `${s}: ${c}` : null;
        }).filter(Boolean).join(' | ');
        return `Board Status: ${statusCounts}`;
      }
      case 'open_risks': return `Open Risks: ${metrics.openRisks.length} | Mitigated: ${metrics.mitigatedRisks.length}`;
      case 'risk_trend': {
        const risksByDay = risks.reduce((acc, r) => { acc[r.day] = (acc[r.day] || 0) + 1; return acc; }, {} as Record<number, number>);
        const trend = Object.entries(risksByDay).map(([d, c]) => `Day ${d}: +${c}`).join(', ');
        return `Risk Trend: ${trend || 'No risks logged yet'}`;
      }
      case 'health': {
        const h = metrics.latestReport?.health || 'unknown';
        const emoji = h === 'green' ? '🟢' : h === 'yellow' ? '🟡' : h === 'red' ? '🔴' : '⚪';
        return `Sprint Health: ${emoji} ${h.toUpperCase()}`;
      }
      default: return '';
    }
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const categories = Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>;

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Generate Sprint Report
        </CardTitle>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Select the metrics to include, preview the email, then send it to stakeholders.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Picker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Choose Metrics</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={selectAll}>Select All</Button>
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={clearAll}>Clear</Button>
            </div>
          </div>

          {categories.map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {AVAILABLE_METRICS.filter(m => m.category === cat).map(metric => {
                  const isSelected = selectedMetrics.includes(metric.id);
                  return (
                    <motion.button
                      key={metric.id}
                      onClick={() => toggleMetric(metric.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs text-left transition-colors border ${
                        isSelected
                          ? 'bg-primary/10 border-primary/30 text-foreground'
                          : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isSelected
                        ? <CheckSquare className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        : <Square className="w-3.5 h-3.5 flex-shrink-0" />
                      }
                      <span className="flex-shrink-0">{metric.icon}</span>
                      {metric.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Preview / Send buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            disabled={selectedMetrics.length === 0}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {showPreview ? 'Hide Preview' : 'Preview Email'}
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            disabled={selectedMetrics.length === 0 || sent}
            onClick={handleSend}
          >
            {sent ? (
              <>✓ Sent</>
            ) : (
              <><Send className="w-3.5 h-3.5 mr-1.5" /> Send Report</>
            )}
          </Button>
        </div>

        {/* Email Preview */}
        <AnimatePresence>
          {showPreview && selectedMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-border rounded-lg bg-card mt-2 overflow-hidden">
                {/* Email header */}
                <div className="bg-muted/50 px-4 py-3 border-b border-border space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold">Sprint Status Report</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground space-y-0.5">
                    <p><span className="font-semibold">From:</span> Scrum Master &lt;you@nebula.aws&gt;</p>
                    <p><span className="font-semibold">To:</span> Sean Park (PO), VP Engineering, Stakeholders</p>
                    <p><span className="font-semibold">Subject:</span> [Project Nebula] Sprint 21 — Day {currentDay} Status ({dayInfo.weekday})</p>
                    <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Email body */}
                <div className="px-4 py-3 text-xs space-y-3 font-mono">
                  <p className="text-foreground">Hi Team,</p>
                  <p className="text-muted-foreground">
                    Here is the Sprint 21 status report for <span className="font-semibold text-foreground">Day {currentDay}/8</span> ({dayInfo.weekday}, Week {dayInfo.week}).
                  </p>

                  <div className="border border-border rounded-md bg-muted/20 p-3 space-y-1.5">
                    <p className="font-semibold text-foreground text-[11px] mb-2">📊 Selected Metrics</p>
                    {selectedMetrics.map(id => (
                      <div key={id} className="flex items-start gap-2 text-[11px]">
                        <span className="text-primary mt-0.5">▸</span>
                        <span className="text-foreground">{renderMetricRow(id)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Risks detail if selected */}
                  {selectedMetrics.includes('open_risks') && metrics.openRisks.length > 0 && (
                    <div className="border border-destructive/20 rounded-md bg-destructive/5 p-3 space-y-1.5">
                      <p className="font-semibold text-destructive text-[11px]">⚠️ Open Risk Details</p>
                      {metrics.openRisks.map((r, i) => (
                        <div key={r.id} className="text-[10px] text-foreground">
                          <span className="font-semibold">{i + 1}. {r.risk}</span>
                          <span className="text-muted-foreground"> — Impact: {r.impact} | Owner: {r.owner}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Executive summary if health selected */}
                  {selectedMetrics.includes('health') && metrics.latestReport && (
                    <div className="border border-primary/20 rounded-md bg-primary/5 p-3 space-y-1">
                      <p className="font-semibold text-primary text-[11px]">📋 Executive Summary</p>
                      <p className="text-[10px] text-foreground">{metrics.latestReport.summary}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        <span className="font-semibold">Next Focus:</span> {metrics.latestReport.next_focus}
                      </p>
                    </div>
                  )}

                  <p className="text-muted-foreground pt-1">
                    Please let me know if you have questions or need further detail on any metric.
                  </p>
                  <div className="pt-1 text-foreground">
                    <p>Best regards,</p>
                    <p className="font-semibold">Scrum Master — Project Nebula</p>
                    <p className="text-muted-foreground text-[10px]">Sprint 21 • AWS Cloud Migration</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-muted/30 px-4 py-2 border-t border-border">
                  <p className="text-[9px] text-muted-foreground text-center">
                    {selectedMetrics.length} metric{selectedMetrics.length !== 1 ? 's' : ''} selected • Auto-tracked since Day 1
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-primary font-semibold py-2"
          >
            ✅ Report sent to stakeholders successfully!
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
