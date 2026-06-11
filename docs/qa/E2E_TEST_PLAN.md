# Aladiah End-to-End Test Plan v1.0
### Operational Hardening · Phase C (QA + Security governance)

**Owner:** QA + Security Authority · **Approves release:** Security → QA → CEO → Didier
**Rule:** the **Security Gate must be GREEN before E2E begins** (Absolute Rule #8). Run §A first.
**How to use:** execute each row, record Result (PASS/FAIL), Severity on fail (Critical/High/Med/Low), and a note. Any **Critical/High = release blocked.**

---

## Personas
| P | Persona | Account |
|---|---|---|
| P1 | **Founder** | `didiermbok@yahoo.com` (role = founder) |
| P2 | **Student** | any other authenticated user |
| P3 | **Logged-out visitor** | no session |
| P4 | **Unauthorized user** | authenticated student probing founder/admin |

## Environment matrix (run key flows on each)
| Env | Width / target |
|---|---|
| Mobile | 375 · 390 · 430px (iPhone Safari + DevTools) → mobile shell (<768) |
| Tablet | 768–1023px (iPad) → existing layout, unchanged |
| Desktop | ≥1024px → existing layout, unchanged |
| Build | Vercel **preview** first, then production after sign-off |

---

## §A — SECURITY GATE CHECKLIST (must be GREEN to proceed)
| ID | Check | Expected | Result |
|---|---|---|:--:|
| SEC-CHK-01 | Rotate **HeyGen** key | Old key revoked; new key server-only (no `VITE_`) | ☐ |
| SEC-CHK-02 | Rotate **ElevenLabs** key | Old key revoked; voice still works via agent id / signed URL | ☐ |
| SEC-CHK-03 | Flip `KEYS_ROTATED = true` | `/admin/security` Secrets → green; gate → GO | ☐ |
| SEC-CHK-04 | Verify **Supabase RLS** | Anon/student cannot read/write outside own rows (live probe) | ☐ |
| SEC-CHK-05 | Verify **Admin routes** | All `/admin/*` founder-guarded | ☐ |
| SEC-CHK-06 | Verify **Founder routes** | `/founder`, `/founder/control-center` founder-only | ☐ |
| SEC-CHK-07 | Verify **Payment routes/records** | No client read of payment/subscription rows beyond own | ☐ |
| SEC-CHK-08 | Verify **Student isolation** | Student cannot read another student's data | ☐ |
| SEC-CHK-09 | `.env` removed from `main` + (if public) history purge | No secrets in repo going forward | ☐ |

> **Gate:** all §A green → proceed to §B. Otherwise STOP.

---

## §B — AUTH & ACCESS CONTROL
| ID | Persona | Scenario | Steps | Expected | Result | Sev |
|---|---|---|---|---|:--:|:--:|
| E2E-01 | P3 | **New student signup** | `/auth` → register (name/email/pwd), Starter (free) | Confirmation-email screen; `auth.users` + `profiles` row (tier=starter) | ☐ | |
| E2E-02 | P2 | **Student login** | `/auth` → sign in | Lands on `/portal`; mobile shows mobile Home | ☐ | |
| E2E-03 | P1 | **Founder login** | `/auth` → sign in as founder | Redirects to **`/founder`** (CEO Command Center) | ☐ | |
| E2E-04 | P4 | **Student → founder routes** | While student, open `/founder`, `/founder/control-center` | Redirect to `/portal` (never 404) | ☐ | Crit |
| E2E-05 | P4 | **Student → admin routes** | Open `/admin`, `/admin/security`, `/admin/command-center`, `/admin/approvals` | All redirect to `/portal` | ☐ | Crit |
| E2E-06 | P1 | **Founder → all founder routes** | Visit every `/founder/*` + `/admin/*` | All load (founder) | ☐ | |
| E2E-07 | P3 | **Logged-out → protected** | Open `/portal`, `/portal/courses`, `/admin/security` | Redirect to `/auth` (no content flash) | ☐ | High |
| E2E-08 | P2 | **Logout** | Portal → "Done for the Day" / logout | Session cleared; lands on `/auth`; back-nav doesn't restore | ☐ | |
| E2E-09 | P2 | **Password reset** | `/auth` → reset flow → email link | Reset completes; new password logs in | ☐ | High |

---

## §B2 — FOUNDER MASTER ACCESS (didiermbok@yahoo.com — zero restrictions)
| ID | Persona | Scenario | Expected | Result | Sev |
|---|---|---|---|:--:|:--:|
| FND-01 | P1 | Founder opens **`/portal`** | Loads directly — **no creed gate, no course-selection gate** | ☐ | High |
| FND-02 | P1 | Founder Home → **"Enter Student Portal"** button | Navigates to `/portal` | ☐ | Med |
| FND-03 | P1 | Founder opens **any course → any module** | No Starter paywall / module lock — full content | ☐ | High |
| FND-04 | P1 | Founder still reaches **all founder/admin** surfaces | `/founder`, `/admin/*` all load | ☐ | High |
| FND-05 | P1 | Case-insensitivity | `Didiermbok@…` (capital D) resolves as founder | ☐ | Med |

---

## §C — LEARNING JOURNEY
| ID | Persona | Scenario | Expected | Result | Sev |
|---|---|---|---|:--:|:--:|
| E2E-10 | P2 | **Course enrollment / selection** | Starter prompted to pick free program (CourseSelectionGate); choice saved to `profiles.free_course_id` | ☐ | High |
| E2E-11 | P2 | **Course progress** | `/portal/course/:id` shows modules; completed modules ✓, current ▶, later 🔒 (mobile) | ☐ | |
| E2E-12 | P2 | **Lesson completion** | Lesson player: video/reading/AI mentor; **Continue** advances lesson → quiz | ☐ | |
| E2E-13 | P2 | **Quiz PASS** | Score ≥ pass → paid: next module unlocks; free: Module-1 complete → paywall | ☐ | High |
| E2E-14 | P2 | **Quiz FAIL** | Below pass → no unlock; retry offered; no progress recorded | ☐ | High |
| E2E-15 | P2 | **Simulation access/complete** | `/portal/simulations` → launch SimEngine → complete → XP recorded | ☐ | |
| E2E-16 | P2 | **AI Mentor path** | Lesson "Ask Prof. Didier" / `/portal/mentor` → voice session connects (mic) | ☐ | High |
| E2E-17 | P2 | **Talent Score update** | Activity reflects on `/portal/talent-score` | ☐ | |
| E2E-18 | P2 | **Certification unlock** | `/portal/certifications` shows readiness; cert gated by completion logic (Rule #6) | ☐ | High |
| E2E-19 | P2 | **Portfolio path** | `/portal/portfolio` artifacts accessible | ☐ | |
| E2E-20 | P2 | **Placement path** | `/portal/my-career-path` placement readiness visible | ☐ | |

---

## §D — STRIPE / PAYMENTS (TEST MODE FIRST — do not charge live yet)
Pre: Stripe in **test mode**; price IDs (`VITE_STRIPE_PRICE_*`) point to test products; webhook configured to test endpoint.

| ID | Scenario | Card | Expected | Result | Sev |
|---|---|---|---|:--:|:--:|
| PAY-01 | **Env mode check** | — | App uses test keys; no live key in client | ☐ | Crit |
| PAY-02 | **Paid signup → checkout** | `4242 4242 4242 4242` | `/api/create-checkout` → Stripe → success redirect (`?payment=success`) | ☐ | High |
| PAY-03 | **Access unlock after payment** | success | Webhook → `profiles.tier = accelerator`; all modules unlock | ☐ | Crit |
| PAY-04 | **Receipt / confirmation email** | success | Email sent; Supabase user updated | ☐ | Med |
| PAY-05 | **Declined payment** | `4000 0000 0000 0002` | Declined; user stays on paywall; no tier change | ☐ | High |
| PAY-06 | **Expired card** | `4000 0000 0000 0069` | Expired error; graceful failure redirect | ☐ | Med |
| PAY-07 | **Failed payment follow-up** | declined | No access granted; retry path works | ☐ | High |
| PAY-08 | **Upgrade** (Starter → All-Access) | success | Tier upgraded; access expands; proration correct | ☐ | High |
| PAY-09 | **Downgrade** | — | Tier reduced at period end; access adjusts | ☐ | Med |
| PAY-10 | **Cancel subscription** | — | Cancels at period end; access until expiry; `profiles` updated | ☐ | High |
| PAY-11 | **Renewal logic** | clock advance | Renews; access persists; invoice issued | ☐ | Med |
| PAY-12 | **Refund** | refund in Stripe | Access revoked per policy; record updated | ☐ | High |
| PAY-13 | **Webhook integrity** | — | Signature verified (`whsec_`); replayed/forged events rejected | ☐ | Crit |
| **GO-LIVE** | After PAY-01..13 pass in test → switch to **live**, run one real card (PAY-02/03/12) | live | Verify then refund | ☐ | |

---

## §E — RESPONSIVE (run E2E-02, 11, 12, 15 on each)
| ID | Env | Expected | Result | Sev |
|---|---|---|---|:--:|:--:|
| RSP-01 | Mobile 375/390/430 | Bottom nav (🏠📚🎮🤖👤); single column; no horizontal scroll; no content behind nav; sticky Continue works | ☐ | High |
| RSP-02 | Tablet 768–1023 | Existing layout unchanged (no mobile shell) | ☐ | Med |
| RSP-03 | Desktop ≥1024 | Existing layout unchanged | ☐ | Med |

---

## Pass/Fail roll-up & Go/No-Go
| Gate | Criterion |
|---|---|
| Security | §A all green · 0 critical findings |
| Access | E2E-04, E2E-05, PAY-01, PAY-13 = PASS (zero student→admin, zero live-key/forged-webhook) |
| Payments | PAY-01..13 PASS in **test mode** before any live charge |
| Learning | E2E-13/14/18 PASS (quiz + certification logic correct) |
| Responsive | RSP-01 PASS at all 3 phone widths |
| **Verdict** | **GO** only if 0 Critical + 0 High open; else **NO-GO** |

---
*Phase C deliverable. Scenarios consolidate the mission's Phase-6 list + the 17-scenario + Stripe set. Automation candidates (Playwright E2E + RLS probe + `bun audit` in CI) tracked for the QA + Security Authority.*
