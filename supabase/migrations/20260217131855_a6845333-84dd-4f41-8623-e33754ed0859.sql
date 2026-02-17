
-- Create the handle_updated_at function first
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Student Learning Profile
CREATE TABLE public.student_learning_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id),
  weak_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  strong_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_style TEXT NOT NULL DEFAULT 'balanced',
  preferred_difficulty TEXT NOT NULL DEFAULT 'beginner',
  avg_time_per_lesson INTEGER NOT NULL DEFAULT 0,
  total_questions_asked INTEGER NOT NULL DEFAULT 0,
  struggle_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_struggle_topic TEXT,
  needs_intervention BOOLEAN NOT NULL DEFAULT false,
  review_queue JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_review_at TIMESTAMPTZ,
  engagement_score NUMERIC(5,2) NOT NULL DEFAULT 50.0,
  quiz_accuracy_trend JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_rewatch_count INTEGER NOT NULL DEFAULT 0,
  lab_completion_rate NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.student_learning_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning profile"
  ON public.student_learning_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning profile"
  ON public.student_learning_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning profile"
  ON public.student_learning_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all learning profiles"
  ON public.student_learning_profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_learning_profiles_updated_at
  BEFORE UPDATE ON public.student_learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
