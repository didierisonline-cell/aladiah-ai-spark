# Basaa Source — License & Rights Review

> **Phase 2.** This is a planning analysis, **not legal advice**. It records the best
> available understanding of each source's rights so a human can make the final
> import/no-import call. A source may only be ingested once its `license_status` is set to
> **`approved`** in `basaa-agent-config.ts` / `language_sources`.

## Risk legend

| Tier | Meaning | Action |
|---|---|---|
| 🟢 **Clear** | Open license or public domain; reuse (incl. likely commercial) permitted with attribution. | Proceed after confirming the specific license. |
| 🟡 **Conditional** | Reusable for our derived/structured use, or needs a confirmation step. | Proceed on the low-risk path; document. |
| 🔴 **Gated** | Reuse requires written permission. | Do **not** import until permission obtained. |

---

## S1 + S2 — SIL / Webonary Dictionary (online + PDF) — 🔴 Gated

- **What we know.** Webonary's *software* is GPL, but that is the platform, **not the
  content**. Per SIL's [Terms of Service](https://www.webonary.org/sil-international-terms-of-service-for-webonary-org/),
  content is contributed under a **non-exclusive license to SIL**; copyright is **retained
  by the contributing project/authors**. No blanket public reuse, bulk-extraction, or
  redistribution right is granted to third parties.
- **Commercial use.** Not permitted without written permission from SIL and/or the
  dictionary owner.
- **Why it matters most.** This is our single highest-value lexical asset (~16,000 entries),
  so getting permission is worth real effort — but we must not extract first and ask later.
- **Required action (blocking):**
  1. Identify the specific dictionary owner/project via the [SIL catalog entry](https://www.sil.org/resources/archives/47253).
  2. Request **written permission** for (a) data extraction, (b) storage in Aladiah's DB,
     (c) use in a learning/translation product, and (d) commercial use.
  3. Clarify attribution requirements and whether a data-sharing agreement is needed.
  4. **No scraping** of the live site under any circumstances; if granted, prefer an
     official export/PDF (S2).
- **Fallback if denied.** Use the dictionary only as a *reference* for human reviewers
  (not ingested), and lean on open sources (S3/S5) for the seed lexicon.

## S3 — Peace Corps Basaa Course — 🟡 Conditional (leaning 🟢)

- **What we know.** Authored by the **U.S. Peace Corps**; works of the U.S. federal
  government are generally **public domain** in the U.S. Live Lingua hosts it as
  public-domain material, **disclaims ownership**, and notes that **commercial** users
  should contact the Peace Corps.
- **Residual risk.** Some Peace Corps language materials incorporate locally-authored or
  third-party content; "U.S. gov work" is not automatic for every page. Edition-specific.
- **Required action:**
  1. Confirm this edition's provenance is wholly Peace Corps / U.S. gov (scan front matter
     for third-party credits).
  2. For **commercial** deployment, send a courtesy confirmation to Peace Corps as Live
     Lingua advises; record the response.
  3. Preserve attribution to Peace Corps + Live Lingua.
- **Verdict.** **Best risk-adjusted source.** Strong public-domain footing; proceed to
  acquire (download PDFs + audio) and begin extraction once the front-matter check passes.

## S4 — Hyman Grammar Chapter — 🟡 Conditional

- **What we know.** © **Routledge / Taylor & Francis** (book chapter). The author hosts a
  freely readable PDF on his Berkeley page. **Facts and linguistic rules are not
  copyrightable**; the specific text/expression is.
- **Permitted (low risk).** Reading the PDF, then writing **our own structured grammar
  notes/rules** with citation to Hyman (2003).
- **Not permitted without permission.** Reproducing substantial verbatim passages, tables,
  or the full text into our datasets/product.
- **Required action:** extract *rules and structure*, not prose; cite properly; keep raw
  PDF out of redistributed datasets.

## S5 — Orthographic Conversion Papers — 🟢 Clear (pending per-paper confirmation)

- **What we know.** ACL Anthology paper [2023.rail-1.11](https://aclanthology.org/2023.rail-1.11/)
  — ACL Anthology content is standardly **CC-BY 4.0**. arXiv [2210.06986](https://arxiv.org/abs/2210.06986)
  — license is author-selected (often CC-BY or arXiv non-exclusive).
- **Commercial use.** Permitted under CC-BY with attribution (confirm each paper's stated
  license before relying on it commercially).
- **Required action:** record the exact license string from each paper's page; check for
  companion **code/data** (e.g. transducer rules, training pairs) and its separate license.
- **Verdict.** Cleanest reuse profile; **adopt for the orthography-normalization layer.**

## S6 — Tone Research — 🟡 Mixed

- **What we know.** **langsci-press** volumes (e.g. the downstep/phonological-phrase work)
  are **open access CC-BY**. The Cambridge *JIPA* "Basaá" article is **paywalled/©**. Other
  items vary.
- **Required action:** prefer CC-BY open-access items for any ingested rules; treat
  paywalled items as citation-only reference. Confirm each work's license individually.
- **Verdict.** Use the open-access subset; do not ingest paywalled text.

---

## Discovered candidates — rights to verify (Phase 3)

| Candidate | Likely posture | Verify |
|---|---|---|
| **BULBasaa** speech corpus | Research corpus, possibly CC-BY / research-only | Exact license + whether commercial/product use is allowed; redistribution terms for audio. |
| **langsci-press** Bàsàá phonology volume | 🟢 CC-BY (open access) | Confirm the specific volume's CC-BY version. |

---

## License gate — summary

| Source | Tier | Import before action? | Blocking action |
|---|---|---|---|
| S1/S2 SIL dictionary | 🔴 Gated | **No** | Written permission from SIL/owner. |
| S3 Peace Corps | 🟡→🟢 | After front-matter check | Confirm PD provenance; courtesy note for commercial. |
| S4 Hyman grammar | 🟡 | Notes/rules only | Cite; no verbatim bulk reuse. |
| S5 Orthography papers | 🟢 | After confirming CC-BY | Record license string + check companion data. |
| S6 Tone research | 🟡 | Open-access subset only | Per-work license confirmation. |

**Bottom line:** Begin with **S3 (Peace Corps)** and **S5 (orthography)** — the cleanest
rights — while pursuing **S1 permission** in parallel because of its unmatched lexical value.
