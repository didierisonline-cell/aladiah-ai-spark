import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import {
  BarChart3, Users, DollarSign, TrendingUp, Activity, Clock,
  Bot, BookOpen, FlaskConical, Award, Target, Flame, ArrowUpRight,
  GraduationCap, Briefcase, Globe, Calendar, Search, ChevronRight,
  Star, CheckCircle, X
} from 'lucide-react';

interface StudentStat {
  userId: string;
  fullName: string;
  registeredAt: string;
  overallProgress: number;
  streak: number;
  points: number;
  labsCompleted: number;
  totalLabs: number;
  avgQuizScore: number;
  quizAttempts: number;
  courseProgress: { courseId: string; title: string; total: number; completed: number; pct: number }[];
}

interface AdminData {
  overview: {
    totalStudents: number;
    totalLogins: number;
    totalVideoWatches: number;
    totalAiChats: number;
    totalBlogReads: number;
    totalBlogClicks: number;
    totalTimeSpentHours: number;
    avgQuizScore: number;
    totalPointsEarned: number;
    completedLabs: number;
    totalReferrals: number;
  };
  students: StudentStat[];
  financials: {
    pricePerStudent: number;
    milestones: { students: number; revenue: number; label: string }[];
    placement: {
      scrumMaster: { contractValue: number; cost: number; profit: number };
      projectManager: { contractValue: number; cost: number; profit: number };
      targets: { role: string; placed: number; profitEach: number; totalProfit: number }[];
    };
    twoYearPlan: {
      year1: { enrollmentTarget: number; enrollmentRevenue: number; placementTarget: number; placementRevenue: number };
      year2: { enrollmentTarget: number; enrollmentRevenue: number; placementTarget: number; placementRevenue: number };
    };
  };
}

