import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import QuestionReviewQueue from '@/components/founder/QuestionReviewQueue';
import ModuleReadinessPanel from '@/components/founder/ModuleReadinessPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClipboardCheck, GaugeCircle, BookOpen } from 'lucide-react';

/**
 * /founder/curriculum — Curriculum command surface inside the Founder Portal.
 * Tab 1: Question Review Queue (draft → in review → approved → archived).
 * Tab 2: Module Readiness (7 dimensions, per module, with percentages).
 * Founder-only via <FounderRoute>.
 */
const FounderCurriculum = () => (
  <FounderShell>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Curriculum</h1>
            <p className="text-sm text-muted-foreground">
              Review the question bank and track module readiness. Nothing reaches a student until approved.
            </p>
          </div>
        </div>
        <Link to="/founder" className="text-sm text-muted-foreground hover:text-foreground">← Founder Home</Link>
      </div>

      <Tabs defaultValue="review">
        <TabsList className="mb-4">
          <TabsTrigger value="review"><ClipboardCheck className="w-4 h-4 mr-1.5" /> Question Review</TabsTrigger>
          <TabsTrigger value="readiness"><GaugeCircle className="w-4 h-4 mr-1.5" /> Module Readiness</TabsTrigger>
        </TabsList>
        <TabsContent value="review"><QuestionReviewQueue /></TabsContent>
        <TabsContent value="readiness"><ModuleReadinessPanel /></TabsContent>
      </Tabs>
  </FounderShell>
);

export default FounderCurriculum;
