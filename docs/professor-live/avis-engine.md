# AVIS™ Engine — Visual Teaching System

**Status:** Architecture — Awaiting Founder Approval  
**AVIS:** Aladiah Visual Intelligence System

---

## Redefinition

AVIS is not a diagram viewer.  
AVIS is not a slide component.  
AVIS is not a React widget.

**AVIS is the professor's visual voice.**

When Professor Didier™ speaks, AVIS responds.  
When Professor Didier™ teaches, AVIS illustrates.  
When Professor Didier™ compares, AVIS morphs.  
When Professor Didier™ simplifies, AVIS simplifies.

The student never directly manipulates AVIS.  
The student experiences AVIS through the professor.

---

## How AVIS Works

```
Professor Speaks
      │
      ▼
VoiceEngine (ElevenLabs)
detects intent / receives AVIS command from lesson script
      │
      ▼
AVISEngine.execute(command)
      │
      ▼
BoardLayer transitions visually
      │
      ▼
Student sees the board change as the professor explains it
```

There are two sources of AVIS commands:

1. **LessonDirector** — scripted cues (`board.advance`, `board.goto`)
2. **Student voice** — student asks a question, professor explains with AVIS

---

## AVIS Command Set

```typescript
type AVISCommand =
  // Navigation
  | { type: 'show';     step?: number; animation?: Animation }
  | { type: 'advance';  animation?: Animation }
  | { type: 'rewind';   animation?: Animation }
  | { type: 'goto';     step: number; animation?: Animation }
  | { type: 'reset' }
  | { type: 'hide' }

  // Content
  | { type: 'highlight'; element: string }
  | { type: 'annotate';  element: string; text: string }
  | { type: 'zoom';      target: string; scale: number }
  | { type: 'compare';   diagramA: string; diagramB: string }
  | { type: 'simplify' }
  | { type: 'elaborate' }

  // Scene
  | { type: 'spotlight'; element: string }
  | { type: 'pulse';     element: string }

type Animation = 'fade' | 'draw' | 'slide-in' | 'slide-out' | 'morph' | 'zoom-in' | 'instant';
```

---

## Voice → AVIS Mapping

The `AVISEngine` includes a command resolver that maps professor speech intent to AVIS commands.

### Direct AVIS Commands (from lesson script)

The lesson director fires explicit board cues — no voice parsing needed:

```json
{ "t": 21, "type": "board.advance", "data": { "step": 2, "anim": "draw" } }
```

### Student Voice → AVIS (live interaction)

When a student asks a question during a live ElevenLabs session, the professor (AI) may invoke AVIS. This is handled through a structured response format:

The ElevenLabs system prompt instructs Professor Didier to prefix visual commands:

```
When you want to show something on the board, say:
[AVIS:advance] before explaining the next step.
[AVIS:reset] to return to the beginning.
[AVIS:highlight:sprint-loop] to highlight a specific element.
```

The `CaptionEngine` parses these commands out of the caption stream before displaying:

```typescript
function parseAVISCommands(caption: string): { cleaned: string; commands: AVISCommand[] } {
  const commandPattern = /\[AVIS:([^\]]+)\]/g;
  const commands: AVISCommand[] = [];
  const cleaned = caption.replace(commandPattern, (_, cmd) => {
    commands.push(parseCommand(cmd));
    return '';
  });
  return { cleaned, commands };
}
```

---

## AVIS Diagram Registry

Every program registers its diagrams with AVIS:

```typescript
interface AVISDiagram {
  id: string;
  programId: string;
  lessonId: string;
  title: string;
  type: 'svg-stepped' | 'lottie' | 'canvas' | 'video';
  steps: number;
  render: (step: number, state: AVISState) => React.ReactNode;
  variants?: {
    simplified?: (step: number) => React.ReactNode;
    detailed?: (step: number) => React.ReactNode;
    comparison?: string[];  // IDs of diagrams to compare with
  };
}
```

### Diagram Types

| Type | Phase | Technology | Capabilities |
|------|-------|-----------|-------------|
| `svg-stepped` | Phase 0–1 (current) | Inline SVG | Step reveal, basic animation |
| `lottie` | Phase 1 | Lottie JSON | Rich animation, morph, easing |
| `canvas` | Phase 2 | Fabric.js / Konva | Interactive, zoom, annotate |
| `video` | Phase 3 | `.webm` per step | Cinematic diagram animation |

---

## AVIS State Machine

```
          ┌─────────────────────────────┐
          │         AVIS States         │
          └─────────────────────────────┘

  hidden ──show──→ visible ──advance──→ (next step)
    ↑                │
    │               hide
    └────────────────┘

  visible ──highlight──→ highlighting ──timeout──→ visible
  visible ──zoom──→ zoomed ──unzoom──→ visible
  visible ──compare──→ split-view ──close──→ visible
  visible ──simplify──→ simplified-view ──elaborate──→ visible
```

```typescript
interface AVISState {
  status: 'hidden' | 'visible' | 'transitioning';
  currentDiagramId: string;
  currentStep: number;
  viewMode: 'normal' | 'simplified' | 'detailed' | 'compare';
  highlighted: string | null;
  zoomedTarget: string | null;
}
```

