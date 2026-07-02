# Departments — the AI Workforce index

Status: **Index.** Twelve AOS departments + two student-facing personas. Specs
live under `/docs/agents/<slug>/AGENT_SPEC.md` (the AOS canon's structure);
this index gives them their governance home. Registry slugs match
`src/services/aos/bootstrap.ts`.

| # | Department | Slug | Spec |
|---|---|---|---|
| 1 | CEO Chief of Staff | `ceo-chief-of-staff` | `/docs/agents/ceo-chief-of-staff/` |
| 2 | Marketing Content | `marketing-content` | `/docs/agents/marketing-content/` |
| 3 | SEO Strategy | `seo-strategy` | `/docs/agents/seo-strategy/` |
| 4 | Product Builder | `product-builder` | `/docs/agents/product-builder/` |
| 5 | World-Class QA | `qa-authority` | `/docs/agents/qa-authority/` |
| 6 | Admissions Authority | `admissions-authority` | `/docs/agents/admissions-authority/` |
| 7 | Student Success & Employability | `student-success` | `/docs/agents/student-success/` |
| 8 | Placement & Employer Relations | `placement-authority` | `/docs/agents/placement-authority/` |
| 9 | Analytics & Executive Intelligence | `analytics-intelligence` | `/docs/agents/analytics-intelligence/` |
| 10 | Operations & Platform | `operations-platform` | `/docs/agents/operations-platform/` |
| 11 | Curriculum Excellence | `curriculum-excellence` | `/docs/agents/curriculum-excellence/` |
| 12 | Interface & Experience Architect | `interface-experience` | `/docs/agents/interface-experience/` |
| — | Prof. Didier (persona) | — | Product surface, not an AOS agent |
| — | Career Simulation Engine (persona) | — | Product surface, not an AOS agent |

Every future department: one spec here, one `bootstrap.ts` block, one registry
entry — per `AGENT_OPERATING_SYSTEM.md` §6.
