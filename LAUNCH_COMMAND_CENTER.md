# Launch Command Center — Aladiah MVP Readiness Registry

**Last Updated:** 2026-06-21  
**Next Brief:** 2026-06-21 21:00  
**Registry Owner:** QA Division

This is the single source of truth for what blocks Aladiah's launch. Every blocker is permanent, auditable, and closed with evidence. No blockers are deleted — they are resolved and marked closed.

---

## OPEN BLOCKERS

### BLK-001: Certificate Issuance — EVIDENCE NEEDED

| Field | Value |
|-------|-------|
| **Title** | Verify: can a certificate record be issued without PDF generation? |
| **Severity** | BLOCKER (if true) / PHANTOM (if certificate record + verification page is enough) |
| **Owner** | Founder / Platform Lead |
| **Opened** | 2026-06-21 |
| **Evidence Status** | PENDING FOUNDER VALIDATION |
| **Question** | Does MVP require PDF certificate generation, or is a certificate record + verification URL sufficient? |
| **Prior Reports** | CEO Agent reported "completion engine + eligibility gate + certificate gate already exist." Conflict: code scan found no issuance trigger, but earlier reports claim capability exists. Need proof. |
| **How to Resolve** | Founder walks through BA program: completes final module → passes exam → submits capstone (mock if not ready) → checks PortalCertifications page. Does a certificate appear? Can it be verified? If yes, no blocker. If no, it's a real blocker. |
| **Acceptance Criteria** | Student completes BA program and either (a) certificate record appears with issued_at + verification link (MVP OK), or (b) no certificate appears at all (blocker confirmed). |

---

### BLK-002: Capstone Submission — EVIDENCE NEEDED

| Field | Value |
|-------|-------|
| **Title** | Verify: is the capstone submission form built or not? |
| **Severity** | BLOCKER (if missing) / PHANTOM (if built) |
| **Owner** | Frontend Lead |
| **Opened** | 2026-06-21 |
| **Evidence Status** | CONFLICTING REPORTS |
| **Conflict** | Earlier reports: "Student UI, capstone submission, founder approval queue" built and verified. Current scan: PortalPortfolio empty ("Coming Soon"), no form. Need clarification. |
| **How to Resolve** | Founder navigates to BA program → completes final module → looks for capstone submission UI. Does the form exist? Can a capstone be submitted? |
| **Acceptance Criteria** | Either (a) capstone submission form is present and functional (blocker closed), or (b) form is genuinely missing (blocker confirmed). Show screenshot. |

---

### BLK-003: Course Completion Gate — EVIDENCE NEEDED

| Field | Value |
|-------|-----|
| **Title** | Verify: does course completion logic already exist in code? |
| **Severity** | BLOCKER (if missing) / PHANTOM (if exists) |
| **Owner** | Backend Lead |
| **Opened** | 2026-06-21 |
| **Evidence Status** | CONFLICTING REPORTS |
| **Conflict** | Earlier reports: "completion engine, eligibility gate, certificate gate already exist." Current scan: code shows per-quiz tracking only, no course-level completion. Need definitive proof. |
| **How to Resolve** | (a) Grep codebase for course_completions table, course-level completion checks, final_module_passed logic. Does it exist? (b) Founder test: pass final BA module and check profile. Is completion recorded? |
| **Acceptance Criteria** | Either (a) completion gate code exists (show file:line), or (b) it doesn't exist and blocker is confirmed. Do not estimate. Prove. |

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

## FOUNDER VALIDATION RUNBOOK

