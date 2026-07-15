# ElevenLabs Agent Configuration Checklist (Phase 4)

**Founder must verify these manually inside the ElevenLabs dashboard** for agent `ELEVENLABS_AGENT_ID` (Supabase project `vgujnkxylipfwmkpwzvb` secret). If the frontend sends an override that the agent does not whitelist, the agent can **close the socket immediately after starting** — a candidate cause of the cutoff if any persists after the code fix.

## 1. Agent
- [ ] Correct agent selected (matches the `ELEVENLABS_AGENT_ID` secret)
- [ ] Correct default voice selected (Prof. Didier voice)
- [ ] Conversation/ConvAI mode enabled
- [ ] A default first message configured (fallback when the client doesn't send one)
- [ ] A default agent prompt configured (fallback)

## 2. Security / Overrides — **MOST LIKELY REMAINING CUTOFF CAUSE**
The client sends these as overrides. Each must be explicitly enabled in **Agent → Security → Overrides**:
- [ ] **Prompt override** enabled (client sends the full lesson system prompt)
- [ ] **First message override** enabled (LiveClassroom sends one)
- [ ] **Voice override** enabled (client sends `tts.voiceId` per language)
- [ ] **Language override** enabled (client sends `agent.language`)

If you want to REDUCE risk instead: disable the client from sending overrides it doesn't need. Current code depends on prompt + voice + language overrides for multilingual teaching, so those three should stay enabled.

## 3. Voice
- [ ] Stability ≈ 0.71 (client sends this)
- [ ] Similarity ≈ 0.55 (client sends this)
- [ ] Style/exaggeration (if available) — set conservative
- [ ] Speaker boost (if available) — on
- [ ] Latency mode — favor low latency for live teaching
- [ ] **Interruption behavior** — verify sensitivity is not so high that room noise stops the agent
- [ ] **Turn-taking** — confirm natural
- [ ] **Silence timeout** — long enough that a thinking student isn't disconnected
- [ ] **Max conversation duration** — long enough for a full lesson (e.g. ≥ 15 min)

## 4. Knowledge
- [ ] Decide: ElevenLabs native knowledge base, or Aladiah-injected context (current approach: context injected via the override prompt — lesson transcript snippet). Recommended for launch: **injected context only**, no ElevenLabs KB, to keep one source of truth.
- [ ] Content the agent should know now: the current lesson (injected). Later: full course RAG.

## 5. Testing (founder runs)
- [ ] Headphones — 30-second session (baseline, no echo)
- [ ] Laptop speakers — 30-second session (echo path; echoCancellation now on)
- [ ] Chrome
- [ ] Safari (if possible)
- [ ] One 2-minute session (stability)
- [ ] One interruption test (speak over the professor)
- [ ] One silence test (stay quiet)
- [ ] One lesson-context test (ask "what should I focus on in this lesson?")

**If a session still cuts off early after the code fix:** read the on-screen amber box — if `likely cause: override-rejection-or-auth`, the fix is in section 2 above.
