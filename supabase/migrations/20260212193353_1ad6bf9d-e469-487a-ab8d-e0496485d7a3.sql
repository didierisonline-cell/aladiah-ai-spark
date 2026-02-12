
-- Create a course_prerequisites table to track which courses must be completed
CREATE TABLE public.course_prerequisites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  prerequisite_group INT NOT NULL DEFAULT 0,
  prerequisite_course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_prerequisites ENABLE ROW LEVEL SECURITY;

-- Everyone can read prerequisites
CREATE POLICY "Prerequisites are publicly readable"
  ON public.course_prerequisites FOR SELECT
  USING (true);
