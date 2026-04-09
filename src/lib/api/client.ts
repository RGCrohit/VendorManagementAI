import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const api = {
  // Vendors
  getVendors: () => apiClient.get('/api/vendors'),
  getVendor: (id: string) => apiClient.get(`/api/vendors/${id}`),
  createVendor: (data: any) => apiClient.post('/api/vendors', data),
  updateVendor: (id: string, data: any) => apiClient.put(`/api/vendors/${id}`, data),
  
  // Projects
  getProjects: () => apiClient.get('/api/projects'),
  getProject: (id: string) => apiClient.get(`/api/projects/${id}`),
  createProject: (data: any) => apiClient.post('/api/projects', data),
  updateProject: (id: string, data: any) => apiClient.put(`/api/projects/${id}`, data),
  
  // Invoices
  getInvoices: () => apiClient.get('/api/invoices'),
  getInvoice: (id: string) => apiClient.get(`/api/invoices/${id}`),
  uploadInvoice: (data: FormData) => apiClient.post('/api/invoices/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  approveInvoice: (id: string) => apiClient.post(`/api/invoices/${id}/approve`),
  
  // Cases
  getCases: () => apiClient.get('/api/cases'),
  getCase: (id: string) => apiClient.get(`/api/cases/${id}`),
  createCase: (data: any) => apiClient.post('/api/cases', data),
  updateCase: (id: string, data: any) => apiClient.put(`/api/cases/${id}`, data),
  
  // Quotations
  getQuotations: () => apiClient.get('/api/quotations'),
  getQuotation: (id: string) => apiClient.get(`/api/quotations/${id}`),
  submitQuotation: (data: any) => apiClient.post('/api/quotations', data),
  
  // AI Agent
  chatWithAgent: (message: string) => apiClient.post('/api/ai/chat', { message }),
  startVoiceSession: () => apiClient.post('/api/ai/voice/start'),
  
  // Finance
  getFinanceData: () => apiClient.get('/api/finance'),
  getBudgetStatus: (projectId: string) => apiClient.get(`/api/finance/budget/${projectId}`),
  exportCSV: (filters: any) => apiClient.post('/api/finance/export', filters),
  
  // Payments
  initiatePayment: (invoiceId: string, amount: number) => 
    apiClient.post(`/api/payments/razorpay/create`, { invoice_id: invoiceId, amount }),
};