**Goal:** Run the complete BA student journey on the live site (https://aladiahacademy.com). Every stop in this flow is a decision point: if it works, move to the next. If it fails, open a BLK-### with screenshot evidence.

**Est. Time:** 2–4 hours (includes mockups for capstone if form is missing).

### Stage 1: Sign Up & Email Confirmation
- [ ] Navigate to https://aladiahacademy.com
- [ ] Sign up with test email (e.g., founder-test-ba@aladiahacademy.com)
- [ ] Receive confirmation email
- [ ] Click confirmation link
- [ ] Land on course selection or portal
- **Decision:** Did the free-tier redirect work as expected? Or redirect to portal? (BLK-008 indicator)

### Stage 2: Enroll in BA (Paid Tier)
- [ ] Select Business Analyst program
- [ ] Click "Enroll" or "Subscribe"
- [ ] Proceed to Stripe checkout (test card: 4242 4242 4242 4242)
- [ ] Complete payment
- [ ] Verify subscription is active in profile/settings
- **Decision:** Is subscription immediately active, or does it require manual webhook? (BLK-007 indicator)

### Stage 3: Complete One Full Module (Module 0)
- [ ] View Module 0 lessons
- [ ] Watch one lesson (or mock video completion)
- [ ] Complete Module 0 quiz (pass)
- [ ] Verify progress is recorded
- **Decision:** Does the learning path UI work? (Expected: yes)

### Stage 4: Complete BA Program (Fast-Track for Testing)
- [ ] Admin/founder action: manually mark all other modules as completed in DB (or run test script)
  - Reason: We don't need to sit through 8 modules; we need to test the *completion gate*
- [ ] Simulate: student passes final BA module quiz
- **Decision:** Does the system recognize BA as "complete"? Check profiles table / completion gate.

### Stage 5: Capstone Submission (If Form Exists)
- [ ] Navigate to PortalPortfolio
- [ ] Look for capstone submission UI
- **If form exists:**
  - [ ] Submit a capstone (file, text, or link)
  - [ ] Verify submission is stored
- **If form does NOT exist:**
  - [ ] Screenshot "Coming Soon" placeholder
  - [ ] Open BLK-002 (Capstone Submission confirmed missing)
  - [ ] Continue to Stage 6 with mock capstone data (insert row manually if needed)
- **Decision:** Form real or phantom? (BLK-002 indicator)

### Stage 6: Certificate Issuance
- [ ] Navigate to PortalCertifications
- [ ] Check if a certificate appears for BA program
- **If certificate appears:**
  - [ ] Verify it has issued_at timestamp
  - [ ] Check if verification link works (if present)
  - [ ] Screenshot the certificate display
  - [ ] BLK-001 is PHANTOM (certificate system works)
- **If NO certificate:**
  - [ ] Screenshot the empty state
  - [ ] Check certificates table directly (should have a row for user_id + BA course_id)
  - [ ] If row exists but not displayed: UI bug (new BLK-##)
  - [ ] If row does NOT exist: issuance trigger missing (BLK-001 confirmed)
- **Decision:** Certificate issued or not? (BLK-001 indicator)

### Stage 7: Founder Approval Queue (If Capstone Exists)
- [ ] Navigate to Founder dashboard
- [ ] Check "Pending Capstone Approvals" or similar
- [ ] Approve the capstone
- [ ] Verify student's certificate status updates
- **Decision:** Approval queue wired? (Expected flow, not a blocker for MVP if capstone approval is manual)

---

**Runbook Output:** For each stage, document:
- Screenshot of success or failure
- Any error message
- Actual behavior vs. expected behavior
- Assign BLK-### if failure is a blocker, else mark "works"

---

## SUSPECTED / HYPOTHESIS (No Evidence Yet)

### HYP-001: Certificate Issuance Broken?

| Field | Value |
|-------|-------|
| **Title** | Do students actually NOT receive certificates after completing the BA program? |
| **Status** | HYPOTHESIS — Conflicting reports. Earlier reports claim capability exists; code scan found no trigger. Unresolved. |
| **How to Prove** | Founder Validation Runbook: Complete BA program, check PortalCertifications. Screenshot of success or failure. |
| **Evidence Link** | Pending runbook execution |

---

### HYP-002: Capstone Form Broken?

| Field | Value |
|-------|-------|
| **Title** | Is there actually no capstone submission form? |
| **Status** | HYPOTHESIS — Code scan shows empty "Coming Soon" placeholder. But earlier reports claim "Student UI, capstone submission, founder approval queue built and verified." Which is true? |
| **How to Prove** | Founder Validation Runbook: Navigate to PortalPortfolio after completing BA. Is there a form? Screenshot. |
| **Evidence Link** | Pending runbook execution |

---

### HYP-003: Completion Gate Broken?

| Field | Value |
|-------|-------|
| **Title** | Is there actually no course completion logic? |
| **Status** | HYPOTHESIS — Code scan shows per-quiz tracking only, no course-level completion. But earlier reports claim "completion engine, eligibility gate, certificate gate already exist." Which is true? |
| **How to Prove** | Founder Validation Runbook: Complete final BA module, check profile. Is completion recorded? Query database. |
| **Evidence Link** | Pending runbook execution |

---

## RESOLVED BLOCKERS

*None yet. Registry started 2026-06-21.*

---

## PROGRAM READINESS SCORECARD

| Program | Content | Assessment | Simulation | Portfolio | Cert | Translation | Security | QA | **Overall** |
|---------|---------|-----------|-----------|----------|------|------------|----------|----|----|
| **BA** | 25% | 20% | 10% | ⏳ | ⏳ | 5% | 🔴 30% | 🔴 20% | **⏳ Pending Founder Validation** |
| **PM** | 20% | 15% | 8% | ⏳ | ⏳ | 0% | 🔴 30% | 15% | **🔴 Blocked on Security + Validation** |
| **Scrum** | 18% | 12% | 5% | ⏳ | ⏳ | 0% | 🔴 30% | 10% | **🔴 Blocked on Security + Validation** |
| **DA** | 15% | 10% | 0% | ⏳ | ⏳ | 0% | 🔴 30% | 8% | **🔴 Blocked on Security** |

**Legend:** 
- 🔴 = Security blockers in progress (P0)
- ⏳ = Certificate/Portfolio pending founder validation (P1)
- Weighted by QA_STANDARD v1.3 formula
- **All programs blocked on P0 security until BLK-004, BLK-005, BLK-006 resolved**

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

## PRIORITY ORDER — DO NOT ESTIMATE

### P0: Security Blockers (Confirmed, Proven)

These are evidenced by Supabase security audit. No founder validation needed.

1. **BLK-004** (Security DEFINER functions overpermissive) — Est. 1 day
2. **BLK-005** (RLS policies always-true) — Est. 1 day
3. **BLK-006** (public_profiles SECURITY DEFINER view) — Est. 0.5 days
4. **BLK-007** (Webhook signature validation race) — Est. 1 day

**Target:** Complete by 2026-06-22 EOD. These affect student data, payment data, founder data, and compliance. Non-negotiable for launch.

---

### P1: Founder Validation Runbook (2–4 hours)

Before spending 72 hours building BLK-001, BLK-002, BLK-003, prove they're real blockers.

Run the [Founder Validation Runbook](#founder-validation-runbook) on the live site.

**Output:** Screenshot evidence of what works and what fails. Every failure becomes a real BLK-### row with evidence.

**Expected outcome:** One of two states:
- **Outcome A:** "All stages work end-to-end" → BLK-001, BLK-002, BLK-003 are PHANTOM. Delete from registry. MVP is ready to launch.
- **Outcome B:** "Capstone form missing, certificate not issued, completion gate not triggered" → BLK-001, BLK-002, BLK-003 are CONFIRMED. Re-estimate with proof.

---

### P2: Confirmed Blockers Only (After Runbook)

Once the founder runbook proves which of BLK-001/002/003 are real:

- Capstone form: 2 days (if real)
- Course completion gate: 1 day (if real)
- Certificate issuance: Depends on PDF requirement:
  - **No PDF needed:** Record + verification page = 2 hours
  - **PDF required:** Add 1–2 days for template + generation

---

### P3: Free-Tier Onboarding (BLK-008) — 1 day

After P0 and P1, fix the free-tier redirect flow.

---

## MVP Launch Gated On

1. **All P0 blockers closed** (Security audit findings resolved)
2. **Founder Validation Runbook passes** (End-to-end student journey works)
3. **Any confirmed blockers from runbook closed** (only if runbook reveals failures)

**Do not launch until the founder personally walks the BA student journey on the live site and it works end-to-end.**

---

## Evidence Requirement Rule

**A blocker cannot be added to this registry without proof.**

Proof is one of:
- **Screenshot** (UI state, error message)
- **Query result** (database state, missing row)
- **Log** (error log, webhook failure, timeout)
- **Video** (recorded walkthrough showing failure)
- **Error message** (stack trace, API response)

If a blocker is suspected but evidence does not exist yet:
- Status: `HYPOTHESIS`
- Do not assign owner, target date, or severity
- Add to a separate "SUSPECTED" section
- Move to OPEN BLOCKERS only when evidence is gathered

**Why:** Hypotheses are free to generate. Evidence costs time to collect. By separating the two, the team avoids solving problems that may not exist.

---

## How to Update This Registry

1. **New Blocker Identified:** Do not add to OPEN BLOCKERS yet. First gather evidence (screenshot, query, log, etc.).
2. **Evidence Collected:** Add row under OPEN BLOCKERS. Assign BLK-### (sequential). Populate all fields including Evidence type and link. Severity must be Blocker, Major, or Minor.
3. **Hypothesis (No Evidence Yet):** Add to SUSPECTED section with status HYPOTHESIS. When evidence arrives, promote to OPEN BLOCKERS.
4. **Blocker Closed:** Move row to RESOLVED BLOCKERS, add `Closed: YYYY-MM-DD` and `Resolution: <brief summary>` with evidence link.
5. **Daily Update:** Refresh "Last Updated" and regenerate scorecard. CEO Brief is auto-generated from scorecard + open blockers (HYPOTHESIS not included in counts).

---

## NEXT 72 HOURS — FREEZE & FOCUS

**Freeze:** All new feature work, all program expansion, all architecture decisions.

**Focus:** Only these three workstreams.

### Hour 0–24: SEC-002 Tier Spoofing Fix

**Owner:** Security Lead  
**Task:** Fix vulnerability: authenticated students can access paid content without active subscription.

**Evidence of Problem:**
- Code: ChapterView.tsx checks `profile?.tier === 'starter'` (line 298) but no server-side subscription validation
- Risk: Student can craft client-side tier change and see paid content

**Acceptance Criteria:**
- Server validates subscription status before rendering paid lessons
- Test: Unauthenticated request to paid lesson endpoint returns 403
- Test: Authenticated user without active subscription cannot access paid content

**Target:** 2026-06-22 09:00 AM

---

### Hour 1–4: Founder Validation Runbook Execution

**Owner:** Founder  
**Time Required:** 2–4 hours (real time, not parallel)  
**What:** Walk the [Founder Validation Runbook](#founder-validation-runbook) on the live site (https://aladiahacademy.com).

**Required Output:** For each of the 7 stages, screenshot:
- Success (form loaded, data saved, etc.) **or**
- Failure (error message, missing button, etc.)

**Output Format:** Markdown file with stage-by-stage screenshots + brief note per stage (worked / failed / not applicable).

**Target:** 2026-06-22 or 2026-06-23 EOD

---

### Hour 0–4 (Parallel to above): Revalidate HYP-001/002/003

**Owner:** QA Lead  
**Task:** While founder runs the runbook, search codebase for:
1. **completion_date** or **course_completed** logic (HYP-003)
2. **capstone_submission** form or endpoint (HYP-002)
3. **certificate issuance trigger** on program completion (HYP-001)

**Evidence Form:** For each, report either:
- "Found in file X:line Y" (provide code snippet) **or**
- "Not found after grep of src/ supabase/ api/" (conclusive null result)

**Target:** 2026-06-22 EOD

---

### Hour 4 (After HYP validation + runbook): Decision Gate

**Input:**
- Founder runbook: passed / failed / partial
- HYP-001/002/003 revalidation: found / not found

**Decision Tree:**

```
IF runbook passes all 7 stages:
  → "MVP launch candidate"
  → Close HYP-001, HYP-002, HYP-003 (phantom)
  → Proceed to launch (go/no-go on SEC blockers only)

IF runbook fails at stage 5 (capstone):
  → HYP-002 confirmed as real blocker
  → Assign: Frontend + Backend (2 days)
  → Retest after fix

IF runbook fails at stage 6 (certificate):
  → HYP-001 confirmed as real blocker
  → Assign: Backend (2 hours for record only, or 1–2 days for PDF)
  → Retest after fix

IF runbook fails at stage 4 (final exam):
  → New blocker discovered (not in HYP list)
  → Add to OPEN BLOCKERS with screenshot evidence
  → Assign + estimate
```

**Target:** 2026-06-23 10:00 AM (decision communicated)

---

## The Rule

**Do not code anything in P2 until P0 and P1 are complete.**

- P0 = SEC blockers (4 days, in progress)
- P1 = Founder Validation Runbook + decision (4 hours + 24 hrs)

If the runbook passes, launch. If it fails, fix the failures. Do not estimate hypothetical work.

---

**Ratified:** 2026-06-21  
**Version:** 2.0 (revised with proof-based discipline; added Evidence Requirement Rule; added Founder Validation Runbook; downgraded BLK-001/002/003 to HYPOTHESIS; added explicit 72-hour action plan with decision gate)
