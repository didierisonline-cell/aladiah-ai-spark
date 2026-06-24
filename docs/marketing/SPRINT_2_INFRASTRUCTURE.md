# MARKETING SPRINT 2 — Infrastructure & Publishing Readiness
**Objective:** Turn assets into a repeatable production & publishing machine.
**Not the objective:** Create more content.
**Updated:** 2026-06-21

---

## SPRINT GOAL

Move existing content **through the pipeline** by resolving the four blockers
and standing up the production machine. Every item below requires **evidence**
before it is marked done.

---

## BLK-001 — BRANDING FREEZE → OFFICIAL LOGO

See `BRANDING_FREEZE.md`. Freeze is active. Official package not yet in repo.

- [ ] Founder delivers official logo package (SVG + PNG: full, mark, mono, favicon)
- [ ] Committed to `src/assets/brand/official/` + `public/brand/`
- [ ] `BRANDING_FREEZE.md` updated with exact paths
- [ ] Legacy swap list executed
- **Evidence required:** committed files + screenshot of header/footer/favicon rendering official mark

---

## BLK-002 — SOCIAL PLATFORM VERIFICATION

Each platform must be **created · secured · branded · linked · documented**
before any publishing. Marketing delivers an **evidence screenshot** per row.

| Platform | Handle | Created | Secured (2FA) | Branded (logo+banner+bio) | Website Link | Evidence |
|---|---|---|---|---|---|---|
| LinkedIn (Company) | @aladiahacademy | ☐ | ☐ | ☐ | ☐ | ☐ |
| Instagram | @aladiahacademy | ☐ | ☐ | ☐ | ☐ | ☐ |
| Facebook (Page) | @aladiahacademy | ☐ | ☐ | ☐ | ☐ | ☐ |
| TikTok | @aladiahacademy | ☐ | ☐ | ☐ | ☐ | ☐ |
| YouTube (Channel) | @aladiahacademy | ☐ | ☐ | ☐ | ☐ | ☐ |
| X (Twitter) | @aladiahacademy | ☐ | ☐ | ☐ | ☐ | ☐ |

**Branding standard per profile (blocked by BLK-001 logo):**
- Profile photo: official mark
- Banner: official full lockup + "Solo Excelencia"
- Bio: career-transformation framing, not course-sales
- Link: aladiahacademy.com with UTM tag
- Consistent handle across all six

**Evidence storage:** `/docs/marketing/qa/evidence/platforms/`

---

## BLK-003 — CLAIMS REGISTRY

See `MARKETING_CLAIMS_REGISTRY.md` (created). Every flagged stat is logged as
`BLOCKED` pending primary source.

- [ ] Verify E-01 (PMI 87M)
- [ ] Verify E-02/E-03 (Scrum salaries)
- [ ] Resolve or remove E-04 (DR +40–60% — likely unverifiable)
- [ ] Verify E-05 (cybersecurity +350%)
- [ ] Verify E-06 (47 DR free-zone companies)
- [ ] Verify E-07 (Africa VC +44%)
- [ ] Verify E-08 (PMP +22%)
- [ ] Resolve or remove E-09 (Data Analyst +35–50%)
- [ ] Verify/update E-10 (WEF jobs — 2025 horizon now past)
- **Evidence required:** primary-source PDF/screenshot per claim in `/docs/marketing/qa/evidence/claims/`

---

## BLK-004 — MAILCHIMP CONFIGURATION

| Item | Done | Evidence |
|---|---|---|
| Mailchimp account created & secured | ☐ | ☐ |
| Domain authentication (SPF / DKIM / DMARC on aladiahacademy.com) | ☐ | ☐ |
| Audience created (single source, tagged segments) | ☐ | ☐ |
| Waitlist signup form built & embedded on site | ☐ | ☐ |
| Waitlist automation = `email-campaigns-v1.md` Campaign 01 (5 emails) | ☐ | ☐ |
| Employer automation = Campaign 02 (3 emails) | ☐ | ☐ |
| Test send to internal address, all 5 waitlist emails render correctly | ☐ | ☐ |
| Unsubscribe + physical address in footer (CAN-SPAM/GDPR) | ☐ | ☐ |

**Evidence storage:** `/docs/marketing/qa/evidence/mailchimp/`

---

## PRODUCTION PIPELINE — THE MACHINE

Once BLK-001/002/003/004 clear, every one of the 30 scripts runs this exact path:

```
Script (done — 30/30)
   ↓
ElevenLabs   → narration (EN/FR/ES), stored /docs/marketing/qa/evidence/audio/
   ↓
Canva        → graphics/captions per BRANDING_FREEZE official mark
   ↓
CapCut       → assembled Short/Reel/TikTok, exported per-platform spec
   ↓
QA           → mission gate + accuracy (claims registry) + brand + quality
   ↓
Founder Review → green assets only (7-item package, see MARKETING_OS)
   ↓
Metricool    → scheduled across verified platforms
   ↓
Publish      → URL captured
   ↓
Measure      → 24h / 7d / 30d into Growth dashboard
```

**Pipeline rule:** an asset cannot skip a stage. ElevenLabs output with no QA
does not reach Metricool. A script with a `BLOCKED` claim does not reach QA.

---

## READINESS SCORECARD (this sprint moves these)

| Dimension | Start | Target (end of Sprint 2) |
|---|---|---|
| Marketing Infrastructure | 85% | 95% |
| Marketing Content Backlog | 70% | 75% (hold — stop producing, start shipping) |
| Marketing Operations | 60% | 80% |
| Publishing Readiness | 35% | 75% |

---

**Storage:** `/docs/marketing/SPRINT_2_INFRASTRUCTURE.md`
**Owner:** CMO (orchestrates) · directors execute their lanes · QA gates everything
