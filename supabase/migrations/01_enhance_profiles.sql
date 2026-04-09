-- Add vendor-specific columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS gst_number text,
  ADD COLUMN IF NOT EXISTS ifsc_code text,
  ADD COLUMN IF NOT EXISTS bank_account text,
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS pan_number text,
  ADD COLUMN IF NOT EXISTS aadhar_number text;

-- Replace the trigger function to capture the new fields from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role text;
BEGIN
  -- By default, extract requested role from raw_user_meta_data if present, else default VENDOR
  assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'VENDOR');
  
  INSERT INTO public.profiles (
    id, 
    username, 
    email, 
    role, 
    is_active,
    gst_number,
    ifsc_code,
    bank_account,
    bank_name,
    pan_number,
    aadhar_number
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'company_name', new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    assigned_role,
    false, -- always default to restricted
    new.raw_user_meta_data->>'gst_number',
    new.raw_user_meta_data->>'ifsc_code',
    new.raw_user_meta_data->>'bank_account',
    new.raw_user_meta_data->>'bank_name',
    new.raw_user_meta_data->>'pan_number',
    new.raw_user_meta_data->>'aadhar_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    gst_number = EXCLUDED.gst_number,
    ifsc_code = EXCLUDED.ifsc_code,
    bank_account = EXCLUDED.bank_account,
    bank_name = EXCLUDED.bank_name,
    pan_number = EXCLUDED.pan_number,
    aadhar_number = EXCLUDED.aadhar_number;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
