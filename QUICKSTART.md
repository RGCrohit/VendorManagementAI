# CureVendAI - Quick Start Guide

## 🎯 Project Setup Complete! ✅

Your CureVendAI workspace has been scaffolded with a complete full-stack architecture. Here's what's included:

### 📁 Project Structure

```
curevendai/
├── Frontend (Next.js 15 + TypeScript)
│   ├── src/app/              # App Router pages
│   ├── src/components/       # Reusable UI components
│   ├── src/lib/              # Utilities (auth, API, hooks)
│   └── src/types/            # TypeScript types
├── Backend (FastAPI + Python)
│   ├── main.py               # FastAPI app entry
│   ├── database.py           # SQLAlchemy models
│   ├── routes/               # API endpoints
│   └── requirements.txt       # Python dependencies
├── package.json              # Frontend dependencies
└── docker-compose.yml        # Local dev services
```

## 🚀 Quick Start (5 minutes)

### Step 1: Install Node.js & Python
- **Node.js**: Download from https://nodejs.org (v18+)
- **Python**: Download from https://python.org (v3.11+)

### Step 2: Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
# Open http://localhost:3000
```

### Step 3: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp ../.env.example .env

# Start FastAPI server
uvicorn main:app --reload
# API docs at http://localhost:8000/docs
```

### Step 4: Database Setup (Choose one)

**Option A: Cloud (Recommended)**
1. Go to https://supabase.io
2. Create a new project
3. Get your API credentials
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

**Option B: Local PostgreSQL**
```bash
# Start with Docker Compose
docker-compose up -d

# Update .env files:
# DATABASE_URL=postgresql://curevendai:curevendai-dev@localhost/curevendai
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:3000 (Supabase local)
```

## 📱 Pages & Features Ready to Use

### Landing Page
- **URL**: http://localhost:3000
- **Features**: Hero section, features grid, pricing, glassmorphism design

### Authentication
- **PM Login**: http://localhost:3000/pm/login
- **Vendor Login**: http://localhost:3000/vendor/login
- **Vendor Register**: http://localhost:3000/vendor/register

### Dashboard
- **PM Dashboard**: http://localhost:3000/pm/dashboard
  - KPI cards (vendors, projects, invoices, budget)
  - Monthly spend chart
  - Vendor risk map
  - Recent activity feed

- **Vendor Portal**: http://localhost:3000/vendor/portal
  - My Projects section
  - Invoice tracking
  - TAT timeline

### API Endpoints (Backend)
All available at http://localhost:8000/docs (Swagger UI)

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Vendors**: `GET /api/vendors`, `POST /api/vendors/{id}`
- **Projects**: `GET /api/projects`, `POST /api/projects`
- **Invoices**: `GET /api/invoices`, `POST /api/invoices/upload`
- **AI Agent**: `POST /api/ai/chat`, `POST /api/ai/voice/start`
- **Finance**: `GET /api/finance`, `POST /api/finance/export`
- **Payments**: `POST /api/payments/razorpay/create`

## 🎨 Key UI Components

### Already Implemented
- ✅ Glassmorphism theme with Tailwind CSS
- ✅ Framer Motion animations
- ✅ Responsive design (mobile-first)
- ✅ Dark theme with gradient accents
- ✅ Form validation with error handling
- ✅ Floating AI Agent panel
- ✅ Loading states and transitions

### Ready To Use Components
- `<Button />` - Primary, secondary, ghost variants
- `<Card />` - Animated glass card component
- `<Layout />` - App wrapper with AI agent
- `<AIAgent />` - Floating chat panel

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost/curevendai
ENVIRONMENT=development
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379

# Third-party services (optional for now)
RAZORPAY_KEY_ID=your-key
DEEPGRAM_API_KEY=your-key
ELEVENLABS_API_KEY=your-key
MISTRAL_OCR_API_KEY=your-key
```

## 📦 Dependencies Included

### Frontend
- Next.js 15 (Turbopack)
- React 19 + TypeScript
- Tailwind CSS + Shadcn/UI
- Framer Motion (animations)
- Zod (validation)
- React Hook Form
- Axios (HTTP client)
- Zustand (state)
- Socket.io (real-time)
- Recharts (charts)

### Backend
- FastAPI (async framework)
- SQLAlchemy (ORM)
- PostgreSQL driver
- Pydantic (validation)
- Celery (tasks)
- Redis (cache)
- Supabase SDK
- LangChain + LangGraph (AI)
- Deepgram SDK (STT)
- ElevenLabs SDK (TTS)
- Mistral OCR

## 🚀 Deployment

### Frontend (Vercel) - Recommended
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Or: Push to GitHub and enable auto-deploy
```

### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Database (Supabase Cloud)
- Already managed in cloud
- Auto-backups included
- RLS policies enforced

## 🧪 Testing

### Frontend
```bash
npm run type-check  # TypeScript check
npm run lint        # ESLint check
npm run build       # Production build
```

### Backend
```bash
cd backend
pytest              # Run all tests
pytest --cov        # Coverage report
```

## 📚 Next Steps

1. **Configure Supabase**
   - Create project at supabase.io
   - Get API credentials
   - Add to .env.local

2. **Test Authentication Flow**
   - Navigate to /pm/login or /vendor/login
   - Create test account (currently demo only)
   - Check backend console for logs

3. **Connect Backend API**
   - Verify backend running on :8000
   - Check frontend .env points to backend URL
   - Test API calls from dashboard

4. **Implement Missing Features**
   - Database connection & queries in routes
   - OCR pipeline integration
   - Payment gateway setup
   - Voice AI pipeline
   - Real-time Socket.io events

5. **Deploy to Staging**
   - Setup Railway account for backend
   - Setup Vercel account for frontend
   - Configure environment variables
   - Deploy and test

## 📖 Documentation

- **Frontend**: React, Next.js, TypeScript
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL, Supabase
- **Styling**: Tailwind CSS
- **AI**: LangChain, LangGraph

See [README.md](./README.md) for complete documentation.

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Frontend (3000)
lsof -i :3000
kill -9 <PID>

# Backend (8000)
lsof -i :8000
kill -9 <PID>
```

### Module Not Found
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
source venv/bin/activate
pip install -r requirements.txt
```

### Database Connection Error
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check credentials in .env

### CORS Issues
- Verify frontend URL in backend CORS config
- Check API_URL in frontend .env
- Ensure cookies are enabled

## 📞 Support

- **Issues**: Check GitHub Issues
- **Docs**: https://curevendai.dev
- **Email**: support@curevendai.dev

---

**Happy coding! 🎉**

Built with ❤️ for procurement intelligence
