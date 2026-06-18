# RLS & Progression Hardening — Launch Blocker

Status of the content-access & progression-integrity work (Launch Hardening option 1).
Migrations are delivered as reviewable files and **applied by hand in Supabase** (repo canon).
Live `pg_policies` introspection was not possible from the build environment (Supabase host
is blocked by the network egress allowlist), so the "current" column is reconstructed from
the authoritative migration history.

## Verification of `profiles` (the four requirements)

| Requirement | Before this work | After `20260616120000_profiles_rls_lockdown.sql` |
|---|---|---|
| anon cannot SELECT profiles | ❌ `USING (true)` made it world-readable | ✅ no public policy; anon gets 0 rows |
| authenticated SELECT only own | ❌ could read everyone | ✅ `USING (auth.uid() = user_id)` |
| founder/admin SELECT all | ⚠️ only via the world-read hole | ✅ `USING (public.aos_is_admin())` |
| referral pages work without direct profiles access | (relied on the hole) | ✅ via `public.public_profiles` view (name/avatar/created_at only) |

Root cause: migration `20260215063914` dropped "Users can view own profile" and added
"Public can view profiles for referral pages" `USING (true)`. That is now reverted; public
display reads go through the narrow `public_profiles` view, which exposes **no** tier, email,
login timestamps, or internal flags.

Client reads repointed to the safe view (so the lockdown doesn't break them):
`src/pages/ReferralProfile.tsx`, `src/pages/Feedback.tsx` (×2), `src/pages/Community.tsx` (×2).
Own-row reads (StudentPortal, ChapterView, LanguageContext, Community intro check) and the
founder AdminDashboard read stay on `profiles` — covered by the owner / admin policies.

## A — `quiz_questions`: approved-only, no answer/draft leakage

**Already correct at the data layer — no risky change made.**

| Concern | Status |
|---|---|
| Draft leakage | ✅ students match `"No direct access to quiz questions" USING (false)` → cannot SELECT any question directly |
| Founder review of drafts | ✅ `"admin read quiz questions" USING (aos_is_admin())` |
| Approved-only delivery | ✅ `get-quiz-questions` edge fn filters `status = 'approved'` (service role) |
| Answer leakage | ✅ `get-quiz-questions` selects `question_text, scenario_context, options, explanation, order_index` — **never `correct_answer_index`**. That column appears only in server seed functions and the founder review path (`questionReview.ts`, gated by `aos_is_admin`). It is never sent to a student. |

> Deliberately **not** adding a student `SELECT … USING (status='approved')` policy: that
> would expose `correct_answer_index`/`explanation` to direct reads — strictly worse for
> answer secrecy than the current deny-all + edge-function delivery. Grading happens
> server-side in `submit-quiz`, so the correct answer never needs to reach the client.

## B — Progression enforcement (server-side)

**Gap:** `videos` SELECT = "course is published" only; `can_access_video()` /
`user_passed_quiz()` exist but no policy calls them → a user could `SELECT … FROM videos`
(including `video_url`) for any published course and skip ahead via a direct request.

**Why not a one-line RLS fix:** `ChapterView.tsx` lists *all* chapter videos (incl.
`video_url`). Gating the `videos` SELECT with `can_access_video()` would hide locked rows and
break the lesson list. So enforcement is staged via the standard list/payload split.

### Stage 1 — additive, safe to apply now (`20260616121000_progression_enforcement.sql`)
- `public.video_list` — url-free listing view (titles/order/duration only).
- `public.get_video_playback(video_id)` — SECURITY DEFINER RPC returning `video_url` **only**
  when `can_access_video(auth.uid(), video_id)` is true (or caller is founder). This is the
  only sanctioned way to obtain a playable URL.
- Changes no existing policy → the app keeps working after apply.

### Stage 2 — lock the base table (after the client migration below; test on staging first)
- Repoint lesson lists to `public.video_list`; repoint the player to
  `get_video_playback()` for the URL.
- Then replace the `videos` SELECT policy with admin-only, so `video_url` can never be read
  directly. SQL is included (commented) in the Stage-1 migration.

### Proof that a user cannot skip modules via direct requests (after Stage 2)
- `videos` SELECT → admin-only ⇒ a student calling `from('videos').select('video_url')`
  directly gets **0 rows**.
- The only URL path is `get_video_playback(video_id)`, which returns a row **only** if
  `can_access_video()` passes. That function returns false unless: it's the first lesson, OR
  the previous lesson's `mini_video` quiz was passed, OR (first lesson of a chapter) the prior
  chapter's `chapter_end` quiz was passed — i.e. sequential order + prior-quiz-pass enforced
  in the database, independent of the frontend.
- `quiz_attempts` is owner-RLS'd and grading is server-side, so a user cannot forge a
  "passed" attempt for a quiz they didn't pass.

## Apply order
1. `20260616120000_profiles_rls_lockdown.sql` (now — closes the world-readable hole).
2. `20260616121000_progression_enforcement.sql` Stage 1 (now — additive).
3. Client migration to `video_list` + `get_video_playback` (next change; build + live test).
4. Stage 2 lockdown of `videos` (after step 3 verified on staging).

> Items NOT in this workstream (tracked separately): subscription/tier gating of premium
> content at the RLS layer, founder server-side route checks, CORS tightening, anon-key
> fallback decision, the score-before-activity bug, and mobile responsiveness.
