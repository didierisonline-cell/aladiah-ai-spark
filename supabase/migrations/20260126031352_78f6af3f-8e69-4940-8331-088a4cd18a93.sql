-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz type enum
CREATE TYPE public.quiz_type AS ENUM ('mini_video', 'chapter_end');

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  quiz_type public.quiz_type NOT NULL,
  passing_score INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT quiz_video_or_chapter CHECK (
    (quiz_type = 'mini_video' AND video_id IS NOT NULL) OR 
    (quiz_type = 'chapter_end' AND video_id IS NULL)
  )
);

-- Create quiz questions table (correct_answer hidden via view)
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  scenario_context TEXT,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id),
  UNIQUE(user_id, quiz_id)
);

-- Create view for quiz questions without correct answer (for users)
CREATE VIEW public.quiz_questions_public
WITH (security_invoker=on) AS
SELECT 
  id,
  quiz_id,
  question_text,
  scenario_context,
  options,
  explanation,
  order_index,
  created_at
FROM public.quiz_questions;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Helper function to check profile ownership
CREATE OR REPLACE FUNCTION public.is_owner_profile(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = profile_user_id
$$;

-- Helper function to check if user passed a quiz
CREATE OR REPLACE FUNCTION public.user_passed_quiz(p_user_id UUID, p_quiz_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE user_id = p_user_id 
    AND quiz_id = p_quiz_id 
    AND passed = true
  )
$$;

-- Helper function to check if user can access a video
CREATE OR REPLACE FUNCTION public.can_access_video(p_user_id UUID, p_video_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_video RECORD;
  v_prev_video RECORD;
  v_prev_quiz_id UUID;
BEGIN
  -- Get video info
  SELECT v.*, c.order_index as chapter_order 
  INTO v_video 
  FROM videos v
  JOIN chapters c ON c.id = v.chapter_id
  WHERE v.id = p_video_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- First video of first chapter is always accessible
  IF v_video.order_index = 0 AND v_video.chapter_order = 0 THEN
    RETURN true;
  END IF;
  
  -- Check if previous video's quiz was passed
  IF v_video.order_index > 0 THEN
    -- Get previous video in same chapter
    SELECT id INTO v_prev_video
    FROM videos
    WHERE chapter_id = v_video.chapter_id
    AND order_index = v_video.order_index - 1;
    
    IF FOUND THEN
      -- Get the quiz for previous video
      SELECT id INTO v_prev_quiz_id
      FROM quizzes
      WHERE video_id = v_prev_video.id
      AND quiz_type = 'mini_video';
      
      IF v_prev_quiz_id IS NOT NULL AND NOT public.user_passed_quiz(p_user_id, v_prev_quiz_id) THEN
        RETURN false;
      END IF;
    END IF;
  ELSE
    -- First video of a chapter - check if previous chapter's end quiz was passed
    DECLARE
      v_prev_chapter RECORD;
      v_chapter_quiz_id UUID;
    BEGIN
      SELECT id INTO v_prev_chapter
      FROM chapters
      WHERE course_id = (SELECT course_id FROM chapters WHERE id = v_video.chapter_id)
      AND order_index = v_video.chapter_order - 1;
      
      IF FOUND THEN
        SELECT id INTO v_chapter_quiz_id
        FROM quizzes
        WHERE chapter_id = v_prev_chapter.id
        AND quiz_type = 'chapter_end';
        
        IF v_chapter_quiz_id IS NOT NULL AND NOT public.user_passed_quiz(p_user_id, v_chapter_quiz_id) THEN
          RETURN false;
        END IF;
      END IF;
    END;
  END IF;
  
  RETURN true;
END;
$$;

-- RLS Policies

-- Profiles: users can manage their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Courses: publicly viewable if published
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

-- Chapters: viewable if course is published
CREATE POLICY "Anyone can view chapters of published courses" ON public.chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = chapters.course_id 
      AND is_published = true
    )
  );

-- Videos: viewable if user has access
CREATE POLICY "Users can view accessible videos" ON public.videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chapters c
      JOIN courses co ON co.id = c.course_id
      WHERE c.id = videos.chapter_id
      AND co.is_published = true
    )
  );

-- Quizzes: viewable if course is published
CREATE POLICY "Users can view quizzes" ON public.quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chapters c
      JOIN courses co ON co.id = c.course_id
      WHERE c.id = quizzes.chapter_id
      AND co.is_published = true
    )
  );

-- Quiz questions: deny direct SELECT (use edge function)
CREATE POLICY "No direct access to quiz questions" ON public.quiz_questions
  FOR SELECT USING (false);

-- Quiz attempts: users can manage their own
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts" ON public.quiz_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- User progress: users can manage their own
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();