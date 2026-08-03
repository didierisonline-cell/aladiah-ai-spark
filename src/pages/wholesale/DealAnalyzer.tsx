import { useMemo, useState } from "react";
import { WholesaleLayout, Card, Badge, WS, money } from "./ui";
import { analyzeDeal } from "@/wholesale/lib/dealAnalyzer";
import type { Comp, RepairTier } from "@/wholesale/types";

// A quick, editable comp set the operator can tweak to model a deal.
const DEFAULT_COMPS: Comp[] = [
  { address: { line1: "Comp A", city: "Atlanta", state: "GA", zip: "30301" }, soldPrice: 285_000, soldDate: "2026-06-01", sqft: 1500, beds: 3, baths: 2, distanceMiles: 0.4 },
  { address: { line1: "Comp B", city: "Atlanta", state: "GA", zip: "30301" }, soldPrice: 320_000, soldDate: "2026-05-10", sqft: 1650, beds: 3, baths: 2, distanceMiles: 0.7 },
  { address: { line1: "Comp C", city: "Atlanta", state: "GA", zip: "30301" }, soldPrice: 260_000, soldDate: "2026-07-02", sqft: 1400, beds: 3, baths: 2, distanceMiles: 1.1 },
];

const TIERS: RepairTier[] = ["cosmetic", "moderate", "heavy", "gut"];

