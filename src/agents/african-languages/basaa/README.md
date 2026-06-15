# Basaa Agent — African Languages Module

> Part of `/src/agents/african-languages/`. This is the **Basaa Agent**: a structured
> Basaa language intelligence layer for **Aladiah Cameroon**.

## Mission

Build a structured, license-clean Basaa language intelligence layer that Aladiah can use
for multilingual learning, translation, and the future **VoiceBridge** voice-translation
system. The agent **collects, organizes, and processes** Basaa (Bàsàá, ISO 639-3 `bas`)
language documentation into validated, machine-usable datasets.

## Why this exists (canon alignment)

- **North Star — Rule 7 (Africa + Caribbean first).** Cameroon is an early expansion
  market. A trustworthy Basaa knowledge base is foundational infrastructure for serving
  Cameroonian learners in their own language.
- **Architecture Principle.** This module is a **data-foundation layer**. It produces
  structured, measurable, reusable data (dictionary entries, sentence pairs, tech terms)
  and **blocks no Core System**. It feeds future Personalization (System 2), AI Coaching
  (System 4 — multilingual tutoring), and learner-facing translation.

> The competency taxonomy (`/docs/standards/COMPETENCY_TAXONOMY.md`) is **not** extended
> by this module. Basaa language assets are a content/data source, not a competency
> program. If a Basaa *program* is ever created, it must append its own Axis-1 slugs there
> — never invented here.

## Use cases

1. **Dictionary extraction** — normalized Basaa↔English/French/German lexical entries.
2. **Sentence pairs** — aligned bilingual/trilingual pairs for translation training.
3. **Grammar notes** — structured notes on Basaa morphology, syntax, and dialects.
4. **Orthography normalization** — convert between Basaa writing systems to a canonical form.
5. **Tech-term translation** — curated Basaa renderings of technical / digital vocabulary
   (the gap most relevant to Aladiah's career-tech curriculum).
6. **Future voice translation (VoiceBridge)** — tone-aware data to support speech models.

## Module layout

```
basaa/
  README.md                     ← you are here
  basaa-agent-config.ts         ← agent identity, source registry, pipeline config
  basaa-database-plan.md        ← Supabase table plan (review before any SQL is written)
  sources/                      ← one markdown registry file per source asset
    dictionaries/
    courses/
    grammar/
    orthography/
  datasets/                     ← pipeline stages (raw → processed → validated)
    raw/
    processed/
    validated/
  prompts/                      ← agent prompt templates
  schemas/                      ← JSON Schemas for validated records
```

## Processing pipeline

```
source asset  →  raw/  →  (extractor prompt + schema)  →  processed/
              →  (quality-reviewer prompt + schema)     →  validated/
              →  (human-approved SQL)                   →  Supabase tables
```

## ⚠️ Working rules for this module (read before importing anything)

- **No automated scraping of copyrighted content yet.** This module currently holds only
  structure, metadata, the source registry, schemas, and pipeline placeholders.
- **License before import.** Every source's `license / usage notes` must be resolved and
  approved **before** full content is pulled into `datasets/`.
- **Human applies SQL.** Per repo canon, production SQL is delivered as a reviewable file
  + paste-ready block; Claude Code does not auto-apply SQL to Supabase.
- **Strongest foundation first.** Start with the **SIL / Webonary dictionary** and the
  **Peace Corps Basaa course** — the two highest-value, broadest-coverage sources.
