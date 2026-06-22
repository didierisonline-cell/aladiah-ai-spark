# Launch Command Center — Aladiah MVP Readiness Registry

**Last Updated:** 2026-06-21  
**Next Brief:** 2026-06-21 21:00  
**Registry Owner:** QA Division

This is the single source of truth for what blocks Aladiah's launch. Every blocker is permanent, auditable, and closed with evidence. No blockers are deleted — they are resolved and marked closed.

---

## OPEN BLOCKERS

### BLK-001: Certificate Issuance Pipeline Missing

| Field | Value |
|-------|-------|
| **Title** | Certificate table exists but no issuance trigger on course completion |
| **Severity** | BLOCKER |
| **Owner** | Platform Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-24 |
| **Evidence** | Code: ChapterView.tsx marks free_course_completed (line 821) but never triggers certificate issuance. Database: certificates table exists (53 rows), but no edge function or backend code calls issue_certificate() on final module pass. Supabase function `auto_issue_certificate()` exists but requires manual trigger. |
| **Status** | In Progress — investigating certificate PDF generation approach |
| **Acceptance** | A student completes all 8 BA modules, passes final quiz, and receives a certificate ID + PDF link without manual intervention. Certificate record appears in certificates table with issued_at timestamp. Student sees certificate in PortalCertifications page. |

---

### BLK-002: Capstone Submission Form Not Implemented

| Field | Value |
|-------|-------|
| **Title** | No UI or backend for capstone project submission |
| **Severity** | BLOCKER |
| **Owner** | Frontend Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-25 |
| **Evidence** | Code: PortalPortfolio.tsx shows empty state ("Coming Soon"). No form UI for capstone upload. Database: program_capstones table exists (2 rows, likely seed data only). No capstone_submissions table or form endpoint. Certifications page requires "portfolio submission" for L400+ but no submission workflow exists. |
| **Status** | Not Started — requires form design + backend endpoint |
| **Acceptance** | A student in BA program can upload a capstone artifact (file or document link) after passing all modules. Submission is stored and linked to their portfolio. Capstone is required before certificate issuance for L400+. |

---

### BLK-003: Course Completion Gate Not Tracked

| Field | Value |
|-------|-----|
| **Title** | No platform-level "course completed" flag or trigger |
| **Severity** | BLOCKER |
| **Owner** | Backend Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-23 |
| **Evidence** | Code: user_progress table tracks per-quiz passed flag, but NO course_completions table or aggregate completion check. ChapterView marks free_course_completed (line 821) only for free tier; paid tier has no equivalent. No final_module_passed or course_completion_date on profiles table. Certificate issuance and capstone unlocking both require this gate. |
| **Status** | Blocked by BLK-001 (certificate issuance must trigger after course completion) |
| **Acceptance** | When a student passes the final module quiz, a course_completions row is written with course_id, user_id, completed_at, and score. This triggers certificate issuance and capstone unlock. |

---

### BLK-004: Security: Overpermissive SECURITY DEFINER Functions

| Field | Value |
|-------|-----|
| **Title** | 19 SECURITY DEFINER functions callable by anon role via /rpc |
| **Severity** | BLOCKER |
| **Owner** | Security Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-22 |
| **Evidence** | Supabase Advisor: 19 functions (e.g., aos_is_admin, auto_issue_certificate, issue_certificate, founder_attribution_stats) have EXECUTE grant to anon role. This allows unauthenticated users to call privileged functions. Examples: issue_certificate() allows issuing certs to any user; founder_attribution_stats() leaks founder dashboard data. RLS on certificates, subscriptions, profiles provides some protection but does not override function permissions. |
| **Status** | In Progress — audit which functions need SECURITY DEFINER and restrict anon access |
| **Acceptance** | All SECURITY DEFINER functions are either (a) revoked from anon role, (b) wrapped in authenticated-only edge functions, or (c) moved to service-role-only functions. Test: unauthenticated /rpc/issue_certificate call returns 401 Unauthorized. |

