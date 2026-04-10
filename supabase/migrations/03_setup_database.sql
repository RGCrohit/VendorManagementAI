-- ============================================================
-- CureVendAI Database Setup — Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1. Drop existing objects for clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create the unified profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  username text,
  full_name text,
  company_name text,
  role text DEFAULT 'PENDING',
  -- Roles: PENDING, VENDOR, JUNIOR_PROJECT_MANAGER, PROJECT_MANAGER, HEAD_PROJECT_MANAGER, SCRUM_MASTER
  is_active boolean DEFAULT false,
  
  -- KYC Details
  gst_number text,
  ifsc_code text,
  bank_account text,
  bank_name text,
  pan_number text,
  aadhar_number text,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (KYC fields)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Scrum Masters have full CRUD access
CREATE POLICY "Scrum Masters have full access" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'SCRUM_MASTER'
    )
  );

-- Allow the trigger function to INSERT (it runs as SECURITY DEFINER)
-- But also allow service_role to manage profiles
CREATE POLICY "Service role full access" ON public.profiles
  FOR ALL USING (true)
  WITH CHECK (true);

-- 5. Auto-create profile on sign-up (handles email/password AND Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, company_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'company_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'company_name',
    COALESCE(new.raw_user_meta_data->>'role', 'PENDING')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Trigger: auto-create profile when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Backfill: create profiles for any existing auth users who don't have one
INSERT INTO public.profiles (id, email, username, full_name, role, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  COALESCE(u.raw_user_meta_data->>'role', 'PENDING'),
  true  -- Set existing users as active
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DONE! Your profiles table is ready.
-- Existing users have been backfilled with is_active = true.
-- New sign-ups will auto-create a profile via the trigger.
-- ============================================================
