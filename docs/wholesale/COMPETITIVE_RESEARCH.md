# Wholesale Platform — Competitive Research & Market Evidence (2025)

> **Purpose.** This is the evidence base for every strategic decision in
> `PLATFORM_ARCHITECTURE.md`. Per Aladiah canon — *Hypothesis ≠ Fact; evidence
> creates truth* — no decision here is asserted without a source. Claims that
> could not be verified against a primary/official page are marked **unverified**.
>
> **Research date:** 2025 (sourced live). **Not legal advice** — the legal
> section is a design input; confirm with counsel before operating.

---

## 0. The four decisions this research settles

| Decision | Verdict | Driven by |
|----------|---------|-----------|
| **Launch market** | **Tampa Bay, FL** (runners-up: Jacksonville FL, Atlanta GA) | §3 |
| **Product wedge** | AI-native, all-in-one that collapses the 4–6 tool stack; the AI acquisitions rep is the moat | §1 |
| **Compliance** | A first-class enforcement engine, not a disclaimer — 2024-26 state laws + 2025 TCPA/A2P rules | §2 |
| **Vendor stack** | ReAPI + HouseCanary + BatchData + Twilio + ReadyMode + PandaDoc | §4 |

---

## 1. Competitive landscape

Wholesalers today run **4–6 separate subscriptions** totaling **~$1,000–$1,200/mo (~$12–14k/yr)** before sending a single mailer ([goforclose](https://www.goforclose.com/guides/best-wholesaling-software), [realestateskills](https://www.realestateskills.com/blog/real-estate-wholesaling-tools)). That fragmentation tax is the opening.

### Platform map

| Platform | Category | Entry | Top tier | Native AI | Key gap |
|---|---|---|---|---|---|
| PropStream | Data / list building | $99/mo | $699/mo | Minimal | No real CRM/dispo; API is dashboard-first |
| BatchLeads/Data/Dialer | Data + outreach + API | $119/mo | $749/mo | Some | 3 separate products; SMS needs Twilio |
| REsimpli | All-in-one CRM | ~$149/mo* | ~$599/mo* | Yes (8 agents) | Data/comps depth; AI bolted onto legacy CRM |
| InvestorFuse | Lead workflow CRM | $197/mo | Custom | Automation only | No data/dialer; integration glue |
| DealMachine | Driving-for-dollars | $49–99/mo | ~$232/mo | AI dialer | Narrow origin; light CRM/dispo |
| Launch Control | SMS marketing | $497/mo | $1,497/mo | No | Single channel; premium price; no dev API |
| Smarter Contact | SMS + dialer | $149/mo | $799–1,199+ | Some | Outreach-only |
| Carrot | Websites/SEO (inbound) | $84/mo | $169/mo | No | Not an ops platform |
| Podio stack | Custom CRM (legacy) | $250+/mo | $75k–150k build | No | Needs a developer; brittle; **prime migration target** |
| InvestorLift | Dispositions | ~$6,000/yr | ~$50,000/yr | AI Autopilot (2025) | Annual-only; acquisition-side separate |
| DealCheck / Privy / PropLab | Comps / underwriting | $10–97/mo | — | PropLab AI | Point tools; live outside the CRM |
| REI Reply / Agent Labs / SuperMIA | AI voice SDR | quote (unverified) | — | AI-native | Young; bolt-on voice, not end-to-end |

<sub>*REsimpli/Carrot official pricing pages returned HTTP 403; tier prices are third-party-reported. Sources: [PropStream pricing](https://www.offermarket.us/blog/propstream-pricing), [BatchLeads pricing](https://www.g2.com/products/batchleads/pricing), [REsimpli review](https://www.realestateskills.com/blog/resimpli-review), [InvestorFuse](https://realestatebees.com/software/investorfuse/), [DealMachine pricing](https://digitaltriggers.io/deal-machine-pricing/), [Launch Control](https://www.realestateskills.com/blog/launch-control), [Smarter Contact](https://support.smartercontact.com/plans-and-pricing), [Carrot](https://www.realestateskills.com/blog/investor-carrot-review), [Podio](https://www.realestateskills.com/blog/podio), [InvestorLift](https://www.realestateskills.com/blog/investorlift), [DealCheck](https://dealrun.ai/blog/dealcheck-pricing-breakdown)). Note: PropStream **acquired BatchLeads/BatchData in July 2025** ([realestateskills](https://www.realestateskills.com/blog/batch-leads-review)).</sub>

### The 7 categories of a complete wholesale stack
1. **List building / property data** — distressed & motivated-seller lists, list stacking
2. **Skip tracing** — owner phone/email enrichment ($0.07–0.15/record)
3. **CRM / pipeline** — lead management, stages, follow-up automation
4. **Outreach — SMS + dialer** — mass/1:1 texting, power dialing
5. **Comps / underwriting** — ARV, MAO, repairs, deal analysis
6. **Dispositions / buyer-matching** — sell the contract, rank cash buyers
7. **Automation / AI** — cross-cutting: inbound answering, qualification, scoring, auto-CRM

### Biggest gaps → our opportunities
- **Fragmentation tax** — one genuine all-in-one undercuts a $1k+/mo, 5-tool stack.
- **Incumbent AI is bolted-on** — REsimpli/InvestorLift/DealMachine added AI as modules on legacy architectures. A ground-up **AI-native** loop is a defensible wedge; **Podio's large, technical, unhappy base** is the migration target ([whitespacesolutions](https://www.whitespacesolutions.ai/content/podio-vs-ai-first-crm-real-estate)).
- **Acquisitions bottleneck = human calling** — cold-call answer rates ~10%, yet qualification is still manual. AI voice that answers 100% of inbound 24/7 and qualifies in ~90s is the highest-leverage automation, still unconsolidated ([supermia](https://supermia.ai/blog/ai-cold-calling-real-estate/)).
- **Dispo is expensive & siloed** — InvestorLift is ~$6k/yr, annual-only. Bundling AI buyer-matching into an affordable all-in-one is a clear opening.
- **Underwriting speed** — high-volume operators need address→MAO in seconds; most bounce between PropStream and DealCheck. Instant underwriting *inside* the CRM removes a step.

### Pricing benchmarks for a new entrant
All-in-one CRMs **$149–599/mo**; data **$99–749/mo**; skip trace **$0.07–0.15/record**; SMS **$149–1,497/mo + usage**; comps **$10–97/mo**; dispo **$6k–50k/yr** (the outlier). **Pitch:** "replace your $1k+/mo, 5-tool stack for a fraction — fully automated."

---

## 2. Legal & compliance (the enforcement spec)

The 2023–2026 regulatory wave does one of three things: require a **license**, require **registration**, or require **written equitable-interest disclosure + a right to cancel**. ~12 states acted in this window ([Leonine](https://leoninepublicaffairs.com/new-state-laws-for-real-estate-wholesaling-in-2025/)).

### State restriction tiers

| Tier | States | Requirement |
|---|---|---|
| **Restricted — license/near-ban** | **SC** (HB 4754 — wholesaling = brokerage), **IL** (1 assignment / 12 mo, 2nd = misdemeanor) | Unlicensed operation blocked/severely capped |
| **Register or license** | **OK** (SB 1075, eff. 11/1/2025 — also closes double-close loophole), **PA** (Act 52, eff. 1/9/2025 — 30-day cancel), **KY** (marketing equitable interest = brokerage), **CT** (register, eff. 7/1/2026) | Registration/license + disclosures |
| **Disclosure + right-to-cancel** | **OH** (form eff. 3/2/2026), **MD** (eff. 10/1/2025), **TN** (2025), **ND** (2025), **TX** (§1101.0045, eff. 1/1/2024), **IN** (HB 1068), VA, IA, WI | Written equitable-interest disclosure; cancel windows |

Sources: [PA Act 52 – Barley Snyder](https://www.barley.com/act-52-imposes-new-regulations-on-real-estate-wholesaling-in-pennsylvania/), [OK SB 1075 – Leonine](https://www.leoninefocus.com/new-state-laws-for-real-estate-wholesaling-in-2025/), [TX §1101.0045](https://texas.public.law/statutes/tex._occ._code_section_1101.0045), [OH – NP Weiss Law](https://www.npweisslaw.com/blog/ohio-real-estate-wholesaler-disclosure-law), [IL/SC – RealEstateSkills](https://www.realestateskills.com/blog/wholesaling-real-estate-legal). **Bill numbers for OH/ND unverified — confirm with counsel.**

**Deal structure:** once a buyer signs, they hold *equitable interest*. New statutes require disclosing in writing that the operator holds only equitable interest, intends to assign for a fee, and won't take title. **Publicly marketing the property** (vs. selling your contract to a private buyer list) is what triggers "unlicensed brokerage." OK's SB 1075 **closes the double-close loophole**, so structure choice alone doesn't cure a disclosure/licensing violation.

### Outreach compliance (2025 rules)
- **TCPA:** the FCC one-to-one consent rule was **vacated 1/24/2025** (*IMC v. FCC*, 11th Cir.) — but **prior express written consent** still required for autodialed/prerecorded marketing ([Wiley](https://www.wiley.law/alert-UPDATE-11th-Circuit-Vacates-FCCs-One-to-One-TCPA-Consent-Rule)). **Revocation rule (eff. 4/11/2025):** honor opt-outs "as soon as practicable," **≤10 business days**; STOP/QUIT/END/REVOKE/OPT-OUT/CANCEL/UNSUBSCRIBE all count ([BCLP](https://www.bclplaw.com/en-US/events-insights-news/the-tcpas-new-opt-out-rules-take-effect-on-april-11-2025-what-does-this-mean-for-businesses.html)). **Hours: 8am–9pm called-party local.** Penalty **$500–1,500/violation**, uncapped.
- **A2P 10DLC:** mandatory since **Feb 2025** — AT&T/T-Mobile/Verizon block unregistered traffic. Requires TCR **brand** (EIN) + **campaign** registration with sample messages + proof of opt-in ([Sakari](https://sakari.io/blog/meeting-10dlc-compliance-with-opt-ins)).
- **DNC:** scrub National registry **every ≤31 days** + **11 state registries** (CO, CT, IN, LA, MA, MO, OK, PA, TN, TX, WY); honor internal opt-outs ≤10 business days ([Aloware](https://aloware.com/blog/dnc-compliance-for-outbound-sales-teams)).
- **State mini-TCPAs:** **FL FTSA** (15-day cure window after STOP), **OK OTSA** (max **3 attempts/24h**, restricted hours). Maintain per-state rulesets ([Manatt](https://www.manatt.com/insights/newsletters/tcpa-connect/oklahomas-mini-tcpa)).

### Enforcement checklist (what the platform must gate)
1. **State ruleset gate** (geofenced by property state) — hard-block/warn SC, IL, OK, PA, KY for unlicensed operators.
2. **Deal-count throttle** — enforce IL 1-per-12-months.
3. **Mandatory equitable-interest disclosure** — auto-generate & require signature.
4. **Right-to-cancel enforcement** — inject correct window (OK 2 biz days, PA 30 days), block fund release until expiry.
5. **Consent ledger** — store PEWC before any automated marketing.
6. **A2P 10DLC gate** — block SMS unless brand+campaign approved.
7. **DNC scrubbing** — National ≤31 days + 11 state + internal; log proof.
8. **Opt-out engine** — recognize all keywords, suppress cross-channel ≤10 biz days.
9. **Time-window enforcement** — 8am–9pm recipient-local + stricter state rules.
10. **Frequency caps + immutable audit trail** — defensible against TCPA/FTSA claims.

---

## 3. Launch market: **Tampa Bay, FL**

Scored 1–5 across five criteria (judgments derived from cited evidence). Data availability penalizes **non-disclosure states (TX)** where sold prices aren't public.

| Metro | Legality | Deal supply | Growth/demand | Margin room | Data | **/25** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **Jacksonville, FL** | 5 | 4 | 5 | 4 | 5 | **23** |
| **Tampa, FL** | 5 | 5 | 4 | 3 | 5 | **22** |
| **Atlanta, GA** | 5 | 3 | 5 | 3 | 5 | **21** |
| Orlando, FL | 5 | 4 | 4 | 3 | 5 | 21 |
| Indianapolis, IN | 4 | 4 | 4 | 4 | 4 | 20 |
| Kansas City, MO | 5 | 3 | 3 | 4 | 4 | 19 |
| Memphis, TN | 3 | 5 | 2 | 5 | 4 | 19 |
| Houston, TX | 3 | 4 | 5 | 4 | 2 | 18 |
| Dallas–Fort Worth, TX | 3 | 3 | 5 | 3 | 2 | 16 |

**Why Tampa leads for launch** (despite Jacksonville edging the raw score):
1. **Hardest distress signal of any large metro** — #1 foreclosure rate among 1M+ metros in 2025 (ATTOM), in the #1 foreclosure state (FL, 1-in-230); Lakeland (1-in-145) and Cape Coral (1-in-189) flank it in the national top 5 ([ATTOM via PRNewswire](https://www.prnewswire.com/news-releases/us-foreclosure-activity-posts-eighth-straight-month-of-year-over-year-increases-302614324.html)).
2. **Deepest exit liquidity** — FL leads the nation in all-cash purchases ([Florida Realtors/Redfin](https://www.floridarealtors.org/news-media/news-articles/2025/02/redfin-florida-leads-all-cash-sales)). A new wholesaler's #1 risk is no one to assign to; Tampa minimizes it.
3. **Clean, stable legality** — legal without a license; FL passed **no** restrictive 2025 wholesale law (unlike TX/OH/IN/TN).
4. **Open data** — FL sunshine records give free sold prices, ownership, tax-delinquency, lis pendens.
5. **Sustained Sun Belt in-migration** — durable buyer/rental demand.

**Trade-off:** higher prices + insurance costs than Midwest; FL condos cooling → **focus on single-family distressed**, not condos.

**Runners-up:** **Jacksonville** (higher margin, tops raw scorecard; shallower cash-buyer pool) · **Atlanta** (deepest institutional buyer pool, but thin on-market distress + attorney-closing state → must work off-market). **Not recommended for launch:** TX metros — best-in-nation growth but §1101.0045 disclosure duty **plus non-disclosure of sold prices** raises legal + underwriting difficulty.

<sub>Caveats: Atlanta institutional-SFR figures from secondary sources; median prices mix listing vs. sale; Jacksonville distress inferred from FL-wide ATTOM data. Legality changes quarterly.</sub>

---

## 4. Vendor / API stack (automation-grade, real APIs)

| Category | **Primary** | Backup | Rationale |
|---|---|---|---|
| Property data & lists | **RealEstateAPI (ReAPI)** | BatchData | Cleanest modern REST; bundles search+comps+skip trace |
| Comps / AVM (ARV) | **HouseCanary** | ATTOM AVM | Only clean API with explicit programmatic **ARV** |
| Skip tracing | **BatchData** | REISkip | Real-time API + published pricing; REISkip pays-per-match ($0.15) |
| SMS / Voice | **Twilio** | Telnyx | Best-documented CPaaS + A2P tooling; Telnyx = ~50% cost lever |
| Dialer | **ReadyMode** | CallTools | RE-focused predictive dialer with an API |
| E-sign / contracts | **PandaDoc** | Dropbox Sign | One API that **generates + signs** assignment docs |

**Lean 5-vendor stack** (ReAPI + BatchData each span data *and* skip): **ReAPI + HouseCanary + Twilio + ReadyMode + PandaDoc**.

**Pricing anchors (vendor-confirmed):** BatchData property $0.01/rec ($1,000/mo/100k), skip $0.02/rec; Twilio SMS $0.0083/segment, brand reg $4.50 one-time, campaign $1.50–10/mo; Telnyx ~$0.004/segment; HouseCanary API $0.30–6.00/call; PandaDoc from $40/mo. ([BatchData](https://batchdata.io/pricing), [Twilio](https://www.twilio.com/en-us/sms/pricing/us), [Telnyx](https://support.telnyx.com/en/articles/5634625-10dlc-fees-and-charges), [HouseCanary](https://www.housecanary.com/pricing), [PandaDoc](https://www.pandadoc.com/developer-api/docusign-api-vs-pandadoc-api/))

**Do NOT build automation on:** **Zillow** (ToS bars marketing/telemarketing lists), **PropStream** (no robust public dev API), **Launch Control** (no dev API), **Skip Genie** (manual), **Estated** (sunsetting into ATTOM, docs deprecating 2026). **TLOxp/IDI/LexisNexis** are API-capable but credential-gated (permissible-purpose vetting).

---

## Source integrity notes
- Pricing corroborated across ≥2 sources where possible (G2, Capterra, SaaSworthy, vendor help centers).
- REsimpli/Carrot official pricing pages returned **HTTP 403** — third-party figures.
- AI-newcomer pricing is quote-based — **unverified**.
- Legal landscape is moving quarterly; several 2025–26 bills are lightly litigated — **confirm statute text + effective dates with counsel** before hard-coding rulesets.
