-- RE-INITIALIZE DATABASE FOR CLEAN START
-- This script resets the profiles table to be the single source of truth for user access and metadata.

-- 1. Drop existing objects to ensure a clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

-- 2. Create the unified profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  username text, -- Can be company name or full name
  full_name text,
  company_name text,
  role text DEFAULT 'PENDING', -- PENDING, VENDOR, JUNIOR_PROJECT_MANAGER, PROJECT_MANAGER, HEAD_PROJECT_MANAGER, SCRUM_MASTER
  is_active boolean DEFAULT false, -- Admin must set to true for access
  
  -- KYC Details (Optional, filled after login)
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

-- 4. Set up RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (for KYC)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Scrum Masters can see and update everything
CREATE POLICY "Scrum Masters have full access" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'SCRUM_MASTER'
    )
  );

-- 5. Create handle_new_user function
-- This function handles metadata from both standard email/pass and Google Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, company_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'company_name', new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    COALESCE(new.raw_user_meta_data->>'role', 'PENDING')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Re-create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
