# Professor Media Pipeline

**Status:** Architecture — Awaiting Founder Approval  
**Scope:** End-to-end production of Professor Didier™ media assets: voice, talking head, background, composite

---

## Overview

The professor is not a React component.  
The professor is a **produced media asset** delivered through a React slot.

This document covers everything from raw input (founder photo + script) to final deliverable (MP4 segment ready for the `ProfessorMediaLayer`).

---

## Pipeline at a Glance

```
Founder Photo (DSLR / studio)
         │
         ├──────────────────────────────────┐
         ▼                                  ▼
  Voice Production                   Talking Head Production
  (ElevenLabs TTS)                   (HeyGen / D-ID)
         │                                  │
         │ audio .mp3/.wav                  │ .mp4 per segment
         └──────────────────────────────────┘
                          │
                          ▼
                  Composite Production
                  (ComfyUI / Runway)
                  Background + Professor
                          │
                          ▼
                  Compression Pass
                  (ffmpeg — H.264 + VP9)
                          │
                          ▼
                  CDN Upload
                  (Supabase Storage)
                          │
                          ▼
                  ProfessorMediaLayer
                  (React <video> element)
```

---

## Stage 1: Founder Photo

**Input requirements:**
- Resolution: minimum 1024×1024. Ideal: 2048×2048+
- Lighting: professional studio or window light (not harsh flash)
- Background: solid neutral (white, grey, or dark — can key out)
- Attire: professional, consistent across lessons
- Expression: calm, engaged, authoritative
- Format: RAW preferred, JPEG acceptable (>90% quality)
- Do not: sunglasses, heavy shadows across face, motion blur

**How it is used:**
- Uploaded to HeyGen as the base avatar photo
- Used by Higgsfield Soul ID (if chosen for course library consistency)
- Stored at: `supabase.storage/professor-assets/professor-didier-source.jpg`

---

## Stage 2: Voice Production (ElevenLabs)

**Current status: Live and integrated.**

### Voice ID

Professor Didier™ has a cloned voice on ElevenLabs. The voice ID is stored as `VITE_ELEVEN_LABS_VOICE_ID` in the environment.

### Script → Audio segments

For Phase 1 (pre-recorded), each lesson segment is converted to audio before HeyGen:

```
Lesson script
→ Split into segments (60–120 seconds max, one MP3 per segment)
→ ElevenLabs API: text-to-speech with Professor Didier voice
→ Output: segment-001.mp3, segment-002.mp3, etc.
```

**API call (Node.js, server-side):**

```typescript
import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const audio = await client.textToSpeech.convert(process.env.ELEVEN_VOICE_ID, {
  text: scriptSegment,
  model_id: 'eleven_turbo_v2_5',
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.4,
    use_speaker_boost: true,
  },
  output_format: 'mp3_44100_128',
});
```

**Output:** `segment-001.mp3` → feed directly to HeyGen

### Live voice (Phase 0, current)

ElevenLabs Conversational AI runs in real time. No pre-generation needed.  
Audio is streamed directly from ElevenLabs → `ProfessorMediaLayer` audio.  
No talking head video in Phase 0 — professor is a static PNG.

---

## Stage 3: Talking Head Production

### Phase 1 — HeyGen (Recommended)

HeyGen takes the professor photo + audio file and generates a lip-synced `.mp4`.

**Workflow:**

1. Upload professor photo to HeyGen avatar library (one-time setup)
2. For each lesson segment:
   - Call HeyGen API with `avatarId` + ElevenLabs MP3
   - Poll for job completion (typically 2–5 minutes per segment)
   - Download resulting `.mp4`

**HeyGen API (server-side only):**

```typescript
// 1. Create talking photo avatar (one-time)
const avatar = await heygen.avatar.createTalkingPhoto({
  name: 'Professor Didier',
  imageFile: fs.readFileSync('professor-didier-source.jpg'),
});

// 2. Generate per-segment video
const job = await heygen.video.generate({
  avatarId: avatar.avatar_id,
  audioFile: fs.readFileSync(`segment-001.mp3`),
  dimension: { width: 1280, height: 720 },
  quality: 'high',
});

// 3. Poll for completion
const result = await heygen.video.pollStatus(job.video_id);
// result.video_url → download MP4
```

**Output per segment:** `scrum-v1-1-1-segment-001.mp4` (720p, ~60–120 seconds)

