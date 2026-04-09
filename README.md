# ProcurAI - AI-Powered Vendor & Project Management Platform

## Overview

ProcurAI is an enterprise-grade, AI-first Vendor and Project Management SaaS platform built for organisations that manage multiple external vendors, track project delivery, and control procurement budgets.

**Status**: Draft v1.0 | Deployed: Vercel (Frontend) + Railway (Backend) + Supabase (Database)

## Key Features

- 🤖 **AI Voice Agent** - Voice-controlled procurement intelligence with LLM integration
- 🧾 **OCR Invoice System** - Automatic invoice data extraction and processing
- 👥 **Multi-Role Access** - Role-based permissions (7 roles, role-specific dashboards)
- ⏰ **Real-time TAT Tracking** - Live milestone tracking with automated alerts
- 💰 **Budget Control** - Indian FY tracking with overrun alerts
- 💳 **Razorpay Integration** - Seamless payment processing
- 🔐 **Enterprise Security** - RLS, encryption, audit logs, DPDP compliance

## Project Structure

```
procurai/
├── src/                          # Next.js Frontend (TypeScript + Tailwind)
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── pm/                   # Project Manager portal
│   │   │   ├── login/
│   │   │   └── dashboard/
│   │   └── vendor/               # Vendor portal
│   │       ├── login/
│   │       ├── register/
│   │       └── portal/
│   ├── components/               # Reusable React components
│   ├── lib/
│   │   ├── auth/                 # Supabase auth utilities
│   │   ├── api/                  # API client
│   │   └── hooks/                # Custom React hooks
│   └── types/                    # TypeScript type definitions
├── backend/                      # FastAPI Backend (Python 3.11)
│   ├── main.py                   # Application entry point
│   ├── database.py               # SQLAlchemy models & config
│   ├── routes/                   # API endpoints
│   │   ├── auth.py               # Authentication endpoints
│   │   ├── vendors.py            # Vendor management
│   │   ├── projects.py           # Project management
│   │   ├── invoices.py           # Invoice & OCR
│   │   ├── cases.py              # Kanban cases
│   │   ├── quotations.py         # Quotation system
│   │   ├── ai_agent.py           # AI chat & voice
│   │   ├── finance.py            # Finance module
│   │   └── payments.py           # Razorpay integration
│   └── requirements.txt          # Python dependencies
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── next.config.js                # Next.js config
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Glassmorphism theme
- **Animation**: Framer Motion
- **UI Components**: Shadcn/UI
- **State**: Zustand
- **Auth**: Supabase Auth (Email + OTP)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL via Supabase
- **ORM**: SQLAlchemy
- **Task Queue**: Celery + Redis
- **Real-time**: Socket.io + Node.js
- **File Storage**: Cloudflare R2
- **Cache**: Upstash Redis
- **Deployment**: Railway

### AI/ML
- **LLM**: Claude Sonnet 3.5 (LangGraph agents)
- **Speech-to-Text**: Deepgram Nova-2
- **Text-to-Speech**: ElevenLabs
- **Vector DB**: Weaviate
- **OCR**: Mistral OCR
- **MCP Integrations**: Slack, Gmail

### Services
- **Payments**: Razorpay
- **Notifications**: Novu OSS + Email/Slack
- **Auth**: Supabase
- **Monitoring**: (Pending implementation)

## Getting Started

### Prerequisites
- Node.js 18+ & npm/yarn
- Python 3.11+
- PostgreSQL 14+
- Docker (optional, for local Supabase)

### Installation

#### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
# Open http://localhost:3000
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Run development server
cd backend
uvicorn main:app --reload
# API available at http://localhost:8000/docs
```

#### 3. Database Setup

```bash
# Supabase setup (cloud)
1. Create Supabase project at supabase.io
2. Get NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Run migrations automatically via SQLAlchemy models

# OR Local PostgreSQL
psql -U postgres
CREATE DATABASE procurai;
# Connection string: postgresql://user:password@localhost/procurai
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/logout` - Logout

### Vendor Endpoints
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/{id}` - Get vendor details
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/{id}` - Update vendor

### Project Endpoints
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Project details

### Invoice & OCR
- `POST /api/invoices/upload` - Upload invoice PDF
- `GET /api/invoices` - List invoices
- `POST /api/invoices/{id}/approve` - Approve invoice

### AI Agent
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/voice/start` - Start voice session
- `POST /api/ai/voice/process` - Process voice command

### Finance
- `GET /api/finance` - Finance dashboard data
- `GET /api/finance/budget/{project_id}` - Budget status
- `POST /api/finance/export` - Export CSV

### Payments
- `POST /api/payments/razorpay/create` - Initiate payment
- `POST /api/payments/razorpay/verify` - Verify payment

Full API docs available at `http://localhost:8000/docs` (Swagger UI)

