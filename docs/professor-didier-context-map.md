# Professor Didier™ — Student Context Map (Phase 6)

What context reaches the live voice agent today, its source, and whether it is wired now or a future enhancement. **Rule: never invent missing context — pass "unknown" or omit.**

| Context field | Source (table / file) | Wired to voice now? | Notes / privacy |
|---|---|---|---|
| Current lesson title | `getTitle(currentLesson)` in `ChapterView.tsx` | ✅ yes (override prompt) | public course data |
| Current module/chapter title | `chapter.title` in `ChapterView.tsx` | ✅ yes | public |
| Lesson outline/transcript | `getTranscript(currentLesson)`, first 800 chars | ✅ yes | public; trimmed for ElevenLabs override size limits |
| Current route/page | React Router (`ChapterView` is the lesson route) | ✅ implicit (component only mounts in-lesson) | — |
| Language | `useLanguage()` → `language` | ✅ yes (`agent.language` override) | — |
| Student name | `profiles.full_name` | ❌ not yet | **MVP candidate** — inject if present, else "unknown". PII: first name only in prompt. |
| Selected program | `profiles.free_course_id` → course title | ❌ not yet | MVP candidate |
| Current course | route `courseId` | ⚠️ available, not injected | easy add |
| Progress summary | `useProgress(userId)` → `pct`, chapters | ❌ not yet | MVP candidate; pass a short phrase ("35% through, 3 of 8 chapters passed") |
| Quiz status / last score | `quiz_attempts` | ❌ future | needed for Quiz Review mode; must pass REAL values only (no invention) |
| Weak / strong areas | `student_learning_profiles` | ❌ future | exists in DB (cross-program row); wire after MVP |
| Simulation history | `simulation_attempts` | ❌ future | — |
| Career goal | not stored | ❌ future | needs a capture point first |

## Minimum viable context payload (recommended next implementation)

Extend `ChapterView.tsx` `startSession` to add, into the override prompt, only what is already fetched on the page:
```
Student name: <profiles.full_name or "unknown">
Program: <selected program title or "unknown">
Progress: "<pct>% overall, <chaptersCompleted> of <chaptersTotal> chapters passed" or "unknown"
```
All three are already available client-side on the portal (no new query needed on the lesson page beyond a single `profiles`/progress read). Fields resolve to `"unknown"` when absent — the prompt instructs the agent to ignore unknown fields. **No quiz scores or completion claims** are passed until Quiz Review mode is built with verified data.

## Privacy / security
- Only first name + coarse progress enter the prompt. No email, no payment, no PII beyond name.
- Context is injected client-side into the ElevenLabs override at session start; it is not persisted by Aladiah beyond the transcript the student already sees.
- The agent is instructed never to state completion/grades/payment unless present in context — the anti-invention rule is both prompt-level and a spec behavior rule.
