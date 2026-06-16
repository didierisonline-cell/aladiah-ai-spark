# Aladiah — Security Maturity Roadmap

> Status: **Canonical (security).** Owner: Security Agent. Companion to
> `RISK_REGISTER.md`, `SECURITY_PLAYBOOK.md`, `SECURITY_AGENT_CHARTER.md`,
> `FOUNDER_EXECUTION_RUNBOOK.md`.
> Purpose: sequence ALL security work from startup → global platform.
> Effort scale: **S** ≤1 day · **M** ~2–4 days · **L** ~1–2 weeks · **XL** > 2 weeks.
> Owners: **F** Founder (console/approval) · **SA** Security Agent · **E** Engineering · **3P** third-party.
> Launch impact: **BLOCKER** · **Launch-week** · **0–6 mo** · **6–18 mo**.

---

## How to read this
- **Phase 0** must be GREEN before a single paying student. **Phases 1–3 are
  additive maturity** — each makes Aladiah safer at the next scale.
- Domain coverage is cumulative: a domain "started" in Phase 0 keeps maturing in
  later phases (see the coverage matrix at the end).

---

## PHASE 0 — CRITICAL SECURITY *(must complete before launch)*
**Objective:** eliminate any path that lets an attacker steal revenue, take over an
account, or read/alter another user's data. Close every CRITICAL.
**Launch impact:** **BLOCKER.** Nothing ships until Phase 0 = ✅.

