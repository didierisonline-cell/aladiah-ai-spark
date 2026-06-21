# Protected Terms — Aladiah i18n

These terms render **verbatim** in every language (LTR and RTL). Everything *not*
on this list is student-facing copy and **must** be translated or intentionally
localized. When in doubt, translate.

## Always protected (never translated, never transliterated unless noted)

| Term | Notes |
|---|---|
| Aladiah Academy | Brand. "Aladiah" alone is also protected. |
| Prof. Didier | Mentor brand. In Arabic body copy the descriptive "البروفيسور ديدير" is allowed, but "Prof. Didier" as a label stays Latin. |
| Talent Score™ | Trademark — keep the ™. |
| All-Access Pass™ | Trademark — keep the ™. |
| Scrum | Framework name (Scrum.org). "Scrum Master" keeps "Scrum"; the role word may localize around it. |
| GitHub | Product. |
| AWS | Product. |
| Google Cloud | Product. |
| Microsoft | Product. |
| PMI | Organization. |
| Scrum.org | Organization. |
| Stripe | Product. |
| ElevenLabs | Product. |
| LinkedIn | Product. |
| DevOps, MLOps, UX | Industry technical tokens kept verbatim inside role titles. |
| Foundation Builder | Plan/tier name — founder-ratified, keep English in all languages. |
| Career Accelerator | Plan/tier name — founder-ratified, keep English in all languages. |
| Elite Mentorship | Plan/tier name — founder-ratified, keep English in all languages. |

> Plan/tier names render verbatim like the ™ brands. The audit exempts them via
> `TIER_NAMES` in `scripts/i18n-audit.mjs`.

## "AI" — context-dependent

- **As a standalone brand/category label** (nav chips, "AI Mentor", "AI Workforce
  Programs" section header): keep **AI**.
- **Inside a localized role/program title**: localize to the language's accepted
  form per the style guide below. This is why "AI Data Engineer" becomes
  "Ingeniero de Datos con **IA**" / "**KI**-Dateningenieur" / "**AI**数据工程师".

### Per-language form of "AI" in role titles

| Lang | Form | Example (AI Data Engineer) |
|---|---|---|
| en | AI | AI Data Engineer |
| es | IA | Ingeniero de Datos con IA |
| fr | IA | Ingénieur Data IA |
| pt | IA | Engenheiro de Dados com IA |
| de | KI | KI-Dateningenieur |
| ar | الذكاء الاصطناعي | مهندس بيانات الذكاء الاصطناعي |
| zh | AI | AI数据工程师 |
| hi | एआई | एआई डेटा इंजीनियर |

## Where this is enforced in code

- **Program/course titles** — `src/lib/programCatalog.ts` holds the human-authored
  localized titles for the whole catalog (incl. the Scrum flagship). Protected
  tokens above are kept verbatim inside each entry.
- **Diagram labels** — `supabase/functions/generate-visuals/index.ts` instructs the
  model to translate labels into the selected language while keeping the protected
  tokens (Aladiah, Scrum, AI, Sprint, Kanban, SAFe, Jira, GitHub) unchanged.
- **Dictionary** — `src/contexts/LanguageContext.tsx` keeps `Talent Score™`,
  `All-Access Pass™`, etc. verbatim across all 8 language blocks.

## RTL (Arabic)

Arabic is the only RTL launch language. Protected Latin tokens (Aladiah, Scrum,
AWS, GitHub, AI, ™ marks) stay LTR inside RTL runs; the browser's bidi algorithm
handles this when the surrounding container is `dir="rtl"`. Do not hardcode left/
right; use logical properties (margin-inline, inset-inline, text-align: start/end).
