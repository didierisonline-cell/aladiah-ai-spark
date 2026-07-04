# Lesson Director

**Status:** Architecture — Awaiting Founder Approval  
**Purpose:** Timeline-driven orchestration of professor, board, and classroom state

---

## The Problem with Manual Control

The current classroom requires students to manually click to advance the board.  
This breaks the cinematic experience.

A real professor doesn't wait for students to click "Next."  
A real professor teaches at their own pace.  
The board responds to the professor.

The `LessonDirector` makes the classroom behave like a real lesson.

---

## What the Lesson Director Does

```
                    LessonDirector
                         │
         ┌───────────────┼────────────────┐
         ▼               ▼                ▼
    SceneEngine      AVISEngine       VoiceEngine
    (board step,     (diagram         (pause, resume,
     lighting)        transitions)     segment play)
```

The `LessonDirector`:
1. Reads a **cue sheet** (JSON timeline per lesson)
2. At each timestamp, fires a **cue** to the relevant engine
3. Pauses for **student interaction** when scripted
4. Resumes based on **voice trigger** or **timeout**

---

## Cue Sheet Format

One `.json` file per lesson, stored in `src/content/{program}/lessons/{id}.cues.json`.

```json
{
  "lessonId": "scrum-v1-1-1",
  "programId": "ai-scrum-master",
  "title": "What is Scrum?",
  "totalDuration": 420,
  "segments": [
    {
      "id": "intro",
      "start": 0,
      "end": 62,
      "professorSegment": "intro.mp4",
      "cues": [
        { "t": 0,  "type": "scene.state",       "data": { "mood": "welcoming" } },
        { "t": 4,  "type": "professor.speaking", "data": { "segment": "intro" } },
        { "t": 9,  "type": "board.show",         "data": { "step": 0, "anim": "fade-in" } },
        { "t": 15, "type": "board.advance",      "data": { "step": 1, "anim": "draw" } },
        { "t": 21, "type": "board.advance",      "data": { "step": 2, "anim": "slide-in" } },
        { "t": 28, "type": "board.advance",      "data": { "step": 3, "anim": "draw" } },
        { "t": 44, "type": "professor.gesture",  "data": { "type": "point-right" } },
        { "t": 58, "type": "board.advance",      "data": { "step": 4, "anim": "draw" } }
      ]
    },
    {
      "id": "interaction-1",
      "start": 62,
      "end": null,
      "type": "pause",
      "pauseReason": "student-question",
      "resumeConditions": {
        "voiceTrigger": "continue",
        "timeoutSeconds": 30
      }
    },
    {
      "id": "explanation",
      "start": null,
      "end": null,
      "professorSegment": "explanation.mp4",
      "cues": [
        { "t": 0,  "type": "board.reset",        "data": {} },
        { "t": 3,  "type": "board.show",         "data": { "step": 0 } }
      ]
    }
  ],
  "quizCue": { "afterSegment": "explanation", "type": "quiz.start" }
}
```

---

## Cue Types

| Cue Type | Description | Target Engine |
|----------|-------------|---------------|
| `scene.state` | Set overall scene mood/lighting | SceneEngine |
| `board.show` | Show board (initially hidden) | AVISEngine |
| `board.advance` | Advance to next diagram step | AVISEngine |
| `board.goto` | Jump to specific step | AVISEngine |
| `board.reset` | Reset board to step 0 | AVISEngine |
| `board.hide` | Hide board from scene | AVISEngine |
| `professor.speaking` | Start/resume professor video segment | SceneEngine |
| `professor.gesture` | Trigger gesture (future, for avatar) | SceneEngine |
| `lighting.change` | Change scene lighting | LightingEngine |
| `lesson.pause` | Pause for student interaction | LessonDirector |
| `lesson.resume` | Resume after pause | LessonDirector |
| `quiz.start` | Trigger quiz modal | QuizEngine |
| `caption.show` | Force a caption | CaptionEngine |

---

## LessonDirector React Hook

