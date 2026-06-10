import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CommandCenterDashboard from '@/components/admin/CommandCenterDashboard';
import WorkforceNav from '@/components/admin/WorkforceNav';
import {
  getLatestReport,
  runCeoChiefOfStaffAgent,
} from '@/services/agents/ceoChiefOfStaffAgent';
import { DailyCommandReport } from '@/types/agentReports';

/**
 * /admin/command-center
 * The Aladiah Command Center — surface for the CEO Chief of Staff Agent.
 */
const CommandCenter = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [report, setReport] = useState<DailyCommandReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const loadLatest = useCallback(async () => {
    setLoading(true);
    try {
      const latest = await getLatestReport();
      setReport(latest);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadLatest();
  }, [user, loadLatest]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const { report: fresh, reportId } = await runCeoChiefOfStaffAgent();
      setReport(fresh);
      toast({
        title: reportId ? 'Command report generated' : 'Report generated (not saved)',
        description: reportId
          ? "Today's report and CEO action tasks were saved."
          : 'The report was built but could not be saved — check admin access / RLS.',
        variant: reportId ? 'default' : 'destructive',
      });
    } catch (err) {
      toast({
        title: 'Generation failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <WorkforceNav />
        <CommandCenterDashboard
          report={report}
          loading={loading}
          generating={generating}
          onGenerate={handleGenerate}
        />
      </main>
    </div>
  );
};

export default CommandCenter;
