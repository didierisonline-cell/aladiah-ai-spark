-- Allow public read of referral_codes by code (for personalized landing pages)
CREATE POLICY "Anyone can look up referral codes by code"
ON public.referral_codes
FOR SELECT
USING (true);

-- Drop the restrictive owner-only policy since we now allow public lookups
DROP POLICY IF EXISTS "Users can view own referral codes" ON public.referral_codes;

-- Allow public read of profiles for referral profile pages
CREATE POLICY "Public can view profiles for referral pages"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the restrictive owner-only policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;