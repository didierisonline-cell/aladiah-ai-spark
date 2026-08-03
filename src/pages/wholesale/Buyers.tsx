import { WholesaleLayout, Card, Badge, WS } from "./ui";
import { MOCK_BUYERS } from "@/wholesale/data/buyers";

export default function WholesaleBuyers() {
  const relColor = (s: number) => (s >= 80 ? WS.green : s >= 60 ? WS.gold : WS.red);

  return (
    <WholesaleLayout title="Cash Buyers" subtitle={`${MOCK_BUYERS.length} vetted buyers · matched to deals by buy-box, ranked by reliability`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1rem" }}>
        {MOCK_BUYERS.map((b) => (
          <Card key={b.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: WS.fm }}>{b.company}</div>
              </div>
              <Badge color={relColor(b.reliabilityScore)}>{b.reliabilityScore} rel.</Badge>
            </div>

            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", margin: ".85rem 0" }}>
              {b.proofOfFunds ? <Badge color={WS.green}>✓ POF</Badge> : <Badge color={WS.red}>No POF</Badge>}
              <Badge color={WS.blue}>{b.dealsClosedWithUs} closed</Badge>
              {b.buyBox.strategy.map((s) => <Badge key={s} color={WS.fm}>{s}</Badge>)}
            </div>

            <div style={{ fontSize: 11.5, color: WS.fm, lineHeight: 1.7, borderTop: `1px solid ${WS.border}`, paddingTop: ".75rem" }}>
              <div><strong style={{ color: WS.fg }}>Markets:</strong> {b.buyBox.states.join(", ")}{b.buyBox.cities?.length ? ` · ${b.buyBox.cities.join(", ")}` : ""}</div>
              <div><strong style={{ color: WS.fg }}>Types:</strong> {b.buyBox.propertyTypes.map((t) => t.replace("_", " ")).join(", ")}</div>
              <div><strong style={{ color: WS.fg }}>Max price:</strong> {b.buyBox.maxPrice ? `$${b.buyBox.maxPrice.toLocaleString()}` : "—"} · <strong style={{ color: WS.fg }}>Min beds:</strong> {b.buyBox.minBeds ?? "—"}</div>
            </div>

            <div style={{ display: "flex", gap: ".5rem", marginTop: ".85rem" }}>
              <a href={`tel:${b.phone}`} style={{ flex: 1, textAlign: "center", fontSize: 12, fontWeight: 700, padding: ".5rem", borderRadius: ".5rem", background: WS.blue, color: "#fff", textDecoration: "none" }}>Call</a>
              <a href={`mailto:${b.email}`} style={{ flex: 1, textAlign: "center", fontSize: 12, fontWeight: 700, padding: ".5rem", borderRadius: ".5rem", background: "transparent", border: `1px solid ${WS.border}`, color: WS.fg, textDecoration: "none" }}>Email</a>
            </div>
          </Card>
        ))}
      </div>
    </WholesaleLayout>
  );
}
