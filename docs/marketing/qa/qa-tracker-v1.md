# MARKETING QA TRACKER — v1
**Updated:** 2026-06-21
**QA Director:** [ASSIGN]

---

## REVIEW QUEUE

| Asset | Type | Flywheel Stage | Mission Gate | Accuracy Gate | Brand Gate | Quality Gate | CMO Review | Founder Queue |
|---|---|---|---|---|---|---|---|---|
| Founder Story Package v1 | Story/Video/Email | Attention → Trust | ✓ | ✓ | PENDING | PENDING | PENDING | PENDING |
| Video Scripts 01–10 | Video Script | Attention/Trust | ✓ | ⚠️ 08,09 stats | PENDING | PENDING | PENDING | PENDING |
| Video Scripts 11–20 | Video Script | Trust/Transform | ✓ | ⚠️ 14 stat | PENDING | PENDING | PENDING | PENDING |
| Video Scripts 21–30 | Video Script | All | ✓ | ✓ | PENDING | PENDING | PENDING | PENDING |
| LinkedIn Posts 01–10 | LinkedIn | Attention/Trust | ✓ | ⚠️ 09 PMI cite | PENDING | PENDING | PENDING | PENDING |
| Carousels 01–05 | Carousel | Attention/Trust | ✓ | ⚠️ 03 salary | PENDING | PENDING | PENDING | PENDING |
| Email Campaign 01 (Waitlist) | Email | Attention→Employment | ✓ | ✓ | PENDING | PENDING | PENDING | PENDING |
| Email Campaign 02 (Employer) | Email | Trust→Employment | ✓ | ✓ | PENDING | PENDING | PENDING | PENDING |

---

## FLAGS REQUIRING RESOLUTION BEFORE APPROVAL

| Flag | Asset | Action Required | Owner |
|---|---|---|---|
| ⚠️ Stat unverified | Video 08: "350% cybersecurity growth" | Verify against current AfricaIT/IFC report | QA Director |
| ⚠️ Stat unverified | Video 09: "47 new DR free zone companies" | Verify against CNZFE report | QA Director |
| ⚠️ Stat unverified | Video 14: "44% Africa tech growth" | Verify against Partech Africa / Briter report | QA Director |
| ⚠️ Stat unverified | LinkedIn 09: "87M PMI shortage" | Source: PMI Talent Gap 2023 — confirm year/version | QA Director |
| ⚠️ Salary data | Carousel 03: Africa salary ranges | Verify against LinkedIn Salary Insights + local market data | QA Director |

**RULE:** No asset with an ⚠️ flag is approved for publication until the flag is cleared and replaced with a sourced citation inline. All flagged statistics are now tracked in `MARKETING_CLAIMS_REGISTRY.md` (claims E-01 through E-11). An asset cannot pass the Accuracy gate while any of its claims are `BLOCKED` in the registry.

---

## MISSION GATE — FINAL CHECK BEFORE ANY APPROVAL

> "Does this asset help someone transform their career?"

Every asset in this queue must be evaluated against this question by a reviewer who did not create it.

If the answer is NO or UNCLEAR: **Reject. Return with written reason.**

---

## BRAND COMPLIANCE CHECKLIST

- [ ] Correct logo version: use `/brand/official/aladiah-primary-mark.png` or `aladiah-full-lockup.png` ONLY — see BRAND_CANON.md. Any other asset = automatic Brand Gate FAIL.
- [ ] Color palette: Navy #0E1F44 · Gold #C9A24B · Crimson #A41E34 · Cream #F2E6C9
- [ ] Tagline used: "Solo Excelencia" (not "Only Excellence" or variations)
- [ ] URL used: aladiahacademy.com (not lovable.app or preview URLs)
- [ ] Voice: authoritative, professional, direct — not casual, not hype, not motivational-poster
- [ ] "We do not sell courses" — no asset may use course-purchase language as the primary hook

---

## PRODUCTION BLOCKERS

| ~~BLK-001~~ | ✅ RESOLVED 2026-06-21 | Official mark ratified by Founder | Unblocked: visual production may proceed once PNGs committed to /brand/official/ |
| BLK-002 | Platform accounts not verified | Social team action required | Blocks: publishing |
| BLK-003 | Stat sourcing incomplete | QA Director action required | Blocks: Videos 08,09,14; Carousel 03; LinkedIn 09 |
| BLK-004 | Mailchimp not configured | Tech action required | Blocks: email campaigns |

---

**Storage:** `/docs/marketing/qa/qa-tracker-v1.md`
