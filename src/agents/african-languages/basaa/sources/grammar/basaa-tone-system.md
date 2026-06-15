# Source — Basaa Tone-Language Research

| Field | Value |
|---|---|
| **Title** | Basaa Tone-Language Research (tonal phonology of Bàsàá) |
| **Source URL** | https://linguistics.berkeley.edu/~hyman/ (and related tonology publications) |
| **Author / Institution** | Larry M. Hyman (UC Berkeley) and other tonologists |
| **Content type** | Academic tone/phonology research (papers / PDFs) |
| **License / usage notes** | _Placeholder — TO REVIEW._ Academic; likely © author/publisher. Use for structured rules and analysis, cite the source; confirm before any verbatim reuse. |
| **Extraction value** | High for voice/speech. Basaa is tonal — correct tone handling is critical for VoiceBridge (TTS/ASR) and for accurate, machine-readable orthography. Feeds tone rules within `basaa_grammar_notes` / `basaa_orthography_rules`. |
| **Priority level** | **6** |

## Why it matters

Tone is meaning-bearing in Basaa: getting it wrong corrupts both text and speech models.
This research defines the tone inventory and tonal processes (e.g. spreading, downstep)
the agent must encode so that data carries correct, consistent tone marking.

## Processing plan

1. **License first.** Confirm permissible use; record here.
2. **Acquire** papers → `datasets/raw/`.
3. **Extract** tone inventory + processes into structured rules: tone categories, diacritic
   conventions, sandhi/spreading rules, worked examples.
4. **Cross-link** with orthography rules (tone-mark normalization) and grammar notes.
5. **Review & validate** → `datasets/validated/`.
6. **Load** via reviewable SQL.

## Notes / TODO

- [ ] Define the canonical tone-diacritic set the project will standardize on.
- [ ] Document downstep/automatic-downstep handling for TTS.
- [ ] Note interaction between tone and noun-class/verb morphology.
