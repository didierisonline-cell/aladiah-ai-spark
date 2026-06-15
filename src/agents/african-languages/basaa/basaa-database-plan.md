# Basaa Agent — Database Plan

> **Status: PLAN ONLY.** This document describes the intended Supabase tables for the Basaa
> language intelligence layer. **No SQL is applied from here.** Per repo canon, production
> SQL is delivered as a separate reviewable file + paste-ready block, and a **human applies
> it by hand in Supabase**. After any write, verify with a `SELECT` ("success / no rows"
> means it *ran*, not that it was *correct").

## Scope & alignment

These tables store **language data**, not learner competency. They do **not** extend
`/docs/standards/COMPETENCY_TAXONOMY.md` and must not introduce competency slugs. They are
a data-foundation layer (Architecture Principle): they produce reusable, measurable data
and block no Core System.

Two tables are **shared / cross-language** (`african_languages`, `language_sources`) so this
module generalizes to other African Languages Agents. The remaining seven are Basaa-specific.

## Conventions

- All tables: `id uuid primary key default gen_random_uuid()`, `created_at timestamptz
  default now()`, `updated_at timestamptz default now()`.
- Foreign keys reference `african_languages(id)` and/or `language_sources(id)`.
- `review_status` columns use: `raw | processed | validated` (mirrors `datasets/` stages).
- Tone diacritics are stored as-is in text columns (UTF-8); add toneless/normalized columns
  for search where noted.
- Enable RLS on every table; start read-restricted (service-role writes only) until access
  policy is decided.

---

## Shared tables

### `african_languages`
Registry of languages handled by African Languages Agents.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | e.g. "Basaa" |
| `endonym` | text | e.g. "Bàsàá" |
| `iso639_3` | text unique | e.g. "bas" |
| `glottolog` | text | e.g. "basa1284" |
| `region` | text | e.g. "Cameroon (Centre & Littoral)" |
| `family` | text | Bantu Zone A40 |
| `is_tonal` | boolean | true for Basaa |
| `status` | text | `planned | active | paused` |

### `language_sources`
Registry of documentation source assets (mirrors `sources/**` + `BASAA_SOURCES`).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK → `african_languages` | |
| `source_key` | text | matches `BASAA_SOURCES[].id` |
| `title` | text | |
| `author` | text | author / institution |
| `url` | text | |
| `content_type` | text | `dictionary | course | grammar | tone-research | orthography-research` |
| `priority` | int | 1 = highest |
| `extraction_value` | text | |
| `license_status` | text | `unreviewed | approved | restricted | rejected` — **import gate** |
| `license_notes` | text | |
| `stage` | text | `registered | raw | processed | validated` |

> **Gate:** no rows may be ingested into the Basaa content tables below from a source whose
> `license_status` is not `approved`.

---

## Basaa-specific tables

### `basaa_dictionary_entries`
Conforms to `schemas/basaa_dictionary_entry.schema.json`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK → `african_languages` | |
| `source_id` | uuid FK → `language_sources` | provenance |
| `headword` | text | tone diacritics preserved |
| `headword_normalized` | text | toneless/folded, indexed for search |
| `ipa` | text | nullable |
| `tone_pattern` | text | nullable |
| `part_of_speech` | text | schema enum |
| `noun_class` | text | nullable (nouns) |
| `glosses` | jsonb | `[{language,text,domain}]` |
| `examples` | jsonb | `[{basaa,translation,translation_language}]` |
| `dialect` | text | nullable |
| `variants` | jsonb | alternate spellings |
| `orthography_normalized` | boolean | |
| `confidence` | numeric | 0..1 |
| `review_status` | text | `raw | processed | validated` |
| `notes` | text | |

Indexes: `headword_normalized`, `part_of_speech`, GIN on `glosses`.

### `basaa_sentence_pairs`
Conforms to `schemas/basaa_sentence_pair.schema.json`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK | |
| `source_id` | uuid FK | |
| `basaa` | text | |
| `translation` | text | |
| `translation_language` | text | `en | fr | de` |
| `direction` | text | `bas->xx | xx->bas | unknown` |
| `domain` | text | e.g. health, greetings |
| `register` | text | `formal | informal | neutral | unknown` |
| `dialect` | text | nullable |
| `alignment` | text | `sentence | approximate | segment | unknown` |
| `source_location` | text | e.g. "page 142, Dialogue 7" |
| `orthography_normalized` | boolean | |
| `confidence` | numeric | |
| `review_status` | text | |
| `notes` | text | |

### `basaa_grammar_notes`
Structured notes from grammar/tone sources (Hyman, tone research).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK | |
| `source_id` | uuid FK | |
| `topic` | text | e.g. "noun classes", "verb extensions", "tone spreading" |
| `category` | text | `morphology | syntax | phonology | tone | orthography | other` |
| `rule` | text | the rule/description |
| `examples` | jsonb | interlinear examples where available |
| `dialect` | text | scope of the note |
| `citation` | text | source citation |
| `review_status` | text | |
| `notes` | text | |

### `basaa_orthography_rules`
Conversion/normalization rules between writing systems (from orthography research).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK | |
| `source_id` | uuid FK | |
| `rule_type` | text | `grapheme-map | tone-mark | diacritic | segmentation | other` |
| `from_system` | text | source writing system |
| `to_system` | text | canonical target system |
| `input_pattern` | text | matched form/pattern |
| `output` | text | normalized form |
| `conditions` | text | when the rule applies |
| `example` | jsonb | `{input, output}` |
| `priority` | int | application order |
| `review_status` | text | |
| `notes` | text | |

### `basaa_tech_terms`
Conforms to `schemas/basaa_tech_term.schema.json`. Career/tech vocabulary.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK | |
| `source_id` | uuid FK | nullable (may be coined, not sourced) |
| `term_source` | text | e.g. "database" |
| `source_language` | text | `en | fr` |
| `basaa_term` | text | tone preserved |
| `strategy` | text | `loanword | calque | coinage | descriptive | existing-word` |
| `domain` | text | computing, internet, finance, career, health-tech |
| `definition_basaa` | text | |
| `definition_gloss` | text | |
| `example` | jsonb | `{basaa, translation}` |
| `alternatives` | jsonb | candidate renderings |
| `approval_status` | text | `proposed | under-review | approved | deprecated` |
| `confidence` | numeric | |
| `review_status` | text | |
| `notes` | text | |

### `basaa_translation_memory`
Reusable TM segments produced/confirmed during translation work (feeds the Translation Agent
and future VoiceBridge). Distinct from `basaa_sentence_pairs`, which is corpus-sourced; TM is
operational and may be machine- or human-confirmed.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK | |
| `basaa` | text | |
| `translation` | text | |
| `translation_language` | text | `en | fr | de` |
| `domain` | text | |
| `register` | text | |
| `origin` | text | `corpus | human | machine | hybrid` |
| `quality` | text | `draft | reviewed | approved` |
| `usage_count` | int | how often reused |
| `source_pair_id` | uuid FK → `basaa_sentence_pairs` | nullable provenance |
| `notes` | text | |

### `basaa_quality_reviews`
Audit log of quality-reviewer decisions across the content tables.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `language_id` | uuid FK | |
| `target_table` | text | which content table the record is in |
| `target_id` | uuid | reviewed record id |
| `reviewer` | text | agent id or human identifier |
| `decision` | text | `approved | fixed | rejected` |
| `issues_found` | jsonb | structured list of issues |
| `before` | jsonb | snapshot pre-fix (nullable) |
| `after` | jsonb | snapshot post-fix (nullable) |
| `confidence` | numeric | |
| `notes` | text | |

---

## Build order (matches "strongest foundation first")

1. `african_languages`, `language_sources` (shared scaffolding) — seed Basaa + the 6 sources.
2. `basaa_dictionary_entries` (source #1 SIL/Webonary) and `basaa_sentence_pairs`
   (source #3 Peace Corps) — the two strongest foundations.
3. `basaa_orthography_rules` + `basaa_grammar_notes` (normalization & structure).
4. `basaa_tech_terms`, `basaa_translation_memory`, `basaa_quality_reviews` (operational).

## Before any SQL is written

- [ ] Confirm structure exists / naming with `list_tables` before proposing changes.
- [ ] Resolve `license_status = approved` for each source before its content table is loaded.
- [ ] Deliver SQL as a reviewable file + paste-ready block; human applies in Supabase.
- [ ] Follow each write with a verification `SELECT`.
