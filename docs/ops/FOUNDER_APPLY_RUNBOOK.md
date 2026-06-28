# Founder Apply Runbook — Security + Branding + Scrum Flagship Replacement

**Audience:** Founder (approve) + engineer (execute). **Basis:** audit commit `294a9de`.
**Rule:** nothing is "done" until **Spec = Authored = Live** and QA-verified. SQL is **applied by hand** in Supabase — never auto-applied. No public claim may remain unless backed by live data.

## Current honest state
- **Security (PR #25):** code merged to `main`; **3 migrations NOT applied** → production `profiles` still world-readable, seed functions open, email relay open **right now**.
- **Branding (PR #26):** open, CI green; **not merged/deployed** → production still shows the old logo.
- **Scrum flagship:** **not in production.** 18-module flagship = 3 unapplied migrations + code spec; live DB still serves the old 4-module `seed-scrum-course`.
- **Claims:** public/spec copy over-claims (162 lessons, 1,080-question bank, 54 sims) vs authored (72 lessons, 100 questions, sims code-only).

---

## ⚠️ Apply order (do NOT reorder)

```
0. Pre-flight + backup
1. FREEZE & FIX CLAIMS        (code/docs + the flagship migration description)  ← gates step 4
2. SECURITY migrations        (3, PR #25)        ← do before more content goes live
3. BRANDING merge + visual QA (PR #26)
4. SCRUM FLAGSHIP migrations  (3, in order)      ← only after step 1
5. DEPRECATE old seed-scrum-course
6. POST-APPLY QA
7. SIGN-OFF report
```
Why this order: security must be correct before more content/exposure; claims must be corrected **before** the flagship migration writes its (currently false) description live.

---

## 0. Pre-flight + backup  *(engineer; founder approves go)*
- [ ] **Backup Supabase**: dashboard → Database → Backups → confirm a recent automated backup exists, or take a manual snapshot. Record the timestamp/restore point.
- [ ] Note current `main` commit and the deployed Vercel build (rollback targets).
- [ ] Confirm you can run SQL as the project owner (migrations use `auth.users`, RLS, triggers).
- [ ] Identify the founder account's `auth.users.id` (needed to verify admin in step 2).

---

## 1. Freeze & fix public claims  *(FOUNDER APPROVAL on wording, then engineer)*
**Trust gate.** Remove/soften every claim not backed by live data. Approve the replacement wording, then apply these exact edits **before** step 4.

| Claim | File:line (evidence) | Action |
|---|---|---|
| "1,080-question bank" + "54 simulations…" in **live course description** | `supabase/migrations/20260619000000_flagship_scrum_18_modules.sql:16` | **Edit the migration `description=`** to the approved wording **before applying** (else it goes live). |
| "1,080 total" question bank | `docs/programs/AI_SCRUM_MASTER_FULL_CURRICULUM.md:14`, `docs/curriculum/scrum-master-v3/00_PRODUCTION_SPEC.md:47`, `CERTIFICATION.md:25` | Mark as **target/roadmap**, not current. |
| "162 lessons" | `00_PRODUCTION_SPEC.md:47`, `CERTIFICATION.md:6`, `docs/curriculum/LAUNCH_READINESS_REPORT.md:35,39`, code comments `questionReview.ts:45`, `flagshipBuilder.ts:4` | Mark as target; current authored = **72**. |
| "200-question final exam" | `00_PRODUCTION_SPEC.md:18`, `CERTIFICATION.md:2,8` | Mark as target; capstone currently has **40**. |
| "54 simulations / 18 labs / 18 portfolios" as if live | `aiScrumMasterFull.ts:7`, `src/pages/portal/FlagshipProgram.tsx:7` | These are **code-only**; do not present as student-available until on the DB path. |

**Founder-approved interim wording (proposed):**
> "The Scrum flagship is being upgraded into an 18-module AI-powered career program with certification-style assessment, capstone readiness, simulations, labs, and portfolio work. Full certification bank and multilingual content are being expanded through the launch readiness process."

- [ ] Founder approves wording → engineer applies edits → commit → (re)deploy. **Verify:** no live surface shows 162 lessons / 1,080-question bank / 200-q exam.

---

## 2. Security migrations (PR #25)  *(engineer; founder approves go-live)*
Apply **in order** (each file has verification `SELECT`s at its bottom):
1. `supabase/migrations/20260619030000_profiles_pii_rls_lockdown.sql`
2. `supabase/migrations/20260619040000_email_send_log.sql`
3. `supabase/migrations/20260619050000_founder_admin_alignment.sql`

**What happens:** `profiles` becomes owner/admin-only; referral pages use the safe RPC; `public_profiles` view powers community names; email rate-limit table created; founder backfilled to `admin`.

**Verify (must all pass):**
- [ ] `SELECT policyname,qual FROM pg_policies WHERE tablename='profiles';` → owner + admin only; **no** "Public can view…".
- [ ] Sign in as **founder** → `SELECT public.aos_is_admin();` → `true`; founder portal loads.
- [ ] Sign in as a **student** → cannot read other profiles; **community/feedback author names still render** (via `public_profiles`).
- [ ] Referral page `/refer/<code>` still loads (uses `get_referral_profile`).
- [ ] Existing content still loads (no broken auth).

**Rollback:** RLS changes are reversible — re-grant the prior policy from backup, or restore the snapshot. (Founder-admin backfill is additive/idempotent.)

---

## 3. Branding (PR #26)  *(FOUNDER APPROVAL: final logo appearance)*
- [ ] Merge PR #26 → Vercel deploys.
- [ ] **Visual QA** the official logo on: header · mobile nav · login · signup · founder portal · student portal · footer · favicon/browser tab · OG/social image · **hero watermark**.
- [ ] Confirm no old shield/heart anywhere; hero shows the blue/gold emblem watermark (no DR flag).
- [ ] Founder approves final logo appearance.

**Rollback:** revert the merge commit; Vercel redeploys previous build.

---

## 4. Scrum flagship migrations  *(engineer; only AFTER step 1)*
**Prereq check:** `is_flagship` column exists (`20260611020000_flagship_course_flag.sql`) and `20260612000000_flagship_v3_assets.sql` applied — apply first if not.
Apply **in order**:
1. `20260619000000_flagship_scrum_18_modules.sql`  *(replaces 4 chapters → 18 modules; ensure description already fixed in step 1)*
2. `20260619010000_flagship_scrum_lessons_quizzes.sql`  *(72 lessons + module quiz containers)*
3. `20260619020000_flagship_scrum_questions_mapped.sql`  *(100 authored questions across 7 modules)*

**Verify:**
- [ ] `SELECT order_index,title FROM chapters WHERE course_id=(SELECT id FROM courses WHERE is_flagship) ORDER BY 1;` → **18 rows**.
- [ ] Lessons present (~72); capstone (M18) quiz present.
- [ ] Student path renders the **new** 18-module course (not the old 4-module one).
- [ ] Progression logic (lock/unlock, passing score) works on the new modules.
- [ ] **No duplicate Scrum course** shown to students.

**Rollback:** restore snapshot from step 0 (these migrations replace chapter structure — a snapshot restore is the clean revert).

---

## 5. Deprecate old `seed-scrum-course`  *(engineer)*
- [ ] Confirm `100/102` authored questions are mapped into the flagship; **recover the 2 unparsed** before deleting anything.
- [ ] Mark `supabase/functions/seed-scrum-course/index.ts` obsolete (disable invocation / remove from any admin "seed" UI) — **do not delete** until the 2 questions are recovered + verified.
- [ ] Verify the old course is not selectable/visible to students.

---

## 6. Post-apply QA checklist  *(QA Cell — veto power)*
- [ ] Founder vs student access correct (admin tools hidden from students).
- [ ] Payment unaffected (separate test before going live with payments).
- [ ] New flagship: 18 modules / ~72 lessons / capstone reachable; one course, no duplicate.
- [ ] Public surfaces show only **live-backed** claims (step 1 holds).
- [ ] Logo correct everywhere (step 3 holds).
- [ ] Security verifications (step 2) still green.
- [ ] Browser/device pass: Chrome + Safari + mobile.

---

## 7. Founder sign-off report  *(produce after QA)*
One page: each step ✅/❌ with the verification evidence (query results / screenshots), the corrected claims, and the resulting **Program Integrity Score** (Spec↔Authored↔Live match) for Scrum.

---

## Founder approval points (explicit)
1. Interim claim wording (step 1).
2. Security go-live (step 2).
3. Final logo appearance (step 3).
4. Replace the live Scrum course with the flagship (step 4).
5. Deprecate `seed-scrum-course` (step 5).

## Risks
- **R1 — Claim ships false (HIGH):** applying step 4 before step 1 publishes "1,080-question bank" to the live course. *Mitigation: step 1 gates step 4.*
- **R2 — Founder lockout (MED):** if `20260619050000` isn't applied, the new RLS denies the founder admin surfaces. *Mitigation: apply all 3 security migrations together; verify `aos_is_admin()`.*
- **R3 — Structure replace (MED):** flagship migrations rewrite chapter structure; in-progress student data on old chapters may not map. *Mitigation: pre-apply backup; low live-student volume now.*
- **R4 — Duplicate course (LOW):** old seed not deprecated → two Scrum courses. *Mitigation: step 5.*

## Expected final state after apply
- Production secured (profiles/seed/email locked); founder retains admin.
- Official logo everywhere; global hero (no DR flag).
- Live Scrum = **18-module flagship** (72 lessons, capstone cert), single course, no false claims.

## Remaining work AFTER this runbook (not launch-gating the core path, but tracked)
1. Generate **~260** module-exam questions (→20/module) + explanations + competency tags.
2. Move **54 sims / 18 labs / 18 portfolios / interview prep** from CODE → DB (student path) + translate.
3. Populate **translations** (courses/chapters/videos; extend `translate-content` to `quiz_questions`); QA 8 languages end-to-end.
4. Recover the 2 unparsed old questions; then delete `seed-scrum-course`.
5. **Then** audit PM / Business Analyst / Cybersecurity with the same Spec-vs-Authored-vs-Live template.
6. Apply the security `email_send_log` retention + verify rate limiting under load.