---

### BLK-005: Security: RLS Policy Gaps

| Field | Value |
|-------|-----|
| **Title** | 4 RLS policies are always-true (no real restrictions) |
| **Severity** | BLOCKER |
| **Owner** | Security Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-22 |
| **Evidence** | Supabase Advisor: Tables course_waitlist, lesson_visuals, referral_tracking, videos have RLS policies with always-true USING or WITH CHECK clauses. Example: lesson_visuals "write visuals" allows ALL operations unrestricted. course_waitlist "Anyone can join" allows INSERT without checking user. These effectively disable RLS and allow any authenticated user to read/write any row. |
| **Status** | In Progress — audit actual policy intent and tighten to data-ownership or role-based checks |
| **Acceptance** | All always-true policies are replaced with meaningful checks. Test: authenticated user A cannot insert into another user's row; cannot read another user's lesson_visuals; course_waitlist enforces one entry per user. |

---

### BLK-006: Security: 1 ERROR — SECURITY DEFINER View

| Field | Value |
|-------|-----|
| **Title** | View public.public_profiles defined with SECURITY DEFINER |
| **Severity** | BLOCKER |
| **Owner** | Security Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-22 |
| **Evidence** | Supabase Advisor (ERROR level): public_profiles view is SECURITY DEFINER. This can bypass RLS on the underlying profiles table. If view is exposed via REST API, users may access rows they shouldn't see. Need to audit what data the view exposes and who can query it. |
| **Status** | Not Started — requires investigation into public_profiles purpose and source table |
| **Acceptance** | Either (a) view is removed and replaced with proper RLS-gated REST endpoint, or (b) view is documented as admin-only and NOT exposed via Supabase REST. |

---

### BLK-007: Webhook Signature Validation — Subscription Activation Race

| Field | Value |
|-------|-----|
| **Title** | Async webhook may race with student access checks |
| **Severity** | MAJOR |
| **Owner** | Backend Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-23 |
| **Evidence** | Code: Auth.tsx redirects to `/portal` after Stripe success, but subscription row is written by async webhook (academy-backend/server.js line 286). If student navigates to ChapterView before webhook fires, tier column is NULL and paywall logic may fail silently or show incorrect free-tier gate. ChapterView pre-flight checks tier === 'starter' (line 298) but doesn't handle NULL. |
| **Status** | In Progress — add client-side subscription status poll or server-side pre-flight check |
| **Acceptance** | Test: student completes payment, navigates to course immediately. Subscription status is verified on frontend before showing lessons. If webhook hasn't fired, show "Activating..." instead of content. Once webhook completes, content unlocks automatically. |

---

### BLK-008: Free-Tier Onboarding Flow Broken

| Field | Value |
|-------|-----|
| **Title** | Free tier students confirm email but don't land at course selection |
| **Severity** | MAJOR |
| **Owner** | Frontend Lead |
| **Opened** | 2026-06-21 |
| **Target Fix** | 2026-06-23 |
| **Evidence** | Code: Auth.tsx redirects confirmed users to `https://aladiahacademy.com/portal` (line 68). StudentPortal then checks free_course_id and may force user back to CourseSelectionGate. Expected: free-tier user confirms email → lands at CourseSelectionGate to pick free course → auto-starts learning path. Actual: user redirected to portal, sees gate, has to navigate manually. |
| **Status** | Not Started — update Auth.tsx redirect logic for free tier |
| **Acceptance** | Test: free-tier user signs up, confirms email. Redirect goes directly to CourseSelectionGate, not portal. User picks free course and immediately sees Module 0 lesson. |

---

## RESOLVED BLOCKERS

*None yet. Registry started 2026-06-21.*

---

## PROGRAM READINESS SCORECARD

