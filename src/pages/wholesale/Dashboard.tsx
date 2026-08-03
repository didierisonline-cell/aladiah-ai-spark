import { useEffect, useMemo, useState } from "react";
import { WholesaleLayout, Card, Badge, WS, money } from "./ui";
import { sourceLeads } from "@/wholesale/data/leadService";
import { WHOLESALE_CONFIG } from "@/wholesale/config";
import type { Lead, LeadStage } from "@/wholesale/types";

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "New", skip_traced: "Skip-Traced", contacted: "Contacted",
  qualifying: "Qualifying", appointment: "Appointment", under_contract: "Under Contract",
  marketing: "Marketing", assigned: "Assigned", closed: "Closed", dead: "Dead",
};

const FUNNEL: LeadStage[] = ["new", "contacted", "qualifying", "under_contract", "closed"];

export default function WholesaleDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => {
    sourceLeads().then(setLeads);
  }, []);

  const stats = useMemo(() => {
    const hot = leads.filter((l) => l.temperature === "hot").length;
    const underContract = leads.filter((l) => l.stage === "under_contract").length;
    const closed = leads.filter((l) => l.stage === "closed").length;
    const projectedFees = closed * WHOLESALE_CONFIG.underwriting.defaultAssignmentFee;
    return { total: leads.length, hot, underContract, closed, projectedFees };
  }, [leads]);

  const funnelCounts = useMemo(
    () => FUNNEL.map((s) => ({ stage: s, n: leads.filter((l) => l.stage === s).length })),
    [leads],
  );
  const maxFunnel = Math.max(1, ...funnelCounts.map((f) => f.n));

  const kpis = [
    { label: "Active Leads", value: stats.total, color: WS.blue },
    { label: "Hot Leads", value: stats.hot, color: WS.orange },
    { label: "Under Contract", value: stats.underContract, color: WS.gold },
    { label: "Projected Fees", value: money(stats.projectedFees), color: WS.green },
  ];

  return (
    <WholesaleLayout
      title="Command Center"
      subtitle={`${WHOLESALE_CONFIG.primaryMarket.label} · sourced from distressed-property stacks`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {kpis.map((k) => (
          <Card key={k.label}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: WS.fm }}>{k.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: k.color, marginTop: ".4rem" }}>{k.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1rem" }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: "1rem" }}>Acquisition Funnel</div>
          {funnelCounts.map((f) => (
            <div key={f.stage} style={{ marginBottom: ".85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: WS.fm, marginBottom: ".3rem" }}>
                <span>{STAGE_LABELS[f.stage]}</span>
                <span style={{ color: WS.fg, fontWeight: 700 }}>{f.n}</span>
              </div>
              <div style={{ height: 8, background: WS.border, borderRadius: 999 }}>
                <div style={{ height: 8, width: `${(f.n / maxFunnel) * 100}%`, background: WS.blue, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: "1rem" }}>Top Motivated Sellers</div>
          {leads.slice(0, 6).map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".55rem 0", borderBottom: `1px solid ${WS.border}` }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.property.address.line1}</div>
                <div style={{ fontSize: 11, color: WS.fm }}>{l.property.address.city}, {l.property.address.state}</div>
              </div>
              <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: WS.fg }}>{l.motivationScore}</span>
                <Badge color={l.temperature === "hot" ? WS.orange : l.temperature === "warm" ? WS.gold : WS.blue}>{l.temperature}</Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </WholesaleLayout>
  );
}
