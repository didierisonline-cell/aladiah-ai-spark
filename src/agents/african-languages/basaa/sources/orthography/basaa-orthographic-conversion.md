# Source — Orthographic Conversion Research for Bàsàá

| Field | Value |
|---|---|
| **Title** | Orthographic Conversion Research for Bàsàá |
| **Source URL** | _TBD — confirm exact paper/DOI during license review._ |
| **Author / Institution** | Academic (author to be confirmed) |
| **Content type** | Academic research on orthography / writing-system conversion |
| **License / usage notes** | _Placeholder — TO REVIEW._ Academic; likely © author/publisher. Use for rule extraction and citation; confirm before verbatim reuse. |
| **Extraction value** | High for normalization. Basaa has **multiple writing systems**; this research defines mappings between them. Essential for standardizing spelling across all imported sources so AI training data is consistent. Primary source for `basaa_orthography_rules`. |
| **Priority level** | **5** |

## Why it matters

Every other source (dictionary, course, grammar) may use a different spelling convention.
Without a canonical orthography and documented conversion rules, datasets will be
internally inconsistent and unusable for training. This source defines the normalization
layer the whole pipeline depends on.

## Processing plan

1. **License first.** Confirm permissible use and the exact citation/URL; record here.
2. **Acquire** → `datasets/raw/`.
3. **Define canonical orthography** for the project and extract conversion rules
   (from-system → canonical) with examples.
4. **Encode rules** as structured `basaa_orthography_rules` (rule type, input, output,
   conditions, example, source).
5. **Apply** normalization during extraction/validation of all other sources.
6. **Review & validate** → `datasets/validated/`; **load** via reviewable SQL.

## Notes / TODO

- [ ] Identify and locate the exact paper(s); fill in URL/DOI and author.
- [ ] Decide the canonical writing system (e.g. General Alphabet of Cameroon Languages).
- [ ] Coordinate with tone research so tone-mark conversion is covered by the same rules.
