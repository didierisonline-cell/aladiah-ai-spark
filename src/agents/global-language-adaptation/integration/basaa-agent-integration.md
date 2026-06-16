# Basaa Agent Integration

> Connects this agent to `/src/agents/african-languages/basaa/` (responsibility #5).
> This agent is the **runtime capture + governance** layer; the Basaa Agent is the
> **curated language intelligence** layer. Approved Basaa data flows from here into there.

## Relationship

```
Global Language Adaptation Agent          African Languages / Basaa Agent
─────────────────────────────────         ───────────────────────────────────
captures live student input        ──▶    receives APPROVED data to enrich its
governs review (unreviewed→approved)       curated corpus & lexicon
logs missing translations                  provides canonical lexicon + orthography
serves the platform in Basaa        ◀──    + tone rules used for rendering/normalization
```

## Data this agent sends INTO the Basaa Agent (only when `approved`)

| From (this agent) | To (Basaa module) | Schema reference |
|---|---|---|
| approved single word + glosses + tone | `basaa_dictionary_entries` | `african-languages/basaa/schemas/basaa_dictionary_entry.schema.json` |
| approved aligned phrase/sentence | `basaa_sentence_pairs` | `…/basaa_sentence_pair.schema.json` |
| approved tech/career coinage | `basaa_tech_terms` | `…/basaa_tech_term.schema.json` |
| approved reusable segment | `basaa_translation_memory` | (table in `basaa-database-plan.md`) |
| the review decision (audit) | `basaa_quality_reviews` | (table in `basaa-database-plan.md`) |

## Data this agent CONSUMES FROM the Basaa Agent

- **`basaa_dictionary_entries`** — to render Basaa UI/lesson terms and to validate/dedupe
  student submissions during AI review.
- **`basaa_orthography_rules`** — to normalize submissions to canonical **AGLC** spelling
  before promotion.
- **`basaa_translation_memory` / `basaa_sentence_pairs`** — to pre-fill translations and
  drive the Basaa fallback chain (FR → EN) intelligently.
- **tone rules** — for VoiceBridge-bound pronunciation data.

## Boundaries (avoid duplication — Architecture Principle anti-pattern)

- The Basaa Agent remains the **single source of truth for curated Basaa lexicon/grammar**.
  This agent does **not** fork a competing Basaa dictionary; it feeds the existing one.
- `language_vocabulary_entries` (this agent) holds the **cross-language** official lexicon
  for *all* languages; for Basaa it stays in sync with `basaa_dictionary_entries` (Basaa is
  the deeper, tone/grammar-aware store; the generic table is the platform-serving view).
- Registry link is declared in `global-language-config.ts`
  (`basaaIntegration.modulePath` / `enriches`).

## Sequencing

Basaa enrichment depends on the Basaa Agent's Phase-3 extraction tables existing (per
`basaa-database-plan.md`) and on the canonical orthography (AGLC) being ratified. Until
then, Basaa submissions are captured and reviewed here and **queued** for enrichment; no
cross-write happens before the Basaa tables are live and approved.
