# Aladiah vs Super Master Prompt — Blueprint Conformance Measurement

**Date:** 2026-06-19 · **Method:** measured against the Founder's Super Master Prompt using the platform's own law: **Spec → Authored → Live → QA → Founder → Released.**

## Honesty caveat (read first)
- **Authored** = strong evidence (this is from reading the actual codebase/migrations/routes).
- **Live** = the production DB/student path. I **cannot query it** — so Live is marked *unverified* unless a code path forces it. Treat every "Live" cell as **needs live verification**, not a claim.
- **QA verified** = essentially **none** done (no role/device/language/payment end-to-end test this session).
- Scores are evidence-based and deliberately conservative. No score is "done."

Scale (blueprint bands): <60 internal · 60–74 not sell-ready · 75–84 beta · 85–94 controlled launch · 95–100 full launch.

---

## Master conformance scorecard

| # | Blueprint domain | Spec | Authored | Live | QA | Score | Evidence / gap |
|---|---|:--:|:--:|:--:|:--:|:--:|---|
| 1 | **Operating model (14 cells)** | ✅ | ◑ | ◑ | ✗ | **55** | **19 `/admin/*` agent dashboards exist** (command-center, qa-agent, security, product/placement/marketing-agent, analytics, student-success, agent-os, ai-workforce, curriculum-excellence) + `/founder/*`. Strong UI scaffold; but dashboards read **code/aspirational data**, not live-verified evidence. |
| 2 | **Product/platform stack** | ✅ | ✅ | ✅ | ◑ | **90** | React/TS/Vite/Tailwind/shadcn/Supabase exactly as specced; deployed on Vercel. |
| 3 | **DB content architecture** | ✅ | ◑ | ◑ | ✗ | **60** | Real model = `courses/chapters/videos/quizzes/quiz_questions/user_progress/subscriptions/scrum_simulations/student_labs/student_learning_profiles`. **Missing vs blueprint: `schools` (code-only map), `portfolio_projects`, `capstones` tables, general `audit_logs`.** Naming differs (courses≈programs, chapters≈modules, videos≈lessons). |
| 4 | **Curriculum — 4 flagships** | ✅ | ◑ | ✗ | ✗ | **30** | Scrum: authored as 3 **unapplied** migrations (audit `294a9de`) → **old 4-module course still Live**. PM/BA/Cyber **not audited**. |
| 5 | **Translation / native experience** | ✅ | ◑ | ✗ | ✗ | **40** | UI chrome dictionary 100% across 8 langs (verified). **Course/quiz/sim/AI content = data gap (untranslated).** "Full multilingual" **not** truthful yet. |
| 6 | **Assessment quality** | ✅ | ◑ | ✗ | ✗ | **40** | Engine exists (`quizzes/quiz_questions/quiz_attempts`, passing-score, `user_passed_quiz`). Content thin: Scrum **100 Qs / 7 of 18 modules**; rotation/explanations partial. |
| 7 | **Simulation engine** | ✅ | ◑ | ◑ | ✗ | **50** | **Real DB sim engine exists** (`scrum_simulations`, `simulation_messages`, `simulation_scores`, `ScrumSimulation.tsx`). But flagship's 54 sims are **code-only**, not wired to the student DB path. |
| 8 | **Projects / portfolio** | ✅ | ◑ | ✗ | ✗ | **25** | Code-only; **no `portfolio_projects` table**; `student_labs` tracks labs but lab content is code. |
| 9 | **Capstone** | ✅ | ◑ | ✗ | ✗ | **45** | Scrum capstone authored (M18, 40 real Qs) but lives in unapplied migration; **no `capstones` table**. |
| 10 | **Certification alignment** | ✅ | ◑ | ✗ | ✗ | **45** | Scrum → PSM I/II mapped (`CERTIFICATION.md`). Others unmapped/unverified. |
| 11 | **Employer alignment** | ✅ | ◑ | ✗ | ✗ | **40** | `competencyMapping` + Talent Score + `/admin/placement-agent`. Job-posting validation/salary evidence partial. |
| 12 | **AI tutor & student success** | ✅ | ◑ | ◑ | ✗ | **55** | Prof. Didier composer (8 langs) ✅; `ai_conversations`, `student_learning_profiles`, recompute fn. **But 7 AI edge fns run on Lovable AI gateway** (third-party dependency, flagged). |
| 13 | **Payment / revenue** | ✅ | ✅ | ? | ✗ | **55** | `subscriptions` table + `create-checkout` + `handle-payment-webhook` + `useSubscription` authored. **Zero end-to-end test** (checkout/webhook/unlock/cancel/fail). Live unknown. |
| 14 | **Security / compliance** | ✅ | ✅ | ◑ | ◑ | **60** | 4 blockers fixed + merged (#25). **3 migrations UNAPPLIED → prod profiles still world-readable, seed/email open.** Base RLS exists; new lockdowns dormant. |
| 15 | **Marketing / growth** | ✅ | ◑ | ✗ | ✗ | **30** | `/admin/marketing-agent` + `/admin/seo-agent` dashboards exist; no real experiment loop/CAC data. |
| 16 | **QA & audit system** | ✅ | ◑ | ✗ | ✗ | **35** | `/admin/qa-agent` + real scripts (`i18n:audit`, `verify:progress/competency/zero-state`, `audit:i18n-live`). **No** cross role/device/language/payment QA. |
| 17 | **Brand / website premium** | ✅ | ✅ | ✗ | ✗ | **55** | Logo system + hero globalized authored (#26), **unmerged → prod still old logo**. Premium polish + mobile responsiveness **not QA'd**. |
| 18 | **Website page coverage** | ✅ | ◑ | ◑ | ✗ | **70** | Home/Schools/Courses/Certifications/Pricing/Employers/Enroll/Auth/Community/Talent-Network/Store/Portal/Founder all exist. **Missing: Terms, Privacy, Contact** (legal pages) — a real launch/payment/compliance blocker. |
| 19 | **Founder portal / CEO dashboard** | ✅ | ◑ | ◑ | ✗ | **50** | `/founder/readiness`, `/founder/control-center`, `/admin/command-center` exist. **Not truthful**: read code/aspirational data; **no claim-integrity or unapplied-migration warnings** surfaced. |
| 20 | **Claim integrity** | ✅ | ✗ | ✗ | ✗ | **30** | Live/spec over-claims: "162 lessons / 1,080-q bank / 200-q exam / 54 sims" vs authored 72/100/40/code-only. **No automated claim-vs-live check.** |

---

## Truth-chain reality (where each big rock sits)

```
Security    Spec ✅  Authored ✅  Live ✗(migrations unapplied)  QA ◑  Founder ⏳  Released ✗
Branding    Spec ✅  Authored ✅  Live ✗(PR #26 unmerged)        QA ✗  Founder ⏳  Released ✗
Scrum flag  Spec ✅  Authored ◑  Live ✗(old course live)        QA ✗  Founder ⏳  Released ✗
Translation Spec ✅  Authored ◑(chrome)  Live ✗(content)        QA ✗  Founder —   Released ✗
Payment     Spec ✅  Authored ✅  Live ?(untested)              QA ✗  Founder ⏳  Released ✗
Claims      Spec ✅  Authored ✗(over-claim)  Live ✗            QA ✗  Founder ⏳  Released ✗
```

## Honest composite

**Aladiah Launch Readiness ≈ 55–62%.** Consistent with the prior estimate. The platform is **broad and well-scaffolded** (stack, 19 agent dashboards, sim engine, payment code, security code, branding) but **shallow on the Live + QA + Claim-integrity axes** — almost everything strong is **Authored, not Live-verified**, and the few public claims that *are* live are partly **false**.

**The single biggest systemic finding:** the gap is not "build more." It is **"prove and ship what exists, and stop claiming what isn't live."** Three of the four largest rocks (security, branding, Scrum flagship) are **done in code but not in production**, and the founder dashboards that should reveal this instead show optimistic code-derived numbers.

## Top blockers (ranked) → all in the Founder Apply Runbook (`docs/ops/FOUNDER_APPLY_RUNBOOK.md`)
1. **Claim integrity** — remove "162 lessons / 1,080-q bank / 200-q exam" (trust/legal risk); the false claim is even inside the flagship migration's course description.
2. **Security migrations unapplied** — prod is exposed now.
3. **Branding unmerged** — prod still old logo.
4. **Scrum flagship unapplied** — old course still live.
5. **Legal pages missing** (Terms/Privacy/Contact) — cannot take payments/PII responsibly without them.
6. **Payment never tested** end-to-end.
7. **Founder dashboards not truthful** — should read live data + show unapplied-migration / claim-integrity warnings.

## Founder decision list (new, from this measurement)
- Approve interim claim wording (gates the flagship apply).
- Approve building **Terms/Privacy/Contact** before any paid launch.
- Approve a **truthful CEO dashboard** that computes from live data + flags claim/migration drift (replaces optimistic code-derived numbers).
- Confirm the 4-flagship-first focus (Scrum → PM → BA → Cyber) before portfolio expansion.

## What this measurement deliberately did NOT do
- Did not query the live DB (no access/approval) — every "Live" needs verification.
- Did not run payment, device, or language end-to-end QA.
- Did not audit PM/BA/Cyber (per Founder's "fix known blockers first" decision).
- Did not assign any "done" — nothing here is Released.
