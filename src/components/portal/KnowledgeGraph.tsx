import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, ChevronRight, CheckCircle, AlertTriangle, Lock, Sparkles, X } from 'lucide-react';

interface KnowledgeNode {
  id: string;
  label: string;
  category: string;
  children?: string[];
  description: string;
  status: 'mastered' | 'learning' | 'weak' | 'locked';
}

const KNOWLEDGE_TREE: KnowledgeNode[] = [
  { id: 'agile', label: 'Agile Principles', category: 'Foundation', children: ['scrum', 'kanban', 'lean'], description: 'The Agile Manifesto, 12 principles, iterative development mindset.', status: 'mastered' },
  { id: 'scrum', label: 'Scrum Framework', category: 'Core', children: ['sprint_planning', 'daily_standup', 'sprint_review', 'retro', 'backlog'], description: 'Empirical process control: transparency, inspection, adaptation.', status: 'mastered' },
  { id: 'kanban', label: 'Kanban', category: 'Core', children: ['wip_limits', 'flow_metrics'], description: 'Visual workflow management, continuous delivery, pull-based system.', status: 'learning' },
  { id: 'lean', label: 'Lean Thinking', category: 'Core', children: ['value_stream'], description: 'Eliminate waste, optimize value flow, continuous improvement.', status: 'learning' },
  { id: 'sprint_planning', label: 'Sprint Planning', category: 'Ceremonies', children: [], description: 'Define Sprint Goal, select PBIs, create Sprint Backlog, capacity planning.', status: 'mastered' },
  { id: 'daily_standup', label: 'Daily Scrum', category: 'Ceremonies', children: [], description: '15-min daily sync: progress, plans, impediments. Developer-owned.', status: 'mastered' },
  { id: 'sprint_review', label: 'Sprint Review', category: 'Ceremonies', children: [], description: 'Inspect increment, adapt backlog, stakeholder feedback session.', status: 'learning' },
  { id: 'retro', label: 'Retrospective', category: 'Ceremonies', children: ['retro_techniques'], description: 'Team improvement: Start/Stop/Continue, root cause analysis.', status: 'weak' },
  { id: 'backlog', label: 'Product Backlog', category: 'Artifacts', children: ['user_stories', 'estimation'], description: 'Ordered list of work, PO-owned, emergent, refined continuously.', status: 'learning' },
  { id: 'retro_techniques', label: 'Retro Techniques', category: 'Advanced', children: [], description: 'Sailboat, 4Ls, Starfish, Timeline retrospective formats.', status: 'locked' },
  { id: 'user_stories', label: 'User Stories', category: 'Artifacts', children: [], description: 'As a [user], I want [goal], so that [benefit]. INVEST criteria.', status: 'mastered' },
  { id: 'estimation', label: 'Estimation', category: 'Practices', children: [], description: 'Story points, Planning Poker, T-shirt sizing, relative estimation.', status: 'learning' },
  { id: 'wip_limits', label: 'WIP Limits', category: 'Kanban', children: [], description: 'Constrain work-in-progress to improve flow and reduce context switching.', status: 'locked' },
  { id: 'flow_metrics', label: 'Flow Metrics', category: 'Kanban', children: [], description: 'Lead time, cycle time, throughput, cumulative flow diagrams.', status: 'locked' },
  { id: 'value_stream', label: 'Value Stream Mapping', category: 'Lean', children: [], description: 'Visualize end-to-end delivery process, identify waste and bottlenecks.', status: 'locked' },
  { id: 'safe', label: 'SAFe 6.0', category: 'Scaling', children: ['art', 'pi_planning', 'rte_role'], description: 'Scaled Agile Framework for enterprise agility.', status: 'learning' },
  { id: 'art', label: 'Agile Release Train', category: 'SAFe', children: [], description: 'Long-lived team of Agile teams, aligned to a common mission.', status: 'weak' },
  { id: 'pi_planning', label: 'PI Planning', category: 'SAFe', children: [], description: 'Big room planning event, aligning teams for Program Increment.', status: 'locked' },
  { id: 'rte_role', label: 'RTE Role', category: 'SAFe', children: [], description: 'Release Train Engineer: servant leader facilitating ART events.', status: 'locked' },
];

