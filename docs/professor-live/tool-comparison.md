# AI Tool Comparison — Professor Didier™ Production

**Status:** Research Document — Awaiting Founder Approval  
**Research date:** July 2026 (verified against live documentation and APIs)

---

## Tool Map by Pipeline Stage

```
STAGE                       RECOMMENDED TOOL(S)

Professor talking video  →  HeyGen (pre-recorded) · Kling Avatar 2.0 · Higgsfield Soul
Professor live avatar    →  Tavus CVI · Runway GWM-1 · D-ID Streaming
Background / scene       →  Flux (via fal.ai) · Adobe Firefly
Scene generation / b-roll → Runway Gen-4 · Higgsfield DOP
Board animation          →  Rive · Lottie
Voice synthesis          →  ElevenLabs (already integrated)
ComfyUI compositing      →  Phase 2+ advanced pipeline
Future avatar            →  Unreal MetaHuman (long-term)
```

---

## Talking Head / Avatar Tools

### 1. HeyGen

**Purpose:** Pre-generate lip-synced talking professor video from photo + text/audio.

| Property | Verified Detail |
|----------|----------------|
| Input | Professional photo (min 512×512) + script text or audio file |
| Output | MP4 video (1080p / 4K on higher plans) |
| Quality | Best-in-class photorealistic lip sync and facial expression |
| API | Yes — REST API + official `@heygen/streaming-avatar` React SDK |
| Real-time | LiveAvatar: yes, via WebRTC (sub-300ms target latency) |
| Licensing | Commercial use on all paid plans |
| React integration | `@heygen/streaming-avatar` npm package (TypeScript); also standard `<video>` for pre-generated files |
| Cost | Free: 1 min/month. Creator: ~$24/mo. Business: ~$120/mo |
| **⚠️ Critical** | Interactive Avatar API is **being deprecated March 31, 2026**. Must migrate to LiveAvatar. |

**Pros:** Best lip sync quality. Multilingual (40+ languages). Voice clone support. SCORM export. Clean React SDK.  
**Cons:** Pre-generation is async (takes minutes per video). Per-minute costs at scale. March 2026 migration required.

**Recommended for:** Phase 1 — pre-generate one MP4 per lesson segment offline, serve from CDN. Phase 2 — migrate to LiveAvatar for interactive sessions.

---

### 2. Tavus (NEW — strongly recommended)

**Purpose:** Real-time conversational video interface (CVI). The most production-ready interactive avatar for React.

| Property | Verified Detail |
|----------|----------------|
| Input | Script or live conversation |
| Output | Real-time video stream (WebRTC) |
| Quality | Phoenix-3 model: 1080p, micro-expressions, photorealistic |
| API | Yes — REST API + `@tavus/cvi-ui` React component library |
| Real-time | Yes — bidirectional: avatar can see, hear, and respond |
| Licensing | Commercial |
| React integration | Drop-in `@tavus/cvi-ui` React components; also iframe embed |
| Cost | Contact for pricing. $40M Series B (Nov 2025) — enterprise-grade platform |

**Pros:** Native React SDK. Multimodal (avatar can "see" student). Real-time interaction. Conversational AI built in. Roleplay/coaching use cases documented.  
**Cons:** Enterprise pricing (no public self-serve tier). Newer platform.

**Recommended for:** Phase 2 interactive professor who responds to students in real time. Most production-ready React integration.

---

### 3. D-ID Streaming

**Purpose:** Real-time talking head streaming from photo + live audio.

| Property | Verified Detail |
|----------|----------------|
| Input | Portrait photo + audio stream (via ElevenLabs) |
| Output | Real-time video via WebRTC |
| Quality | High. Slightly below HeyGen for pre-generated; adequate for streaming |
| API | Yes — REST API + WebRTC Streams API |
| Real-time | Yes — WebRTC bidirectional streaming |
| Licensing | Commercial on paid plans |
| React integration | **No native React SDK.** Custom WebRTC wrapper required. REST-only SDK |
| Cost | Lite: ~$6/mo (10 min). Pro: ~$36/mo (60 min). Streaming plan: ~$188/mo |

**Pros:** Real-time streaming. Integrates directly with ElevenLabs audio. Established platform.  
**Cons:** No native React SDK (extra engineering). 5-minute video cap on standard plans. 1280×1280 max resolution standard tier.

