
-- Create waitlist table for upcoming courses
CREATE TABLE public.course_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  course_interest TEXT NOT NULL DEFAULT 'project_management',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate signups per course
ALTER TABLE public.course_waitlist ADD CONSTRAINT unique_email_per_course UNIQUE (email, course_interest);

-- Enable RLS
ALTER TABLE public.course_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can join waitlist"
ON public.course_waitlist
FOR INSERT
WITH CHECK (true);

-- Only allow users to see their own entries (by email match - optional future use)
CREATE POLICY "No public reads"
ON public.course_waitlist
FOR SELECT
USING (false);
