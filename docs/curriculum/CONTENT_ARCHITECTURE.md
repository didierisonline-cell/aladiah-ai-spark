# Aladiah Curriculum Content Architecture v1.0

**Migration:** `supabase/migrations/20260611000000_curriculum_content_architecture.sql` (apply by hand in Supabase).
**Principle:** every launch-readiness score traces to **authored, published rows in Supabase** — no code-only assumptions.

## Entities
| Entity | Table | Level |
|---|---|---|
| Program | `courses` (existing) | program |
| Module | `chapters` (existing) | program → module |
| Lesson | `videos` (existing) | module |
| Quiz | `quizzes` (existing, `chapter_end`) | module |
| **Simulation** | `program_simulations` | module |
| **Portfolio** | `program_portfolios` | module |
| **Interview Prep** | `program_interview_prep` | module |
| **AI Mentor Prompt** | `program_ai_mentor_prompts` | module |
| **Capstone** | `program_capstones` | program |
| **Certification** | `program_certifications` | program |

## Every asset carries (your required lifecycle fields)
`status` (draft·in_review·approved·published·archived) · `completion_pct` · `author` · `version` · `created_at` · `updated_at` · `is_published` · `readiness_score` — plus `course_id`, optional `chapter_id`, `title`, `order_index`, and type-specific fields (scenario/scoring, deliverable/rubric, questions, prompt/activity, brief/rubric, exam_blueprint/passing_score).

## Security
- RLS on every new table. **Admin/founder** full access via `aos_is_admin()`; **published** rows readable by authenticated users (students).
- `updated_at` auto-maintained by trigger. Indexed on `course_id`.

## Authoritative readiness (in the DB, traceable)
View **`public.program_content_readiness`** (security_invoker) aggregates **published** counts per program and computes the score. World-class targets & weights:

| Dimension | Target | Weight |
|---|:--:|:--:|
| Modules | 18 | 0.12 |
| Lessons | 162 | 0.18 |
| Quizzes | 18 | 0.12 |
| Simulations | 54 | 0.18 |
| Portfolios | 18 | 0.12 |
| Interview Prep | 18 | 0.08 |
| AI Mentor Prompts | 18 | 0.05 |
| Capstones | 1 | 0.08 |
| Certifications | 1 | 0.07 |

`readiness_score = round(100 · Σ weightᵢ · min(haveᵢ/targetᵢ, 1))` · `launch_ready = readiness_score ≥ 90`.

The dashboard (`/admin/curriculum-excellence` → **Launch Matrix**) computes the same from these tables, and adds per-module "missing" drill-down. Both read **only Supabase** — no code curriculum is counted.

## Content Completion Matrix (run live in Supabase SQL editor)
```sql
SELECT program, modules, lessons, quizzes, simulations, portfolios,
       interview_prep, ai_mentor_prompts, capstones, certifications,
       readiness_score, launch_ready
FROM public.program_content_readiness
ORDER BY readiness_score DESC;
```

## Expected first result (honest)
Until simulations/portfolios/interview/mentor/capstones/certifications are **authored and published**, those columns are **0**, so every program caps well below 90% → **launch_ready = false for all**. As content is authored and `is_published` flips true, scores climb and programs cross the 90% launch line — fully traceable to the rows that exist.

---
*Service: `src/services/curriculum/readiness.ts` (DB-only). View: migration `20260611000000`.*
