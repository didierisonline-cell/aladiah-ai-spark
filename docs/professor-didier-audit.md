# Professor Didier™ — Implementation Audit (Phase 2)

**Date:** 2026-07-04 · **Method:** code inspection, every finding cites a file path. No guessing.

## Headline finding: FOUR live voice surfaces, not one

`useConversation` (the ElevenLabs live-voice hook) is instantiated in **four** components with **three different, inconsistent** connection patterns:

| # | Component | Mounted by | getUserMedia | Connection | Instrumented | Status |
|---|---|---|---|---|---|---|
| 1 | `src/pages/ChapterView.tsx:99` | the lesson page (primary in-lesson Prof. Didier) | **was `{audio:true}` → now hardened** | signedUrl + overrides | **now yes (this PR)** | **PRIMARY cutoff path — fixed** |
| 2 | `src/components/course/LiveClassroom.tsx:89` | `VideoPlayer.tsx:885` | hardened (PR #115) | signedUrl + overrides | yes (PR #115) | live |
| 3 | `src/components/portal/VoiceTutor.tsx:21` | **nowhere (orphaned)** | hardened | `conversationToken: data.token` | minimal | **orphaned + BROKEN (see Q4)** |
| 4 | `src/components/ProfDidierFloat.tsx:34` | **nowhere (orphaned)** | `{audio:true}` | signedUrl + overrides | minimal | **orphaned** |

**The in-lesson cutoff root cause was in surface #1 (ChapterView).** See Q6.

## The 20 audit questions

1. **Where is the ElevenLabs connection created?** Four sites (table above). The one students actually hit inside a lesson is `ChapterView.tsx` via `conversation.startSession(sessionOpts)` at `ChapterView.tsx:~245`. The classroom/video path is `LiveClassroom.tsx:230`.
2. **Where is the signed URL requested?** Client POSTs to `supabase/functions/elevenlabs-conversation-token` (`ChapterView.tsx:~215`, `LiveClassroom.tsx:169`). The function calls ElevenLabs `get_signed_url?agent_id=…` and returns `{ signed_url }` (`elevenlabs-conversation-token/index.ts:25-47`).
3. **What overrides are sent?** `agent.prompt.prompt` (full system prompt), `agent.language`, and `tts.voiceId/stability/similarityBoost` (`ChapterView.tsx:~228`, `LiveClassroom.tsx:208`). ChapterView does **not** send `firstMessage`; LiveClassroom **does** (`LiveClassroom.tsx:213`).
4. **Are prompt, firstMessage, language, voiceId sent as overrides?** prompt ✓, language ✓, voiceId ✓ everywhere; firstMessage ✓ only in LiveClassroom/ProfDidierFloat. **Discrepancy found:** `VoiceTutor.tsx:44` calls `startSession({ conversationToken: data.token })` but the token function returns `{ signed_url }`, not `{ token }` — so `data.token` is undefined and VoiceTutor throws `'No token received'` (`VoiceTutor.tsx:38`). It is **broken**, but orphaned (mounted nowhere), so no student impact today.
5. **Are those overrides required?** They are only honored if the ElevenLabs agent's **security settings whitelist each override field**. If a field is sent but not whitelisted, ElevenLabs may reject/close the socket. This must be verified manually — see `docs/elevenlabs-professor-didier-checklist.md`.
6. **What happens when the WebSocket closes?** **ROOT CAUSE (now fixed):** `ChapterView.tsx` `onConnect` started a keep-alive that injected fake user audio every 8s (`sendUserAudio(new Float32Array(480))`). ElevenLabs reads inbound user audio as the student taking a turn → the agent self-interrupted and stopped mid-sentence **every 8 seconds**. Removed this PR. Now `onDisconnect` cleanly tears down timers and captures the close reason.
7. **Is the close reason surfaced to the user?** **Was:** no (ChapterView set `error` with no detail). **Now:** an amber on-screen diagnostic box shows code / reason / wasClean / elapsed / likely cause / next action (`ChapterView.tsx` + `LiveClassroom.tsx`).
8. **Is the close reason logged clearly in console?** **Now yes**, parseable: `[LiveClass] onDisconnect code=<> reason=<> wasClean=<> elapsedMs=<> likelyCause=<>`.
9. **Is echoCancellation enabled?** **Was no** in ChapterView & ProfDidierFloat (`{audio:true}`). **Now yes** in ChapterView (this PR) and LiveClassroom (PR #115); already yes in VoiceTutor. ProfDidierFloat still `{audio:true}` — orphaned, low priority.
10. **noiseSuppression?** Same status as Q9 — now on in the two live paths.
11. **autoGainControl?** Same — now on in the two live paths.
12. **Reconnect or fail silently?** Fails to `idle`/`error`; no auto-reconnect. Acceptable for launch (manual restart button). Auto-reconnect is a future enhancement.
13. **Is the audio element/player stable?** ElevenLabs SDK owns audio playback (no custom `<audio>`). ChapterView unlocks the Safari WebAudio context before connecting (`ChapterView.tsx:~156`) — correct.
14. **Is student context passed?** Partially: name/program are **not** passed to the agent today. Lesson/chapter titles + transcript snippet are. See `docs/professor-didier-context-map.md`.
15. **Is course/lesson context passed?** Yes — lesson title, chapter title, and first 800 chars of the lesson transcript go into the override prompt (`ChapterView.tsx:~176`).
16. **Is quiz/progress context passed?** No. Not passed to the live agent today. Future enhancement (context map).
17. **Duplicate Professor Didier components?** Yes — four voice surfaces with overlapping purpose (table). Consolidation recommended post-launch.
18. **Orphaned components?** Yes — `ProfDidierFloat.tsx` and `VoiceTutor.tsx` are mounted nowhere. VoiceTutor is also broken (Q4). Recommend deletion or wiring in a dedicated cleanup WO.
19. **Console errors?** The pre-fix ChapterView produced silent self-interruptions (no error thrown, just cut audio). Now instrumented. No other blocking console errors found in the voice path.
20. **Build warnings?** Build is `vite build` (esbuild, no tsc gate). `npm run build` is green. One pre-existing unrelated tsc error in the orphaned legacy `src/hooks/useBrain.ts` (zero importers, retirement pending) — not in the voice path.

## Prioritized remediation

1. ✅ **DONE (this PR):** ChapterView keep-alive removed (the cutoff), echoCancellation on, disconnect/error instrumented + amber box.
2. ✅ **DONE (PR #115):** LiveClassroom hardened + instrumented.
3. ⏳ **Founder:** verify ElevenLabs agent override whitelist + voice/turn-taking settings (checklist doc). This is the remaining possible cutoff cause if any persists.
4. 🔜 **Post-launch cleanup WO:** delete or wire `ProfDidierFloat` + `VoiceTutor`; consolidate to one voice component.
