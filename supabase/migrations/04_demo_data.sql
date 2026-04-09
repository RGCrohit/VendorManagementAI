-- ============================================================
-- CureVendAI Master Schema & 6-Month Data Sync
-- ============================================================

-- 1. DROP EXISTING (Except Profiles)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.financial_ledger CASCADE;
DROP TABLE IF EXISTS public.vendor_registry CASCADE;
DROP TABLE IF EXISTS public.project_nodes CASCADE;
DROP TABLE IF EXISTS public.qc_tickets CASCADE;

-- 2. CREATE CORE TABLES
CREATE TABLE public.vendor_registry (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    sector text,
    status text DEFAULT 'pending', -- verified, pending, flagged, suspended
    risk_score int DEFAULT 50,
    gst_index text,
    pan_document_url text,
    registrant_photo_url text,
    joined_at timestamp with time zone DEFAULT now() - interval '6 months',
    compliance_expiry date DEFAULT (now() + interval '6 months')::date
);

CREATE TABLE public.project_nodes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    status text DEFAULT 'active',
    budget_allocated numeric,
    budget_realized numeric DEFAULT 0,
    node_manager_id uuid REFERENCES auth.users(id), -- Points to PM (Rohit etc)
    fy_cycle text DEFAULT '2025-26',
    created_at timestamp with time zone DEFAULT now() - interval '6 months'
);

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.project_nodes(id) ON DELETE CASCADE,
    vendor_id uuid REFERENCES public.vendor_registry(id) ON DELETE CASCADE,
    auditor_id uuid REFERENCES auth.users(id),
    audit_date timestamp with time zone DEFAULT now(),
    fidelity_score int, -- 0-100
    status text, -- approved, rejected, flagged
    findings text,
    ocr_master_doc text -- Mock URL to PDF
);

CREATE TABLE public.financial_ledger (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.project_nodes(id) ON DELETE CASCADE,
    vendor_id uuid REFERENCES public.vendor_registry(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    disbursement_status text DEFAULT 'pending', -- paid, pending, due
    razorpay_transaction_id text,
    invoice_date timestamp with time zone DEFAULT now()
);

CREATE TABLE public.qc_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.project_nodes(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'medium',
    status text DEFAULT 'open',
    created_at timestamp with time zone DEFAULT now()
);

-- 3. SEEDING 6 MONTHS OF DATA

-- Insert Vendors
INSERT INTO public.vendor_registry (name, sector, status, risk_score, gst_index) VALUES
('Acme Global Solutions', 'IT Services', 'verified', 92, '27AAPCT1234H1Z5'),
('Nova Industrial Mfg', 'Manufacturing', 'verified', 88, '29BBBPT5678K2Z8'),
('Zenith Textiles', 'Apparels', 'verified', 65, '07CCCPT9012L3Z1'),
('Delta Logistics Hub', 'Supply Chain', 'flagged', 42, '24GGGPT5678Q7Z7'),
('Apex Fab Lab', 'Research', 'pending', 50, '19FFFPT1234P6Z4'),
('Sigma Systems V2', 'IT Services', 'verified', 95, '33EEEPT7890N5Z2');

-- Insert Project Nodes
INSERT INTO public.project_nodes (id, name, budget_allocated, budget_realized) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Project Phoenix', 5000000, 3400000),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Enterprise Suite', 8000000, 7200000),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Supply Chain AI', 3500000, 1200000);

-- Backdated Audit & Finance Seeding (180 days)
DO $$
DECLARE
    v_id uuid;
    p_id uuid;
    i int;
    back_date timestamp;
BEGIN
    FOR i IN 1..150 LOOP
        -- Get random vendor and project
        SELECT id INTO v_id FROM public.vendor_registry ORDER BY random() LIMIT 1;
        SELECT id INTO p_id FROM public.project_nodes ORDER BY random() LIMIT 1;
        
        -- Generate random date in last 180 days
        back_date := now() - (random() * interval '180 days');
        
        -- Insert into audit_logs
        INSERT INTO public.audit_logs (project_id, vendor_id, audit_date, fidelity_score, status, findings)
        VALUES (p_id, v_id, back_date, floor(random() * 40 + 60), 
                CASE WHEN random() > 0.85 THEN 'flagged' ELSE 'approved' END,
                'Bi-weekly compliance verification sync.');
                
        -- Insert into financial_ledger
        INSERT INTO public.financial_ledger (project_id, vendor_id, amount, disbursement_status, invoice_date, razorpay_transaction_id)
        VALUES (p_id, v_id, floor(random() * 50000 + 10000),
                CASE WHEN back_date < now() - interval '30 days' THEN 'paid' ELSE 'pending' END,
                back_date, 'pay_' || encode(gen_random_bytes(10), 'hex'));
    END LOOP;
END $$;

-- QC Tickets
INSERT INTO public.qc_tickets (project_id, title, priority, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GST Doc Mismatch', 'high', 'open'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'QC Flow - Document Leak', 'medium', 'qc_check'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Pending HSM Audit', 'critical', 'open');
