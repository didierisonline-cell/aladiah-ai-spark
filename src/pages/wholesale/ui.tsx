// Shared design tokens + layout shell for the Wholesale platform.
// Self-contained (own nav) so it stays fully decoupled from the education app.

import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

export const WS = {
  bg: "#0A0F1A",
  panel: "#0F1826",
  card: "#131F31",
  border: "#1E2D47",
  fg: "#EDF2F7",
  fm: "#8596AD",
  blue: "#4A90F5",
  green: "#22C98A",
  gold: "#F5B81A",
  orange: "#F0622A",
  red: "#EF5A6F",
  radius: "0.75rem",
  font: "'Plus Jakarta Sans',system-ui,sans-serif",
};

export const money = (n: number | undefined): string =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";

export const tempColor = (t: string): string =>
  t === "hot" ? WS.orange : t === "warm" ? WS.gold : WS.blue;

const NAV = [
  { to: "/wholesale", label: "Dashboard", end: true },
  { to: "/wholesale/leads", label: "Lead Pipeline" },
  { to: "/wholesale/analyzer", label: "Deal Analyzer" },
  { to: "/wholesale/buyers", label: "Cash Buyers" },
];

export function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: WS.card,
        border: `1px solid ${WS.border}`,
        borderRadius: WS.radius,
        padding: "1.25rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 700,
        padding: ".2rem .6rem",
        borderRadius: 999,
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function WholesaleLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { pathname } = useLocation();
  return (
    <div style={{ background: WS.bg, minHeight: "100vh", color: WS.fg, fontFamily: WS.font, display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: 232, borderRight: `1px solid ${WS.border}`, background: WS.panel, padding: "1.5rem 1rem", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: ".25rem", letterSpacing: "-.4px" }}>
          🏠 Wholesale<span style={{ color: WS.green }}>OS</span>
        </div>
        <div style={{ fontSize: 11, color: WS.fm, marginBottom: "1.75rem" }}>Automated acquisitions</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
          {NAV.map((n) => {
            const active = n.end ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <NavLink
                key={n.to}
                to={n.to}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: ".6rem .75rem",
                  borderRadius: ".6rem",
                  textDecoration: "none",
                  color: active ? WS.fg : WS.fm,
                  background: active ? `${WS.blue}22` : "transparent",
                  border: `1px solid ${active ? `${WS.blue}44` : "transparent"}`,
                }}
              >
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div style={{ position: "absolute", bottom: "1.5rem", left: "1rem", right: "1rem", fontSize: 10, color: WS.fm, lineHeight: 1.5 }}>
          Running on mock data.<br />Set <code style={{ color: WS.gold }}>VITE_WHOLESALE_EDGE_BASE</code> to go live.
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "2rem 2.5rem", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <header style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>{title}</h1>
          {subtitle && <p style={{ color: WS.fm, fontSize: 13, marginTop: ".25rem" }}>{subtitle}</p>}
        </header>
        {children}
      </main>
    </div>
  );
}
