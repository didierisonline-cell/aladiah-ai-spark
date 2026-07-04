# Scene Engine Architecture

**Status:** Architecture — Awaiting Founder Approval  
**Replaces:** Current `ProfessorPresenceEngine` + `AvisCanvasEngine` (two separate panels)

---

## The Core Principle

The current architecture has two separate regions:

```
[Left Column: Professor]  |  [Right Column: Board]
```

This is wrong. It feels like a dashboard because it **is** a dashboard.

The approved mock feels like a classroom because the professor and the board exist in the **same visual space**, just like a real classroom. A professor stands in front of a board. They are not in separate panels.

The new architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    SceneEngine                           │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │              ClassroomStage                       │  │
│   │                                                   │  │
│   │   [EnvironmentLayer — background, atmosphere]     │  │
│   │                                                   │  │
│   │        ┌─────────────┐  ┌──────────────┐         │  │
│   │        │  BoardLayer │  │              │         │  │
│   │        │  (on wall)  │  │  Professor   │         │  │
│   │        │             │  │   Media      │         │  │
│   │        └─────────────┘  │   Layer      │         │  │
│   │                          └──────────────┘         │  │
│   │                                                   │  │
│   │   [LightingEngine — dynamic scene lighting]       │  │
│   └──────────────────────────────────────────────────┘  │
│                                                          │
│   [TranscriptOverlay — captions at bottom]               │
└─────────────────────────────────────────────────────────┘
```

---

## Engine Hierarchy

```
ProfessorDidierLiveEngine            ← top-level page component
├── SceneEngine                      ← owns ALL visual composition
│   ├── ClassroomStage               ← the single visual canvas
│   │   ├── EnvironmentLayer         ← classroom background + atmosphere
│   │   ├── LightingEngine           ← voice-reactive lighting
│   │   ├── BoardLayer               ← AVIS board, positioned inside scene
│   │   └── ProfessorMediaLayer      ← video / avatar / image
│   └── TranscriptOverlay            ← caption strip below scene
├── VoiceEngine                      ← ElevenLabs (existing)
├── AVISEngine                       ← voice-controlled board logic
├── LessonDirector                   ← timeline orchestration
├── StudentContextEngine             ← student state (existing)
└── InteractionEngine                ← student inputs (existing)
```

---

## SceneEngine

The `SceneEngine` is a single full-area component. It renders everything inside one `position: relative` container — no left/right split.

```tsx
interface SceneEngineProps {
  lessonState: LessonState;
  voiceState: VoiceState;
  boardContent: CanvasContent;
  boardStep: number;
  caption: string;
  professorMedia: ProfessorMedia;
}

// ProfessorMedia describes what to render for the professor
interface ProfessorMedia {
  type: 'image' | 'video' | 'stream' | 'avatar';
  src: string;           // URL to image, video, or stream endpoint
  poster?: string;       // fallback poster frame
  aspectRatio?: number;  // for layout calculations
}
```

### Internal Layout

The scene uses CSS `position: absolute` for all layers within one container — **no flexbox columns**:

```
ClassroomStage (position: relative, 100% × 100%)
│
├── EnvironmentLayer    (inset: 0, z-index: 0)
│   ├── Background image (brightness 0.15)
│   ├── Vignette overlay
│   ├── Overhead studio light
│   └── Floor ambient glow (voice-reactive)
│
├── BoardLayer          (right side of scene, z-index: 1)
│   ├── Positioned at: right: 4%, top: 8%, width: 38%, height: 60%
│   ├── Renders AVIS diagram
│   └── Has subtle physical depth (box-shadow, slight perspective)
│
├── ProfessorMediaLayer (left-center, z-index: 2)
│   ├── Position: left: 8%, bottom: 0, height: 95%
│   ├── <img> / <video> / <WebRTC stream>
│   └── Receives rim-light filter when voice-active
│
├── LightingEngine      (inset: 0, z-index: 3, pointer-events: none)
│   ├── Ambient glow layer (voice-reactive color/intensity)
│   ├── Board spotlight (highlights board when AVIS is active)
│   └── Professor rim light (halo effect)
│
└── TranscriptOverlay   (bottom: 0, z-index: 4)
    ├── Caption text strip
    └── Waveform visualization
