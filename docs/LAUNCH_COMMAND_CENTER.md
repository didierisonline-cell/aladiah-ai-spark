# Aladiah — Launch Command Center

> **The single executive launch dashboard.** One command center only. This is not
> a standards document (those live in `/docs/standards`); it is the live launch
> control surface. Inputs feed it; it does not fork them:
> curriculum → `docs/curriculum/LAUNCH_READINESS_REPORT.md` (+ `/admin/curriculum-excellence`),
> security detail → `docs/security/`, language → `docs/language-adaptation/` (parked).

**As of:** 2026-06-22 · **Owner:** Founder + CEO Chief of Staff · **Gate order:** Security → QA → CEO

---

## 1. Executive readiness scorecard

| Workstream | Readiness | Trend | Notes |
|---|:--:|:--:|---|
| Product — BA Program | ~90% | ↑ | Authoring in progress (Track 4) |
| Translation (EN/FR/ES) | **100%** | ✅ | Launch languages complete (founder-verified) |
| Marketing Infrastructure | 85% | ↑ | Production in progress (Track 3) |
| Brand Governance | 95% | ✅ | Trademarks/cognates accounted for |
| Founder Governance | 95% | ✅ | Canonical set live; pending validation |
| Security | 75–80% | ↑ | Now concentrated in payments/webhooks + ops hardening |

**Headline:** Foundations are green; the critical path to public enrollment is the
**Security** closure (Track 2), with Product, Marketing, and PM authoring in parallel.

---

## 2. Closed workstreams

### 🟢 Translation — EN / FR / ES (CLOSED for launch)
- Founder-verified: **`missing = 0`** for the three launch languages; FR and ES fully translated.
- Residual scanner counts are **protected trademarks and valid cognates — not gaps**:
  `Talent Score™`, `All-Access Pass™`, `Kanban`, `SAFe`, `Certifications`, `Portfolio`, `Architecture`.
- **No action required before launch.** (Broader multi-language platform adaptation
  remains a parked, post-launch initiative — `docs/language-adaptation/`, PR #13.)

### 🟢 Founder Identity Governance (CLOSED — pending validation)
- **Canonical (permanent) founders:** `didier@aladiahacademy.com`, `didierisonline@gmail.com`.
- **Transitional founder:** `didiermbok@yahoo.com` — temporary, via a revocable
  `user_roles` admin row (no code change to revoke).
- **Model:** permanent = hard-coded canonical; temporary = `user_roles` table.
  This is the correct long-term architecture.
- Implemented: `supabase/migrations/20260616020000_founder_identity_alignment.sql`,
  `_shared/auth.ts`, `admin-analytics`. **Pending:** apply migration + deploy + validate.

---

## 3. Security workstream (Track 2 — critical path)

### Closed (code complete in `claude/security-hardening`)
| Ref | Item | Evidence |
|---|---|---|
| #1 | Seed/Admin guard on ~44 `seed-*` functions | `_shared/auth.ts` + per-fn `requireAdmin` |
| #3 | Profiles PII lockdown + safe referral RPC | `20260616010000_lock_down_profiles_rls.sql` |
| #4 | Payment integrity (webhook signature + tier-by-price) | `handle-payment-webhook` |
| #5 | Founder identity alignment | `20260616020000_founder_identity_alignment.sql` |
| #8 | Email-abuse lock (`send-email`, `send-welcome-email`) | `requireServiceOrAdmin` |

### Open / pending — prioritize before public enrollment
| Ref | Item | Status | Owner | Action |
|---|---|---|---|---|
| **SEC-001** | Stripe webhook signature validation | 🟡 Code complete — pending deploy/validation | Eng | Set `STRIPE_WEBHOOK_SECRET`; deploy `handle-payment-webhook`; send a live test event |
| **SEC-002** | Tier-spoofing protection | 🟡 Code complete — pending deploy/validation | Eng | Set `STRIPE_PRICE_T1/T2/T3[/ANNUAL]`; verify tier derives from purchased price |
| **SEC-003** | Cron secret protection | 🔴 Open | Eng | Add a shared cron secret to `send-study-reminders`, `send-weekly-report`, `send-assignment-reminder` (cron-compatible, not an admin JWT) |
| **SEC-004** | Transactional email security rewire | 🔴 Open | Eng | Re-wire `Auth.tsx` / `ChapterView.tsx` welcome/confirmation emails through a secure server-side trigger (current client path is unauthenticated and already blocked) |
| **SEC-005** | Key rotation — `ELEVENLABS_API_KEY`, `HEYGEN_API_KEY` | 🔴 Open | Founder | Rotate in provider dashboards (exposed in git history); store server-only; confirm no `VITE_` prefix |

> Deploy prerequisites for the closed security commits are tracked in `docs/security/`.
> SEC-001/SEC-002 are *code complete* — they only become *effective* once the Stripe
> secrets are set and the functions deployed.

### Lower-priority hardening (post-launch acceptable)
- `referral_tracking` / `course_waitlist` open `INSERT` (spam vector) — add light rate/auth.
- Committed `dist/` bundle — remove from VCS + gitignore (housekeeping).

---

## 4. Active execution — four parallel tracks

| Track | Focus | Owner |
|---|---|---|
| **Track 1** | Launch validation walkthrough | Founder |
| **Track 2** | Security closure (SEC-001 → SEC-005) | Engineering |
| **Track 3** | Marketing production | Content + Design + Video |
| **Track 4** | PM Program authoring | Curriculum team |

Everything else is secondary until these four are moving simultaneously.

---

## 5. Launch gate

Public enrollment opens when: **Track 2 SEC-001…SEC-005 closed/validated**, BA & PM
programs ≥ World Class (≥90%, per `LAUNCH_READINESS_REPORT.md`), and the founder
completes the Track 1 validation walkthrough. Gate order remains **Security → QA → CEO**.
