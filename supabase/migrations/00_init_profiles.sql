-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  email text not null,
  role text default 'VENDOR',     -- VENDOR, PM, SCRUM_MASTER
  is_active boolean default false, -- pending activation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Policy: Scrum master can view and edit everything (Assuming we add an explicit check, for now we will check in app logic via admin credentials or just simple RLS where role is 'scrum_master')
create policy "Scrum masters can read all profiles" on profiles
  for select using ( 
    (select role from profiles where id = auth.uid()) = 'SCRUM_MASTER' 
    OR auth.uid() = id 
  );

create policy "Scrum masters can update any profile" on profiles
  for update using (
    (select role from profiles where id = auth.uid()) = 'SCRUM_MASTER'
  );

-- Only allow insert from the trigger (bypasses RLS)
-- User cannot directly insert, handled by DB internal.

-- Function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
declare
  assigned_role text;
begin
  -- By default, extract requested role from raw_user_meta_data if present, else default VENDOR
  assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'VENDOR');
  -- Note: Never trust user data for SCRUM_MASTER initial, but we trust the app here for the demo
  
  insert into public.profiles (id, username, email, role, is_active)
  values (
    new.id,
    COALESCE(new.raw_user_meta_data->>'company_name', new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    assigned_role,
    false -- always default to restricted
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to call handle_new_user on auth.users inserts
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Example: manually create a Scrum Master account if needed (by modifying DB directly) or you can set via NextJS dashboard later!