interface KnowledgeGraphProps {
  weakAreas?: string[];
  strongAreas?: string[];
  onTopicSelect?: (topic: string) => void;
}

const statusConfig = {
  mastered: { color: 'bg-green-500', icon: <CheckCircle className="w-3 h-3" />, label: 'kg.mastered', badge: 'default' as const },
  learning: { color: 'bg-blue-500', icon: <Sparkles className="w-3 h-3" />, label: 'kg.learning', badge: 'secondary' as const },
  weak: { color: 'bg-orange-500', icon: <AlertTriangle className="w-3 h-3" />, label: 'kg.needs_work', badge: 'destructive' as const },
  locked: { color: 'bg-muted-foreground/30', icon: <Lock className="w-3 h-3" />, label: 'kg.locked', badge: 'outline' as const },
};

const KnowledgeGraph = ({ weakAreas = [], strongAreas = [], onTopicSelect }: KnowledgeGraphProps) => {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = useMemo(() => {
    return KNOWLEDGE_TREE.map(node => {
      let status = node.status;
      if (weakAreas.some(w => node.label.toLowerCase().includes(w.toLowerCase()))) status = 'weak';
      if (strongAreas.some(s => node.label.toLowerCase().includes(s.toLowerCase()))) status = 'mastered';
      return { ...node, status };
    });
  }, [weakAreas, strongAreas]);

  const categories = useMemo(() => {
    const cats: Record<string, KnowledgeNode[]> = {};
    nodes.forEach(n => {
      if (!cats[n.category]) cats[n.category] = [];
      cats[n.category].push(n);
    });
    return cats;
  }, [nodes]);

  const selected = nodes.find(n => n.id === selectedNode);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" /> {t('kg.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 mb-3 flex-wrap">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
              {t(cfg.label)}
            </div>
          ))}
        </div>

        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-3">
            {Object.entries(categories).map(([cat, catNodes]) => (
              <div key={cat}>
                <p className="text-[11px] uppercase tracking-wider text-white font-bold mb-1.5">{t(`kg.cat.${cat.toLowerCase().replace(/ /g, '_')}`) || cat}</p>
                <div className="flex flex-wrap gap-1.5">
                  {catNodes.map(node => {
                    const cfg = statusConfig[node.status];
                    return (
                      <button
                        key={node.id}
                        onClick={() => {
                          setSelectedNode(node.id === selectedNode ? null : node.id);
                          if (node.status !== 'locked' && onTopicSelect) onTopicSelect(node.label);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                          selectedNode === node.id
                            ? 'border-blue-400 bg-blue-500/20 text-white'
                            : node.status === 'locked'
                            ? 'border-white/20 bg-white/5 text-white/40 cursor-not-allowed'
                            : 'border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5'
                        }`}
                        disabled={node.status === 'locked'}
                      >
                        <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                        {node.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground">{selected.label}</h4>
                  <Badge variant={statusConfig[selected.status].badge} className="text-[10px]">
                    {t(statusConfig[selected.status].label)}
                  </Badge>
                </div>
                <button onClick={() => setSelectedNode(null)}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{selected.description}</p>
              {selected.children && selected.children.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                  Leads to: {selected.children.map(c => nodes.find(n => n.id === c)?.label).filter(Boolean).join(', ')}
                </div>
              )}
              {selected.status === 'weak' && onTopicSelect && (
                <Button size="sm" variant="coral" className="mt-2 h-7 text-xs" onClick={() => onTopicSelect(selected.label)}>
                  <Sparkles className="w-3 h-3 mr-1" /> Practice in Lab
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
