# Asset Manifest — CGO System v1

Source files:
- `src/services/agents/growth/engines.ts` — all deterministic sub-agent engines
- `src/services/agents/chiefGrowthOfficerAgent.ts` — orchestrator and persistence layer

All assets land at `status: pending_approval`. Nothing publishes automatically.

---

## Hook Bank

- **Count:** 100
- **Generator:** `buildHookBank(count = 100)`
- **Buckets (9):**
  1. `contrarian_belief` — emotional trigger: curiosity; shareability: 9; controversy: 7; trust: 7
  2. `costly_mistake` — emotional trigger: fear / urgency; shareability: 8; controversy: 5; trust: 7
  3. `surprising_proof` — emotional trigger: credibility; shareability: 8; controversy: 4; trust: 9
  4. `identity_aspiration` — emotional trigger: hope; shareability: 7; controversy: 3; trust: 6
  5. `identity_threat` — emotional trigger: urgency; shareability: 7; controversy: 6; trust: 6
  6. `speed_to_outcome` — emotional trigger: desire; shareability: 6; controversy: 3; trust: 7
  7. `myth_busting` — emotional trigger: curiosity / relief; shareability: 9; controversy: 8; trust: 8
  8. `behind_the_build` — emotional trigger: trust / intimacy; shareability: 7; controversy: 4; trust: 9
  9. `transformation_story` — emotional trigger: aspiration; shareability: 8; controversy: 3; trust: 8
- **Channels covered:** LinkedIn, Instagram, TikTok, YouTube Shorts
- **Audiences covered:** career_changers, working_professionals, africa_cameroon, dominican_republic, employers
- **Asset quality rule:** 85+ ships; 70–84 revise; <70 kill

**Sample hooks by bucket (5 per bucket, 45 base hooks, cycled to 100):**

| Bucket | Hook |
|--------|------|
| contrarian_belief | "Most people do not have a learning problem. They have a signaling problem." |
| contrarian_belief | "A certificate is not proof if nobody can see what you can do." |
| costly_mistake | "The most expensive mistake in a career pivot is choosing the wrong signal." |
| costly_mistake | "Studying without simulating is the fastest way to fail an interview." |
| surprising_proof | "We can show your capability in one score. Most platforms cannot show it at all." |
| surprising_proof | "A Talent Score changes what recruiters see — without changing your resume." |
| identity_aspiration | "You are not too late. You are early for the AI workforce." |
| identity_aspiration | "Africa's next workforce leaders are training right now." |
| identity_threat | "AI is not replacing workers — it is replacing workers who are not AI-ready." |
| identity_threat | "If your current skills were built before 2022, the market has moved." |
| speed_to_outcome | "Aladiah gives you one clear score and one clear next step in minutes." |
| speed_to_outcome | "One assessment. One score. One path. Start free." |
| myth_busting | "Myth: you need a CS degree to enter AI-powered tech roles. Truth: you need proof." |
| myth_busting | "Myth: career transformation takes years. Truth: it takes the right system." |
| behind_the_build | "Building an AI career school from the ground up — here is what nobody talks about." |
| behind_the_build | "The real reason Aladiah exists: career transformation is not the same as course completion." |
| transformation_story | "From confusion to career-ready: what the Aladiah system actually does." |
| transformation_story | "Learn. Practice. Simulate. Validate. Interview. Get hired. Lead. Build." |

---

## LinkedIn Authority Posts

- **Count:** 10
- **Generator:** `linkedinAuthorityPosts(count = 10)`
- **Sub-agent:** `linkedin-authority`
- **Channel:** LinkedIn
- **Content type:** thought_leadership
- **Audience:** working_professionals
- **Risk tier:** low (all 10)
- **KPI target:** saves + profile views + qualified comments
- **Flywheel stages covered:** attention (3), trust (3), authority (2), employment (1), transformation (1)