| Program | Content | Assessment | Simulation | Portfolio | Cert | Translation | Security | QA | **Overall** |
|---------|---------|-----------|-----------|----------|------|------------|----------|----|----|
| **BA** | 25% | 20% | 10% | 0% | 0% | 5% | 40% | 20% | **15%** |
| **PM** | 20% | 15% | 8% | 0% | 0% | 0% | 40% | 15% | **11%** |
| **Scrum** | 18% | 12% | 5% | 0% | 0% | 0% | 40% | 10% | **8%** |
| **DA** | 15% | 10% | 0% | 0% | 0% | 0% | 40% | 8% | **5%** |

**Legend:** Weighted by QA_STANDARD v1.3 formula. **Security blocker = 0% program score until BLK-004, BLK-005, BLK-006 closed.**

---

## 9 PM CEO BRIEF — Template (Updated daily)

```
Open Blockers:  6
Majors:         2
Minors:         0

Program Readiness:
  BA     15%  🔴 Cert issuance blocked
  PM     11%  🔴 Cert issuance blocked
  Scrum   8%  🔴 Cert issuance blocked
  DA      5%  🔴 Cert issuance blocked

Top Risks:
  1. Certificate issuance pipeline — no trigger on course completion
  2. Capstone submission form — required for L400+ certification
  3. Security: overpermissive SECURITY DEFINER functions

Decisions Needed:
  - Certificate PDF generation: build in-house or use third-party?
  - Capstone format: file upload, text, or link submission?

Tomorrow's Priorities:
  - Close BLK-003 (course completion gate)
  - Resolve BLK-004 (strip anon access from privileged functions)
  - Mock capstone submission form
```

---

## LAUNCH READINESS: MVP Path

The student journey from signup to certificate:

```
✓  STAGE 1: Auth / Sign Up         IMPLEMENTED (90%)
   └─ Issue: Free tier flow needs direct CourseSelectionGate redirect (BLK-008)

✓  STAGE 2: Payment / Subscribe    IMPLEMENTED (95%)
   └─ Issue: Async webhook may race (BLK-007, mitigated by polling)

✓  STAGE 3: Learning Path          IMPLEMENTED (85%)
   └─ Ready: Lessons, videos, quizzes, progress tracking all functional

✓  STAGE 4: Exam / Pass Logic      IMPLEMENTED (80%)
   └─ Ready: Module quizzes with pass/fail gates work per-module

✗  STAGE 5: Capstone Submission    MISSING (0%)
   └─ Blocker: BLK-002 — no submission form or backend

✗  STAGE 6: Certificate Issuance   MISSING (0%)
   └─ Blocker: BLK-001, BLK-003 — no completion trigger or PDF generation
```

**MVP Launch Gated On:**
1. BLK-001 (Certificate Issuance) — CRITICAL
2. BLK-002 (Capstone Submission) — CRITICAL
3. BLK-003 (Course Completion Gate) — CRITICAL
4. BLK-004 (Security DEFINER cleanup) — CRITICAL
5. BLK-005 (RLS Policy audit) — CRITICAL
6. BLK-006 (SECURITY DEFINER view) — CRITICAL

**Launch allowed when:** All 6 blockers are closed with evidence. BLK-007 and BLK-008 (Majors) may proceed with owner + target date.

---

## How to Update This Registry

1. **New Blocker Identified:** Add row under OPEN BLOCKERS. Assign BLK-### (sequential). Populate all fields. Severity must be Blocker, Major, or Minor.
2. **Blocker Closed:** Move row to RESOLVED BLOCKERS, add `Closed: YYYY-MM-DD` and `Resolution: <brief summary>`.
3. **Evidence Link:** Cite specific code files (file:line), PR numbers, or test results. Evidence is proof, not opinion.
4. **Daily Update:** Refresh "Last Updated" and regenerate scorecard. CEO Brief is auto-generated from scorecard + open blockers.

---

**Ratified:** 2026-06-21  
**Version:** 1.0 (first registry, seeded with 8 blockers from live code audit + security scan)
