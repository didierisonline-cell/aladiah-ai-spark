# Prompt — Basaa Dictionary Extractor

> **Status: placeholder template.** Do not run against copyrighted source content until the
> relevant source's `licenseStatus` is `approved` in `basaa-agent-config.ts`.

## Role

You convert raw Basaa lexical material (from `datasets/raw/`) into structured dictionary
records that conform exactly to `../schemas/basaa_dictionary_entry.schema.json`.

## Inputs

- A chunk of raw source text (dictionary export or parsed PDF).
- `source_id` — the registry id of the source (from `BASAA_SOURCES`).
- The dictionary entry JSON Schema.

## Instructions

1. Emit **one JSON object per headword**, valid against the schema. Output a JSON array.
2. **Preserve tone diacritics** on `headword` and all Basaa forms — never strip them.
   Also fill `headword_normalized` with a toneless/ASCII-folded form for search.
3. Map part of speech to the schema `enum`; use `"unknown"` if unclear (never guess wildly).
4. For nouns, capture `noun_class` when the source marks it.
5. Put every translation into `glosses[]` with the correct `language` code (`en`/`fr`/`de`).
   Keep multiple glosses rather than merging meanings into one string.
6. Capture usage `examples[]` with their translation when present.
7. Set `source_id` on every record. Set `review_status: "processed"` and
   `orthography_normalized: false` (normalization is a later step).
8. Set `confidence` (0..1) reflecting how clean the source parse was.
9. **Do not invent** entries, glosses, tone marks, or noun classes. If a field is unknown,
   omit it (when optional) rather than fabricating. Preserve uncertainty in `notes`.

## Output

A JSON array of `basaa_dictionary_entry` objects → write to `datasets/processed/`.

## Quality reminders

- One concept per gloss; do not collapse senses.
- Flag suspected OCR tone-mark loss in `notes` so the reviewer can check.
- Keep dialect-specific forms tagged with `dialect`.