## User Roles & Permissions

| Role | Scope | Key Permissions |
|------|-------|-----------------|
| Scrum Master | Platform-wide | Assign roles, manage all modules |
| Head PM | All projects | Budget approval, vendor selection |
| PM | Assigned projects | Vendor management, invoice approval |
| Jr PM | Assigned projects | View dashboards, add comments |
| Finance Manager | All financial | Approve KYC, payments, CSV export |
| Jr Finance | View-only | View invoices & budgets |
| Vendor | Own projects | Submit quotes, raise invoices |

## Environment Variables

Create `.env.local` for frontend and `backend/.env` for backend:

```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost/procurai
ENVIRONMENT=development
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379

# Third-party services
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
DEEPGRAM_API_KEY=your-key
ELEVENLABS_API_KEY=your-key
MISTRAL_OCR_API_KEY=your-key

# MCP Services
SLACK_BOT_TOKEN=your-token
GMAIL_EMAIL=your-email
GMAIL_APP_PASSWORD=your-app-password
LANGCHAIN_API_KEY=your-key
```

## Sprint Roadmap

| Sprint | Weeks | Deliverables | Status |
|--------|-------|--------------|--------|
| 1 | 1-2 | Next.js setup, Landing page, Supabase schema | In Progress |
| 2 | 3-4 | PM Login, Vendor registration, RLS policies | Planned |
| 3 | 5-6 | Admin console, Dashboard KPIs | Planned |
| 4 | 7-8 | Vendor onboarding, KYC approval | Planned |
| 5 | 9-10 | Quotation system, Comparison dashboard | Planned |
| 6 | 11-12 | Project management, Team org-chart | Planned |
| 7 | 13-14 | Kanban board, AI triage agent | Planned |
| 8 | 15-16 | Vendor Portal, Timeline TAT | Planned |
| 9 | 17-18 | OCR pipeline, Invoice submission | Planned |
| 10 | 19-20 | Finance module, Budget tracking | Planned |
| 11 | 21-22 | AI Chat, Voice pipeline, MCP integrations | Planned |
| 12 | 23-24 | QA, Performance tuning, Production deploy | Planned |

**Timeline**: 24 weeks (6 months) for production-ready MVP

## Performance Targets

- API response time: < 200ms (P95)
- Dashboard load: < 2s on 4G
- Uptime: 99.5%
- Invoice processing: < 2 minutes (end-to-end)
- AI query resolution: > 85% without escalation
- TAT breach alert: < 5 minutes

## Security & Compliance

- ✅ HTTPS enforced (TLS 1.3)
- ✅ Row-Level Security (RLS) on all tables
- ✅ Password hashing (bcrypt, cost factor 12)
- ✅ Rate limiting (Upstash Redis)
- ✅ Audit logging on all mutations
- ✅ DPDP Act compliance (ap-south-1 region)
- ✅ GST/IFSC validation
- ✅ Encrypted file storage (R2)

## Monitoring & Logging

- Logs: Structured JSON logging to stdout
- Error Tracking: (Pending Sentry integration)
- Monitoring: (Pending DataDog integration)
- Uptime: Uptime Robot (free tier)
- Performance: Vercel Analytics

## Development

### Code Style
- **Frontend**: ESLint + TypeScript strict
- **Backend**: Black + isort + mypy

### Testing
```bash
# Frontend
npm run type-check
npm run lint

# Backend
pytest backend/
pytest --cov backend/  # Coverage report
```

### Local Development Workflow
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && uvicorn main:app --reload

# Terminal 3: Supabase (optional with Docker)
docker run -d supabase/postgres
```

## Deployment

### Frontend (Vercel)
```bash
# Automatic deployment on git push to main
# Manual: vercel deploy --prod
```

### Backend (Railway)
```bash
# Deploy via Railway dashboard or CLI
# railway up
```

### Database (Supabase)
- Auto-migration via SQLAlchemy models
- Backups: Daily (Supabase managed)

## Support & Contribution

- **Issues**: GitHub Issues
- **Docs**: https://procurai.dev (planned)
- **Status**: https://status.procurai.dev (planned)
- **Contact**: support@procurai.dev

## Roadmap (Post-MVP)

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Vendor performance scorecards
- [ ] Automated compliance checks
- [ ] White-label SaaS platform
- [ ] Enterprise SSO (SAML)
- [ ] Advanced BI integrations
- [ ] Multi-currency support

## License

Proprietary - All rights reserved © 2026 ProcurAI

## Authors

Product developed for vendor & project management automation in April 2026.

---

**Built for scale, starting free** 🚀