**Cost estimate:** $24/month Creator plan. API: ~$1/minute of video generated.

---

### Phase 1 Alternative — Higgsfield Soul ID

Best if Professor Didier™ must remain visually identical across a library of 20+ lessons.

Soul ID builds a consistent professor identity from multiple reference photos.

```typescript
import Higgsfield from 'higgsfield-js';

const hf = new Higgsfield({ apiKey: process.env.HIGGSFIELD_API_KEY });

// Build Soul ID from multiple photos (one-time)
const soulId = await hf.soul.create({
  name: 'Professor Didier',
  referenceImages: [photo1, photo2, photo3],
});

// Generate video per segment (WAV audio only — convert MP3 first)
const job = await hf.lipsync.create({
  soulId: soulId.id,
  audio: fs.readFileSync('segment-001.wav'), // WAV required
  withPolling: true, // waits up to 5 min
});

// job.video_url → download MP4
```

**Note:** Higgsfield SDK blocks browser use. Must run server-side.  
**Audio:** WAV only. Convert ElevenLabs MP3 output before submitting.

---

### Phase 2 — D-ID Real-Time Streaming

No pre-generation. Professor video streams live during the session.

```
ElevenLabs live audio stream → D-ID WebRTC Streams → <video> element
```

Requires:
1. D-ID REST API to create a stream session
2. Custom WebRTC wrapper (D-ID has no React SDK)
3. ICE candidate negotiation
4. Forward ElevenLabs audio into D-ID stream in real time

**Integration complexity:** High. Recommend Tavus CVI instead if budget allows.

---

### Phase 2 Alternative — Tavus CVI (Strongly Recommended)

Drop-in `@tavus/cvi-ui` React component. Native React SDK. No WebRTC plumbing required.

```tsx
import { CviContainer } from '@tavus/cvi-ui';

<CviContainer
  conversationId={conversationId}
  onMessage={(msg) => handleStudentMessage(msg)}
/>
```

Tavus handles: WebRTC, audio sync, conversation AI, and professor video rendering.  
This replaces the static `ProfessorMediaLayer` with a live, responsive AI professor.

---

## Stage 4: Background Production

### Flux via fal.ai (Recommended)

```typescript
import { fal } from '@fal-ai/client';

const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra', {
  input: {
    prompt: [
      'Dark academia university classroom interior,',
      'blue-navy moody lighting, wooden lectern,',
      'large blackboard, bookshelves, warm spotlight,',
      'no people, depth of field, photorealistic 8K',
    ].join(' '),
    num_images: 3,
    image_size: 'landscape_16_9',
  },
});

// result.images[0].url — permanent CDN URL (fal.ai hosts it)
// Download, compress to JPEG 85%, store in Supabase Storage
```

**CORS note:** Never call BFL API directly from browser — URLs expire in 10 min.  
Always call via fal.ai, which re-hosts on its own CDN.

**Output:** `classroom-bg-default.jpg` (~1MB compressed)

**Backgrounds needed for Phase 1:**
- `classroom-bg-default.jpg` — evening lecture hall, dark navy
- `classroom-bg-modern.jpg` — modern classroom, brighter
- `classroom-bg-library.jpg` — library/study, warm lighting

---

## Stage 5: Composite Production

**When:** Phase 2+. Phase 1 compositing is handled in CSS within `EnvironmentLayer`.

### Phase 1 (CSS composite — current)

No video compositing required. The `SceneEngine` layers:
1. Background JPEG at `brightness(0.15)` as CSS `background-image`
2. HeyGen MP4 rendered as `<video>` element in `ProfessorMediaLayer`
3. Atmospheric overlays rendered as CSS gradients in `EnvironmentLayer`

The professor appears to stand in front of the classroom because of layered z-index.  
No green screen. No chroma key. Pure CSS.

### Phase 2 (ComfyUI composite — production)

For a more realistic result, composite in ComfyUI:
1. Import classroom background (Flux output)
2. Import professor video (HeyGen output)
3. Apply segmentation mask (extract professor from background)
4. Lighting match: match professor lighting to classroom scene
5. Color grade: enforce dark navy palette
6. Export final composite `.mp4`

This produces a single video per lesson where professor and classroom are one scene — no CSS layering needed at runtime.

---

## Stage 6: Compression

### Video compression (ffmpeg)

Each segment through a two-pass encode:

