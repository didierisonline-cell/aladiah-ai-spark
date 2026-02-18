import { motion } from 'framer-motion';
import { Activity, Target, Clock, Zap, Bug, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardStory, DayScore, SPRINT_SCHEDULE } from './SimulationTypes';

interface PowerMetricsProps {
  stories: BoardStory[];
  scores: DayScore[];
  currentDay: number;
}

const PowerMetrics = ({ stories, scores, currentDay }: PowerMetricsProps) => {
  const totalPoints = stories.reduce((s, st) => s + st.points, 0);
  const donePoints = stories.filter(s => s.status === 'Done').reduce((s, st) => s + st.points, 0);
  const doneCount = stories.filter(s => s.status === 'Done').length;

  // --- Velocity Trend (simulated past sprints + current) ---
  const pastVelocities = [42, 48, 51, 46]; // simulated historical sprints
  const currentVelocity = donePoints;
  const velocities = [...pastVelocities, currentVelocity];
  const maxVel = Math.max(...velocities, 1);
  const avgVelocity = Math.round(velocities.reduce((a, b) => a + b, 0) / velocities.length);

  // --- Sprint Predictability (committed vs delivered %) ---
  const committedPoints = totalPoints;
  const predictability = committedPoints > 0 ? Math.round((donePoints / committedPoints) * 100) : 0;
  const predictabilityColor = predictability >= 80 ? 'text-primary' : predictability >= 60 ? 'text-accent' : 'text-destructive';

  // --- Cycle Time (avg days per done story, simulated) ---
  const baseCycleTime = 2.4;
  const cycleTime = doneCount > 0
    ? Math.max(1.2, baseCycleTime - (currentDay * 0.05) + (Math.random() * 0.3 - 0.15)).toFixed(1)
    : '—';

  // --- Throughput (stories done per day) ---
  const throughput = currentDay > 0 ? (doneCount / currentDay).toFixed(1) : '0';

  // --- Defect Escape Rate (simulated) ---
  const totalQAStories = stories.filter(s => ['QA', 'Done', 'Ready for Release'].includes(s.status)).length;
  const escapedDefects = currentDay >= 5 ? 1 : 0; // simulate 1 defect escaping mid-sprint
  const defectRate = totalQAStories > 0 ? Math.round((escapedDefects / totalQAStories) * 100) : 0;

  // --- Release Burnup (cumulative scope vs done over days) ---
  const burnupData = Array.from({ length: Math.min(currentDay, 8) + 1 }, (_, i) => {
    const scope = totalPoints + (i >= 4 ? 3 : 0); // scope creep day 4
    const done = i === 0 ? 0 : Math.min(donePoints, Math.round((donePoints / Math.max(currentDay, 1)) * i));
    return { day: i, scope, done };
  });
  const maxBurnup = Math.max(...burnupData.map(d => d.scope), 1);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-sm font-display font-bold flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Power Dashboard — Elite Agile Metrics
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">Metrics update dynamically as the sprint progresses</p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Velocity Trend */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-primary" /> Velocity Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="flex items-end gap-[3px] h-12 mt-1">
              {velocities.map((v, i) => (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-t ${i === velocities.length - 1 ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / maxVel) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-muted-foreground">S17–S21</span>
              <span className="text-xs font-bold">Avg: {avgVelocity} pts</span>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Predictability */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
              <Target className="w-3.5 h-3.5 text-secondary" /> Sprint Predictability
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 text-center">
            <div className="relative w-16 h-16 mx-auto mt-1">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray={`${predictability * 0.88} 88`}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 88' }}
                  animate={{ strokeDasharray: `${predictability * 0.88} 88` }}
                  transition={{ duration: 0.8 }}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${predictabilityColor}`}>
                {predictability}%
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">{donePoints}/{committedPoints} pts delivered</p>
          </CardContent>
        </Card>

        {/* Cycle Time */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-accent" /> Cycle Time
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 text-center">
            <p className="text-3xl font-display font-bold mt-2">{cycleTime}</p>
            <p className="text-[10px] text-muted-foreground">days / story avg</p>
            <p className="text-[9px] mt-1 text-primary">Target: ≤ 2.0 days</p>
          </CardContent>
        </Card>

        {/* Throughput */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-primary" /> Throughput
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 text-center">
            <p className="text-3xl font-display font-bold mt-2">{throughput}</p>
            <p className="text-[10px] text-muted-foreground">stories / day</p>
            <p className="text-[9px] mt-1">{doneCount} stories completed in {currentDay} days</p>
          </CardContent>
        </Card>

        {/* Defect Escape Rate */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
              <Bug className="w-3.5 h-3.5 text-destructive" /> Defect Escape Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 text-center">
            <p className={`text-3xl font-display font-bold mt-2 ${defectRate === 0 ? 'text-primary' : 'text-destructive'}`}>
              {defectRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">{escapedDefects} escaped / {totalQAStories} tested</p>
            <p className="text-[9px] mt-1 text-primary">{defectRate === 0 ? '🟢 Zero defects' : '🔴 Investigate root cause'}</p>
          </CardContent>
        </Card>

        {/* Release Burnup placeholder card with chart inside */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-secondary" /> Release Burnup
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="relative h-16 border-l border-b border-border ml-4 mt-1">
              <span className="absolute -left-4 top-0 text-[8px] text-muted-foreground">{maxBurnup}</span>
              <span className="absolute -left-4 bottom-0 text-[8px] text-muted-foreground">0</span>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Scope line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.6"
                  points={burnupData.map(d => `${(d.day / 8) * 100},${100 - (d.scope / maxBurnup) * 100}`).join(' ')}
                />
                {/* Done line */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  points={burnupData.map(d => `${(d.day / 8) * 100},${100 - (d.done / maxBurnup) * 100}`).join(' ')}
                />
              </svg>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-muted-foreground opacity-60" style={{ borderTop: '1px dashed' }} /> Scope</div>
              <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-primary" /> Delivered</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PowerMetrics;
