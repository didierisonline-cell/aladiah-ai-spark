# Publish-Layer Templates

> Reference templates governed by `docs/standards/PUBLISH_LAYER.md`. Kept as
> markdown because the repo `.gitignore` tracks `*.sql` **only** under
> `supabase/migrations/` (real migrations); everything else SQL is treated as a
> one-off script. To use a template: copy the block into a new
> `supabase/migrations/<timestamp>_publish_<program>.sql`, fill from the
> program's `PUBLISH_MANIFEST.md`, deliver it as a reviewable file + paste-ready
> block, and let the founder apply it by hand. Claude Code never auto-applies.

## 1. Publish migration (idempotent, gated, competency-tagged)

Invariants this pattern enforces (see standard §3):
- Idempotent — re-running does not duplicate (keys on title+version, order_index).
- Seeds `is_published = false`; founder flips to true only after verify passes.
- Every `quiz_questions` row sets `competency` (approved slug) + `translations`.
- Every learn-path row sets `translations := '{}'::jsonb` (Priority-2 ready).

```sql
-- <timestamp>_publish_<program>.sql
DO $$
DECLARE
  v_title   text := '<COURSE TITLE>';
  v_version text := '<curriculum_version e.g. ba-v1>';
  cid uuid;
  ch  uuid;
  qz  uuid;
BEGIN
  -- 1) Course (upsert by title + curriculum_version) ------------------------
  SELECT id INTO cid FROM public.courses
    WHERE title = v_title AND curriculum_version = v_version;
  IF cid IS NULL THEN
    INSERT INTO public.courses (title, description, is_published, is_flagship,
        flagship_version, curriculum_version, launch_status,
        target_market, target_salary_low, target_salary_high, translations)
    VALUES (v_title, '<one-line description>',
        false,                 -- gate: publish only after verification
        true, v_version, v_version, 'draft',
        '<target market>', <salary_low>, <salary_high>, '{}'::jsonb)
    RETURNING id INTO cid;
  END IF;

  -- 2) Module (chapter) — repeat this whole block per module ----------------
  SELECT id INTO ch FROM public.chapters
    WHERE course_id = cid AND order_index = <N>;
  IF ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (cid, '<Module N title>', '<module description>', <N>, '{}'::jsonb)
    RETURNING id INTO ch;
  END IF;

  --   2a) Lessons (videos) — only insert when the module is empty
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
      (ch, '<Lesson N.1 title>', '<desc>', 1, '{}'::jsonb),
      (ch, '<Lesson N.2 title>', '<desc>', 2, '{}'::jsonb),
      (ch, '<Lesson N.3 title>', '<desc>', 3, '{}'::jsonb),
      (ch, '<Lesson N.4 title>', '<desc>', 4, '{}'::jsonb),
      (ch, '<Lesson N.5 title>', '<desc>', 5, '{}'::jsonb);
  END IF;

  --   2b) Module exam (chapter_end quiz) + questions
  SELECT id INTO qz FROM public.quizzes
    WHERE chapter_id = ch AND quiz_type = 'chapter_end';
  IF qz IS NULL THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score)
    VALUES (ch, 'chapter_end', 85)               -- flagship default pass = 85
    RETURNING id INTO qz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quiz_questions WHERE quiz_id = qz) THEN
    INSERT INTO public.quiz_questions
      (quiz_id, question_text, scenario_context, options, correct_answer_index,
       explanation, order_index, competency, translations) VALUES
      (qz, '<question?>', '<scenario>',
       '["<A>","<B>","<C>","<D>"]'::jsonb, <0-3>, '<why>', 1,
       '<program:slug>', '{}'::jsonb)
      -- ... repeat to ~20 questions; competency set on EVERY row ...
      ;
  END IF;

  -- 3) Repeat block 2 for every module. ------------------------------------
  -- 4) Career-transformation assets (program_* ; each is_published=false) ---
  --    program_simulations / program_labs / program_portfolios /
  --    program_interview_prep / program_ai_mentor_prompts / program_capstones /
  --    program_certifications — each with course_id=cid, competency, is_published=false.
END $$;

-- After applying: run the verification block. Only when it passes AND the
-- founder approves, flip the course live:
--   UPDATE public.courses SET is_published = true, launch_status = 'live'
--   WHERE title = '<COURSE TITLE>' AND curriculum_version = '<version>';
```

## 2. Verification (run after applying, before flipping `is_published`)

"Success / no rows" means it RAN, not that it is CORRECT. A publish is "done"
only when: counts == manifest, `untagged == 0`, every competency is an approved
slug, and the founder flips `is_published`.

```sql
\set title '<COURSE TITLE>'
\set ver   '<curriculum_version>'

-- 1) Structure counts vs the manifest
SELECT c.title, c.curriculum_version, c.is_published, c.launch_status,
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id = c.id) AS modules,
  (SELECT count(*) FROM public.videos v
     JOIN public.chapters ch ON ch.id = v.chapter_id WHERE ch.course_id = c.id) AS lessons,
  (SELECT count(*) FROM public.quizzes q
     JOIN public.chapters ch ON ch.id = q.chapter_id
     WHERE ch.course_id = c.id AND q.quiz_type = 'chapter_end') AS exams,
  (SELECT count(*) FROM public.quiz_questions qq
     JOIN public.quizzes q   ON q.id  = qq.quiz_id
     JOIN public.chapters ch ON ch.id = q.chapter_id WHERE ch.course_id = c.id) AS questions
FROM public.courses c
WHERE c.title = :'title' AND c.curriculum_version = :'ver';

-- 2) Mandatory competency tagging — MUST return 0
SELECT count(*) AS untagged_questions
FROM public.quiz_questions qq
  JOIN public.quizzes q   ON q.id  = qq.quiz_id
  JOIN public.chapters ch ON ch.id = q.chapter_id
  JOIN public.courses c   ON c.id  = ch.course_id
WHERE c.title = :'title' AND c.curriculum_version = :'ver'
  AND (qq.competency IS NULL OR qq.competency = '');

-- 3) Competency coverage — eyeball against COMPETENCY_TAXONOMY.md
SELECT qq.competency, count(*) AS n
FROM public.quiz_questions qq
  JOIN public.quizzes q   ON q.id  = qq.quiz_id
  JOIN public.chapters ch ON ch.id = q.chapter_id
  JOIN public.courses c   ON c.id  = ch.course_id
WHERE c.title = :'title' AND c.curriculum_version = :'ver'
GROUP BY qq.competency ORDER BY qq.competency;

-- 4) Empty modules / exams — MUST return 0 rows
SELECT ch.order_index, ch.title,
  (SELECT count(*) FROM public.videos v WHERE v.chapter_id = ch.id) AS lessons,
  (SELECT count(*) FROM public.quizzes q WHERE q.chapter_id = ch.id
     AND q.quiz_type = 'chapter_end') AS exams
FROM public.chapters ch JOIN public.courses c ON c.id = ch.course_id
WHERE c.title = :'title' AND c.curriculum_version = :'ver'
  AND ((SELECT count(*) FROM public.videos v WHERE v.chapter_id = ch.id) = 0
    OR (SELECT count(*) FROM public.quizzes q WHERE q.chapter_id = ch.id
          AND q.quiz_type = 'chapter_end') = 0)
ORDER BY ch.order_index;

-- 5) Readiness snapshot (canon view)
SELECT * FROM public.program_content_readiness
WHERE program = :'title' OR title = :'title';
```
