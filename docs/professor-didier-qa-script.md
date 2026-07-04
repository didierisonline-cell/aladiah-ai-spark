# Professor Didier™ — QA Test Script (Phase 7)

Run as a real student in the deployed app. For each test: PASS/FAIL + notes. If any voice test fails, read the **amber on-screen diagnostic** and record the `code / reason / likelyCause` line.

## Pre-req
- Deploy this branch (Vercel) and confirm the ElevenLabs override checklist (`elevenlabs-professor-didier-checklist.md`) section 2 is verified.
- Use **headphones** for tests 1–3 (isolates the cutoff fix from room echo), then repeat test 1 on **laptop speakers** (validates echoCancellation).

| # | Test | Steps | Pass criteria |
|---|---|---|---|
| 1 | Voice startup | Open a lesson → Start Prof. Didier | Greeting plays **fully**, no disconnect in first 20s. (Pre-fix: cut off ~8s.) |
| 2 | 30-second conversation | Ask "What is Aladiah Academy?" | Full spoken answer completes, no cutoff |
| 3 | 2-minute stability | Ask a follow-up, let it run ~2 min | No disconnect; continuous turn-taking |
| 4 | Interruption | Speak while the professor is speaking | Professor stops, listens, responds — natural, not a crash |
| 5 | Silence | Stay silent 15–20s | Acceptable timeout (agent waits or gently prompts); no error box |
| 6 | Lesson context | In a lesson, ask "What should I focus on here?" | Answer references the actual lesson title/outline |
| 7 | Quiz context (future) | After a quiz, ask "What did I miss?" | Does NOT invent a score; if quiz context unbuilt, gracefully says it can't see the result yet |
| 8 | Error/diagnostic | Force a failure (e.g. deny mic, or disable overrides in ElevenLabs) | Amber box appears with code/reason/likelyCause; console prints `[LiveClass] onDisconnect code=… reason=… likelyCause=…` |

## Recording template
```
Test 1 startup (headphones):  PASS/FAIL  — elapsed before any cutoff: ___s  — amber reason if failed: ___
Test 1 startup (speakers):    PASS/FAIL  — ___
Test 2 30s:                   PASS/FAIL
Test 3 2min:                  PASS/FAIL
Test 4 interruption:          PASS/FAIL
Test 5 silence:               PASS/FAIL
Test 6 lesson context:        PASS/FAIL
Test 8 error diagnostic:      PASS/FAIL  — captured line: ___
```

Report results back; tests 1–3 passing on both headphones and speakers is the bar for "voice is stable."
