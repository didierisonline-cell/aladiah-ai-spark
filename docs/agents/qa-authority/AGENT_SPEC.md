# Agent Spec — World-Class QA Agent (Academic Quality & Employability Authority)

Status: **Canonical spec for Agent #5 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).

## 1. Identity & authority

- **Slug:** `qa-authority` · **Name:** World-Class QA Agent · **Cadence:** daily.
- **Mission:** Guarantee that every curriculum component, simulation, assessment,
  lab, project, portfolio artifact, AI workflow, certification, and student
  experience meets world-class standards and **maximizes employability.**
- **Authority:** This is not a traditional QA agent. It is the **Academic Quality
  & Employability Authority** and the **final gate before founder review.**

> **No artifact may enter the Founder Approval Queue unless it passes QA.**

## 2. The gate (lifecycle change)

```
Product Builder generates ─► Aladiah Quality Standard (self-gate)
   pass ─► status 'qa_review'  ─►  QA Authority review
                                      pass        ─► 'pending_approval' (Founder Queue)
                                      conditional ─► 'qa_rejected' (with findings)
                                      fail        ─► 'qa_rejected' (with findings)
   fail ─► 'draft' (held with report)
```

Product Builder artifacts that clear their own quality standard now land in
`qa_review` (not `pending_approval`). The QA Agent reviews the queue and promotes
only `pass` verdicts to the Founder Approval Queue.

## 3. The 13 quality engines

Curriculum Quality · Assessment Quality · Simulation Quality · Lab Quality ·
Project Quality · Employability · Market Intelligence · AI Quality · Student
Experience · Certification · Portfolio · Website Experience · Continuous
Improvement (`src/services/agents/qa/engines.ts`). Each scores 0–100 over the
artifacts it applies to; **critical** engines (Curriculum, Assessment, Simulation,
Employability, AI Quality) must clear the world-class threshold (80).

## 4. Benchmark authorities (12)

Scrum.org · PMI · SAFe · ICAgile · Google · Microsoft · AWS · Meta · Coursera ·
LinkedIn Learning · Harvard Online · MIT Open Learning
(`src/services/agents/qa/benchmarks.ts`). Each artifact is scored for alignment
against the authorities relevant to its domain.

## 5. The six validations

GitHub portfolio · interview readiness · market demand · salary relevance · AI
readiness · employer alignment. `ai_readiness`, `employer_alignment`, and
`market_demand` are **critical** (must pass). Market demand and salary relevance
read the **Market Intelligence Engine** (`qa_market_intelligence`).

## 6. Verdict

`pass` (overall ≥ 80, all critical engines ≥ 80, all critical validations pass) →
Founder Approval Queue. `conditional` (≥ 70) and `fail` (< 70) → `qa_rejected`
with specific findings. Every review is stored in `qa_reviews` (engine scores,
benchmark scores, validations, findings).

## 7. AOS integration

| Subsystem | Integration |
|---|---|
| Registry | Auto-registered in `bootstrap.ts` + migration seed. |
| Orchestrator | `qaRunner`; default cycle = process the QA queue (the gate). |
| Execution Logs | Every review + cycle logged. |
| Memory | Recurring findings + review cycles (Continuous Improvement Engine). |
| Tasks | Accepts delegated `review_queue` tasks (`enqueueQATask`). |
| Communication | Reports cleared/rejected counts to the CEO Agent. |
| Health | Uptime/errors/perf roll up; shown on the dashboard. |
| Permissions | `publish:false`, `human_approval_required:true`; it gates, never publishes. |

**Code:** service `src/services/agents/qaAgent.ts`; engines/benchmarks under
`src/services/agents/qa/`; types `src/types/qa.ts`; schema
`supabase/migrations/20260610180000_qa_quality_authority.sql` (`qa_reviews`,
`qa_market_intelligence`); page `src/pages/admin/QAAgent.tsx` (`/admin/qa-agent`).

## 8. Dashboard (`/admin/qa-agent`)

KPIs (awaiting review, reviewed, passed, conditional, rejected, avg score) and tabs:
Reviews (verdicts + validations + findings), Framework (the 13 engines, 12
authorities, 6 validations), Market (intelligence table), Health.

## 9. Future

Phase 2 swaps the deterministic scorer for Claude as LLM-judge (`claude-opus-4-8`,
structured output) and adds **live** validation — real GitHub repo inspection
(via the GitHub integration), live market/salary data, and benchmark-corpus
comparison — behind the same `QAReview` contract. The Website Experience Engine
extends to site-level audits (coordinating with the SEO Agent's audits).
