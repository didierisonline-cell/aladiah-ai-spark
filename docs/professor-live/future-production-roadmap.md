# Future Production Roadmap

**Status:** Architecture — Awaiting Founder Approval  
**Scope:** Phased evolution of the Professor Didier™ classroom from current state to full cinematic production

---

## Roadmap at a Glance

```
Phase 0 (NOW)          Phase 1                Phase 2               Phase 3              Phase 4
Static PNG             HeyGen talking head    Live D-ID / Tavus     Custom avatar         Unreal MetaHuman
CSS layout             SceneEngine layout     Real-time stream      Fine-tuned model      Hollywood-grade 3D
Manual board           Timeline-driven        Voice-controlled      Fully orchestrated    Fully embodied
ElevenLabs live        ElevenLabs live        ElevenLabs + Tavus    Custom AI model       Real-time gestural

~Now                   ~3–6 months            ~6–12 months          ~12–24 months         ~2–3 years
```

---

## Phase 0 — Current State (Live Now)

**Theme:** Foundation working, visual quality limited

### What is working

| Feature | Status |
|---------|--------|
| ElevenLabs live voice | ✅ Live |
| Student prompt interaction | ✅ Live |
| AVIS board with SVG diagrams | ✅ Live |
| Manual board navigation | ✅ Live |
| Professor static PNG | ✅ Live |
| Basic classroom layout | ✅ Live |
| Captions / transcript | ✅ Live |
| Quiz engine | ✅ Live |

### Limitations

- Professor is a static illustration in a UI card
- Board and professor are in separate React columns (dashboard feel)
- Board advances only when student clicks — no cinematic sync
- No visual distinction between professor speaking / listening / idle
- Background is a CSS gradient, not a real classroom

### What triggers Phase 1

Founder approves architecture → implementation begins.

---

## Phase 1 — Cinematic Foundation

**Theme:** Professor + Board in ONE scene. Real lip-synced video.  
**Timeline:** 3–6 months from approval  
**Monthly cost:** ~$65–$165

### Deliverables

#### 1. SceneEngine Layout Restructure

Replace two-panel `[Professor | Board]` layout with `ClassroomStage`:

```
Before:
[Professor Column 58%] | [Board Column 42%]

After:
┌─────────────────────────────────────────────────┐
│               ClassroomStage                     │
│                                                  │
│   ┌──────────────┐        /|                     │
│   │  AVIS Board  │       / |                     │
│   │  (on wall)   │      /  |  Professor          │
│   │              │     /   |  (media layer)      │
│   └──────────────┘                               │
│                                                  │
│  [TRANSCRIPT: Professor Didier: "..."]            │
└─────────────────────────────────────────────────┘
```

- `EnvironmentLayer` renders classroom background as 5-layer atmospheric stack
- `BoardLayer` positioned inside scene at `right: 3%; top: 8%; width: 40%; height: 58%`
- `ProfessorMediaLayer` positioned inside scene at left-center
- `LightingEngine` reacts to voice state
- `TranscriptOverlay` anchored at bottom

#### 2. HeyGen Avatar Integration

- Founder provides professional photo (studio quality)
- HeyGen avatar created from photo
- ElevenLabs audio generated per lesson segment
- HeyGen API produces lip-synced `.mp4` per segment
- Segments compressed and uploaded to Supabase Storage
- `ProfessorMediaLayer.type = 'video'`

**First lesson:** Lesson 1.1 — What is Scrum?  
Produces 5–7 segments of ~60–90 seconds each.

#### 3. LessonDirector Implementation

- Cue sheet JSON format defined
- `useLessonDirector` hook built
- Board advances automatically from video timestamp sync
- Student no longer clicks to advance board
- Pause points scripted for student interaction

#### 4. Flux Background Generation

- 3 classroom environment variants generated
- Default: Evening lecture hall (dark navy)
- Used in `EnvironmentLayer` as background image

#### 5. Rive Board Upgrade (Optional Phase 1)

- Scrum diagram rebuilt as `.riv` animation file
- Animated in-browser via `@rive-app/react-webgl2`
- State machine driven by `boardStep` from `LessonDirector`

### Phase 1 Success Criteria