---

## Board in Scene vs. Board as Widget

### Current (widget approach — wrong)

```
[Professor column]  |  [Board column]
```

Board is a separate React component with its own navigation controls.

### AVIS (scene approach — correct)

```
┌─────────────────────────────────────────────────┐
│                  ClassroomStage                  │
│                                                  │
│   ┌──────────────┐      /\                       │
│   │   AVIS Board │     /  \                      │
│   │   (on wall)  │    / Prof│                    │
│   │              │   /      │                    │
│   └──────────────┘  ────────                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

The board is mounted on the virtual classroom wall.  
The professor stands in front of it.  
AVIS controls what appears on the board.  
The student watches, not clicks.

---

## BoardLayer in Scene

The `BoardLayer` component within `SceneEngine`:

```tsx
function BoardLayer({ state, voiceState }: BoardLayerProps) {
  const isActive = voiceState.isSpeaking && state.status === 'visible';

  return (
    <div style={{
      position: 'absolute',
      right: '3%',
      top: '8%',
      width: '40%',
      height: '58%',
      zIndex: 2,
      // Physical board surface
      background: '#040A14',
      borderRadius: 3,
      boxShadow: [
        '0 0 0 2px rgba(255,255,255,.05)',    // thin frame
        '0 0 0 4px rgba(0,0,0,.6)',           // shadow inset
        '0 12px 50px rgba(0,0,0,.75)',        // depth shadow
        '0 0 30px rgba(74,144,245,.12)',      // ambient glow
      ].join(', '),
      // Subtle perspective: board recedes into wall
      transform: 'perspective(1400px) rotateY(-2deg)',
      // Active: spotlight when AVIS is presenting
      filter: isActive ? 'brightness(1.1)' : 'brightness(0.9)',
      transition: 'filter .6s, opacity .5s',
      opacity: state.status === 'hidden' ? 0 : 1,
    }}>
      {/* Board header */}
      <BoardHeader state={state} />
      {/* Diagram render */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {state.currentDiagram?.render(state.currentStep, state)}
      </div>
      {/* Step indicator */}
      <StepIndicator state={state} />
    </div>
  );
}
```

---

## AVIS + Lottie (Phase 1 Upgrade)

The current SVG diagrams are effective but limited. Upgrading to Lottie unlocks:

- Draw-on animations (lines appear as if drawn)
- Morphing (shapes transform smoothly between states)
- Easing (natural physics-based motion)
- Color transitions
- Particle effects (for emphasis)

**Workflow:**

1. Design diagram in Adobe After Effects or Figma
2. Export to Lottie JSON (`bodymovin` plugin)
3. Import `lottie-react` into `AVISEngine`
4. Control playback via `boardStep`

```tsx
import Lottie from 'lottie-react';
import scrumDiagramData from '@/content/scrum/scrum-diagram.lottie.json';

function ScrumDiagramLottie({ step }: { step: number }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    // Each step maps to a frame range in the Lottie animation
    const frameRanges = [
      [0, 30],    // Title
      [30, 80],   // Backlog
      [80, 130],  // Planning
      [130, 200], // Sprint
      [200, 280], // Review
    ];
    const [start, end] = frameRanges[step] ?? [0, 30];
    lottieRef.current?.playSegments([start, end], true);
  }, [step]);

  return <Lottie lottieRef={lottieRef} animationData={scrumDiagramData} loop={false} />;
}
```

---

## AVIS Zoom & Annotation (Phase 2)

When the professor says "let me zoom in on the Sprint cycle":

```typescript
AVISEngine.execute({ type: 'zoom', target: 'sprint-loop', scale: 2.5 });
```

The `BoardLayer` uses CSS `transform: scale()` or Canvas zoom to enlarge a specific element.

When the professor says "notice the feedback loop":

```typescript
AVISEngine.execute({ type: 'highlight', element: 'feedback-arrow' });
```

A CSS `filter: drop-shadow` or `outline` pulses on that element for 3 seconds.

---

## AVIS Compare Mode (Phase 2)

When the professor says "let's compare Scrum to Waterfall":

```typescript
AVISEngine.execute({
  type: 'compare',
  diagramA: 'scrum-v1-cycle',
  diagramB: 'waterfall-v1-cycle',
});
```

The board splits into two panels, each showing a diagram.

---

## Summary

| Feature | Phase 0 (now) | Phase 1 | Phase 2 | Phase 3 |
|---------|--------------|---------|---------|---------|
| Board position | Separate column | Inside scene | Inside scene | Inside scene |
| Control | Manual (student) | LessonDirector | LessonDirector + voice | Fully automatic |
| Animation | CSS opacity | Lottie | Canvas interactive | Video-quality |
| Highlight | None | CSS glow | Animated pointer | 3D pointer gesture |
| Zoom | None | CSS scale | Canvas zoom | Camera zoom |
| Compare | None | None | Split panel | Full morph |
| Annotate | None | None | Text overlay | Professor writes |

*AVIS becomes the classroom board. The professor becomes the teacher who uses it.*
