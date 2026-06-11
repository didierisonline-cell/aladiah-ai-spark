# Aladiah Academy — Operating Metrics Framework v1.0

**Founder:** Didier · **Executive Layer:** CEO Agent
**Core Departments:** Product Builder · QA + Security · Marketing · Admissions · Student Success · Analytics

> Canonical org + KPI model for the Aladiah AI Workforce. The Security Command
> Center, CEO reporting, and department scorecards implement this document.

## Master Company KPI — Career Transformation Impact Score (CTIS)
`CTIS = Student Success + Competency Growth + Portfolio Readiness + Certification Readiness + Placement Readiness + Salary Growth + Employer Satisfaction`
Aladiah measures **transformation** (employable, skilled, confident, economically upgraded) — **not course completion**.

## Org structure
```
Didier
└── CEO Agent
    ├── Product Builder
    ├── QA + Security
    ├── Marketing
    ├── Admissions
    ├── Student Success
    └── Analytics
```

## CEO Agent
- **Mission:** coordinate the operating system; give Didier live executive visibility.
- **Inputs:** department reports, risks, revenue, student outcomes, platform health, marketing, admissions pipeline, placement pipeline.
- **Outputs:** founder brief, priorities, risks, approvals, execution plan, daily scorecard.
- **KPIs:** Company Health · Revenue MTD · Active Students · Completion Rate · Placement Readiness · Open Critical Risks · Pending Approvals · Agent Health · Platform Health.
- **Automation:** daily brief, department summaries, risk detection, escalation, next best actions.
- **Approval rule:** may recommend; **cannot** approve payments, publish programs, deploy prod, send contracts, or modify roles without Didier.

## Departments (mission · key KPIs · approval rule)
1. **Product Builder** — build/improve learning product. KPIs: Curriculum Excellence (90+), Mobile UX (90+), Defect Escape (<5%), Simulation/Lab/Portfolio quality. Flagship = 18 modules / 54 sims / 18 labs / 18 portfolios. *Drafts only; no publish/pricing/payment/deploy without QA + founder.*
2. **QA + Security** — quality, security, compliance, release readiness. KPIs: Security Posture, Critical Vulns (0), Secret Exposure (0), Route Protection Pass, RLS Pass, MTTD/MTTR, Release Readiness. *Can block releases automatically; cannot rotate keys/delete data/deploy without founder.*
3. **Marketing** — demand, trust, brand, qualified leads. KPIs: Traffic, Organic Growth, Lead Conv, CPL, CPA, LP Conv (5–10%), Email Open (30%+), LTV:CAC (3:1+). *No auto-posting/ads/claims/pricing without founder.*
4. **Admissions** — convert qualified prospects, protect fit. KPIs: Lead→App, App→Enroll, Qualified Lead, CPE, Time-to-Enroll, Onboarding (85%+), Program Fit (80+), Refund Risk. *No manual enroll/scholarships/contracts/guarantees without founder.*
5. **Student Success** — completion, mastery, portfolio, interview prep, employability. KPIs: WAU (70%+), Module/Quiz/Sim/Lab/Portfolio completion, Certification Readiness (85%+), Interview Readiness, Placement Readiness, At-Risk count (health <60 → intervene; contact <24h). *No grade/cert/job-promise without approval.*
6. **Analytics** — data → decision intelligence. KPIs: Data Freshness (daily+), Forecast Accuracy (±10%), Dashboard Uptime (99%+), Data Quality (95%+), Decision Latency. *No source-data edits/public reports without approval.*

## Department scorecard (weekly)
`90–100 Elite · 80–89 Healthy · 70–79 Watch · 60–69 At Risk · <60 Critical`
Weekly founder report: score · KPI movement · risks · blockers · wins · next best actions · approval requests.

## Operating cadence
- **Daily:** CEO brief · security check · platform health · student-risk scan · admissions pipeline.
- **Weekly:** department scorecards · curriculum · marketing · student success · placement readiness · security posture.
- **Monthly:** revenue · program quality · curriculum excellence · student outcomes · market demand · roadmap.

## Absolute rules
1. No secret exposure. 2. No student access to founder routes. 3. No curriculum publishes without QA. 4. No public marketing without approval. 5. No payment flow live without Stripe test. 6. No certificate without completion logic. 7. No placement promise without verification. 8. No production deploy without security + QA checks. 9. CEO Agent must report status on demand. 10. Aladiah measures transformation, not just completion.
