# Basaa schemas

The five Basaa tables (`basaa_dictionary_entries`, `basaa_sentence_pairs`,
`basaa_tech_terms`, `basaa_translation_memory`, `basaa_quality_reviews`) ship in
the **same** reviewable migration as the shared language tables, so they are
applied together in one reviewed step:

- Canonical: `supabase/migrations/20260616000000_language_adaptation.sql`
- Agent copy: `../../global-language-adaptation/schemas/0001_language_adaptation.sql`

Per the Aladiah canon, this SQL is applied **by hand** in the Supabase SQL
editor — Claude Code does not auto-apply it.