```tsx
interface LessonDirectorConfig {
  cueSheet: CueSheet;
  onCue: (cue: Cue) => void;
  autoAdvance: boolean;    // true = timeline-driven; false = manual
}

interface LessonDirectorState {
  segmentId: string;
  elapsedMs: number;
  isPaused: boolean;
  isWaitingForStudent: boolean;
  currentCueIndex: number;
}

function useLessonDirector(config: LessonDirectorConfig): {
  state: LessonDirectorState;
  play: () => void;
  pause: () => void;
  resume: (trigger: 'voice' | 'click' | 'timeout') => void;
  seek: (segmentId: string) => void;
  skipToInteraction: () => void;
}
```

### How it fires cues

```tsx
useEffect(() => {
  if (state.isPaused) return;
  const timer = setInterval(() => {
    const nextCue = getNextCue(state.elapsedMs, cueSheet);
    if (nextCue) {
      config.onCue(nextCue);
      if (nextCue.type === 'lesson.pause') {
        setState(s => ({ ...s, isPaused: true, isWaitingForStudent: true }));
      }
    }
  }, 100);
  return () => clearInterval(timer);
}, [state.isPaused, state.elapsedMs]);
```

---

## Two Modes

### Mode 1: Pre-Recorded (Phase 1)

Used when professor content is pre-generated video (HeyGen).

```
LessonDirector reads cue sheet
→ fires board.advance cues in sync with video timestamp
→ board advances automatically as professor speaks
→ student does not click anything
```

Board sync is achieved by tracking the `<video>` element's `currentTime`:

```tsx
videoRef.current.ontimeupdate = () => {
  const t = videoRef.current.currentTime;
  director.syncToVideoTime(t);
};
```

### Mode 2: Live Voice (Phase 0, current / ElevenLabs)

Used when professor content is live ElevenLabs voice (no video).

```
ElevenLabs generates real-time speech
→ LessonDirector still manages board state
→ Voice commands from AVIS Engine trigger board advances
→ OR student manually clicks to advance
```

The `LessonDirector` in live mode acts as a **state machine** rather than a timeline:
- Current lesson position tracked by `lessonState.currentLessonIndex`
- Board step tracked by `lessonState.boardStep`
- Voice commands via `AVISEngine` trigger state transitions

---

## Student Interaction Points

Interaction pauses are scripted into the cue sheet. When reached:

1. Board **holds** at current state
2. Professor video **pauses** (or loops idle animation)
3. Student prompt panel **highlights** (subtle glow)
4. Timer counts down (30s default)
5. If student speaks: `VoiceEngine` captures → `InteractionEngine` processes → `LessonDirector.resume()`
6. If timer expires: `LessonDirector.resume('timeout')`

---

## Idle States

Between segments and during pauses, the professor doesn't freeze. The system plays:

**Phase 0 (current):** Static image — acceptable placeholder  
**Phase 1 (HeyGen):** A looping "idle" video clip (5–10 seconds, seamless loop)  
**Phase 2 (D-ID stream):** Real-time avatar continues to breathe/blink  
**Phase 3 (custom):** Full idle animation (breathing, looking around)

Idle clips are specified in the cue sheet:

```json
{ "type": "professor.idle", "data": { "clip": "idle-listening.mp4", "loop": true } }
```

---

## Timeline Visualization (for Founder)

```
TIME:    0       9       15      21      28      44      58     62
         │       │       │       │       │       │       │      │
BOARD:   ──────  [title] ──────[bklog]─[plan]──[sprint]──────[retro]
         hidden  shows           ↑       ↑       ↑       │      ↑
VOICE:   ════════════════════════════════════════════════│══════════
         (professor speaking throughout)                 │
PAUSE:                                                   │ ◄─ wait for student
         ────────────────────────────────────────────────┤
GESTURE:                                         [point-right]
```

---

## Phase Progression

| Phase | Timeline | Board Control | Professor |
|-------|----------|--------------|-----------|
| 0 | Manual (student clicks) | Student | Static PNG |
| 1 | Auto (video timestamp) | LessonDirector | HeyGen video |
| 2 | Auto + voice override | LessonDirector + AVIS | D-ID stream |
| 3 | Fully orchestrated | AVIS + LessonDirector | Custom avatar |

---

*The LessonDirector is the backbone of the cinematic classroom. Every other engine reports to it.*