| # | Control | Risks mitigated | Priority | Effort | Owner | Status |
|---|---|---|---|---|---|---|
| 0.1 | **Stripe webhook hardening** (signature fail-closed, idempotency, replay) — SEC-C1 | Payment forgery, free-tier unlock, forced cancel | P0 | S (code done) | F deploy + SA | ◐ code-complete (PR #14) — apply+verify |
| 0.2 | **Founder-admin = explicit grant only** (remove JWT-email bypass + signup auto-grant) — SEC-C2 | Founder/admin takeover via unclaimed email | P0 | S (code done) | F apply + SA | ◐ code-complete (PR #14) — apply+verify |
| 0.3 | **Email confirmation ON** | Account spoofing, C2 backstop | P0 | S | F | ☐ verify console |
| 0.4 | **Secrets verification** (no secrets in git ✓; service-role server-only ✓; prod env set) | Secret exposure | P0 | S | F + SA | ✅ git clean; ☐ confirm prod env |
| 0.5 | **RLS deny-by-default** on `profiles`, `user_progress`, `subscriptions`, `quiz_questions`, `user_roles` | Cross-user data read/write | P0 | S–M | SA verify, F apply | ☐ verify |
| 0.6 | **Backups / PITR confirmed** | Data loss / ransomware recovery | P0 | S | F | ☐ verify console |
| 0.7 | **Incident Response Plan v1** | Slow/ad-hoc breach response | P0 | S | SA | ✅ (Playbook §6) |
| 0.8 | **Go/No-Go gate enforced** | Shipping with open criticals | P0 | S | SA | ✅ defined |

**Exit criterion:** Risk Register CRITICAL count = 0 AND Launch hard-gate ✅ → **GREEN**.

---

## PHASE 1 — PRODUCTION SECURITY *(launch-week → first month)*
**Objective:** harden the surfaces a real attacker probes first once you're public —
privileged endpoints, abuse/rate limits, monitoring, and supply chain.
**Launch impact:** **Launch-week** (start immediately after Phase 0).

| # | Control | Risks mitigated | Priority | Effort | Owner |
|---|---|---|---|---|---|
| 1.1 | **Founder-JWT gate on all seed/admin edge functions** (SEC-H1) + restrict their CORS to known origins (SEC-M2) | Anon-reachable destructive writes, data churn, cost | P1 | M | E + SA |
| 1.2 | **Server-side entitlement** (single `subscriptions` source + RLS on premium content; wire/remove `requireSubscription`) — SEC-H4 | Access without payment / wrong tier | P1 | M | E + F |
| 1.3 | **Rate limiting** on auth, LLM, and privileged endpoints (SEC-H5) | Credential stuffing, signup bombing, LLM cost abuse | P1 | M | E |
| 1.4 | **Remove dead `api/auth-signup.js`** (SEC-H2) | Unauth account-creation vector | P1 | S | E |
| 1.5 | **Server-side authz audit** of every privileged RPC/edge fn (re-check `aos_is_admin()`) — SEC-H3 | Privilege escalation via trusted-client assumptions | P1 | M | SA |
| 1.6 | **Audit logging coverage** (role grants, content publish, approvals, payments) | Undetected abuse, no forensics | P1 | M | E + SA |
| 1.7 | **Monitoring + alerting v1** (failed-login spikes, Stripe failures, unusual admin activity → email/Slack) | Slow detection | P1 | M | SA |
| 1.8 | **Dependency + secret scanning in CI** (Dependabot/GH secret scan) | Vulnerable deps, accidental secret commits | P1 | S | E |
| 1.9 | **Key rotation operationalized** (monthly cadence live) | Long-lived key compromise | P1 | S | F + SA |
| 1.10 | **DR restore test #1** (prove backups restore) | Unrecoverable data loss | P1 | S | F |
| 1.11 | **Prompt-injection baseline** on AI mentor/LLM fns (system-prompt isolation, no secret/tool exposure, output bounds) | AI manipulation, data exfil via prompts | P1 | M | E + SA |

---

## PHASE 2 — GROWTH SECURITY *(month 2 → 6, as traffic scales)*
**Objective:** defend against volume attacks, formalize detection, protect data &
privacy across regions, and mature AI safety.
**Launch impact:** **0–6 mo.**

| # | Control | Risks mitigated | Priority | Effort | Owner |
|---|---|---|---|---|---|
| 2.1 | **WAF + DDoS protection** (Cloudflare/Vercel in front) | L7 DDoS, scraping, common web attacks | P2 | M | E |
| 2.2 | **Bot/abuse defense** (CAPTCHA on signup/forgot, anomaly throttling) | Fake-account farms, brute force | P2 | M | E |
| 2.3 | **MFA for founder/admin accounts** | Founder account takeover (Tier-1 jewel) | P2 | S–M | F |
| 2.4 | **Centralized logging + SIEM-lite** (log aggregation, retention, search) | Blind spots, slow IR | P2 | L | SA + E |
| 2.5 | **Threat detection rules** (impossible-travel, admin-role changes, mass-export) | Active-attack detection | P2 | M | SA |
| 2.6 | **Vulnerability management program** (scheduled scans, triage SLAs, patch policy) | Unpatched known CVEs | P2 | M | SA |
| 2.7 | **Data protection** (encryption-at-rest confirmed, field-level for sensitive PII, retention/deletion policy) | Data breach blast-radius | P2 | M | E + SA |
| 2.8 | **Privacy program** (privacy policy, consent, DSAR/export/delete flow, PII inventory, GDPR baseline) | Regulatory + trust risk | P2 | L | F + 3P (legal) |
| 2.9 | **AI security maturation** (prompt-injection hardening, output filtering/moderation, jailbreak test suite, per-user LLM cost caps, provider governance) | AI abuse, harmful output, cost runaway | P2 | L | E + SA |
| 2.10 | **External penetration test #1** | Unknown-unknown vulns | P2 | M (3P) | 3P + SA |
| 2.11 | **Secrets manager** (move env secrets to a managed vault if footprint grows) | Sprawl, rotation friction | P2 | M | E |

---

## PHASE 3 — ENTERPRISE SECURITY *(6 → 18 mo, global platform / B2B)*
**Objective:** meet enterprise/employer buyer and regulator bars; continuous,
audited, multi-region assurance.
**Launch impact:** **6–18 mo** (unlocks enterprise/employer deals & regulated markets).

| # | Control | Risks mitigated | Priority | Effort | Owner |
|---|---|---|---|---|---|
| 3.1 | **Compliance certification** (SOC 2 Type II and/or ISO 27001) | Loss of enterprise/employer trust & deals | P3 | XL (3P) | F + SA + 3P |
| 3.2 | **Full SIEM + managed detection/response (SOC/MDR)** | Sophisticated, persistent attackers | P3 | XL | SA + 3P |
| 3.3 | **IR retainer + tabletop exercises** (quarterly) | Untested response under real pressure | P3 | L | SA + 3P |
| 3.4 | **Advanced threat detection** (IDS/IPS, behavioral/ML anomaly) | Targeted intrusion | P3 | L | E + 3P |
| 3.5 | **Enterprise IAM** (SSO/SAML, SCIM, org RBAC, zero-trust) | Org-account sprawl, lateral movement | P3 | XL | E |
| 3.6 | **Data residency + DPAs + sub-processor mgmt** (Cameroon/DR/EU/US) | Cross-border compliance | P3 | L | F + 3P |
| 3.7 | **Bug bounty program** | Crowd-sourced vuln discovery | P3 | M | SA |
| 3.8 | **Recurring pentest + red team** (≥ annual) | Drift back into vulnerability | P3 | L (3P) | 3P |
| 3.9 | **Business continuity / multi-region DR** | Regional outage, sustained downtime | P3 | XL | E |
| 3.10 | **Vendor risk management** (Stripe/Supabase/LLM/voice provider reviews) | Supply-chain/sub-processor risk | P3 | M | SA |
| 3.11 | **Education/data compliance** (FERPA-style, regional student-data law) | Regulatory penalties in EdTech | P3 | L | F + 3P |

---

## Domain coverage matrix (where each of the 22 domains is addressed)

| Domain | P0 | P1 | P2 | P3 |
|---|:--:|:--:|:--:|:--:|
| Authentication | 0.3 | — | 2.2 | 3.5 |
| Authorization | 0.2 | 1.5 | — | 3.5 |
| RBAC | 0.2 | 1.1 | 2.5 | 3.5 |
| RLS | 0.5 | 1.2 | 2.7 | — |
| Secrets management | 0.4 | 1.9 | 2.11 | — |
| Stripe security | 0.1 | 1.2 | — | 3.10 |
| API security | — | 1.1/1.4 | 2.1 | 3.5 |
| Rate limiting | — | 1.3 | 2.2 | — |
| Audit logging | — | 1.6 | 2.4 | 3.2 |
| Backups | 0.6 | — | — | 3.9 |
| Disaster recovery | 0.6 | 1.10 | — | 3.9 |
| Monitoring | — | 1.7 | 2.4 | 3.2 |
| Threat detection | — | 1.7 | 2.5 | 3.4 |
| Incident response | 0.7 | — | — | 3.3 |
| Vulnerability mgmt | — | 1.8 | 2.6 | 3.8 |
| Dependency scanning | — | 1.8 | — | 3.10 |
| Penetration testing | — | — | 2.10 | 3.8 |
| Data protection | 0.5 | — | 2.7 | 3.6 |
| Privacy | — | — | 2.8 | 3.6/3.11 |
| AI security | — | 1.11 | 2.9 | — |
| Prompt-injection defense | — | 1.11 | 2.9 | — |
| Founder account protection | 0.2 | — | 2.3 | 3.5 |

---

## Governance
- **Gate:** Security Agent owns Go/No-Go; blocks any release with an open CRITICAL.
- **Cadence:** controls operated per `SECURITY_AGENT_CHARTER.md` (daily/weekly/monthly/quarterly).
- **Review:** this roadmap is reviewed each quarter; completed items move to "operating," new risks become Register entries and slot into the right phase.
- **Founder-approval set** (always): payments, auth, RBAC, founder/admin access,
  Supabase policies, schema, secrets, legal/compliance, prod data migrations.

**North star:** from a clean-but-vulnerable startup (today) → SOC2/ISO-certified,
continuously-monitored global platform — without ever shipping past an open CRITICAL.