```

---

## ClassroomStage Layout — Proportions

The professor and board share the same scene. Their visual relationship:

```
┌──────────────────────────────────────────────────┐
│  [background]                                     │
│                                                   │
│        ┌──────────────────┐                       │
│        │   AVIS Board     │     /|               │
│        │  (on classroom   │    / |               │
│        │      wall)       │   /  |               │
│        │                  │  Professor            │
│        └──────────────────┘  (media layer)        │
│                                                   │
│ ─────────────────────────────────────────────── │
│  [TRANSCRIPT: Professor Didier: "..."]            │
└──────────────────────────────────────────────────┘
```

The board appears to the professor's right, as if mounted on the classroom wall behind and beside him. This is achieved with:

- Board: `position: absolute; right: 4%; top: 10%; width: 40%; height: 58%`
- Professor: `position: absolute; left: 50%; bottom: 0; height: 94%; transform: translateX(-50%)`

The professor overlaps the board slightly (z-index: professor > board), creating natural depth.

---

## EnvironmentLayer

Handles all background and atmospheric rendering.

```tsx
interface EnvironmentLayerProps {
  backgroundSrc: string;      // classroom-bg.jpg
  voiceState: VoiceState;     // affects glow color/intensity
  lesson: LessonState;
}
```

**Layers (inside EnvironmentLayer):**

| Layer | Purpose | CSS |
|-------|---------|-----|
| Background | Classroom photo | `background-image`, `brightness(0.15)` |
| Vignette | Cinematic edge darkening | `radial-gradient` |
| Studio light | Overhead spotlight | `radial-gradient` from top |
| Floor glow | Voice-reactive atmosphere | `radial-gradient` from bottom |
| Frame | Top/bottom darkness | `linear-gradient` |

---

## LightingEngine

Dynamically modifies scene lighting based on voice and lesson state.

```tsx
interface LightingState {
  ambientColor: string;   // '#4A90F5' speaking, '#22C98A' listening
  ambientIntensity: number; // 0.0 – 1.0
  boardSpotlight: boolean;  // true when AVIS is presenting
  professorRimLight: boolean; // true when professor is active
}
```

**Voice state → lighting mapping:**

| Voice State | Ambient Color | Intensity | Board Spotlight |
|------------|--------------|-----------|-----------------|
| idle | blue (dim) | 0.15 | false |
| connecting | amber | 0.10 | false |
| listening | green | 0.45 | false |
| speaking | blue | 0.65 | false |
| board_active | blue | 0.40 | true |
| quiz | purple | 0.35 | false |

---

## ProfessorMediaLayer

This is the **single most important slot** in the architecture. It accepts any professor media format.

```tsx
interface ProfessorMediaLayerProps {
  media: ProfessorMedia;
  voiceState: VoiceState;
  // Called when video segment ends (for LessonDirector)
  onSegmentEnd?: () => void;
}

type ProfessorMedia =
  | { type: 'image';  src: string }                          // Phase 0: static PNG
  | { type: 'video';  src: string; poster: string }          // Phase 1: HeyGen MP4
  | { type: 'stream'; endpoint: string; token: string }      // Phase 2: D-ID WebRTC
  | { type: 'avatar'; config: AvatarConfig }                 // Phase 3: custom avatar
```

The component renders the appropriate element based on `media.type`:

```tsx
// Phase 0 (current)
<img src={media.src} style={{ height: '95%' }} />

// Phase 1 (HeyGen video)
<video src={media.src} poster={media.poster} autoPlay />

// Phase 2 (D-ID real-time)
<WebRTCStream endpoint={media.endpoint} token={media.token} />

// Phase 3 (custom avatar)
<AvatarRenderer config={media.config} voiceSync={voiceState} />
```

**This is the slot.** Replacing the professor from static PNG → live avatar requires **only changing the `media` prop**. The rest of the system does not change.

---

## BoardLayer

The teaching board, now positioned INSIDE the scene.

```tsx
interface BoardLayerProps {
  content: CanvasContent;
  step: number;
  isActive: boolean;     // true when AVIS is presenting (affects lighting)
  onStepChange: (step: number) => void;
}
```

**Positioning within scene:**

```tsx
<div style={{
  position: 'absolute',
  right: '3%',
  top: '8%',
  width: '40%',
  height: '58%',
  zIndex: 2,
  // Physical board effect
  background: '#040A14',
  borderRadius: 4,
  boxShadow: '0 0 0 2px rgba(255,255,255,.06), 0 8px 40px rgba(0,0,0,.7)',
  // Subtle perspective — board recedes into wall
  transform: 'perspective(1200px) rotateY(-1.5deg)',
}}>
  {content.renderDiagram(step)}
</div>
```

**The board does NOT have its own navigation controls in the scene view.**  
Board advances are controlled by the `LessonDirector` (timeline) or `AVISEngine` (voice command).  
Manual controls exist in a secondary "instructor mode" only.

---

## TranscriptOverlay

Captions rendered as an overlay at the bottom of the `ClassroomStage`.

```tsx
<div style={{
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  zIndex: 5,
  padding: '24px 28px 18px',
  background: 'linear-gradient(to top, rgba(3,7,16,1) 0%, rgba(3,7,16,.85) 65%, transparent 100%)',
}}>
  <ProfessorNameplate />
  <CaptionText caption={caption} />
  <AudioWaveform active={isConnected} speaking={isSpeaking} />
</div>
```

---

## Sidebar (unchanged)

The sidebar remains as a separate component outside the `SceneEngine` — it displays class flow, session context, and quick commands. It does not change with this architecture.

---

## Component Tree (Final)

```
ProfessorDidierLiveClassroom
├── TopBar
├── ContentRow
│   ├── ClassFlowPanel (sidebar, 160px)
│   └── SceneEngine (fills remaining width)
│       └── ClassroomStage
│           ├── EnvironmentLayer
│           ├── BoardLayer (positioned inside scene)
│           ├── ProfessorMediaLayer (positioned inside scene)
│           ├── LightingEngine
│           └── TranscriptOverlay
├── VoiceControlPanel (dock)
└── StatusBar
```

---

## Migration Path

| Phase | Professor | Board Position | What Changes |
|-------|-----------|---------------|--------------|
| 0 (current) | Static PNG, left col | Right col widget | Nothing yet |
| 1 | Static PNG | Inside scene | Layout restructure only |
| 2 | HeyGen video | Inside scene | `media.type = 'video'` |
| 3 | D-ID stream | Inside scene | `media.type = 'stream'` |
| 4 | Custom avatar | Inside scene | `media.type = 'avatar'` |

The `ProfessorMediaLayer` slot is the only thing that changes between phases.

---

*Next step: Founder approves → implement Phase 1 layout restructure (board inside scene, static PNG professor).*
