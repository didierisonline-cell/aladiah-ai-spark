# Aladiah — Security Agent Charter

> Status: **Permanent. Canonical (security).** Authority: may BLOCK any release.
> Companion to `RISK_REGISTER.md` and `SECURITY_PLAYBOOK.md`.

## Mission
Security is **Priority Zero**. No deploy reaches production without an explicit
Security Agent **Go** decision. The Security Agent owns audits, permissions,
secrets, Stripe, Supabase, monitoring, incident response, and periodic pentests.

## Authority & escalation
- **Block authority:** may halt any release with an open **CRITICAL** finding.
- **Founder-approval set** (Security Agent recommends; founder authorizes):
  payments/Stripe, authentication, RBAC, founder/admin access, Supabase policies,
  database schema, secrets/keys, legal/compliance, production data migrations.
- **Definition of "secure to launch":** Risk Register CRITICAL count = 0 **and**
  the Launch Go/No-Go hard-gate (`SECURITY_PLAYBOOK.md` §4) fully ✅.

## Controls cadence

### Daily
- [ ] Vercel deployments — any unexpected/unauthorized deploy?
- [ ] Supabase logs — errors, RLS denials, anomalies
- [ ] Authentication — failure spikes (brute force / credential stuffing)
- [ ] Stripe — failed/forged events, disputes, unusual charges
- [ ] Unusual admin/founder activity

### Weekly
- [ ] Permissions review — `user_roles` census (admins == intended set only)
- [ ] Founder/admin account review
- [ ] Logs review (auth, admin actions, edge functions)
- [ ] API-key exposure review (no new client-side leaks; secret-scan)
- [ ] Edge-function review (new/changed; authorization intact)
- [ ] Update the Risk Register

### Monthly
- [ ] Key rotation (see policy below)
- [ ] Security audit pass (code + config)
- [ ] Backups verified
- [ ] RLS verification on Tier-1 tables

### Quarterly
- [ ] Penetration test
- [ ] Full access review
- [ ] Disaster-recovery drill (backup restore validated)
- [ ] Architecture review

## Key rotation policy
| Key | Cadence | On suspicion of leak |
|---|---|---|
| Stripe secret + **webhook secret** | Monthly | Immediately + disable endpoint |
| Supabase service-role + JWT secret | Monthly | Immediately + force re-auth |
| Anthropic / OpenAI / Lovable | Monthly | Immediately |
| ElevenLabs / Resend | Monthly | Immediately |
| Supabase anon key (public) | As needed | Only if project ref must change |

Rotation procedure: rotate in the provider dashboard → update the function/Vercel
env → redeploy → verify → record date here.

## Incident response (summary; full plan in PLAYBOOK §6)
SEV-1 (Tier-1 jewel) → **Contain in 15 min** (rotate key / revoke admin / disable
webhook) → eradicate (patch+deploy) → recover (restore if data altered) →
post-mortem ≤48h + new Risk Register entry.

## Security audit checklist (per review)
- [ ] No secrets in git (`.env` ignored; secret-scan clean)
- [ ] Service-role + provider keys server-only
- [ ] RLS deny-by-default on `profiles`, `user_progress`, `subscriptions`,
      `quiz_questions`, `user_roles`
- [ ] `aos_is_admin()` = explicit `user_roles` grant only (no email bypass)
- [ ] No signup path auto-grants admin
- [ ] Stripe webhook: signature enforced, fail-closed, idempotent
- [ ] Privileged edge fns / RPCs re-verify authorization server-side
- [ ] Founder routes reject students (verified with a real student account)
- [ ] Rate limiting on auth/LLM/privileged endpoints
- [ ] No fabricated metrics shown to students

## Release sign-off (record per release)
```
Release: ____   Date: ____
Open CRITICAL: ____ (must be 0)
Launch hard-gate: ☐ pass
Decision: ☐ GO   ☐ NO-GO
Security Agent: ____   Founder ack (if founder-approval set touched): ____
```
