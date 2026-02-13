
-- Community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'general' CHECK (post_type IN ('intro', 'general', 'question', 'feedback')),
  intro_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community replies table
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- Posts: anyone authenticated can read all posts
CREATE POLICY "Authenticated users can view all posts"
ON public.community_posts FOR SELECT TO authenticated
USING (true);

-- Posts: users can create their own
CREATE POLICY "Users can create own posts"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Posts: users can update their own
CREATE POLICY "Users can update own posts"
ON public.community_posts FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Posts: users can delete their own
CREATE POLICY "Users can delete own posts"
ON public.community_posts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Replies: authenticated can read all
CREATE POLICY "Authenticated users can view all replies"
ON public.community_replies FOR SELECT TO authenticated
USING (true);

-- Replies: users can create their own
CREATE POLICY "Users can create own replies"
ON public.community_replies FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Replies: users can delete their own
CREATE POLICY "Users can delete own replies"
ON public.community_replies FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Add has_completed_intro to profiles
ALTER TABLE public.profiles ADD COLUMN has_completed_intro BOOLEAN NOT NULL DEFAULT false;

-- Index for performance
CREATE INDEX idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX idx_community_posts_post_type ON public.community_posts(post_type);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_replies_post_id ON public.community_replies(post_id);

-- Enable realtime for community
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_replies;
