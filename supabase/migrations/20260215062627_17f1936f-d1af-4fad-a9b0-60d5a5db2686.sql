
-- Table for unique referral codes per user
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  program_type TEXT NOT NULL CHECK (program_type IN ('student', 'affiliate')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track referrals
CREATE TABLE public.referral_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id),
  referred_email TEXT,
  referred_user_id UUID,
  status TEXT NOT NULL DEFAULT 'clicked' CHECK (status IN ('clicked', 'registered', 'qualified')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_tracking ENABLE ROW LEVEL SECURITY;

-- Referral codes policies
CREATE POLICY "Users can view own referral codes"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referral codes"
  ON public.referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Referral tracking policies
CREATE POLICY "Users can view tracking for own codes"
  ON public.referral_tracking FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.referral_codes rc
    WHERE rc.id = referral_tracking.referral_code_id
    AND rc.user_id = auth.uid()
  ));

-- Anyone can insert tracking (when clicking a referral link)
CREATE POLICY "Anyone can create tracking entries"
  ON public.referral_tracking FOR INSERT
  WITH CHECK (true);

-- Function to generate a unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;
