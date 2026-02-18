import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Send, X, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const GLOSSARY_TERMS: { term: string; definition: string; category: string }[] = [
  { term: "Sprint", definition: "A time-boxed iteration (typically 2 weeks) where a potentially releasable product increment is created.", category: "Scrum Events" },
  { term: "Sprint Planning", definition: "Ceremony where the team defines the Sprint Goal and selects backlog items to commit to for the sprint.", category: "Scrum Events" },
  { term: "Daily StandUp", definition: "A 15-minute time-boxed daily meeting where each team member shares: what they did yesterday, what they'll do today, and any blockers.", category: "Scrum Events" },
  { term: "Sprint Review", definition: "End-of-sprint ceremony where the team demos completed work to stakeholders and collects feedback.", category: "Scrum Events" },
  { term: "Sprint Retrospective", definition: "A ceremony for the team to inspect itself and create a plan for improvements in the next sprint.", category: "Scrum Events" },
  { term: "Backlog Refinement", definition: "Session where the team reviews, re-estimates, and adds detail to upcoming backlog items. Also called 'Grooming'.", category: "Scrum Events" },
  { term: "Scrum of Scrums", definition: "A scaled meeting where representatives from multiple Scrum teams coordinate dependencies and resolve cross-team blockers.", category: "Scrum Events" },
  { term: "Product Backlog", definition: "An ordered list of everything that might be needed in the product, managed by the Product Owner.", category: "Artifacts" },
  { term: "Sprint Backlog", definition: "The set of product backlog items selected for the sprint plus a plan for delivering them.", category: "Artifacts" },
  { term: "User Story", definition: "A requirement written as: 'As a [role], I want to [action], so that I can [benefit].'", category: "Artifacts" },
  { term: "Story Points", definition: "A relative estimation unit measuring the effort, complexity, and uncertainty of a user story.", category: "Artifacts" },
  { term: "Acceptance Criteria", definition: "Conditions that a user story must satisfy to be considered complete and accepted by the Product Owner.", category: "Artifacts" },
  { term: "Definition of Done (DoD)", definition: "A shared understanding of what 'complete' means for every increment, including coding, testing, documentation, and deployment standards.", category: "Artifacts" },
  { term: "Velocity", definition: "The average number of story points a team completes per sprint, used for forecasting.", category: "Metrics" },
  { term: "Burndown Chart", definition: "A graph showing remaining work (story points) over time during a sprint, comparing actual vs. ideal progress.", category: "Metrics" },
  { term: "Burnup Chart", definition: "A graph showing cumulative work completed vs. total scope over time, useful for tracking scope changes.", category: "Metrics" },
  { term: "Cycle Time", definition: "The elapsed time from when work begins on an item to when it's completed (e.g., In Progress → Done).", category: "Metrics" },
  { term: "Throughput", definition: "The number of work items completed per unit of time (e.g., stories per sprint).", category: "Metrics" },
  { term: "Sprint Predictability", definition: "The percentage of committed story points actually delivered, measuring a team's ability to forecast.", category: "Metrics" },
  { term: "Defect Escape Rate", definition: "Percentage of defects found after QA (in production or UAT) vs. total defects, measuring QA effectiveness.", category: "Metrics" },
  { term: "Scrum Master", definition: "A servant-leader who facilitates Scrum events, removes impediments, coaches the team, and protects the sprint from interruptions.", category: "Roles" },
  { term: "Product Owner", definition: "The person responsible for maximizing product value by managing and prioritizing the Product Backlog.", category: "Roles" },
  { term: "Development Team", definition: "A cross-functional, self-organizing group that delivers the product increment each sprint.", category: "Roles" },
  { term: "Impediment", definition: "Any obstacle blocking the team's progress that the Scrum Master should help remove.", category: "Concepts" },
  { term: "WIP Limit", definition: "Work-In-Progress limit — restricts the number of items in a given workflow stage to improve flow and reduce context-switching.", category: "Concepts" },
  { term: "Scope Creep", definition: "Uncontrolled additions to project scope without corresponding adjustments to time, cost, or resources.", category: "Concepts" },
  { term: "Blocker", definition: "A dependency or issue preventing a team member from making progress on their current work item.", category: "Concepts" },
  { term: "Risk Register", definition: "A document tracking identified risks, their probability, impact, mitigation strategies, and owners.", category: "Concepts" },
  { term: "VPC (Virtual Private Cloud)", definition: "An isolated virtual network in AWS where you launch resources with your own IP range, subnets, and security rules.", category: "AWS/Cloud" },
  { term: "IAM (Identity & Access Management)", definition: "AWS service for managing user permissions and access policies using least-privilege principles.", category: "AWS/Cloud" },
  { term: "ECS (Elastic Container Service)", definition: "AWS service for running and managing Docker containers at scale using Fargate (serverless) or EC2.", category: "AWS/Cloud" },
  { term: "CI/CD Pipeline", definition: "Continuous Integration / Continuous Deployment — automated process for building, testing, and deploying code changes.", category: "AWS/Cloud" },
  { term: "CloudWatch", definition: "AWS monitoring and observability service for collecting metrics, logs, and setting alarms.", category: "AWS/Cloud" },
  { term: "DMS (Database Migration Service)", definition: "AWS service for migrating databases to the cloud with minimal downtime using continuous replication.", category: "AWS/Cloud" },
  { term: "WAF (Web Application Firewall)", definition: "AWS service that protects web applications from common exploits like SQL injection and XSS attacks.", category: "AWS/Cloud" },
  { term: "NAT Gateway", definition: "A managed AWS service that allows instances in private subnets to access the internet without being publicly accessible.", category: "AWS/Cloud" },
];

