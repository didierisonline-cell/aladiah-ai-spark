# Wholesale Real Estate Platform — Architecture & Roadmap

> **Mission:** An AI-native, all-in-one platform that runs a wholesale operation
> end-to-end — source distressed/motivated-seller properties, underwrite them,
> get them under contract, and assign them to a vetted cash-buyer list. We make
> the spread (assignment fee).
>
> **Operating principle (inherited canon):** Hypothesis ≠ Fact. Evidence creates
> truth. A "lead" is a hypothesis; a signed contract is evidence. Every number
> the platform shows traces to a source (comp, contract, wire) — never a guess.
>
> **Evidence base:** every strategic decision below is grounded in
> [`COMPETITIVE_RESEARCH.md`](./COMPETITIVE_RESEARCH.md). Read it first.

---

## 1. Strategic thesis (evidence-backed)

The wedge, in one sentence: **incumbents are fragmented and their AI is bolted-on;
we win with a ground-up AI-native platform that collapses the $1k+/mo, 5-tool
stack and automates the acquisitions bottleneck.**

| Decision | Verdict | Evidence (§ in research doc) |
|----------|---------|------------------------------|
| Launch market | **Tampa Bay, FL** (then Jacksonville, Atlanta) | §3 — #1 foreclosure rate of 1M+ metros, deepest cash-buyer pool, clean legality, open data |
| Product shape | **AI-native all-in-one** | §1 — 4–6 tool fragmentation tax (~$1k+/mo); incumbent AI is modular bolt-on |
| Moat | **AI acquisitions rep** (answers 100% inbound 24/7, qualifies in ~90s, books/offers) | §1 — cold-call answer rates ~10%, qualification still manual, category unconsolidated |
| Compliance | **Enforcement engine, first-class** | §2 — 2024-26 state wholesaling laws + 2025 TCPA/A2P/DNC rules with real penalties |
| Migration target | **Podio power-users** | §1 — large, technical, unhappy base, no native AI |

**Positioning line:** *"Replace your $1,000+/mo, 5-tool stack with one AI that
sources, calls, underwrites, and dispos your deals — starting in Tampa."*

---

## 2. The business as a machine

Where software automates each link of the value chain:

| # | Stage | What happens | Module | Primary vendor (Phase 1+) |
|---|-------|--------------|--------|---------------------------|
| 1 | **Source** | Pull motivated-owner lists (distress stacks) | `providers/propertyData` | RealEstateAPI |
| 2 | **Skip trace** | Owner phone/email | `providers/skipTrace` | BatchData |
| 3 | **Score** | Rank by motivation signals | `lib/leadScoring` | (in-house, deterministic) |
| 4 | **Outreach** | SMS / call at scale, compliant | `providers/comms` + `lib/compliance` | Twilio + ReadyMode |
| 5 | **Qualify** | Conversation → is there a deal? | AI acquisitions rep (edge fn) | LLM + voice |
| 6 | **Underwrite** | ARV, repairs, MAO, offer | `lib/dealAnalyzer` | HouseCanary (ARV) |
| 7 | **Contract** | Purchase agreement + e-sign | `lib/contracts` | PandaDoc |
| 8 | **Dispo** | Blast to matched cash buyers | `lib/buyerMatch` + comms | (in-house + Twilio) |
| 9 | **Close** | Assignment/double-close, get paid | title/escrow coordination | (partners) |

The pipeline **Kanban** mirrors stages 1→9 as lead statuses.

---

## 3. System architecture

```
┌──────────────────────────── UI (React/Vite) ────────────────────────────┐
│  Command Center · Lead Pipeline (Kanban) · Deal Analyzer · Cash Buyers   │
│  Outreach Inbox · Compliance Console · (Phase 3) AI Rep transcripts      │
└──────────────────────────────────┬───────────────────────────────────────┘
                                    │
┌──────────────────────── Domain / business logic ─────────────────────────┐
│  leadService · dealAnalyzer* · leadScoring* · buyerMatch · compliance*    │
│  (* pure, unit-tested — the money & rules IP)                             │
└──────────────────────────────────┬───────────────────────────────────────┘
                                    │  interfaces only (never concrete vendors)
┌──────────────────────── Provider abstraction layer ──────────────────────┐
│  PropertyDataProvider · SkipTraceProvider · CommsProvider · (AvmProvider, │
│  ContractProvider, DialerProvider …)   →  Mock adapters │ Live adapters   │
└──────────────────────────────────┬───────────────────────────────────────┘
                                    │
┌──────────────────────────── Persistence / infra ─────────────────────────┐
│  Supabase (Postgres + RLS + Edge Functions + cron) · audit log tables     │
└───────────────────────────────────────────────────────────────────────────┘
```

### Design invariants
1. **Provider abstraction is absolute.** Business logic imports *interfaces*, never a vendor SDK. Going live = implement an interface + add a key + flip `config.liveProviders`. Zero logic/UI change. (Validated in Phase 0.)
2. **Money & rules math is pure and tested.** `dealAnalyzer`, `leadScoring`, and the compliance rule engine are side-effect-free and unit-tested. Correctness of the spread and of legal gates is non-negotiable.
3. **Compliance can't be bypassed.** Every outbound message routes through `lib/compliance` gates before a provider is called. The mock comms adapter already models the A2P/consent/DNC/quiet-hours gate so live integration can't "forget" it.
4. **Every number is evidence.** Underwriting is snapshotted onto the lead at analysis time (never backfilled) — same discipline as the Aladiah competency-snapshot rule.
5. **SQL is reviewable, never auto-applied.** Schema ships as `schema.sql`; a human applies it in Supabase and runs verification SELECTs.