export default function WholesaleDealAnalyzer() {
  const [sqft, setSqft] = useState(1500);
  const [tier, setTier] = useState<RepairTier>("moderate");
  const [arvPercent, setArvPercent] = useState(70);
  const [fee, setFee] = useState(10_000);
  const [state, setState] = useState("GA");
  const [comps, setComps] = useState<Comp[]>(DEFAULT_COMPS);

  const result = useMemo(
    () =>
      analyzeDeal({
        subjectSqft: sqft,
        comps,
        repairTier: tier,
        arvPercent: arvPercent / 100,
        desiredAssignmentFee: fee,
        state,
      }),
    [sqft, comps, tier, arvPercent, fee, state],
  );

  const setComp = (i: number, patch: Partial<Comp>) =>
    setComps((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const num = (v: string) => Math.max(0, Number(v) || 0);
  const inputStyle: React.CSSProperties = {
    width: "100%", background: WS.bg, border: `1px solid ${WS.border}`, borderRadius: ".45rem",
    color: WS.fg, fontSize: 13, padding: ".5rem .6rem", fontFamily: WS.font,
  };
  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: WS.fm, textTransform: "uppercase", letterSpacing: .5, marginBottom: ".3rem", display: "block" };

  return (
    <WholesaleLayout title="Deal Analyzer" subtitle="Underwrite any property — ARV, repairs, MAO, and the spread.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Inputs */}
        <Card>
          <SectionTitle>Subject & Assumptions</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem", marginBottom: "1rem" }}>
            <div>
              <label style={label}>Subject Sqft</label>
              <input style={inputStyle} type="number" value={sqft} onChange={(e) => setSqft(num(e.target.value))} />
            </div>
            <div>
              <label style={label}>State</label>
              <input style={inputStyle} value={state} maxLength={2} onChange={(e) => setState(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label style={label}>ARV % (70 rule)</label>
              <input style={inputStyle} type="number" value={arvPercent} onChange={(e) => setArvPercent(num(e.target.value))} />
            </div>
            <div>
              <label style={label}>Assignment Fee</label>
              <input style={inputStyle} type="number" value={fee} onChange={(e) => setFee(num(e.target.value))} />
            </div>
          </div>
          <label style={label}>Repair Tier</label>
          <div style={{ display: "flex", gap: ".4rem", marginBottom: "1.25rem" }}>
            {TIERS.map((t) => (
              <button key={t} onClick={() => setTier(t)} style={{ flex: 1, fontSize: 11, fontWeight: 700, padding: ".5rem", borderRadius: ".5rem", cursor: "pointer", textTransform: "capitalize", background: tier === t ? `${WS.blue}22` : "transparent", border: `1px solid ${tier === t ? WS.blue : WS.border}`, color: tier === t ? WS.fg : WS.fm }}>{t}</button>
            ))}
          </div>

          <SectionTitle>Comparable Sales</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr .8fr", gap: ".4rem", fontSize: 10, color: WS.fm, marginBottom: ".3rem", fontWeight: 700, textTransform: "uppercase" }}>
            <span>Label</span><span>Sold $</span><span>Sqft</span><span>Mi</span>
          </div>
          {comps.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr .8fr", gap: ".4rem", marginBottom: ".4rem" }}>
              <input style={inputStyle} value={c.address.line1} onChange={(e) => setComp(i, { address: { ...c.address, line1: e.target.value } })} />
              <input style={inputStyle} type="number" value={c.soldPrice} onChange={(e) => setComp(i, { soldPrice: num(e.target.value) })} />
              <input style={inputStyle} type="number" value={c.sqft} onChange={(e) => setComp(i, { sqft: num(e.target.value) })} />
              <input style={inputStyle} type="number" value={c.distanceMiles} onChange={(e) => setComp(i, { distanceMiles: num(e.target.value) })} />
            </div>
          ))}
          <button
            onClick={() => setComps((p) => [...p, { address: { line1: `Comp ${String.fromCharCode(65 + p.length)}`, city: "Atlanta", state, zip: "30301" }, soldPrice: 280_000, soldDate: "2026-06-01", sqft: 1500, beds: 3, baths: 2, distanceMiles: 1 }])}
            style={{ fontSize: 11, fontWeight: 700, padding: ".45rem .8rem", borderRadius: ".5rem", background: "transparent", border: `1px dashed ${WS.border}`, color: WS.fm, cursor: "pointer", marginTop: ".3rem" }}
          >+ Add comp</button>
        </Card>

        {/* Results */}
        <Card style={{ position: "sticky", top: "2rem" }}>
          <SectionTitle>Underwriting Result</SectionTitle>
          <BigStat label="Max Allowable Offer" value={money(result.mao)} color={result.mao > 0 ? WS.green : WS.red} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", margin: "1.25rem 0" }}>
            <Stat label="ARV" value={money(result.arv)} sub={`${result.arvConfidence} confidence`} />
            <Stat label="Repairs" value={money(result.repairEstimate)} sub={tier} />
            <Stat label="Assignment Fee" value={money(result.assignmentFee)} />
            <Stat label="Investor Spread" value={money(result.investorSpread)} sub="equity cushion vs ARV" />
          </div>

          <div style={{ fontSize: 11, color: WS.fm, lineHeight: 1.6, padding: ".75rem", background: WS.bg, borderRadius: ".5rem", border: `1px solid ${WS.border}` }}>
            <strong style={{ color: WS.fg }}>Formula:</strong> MAO = ARV × {arvPercent}% − repairs − fee
            <br />= {money(result.arv)} × {arvPercent}% − {money(result.repairEstimate)} − {money(result.assignmentFee)}
          </div>

          {result.warnings.length > 0 && (
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>
              {result.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 11.5, color: WS.gold, display: "flex", gap: ".4rem" }}><span>⚠</span><span>{w}</span></div>
              ))}
            </div>
          )}
          {result.warnings.length === 0 && (
            <div style={{ marginTop: "1rem" }}><Badge color={WS.green}>✓ Clean underwrite — no warnings</Badge></div>
          )}
        </Card>
      </div>
    </WholesaleLayout>
  );
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: WS.fm, marginBottom: ".85rem" }}>{children}</div>
);

const BigStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: WS.fm }}>{label}</div>
    <div style={{ fontSize: 40, fontWeight: 800, color, letterSpacing: "-1px", marginTop: ".2rem" }}>{value}</div>
  </div>
);

const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div style={{ background: WS.bg, border: `1px solid ${WS.border}`, borderRadius: ".55rem", padding: ".7rem .85rem" }}>
    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, color: WS.fm }}>{label}</div>
    <div style={{ fontSize: 19, fontWeight: 800, marginTop: ".15rem" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: WS.fm, marginTop: ".1rem", textTransform: "capitalize" }}>{sub}</div>}
  </div>
);
