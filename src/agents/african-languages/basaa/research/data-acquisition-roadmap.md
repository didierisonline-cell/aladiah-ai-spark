# Basaa Data Acquisition Roadmap & Recommendation Matrix

> **Phase 2 output.** Ranks every registered Basaa source by value to **Aladiah Academy**
> (learning + translation) and **VoiceBridge** (speech), then sequences acquisition around
> licensing risk. Pairs with `source-inventory.md` (facts) and `license-review.md` (rights).
> **No content has been scraped or imported.**

## Scoring model

Each source scored 1–5 on five factors. The composite weights reflect that **legal
cleanliness is a gate** (a blocked source delivers nothing) and that we serve **two**
products.

| Factor | Weight | Rationale |
|---|---|---|
| License cleanliness | **30%** | A gated source yields zero value until permission lands. |
| Academy value | 25% | Core near-term product (learning + translation). |
| VoiceBridge value | 20% | Strategic; speech data is scarce and high-leverage. |
| Data volume / coverage | 15% | Breadth of usable lexicon/corpus. |
| Structured / extractable | 10% | Effort to turn the source into clean records. |

Composite = Σ(score × weight), on a 1–5 scale.

## Recommendation matrix (highest → lowest value)

| Rank | Source | License | Academy | VoiceBridge | Volume | Structured | **Composite** | Verdict |
|---|---|---|---|---|---|---|---|---|
| **1** | **S3 — Peace Corps Course** | 4 | 5 | 5 | 4 | 3 | **4.30** | **Start now.** Cleanest rights + only audio + sentence pairs. |
| **2** | **S5 — Orthography papers** | 5 | 2 | 4 | 2 | 4 | **3.55** | **Start now.** Open license; unblocks normalization for all text. |
| **3** | **S1 — SIL/Webonary dictionary** | 2 | 5 | 3 | 5 | 4 | **3.40** | **Pursue permission in parallel.** Highest raw value, gated. |
| **4** | **S6 — Tone research** | 4 | 2 | 5 | 2 | 2 | **3.30** | Use open-access subset; core for VoiceBridge prosody. |
| **5** | **S4 — Hyman grammar** | 3 | 4 | 3 | 2 | 2 | **3.05** | Extract rules (not prose); high-quality structural backbone. |
| **6** | **S2 — Webonary PDF** | 2 | 5 | 3 | 5 | 5 | **3.50\*** | Not ranked independently — **acquisition vehicle for S1**; inherits S1's gate. |

\* S2 scores high on its own merits but is the *same content* as S1; it cannot be used
until S1's permission lands, so it rides with S1 (rank 3) rather than competing separately.

### Reading the ranking

- **S3 tops the list** not because it is the richest (S1 is) but because it is **usable
  today**: public-domain footing, downloadable text **and audio**, and the strongest
  parallel-sentence content. It serves both products immediately.
- **S5 is #2** despite low Academy value because it is an **enabler**: a confirmed-open,
  reusable orthography-normalization layer that every other text source depends on.
- **S1 is the strategic prize** (#3) — unmatched ~16k-entry lexicon — but its 🔴 gate keeps
  it off the critical path until permission is secured. Worth pursuing hard, in parallel.
- **S6/S4** are specialist sources: high-leverage for VoiceBridge prosody (S6) and grammar
  structure (S4), but narrow and lower-volume.

### Product-specific top picks

- **Aladiah Academy:** S3 → S1 (on permission) → S4. (Practical learning + lexicon + grammar.)
- **VoiceBridge:** S3 (audio) → S6 (tone/prosody) → S5 (orthography/tone prediction) →
  **BULBasaa** (speech corpus, once registered & licensed).

---

## Phased acquisition plan

### Phase 2.1 — Clear-rights quick wins (do now)
1. **S3 Peace Corps:** confirm edition provenance (front-matter check), then download PDFs
   + audio into `datasets/raw/` (license note recorded). Set `license_status = approved`
   pending the commercial courtesy-note.
2. **S5 Orthography:** record each paper's exact license; if CC-BY confirmed, pull PDFs +
   any companion code/data; draft initial `basaa_orthography_rules` (missionary→AGLC).
3. Set the **canonical orthography = official AGLC** (Cameroon General Alphabet) as the
   project standard, justified by S5.

### Phase 2.2 — Permission track (start in parallel, runs long)
4. **S1/S2 SIL dictionary:** identify owner via SIL catalog; send written permission
   request (extraction + storage + product + commercial + attribution). Track status in
   `language_sources.license_status`. **No scraping** meanwhile.

### Phase 2.3 — Specialist linguistic layers
5. **S6 Tone:** ingest open-access (CC-BY) items into tone rules; cite paywalled items only.
6. **S4 Hyman:** extract structured grammar notes (rules, not prose) with citation.

### Phase 2.4 — Expand the registry (discovered candidates)
7. Register & license-check **BULBasaa** (speech corpus) — top VoiceBridge priority once
   the foundation is in place.
8. Register the **langsci-press** Bàsàá phonology volume (CC-BY) as an S6 companion.

### Phase 3 — Extraction & validation (separate phase, post-approval)
- Per source: `raw/` → extractor prompt + schema → `processed/` → quality-reviewer →
  `validated/` → **human-applied SQL** into Supabase (verify with `SELECT`).
- Order matches the build order in `basaa-database-plan.md`: orthography rules first (so
  all later text normalizes consistently), then dictionary + sentence pairs.

---

## Decision summary

> **Build the foundation on S3 (Peace Corps) + S5 (orthography) now — both clean and
> immediately useful — while opening the S1 (SIL dictionary) permission conversation in
> parallel for its unmatched lexical depth. Layer S6/S4 for tone and grammar, and register
> the discovered BULBasaa speech corpus as the next VoiceBridge target.**

## Open items before any extraction
- [ ] S3 front-matter provenance check + commercial courtesy note to Peace Corps.
- [ ] S5 per-paper license string confirmed (and companion data license).
- [ ] S1 written permission obtained (or documented denial → fallback to reference-only).
- [ ] S6 per-work license confirmation; isolate the CC-BY subset.
- [ ] Canonical orthography (AGLC) ratified as project standard.
- [ ] BULBasaa + langsci-press volume registered in `sources/` + `BASAA_SOURCES`.
