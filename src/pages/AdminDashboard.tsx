import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import {
  BarChart3, Users, DollarSign, TrendingUp, Activity, Clock,
  Bot, BookOpen, FlaskConical, Globe, Award, Target,
  Flame, GraduationCap, Briefcase, Calendar, Search,
  ChevronRight, ArrowUpRight, ArrowDownRight, Star,
  Zap, MessageSquare, CheckCircle, AlertCircle, RefreshCw,
} from 'lucide-react';

interface StudentStat {
  userId: string; fullName: string; registeredAt: string;
  overallProgress: number; streak: number; points: number;
  labsCompleted: number; totalLabs: number; avgQuizScore: number; quizAttempts: number;
  courseProgress: { courseId: string; title: string; total: number; completed: number; pct: number }[];
}
interface AdminData {
  overview: {
    totalStudents: number; totalLogins: number; totalVideoWatches: number;
    totalAiChats: number; totalBlogReads: number; totalBlogClicks: number;
    totalTimeSpentHours: number; avgQuizScore: number; totalPointsEarned: number;
    completedLabs: number; totalReferrals: number;
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

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const DEFAULT_INFLUENCERS = [
  { name: 'Carlos Duran', handle: '@carlosduran', region: 'DR', students: 47, revenue: 14053, commission: 30, trend: 'up' },
  { name: 'Bettyna Silva', handle: '@bettynacoach', region: 'Brazil', students: 31, revenue: 9269, commission: 25, trend: 'up' },
  { name: 'Massiel Arias', handle: '@massielfitness', region: 'DR', students: 22, revenue: 6578, commission: 25, trend: 'down' },
  { name: 'Carlos LATAM', handle: '@carloslatam', region: 'Colombia', students: 18, revenue: 5382, commission: 25, trend: 'up' },
  { name: 'Yailin Promo', handle: '@yailinviral', region: 'Africa', students: 12, revenue: 3588, commission: 20, trend: 'up' },
];
const AGENT_USAGE = [
  { name: 'Scrum Master', color: '#17356b', pct: 42 },
  { name: 'Agile & Scrum', color: '#534AB7', pct: 24 },
  { name: 'Jira Training', color: '#185FA5', pct: 18 },
  { name: 'SAFe 6.0', color: '#BA7517', pct: 10 },
  { name: 'Managing AI', color: '#D85A30', pct: 6 },
];
const GEO = [
  { region: 'United States', students: 1, pct: 100 },
  { region: 'Dominican Republic', students: 0, pct: 0 },
  { region: 'Colombia', students: 0, pct: 0 },
  { region: 'Brazil', students: 0, pct: 0 },
  { region: 'Africa', students: 0, pct: 0 },
];

function StatCard({ icon: Icon, label, value, color = 'text-primary', trend }: {
  icon: React.ElementType; label: string; value: string | number; color?: string; trend?: 'up' | 'down' | null;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            {trend && (
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden flex-1">
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
        className="h-full rounded-full" style={{ background: color }} />
    </div>
  );
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentStat | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [influencers, setInfluencers] = useState(DEFAULT_INFLUENCERS);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<{name:string;handle:string;region:string}>({name:'',handle:'',region:''});

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (user) loadAdminData();
  }, [user, authLoading]);

  const loadAdminData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data: profiles } = await supabase.from('profiles').select('id, full_name, created_at');
      const { data: progress } = await supabase.from('user_progress').select('*');
      const { data: analytics } = await supabase.from('user_analytics').select('*');
      const totalStudents = profiles?.length || 0;
      const totalAiChats = analytics?.reduce((s, a) => s + (a.ai_chats || 0), 0) || 0;
      const totalVideoWatches = analytics?.reduce((s, a) => s + (a.video_watches || 0), 0) || 0;
      const totalBlogReads = analytics?.reduce((s, a) => s + (a.blog_reads || 0), 0) || 0;
      const totalBlogClicks = analytics?.reduce((s, a) => s + (a.blog_clicks || 0), 0) || 0;
      const totalTimeSpentHours = Math.round((analytics?.reduce((s, a) => s + (a.time_spent_minutes || 0), 0) || 0) / 60);
      const totalPointsEarned = progress?.reduce((s, p) => s + (p.points || 0), 0) || 0;
      const completedLabs = progress?.reduce((s, p) => s + (p.labs_completed || 0), 0) || 0;
      const avgQuizScore = progress?.length ? Math.round(progress.reduce((s, p) => s + (p.avg_quiz_score || 0), 0) / progress.length) : 0;
      const students: StudentStat[] = (profiles || []).map(p => {
        const prog = progress?.find(x => x.user_id === p.id);
        return {
          userId: p.id, fullName: p.full_name || 'Unknown', registeredAt: p.created_at,
          overallProgress: prog?.overall_progress || 0, streak: prog?.streak || 0,
          points: prog?.points || 0, labsCompleted: prog?.labs_completed || 0, totalLabs: 12,
          avgQuizScore: prog?.avg_quiz_score || 0, quizAttempts: prog?.quiz_attempts || 0, courseProgress: [],
        };
      });
      const pricePerStudent = 299;
      setData({
        overview: { totalStudents, totalLogins: totalStudents, totalVideoWatches, totalAiChats, totalBlogReads, totalBlogClicks, totalTimeSpentHours, avgQuizScore, totalPointsEarned, completedLabs, totalReferrals: 0 },
        students,
        financials: {
          pricePerStudent,
          milestones: [10,25,50,100,250,500,1000].map(n => ({ students: n, revenue: n * pricePerStudent, label: n >= 1000 ? n/1000+'K' : ''+n })),
          placement: {
            scrumMaster: { contractValue: 15000, cost: 999, profit: 14001 },
            projectManager: { contractValue: 20000, cost: 999, profit: 19001 },
            targets: [{ role: 'Scrum Master', placed: 0, profitEach: 14001, totalProfit: 0 }, { role: 'Project Manager', placed: 0, profitEach: 19001, totalProfit: 0 }],
          },
          twoYearPlan: {
            year1: { enrollmentTarget: 500, enrollmentRevenue: 149500, placementTarget: 50, placementRevenue: 700050 },
            year2: { enrollmentTarget: 2000, enrollmentRevenue: 598000, placementTarget: 200, placementRevenue: 3200000 },
          },
        },
      });
      setLastRefresh(new Date());
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to load'); }
    setLoading(false);
  }, []);

  const filtered = data?.students.filter(s => s.fullName.toLowerCase().includes(studentSearch.toLowerCase())) || [];
  const mrr = (data?.overview.totalStudents || 0) * 299;
  const arr = mrr * 12;

  if (authLoading || loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <RefreshCw className="w-8 h-8 text-primary mx-auto" />
        </motion.div>
        <p className="text-muted-foreground text-sm">Loading command center...</p>
      </div>
    </div>
  );

  return (
    <FounderShell>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">Command Center</h1>
              <p className="text-sm text-muted-foreground">Aladiah Academy · Live Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">Updated {lastRefresh.toLocaleTimeString()}</span>
            <Button variant="outline" size="sm" onClick={loadAdminData} className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ background: 'hsl(215 70% 22%)' }}>
          {[
            { label: 'MRR', value: fmt(mrr), icon: DollarSign },
            { label: 'ARR projected', value: fmt(arr), icon: TrendingUp },
            { label: 'Active Students', value: data?.overview.totalStudents || 0, icon: Users },
            { label: 'AI Conversations', value: data?.overview.totalAiChats || 0, icon: Bot },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <item.icon className="w-5 h-5 text-white/50 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</p>
              <p className="text-xs text-white/50">{item.label}</p>
            </div>
          ))}
        </motion.div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="analytics"><Activity className="w-3.5 h-3.5 mr-1" />Analytics</TabsTrigger>
            <TabsTrigger value="students"><Users className="w-3.5 h-3.5 mr-1" />Students</TabsTrigger>
            <TabsTrigger value="partners"><Star className="w-3.5 h-3.5 mr-1" />Partners</TabsTrigger>
            <TabsTrigger value="financials"><DollarSign className="w-3.5 h-3.5 mr-1" />Revenue</TabsTrigger>
            <TabsTrigger value="gantt"><Calendar className="w-3.5 h-3.5 mr-1" />Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Total Students', value: data?.overview.totalStudents || 0, trend: 'up' as const },
                { icon: Clock, label: 'Hours Spent', value: data?.overview.totalTimeSpentHours || 0 },
                { icon: Bot, label: 'AI Chats', value: data?.overview.totalAiChats || 0, color: 'text-purple-600' },
                { icon: Flame, label: 'Avg Quiz Score', value: (data?.overview.avgQuizScore || 0) + '%', color: 'text-orange-500' },
                { icon: BookOpen, label: 'Blog Reads', value: data?.overview.totalBlogReads || 0 },
                { icon: FlaskConical, label: 'Labs Done', value: data?.overview.completedLabs || 0, color: 'text-green-600' },
                { icon: Activity, label: 'Videos Watched', value: data?.overview.totalVideoWatches || 0 },
                { icon: Award, label: 'Points Earned', value: data?.overview.totalPointsEarned || 0, color: 'text-yellow-600' },
              ].map((kpi, i) => <StatCard key={i} {...kpi} />)}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />Top Courses by Enrollment</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {AGENT_USAGE.map(a => (
                    <div key={a.name} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-24 truncate">{a.name}</span>
                      <MiniBar pct={a.pct} color={a.color} />
                      <span className="text-xs font-bold w-8 text-right" style={{ color: a.color }}>{a.pct}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4 text-primary" />Geographic Distribution</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {GEO.map(g => (
                    <div key={g.region} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-40 truncate">{g.region}</span>
                      <MiniBar pct={g.pct} color="hsl(215 70% 22%)" />
                      <span className="text-xs font-bold w-6 text-right text-muted-foreground">{g.students}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />Blog Engagement</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {[
                    { label: 'Blog Reads', value: data?.overview.totalBlogReads || 0 },
                    { label: 'Link Clicks', value: data?.overview.totalBlogClicks || 0 },
                    { label: 'Click-through Rate', value: (data?.overview.totalBlogReads ? Math.round((data.overview.totalBlogClicks / data.overview.totalBlogReads) * 100) : 0) + '%' },
                    { label: 'Points Earned', value: (data?.overview.totalPointsEarned || 0).toLocaleString() },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1 border-b border-border/40 last:border-0">
                      <span className="text-muted-foreground">{row.label}</span><span className="font-semibold">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" />AI Assistant Usage</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {[
                    { label: 'Total AI Conversations', value: data?.overview.totalAiChats || 0 },
                    { label: 'Avg per Student', value: data?.overview.totalStudents ? Math.round((data.overview.totalAiChats) / data.overview.totalStudents) : 0 },
                    { label: 'Labs Completed', value: data?.overview.completedLabs || 0 },
                    { label: 'Videos Watched', value: data?.overview.totalVideoWatches || 0 },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1 border-b border-border/40 last:border-0">
                      <span className="text-muted-foreground">{row.label}</span><span className="font-semibold">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search students..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="pl-9" />
              </div>
              <Badge variant="secondary">{filtered.length} students</Badge>
            </div>
            <div className="grid gap-3">
              {filtered.length === 0 ? (
                <Card><CardContent className="py-12 text-center">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">No students found</p>
                  <p className="text-xs text-muted-foreground mt-1">Students appear here once they register</p>
                </CardContent></Card>
              ) : filtered.map((s, i) => (
                <motion.div key={s.userId} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/20" onClick={() => setSelectedStudent(selectedStudent?.userId === s.userId ? null : s)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {s.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.fullName}</p>
                            <p className="text-xs text-muted-foreground">Joined {new Date(s.registeredAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center hidden sm:block"><p className="text-sm font-bold">{s.overallProgress}%</p><p className="text-xs text-muted-foreground">Progress</p></div>
                          <div className="text-center hidden sm:block"><p className="text-sm font-bold">{s.streak}</p><p className="text-xs text-muted-foreground">Streak</p></div>
                          <div className="text-center hidden sm:block"><p className="text-sm font-bold">{s.points.toLocaleString()}</p><p className="text-xs text-muted-foreground">Points</p></div>
                          <Badge variant={s.overallProgress >= 75 ? 'default' : s.overallProgress >= 40 ? 'secondary' : 'outline'} className="text-xs">
                            {s.overallProgress >= 75 ? 'Advanced' : s.overallProgress >= 40 ? 'Active' : 'New'}
                          </Badge>
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedStudent?.userId === s.userId ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                      {selectedStudent?.userId === s.userId && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-border/50">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              { label: 'Labs Done', value: s.labsCompleted + '/' + s.totalLabs, icon: FlaskConical },
                              { label: 'Quiz Score', value: s.avgQuizScore + '%', icon: Target },
                              { label: 'Quiz Attempts', value: s.quizAttempts, icon: Activity },
                              { label: 'Points', value: s.points.toLocaleString(), icon: Award },
                            ].map(item => (
                              <div key={item.label} className="bg-muted/40 rounded-lg p-3 text-center">
                                <item.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                                <p className="font-bold text-sm">{item.value}</p>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Overall Progress</span><span>{s.overallProgress}%</span></div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: s.overallProgress + '%' }} className="h-full bg-primary rounded-full" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Partners" value={influencers.length} />
              <StatCard icon={Star} label="Students via Partners" value={influencers.reduce((s, i) => s + i.students, 0)} trend="up" />
              <StatCard icon={DollarSign} label="Partner Revenue" value={fmt(influencers.reduce((s, i) => s + i.revenue, 0))} trend="up" />
              <StatCard icon={TrendingUp} label="Avg Commission" value={Math.round(influencers.reduce((s, i) => s + i.commission, 0) / influencers.length) + '%'} />
            </div>
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-primary" />Partner Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...influencers].sort((a, b) => b.students - a.students).map((inf, i) => (
                    <div key={inf.handle} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {editingIdx === i ? (
                            <input
                              autoFocus
                              className="font-semibold text-sm border-b border-primary outline-none bg-transparent w-32"
                              value={editVal}
                              onChange={e => setEditVal(e.target.value)}
                              onBlur={() => {
                                const updated = [...influencers].sort((a,b) => b.students - a.students);
                                const origIdx = influencers.findIndex(x => x.handle === updated[i].handle);
                                const newList = [...influencers];
                                newList[origIdx] = { ...newList[origIdx], name: editVal };
                                setInfluencers(newList);
                                setEditingIdx(null);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                if (e.key === 'Escape') setEditingIdx(null);
                              }}
                            />
                          ) : (
                            <p
                              className="font-semibold text-sm cursor-pointer hover:text-primary hover:underline transition-colors"
                              title="Click to edit name"
                              onClick={() => { setEditingIdx(i); setEditVal(inf.name); }}
                            >{inf.name}</p>
                          )}
                          <span className="text-xs text-muted-foreground">{inf.handle}</span>
                          <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => { setEditingIdx(i); setEditRow({name: inf.name, handle: inf.handle, region: inf.region}); }}>{inf.region} ✎</Badge>
                        </div>
                        <MiniBar pct={Math.round((inf.students / influencers[0].students) * 100)} color="hsl(215 70% 22%)" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{inf.students} students</p>
                        <p className="text-xs text-muted-foreground">{fmt(inf.revenue)} · {inf.commission}%</p>
                      </div>
                      <span className={`text-xs font-bold ${inf.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>{inf.trend === 'up' ? '↑' : '↓'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" />Commission Payouts This Month</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {influencers.map(inf => (
                    <div key={inf.handle} className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0">
                      <span className="font-medium">{inf.name}</span>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">{inf.commission}%</Badge>
                        <span className="font-bold text-primary">{fmt(inf.revenue * (inf.commission / 100))}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total Payouts</span><span className="text-red-600">{fmt(influencers.reduce((s, i) => s + i.revenue * (i.commission / 100), 0))}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>Net Revenue</span><span className="text-green-600">{fmt(influencers.reduce((s, i) => s + i.revenue * (1 - i.commission / 100), 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            {data && (<>
              <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Revenue Milestones</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {data.financials.milestones.map(m => (
                      <div key={m.students} className={`p-3 rounded-xl border text-center transition-all ${data.overview.totalStudents >= m.students ? 'border-primary bg-primary/5' : 'border-border/50 bg-muted/20'}`}>
                        {data.overview.totalStudents >= m.students && <CheckCircle className="w-3.5 h-3.5 text-primary mx-auto mb-1" />}
                        <p className="text-lg font-bold">{m.label}</p>
                        <p className="text-xs text-muted-foreground">students</p>
                        <p className="text-sm font-semibold text-primary mt-1">{fmt(m.revenue)}/mo</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { tier: 'Foundation', price: 99, color: '#185FA5', bg: '#E6F1FB' },
                  { tier: 'Career Accelerator', price: 299, color: '#3C3489', bg: '#EEEDFE' },
                  { tier: 'Elite Mentorship', price: 499, color: '#633806', bg: '#FAEEDA' },
                ].map(t => (
                  <Card key={t.tier}><CardContent className="p-4" style={{ background: t.bg }}>
                    <p className="text-sm font-bold mb-1" style={{ color: t.color }}>{t.tier}</p>
                    <p className="text-2xl font-bold" style={{ color: t.color }}>${t.price}<span className="text-sm font-normal">/mo</span></p>
                    <div className="mt-3 space-y-1 text-xs" style={{ color: t.color }}>
                      {[10, 100, 1000].map(n => <div key={n} className="flex justify-between"><span>{n} students</span><span className="font-bold">{fmt(t.price * n)}/mo</span></div>)}
                    </div>
                  </CardContent></Card>
                ))}
              </div>
              <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />2-Year Revenue Plan</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[{ label: 'Year 1', plan: data.financials.twoYearPlan.year1 }, { label: 'Year 2', plan: data.financials.twoYearPlan.year2 }].map(({ label, plan }) => (
                      <div key={label} className="space-y-2 text-sm">
                        <p className="font-bold text-base text-primary">{label}</p>
                        {[
                          { l: 'Enrollment Target', v: plan.enrollmentTarget.toLocaleString() + ' students' },
                          { l: 'Enrollment Revenue', v: fmt(plan.enrollmentRevenue) },
                          { l: 'Placement Target', v: plan.placementTarget + ' placements' },
                          { l: 'Placement Revenue', v: fmt(plan.placementRevenue) },
                          { l: 'Total Revenue', v: fmt(plan.enrollmentRevenue + plan.placementRevenue) },
                        ].map(row => (
                          <div key={row.l} className={`flex justify-between py-1 border-b border-border/40 ${row.l === 'Total Revenue' ? 'font-bold text-green-600 border-0' : ''}`}>
                            <span className={row.l === 'Total Revenue' ? '' : 'text-muted-foreground'}>{row.l}</span><span>{row.v}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>)}
          </TabsContent>

          <TabsContent value="gantt" className="space-y-4">
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Build Roadmap 2025-2026</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { phase: 'Phase 1 — Foundation', status: 'done', items: ['AI Brain (Claude) connected', 'Agent pills live', 'Professor personalities', 'About page team section'] },
                    { phase: 'Phase 2 — Engagement', status: 'done', items: ['Founder Welcome modal', 'Professor real names', 'Admin dashboard', 'Student progress tracking'] },
                    { phase: 'Phase 3 — Growth', status: 'active', items: ['Influencer partner system', 'Multilingual founder video', 'Revenue tracking', 'Partner dashboard'] },
                    { phase: 'Phase 4 — Scale', status: 'upcoming', items: ['ElevenLabs voice avatars', 'Kimi analytics', 'Mobile app', 'Enterprise deals'] },
                    { phase: 'Phase 5 — Global', status: 'upcoming', items: ['10 US cities live', '40 international markets', '1,000 students milestone', 'Certification partnerships'] },
                  ].map((phase, i) => (
                    <motion.div key={phase.phase} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className={`p-4 rounded-xl border ${phase.status === 'done' ? 'bg-green-50 border-green-200' : phase.status === 'active' ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border/50'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {phase.status === 'done' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {phase.status === 'active' && <Zap className="w-4 h-4 text-primary" />}
                        {phase.status === 'upcoming' && <Clock className="w-4 h-4 text-muted-foreground" />}
                        <p className={`font-bold text-sm ${phase.status === 'done' ? 'text-green-600' : phase.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>{phase.phase}</p>
                        <Badge variant={phase.status === 'done' ? 'default' : phase.status === 'active' ? 'secondary' : 'outline'} className="text-xs ml-auto">
                          {phase.status === 'done' ? 'Complete' : phase.status === 'active' ? 'In Progress' : 'Upcoming'}
                        </Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1.5">
                        {phase.items.map(item => (
                          <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className={`w-1.5 h-1.5 rounded-full ${phase.status === 'done' ? 'bg-green-500' : phase.status === 'active' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </FounderShell>
  );
};

export default AdminDashboard;
