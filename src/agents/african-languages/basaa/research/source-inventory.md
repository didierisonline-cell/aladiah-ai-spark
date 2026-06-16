# Basaa Source Inventory Report

> **Phase 2 — Data Acquisition Planning.** Analysis only. **No copyrighted content has been
> scraped or imported.** This report characterizes each registered source so license review
> and acquisition can proceed safely. Figures marked _(est.)_ are planning estimates, not
> verified counts; figures marked _(verified)_ were confirmed against the linked source.
>
> Companion files: `license-review.md` (rights deep-dive) · `data-acquisition-roadmap.md`
> (ranked matrix + phased plan).

## How to read this

- **License status** — current best understanding; the binding determination lives in
  `license-review.md` and gates import (`license_status = approved`).
- **Structured data availability** — how machine-ready the source is (DB export, parseable
  PDF, plain prose, audio).
- **Educational value (Academy)** vs **VoiceBridge relevance** are scored separately because
  a source can be great for one and weak for the other (e.g. tone papers).

---

## S1 — SIL / Webonary Basaa–English–French–German Dictionary

| Field | Finding |
|---|---|
| Registry id | `sil-webonary-basaa-dictionary` |
| URL | https://www.webonary.org/basaa/ · catalog: https://www.sil.org/resources/archives/47253 |
| Author / institution | SIL International + the contributing Basaa lexicography project |
| License status | **Restricted (permission required).** Webonary *software* is GPL, but *dictionary content* copyright is retained by contributors; SIL holds only a non-exclusive license. No open content license is granted to third parties. |
| Copyright restrictions | Content © contributors. Webonary [Terms of Service](https://www.webonary.org/sil-international-terms-of-service-for-webonary-org/) do not grant bulk extraction or redistribution rights. |
| Commercial use | **Not permitted without written permission** from SIL / the dictionary owner. |
| Download availability | Online searchable site; a downloadable PDF / mobile-app export exists **only if the dictionary owner enabled it**. To confirm (see S2). |
| Structured data | High **if** access is granted — Webonary is backed by structured lexical data (FLEx/LIFT); fields include headword, POS, glosses (FR/EN/DE), examples. Not publicly exportable. |
| Est. dictionary entries | **~16,000 _(verified, "just under 16,000")_** with FR/EN/DE definitions. |
| Est. sentence pairs | Low–moderate _(est. 1,000–4,000)_ — example sentences embedded in entries, not a parallel corpus. |
| Educational value (Academy) | **Very high (5/5)** — the lexical backbone for learning + translation. |
| VoiceBridge relevance | **Moderate (3/5)** — IPA/tone may be present per entry, useful for lexicon-driven TTS, but it is not speech data. |

---

## S2 — Webonary Downloadable Basaa PDF Dictionary

| Field | Finding |
|---|---|
| Registry id | `sil-webonary-basaa-pdf` |
| URL | https://www.webonary.org/basaa/ (download/export, if enabled) |
| Author / institution | SIL International / contributors (same as S1) |
| License status | **Restricted — identical rights to S1.** A downloadable file does not itself grant reuse rights. |
| Copyright restrictions | Same as S1. |
| Commercial use | Same as S1 — permission required. |
| Download availability | **To confirm.** Webonary supports per-dictionary PDF/app downloads at the owner's discretion; presence for Basaa is unverified. |
| Structured data | If a text-based PDF exists, **parseable** into JSON (PDF→structured). If scanned, needs diacritic-aware OCR (tone-mark loss risk). |
| Est. dictionary entries | Same corpus as S1 (**~16,000**). |
| Est. sentence pairs | Same as S1. |
| Educational value (Academy) | **Very high (5/5)** — same content, offline/parseable. |
| VoiceBridge relevance | **Moderate (3/5)** — same as S1. |
| Note | **Not a distinct dataset** — it is the preferred *acquisition vehicle* for S1 (avoids live scraping). Rank/treat jointly with S1. |

---

## S3 — Peace Corps Basaa Language Course

| Field | Finding |
|---|---|
| Registry id | `peace-corps-basaa-course` |
| URL | https://www.livelingua.com/course/peace-corps/basaa-language-lessons |
| Author / institution | U.S. Peace Corps (Cameroon); hosted by the Live Lingua Project |
| License status | **Likely public domain (U.S. government work)** — strong but to be confirmed for this specific edition. |
| Copyright restrictions | Live Lingua states it does **not own rights** and hosts as public-domain material; flags that individual items' status may need verification. |
| Commercial use | **Non-commercial use unrestricted; commercial use → contact Peace Corps D.C.** per Live Lingua's stated terms. |
| Download availability | **Yes** — ebooks (PDF) readable/downloadable online **plus downloadable audio**. |
| Structured data | Moderate — prose PDF (dialogues, phrase lists, grammar, vocab). Needs segmentation, but well-structured pedagogically. **Audio files** present. |
| Est. dictionary entries | Moderate _(est. 1,500–3,000 vocab items)_, incl. health-field vocabulary. |
| Est. sentence pairs | **High _(est. 2,000–5,000)_** — dialogues + survival phrases are the best parallel-text source in the set. |
| Educational value (Academy) | **Very high (5/5)** — practical, learner-oriented, exactly Academy's use case. |
| VoiceBridge relevance | **Very high (5/5)** — the **only source with native audio**; gold for ASR/TTS bootstrapping. |

---

## S4 — Larry Hyman: Basaá (A.43) Grammar Chapter

| Field | Finding |
|---|---|
| Registry id | `hyman-basaa-grammar` |
| URL | Author PDF: https://linguistics.berkeley.edu/~hyman/Basaa_Chapter.pdf · Publisher: https://www.taylorfrancis.com/chapters/edit/10.4324/9780203987926-24/ |
| Author / institution | Larry M. Hyman (UC Berkeley) |
| Citation | Ch. in D. Nurse & G. Philippson (eds.), *The Bantu Languages*, Routledge/Curzon, pp. 257–282. |
| License status | **© Routledge / Taylor & Francis.** Author hosts a freely accessible copy on his Berkeley page. |
| Copyright restrictions | Published-book copyright. Verbatim redistribution not permitted; **structured notes/rules + citation** are fine (facts aren't copyrightable). |
| Commercial use | Verbatim reuse needs publisher permission; derived structured grammar notes (our use) are low-risk. |
| Download availability | **Yes** — author PDF freely downloadable for reading/analysis. |
| Structured data | Low (academic prose) — but **very high information density**; converts well into structured grammar notes. |
| Est. dictionary entries | N/A (not a lexicon). |
| Est. sentence pairs | Low _(est. <300 interlinear examples)_. |
| Educational value (Academy) | **High (4/5)** — authoritative structural backbone (noun classes, agreement, verb system). |
| VoiceBridge relevance | **Moderate (3/5)** — covers tonal behavior relevant to prosody. |

---

## S5 — Orthographic Conversion Research for Bàsàá

| Field | Finding |
|---|---|
| Registry id | `basaa-orthographic-conversion` |
| Identified works | (a) "Tone prediction and orthographic conversion for Basaa," arXiv [2210.06986](https://arxiv.org/abs/2210.06986) (2022); (b) "Comparing methods of orthographic conversion for Bàsàá, a language of Cameroon," ACL Anthology [2023.rail-1.11](https://aclanthology.org/2023.rail-1.11/) (2023). |
| Author / institution | Academic NLP researchers (Cameroon/Bantu documentation community). |
| License status | **Likely open (CC-BY).** ACL Anthology papers are standardly CC-BY 4.0; arXiv per author license. **Confirm per paper.** |
| Copyright restrictions | If CC-BY: reuse with attribution permitted — the most reuse-friendly source in the set. |
| Commercial use | **Permitted under CC-BY** (with attribution), if confirmed. |
| Download availability | **Yes** — open PDFs; arXiv version freely downloadable. Possible companion code/data. |
| Structured data | Moderate–high — describes deterministic + ML mappings (missionary Catholic/Protestant → official **AGLC** orthography); directly encodable into `basaa_orthography_rules`. |
| Est. dictionary entries | N/A. |
| Est. sentence pairs | N/A (may include aligned orthography pairs in supplementary data). |
| Educational value (Academy) | **Low–moderate (2/5)** — infrastructure, not learner-facing. |
| VoiceBridge relevance | **High (4/5)** — tone prediction + spelling normalization are prerequisites for clean TTS/ASR text. |
| Note | **Foundational normalization layer** — every other text source depends on a canonical orthography. Punches above its raw "value" because it unblocks the rest. |

---

## S6 — Basaa Tone-Language Research

| Field | Finding |
|---|---|
| Registry id | `basaa-tone-system` |
| Identified works | "High Tone Spreading and Phonological Phrases in Bàsàá" (Hamlaoui, Gjersøe, Makasso); "Downstep and recursive phonological phrases in Bàsàá (Bantu A43)" (langsci-press, open access); Basaá in *J. of the IPA* (Cambridge); "Metatony in Basaa." |
| Author / institution | Hyman, Hamlaoui, Makasso, Gjersøe et al. |
| License status | **Mixed.** langsci-press volumes are **open access CC-BY**; Cambridge JIPA article is paywalled/©; others vary. **Confirm per work.** |
| Copyright restrictions | Use open-access (CC-BY) items directly; treat paywalled items as notes/citation only. |
| Commercial use | CC-BY items: permitted with attribution. Paywalled: not without permission. |
| Download availability | Partial — langsci-press open PDFs downloadable; some items paywalled. |
| Structured data | Low (specialized phonology prose); converts into tone rules. |
| Est. dictionary entries | N/A. |
| Est. sentence pairs | N/A. |
| Educational value (Academy) | **Low (2/5)** — too specialized for learners. |
| VoiceBridge relevance | **Very high (5/5)** — tone inventory, downstep, high-tone spreading are **core to prosodically correct TTS and tone-aware ASR**. |

---

## Newly discovered candidate sources (not yet registered — recommend adding in Phase 3)

These surfaced during research and are high-value, especially for VoiceBridge. They are
**candidates pending license verification**, listed here so they aren't lost.

| Candidate | Why it matters | License (to verify) |
|---|---|---|
| **BULBasaa** — Bilingual Basaa–French **Speech** Corpus (Hamlaoui, Makasso et al.) | First **audio+transcription** parallel corpus → directly trains VoiceBridge ASR/TTS. Fills the biggest gap (we otherwise have almost no speech). | Research corpus; likely CC-BY or similar — **confirm**. |
| **langsci-press** Bàsàá phonology volume (downstep/phrasing) | Open-access (CC-BY) tone/prosody depth; cleanly reusable. | Open access CC-BY (confirm volume). |

---

## Inventory summary table

| # | Source | License posture | Download | Structured | Dict. entries _(est.)_ | Sent. pairs _(est.)_ | Academy | VoiceBridge |
|---|---|---|---|---|---|---|---|---|
| S1 | SIL/Webonary dictionary | Restricted (permission) | Online; PDF maybe | High (gated) | ~16,000 | 1k–4k | 5 | 3 |
| S2 | Webonary PDF | Restricted (= S1) | To confirm | High if text PDF | (= S1) | (= S1) | 5 | 3 |
| S3 | Peace Corps course | Public domain (confirm) | **Yes + audio** | Moderate | 1.5k–3k | **2k–5k** | 5 | **5** |
| S4 | Hyman grammar | © Routledge; preprint free | Yes (preprint) | Low (dense) | — | <300 | 4 | 3 |
| S5 | Orthography papers | Likely CC-BY | **Yes (open)** | Moderate–high | — | — | 2 | 4 |
| S6 | Tone research | Mixed (some CC-BY) | Partial | Low | — | — | 2 | **5** |

_Scores are 1–5. See `data-acquisition-roadmap.md` for the weighted composite ranking._
