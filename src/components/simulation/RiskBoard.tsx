import { motion } from 'framer-motion';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { RiskItem } from './SimulationTypes';

interface RiskBoardProps {
  risks: RiskItem[];
  currentDay: number;
}

const impactColors: Record<string, string> = {
  High: "border-destructive/50 bg-destructive/5",
  Medium: "border-secondary/50 bg-secondary/5",
  Low: "border-accent/50 bg-accent/5",
};

const impactBadge: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-secondary/10 text-secondary",
  Low: "bg-accent/10 text-accent-foreground",
};

const statusIcon: Record<string, any> = {
  open: AlertTriangle,
  mitigated: Shield,
  closed: CheckCircle,
};

const RiskBoard = ({ risks, currentDay }: RiskBoardProps) => {
  const openRisks = risks.filter(r => r.status === 'open');
  const mitigatedRisks = risks.filter(r => r.status === 'mitigated');
  const closedRisks = risks.filter(r => r.status === 'closed');

  const RiskCard = ({ risk, index }: { risk: RiskItem; index: number }) => {
    const Icon = statusIcon[risk.status] || AlertTriangle;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-lg border-l-4 p-4 bg-card border ${impactColors[risk.impact] || ''}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${risk.status === 'open' ? 'text-destructive' : risk.status === 'mitigated' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${impactBadge[risk.impact] || ''}`}>
              {risk.impact} Impact
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">Day {risk.day}</span>
        </div>
        <p className="text-sm font-medium mb-2">{risk.risk}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><span className="font-semibold">Owner:</span> {risk.owner}</p>
          <p><span className="font-semibold">Mitigation:</span> {risk.mitigation}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b bg-card">
        <h2 className="text-lg font-display font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-secondary" /> Risk Register
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Project Nebula — Sprint 21 • Day {currentDay}</p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span>{openRisks.length} Open</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{mitigatedRisks.length} Mitigated</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span>{closedRisks.length} Closed</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {openRisks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3 text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Open Risks
            </h3>
            <div className="space-y-3">
              {openRisks.map((r, i) => <RiskCard key={r.id} risk={r} index={i} />)}
            </div>
          </div>
        )}
        {mitigatedRisks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3 text-primary flex items-center gap-2">
              <Shield className="w-4 h-4" /> Mitigated
            </h3>
            <div className="space-y-3">
              {mitigatedRisks.map((r, i) => <RiskCard key={r.id} risk={r} index={i} />)}
            </div>
          </div>
        )}
        {closedRisks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3 text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Closed
            </h3>
            <div className="space-y-3">
              {closedRisks.map((r, i) => <RiskCard key={r.id} risk={r} index={i} />)}
            </div>
          </div>
        )}
        {risks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No risks identified yet</p>
            <p className="text-xs">Risks will appear as the simulation progresses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskBoard;
