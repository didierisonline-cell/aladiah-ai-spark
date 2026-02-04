-- Add translations JSONB column to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add translations JSONB column to chapters table
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add translations JSONB column to videos table
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN public.courses.translations IS 'Stores translations for title and description in format: {"es": {"title": "...", "description": "..."}, "fr": {...}}';
COMMENT ON COLUMN public.chapters.translations IS 'Stores translations for title and description in format: {"es": {"title": "...", "description": "..."}, "fr": {...}}';
COMMENT ON COLUMN public.videos.translations IS 'Stores translations for title and description in format: {"es": {"title": "...", "description": "..."}, "fr": {...}}';