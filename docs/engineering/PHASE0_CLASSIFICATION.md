# Phase 0 — Institutional Classification

**Status: Classification record (FD Phase 0). No capability enters the
Institutional Registry before it appears here. Nothing was modified —
including the Shadow Curriculum Factory.** Prepared 2026-07-02.

Categories: **Constitutional · Strategic · Operational · Experimental ·
Legacy · Archived · Unknown.** Classification is evidence-based; Unknown is a
legitimate class and is preferred over guessing (LAUNCH_DECISION_PRINCIPLE).

## 1. Capability-class classification

| Capability | Class | Basis |
|---|---|---|
| Covenant, Constitution, Founding Library, ratification lifecycle, governance registry + drift check | **Constitutional** | The canon spine; CI-enforced |
| Ratified canon (LDP, North Star, Architecture Principle, Competency Taxonomy, QA Standard, program gates) | **Constitutional** | Ratified, founder-signed era |
| AIOS design, Intelligence Architecture, CI doctrine, Enterprise Architecture draft, Founder cockpit | **Strategic** | Direction-setting; partly pre-ratification |
| 3 documented programs (Scrum v3 flagship, BA v1, Cyber v1) + curriculum docs (40) | **Strategic** | Revenue spine; founder-applied publish flow |
| AOS runtime (12 agents, work orders, event bus, brain, intelligence) | **Operational** | Live, tested, canon-governed |
| 25 operational edge functions (payments, ai-proxy, grading, assistants, email, translate) | **Operational** | Live student/revenue path; spec gaps noted in gap matrix |
| Student portal + public surfaces (40 pages), 217 components, i18n pipeline | **Operational** | Live product |
| 117 migrations, founder-applied SQL packages | **Operational** | Canon-compliant change record |
| `voice-tests/`, `generate-visuals`, `generate-lesson-audio`, ElevenLabs conversation surface | **Experimental** | Exploratory; keys pending rotation (SEC-002/3) |
| Root-level seed scripts (`seed_*.cjs`, `p2_*.sql`, `*_questions.sql`, python helpers) | **Legacy** | Pre-edge-function era; superseded by migrations |
| `.bak`/`.backup` files (StudentPortal, Community, index.css), `useBrain.ts` (committed truncated, zero importers), orphaned VideoPlayer | **Legacy** | Dead code with evidence; candidates for founder-approved cleanup |
| Historical audit reports (docs/audits, 7) | **Archived** | Point-in-time records; retained |
| **Shadow Curriculum Factory: 44 `seed-*` edge functions** | **7 Legacy · 37 Unknown** | Individual classification below |

## 2. Shadow Curriculum Factory — individual classification (44 seeders)

**New evidence this phase (reproducible greps):** 42/44 insert
`is_published: true` (publish-direct, bypassing every constitutional gate);
38/44 call `.delete()` on existing courses before re-inserting
(**destructive re-seed** — running one replaces a live course and orphans its
enrollments/progress by course id). Live callability is unverifiable from the
client repo; **the founder walk must check the Supabase dashboard for
deployment status and invocation logs.**

Classification rule applied: a seeder mapping to a canon-taxonomy program
(`scrum`, `pm`, `ba`, `da`) or a documented flagship (cyber) is **Legacy**
(superseded by the founder-applied migration publish flow). All others are
**Unknown** until the founder walk — not Experimental (no evidence they were
sanctioned experiments), not Archived (no evidence they are retired).

| Seeder | Class | Publish | Destructive | Basis |
|---|---|---|---|---|
| `seed-ai-agent-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-agent-engineer-course` | Unknown | publishes | — | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-agent-engineer-v2` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-auditor` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-business-analyst` | Unknown | — | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-business-operations` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-cloud-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-cloud-engineer-course` | Unknown | publishes | — | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-cloud-engineer-v2` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-compliance-officer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-data-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-devops-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-enterprise-architect` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-ethics-specialist` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-experience-architect` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-governance-professional` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-governance-professional-course` | Unknown | publishes | — | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-mlops-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-platform-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-pm-course` | Legacy | publishes | destructive | maps to a canon-taxonomy program; superseded by founder-applied migration publish flow |
| `seed-ai-policy-designer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-product-manager` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-product-manager-course` | Unknown | publishes | — | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-program-manager` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-risk-manager` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-sales-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-security-engineer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-security-engineer-v2` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-solutions-architect` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-solutions-consultant` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-transformation-manager` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-ux-designer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-ai-workflow-designer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-all-quizzes` | Legacy | — | — | bulk quiz support for early seeding era |
| `seed-business-analysis-course` | Legacy | publishes | destructive | maps to a canon-taxonomy program; superseded by founder-applied migration publish flow |
| `seed-conversation-designer` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-cybersecurity-course` | Legacy | publishes | destructive | maps to a canon-taxonomy program; superseded by founder-applied migration publish flow |
| `seed-data-analytics-course` | Legacy | publishes | destructive | maps to a canon-taxonomy program; superseded by founder-applied migration publish flow |
| `seed-devops-course` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-human-ai-interaction-specialist` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-pm-professional-course` | Legacy | publishes | destructive | maps to a canon-taxonomy program; superseded by founder-applied migration publish flow |
| `seed-responsible-ai-specialist` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |
| `seed-scrum-course` | Legacy | publishes | — | maps to a canon-taxonomy program; superseded by founder-applied migration publish flow |
| `seed-solution-architect-course` | Unknown | publishes | destructive | no taxonomy program, no documentation; awaiting founder walk |

**Totals: 7 Legacy · 37 Unknown · 42 publish-direct · 38 destructive.**

## 3. Standing risk statement (not remediated, per directive)

Until the founder walk determines deployment status, the institution must
assume 37 Unknown functions capable of replacing production course content
exist. No remediation was performed. Recommended walk order: Supabase →
Edge Functions → confirm which are deployed → invocation logs → founder
decision per seeder (retire / govern / archive), recorded via work orders.
