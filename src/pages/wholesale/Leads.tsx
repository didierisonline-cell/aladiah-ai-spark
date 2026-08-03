import { useEffect, useState } from "react";
import { WholesaleLayout, Card, Badge, WS, money, tempColor } from "./ui";
import { sourceLeads, skipTraceLead, underwriteLead } from "@/wholesale/data/leadService";
import type { Lead, LeadStage } from "@/wholesale/types";

const COLUMNS: { stage: LeadStage; label: string }[] = [
  { stage: "new", label: "New" },
  { stage: "skip_traced", label: "Skip-Traced" },
  { stage: "contacted", label: "Contacted" },
  { stage: "qualifying", label: "Qualifying" },
  { stage: "appointment", label: "Appointment" },
  { stage: "under_contract", label: "Under Contract" },
  { stage: "marketing", label: "Marketing" },
  { stage: "closed", label: "Closed" },
];

export default function WholesaleLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sourceLeads().then(setLeads);
  }, []);

  const update = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelected((s) => (s && s.id === updated.id ? updated : s));
  };

  const onSkipTrace = async (lead: Lead) => {
    setBusy(true);
    update(await skipTraceLead(lead));
    setBusy(false);
  };
  const onUnderwrite = async (lead: Lead) => {
    setBusy(true);
    update(await underwriteLead(lead));
    setBusy(false);
  };
  const moveStage = (lead: Lead, stage: LeadStage) =>
    update({ ...lead, stage, updatedAt: "2026-08-03T12:00:00.000Z" });

  return (
    <WholesaleLayout title="Lead Pipeline" subtitle={`${leads.length} leads · drag-free Kanban; click a card to work it`}>
      <div style={{ display: "flex", gap: ".85rem", overflowX: "auto", paddingBottom: "1rem" }}>
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.stage);
          return (
            <div key={col.stage} style={{ minWidth: 240, flex: "0 0 240px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem", padding: "0 .25rem" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: WS.fm, textTransform: "uppercase", letterSpacing: .5 }}>{col.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: WS.fg }}>{colLeads.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {colLeads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelected(l)}
                    style={{ background: WS.card, border: `1px solid ${WS.border}`, borderRadius: ".6rem", padding: ".75rem", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: ".5rem" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>{l.property.address.line1}</div>
                      <Badge color={tempColor(l.temperature)}>{l.motivationScore}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: WS.fm, marginTop: ".2rem" }}>{l.property.address.city} · {l.property.beds}bd/{l.property.baths}ba · {l.property.sqft}sf</div>
                    {l.analysis && (
                      <div style={{ fontSize: 11, color: WS.green, marginTop: ".35rem", fontWeight: 600 }}>MAO {money(l.analysis.mao)}</div>
                    )}
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div style={{ fontSize: 11, color: WS.fm, padding: ".5rem", textAlign: "center", opacity: .6 }}>—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          busy={busy}
          onClose={() => setSelected(null)}
          onSkipTrace={() => onSkipTrace(selected)}
          onUnderwrite={() => onUnderwrite(selected)}
          onMove={(s) => moveStage(selected, s)}
        />
      )}
    </WholesaleLayout>
  );
}

function LeadDrawer({
  lead, busy, onClose, onSkipTrace, onUnderwrite, onMove,
}: {
  lead: Lead; busy: boolean; onClose: () => void;
  onSkipTrace: () => void; onUnderwrite: () => void; onMove: (s: LeadStage) => void;
}) {
  const a = lead.analysis;
  const btn = (bg: string): React.CSSProperties => ({
    fontSize: 12, fontWeight: 700, padding: ".55rem .9rem", borderRadius: ".55rem",
    border: "none", cursor: busy ? "wait" : "pointer", background: bg, color: "#fff", opacity: busy ? .6 : 1,
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 420, maxWidth: "90vw", height: "100%", background: WS.panel, borderLeft: `1px solid ${WS.border}`, padding: "1.75rem", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>{lead.property.address.line1}</h2>
            <div style={{ fontSize: 12, color: WS.fm }}>{lead.property.address.city}, {lead.property.address.state} {lead.property.address.zip}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: WS.fm, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "flex", gap: ".5rem", margin: "1rem 0" }}>
          <Badge color={tempColor(lead.temperature)}>{lead.temperature} · {lead.motivationScore}</Badge>
          <Badge color={WS.blue}>{lead.stage}</Badge>
        </div>

        <Card style={{ marginBottom: "1rem" }}>
          <SectionTitle>Property</SectionTitle>
          <Row k="Type" v={lead.property.propertyType.replace("_", " ")} />
          <Row k="Beds / Baths" v={`${lead.property.beds} / ${lead.property.baths}`} />
          <Row k="Sqft" v={String(lead.property.sqft)} />
          <Row k="Est. Value (AVM)" v={money(lead.property.estimatedValue)} />
          <Row k="Mortgage Bal." v={money(lead.property.mortgageBalance)} />
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <SectionTitle>Distress Signals</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
            {Object.entries(lead.property.signals)
              .filter(([k, v]) => v === true || (k === "highEquityPct" && typeof v === "number" && v >= 50))
              .map(([k]) => <Badge key={k} color={WS.orange}>{k}</Badge>)}
          </div>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <SectionTitle>Owner</SectionTitle>
          {lead.owner.skipTraced ? (
            <>
              <Row k="Name" v={lead.owner.fullName} />
              {lead.owner.phones.map((p, i) => (
                <Row key={i} k={p.type} v={`${p.number}${p.dnc ? " · DNC" : ""}`} />
              ))}
              <Row k="Email" v={lead.owner.emails[0] ?? "—"} />
            </>
          ) : (
            <div style={{ fontSize: 12, color: WS.fm }}>Not skip-traced yet.</div>
          )}
        </Card>

        {a && (
          <Card style={{ marginBottom: "1rem" }}>
            <SectionTitle>Underwriting</SectionTitle>
            <Row k="ARV" v={`${money(a.arv)} (${a.arvConfidence})`} />
            <Row k="Repairs" v={money(a.repairEstimate)} />
            <Row k="MAO" v={money(a.mao)} highlight={a.mao > 0 ? WS.green : WS.red} />
            <Row k="Assignment Fee" v={money(a.assignmentFee)} />
            <Row k="Investor Spread" v={money(a.investorSpread)} />
            {a.warnings.map((w, i) => (
              <div key={i} style={{ fontSize: 11, color: WS.gold, marginTop: ".4rem" }}>⚠ {w}</div>
            ))}
          </Card>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "1rem" }}>
          {!lead.owner.skipTraced && <button style={btn(WS.blue)} onClick={onSkipTrace} disabled={busy}>Skip Trace</button>}
          <button style={btn(WS.green)} onClick={onUnderwrite} disabled={busy}>{a ? "Re-underwrite" : "Underwrite"}</button>
        </div>

        <SectionTitle>Move to stage</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
          {(["contacted", "qualifying", "appointment", "under_contract", "marketing", "closed", "dead"] as LeadStage[]).map((s) => (
            <button key={s} onClick={() => onMove(s)} style={{ fontSize: 11, fontWeight: 600, padding: ".35rem .6rem", borderRadius: ".5rem", background: "transparent", color: WS.fm, border: `1px solid ${WS.border}`, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: WS.fm, marginBottom: ".6rem" }}>{children}</div>
);

const Row = ({ k, v, highlight }: { k: string; v: string; highlight?: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: ".25rem 0" }}>
    <span style={{ color: WS.fm }}>{k}</span>
    <span style={{ color: highlight ?? WS.fg, fontWeight: highlight ? 800 : 600 }}>{v}</span>
  </div>
);
