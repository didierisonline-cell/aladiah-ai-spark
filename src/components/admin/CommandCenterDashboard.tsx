import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  DollarSign,
  Megaphone,
  RefreshCw,
  ServerCog,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import MetricCard from './MetricCard';
import DailyReportCard from './DailyReportCard';
import RiskRadar from './RiskRadar';
import CEOActionQueue from './CEOActionQueue';
import { DailyCommandReport } from '@/types/agentReports';

const money = (v: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v || 0);

/** A generic section panel for report sections 1-6. */
const SectionPanel = ({
  icon: Icon,
  title,
  summary,
  rows,
  highlights,
  concerns,
}: {
  icon: React.ElementType;
  title: string;
  summary?: string;
  rows: { label: string; value: string | number }[];
  highlights?: string[];
  concerns?: string[];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-lg bg-muted/30 px-3 py-2">
            <p className="text-base font-bold text-foreground">
              {typeof r.value === 'number' ? r.value.toLocaleString() : r.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{r.label}</p>
          </div>
        ))}
      </div>
      {summary && (
        <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
      )}
      {highlights && highlights.length > 0 && (
        <ul className="text-xs text-green-700 list-disc pl-4 space-y-0.5">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
      {concerns && concerns.length > 0 && (
        <ul className="text-xs text-orange-700 list-disc pl-4 space-y-0.5">
          {concerns.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

interface CommandCenterDashboardProps {
  report: DailyCommandReport | null;
  loading: boolean;
  generating: boolean;
  onGenerate: () => void;
}

const CommandCenterDashboard = ({
  report,
  loading,
  generating,
  onGenerate,
}: CommandCenterDashboardProps) => {
  const openRisks = report?.risks?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ServerCog className="w-6 h-6 text-primary" />
            Aladiah Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            CEO Chief of Staff Agent — daily operating picture
          </p>
        </div>
        <Button onClick={onGenerate} disabled={generating}>
          <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating…' : "Generate Today's Report"}
        </Button>
      </div>

      {/* Empty / loading states */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading latest report…
          </CardContent>
        </Card>
      ) : !report ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-muted-foreground">
              No report yet. Generate today's command report to get started.
            </p>
            <Button onClick={onGenerate} disabled={generating}>
              <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating…' : "Generate Today's Report"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard
              icon={DollarSign}
              label="Revenue Today"
              value={money(report.revenue.revenue_today)}
              accent="text-green-600"
            />
            <MetricCard
              icon={TrendingUp}
              label="MRR"
              value={money(report.revenue.mrr)}
              accent="text-emerald-600"
            />
            <MetricCard
              icon={UserPlus}
              label="New Students"
              value={report.students.new_signups}
              accent="text-blue-600"
            />
            <MetricCard
              icon={Users}
              label="Active Students"
              value={report.students.active_students}
              accent="text-indigo-600"
            />
            <MetricCard
              icon={Megaphone}
              label="New Leads"
              value={report.sales.new_inquiries}
              accent="text-purple-600"
            />
            <MetricCard
              icon={AlertTriangle}
              label="Open Risks"
              value={openRisks}
              accent={openRisks > 0 ? 'text-orange-600' : 'text-green-600'}
            />
          </div>

          {/* Executive summary */}
          <DailyReportCard report={report} />

          {/* Operational sections 1-6 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionPanel
              icon={DollarSign}
              title="Revenue Health"
              summary={report.revenue.notes}
              rows={[
                { label: 'MRR', value: money(report.revenue.mrr) },
                { label: 'Revenue Today', value: money(report.revenue.revenue_today) },
                { label: 'New Paid', value: report.revenue.new_paid_students },
                { label: 'Failed Payments', value: report.revenue.failed_payments },
                { label: 'Cancellations', value: report.revenue.cancellations },
              ]}
            />
            <SectionPanel
              icon={Users}
              title="Student Activity"
              summary={report.students.notes}
              rows={[
                { label: 'New Signups', value: report.students.new_signups },
                { label: 'Active', value: report.students.active_students },
                { label: 'Inactive', value: report.students.inactive_students },
                { label: 'Quiz Failures', value: report.students.quiz_failures },
                { label: 'Need Help', value: report.students.students_needing_help },
              ]}
            />
            <SectionPanel
              icon={BookOpen}
              title="Product Progress"
              summary={report.product.notes}
              rows={[
                { label: 'New Lessons', value: report.product.new_lessons_created },
                { label: 'Modules Done', value: report.product.new_modules_completed },
                { label: 'New Sims', value: report.product.new_simulations_created },
              ]}
              concerns={report.product.content_gaps}
            />
            <SectionPanel
              icon={ServerCog}
              title="Platform Health"
              summary={report.platform.notes}
              rows={[
                { label: 'Website', value: report.platform.website_status },
                { label: 'Signup Flow', value: report.platform.signup_flow_status },
                { label: 'Payment Flow', value: report.platform.payment_flow_status },
              ]}
              concerns={[
                ...report.platform.broken_links,
                ...report.platform.errors_detected,
              ]}
            />
            <SectionPanel
              icon={Megaphone}
              title="Marketing Performance"
              summary={report.marketing.notes}
              rows={[
                { label: 'Posts', value: report.marketing.posts_published },
                { label: 'Visitors', value: report.marketing.website_visitors },
                { label: 'Leads', value: report.marketing.leads_generated },
              ]}
              highlights={report.marketing.top_content ? [report.marketing.top_content] : []}
            />
            <SectionPanel
              icon={Activity}
              title="Sales Pipeline"
              summary={report.sales.notes}
              rows={[
                { label: 'Inquiries', value: report.sales.new_inquiries },
                { label: 'Hot Leads', value: report.sales.hot_leads },
                { label: 'Unanswered', value: report.sales.unanswered_messages },
                { label: 'Webinar Signups', value: report.sales.webinar_signups },
              ]}
            />
          </div>

          {/* Risks + Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RiskRadar risks={report.risks} />
            <CEOActionQueue actions={report.recommended_ceo_actions} />
          </div>

          <p className="text-[11px] text-muted-foreground text-center pt-2">
            Report date {report.report_date} ·
            <Badge variant="outline" className="ml-1 text-[10px] font-normal">
              {report.urgency_level}
            </Badge>
          </p>
        </>
      )}
    </div>
  );
};

export default CommandCenterDashboard;
