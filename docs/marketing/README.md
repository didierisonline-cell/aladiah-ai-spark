# Marketing Asset Factory — Sprint 1 Backlog

**Status:** DRAFT · `pending_approval`. Nothing here is published. This is the
30-day pre-launch content backlog, staged for **founder review**, built strictly
from `FOUNDER_STORY_CANON.md` and the ratified Marketing OS (Marketing Content
Agent: `publish:false`, `human_approval_required:true`).

## What's in this folder

| File | Asset | Count | Founder ask |
|---|---|---|---|
| `FOUNDER_STORY_CANON.md` | Facts + voice + guardrails (anti-invention source of truth) | — | — |
| `the-man-who-refused.md` | "The Man Who Refused" episode scripts | 7 | ✅ Storytelling |
| `short-videos.md` | Short-form video scripts (Reels/Shorts/TikTok) | 30 | ✅ Content Studio |
| `linkedin-posts.md` | LinkedIn thought-leadership posts | 10 | ✅ Content Studio |
| `instagram-carousels.md` | Instagram carousels (swipe sequences) | 10 | ✅ Content Studio |
| `email-campaigns.md` | Email campaigns (5 campaigns, ~21 emails) | 5 | ✅ Content Studio |

**Sprint-1 Content Studio target: fully drafted.** (30 videos · 10 LinkedIn ·
10 carousels · 5 emails · 7 story episodes.)

## Production pipeline (founder-specified)

```
Claude → script   (this folder: drafts)
ChatGPT → enhance
ElevenLabs → voice
Canva → visuals
CapCut → edit
Metricool → scheduling queue   (DO NOT publish until founder approves)
```

## Design Team brief (Canva Pro — human/design execution, not in this repo)

Tracked here so nothing is invented; assets to be produced in Canva Pro:
- **Certificate mockups** — use `official-seal.svg` (per `BRAND_STANDARD.md`); no fake names.
- **Program graphics** — BA first; PM/DA/Cyber as they're authored.
- **Salary graphics** — ⚠️ `[VERIFY]` every figure against a real, citable source
  before design. No invented salaries (Truth canon).
- **Career roadmaps** — module → simulation → capstone → credential → role.
- **Transformation graphics** — before/after skill framing (no fabricated outcomes).
- **AI future graphics** — "every job is an AI job" theme.

## QA gate (every asset must pass before founder approval)

1. **No invented biography** — only `FOUNDER_STORY_CANON.md` facts.
2. **No fabricated metrics** — all numbers/prices/outcomes are `[VERIFY]` until
   the founder supplies a real, defensible figure.
3. **Protected terms verbatim** — Aladiah Academy · Prof. Didier · Talent Score™ ·
   All-Access Pass™ (`docs/i18n/PROTECTED_TERMS.md`).
4. **No publishing** — staged at `pending_approval` for `/admin/marketing-agent`.

## Open items for the founder

- Replace every `[VERIFY: …]` token (links, prices, cohort size, salary figures,
  student spotlights) with real, approved values before anything is scheduled.
- Confirm whether these drafts should be **seeded into `marketing_content`** (the
  approval UI) — if yes, say so and I'll deliver a reviewable seed migration
  (canon: SQL delivered as a file you apply by hand, not auto-applied).
- Localize approved copy to **FR/ES** once English is signed off (the i18n spine
  is ready; translation runs after approval, not before).