**Recommended for:** Phase 2 fallback if Tavus is out of budget. More complex React integration required.

---

### 4. Kling AI — Avatar 2.0

**Purpose:** Pre-generated lip-synced talking head. Best for long-form consistent character (up to 5 minutes).

| Property | Verified Detail |
|----------|----------------|
| Input | Portrait photo + audio file (MP3/WAV) |
| Output | MP4 (H.264, up to 4K, up to 30fps) |
| Quality | Excellent. Phoneme-based lip sync. "Unified Character Memory" maintains face consistency |
| API | Yes — Kling Open Platform REST API (separate from consumer subscription) |
| Real-time | No — async polling |
| Licensing | Commercial (check regional data terms — Kuaishou is Chinese company) |
| React integration | Server-side only (JWT protection). React receives MP4 URL |
| Cost | Consumer: $10–$180/mo. API: ~$0.075–$0.11/sec video generated |

**Pros:** Longest single-take consistency (5 min). Strong lip sync accuracy. Good value.  
**Cons:** No real-time streaming. Data privacy consideration (Kuaishou/China). API credits separate from subscription. Server-side integration only.

**Recommended for:** Phase 1 alternative to HeyGen for long lesson segments. Strong if consistent professor identity across long recordings is needed.

---

### 5. Higgsfield AI — Soul ID + Lipsync Studio

**Purpose:** Consistent professor identity across a course library + lip-synced video generation.

| Property | Verified Detail |
|----------|----------------|
| Input | Multiple reference photos (Soul ID) + WAV audio file |
| Output | MP4 (up to 1080p, 48fps) |
| Quality | High. Soul ID maintains consistent professor identity best across many videos |
| API | Yes — official `higgsfield-js` TypeScript SDK + REST API |
| Real-time | No — async with `withPolling: true` (5 min timeout) |
| Licensing | Commercial on paid plans. Annual plans only |
| React integration | **Server-side only** — SDK explicitly blocks browser use. React receives MP4 URL |
| Cost | Starter: $15/mo (annual). Plus: $39/mo. Ultra: $99/mo |
| **⚠️ Audio** | Lipsync Studio accepts **WAV only**. Convert MP3/AAC before submitting |

**Pros:** Soul ID is the best tool for maintaining one professor's face across an entire course library. DOP cinematic model is excellent for intro/atmosphere videos.  
**Cons:** WAV audio only. Server-side SDK only. 5-minute polling timeout (chunk long scenes). Annual billing only. Add-on credit packs expire 90 days.

**Recommended for:** Building a Professor Didier course library where identity must remain consistent across 20+ lessons. Phase 1 strong contender alongside HeyGen.

---

### 6. Runway — GWM-1 (Characters) vs. Gen-4

**Two completely different products. Do not confuse them.**

| | GWM-1 / Characters | Gen-4 / Gen-4.5 |
|--|--|--|
| Purpose | Real-time avatar with lip sync | Cinematic video generation |
| Lip sync | Yes | No |
| Real-time | Yes (WebRTC) | No (async) |
| React SDK | `@runwayml/avatars-react` | Server-side `@runwayml/sdk` only |
| Max duration | Real-time | 10s (Gen-4), 60s (Gen-4.5) |
| Best for | Interactive professor | Classroom backgrounds, b-roll |
| Cost (Gen-4) | — | Standard: $15/mo (625 credits); 10s clip ≈ 120 credits |
| Cost (GWM-1) | Enterprise/API tier | — |

**Gen-4 Recommended for:** Generating cinematic classroom atmosphere clips, room backgrounds, and visual b-roll. NOT for professor avatar.  
**GWM-1 Recommended for:** If Tavus/HeyGen don't fit, GWM-1 is the only Runway product with real-time avatar streaming.

---

### 7. LivePortrait — ⚠️ NOT RECOMMENDED

| Property | Verified Detail |
|----------|----------------|
| API | Third-party only (Segmind, Replicate). No official KwaiVGI API |
| Audio lip sync | **Not built in.** Requires audio → requires separate MuseTalk/LipSick pipeline |
| Commercial license | **Blocked by InsightFace models (non-commercial).** Must swap models |
| Real-time | Only with FasterLivePortrait fork + RTX 3090 (TensorRT). Not browser-native |
| Talking professor fit | **Low.** No audio-driven animation. Complex chain to make it work |