```bash
# H.264 for broad compatibility
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 23 -preset slow \
  -vf "scale=1920:1080" \
  -c:a aac -b:a 128k \
  output-h264.mp4

# VP9 for quality (modern browsers)
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -vf "scale=1920:1080" \
  -c:a libopus -b:a 128k \
  output-vp9.webm

# Mobile variant
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 26 \
  -vf "scale=960:540" \
  output-mobile.mp4
```

**Target bitrate:** ~1.5 Mbps (H.264, 1080p, acceptable for educational video)

### Naming convention

```
{programId}-{lessonId}-{segmentId}-{variant}.{ext}

Example:
scrum-v1-1-1-intro-desktop.mp4
scrum-v1-1-1-intro-mobile.mp4
scrum-v1-1-1-intro-desktop.webm
```

---

## Stage 7: CDN Delivery

### Storage path (Supabase Storage)

```
bucket: professor-media
path:   /{programId}/{lessonId}/{segmentId}/{filename}

Example:
/ai-scrum-master/scrum-v1-1-1/intro/scrum-v1-1-1-intro-desktop.mp4
```

### Delivery strategy

```tsx
// Prefetch next segment while current plays
const prefetchNext = (currentSegmentId: string, allSegments: string[]) => {
  const idx = allSegments.indexOf(currentSegmentId);
  const next = allSegments[idx + 1];
  if (next) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = getSegmentUrl(next);
    document.head.appendChild(link);
  }
};
```

### ProfessorMediaLayer integration

```tsx
// Phase 0 (current)
<ProfessorMediaLayer media={{ type: 'image', src: '/professor-didier.png' }} />

// Phase 1 — HeyGen pre-generated
<ProfessorMediaLayer media={{
  type: 'video',
  src: `${SUPABASE_STORAGE}/professor-media/ai-scrum-master/scrum-v1-1-1/intro/desktop.mp4`,
  poster: '/professor-didier.png',
}} />

// Phase 2 — D-ID or Tavus live stream
<ProfessorMediaLayer media={{
  type: 'stream',
  endpoint: tavusConversationUrl,
  token: tavusToken,
}} />
```

---

## Asset Registry

Every produced asset is registered in the lesson content file:

```typescript
// src/content/ai-scrum-master/lessons/scrum-v1-1-1.ts

export const lesson: Lesson = {
  id: 'scrum-v1-1-1',
  segments: [
    {
      id: 'intro',
      media: {
        type: 'video',
        src: '/professor-media/ai-scrum-master/scrum-v1-1-1/intro/desktop.mp4',
        poster: '/professor-media/ai-scrum-master/professor-poster.jpg',
        mobileSrc: '/professor-media/ai-scrum-master/scrum-v1-1-1/intro/mobile.mp4',
      },
      duration: 62,
      cues: [...],
    },
    // ...
  ],
};
```

---

## Production Checklist (Per Lesson)

```
□ Lesson script reviewed and finalized by Founder
□ Script split into segments (max 120s each)
□ ElevenLabs audio generated per segment (MP3)
□ Audio reviewed — pronunciation, pacing, tone
□ HeyGen video generated per segment (MP4)
□ Video reviewed — lip sync quality, head position
□ Background image selected / generated (Flux)
□ Compression pass applied (H.264 + VP9 + mobile)
□ Files named according to convention
□ Files uploaded to Supabase Storage
□ Asset registry updated in lesson content file
□ Cue sheet JSON written and validated
□ Lesson loaded and played in development
□ Board sync verified against cue timestamps
```

---

## Cost Summary (Phase 1 Per Lesson)

| Asset | Tool | Unit Cost | Per Lesson (10 min) |
|-------|------|-----------|---------------------|
| Voice audio | ElevenLabs | $0.30/1K chars | ~$3–5 |
| Talking head | HeyGen Creator | $24/mo flat | — |
| Talking head (API) | HeyGen API | ~$1/min | ~$10 |
| Background | Flux fal.ai | $0.04–0.06/image | ~$0.20 |
| Storage | Supabase | $0.02/GB | ~$0.10 |
| Bandwidth | Supabase | $0.09/GB | ~$0.50 |
| **Total per lesson** | | | **~$10–$16** |

At 20 lessons per course: **~$200–$320 total production cost per course.**

---

*This pipeline produces a production-quality professor video for each lesson. The React classroom becomes a delivery mechanism — not a drawing system.*
