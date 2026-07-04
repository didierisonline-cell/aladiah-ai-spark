# Professor Didier™ Production Pipeline

**Status:** Architecture — Awaiting Founder Approval  
**Scope:** Complete end-to-end pipeline from concept to student experience

---

## The Central Shift

The classroom is no longer a UI component.  
It is a **cinematic teaching stage** produced with professional media tools  
and delivered through a React application.

The React application is the **projection room**.  
The professor is the **film**.

---

## Pipeline Overview

```
Founder (Vision + Curriculum)
         │
         ▼
 Lesson Script
 (learning objectives, talking points, demonstrations, transitions)
         │
         ▼
 Lesson Director
 (storyboard, cue sheet, timing, board sequence, gestures)
         │
         ├──────────────────────────────────────┐
         ▼                                      ▼
  Professor Asset Pipeline              AVIS Board Pipeline
  (media production)                    (diagram production)
         │                                      │
         ▼                                      ▼
  Voice: ElevenLabs                    SVG / Lottie / Canvas
  Video: HeyGen / D-ID                 Animated diagrams
  Background: Midjourney / Flux        Board transitions
  Composite: ComfyUI / Runway          Step-by-step reveals
         │                                      │
         ▼                                      ▼
  Compressed Media                     Diagram Assets
  (.mp4, .webm, .webp)                 (.json, .svg, .mp4)
         │                                      │
         └──────────────┬───────────────────────┘
                        ▼
               CDN / Supabase Storage
                        │
                        ▼
            React Classroom (SceneEngine)
                        │
                        ▼
                    Student
```

---

## Stage 1: Curriculum & Script

**Owner:** Founder + Curriculum Excellence Agent  
**Output:** Lesson script document

### Script Format

```markdown
# Lesson 1.1 — What is Scrum?

## Professor Cues
- [00:00] Enter classroom, face camera
- [00:04] "Welcome back. Today we're going to talk about Scrum..."
- [00:09] [board: show title] "You may have heard this word before..."
- [00:15] [board: reveal product-backlog] "Scrum starts with a list..."
- [00:21] [board: reveal sprint-planning] "Then the team decides..."
- [00:28] [board: reveal sprint-loop] "And the Sprint begins..."
- [00:44] [gesture: point-right] "Notice the Daily Scrum cycle..."
- [01:03] "Before we continue — what questions do you have?"
- [01:10] [interactive: pause for student]

## Board Sequence
1. Title Card
2. Product Backlog
3. Sprint Planning Arrow
4. Sprint Loop
5. Daily Scrum
6. Review + Retro
7. Full Diagram

## Learning Objectives
- Define Scrum as a framework, not a process
- Identify the three accountabilities
- Understand the Sprint as the core unit
```

---

## Stage 2: Lesson Director (Storyboard)

**Owner:** Product Builder Agent / Lesson Director  
**Output:** Cue sheet `.json` file per lesson

### Cue Sheet Format

```json
{
  "lessonId": "scrum-v1-1-1",
  "duration": 420,
  "cues": [
    { "t": 0,   "type": "professor.state",  "data": { "emotion": "welcoming", "gesture": "neutral" } },
    { "t": 4,   "type": "professor.speak",  "data": { "segment": 1 } },
    { "t": 9,   "type": "board.show",       "data": { "step": 0, "animation": "fade" } },
    { "t": 15,  "type": "board.advance",    "data": { "step": 1, "animation": "draw" } },
    { "t": 21,  "type": "board.advance",    "data": { "step": 2, "animation": "slide" } },
    { "t": 28,  "type": "board.advance",    "data": { "step": 3, "animation": "draw" } },
    { "t": 44,  "type": "professor.gesture","data": { "type": "point-right" } },
    { "t": 63,  "type": "lesson.pause",     "data": { "reason": "student-interaction" } }
  ]
}
```

---

## Stage 3: Professor Asset Production

### 3a. Base Media

**Option A — HeyGen Avatar (Phase 1, recommended)**
- Input: Professional photo of Professor Didier (existing)
- Input: ElevenLabs audio segments per lesson
- Output: `.mp4` per segment (lip-synced talking head)
- Timeline: 1–2 hours per lesson set