**Decision: Skip.** HeyGen, Kling Avatar 2.0, and Higgsfield are all superior for this use case with far less complexity.

---

## Image Generation (Scene/Background)

### 8. Flux (Black Forest Labs) via fal.ai — RECOMMENDED

**Purpose:** Generate photorealistic classroom backgrounds and environment assets.

| Property | Verified Detail |
|----------|----------------|
| Input | Text prompt |
| Output | JPEG/PNG up to 2048×2048 (FLUX1.1 Ultra supports higher) |
| Quality | Best photorealism of any image model. Excels at skin, fabric, lighting |
| API | Yes — `@fal-ai/client` npm package (recommended for React) |
| React integration | `npm install @fal-ai/client` — handles CORS and CDN hosting |
| Cost | FLUX1.1 [pro]: $0.04/image. FLUX1.1 [pro] Ultra: $0.06/image. Schnell (Apache 2.0): ~$0.003/image |
| Licensing | FLUX1.1 [pro]: commercial via API. Schnell: Apache 2.0 (fully open commercial) |
| **⚠️ CORS** | BFL direct API URLs expire in 10 min with no CORS. **Use fal.ai** — it re-hosts on its own CDN |

**Recommended for:** All classroom background generation. Best photorealism, clean API, commercial license.

```typescript
// Correct integration pattern (fal.ai, handles CORS)
import { fal } from '@fal-ai/client';

const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra', {
  input: {
    prompt: 'Dark academia university classroom interior, blue-navy moody lighting, wooden lectern, large blackboard, depth of field, photorealistic 8K',
    num_images: 3,
  }
});
// result.images[0].url is a permanent CDN URL
```

---

### 9. Adobe Firefly

**Purpose:** Commercially safe image generation with IP protection guarantee.

| Property | Verified Detail |
|----------|----------------|
| Input | Text prompt + optional style reference |
| Output | JPEG/PNG (up to ~4 MP native) |
| Quality | High. Photorealistic portraits possible with Image Model 5 |
| API | Yes — `@adobe/firefly-apis` npm package |
| React integration | TypeScript SDK. OAuth 2.0 required |
| Cost (App) | Free: 25 credits/mo. Standard: $9.99/mo (2K credits). Pro: $19.99/mo (4K credits) |
| Cost (API) | **Enterprise only — minimum ~$1,000/month commitment** |
| Licensing | **Fully commercially safe.** Trained on licensed content only. C2PA metadata embedded |

**Pros:** Strongest commercial IP guarantee. Clean licensing for enterprise use.  
**Cons:** API is enterprise-only ($1K/mo minimum). C2PA metadata in every output (non-removable). Faces can be inconsistent — needs iteration.

**Recommended for:** Production classroom backgrounds when legal/IP safety is the top priority. For smaller budgets, use Flux instead.

---

### 10. Midjourney — ⚠️ NO API, NOT PIPELINE-READY

| Property | Verified Detail |
|----------|----------------|
| API | **No official public API as of mid-2025.** Enterprise dashboard exists but by application only |
| Integration | Manual Discord/web workflow. Cannot be automated |
| Unofficial wrappers | Exist but violate ToS. Risk of account termination |
| Commercial license | Yes on paid plans. Real identifiable people prohibited |

**Decision: Use for concept art and creative direction only. Not suitable for any automated pipeline. Use Flux for production assets.**

---

## Board Animation

### 11. Rive — RECOMMENDED

**Purpose:** Interactive web animations with state machines. The right tool for AVIS board diagrams.

| Property | Verified Detail |
|----------|----------------|
| Input | Rive editor-designed animations (`.riv` files) |
| Output | `.riv` binary rendered at runtime in browser (no video export) |
| Quality | Smooth, professional. WebGL renderer for advanced effects |
| API | No REST API. Runtime library is open-source |
| React integration | `@rive-app/react-webgl2` (recommended) or `@rive-app/react-canvas` |
| Cost | Free (1 project, 3 collaborative files). Cadet: $9/mo. Voyager: $32/mo |
| Audio lip sync | **Not built in.** Rive cannot drive mouth movement from audio |

**Pros:** Zero server cost. 60fps in browser. State machine triggers from React props. Tiny file sizes vs. video. Open-source runtime.  
**Cons:** Must be hand-authored in Rive editor. No AI generation. No audio-driven animation.

**Recommended for:** AVIS board diagram animations. Phase 1 upgrade from SVG to Rive.