- [ ] Professor video plays lip-synced inside the classroom scene
- [ ] Board advances automatically in sync with professor speech
- [ ] No manual clicking required during lesson playback
- [ ] Scene feels like ONE visual space (not two panels)
- [ ] Student can still ask questions via voice; professor responds live
- [ ] Classroom loads in under 3 seconds on broadband

---

## Phase 2 — Live Interactive Professor

**Theme:** Professor responds to students in real time, with video  
**Timeline:** 6–12 months from Phase 1 completion  
**Monthly cost:** ~$150–$400+

### Deliverables

#### 1. Tavus CVI Integration (Recommended)

Replace pre-recorded HeyGen video with live Tavus conversational video interface:

```tsx
// ProfessorMediaLayer.type = 'stream' → Tavus CVI
<CviContainer
  conversationId={session.tavusConversationId}
  onMessage={handleStudentMessage}
  onBoardCommand={avisbEngine.execute}
/>
```

- Professor avatar sees and responds to student questions in real time
- No pre-generation of video segments required
- `LessonDirector` still manages board; Tavus handles professor

**Alternative:** D-ID Streaming + ElevenLabs (if Tavus is out of budget)  
- Requires custom WebRTC wrapper (no native React SDK)
- 1280×1280 max resolution on standard tier
- 5-minute cap per stream session on standard plans

#### 2. AVIS Voice Control

Professor AI (Tavus or ElevenLabs) embeds AVIS commands in speech:

```
Professor speaks: "[AVIS:advance] Now let's look at the Sprint cycle..."
CaptionEngine parses [AVIS:advance], strips from caption, fires to AVISEngine
AVISEngine advances board → student sees board change as professor explains
```

#### 3. Advanced AVIS Commands

- `highlight` — CSS pulse on specific diagram element
- `zoom` — CSS scale on element when professor says "let me zoom in"
- `simplify` — switch to simplified diagram variant
- `compare` — split-panel showing two diagrams side by side

#### 4. LightingEngine Full Implementation

- Board spotlight activates when `[AVIS:*]` commands fire
- Professor rim light reacts to voice state
- Scene mood changes per lesson section (welcoming → focused → interactive)

#### 5. Higgsfield Soul ID (Optional — course library consistency)

If the course library grows beyond 10 lessons:
- Switch from HeyGen to Higgsfield Soul ID for pre-recorded segments
- Soul ID maintains exact professor identity across all lessons
- Requires WAV audio input (convert ElevenLabs MP3)

### Phase 2 Success Criteria

- [ ] Professor responds to student questions with live video
- [ ] Board changes visually when professor references it (AVIS voice control)
- [ ] Student never needs to touch the board
- [ ] Highlight and zoom work on demand
- [ ] Session latency under 500ms for board response to professor speech

---

## Phase 3 — Custom Avatar

**Theme:** Professor Didier™ is indistinguishable from real footage  
**Timeline:** 12–24 months  
**Monthly cost:** Depends on platform chosen

### Deliverables

#### 1. Real Footage Recording

- Record 30–60 minutes of real Professor Didier™ video
- High-quality studio production: camera, lighting, backdrop
- Multiple emotional states: welcoming, explaining, emphasizing, questioning
- Raw footage used as fine-tuning input

#### 2. Avatar Fine-Tuning

**Option A — HeyGen Custom Avatar (simplest)**
- Fine-tune HeyGen on real footage
- Produces more realistic lip sync and expression
- Maintains same React integration

**Option B — Tavus Custom Persona (recommended if Tavus is chosen)**
- Upload footage → Tavus builds photorealistic avatar
- Real-time response quality improves dramatically with custom persona

**Option C — Eleven Labs Voice + D-ID Custom Model**
- Both voice clone and video avatar fine-tuned on real footage
- Highest realism achievable without 3D pipeline

#### 3. Gesture System

Professor can point, nod, gesture toward board:
- HeyGen/Tavus: gesture triggers via API parameters
- D-ID: emotion parameters approximate gesture intent

#### 4. Multi-Course Identity

Single Professor Didier™ avatar deployed across all programs:
- AI Scrum Master
- AI Product Manager
- AI GRC Analyst
- AI Cybersecurity Analyst

Consistent appearance, voice, and teaching style across all four programs.

### Phase 3 Success Criteria

- [ ] Professor avatar is photorealistic — new students cannot tell it is AI
- [ ] Professor makes appropriate gestures toward the board
- [ ] Same avatar used across all four programs
- [ ] Voice and appearance consistent across 100+ lesson segments

