-- ============================================================
-- CureVendAI Clean Database Setup
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query
-- ============================================================

-- 1. DROP OLD TABLES (keeps profiles)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.financial_ledger CASCADE;
DROP TABLE IF EXISTS public.vendor_registry CASCADE;
DROP TABLE IF EXISTS public.project_nodes CASCADE;
DROP TABLE IF EXISTS public.qc_tickets CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.emails CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;

-- 2. VENDORS (clean, simple)
CREATE TABLE public.vendors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    industry text,
    status text DEFAULT 'pending',  -- active, pending, suspended
    rating int DEFAULT 50,          -- 0-100 performance rating
    gst_number text,
    contact_email text,
    contact_phone text,
    address text,
    joined_at timestamp with time zone DEFAULT now(),
    notes text
);

-- 3. PROJECTS (clean, simple)
CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    status text DEFAULT 'active',    -- active, completed, on-hold, planning
    budget numeric DEFAULT 0,
    spent numeric DEFAULT 0,
    timeline text,                   -- e.g. "Apr 2025 - Mar 2026"
    vendor_count int DEFAULT 0,
    manager_id uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now()
);

-- 4. PAYMENTS (clean, simple)
CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    status text DEFAULT 'pending',    -- paid, pending, overdue
    description text,
    invoice_date timestamp with time zone DEFAULT now(),
    paid_date timestamp with time zone
);

-- 5. MEETINGS (for Google Calendar integration)
CREATE TABLE public.meetings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    meeting_date date NOT NULL,
    meeting_time text,               -- e.g. "10:00 AM"
    duration_minutes int DEFAULT 60,
    meeting_link text,               -- Google Meet link
    attendees text[],                -- Array of email addresses
    organizer_id uuid REFERENCES auth.users(id),
    status text DEFAULT 'scheduled', -- scheduled, completed, cancelled
    created_at timestamp with time zone DEFAULT now()
);

-- 6. TICKETS (simple issue tracking)
CREATE TABLE public.tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'medium',  -- low, medium, high, critical
    status text DEFAULT 'open',      -- open, in-progress, resolved, closed
    created_at timestamp with time zone DEFAULT now()
);

-- 7. Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 8. Open RLS policies (for demo — tighten in production)
CREATE POLICY "Allow all on vendors" ON public.vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- DEMO DATA
-- ============================================================

-- Vendors
INSERT INTO public.vendors (name, industry, status, rating, gst_number, contact_email) VALUES
('Acme Global Solutions', 'IT Services',   'active',    92, '27AAPCT1234H1Z5', 'info@acmeglobal.com'),
('Nova Industries',       'Manufacturing', 'active',    88, '29BBBPT5678K2Z8', 'contact@novaindustries.in'),
('Zenith Textiles',       'Garments',      'active',    65, '07CCCPT9012L3Z1', 'sales@zenithtextiles.com'),
('Delta Logistics',       'Logistics',     'suspended', 42, '24GGGPT5678Q7Z7', 'ops@deltalogistics.co'),
('Apex Research Labs',    'Research',      'pending',   50, '19FFFPT1234P6Z4', 'hello@apexlabs.io'),
('Sigma Systems',         'IT Services',   'active',    95, '33EEEPT7890N5Z2', 'team@sigmasystems.com');

-- Projects
INSERT INTO public.projects (id, name, status, budget, spent, timeline, vendor_count) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Project Phoenix',  'active',   5000000, 3400000, 'Apr 2025 - Mar 2026', 12),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Enterprise Suite',  'active',  8000000, 7200000, 'Jun 2025 - May 2026', 8),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Supply Chain AI',   'planning', 3500000, 120000, 'Nov 2025 - Oct 2026', 0);

-- Payments (6 months of realistic data)
DO $$
DECLARE
    v_id uuid;
    p_id uuid;
    i int;
    back_date timestamp;
BEGIN
    FOR i IN 1..120 LOOP
        SELECT id INTO v_id FROM public.vendors ORDER BY random() LIMIT 1;
        SELECT id INTO p_id FROM public.projects ORDER BY random() LIMIT 1;
        back_date := now() - (random() * interval '180 days');
        
        INSERT INTO public.payments (project_id, vendor_id, amount, status, description, invoice_date)
        VALUES (
            p_id, v_id,
            floor(random() * 80000 + 15000),
            CASE WHEN back_date < now() - interval '30 days' THEN 'paid' ELSE 'pending' END,
            'Invoice #' || floor(random() * 9000 + 1000)::text,
            back_date
        );
    END LOOP;
END $$;

-- Meetings (upcoming schedule)
INSERT INTO public.meetings (title, description, meeting_date, meeting_time, duration_minutes, meeting_link, status) VALUES
('Vendor Review - Q1',        'Quarterly review with all active vendors',    CURRENT_DATE + interval '3 days',  '10:00 AM', 60, 'https://meet.google.com/abc-defg-hij', 'scheduled'),
('Phoenix Sprint Planning',   'Sprint 8 planning for Project Phoenix',      CURRENT_DATE + interval '5 days',  '2:00 PM',  90, 'https://meet.google.com/klm-nopq-rst', 'scheduled'),
('Budget Planning FY 26-27',  'Annual budget discussion for next fiscal year', CURRENT_DATE + interval '7 days', '11:00 AM', 120, 'https://meet.google.com/uvw-xyz-abc', 'scheduled'),
('Vendor Onboarding - Apex',  'Onboarding session for Apex Research Labs',  CURRENT_DATE + interval '10 days', '3:30 PM',  45, 'https://meet.google.com/def-ghi-jkl', 'scheduled'),
('Weekly Standup',            'Team standup and blockers review',            CURRENT_DATE + interval '1 days',  '9:30 AM',  30, 'https://meet.google.com/mno-pqr-stu', 'scheduled');

-- Tickets
INSERT INTO public.tickets (project_id, title, description, priority, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GST document mismatch',     'Vendor GST number doesn''t match uploaded documents', 'high',     'open'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Payment delay - Nova Ind.', 'Invoice #4521 is overdue by 15 days',                  'medium',   'in-progress'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Pending vendor approval',   'Apex Labs KYC verification is incomplete',              'critical', 'open');

-- ============================================================
-- DONE! Clean database ready with demo data.
-- Tables: vendors, projects, payments, meetings, tickets
-- ============================================================
