# Aladiah Security Exposure Report — Phase 1
### Operational Hardening · Foundation Gate

**Date:** 2026-06-11 · **Scope:** repo `didierisonline-cell/aladiah-ai-spark` (git history, working tree, shipped `dist/` bundle, env files)
**Rule honored:** no secret values are printed in this report.
**Method:** static scan (git ls-files/log, ripgrep over source + built bundle, env name enumeration). External dashboards (Vercel/Supabase/Railway/Stripe) are **not** visible from CI and must be verified by the founder.

---

## 🚦 GATE VERDICT: **NO-GO** until the two keys below are rotated.

The foundation rule ("nothing moves forward unless security passes") is **not yet satisfied**. One committed-secret exposure requires key rotation by the founder before further phases ship.

---

## Critical findings

### 🔴 SEC-001 — `.env` committed to git (secret exposure)
| Field | Value |
|---|---|
| **Name** | `.env` file (contains 2 server secrets) |
| **Location found** | tracked in git index + history (`git ls-files` → `.env`; history at commit `c996686`) |
| **Severity** | **CRITICAL** |
| **Public?** | Exposed to anyone with repo access; treat as public until repo visibility is confirmed private *and* history is purged |
| **Client-exposed?** | The file also held client (`VITE_`) vars (by-design) |
| **Rotate?** | **YES — for the server secrets it contains** (SEC-002, SEC-003) |
| **Fix** | ✅ Untracked this turn (`git rm --cached .env`, kept locally) + added `.env.example`. **Still required:** rotate the secrets (history retains old values) and decide on history purge (`git filter-repo`/BFG + force-push) — destructive, needs founder approval. |

### 🔴 SEC-002 — `VITE_ELEVENLABS_API_KEY` (billable secret, committed)
| Field | Value |
|---|---|
| **Location** | committed `.env` |
| **Severity** | **HIGH** |
| **Public?** | Yes (in git history) |
| **Client-exposed?** | `VITE_` prefix *would* ship it to the browser — but it is **unused in `src/`**, so it is not inlined into the current bundle as a value (verified: 0 references). |
| **Rotate?** | **ROTATE REQUIRED** (exposed in history) |
| **Fix** | Rotate the ElevenLabs key. Remove the `VITE_` prefix; authenticate the voice agent via a **server-issued signed URL** (or keep a public agent id only). Delete the unused client var. |

### 🔴 SEC-003 — `HEYGEN_API_KEY` (billable secret, committed)
| Field | Value |
|---|---|
| **Location** | committed `.env` |
| **Severity** | **HIGH** |
| **Public?** | Yes (in git history) |
| **Client-exposed?** | No `VITE_` prefix → not shipped to client |
| **Rotate?** | **ROTATE REQUIRED** (exposed in history) |
| **Fix** | Rotate the HeyGen key; store only in server env (Supabase Edge/Vercel/Railway). |

---

## Client-exposed by design (acceptable — verify, don't rotate)

| ID | Secret | Severity | Public? | Client-exposed? | Rotate? | Note |
|---|---|---|---|---|---|---|
| SEC-010 | `VITE_SUPABASE_PUBLISHABLE_KEY` (anon) | MEDIUM | Yes (by design) | Yes | No* | *Safe **only if RLS covers every table**. Phase-2 task: full RLS audit. |
| SEC-011 | `VITE_STRIPE_PUBLISHABLE_KEY` (`pk_…`) | LOW | Yes (by design) | Yes | No | Publishable key is meant to be public. |
| SEC-012 | `VITE_SUPABASE_URL` / `PROJECT_ID` | LOW | Yes | Yes | No | Public identifiers. |
| SEC-013 | Stripe price IDs, `VITE_API_URL`, agent/voice IDs | INFO | Yes | Yes | No | Non-secret identifiers. |

---

## What was NOT found (good)

- 🟢 **No Supabase `service_role` key** in the repo (the `service_role` grep hits were the Postgres **role name** in a migration + a doc, not a key).
- 🟢 **No Stripe secret key (`sk_…`)**, **no OpenAI**, **no Anthropic**, **no GitHub token** in source, env, or history.
- 🟢 **No secret values leaked into the shipped `dist/` bundle** (the `xi-api-key`/`elevenlabs` strings are SDK header/identifier constants, not keys).
- 🟢 Supabase client reads the anon key from `import.meta.env` (not hardcoded); RLS policies exist on AOS + student tables.

---

## Required actions (founder) — in order

1. **ROTATE** `ELEVENLABS_API_KEY` and `HEYGEN_API_KEY` in their provider dashboards (history retains the old values). — *blocks GO*
2. **Set rotated values** as server-only env in Vercel/Supabase/Railway (no `VITE_` prefix). Confirm production still builds (Vercel uses dashboard env, not the committed file).
3. **Confirm repo visibility.** If the repo is or ever was **public**, schedule a **history purge** (`git filter-repo`/BFG + force-push) — destructive, founder-approved.
4. **RLS coverage audit** (Phase 2) — prove the anon key cannot read/write data it shouldn't.
5. Verify **no server secret carries a `VITE_` prefix** anywhere going forward (lint/CI guard recommended).

## Already done this turn (safe, non-destructive)
- ✅ `git rm --cached .env` (untracked; local file preserved) — stops future commits leaking it.
- ✅ Added `.env.example` (names only; documents client-exposed vs server-only).

---

## Go/No-Go (security gate only)
| Gate | Status |
|---|:--:|
| No service_role / Stripe-secret / provider keys in repo | ✅ PASS |
| No secret values in shipped bundle | ✅ PASS |
| `.env` not tracked going forward | ✅ PASS (fixed) |
| Exposed billable keys rotated | ❌ **PENDING (founder)** |
| Repo-history exposure resolved | ❌ **PENDING (founder decision)** |

**Security gate: NO-GO** → resolve SEC-002 + SEC-003 (rotation), then re-run to clear the gate.

---
*Phase 1 of the Operational Hardening mission. Phases 2–8 (Security Agent/AI-SOC, AI Workforce Role Map, CEO Reporting, Platform Audit, E2E, Stripe readiness) are gated on this passing.*
