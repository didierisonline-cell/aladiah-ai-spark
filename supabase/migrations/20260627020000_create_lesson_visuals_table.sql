-- =============================================================================
-- Create lesson_visuals table for caching AI-generated SVG diagrams.
-- ChapterView.tsx reads from here first; on miss it calls generate-visuals
-- edge function and upserts the result back here so the next visit is instant.
-- RLS: public read + authenticated write (SVG diagrams are not sensitive data).
-- =============================================================================

CREATE TABLE IF NOT EXISTS lesson_visuals (
  lesson_id  TEXT PRIMARY KEY,           -- "{video_id}::{language}" composite key
  svgs       JSONB        NOT NULL,      -- array of SVG strings
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE lesson_visuals ENABLE ROW LEVEL SECURITY;

-- Anyone can read cached diagrams
CREATE POLICY "Public read lesson_visuals"
  ON lesson_visuals FOR SELECT USING (true);

-- Any authenticated user can cache generated visuals
CREATE POLICY "Authenticated upsert lesson_visuals"
  ON lesson_visuals FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Verify
SELECT 'lesson_visuals table ready' AS status;