| # | Title | Hook | Flywheel Stage |
|---|-------|------|----------------|
| 1 | Why Aladiah exists | "The real reason Aladiah exists: career transformation is not the same as course completion." | attention |
| 2 | The proof problem in education | "Most people do not have a learning problem. They have a signaling problem." | trust |
| 3 | What Talent Score means | "We can show your capability in one score. Most platforms cannot show it at all." | trust |
| 4 | Career changers and AI | "You are not too late. You are early for the AI workforce." | attention |
| 5 | AI Scrum Master: the role the market needs | "Every Aladiah module ends with a proof artifact, not just a quiz." | authority |
| 6 | What employers actually want | "The future will not reward people who only consume content." | employment |
| 7 | Africa and the AI workforce | "Africa's next workforce leaders are training right now." | authority |
| 8 | Simulations vs certificates | "Myth: online certifications are enough. Truth: employers want demonstrated capability." | trust |
| 9 | June 19 launch: what we are building | "Building an AI career school from the ground up — here is what nobody talks about." | attention |
| 10 | The transformation path | "Learn. Practice. Simulate. Validate. Interview. Get hired. Lead. Build." | transformation |

---

## Short-Form Video Scripts

- **Count:** 10
- **Generator:** `shortVideoScripts(count = 10)`
- **Sub-agent:** `short-form-video`
- **Channels:** Instagram Reels (even-indexed scripts), TikTok (odd-indexed scripts), YouTube Shorts
- **Content type:** reel_script
- **Risk tier:** low (all 10)
- **KPI target:** 3s hold rate + average watch % + saves
- **Format:** vertical 9x16, target length 30 seconds

| # | Title | Hook | Channel | Flywheel Stage |
|---|-------|------|---------|----------------|
| 1 | What job-ready should actually look like | "A Talent Score changes what recruiters see — without changing your resume." | Instagram | attention |
| 2 | Your CV is not your proof | "A certificate is not proof if nobody can see what you can do." | TikTok | attention |
| 3 | From confusion to AI-ready in 90 days | "From confusion to career-ready: what the Aladiah system actually does." | Instagram | attention |
| 4 | Myth: you need a CS degree | "Myth: you need a CS degree to enter AI-powered tech roles. Truth: you need proof." | TikTok | attention |
| 5 | Africa is not behind — it is early | "Africa's next workforce leaders are training right now." | Instagram | trust |
| 6 | What happens inside an Aladiah simulation | "What if your training looked more like your actual job?" | TikTok | trust |
| 7 | Three things employers want that courses do not give you | "The most expensive mistake in a career pivot is choosing the wrong signal." | Instagram | trust |
| 8 | Launching June 19 — what is different | "We are not launching another course platform." | TikTok | transformation |
| 9 | AI Scrum Master: what the market needs | "Every Aladiah module ends with a proof artifact, not just a quiz." | Instagram | transformation |
| 10 | One score. One path. Start free. | "Aladiah gives you one clear score and one clear next step in minutes." | TikTok | transformation |

---

## Launch Email Sequences

- **Count:** 7 emails across 3 sequences
- **Generator:** `launchEmailSequence()`
- **Sub-agent:** `email-revenue`
- **Risk tier:** low (all 7)
- **KPI target:** open rate + CTOR + conversion
- **Score:** 88 (assigned by orchestrator)

| Sequence | Position | Subject | Trigger | Flywheel Stage |
|----------|----------|---------|---------|----------------|
| launch_waitlist | 1 | "You are early. Here is what is coming." | `launch_waitlist_signup` | attention |
| launch_waitlist | 2 | "What employers actually want (and why most platforms miss it)" | `launch_waitlist_signup` | trust |
| launch_waitlist | 3 | "Three days until launch — here is what to do first" | `launch_waitlist_signup` | transformation |
| launch_day | 1 | "We are live. Start your AI-powered career transformation ecosystem today." | `launch_day` | employment |
| talent_score_nurture | 1 | "Your Talent Score is waiting — here is what it tells you" | `talent_score_started_not_completed` | trust |
| talent_score_nurture | 2 | "What your score means — and what to do next" | `talent_score_completed` | transformation |
| webinar | 1 | "Join us live: How Aladiah transforms careers" | `webinar_created` | community |