const CATEGORIES = [...new Set(GLOSSARY_TERMS.map(t => t.category))];

interface SimulationGlossaryProps {
  currentDay: number;
  simulationId: string | null;
}

const SimulationGlossary = ({ currentDay, simulationId }: SimulationGlossaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiAnswer]);

  const filtered = search.trim()
    ? GLOSSARY_TERMS.filter(t =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : GLOSSARY_TERMS;

  const grouped = CATEGORIES.map(cat => ({
    category: cat,
    terms: filtered.filter(t => t.category === cat),
  })).filter(g => g.terms.length > 0);

  const askAI = async () => {
    if (!aiQuestion.trim() || aiLoading) return;
    setAiLoading(true);
    setAiAnswer('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: aiQuestion }],
          studentContext: { currentTopic: 'Scrum Simulation - Project Nebula', courseProgress: 50, labTopic: `Day ${currentDay} simulation glossary question` },
          mode: 'lab_interactive',
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setAiAnswer(fullText); }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      setAiAnswer('Sorry, I couldn\'t process that question. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Scrum Glossary & AI Help"
      >
        <BookOpen className="w-5 h-5" />
      </motion.button>

      {/* Glossary panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-card border-l shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Scrum Glossary
                  </h2>
                  <p className="text-xs text-muted-foreground">{GLOSSARY_TERMS.length} terms • Project Nebula</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search terms..."
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Toggle AI Chat */}
              <div className="px-3 py-2 border-b">
                <Button
                  variant={showAiChat ? 'default' : 'outline'}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowAiChat(!showAiChat)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {showAiChat ? 'Back to Glossary' : 'Ask AI About Any Term'}
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {showAiChat ? (
                  <div className="p-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Ask anything about Scrum, Agile, AWS, or your simulation. The AI mentor will give you personalized answers.
                    </p>
                    {aiAnswer && (
                      <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed">
                        {aiAnswer}
                      </div>
                    )}
                    {aiLoading && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  <div className="p-3 space-y-1">
                    {grouped.map(group => (
                      <div key={group.category}>
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === group.category ? null : group.category)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <span>{group.category} ({group.terms.length})</span>
                          {expandedCategory === group.category ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <AnimatePresence>
                          {expandedCategory === group.category && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {group.terms.map(t => (
                                <div key={t.term} className="px-3 py-2 ml-2 border-l-2 border-primary/20 mb-1">
                                  <p className="text-sm font-semibold">{t.term}</p>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{t.definition}</p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Input (visible in AI chat mode) */}
              {showAiChat && (
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={e => setAiQuestion(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && askAI()}
                      placeholder="e.g. What is velocity in Scrum?"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      disabled={aiLoading}
                    />
                    <Button size="icon" onClick={askAI} disabled={aiLoading || !aiQuestion.trim()} className="rounded-lg">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimulationGlossary;