---

## Phase 4 — Unreal MetaHuman (Long-Term)

**Theme:** Hollywood-grade 3D professor with full body, real-time gesture, and Pixel Streaming  
**Timeline:** 2–3 years from now  
**Trigger:** Student concurrent sessions justify $0.50–$1.00/user/hr GPU cost

### Architecture

```
Professor Didier™ (3D MetaHuman)
    │
    ├── Unreal Engine 5.6+
    │   ├── MetaHuman face rig (built from 3D face scan of real professor)
    │   ├── Full body motion (gestures, pointing, walking)
    │   ├── NVIDIA ACE or Convai for real-time lip sync
    │   └── Pixel Streaming (WebRTC)
    │
    ▼
React ProfessorMediaLayer (type: 'avatar')
    ↑
Browser WebRTC client
```

### Requirements

- Professional 3D face scan (photogrammetry or dedicated scanner)
- Unreal Engine 5.6+ project on GPU server
- Signaling Server for Pixel Streaming WebRTC
- NVIDIA ACE or Convai SDK for real-time audio-driven animation
- GPU cluster: ~$0.50–$1.00/concurrent user/hour

### When to implement

Only when Aladiah Academy has:
- Sufficient revenue to justify GPU infrastructure per concurrent student
- Proven product-market fit (the content drives outcomes)
- Engineering team capable of Unreal Engine 5 development

**Do not implement Phase 4 before Phase 2 is stable and profitable.**

**MetaHuman Creator web app retires November 5, 2026.** After that date, MetaHumans must be created inside Unreal Engine editor.

---

## Summary Comparison Table

| Dimension | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|-----------|---------|---------|---------|---------|---------|
| Professor | Static PNG | HeyGen MP4 | Tavus live | Custom fine-tuned | MetaHuman 3D |
| Scene | Two-panel CSS | SceneEngine | SceneEngine | SceneEngine | Pixel Streaming |
| Board control | Manual (student) | LessonDirector | LessonDirector + AVIS voice | Fully automated | Fully automated |
| Board animation | SVG reveal | Lottie | Canvas interactive | Video-quality | Real-time |
| Voice | ElevenLabs live | ElevenLabs live | Tavus CVI built-in | Custom model | NVIDIA ACE |
| Real-time response | Yes (voice only) | No (pre-recorded) | Yes (video + voice) | Yes | Yes |
| Student sees | Static photo | Pre-recorded video | Live avatar | Photorealistic | 3D professor |
| Est. monthly cost | $22 | $65–$165 | $150–$400 | $200–$600 | GPU intensive |
| Eng. complexity | Low | Medium | High | Very high | Extreme |
| Time to ship | Now | 3–6 months | 6–12 months | 12–24 months | 2–3 years |

---

## Decision Gates

Before advancing to each phase, the following must be true:

**Phase 0 → Phase 1:**
- [ ] Architecture documents approved by Founder
- [ ] Professional photo of Professor Didier™ delivered
- [ ] HeyGen account created and avatar uploaded
- [ ] First lesson script finalized

**Phase 1 → Phase 2:**
- [ ] At least one complete lesson produced and delivered to real students
- [ ] Student completion rate ≥ 70%
- [ ] Student satisfaction on professor quality ≥ 4/5
- [ ] Tavus or D-ID contract approved

**Phase 2 → Phase 3:**
- [ ] Course revenue justifies increased production cost
- [ ] Student feedback explicitly references professor quality
- [ ] Video recording session scheduled with real Professor Didier™

**Phase 3 → Phase 4:**
- [ ] Aladiah Academy reaches minimum 500 concurrent students
- [ ] Revenue runway sufficient to sustain GPU infrastructure
- [ ] Engineering team includes Unreal Engine experience

---

## Immediate Next Steps (Founder Action Required)

1. **Approve this architecture** — so engineering can begin Phase 1 implementation
2. **Commission professional photo shoot** — Professor Didier™ source photo for HeyGen
3. **Create HeyGen account** — Creator plan ($24/mo), upload avatar photo
4. **Finalize Lesson 1.1 script** — the first lesson to be produced
5. **Select classroom background** — approve one of three Flux-generated options

Engineering does not proceed until Founder approves.

---

*The classroom is built once. The professor is produced continually. Each phase makes the professor more present, more responsive, and more real.*