### The compliance engine (`lib/compliance`) — first-class
Two rule sets, both configurable and counsel-reviewable (never hard guarantees):
- **Wholesaling legality** (geofenced by *property* state) — tiered rulesets from §2: restricted (SC, IL), register/license (OK, PA, KY, CT), disclosure+cancel (OH, MD, TN, ND, TX, IN, …). Gates: state warning/block, IL deal-count throttle, mandatory equitable-interest disclosure, right-to-cancel windows.
- **Outreach** (geofenced by *recipient* number) — consent ledger (PEWC), A2P 10DLC gate, DNC scrub (National ≤31 days + 11 state + internal), opt-out engine (all keywords, ≤10 biz days, cross-channel), quiet hours (8am–9pm local + FL/OK mini-TCPA rules), frequency caps, immutable audit trail.

### The AI acquisitions rep (Phase 3 — the moat)
A conversational qualifier over SMS/voice that: answers inbound 24/7, extracts property/motivation/timeline/condition, scores the lead, writes the CRM record, runs an instant underwrite, and books an appointment or drafts an offer — reusing the existing `ai-proxy` edge-function pattern. Built on the data model where every number is evidence-backed, so its offers are defensible.

---

## 4. Data model

Persisted schema in [`schema.sql`](./schema.sql); TypeScript shapes in `src/wholesale/types.ts`.
Tables: `wholesale_properties`, `wholesale_owners`, `wholesale_leads` (9-stage
pipeline + snapshotted `analysis` JSONB), `wholesale_buyers` (buy-box for
matching), `wholesale_outreach` (TCPA/A2P audit trail). RLS enabled; policies
added before client exposure.

---

## 5. Pricing strategy (from §1 benchmarks)

Incumbent all-in-ones sit at **$149–599/mo**; a full stack runs **~$1,000–1,200/mo**.
Target tiers (illustrative, to validate):
- **Starter** ~$99/mo — data + CRM + underwriting, capped volume (undercut PropStream+DealCheck).
- **Operator** ~$299/mo — + compliant SMS/dialer + dispo buyer-matching (replace the 5-tool stack).
- **Autopilot** ~$699/mo — + AI acquisitions rep + AI dispo (undercut InvestorLift's ~$6k/yr while adding acquisitions AI).
Usage pass-through at cost + margin: skip trace, SMS segments, dialer minutes, e-sign.

---

## 6. Roadmap

- **Phase 0 — Foundation (done, prototype on branch).** Types, deal analyzer (tested), lead scoring, provider interfaces + mocks, operator UI (dashboard, Kanban, analyzer, buyers), reviewable schema.
- **Phase 0.5 — Standalone extraction (next).** Lift `src/wholesale` + `src/pages/wholesale` into a clean standalone repo (see §7). Wire Supabase persistence for the mock data.
- **Phase 1 — Live data (Tampa).** Implement `RealEstateAPI` + `BatchData` adapters; scheduled Tampa distress-list ingestion (cron edge fn); persist leads. Add `HouseCanary` ARV adapter.
- **Phase 2 — Compliant outreach.** `lib/compliance` full engine; Twilio A2P registration; SMS sequences; DNC scrub; ReadyMode dialer; response inbox.
- **Phase 3 — AI acquisitions rep.** Conversational qualifier over SMS/voice; books appointments, drafts offers.
- **Phase 4 — Dispo automation.** Buyer-match on new contracts; one-click deal blast; PandaDoc assignment generation + e-sign.
- **Phase 5 — Scale & moat.** Multi-market (Jacksonville → Atlanta); ML lead scoring trained on closed-deal outcomes; buyer reputation scoring; KPI/attribution truth dashboard.

---

## 7. Standalone-repo plan

Per the product decision, this becomes its own product, not part of the Aladiah
education app. Today it is already **fully decoupled**: all logic in
`src/wholesale/**`, all UI in `src/pages/wholesale/**`, only four self-contained
routes touched in `App.tsx`, and zero imports from education code.

**Extraction (Phase 0.5):**
1. New repo `wholesale-os` (or chosen name), scaffolded from the same Vite +
   React + TS + Tailwind/shadcn + Supabase baseline.
2. Move `src/wholesale/**` → `src/` (logic) and `src/pages/wholesale/**` → `src/pages/`.
3. Copy `docs/wholesale/**` → `docs/`.
4. Own `package.json`, `vite.config.ts`, `vitest.config.ts`, CI, and a fresh
   Supabase project (not the shared education project `vgujnkxylipfwmkpwzvb`).
5. Port the four routes into the new app's router as top-level pages.

> This remote session is scoped to the `aladiah-ai-spark` repo only, so the new
> repo is created by the human (or a session scoped to it). The code is
> structured so extraction is a move, not a rewrite.

---

## 8. How we study & beat the best (§1)

- **PropStream / BatchLeads** (list building) → our `propertyData` filter supports the same distress stacks (pre-foreclosure ∩ high-equity ∩ absentee).
- **REsimpli / InvestorFuse / Podio** (CRM/automation) → our Kanban + sequences, but **AI-native**, not bolt-on. Podio's base is our migration target.
- **Launch Control / Smarter Contact** (SMS) → our compliant comms layer, at CPaaS cost (Twilio/Telnyx) not premium SaaS.
- **InvestorLift** (dispo) → AI buyer-matching bundled in, not a separate ~$6k/yr annual product.
- **DealCheck / PropLab** (underwriting) → instant address→MAO **inside** the CRM.

The compounding wedge: an **AI acquisitions rep** on an **evidence-backed data
model**, sold as **one affordable subscription**. That's the "fully automated" moat.
</content>