**Sequence summary:**
- `launch_waitlist` (3 emails): fires as a drip sequence on waitlist signup; positions 1–3
- `launch_day` (1 email): fires on the `launch_day` system trigger on June 19
- `talent_score_nurture` (2 emails): behavioral — fires based on assessment start/completion events
- `webinar` (1 email): fires when a webinar record is created in the system

---

## Launch Campaign (T-4 to T+7)

- **Generator:** `buildLaunchCampaign()`
- **Days:** 12 (June 15 through June 26)
- **Assets per day:** 6 (LinkedIn post, Instagram caption, Instagram Reel script, TikTok script, Email, Community post)
- **Total assets:** 72
- **Risk tier:** low (all 72 — see governance note on T+3 and employer-day assets)
- **Asset quality score:** 89 (deterministic scorer output for these body/hook lengths)
- **All rows:** `approval_status = PENDING_FOUNDER_APPROVAL`

| Date | Relative Day | Theme | Primary Audience |
|------|-------------|-------|-----------------|
| 2026-06-15 | T-4 | launch countdown | career_changers |
| 2026-06-16 | T-3 | product demo | working_professionals |
| 2026-06-17 | T-2 | simulation walkthrough | employers |
| 2026-06-18 | T-1 | final countdown | career_changers |
| 2026-06-19 | Launch | official launch | career_changers |
| 2026-06-20 | T+1 | 24h learnings | working_professionals |
| 2026-06-21 | T+2 | FAQ carousel | career_changers |
| 2026-06-22 | T+3 | early response | employers |
| 2026-06-23 | T+4 | webinar invite | working_professionals |
| 2026-06-24 | T+5 | employer value | employers |
| 2026-06-25 | T+6 | myth busting | africa_cameroon |
| 2026-06-26 | T+7 | week one report | career_changers |

**Visual direction template (all days):** `{theme} — clean brand colors, no stock images, product screenshots or founder face preferred`

**Founder talking points template (all days):**
1. What {theme} means for our mission
2. Why this matters on {relative_day} specifically
3. What action viewers should take right now

---

## Regional Assets

### Cameroon / Africa
- **Count:** 3 LinkedIn posts
- **Generator:** `cameroonGrowthAssets()`
- **Sub-agent:** `cameroon-growth`
- **Channel:** LinkedIn
- **Content type:** regional_authority
- **Audience:** africa_cameroon
- **Risk tier:** low
- **Hashtags:** #Cameroon #AfricaAI #WorkforceTransformation #Aladiah #CAMTEL

| # | Title | Hook | Flywheel Stage |
|---|-------|------|----------------|
| 1 | CAMTEL and the AI workforce transformation opportunity | "Africa's telecoms workforce is at an inflection point." | authority |
| 2 | From Cameroon to global AI workforce | "The AI economy does not care where you started." | attention |
| 3 | Universities and the AI skills gap in Cameroon | "The curriculum gap between what universities teach and what employers need has never been larger." | employment |

**Note:** Post #1 references CAMTEL by name — requires founder confirmation this is an approved named reference before publish.

### Dominican Republic
- **Count:** 2 posts (Instagram + LinkedIn)
- **Generator:** `dominicanRepublicGrowthAssets()`
- **Sub-agent:** `dr-growth`
- **Channel:** Instagram
- **Content type:** regional_caption
- **Audience:** dominican_republic
- **Language:** Spanish
- **Risk tier:** low
- **Hashtags:** #RepublicaDominicana #CarreraEnTech #AICareer #Aladiah

| # | Title | Hook | Flywheel Stage |
|---|-------|------|----------------|
| 1 | De talento local a oportunidad global — República Dominicana | "El mercado laboral ya no tiene fronteras para quienes tienen las habilidades correctas." | attention |
| 2 | Aladiah DR: el camino desde estudiante hasta profesional empleado | "No necesitas un título de CS para entrar a la economía de IA." | transformation |

---

## Employer Trust Assets