const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentStat | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (user) loadAdminData();
  }, [user, authLoading]);

  const loadAdminData = async () => {
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('admin-analytics');
      if (fnError) throw fnError;
      setData(fnData);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to load admin data. You may not have admin access.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><BarChart3 className="w-12 h-12 text-primary animate-pulse" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24 text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const { overview, financials } = data;
  const currentRevenue = overview.totalStudents * financials.pricePerStudent;
  const goalRevenue = 1999000;
  const goalProgress = Math.min(100, Math.round((currentRevenue / goalRevenue) * 100));

  const kpiCards = [
    { icon: Users, label: 'Total Students', value: overview.totalStudents, color: 'text-primary' },
    { icon: Activity, label: 'Total Logins', value: overview.totalLogins, color: 'text-secondary' },
    { icon: Clock, label: 'Hours Spent', value: overview.totalTimeSpentHours, color: 'text-accent' },
    { icon: Bot, label: 'AI Chats', value: overview.totalAiChats, color: 'text-primary' },
    { icon: BookOpen, label: 'Videos Watched', value: overview.totalVideoWatches, color: 'text-secondary' },
    { icon: FlaskConical, label: 'Labs Completed', value: overview.completedLabs, color: 'text-accent' },
    { icon: Target, label: 'Avg Quiz Score', value: `${overview.avgQuizScore}%`, color: 'text-primary' },
    { icon: Award, label: 'Referrals', value: overview.totalReferrals, color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">Backend Office</h1>
              <p className="text-sm text-muted-foreground">Analytics, KPIs & Financial Milestones</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="analytics"><Activity className="w-3 h-3 mr-1" />Analytics</TabsTrigger>
            <TabsTrigger value="students"><Users className="w-3 h-3 mr-1" />Students</TabsTrigger>
            <TabsTrigger value="financials"><DollarSign className="w-3 h-3 mr-1" />Financials</TabsTrigger>
            <TabsTrigger value="gantt"><Calendar className="w-3 h-3 mr-1" />Gantt</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpiCards.map((kpi, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                      <div>
                        <p className="text-xl font-bold">{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}</p>
                        <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Engagement Metrics */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Blog Engagement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span>Blog Reads</span><span className="font-bold">{overview.totalBlogReads}</span></div>
                  <div className="flex justify-between text-sm"><span>Link Clicks</span><span className="font-bold">{overview.totalBlogClicks}</span></div>
                  <div className="flex justify-between text-sm"><span>Click-through Rate</span>
                    <span className="font-bold">{overview.totalBlogReads > 0 ? Math.round((overview.totalBlogClicks / overview.totalBlogReads) * 100) : 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm"><span>Points Earned</span><span className="font-bold">{overview.totalPointsEarned.toLocaleString()}</span></div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI Assistant Usage</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span>Total AI Conversations</span><span className="font-bold">{overview.totalAiChats}</span></div>
                  <div className="flex justify-between text-sm"><span>Avg per Student</span>
                    <span className="font-bold">{overview.totalStudents > 0 ? Math.round(overview.totalAiChats / overview.totalStudents) : 0}</span>
                  </div>
                  <div className="flex justify-between text-sm"><span>Labs Completed</span><span className="font-bold">{overview.completedLabs}</span></div>
                  <div className="flex justify-between text-sm"><span>Videos Watched</span><span className="font-bold">{overview.totalVideoWatches}</span></div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">All Students ({data.students?.length || 0})</h3>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-2">
                  {(data.students || [])
                    .filter(s => s.fullName.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map(student => (
                      <button
                        key={student.userId}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 hover:bg-muted/50 transition-all group"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {student.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{student.fullName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Joined {new Date(student.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-bold">{student.overallProgress}%</p>
                            <p className="text-[10px] text-muted-foreground">Progress</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{student.streak}</p>
                            <p className="text-[10px] text-muted-foreground">Streak</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{student.points}</p>
                            <p className="text-[10px] text-muted-foreground">Pts</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ))}
                  {(data.students || []).filter(s => s.fullName.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">No students found</p>
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Student Detail Modal */}
            <Dialog open={!!selectedStudent} onOpenChange={open => !open && setSelectedStudent(null)}>
              <DialogContent className="max-w-lg max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {selectedStudent?.fullName}
                  </DialogTitle>
                </DialogHeader>
                {selectedStudent && (
                  <ScrollArea className="max-h-[65vh] pr-2">
                    <div className="space-y-4">
                      {/* Key Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="text-2xl font-bold text-primary">{selectedStudent.overallProgress}%</p>
                          <p className="text-[10px] text-muted-foreground">Overall Progress</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <Flame className="w-4 h-4 mx-auto mb-1 text-secondary" />
                          <p className="text-2xl font-bold">{selectedStudent.streak}</p>
                          <p className="text-[10px] text-muted-foreground">Day Streak</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <Star className="w-4 h-4 mx-auto mb-1 text-accent" />
                          <p className="text-2xl font-bold">{selectedStudent.points}</p>
                          <p className="text-[10px] text-muted-foreground">Points</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <FlaskConical className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="text-2xl font-bold">{selectedStudent.labsCompleted}/{selectedStudent.totalLabs}</p>
                          <p className="text-[10px] text-muted-foreground">Labs Done</p>
                        </div>
                      </div>

                      {/* Quiz Stats */}
                      <div className="p-3 rounded-lg border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Quiz Performance</span>
                          <Badge variant="outline">{selectedStudent.quizAttempts} attempts</Badge>
                        </div>
                        <Progress value={selectedStudent.avgQuizScore} className="h-2 mb-1" />
                        <p className="text-xs text-muted-foreground">Avg Score: {selectedStudent.avgQuizScore}%</p>
                      </div>

                      {/* Registration Info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Registered: {new Date(selectedStudent.registeredAt).toLocaleDateString()}</span>
                      </div>

                      {/* Per-Course Progress */}
                      <h4 className="font-semibold text-sm">Course Progress</h4>
                      {selectedStudent.courseProgress.map(cp => (
                        <div key={cp.courseId} className="space-y-1.5 p-3 rounded-lg border">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium truncate max-w-[250px]">{cp.title}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">{cp.pct}%</span>
                              {cp.pct === 100 && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                            </div>
                          </div>
                          <Progress value={cp.pct} className="h-2" />
                          <p className="text-xs text-muted-foreground">{cp.completed}/{cp.total} lessons</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>


          <TabsContent value="financials" className="space-y-4">
            {/* Revenue Goal */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-accent" /> Revenue Goal: {formatCurrency(goalRevenue)}</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span>Current: {formatCurrency(currentRevenue)}</span>
                <span>{goalProgress}%</span>
              </div>
              <Progress value={goalProgress} className="h-3 mb-4" />
              <p className="text-sm text-muted-foreground">{overview.totalStudents} of 1,000 students enrolled</p>
            </Card>

            {/* Enrollment Milestones */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> Enrollment Milestones ($1,999/student)</h3>
              <div className="space-y-2">
                {financials.milestones.map((m, i) => {
                  const hit = overview.totalStudents >= m.students;
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${hit ? 'bg-green-50 border-green-200 dark:bg-green-900/10' : ''}`}>
                      <div className="flex items-center gap-2">
                        {hit ? <Target className="w-4 h-4 text-green-500" /> : <Target className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-sm font-medium">{m.label}</span>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(m.revenue)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Placement Revenue */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-secondary" /> Placement Revenue</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg border space-y-1">
                  <p className="text-xs text-muted-foreground">Scrum Master Contract</p>
                  <p className="text-lg font-bold">{formatCurrency(150000)}</p>
                  <p className="text-xs">Cost: $30K-$50K → <span className="text-green-600 font-semibold">Profit: ~{formatCurrency(100000)}</span></p>
                </div>
                <div className="p-4 rounded-lg border space-y-1">
                  <p className="text-xs text-muted-foreground">Project Manager Contract</p>
                  <p className="text-lg font-bold">{formatCurrency(200000)}</p>
                  <p className="text-xs">Cost: $30K-$70K → <span className="text-green-600 font-semibold">Profit: ~{formatCurrency(130000)}</span></p>
                </div>
              </div>
              <div className="space-y-2">
                {financials.placement.targets.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm">{t.placed} {t.role}s placed</span>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(t.totalProfit)}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2 Year Aggressive Plan */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> 2-Year Aggressive Plan</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-primary/5">
                  <h4 className="font-bold text-primary mb-3">Year 1 (1/3 of goal)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Enrollment Target</span><span className="font-bold">334 students</span></div>
                    <div className="flex justify-between"><span>Enrollment Revenue</span><span className="font-bold">{formatCurrency(667666)}</span></div>
                    <div className="flex justify-between"><span>Placements Target</span><span className="font-bold">167</span></div>
                    <div className="flex justify-between"><span>Placement Revenue</span><span className="font-bold text-green-600">{formatCurrency(16700000)}</span></div>
                  </div>
                  <div className="mt-3 p-2 rounded bg-muted text-xs">
                    <p className="font-medium">Marketing: Webinars, Instagram/YouTube ads, DR events, press releases</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-secondary/5">
                  <h4 className="font-bold text-secondary mb-3">Year 2 (2/3 of goal)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Enrollment Target</span><span className="font-bold">666 students</span></div>
                    <div className="flex justify-between"><span>Enrollment Revenue</span><span className="font-bold">{formatCurrency(1331334)}</span></div>
                    <div className="flex justify-between"><span>Placements Target</span><span className="font-bold">333</span></div>
                    <div className="flex justify-between"><span>Placement Revenue</span><span className="font-bold text-green-600">{formatCurrency(33300000)}</span></div>
                  </div>
                  <div className="mt-3 p-2 rounded bg-muted text-xs">
                    <p className="font-medium">Scaling: Caribbean expansion, influencer partnerships, geo-targeting, event sponsorships</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Gantt Chart Tab */}
          <TabsContent value="gantt" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> 2-Year Milestone Gantt Chart</h3>
              <div className="space-y-1">
                {[
                  { label: 'Platform Launch & First Students', start: 0, end: 8, color: 'bg-primary', q: 'Q1 Y1' },
                  { label: 'Webinar Series & DR Marketing', start: 4, end: 16, color: 'bg-secondary', q: 'Q1-Q2 Y1' },
                  { label: '50 Students Enrolled', start: 8, end: 12, color: 'bg-accent', q: 'Q2 Y1' },
                  { label: 'First Placements Begin', start: 12, end: 20, color: 'bg-primary', q: 'Q2-Q3 Y1' },
                  { label: '100 Students Enrolled', start: 16, end: 20, color: 'bg-accent', q: 'Q3 Y1' },
                  { label: 'Caribbean Event Sponsorships', start: 16, end: 24, color: 'bg-secondary', q: 'Q3-Q4 Y1' },
                  { label: '200 Students Enrolled', start: 20, end: 24, color: 'bg-accent', q: 'Q4 Y1' },
                  { label: '334 Students (Y1 Goal)', start: 22, end: 24, color: 'bg-green-500', q: 'Q4 Y1' },
                  { label: 'Influencer Partnerships', start: 24, end: 36, color: 'bg-secondary', q: 'Q1-Q3 Y2' },
                  { label: 'Geo-Targeting Campaigns', start: 26, end: 40, color: 'bg-secondary', q: 'Q1-Q3 Y2' },
                  { label: '500 Students Enrolled', start: 30, end: 36, color: 'bg-accent', q: 'Q2 Y2' },
                  { label: 'Press Releases & PR Campaign', start: 32, end: 44, color: 'bg-secondary', q: 'Q2-Q4 Y2' },
                  { label: '1000 Students (Final Goal)', start: 44, end: 48, color: 'bg-green-500', q: 'Q4 Y2' },
                  { label: '500 SMs + 500 PMs Placed', start: 36, end: 48, color: 'bg-primary', q: 'Q3-Q4 Y2' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-2 py-1.5">
                    <span className="text-[10px] text-muted-foreground w-16 shrink-0 text-right">{item.q}</span>
                    <div className="flex-1 h-7 relative bg-muted/30 rounded-sm overflow-hidden">
                      <div
                        className={`absolute h-full ${item.color} rounded-sm flex items-center px-2`}
                        style={{ left: `${(item.start / 48) * 100}%`, width: `${((item.end - item.start) / 48) * 100}%` }}
                      >
                        <span className="text-[9px] text-white font-medium truncate">{item.label}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-muted-foreground border-t pt-2">
                <span>Q1 Y1</span><span>Q2 Y1</span><span>Q3 Y1</span><span>Q4 Y1</span>
                <span>Q1 Y2</span><span>Q2 Y2</span><span>Q3 Y2</span><span>Q4 Y2</span>
              </div>
            </Card>

            {/* Marketing Investment Plan */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Marketing Investment Strategy</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { channel: 'Online Marketing (Meta/Google)', budget: '$5K-10K/mo', priority: 'High' },
                  { channel: 'Webinar Series', budget: '$2K-5K/mo', priority: 'High' },
                  { channel: 'Influencer Partnerships', budget: '$3K-8K/mo', priority: 'Medium' },
                  { channel: 'Geo-Targeting (DR & Caribbean)', budget: '$4K-7K/mo', priority: 'High' },
                  { channel: 'Press Releases', budget: '$1K-3K/release', priority: 'Medium' },
                  { channel: 'Event Sponsorships (DR)', budget: '$5K-15K/event', priority: 'High' },
                ].map((m, i) => (
                  <div key={i} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={m.priority === 'High' ? 'default' : 'outline'} className="text-[10px]">{m.priority}</Badge>
                    </div>
                    <p className="text-sm font-medium">{m.channel}</p>
                    <p className="text-xs text-muted-foreground">{m.budget}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
