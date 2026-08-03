# Wholesale Real Estate Platform — Architecture & Roadmap

> **Mission:** A fully-automated wholesale operation — find distressed/motivated-seller
> properties, underwrite them, get them under contract, and dispo (assign) them to a
> vetted cash-buyer list. We make the spread (assignment fee) in between.
>
> **Operating principle (inherited from repo canon):** Hypothesis ≠ Fact. Evidence
> creates truth. A "lead" is a hypothesis; a signed contract is evidence. Every deal
> number the platform shows must trace to a source (comp, contract, wire), never a guess.

---

## 1. The business, as a machine

The wholesale value chain, and where software automates each link:

| # | Stage | What happens | Automation |
|---|-------|--------------|------------|
| 1 | **Source** | Pull lists of likely-motivated owners | Property-data providers → `providers/propertyData` |
| 2 | **Skip trace** | Get owner phone/email | Skip-trace providers → `providers/skipTrace` |
| 3 | **Score** | Rank leads by motivation signals | `lib/leadScoring.ts` (deterministic, explainable) |
| 4 | **Outreach** | SMS / call / mail / RVM at scale | `providers/comms` (TCPA/DNC/A2P-aware) |
| 5 | **Qualify** | Conversation → is there a deal? | AI acquisitions rep (edge function, later phase) |
| 6 | **Underwrite** | ARV, repairs, MAO, offer | `lib/dealAnalyzer.ts` (pure, tested — this is the IP) |
| 7 | **Contract** | Purchase agreement, e-sign | Contract gen + e-sign provider (later phase) |
| 8 | **Dispo** | Blast deal to cash buyers, collect | Buyer CRM + `providers/comms` |
| 9 | **Close** | Assignment/double-close, get paid | Title/escrow coordination + accounting |

The pipeline **Kanban** mirrors stages 1→9 as deal statuses.

## 2. Design decisions (defaults — change anytime)

- **Lives in this repo** under `src/wholesale/` (logic) + `src/pages/wholesale/` (UI),
  reusing React/Vite + shadcn + Supabase. Zero coupling to the Aladiah education code.
- **Provider-abstraction layer.** Every external dependency (property data, skip trace,
  comms) sits behind a TypeScript interface with a **mock adapter** that works today.
  Swap in ATTOM / BatchData / Twilio by implementing the same interface + adding keys —
  no UI or business-logic refactor.
- **Money math is pure & tested.** `dealAnalyzer` and `leadScoring` are side-effect-free
  functions with unit tests. Correctness of the spread math is non-negotiable.
- **SQL is reviewable, never auto-applied.** Schema ships as `docs/wholesale/schema.sql`;
  a human applies it in Supabase (per repo working rules).

## 3. Compliance is a first-class feature, not an afterthought

Automated outreach is legally loaded. The comms layer is built to enforce, not bolt on:

- **TCPA** — consent + calling-hours windows before any call/text.
- **DNC** — scrub against Do-Not-Call before dialing.
- **A2P 10DLC** — SMS requires registered brand/campaign; the mock adapter models the
  `registrationStatus` gate so real integration can't "forget" it.
- **State wholesaling law** — some states restrict unlicensed wholesaling / require the
  equitable-interest disclosure. `config.ts` carries a per-state flag; deals in
  restricted states are flagged in the UI.

> This platform assists a licensed/authorized operator. It is not legal advice; the
> operator is responsible for compliance in their market.

## 4. Provider swap-in map (when you're ready to spend)

| Layer | Mock (today) | Real options |
|-------|-------------|--------------|
| Property data | `MockPropertyDataProvider` | ATTOM, PropStream, BatchData, DataTree |
| Skip trace | `MockSkipTraceProvider` | BatchSkipTracing, IDI/LexisNexis, TLO |
| Comms (SMS/call) | `MockCommsProvider` | Twilio (A2P 10DLC), Launch Control, Smarter Contact |
| Comps/AVM | built into property mock | ATTOM AVM, HouseCanary, Zillow (ToS-limited) |
| E-sign | (later) | DocuSign, Dropbox Sign |

## 5. Roadmap

- **Phase 0 — Foundation (this PR).** Data model + types, deal analyzer (tested), lead
  scoring, provider interfaces + mocks, and the operator UI: dashboard, lead pipeline
  Kanban, deal analyzer, buyers list.
- **Phase 1 — Live data.** Wire one property-data + one skip-trace provider. Persist to
  Supabase. Real lead ingestion on a schedule (cron edge function).
- **Phase 2 — Outreach engine.** Twilio A2P registration, SMS sequences, DNC scrub,
  call dialer, response inbox.
- **Phase 3 — AI acquisitions rep.** Conversational qualifier over SMS/chat that books
  appointments and drafts offers, using the existing `ai-proxy` edge function pattern.
- **Phase 4 — Dispo automation.** Buyer-match on new contracts, one-click deal blast,
  offer collection, assignment doc generation + e-sign.
- **Phase 5 — Scale & moat.** Multi-market, KPI/attribution truth dashboard, buyer
  reputation scoring, ML lead scoring trained on closed-deal outcomes.

## 6. How to study & beat the best

We benchmark against the category leaders and encode what works:

- **PropStream / BatchLeads** — list building & stacked-list filters → our `propertyData`
  filter model supports the same distress stacks (pre-foreclosure ∩ high-equity ∩ absentee).
- **REsimpli / InvestorFuse / Podio CRM** — pipeline + automations → our Kanban + sequences.
- **Launch Control / Smarter Contact** — SMS at scale → our compliant comms layer.
- **DealMachine** — driving-for-dollars → future mobile capture into the same lead model.

The wedge: an **AI acquisitions rep** that qualifies and negotiates end-to-end, plugged
into a data model where every number is evidence-backed. That's the "fully automated" moat.
</invoke>