- **Count:** 2
- **Generator:** `employerTrustAssets()`
- **Sub-agent:** `employer-trust`
- **Channel:** LinkedIn
- **Content type:** b2b_authority
- **Audience:** employers
- **Flywheel stage:** employment
- **Risk tier:** MEDIUM — requires founder approval before any scheduling or publish
- **Permission gate:** `guard({ agentSlug, action: 'generate_employer_content', risk: 'medium' })` — system raises `ApprovalRequiredError` if permission not granted
- **CTA:** `Talk to us → https://aladiah.academy/employers`

| # | Title | Hook |
|---|-------|------|
| 1 | Why employer-facing proof matters in 2026 | "The hiring problem is not talent shortage. It is proof shortage." |
| 2 | The Aladiah employer value proposition | "Stop hiring based on self-reported credentials." |

---

## Lead Magnets

- **Count:** 5
- **Generator:** `leadMagnetSpecs()`
- **Note:** Specs only — creative production is delegated to Marketing Content Agent; no PDFs exist yet

| # | Title | Audience | Format | Flywheel Stage |
|---|-------|----------|--------|----------------|
| 1 | AI Career Blueprint 2026 | career_changers | PDF checklist + career path map | attention |
| 2 | AI Scrum Master Roadmap | working_professionals | PDF roadmap + self-assessment | trust |
| 3 | AI Job Readiness Checklist | career_changers | PDF checklist | employment |
| 4 | Africa Digital Workforce Report 2026 | africa_cameroon | PDF report | authority |
| 5 | DR AI Career Guide | dominican_republic | PDF guide (Spanish) | attention |

---

## Founder Brand Plan

- **Generator:** `founderBrandPlan()`
- **Series count:** 5
- **Weekly topics:** 7
- **Repurposing matrix sources:** 3

**5 Series:**

| Series Name | Angle | Frequency |
|-------------|-------|-----------|
| Building Aladiah in public | founder narrative + lessons | 2x weekly |
| What most education gets wrong | contrarian authority | 1x weekly |
| Proof over promises | Talent Score, simulations, outcomes | 2x weekly |
| From learner to signal | case/pathway explainers | 1x weekly |
| Schools and employers need better evidence | B2B credibility | 1x weekly |

**7 Weekly Topics:**
1. Why career transformation and course completion are not the same thing
2. What Aladiah Talent Score shows that a resume cannot
3. Building the AI Scrum Master program — what the market was missing
4. Africa and the AI workforce opportunity
5. What employers actually look for in 2026
6. How simulation-based learning changes interview readiness
7. The Aladiah flywheel explained

**Repurposing Matrix (3 source types):**

| Source | Outputs |
|--------|---------|
| 5-minute founder recording | 1 LinkedIn post, 3 short clips, 1 carousel, 1 email section, 3 quotes |
| Webinar | landing page FAQ, 5 shorts, 2 emails, 1 blog post |
| Product demo | Reel, YouTube Short, GIF snippets, CTA section, proof post |

---

## Total Assets in System

| Sub-agent | Count |
|-----------|-------|
| Hook Bank | 100 |
| LinkedIn Authority Posts | 10 |
| Short-Form Video Scripts | 10 |
| Launch Email Sequences | 7 |
| Launch Campaign (72 assets across 12 days × 6 channels) | 72 |
| Cameroon / Africa Regional Posts | 3 |
| Dominican Republic Regional Posts | 2 |
| Employer Trust Assets | 2 |
| Lead Magnet Specs | 5 |
| Founder Brand Plan topics | 7 |
| **Total** | **218** |

**Note on counting:**
- Hook Bank (100) and Lead Magnet Specs (5) and Founder Brand Plan topics (7) are planning/spec assets, not publishable content units.
- Publishable content assets (scheduled to channels): 10 + 10 + 7 + 72 + 3 + 2 + 2 = **106 publishable assets**
- All 106 publishable assets land at `status: pending_approval`; 2 employer trust assets additionally require `risk: medium` founder sign-off before staging.