```typescript
// Rive board diagram controlled by lesson step
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2';

function ScrumBoard({ step }: { step: number }) {
  const { RiveComponent, rive } = useRive({
    src: '/diagrams/scrum.riv',
    stateMachines: 'BoardSM',
    autoplay: true,
  });
  const stepInput = useStateMachineInput(rive, 'BoardSM', 'boardStep');
  useEffect(() => { if (stepInput) stepInput.value = step; }, [step, stepInput]);
  return <RiveComponent />;
}
```

---

## Workflow / Compositing

### 12. ComfyUI

**Purpose:** Chain multiple AI models in one workflow for advanced compositing.

| Property | Detail |
|----------|--------|
| Input | Node graph configuration |
| Output | Any format the pipeline produces |
| API | Yes — local REST API |
| React integration | Server-side. React calls your ComfyUI endpoint |
| Cost | Open source. GPU cloud: ~$0.50–$2/hr |

**Recommended for:** Phase 2 — composite professor (HeyGen output) + background (Flux output) + color grade into final production video. Requires DevOps expertise.

---

## Long-Term / Phase 4

### 13. Unreal MetaHuman

**Purpose:** Hollywood-grade photorealistic 3D avatar. Phase 4 long-term architecture.

| Property | Verified Detail |
|----------|----------------|
| Licensing | Free under $1M revenue (UE 5.6+, June 2025). After June 2025: no royalty on non-UE exports |
| Delivery | Pixel Streaming (WebRTC). GPU server required per concurrent user |
| React integration | Pixel Streaming WebRTC client. Community `markolofsen/metaeditor` React wrapper |
| Cost | GPU server: ~$0.50–$1.00/hr per concurrent user |
| Lip sync | Requires NVIDIA ACE or Convai — not built in |
| Web app retirement | **MetaHuman Creator web app retires November 5, 2026.** Move to UE editor |
| Complexity | Very high. GPU cluster + Signaling Server + WebRTC + lip sync pipeline |

**Decision: Do not implement now. Plan for Phase 4 when student concurrent sessions justify the infrastructure investment (~$0.50–$1.00/user/hr).**

---

## Recommendation Matrix (Verified)

| Tool | Phase | Priority | Est. Monthly Cost | API? | Real-Time? |
|------|-------|----------|------------------|------|-----------|
| ElevenLabs | 0–4 | ★★★★★ | $22–$99 | Yes | Yes |
| HeyGen (LiveAvatar) | 1–2 | ★★★★★ | $24–$120 | Yes | Phase 2 |
| Flux via fal.ai | 1 | ★★★★★ | ~$5–$20 | Yes | No |
| Rive | 1 | ★★★★★ | $0–$9 | Runtime | Yes (in-browser) |
| Higgsfield Soul ID | 1 | ★★★★☆ | $15–$39 | Yes | No |
| Kling Avatar 2.0 | 1 | ★★★★☆ | $10–$37 | Yes | No |
| Tavus CVI | 2 | ★★★★★ | Enterprise | Yes | Yes |
| Adobe Firefly | 1–2 | ★★★☆☆ | $10–$20 (app) | Enterprise only | No |
| Runway Gen-4 | 2 | ★★★☆☆ | $35–$95 | Yes | No |
| Runway GWM-1 | 2 | ★★★☆☆ | Enterprise | Yes | Yes |
| D-ID | 2 | ★★★☆☆ | $36–$188 | Yes | Yes |
| ComfyUI | 2 | ★★★☆☆ | GPU cost | Yes | No |
| Midjourney | Concept only | ★★☆☆☆ | $10–$60 | **No** | No |
| LivePortrait | ✗ | Not recommended | — | No official | No |
| MetaHuman | 4 | ★★★★★ | GPU intensive | No | Yes (Pixel) |

---

## Phase 1 Immediate Actions

**Total estimated monthly cost: ~$65–$165/month**

1. **HeyGen** ($24/mo Creator) — create Professor Didier avatar from professional photo, generate first lesson segment
2. **Flux via fal.ai** (~$10/mo) — generate 5 classroom background images
3. **Rive** ($0–$9/mo) — begin designing Scrum diagram as animated Rive board
4. **ElevenLabs** (already live) — continue as primary voice engine

This gets Phase 1 production running without any enterprise contracts or complex infrastructure.
