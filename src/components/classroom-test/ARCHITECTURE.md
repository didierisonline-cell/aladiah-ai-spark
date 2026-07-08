# AI Classroom — Professor Didier™ voice & lesson-context architecture

**Status: TEST MODE / preview only.** This documents how the official Professor
Didier™ voice (ElevenLabs) and the approved course content will drive the live
teaching experience. The classroom UI is already built to this design; the live
wiring is a drop-in that requires **no layout changes**.

## 1. How the ElevenLabs Professor Didier™ voice connects

```
Lesson content ─▶ Teaching LLM ─▶ response text ─▶ ElevenLabs TTS (Professor Didier™ voice)
                                                     │
                                                     ├─▶ <audio> playback (the voice)
                                                     └─▶ viseme/timing ─▶ lip-synced avatar
```

- The avatar layer is `ProfessorMedia.tsx`, which already exposes a **swappable
  `source` interface** (`ProfessorMediaSource`). Today it plays pre-rendered test
  clips (idle + speaking). In production, the same component accepts a live source:
  the ElevenLabs audio stream plus a talking-head / lip-sync driver — with the
  rest of the classroom untouched.
- Voice = the **official Professor Didier™ ElevenLabs voice ID** (the app already
  depends on `@elevenlabs/react`). No new production voice calls are made in test
  mode; clips are pre-baked.

## 2. How the lesson context controls what he says

The single source of truth is `lessonContext.ts`:

- `LessonContext` captures the **selected program, module, lesson, objectives,
  approved content, current board state, allowed follow-ups, and quiz**.
- `buildProfessorSystemPrompt(ctx)` compiles that into a **constrained teaching
  system prompt** for the LLM. It enforces:
  - teach **only the current lesson** (steer back if the student goes off-topic),
  - be **conversational** (live one-on-one), warm, premium, practical,
  - **reference the whiteboard**, give a **practical workplace example**,
  - offer **follow-ups**: explain again · give an example · quiz me · go deeper · simplify,
  - **not** behave like a generic assistant.

Runtime loop (production):

```
student speaks / taps a prompt
   ─▶ transcript + LessonContext
   ─▶ buildProfessorSystemPrompt() + student turn
   ─▶ Teaching LLM (grounded, on-lesson)
   ─▶ ElevenLabs TTS (Professor Didier™)
   ─▶ ProfessorMedia speaking state (lip-synced) + transcript panel + board updates
```

## 3. What stays the same

Layout, components, and the classroom direction are **unchanged** — this is the
teaching "brain" and voice seam behind the existing UI. `speaking` / idle states,
the mic control, transcript panel, and suggested prompts already map 1:1 to this
loop.