**Option B — D-ID Real-Time Streaming (Phase 2)**
- Input: Photo + live ElevenLabs audio stream
- Output: Real-time WebRTC video stream
- Timeline: Real-time, no pre-generation needed
- Enables: Truly live professor who responds to student questions

**Option C — Custom AI Avatar (Phase 3)**
- Input: Real video footage of Professor Didier (30 min)
- Process: Fine-tune HeyGen/D-ID on real face
- Output: Hyper-realistic avatar indistinguishable from real footage
- Timeline: 2–3 weeks

**Option D — Unreal MetaHuman (Phase 4, long-term)**
- Input: 3D face scan
- Output: Real-time photorealistic animated professor
- Enables: Gestures, blinking, breathing, pointing, full body

### 3b. Classroom Background

**Tool:** Midjourney v6 / Flux Dev  
**Prompts:**

```
Cinematic university classroom interior, dark academia, moody blue-navy lighting,
wooden lectern, large blackboard, bookshelves, warm spotlights, 
professional professor environment, photorealistic, 8K, anamorphic lens, 
no people visible, depth of field
```

**Output:** 1920×1080 JPEG background per environment variant  
- Default: Evening lecture hall  
- Variant A: Modern classroom  
- Variant B: Library  

### 3c. Composite Scene

**Tool:** ComfyUI workflow  
**Process:**
1. Background (Midjourney output)
2. Professor video (HeyGen output)
3. Chroma-key or segmentation mask
4. Lighting match pass
5. Color grade (match dark navy palette)
6. Output: Final composite video per lesson

---

## Stage 4: AVIS Board Production

**See:** `avis-engine.md` for full spec

**Short version:**
- Diagrams produced as Lottie animations (`.json`) for step-by-step reveal
- OR SVG with CSS animations (current approach, good for Phase 1)
- OR Canvas-rendered with Fabric.js for interactive morphing (Phase 2)
- Professor voice triggers board transitions via AVIS Engine

---

## Stage 5: Compression & Delivery

### Professor Video
- Format: `.mp4` (H.264 for compatibility) + `.webm` (VP9 for quality)
- Resolution: 1920×1080 for desktop, 960×540 for mobile
- Bitrate: ~1.5 Mbps (H.264, acceptable quality)
- Segments: One file per logical lesson section (60–120 seconds each)
- Delivery: Supabase Storage → Vercel CDN → `<video>` element

### Board Diagrams
- Format: `.json` (Lottie) or `.svg`
- Compression: Gzip (SVG: 60–80% reduction)
- Delivery: Bundled with application (small) or CDN (larger)

### Streaming Strategy
```
Lesson loads → prefetch next segment while current plays
→ seamless chapter transitions
→ no loading screens
```

---

## Stage 6: React Delivery

**See:** `scene-engine-architecture.md` for full spec

**Short version:**
- `SceneEngine` owns the entire visual composition
- Professor video and board are ONE scene, not two panels
- `LessonDirector` advances the timeline (board transitions, states)
- `VoiceEngine` (ElevenLabs) handles live interaction
- `AVISEngine` maps voice commands → board changes

---

## Roles & Ownership

| Stage | Owner | Tool |
|-------|-------|------|
| Script | Founder + Curriculum Agent | Google Docs / Markdown |
| Storyboard | Product Builder Agent | Cue sheet JSON |
| Professor photo | Professional photographer | DSLR / studio |
| Voice | ElevenLabs (existing) | API |
| Talking head video | HeyGen | API |
| Background | Midjourney / Flux | Prompt |
| Composite | ComfyUI | Workflow |
| Board animation | Lottie / SVG | LottieFiles / code |
| Compression | ffmpeg | CLI |
| CDN | Supabase Storage | Dashboard |
| React delivery | Engineering | SceneEngine |

---

## Current State vs. Production State

| Dimension | Current (Phase 0) | Production (Phase 1) | Full (Phase 3) |
|-----------|-------------------|----------------------|----------------|
| Professor | Static PNG | HeyGen talking head | Custom avatar |
| Voice | ElevenLabs live | ElevenLabs live | ElevenLabs live |
| Board | React SVG | Lottie animated | Voice-controlled |
| Background | CSS background | Professional composite | Real-time scene |
| Interaction | Text prompts | Voice only | Voice + gesture |
| Sync | Manual step buttons | Timeline-driven | Fully automated |

---

*Next step: Founder reviews and approves architecture before any implementation begins.*
