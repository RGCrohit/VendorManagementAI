// User Roles
export type UserRole = 'SCRUM' | 'HEAD_PM' | 'PM' | 'JR_PM' | 'FINANCE' | 'JR_FINANCE' | 'VENDOR';

// User
export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  company?: string;
  created_at: string;
}

// Vendor
export interface Vendor {
  id: string;
  name: string;
  email: string;
  gst_number: string;
  ifsc_code: string;
  status: 'pending' | 'verified' | 'active' | 'suspended';
  risk_score: number;
  created_at: string;
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  status: 'planning' | 'active' | 'qc' | 'shipment' | 'completed' | 'archived';
  start_date: string;
  end_date: string;
  created_at: string;
}

// Case/Ticket
export interface Case {
  id: string;
  title: string;
  description: string;
  type: 'billing_dispute' | 'sla_breach' | 'delivery_failure' | 'onboarding_blocker';
  vendor_id: string;
  project_id: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'qc' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string;
  created_at: string;
}

// Invoice
export interface Invoice {
  id: string;
  vendor_id: string;
  amount: number;
  gst_amount: number;
  status: 'pending' | 'pm_approved' | 'finance_approved' | 'paid';
  due_date: string;
  created_at: string;
}

// Quotation
export interface Quotation {
  id: string;
  vendor_id: string;
  project_id: string;
  total_amount: number;
  line_items: Array<{ item: string; quantity: number; price: number }>;
  delivery_timeline: string;
  sla_terms: string;
  status: 'pending' | 'submitted' | 'selected';
  created_at: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
