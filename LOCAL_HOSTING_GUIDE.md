# 🚀 CureVendAI - Complete Local Setup & Hosting Guide

## ⚡ Quick Summary
Your system has **Python 3.9.6** ✓ but needs **Node.js** to run the frontend.

---

## 📋 Installation Steps

### STEP 1: Install Node.js (macOS)

#### Option A: Download Installer (Recommended)
1. Go to **https://nodejs.org/**
2. Download **LTS version** (v18 or v20)
3. Run the `.pkg` installer
4. Follow the installation wizard
5. You may need to enter your Mac password

#### Option B: Use Package Manager (if available)
```bash
# If you have Homebrew installed:
brew install node

# If you have MacPorts:
sudo port install nodejs20
```

#### Option C: Use NVM (Node Version Manager)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.zshrc

# Install Node.js 18 LTS
nvm install 18
nvm use 18
```

### STEP 2: Verify Installation

After installing Node.js, open a new terminal and run:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## 🔐 Setup Supabase

### Get Supabase Credentials

1. **Create Supabase Account** (if you don't have one)
   - Go to https://supabase.io
   - Sign up with email or GitHub
   - Create organization

2. **Create New Project**
   - Click "New Project"
   - Name: `curevendai`
   - Region: **ap-south-1 (Asia, Mumbai)** (for DPDP Act compliance)
   - Password: Create a secure password
   - Click "Create new project"
   - Wait for database provisioning (2-3 minutes)

3. **Get API Credentials**
   - Go to Project Settings → API
   - Copy **Project URL** (looks like: `https://xyzabc.supabase.co`)
   - Copy **Anon Key** (starts with `eyJ...`)

4. **Update .env.local**
   ```bash
   # Open .env.local in editor
   nano .env.local
   
   # Or use VS Code
   code .env.local
   ```
   
   Replace with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Test Supabase Connection

```bash
# After updating .env.local
curl -s -X GET \
  -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT_ID.supabase.co/rest/v1/" | head -20

# Should return JSON without errors
```

---

## 💻 Run Frontend (Next.js) Locally

### Step 1: Install Dependencies

```bash
cd /Users/rohit.chowdhury/Documents/TestRun_CureVendAI/Test/curevendai

npm install
# This will download all frontend dependencies (60+ packages)
# Takes 3-5 minutes on first run
```

### Step 2: Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 15.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 5.2s
```

### Step 3: Open in Browser

```
http://localhost:3000
```

You'll see:
- ✅ Landing page with glassmorphism design
- ✅ PM Login button
- ✅ Vendor Portal button
- ✅ Features grid
- ✅ Pricing section

---

## 🐍 Run Backend (FastAPI) Locally

Open a **new terminal tab** and run:

### Step 1: Setup Python Environment

```bash
cd /Users/rohit.chowdhury/Documents/TestRun_CureVendAI/Test/curevendai/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
# On Windows: venv\Scripts\activate

# Verify activation (should show (venv) prefix)
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
# Takes 2-3 minutes on first run
```

### Step 3: Start FastAPI Server

```bash
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Step 4: View API Documentation

Open in browser:
```
http://localhost:8000/docs
```

You'll see:
- ✅ Swagger UI with all 40+ API endpoints
- ✅ Auth endpoints
- ✅ Vendor/Project endpoints
- ✅ Invoice/Payment endpoints
- ✅ AI Agent endpoints

---

## 🗄️ Setup Database (PostgreSQL)

Open a **new terminal tab** and run:

### Step 1: Start with Docker Compose

```bash
cd /Users/rohit.chowdhury/Documents/TestRun_CureVendAI/Test/curevendai

docker-compose up
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### Step 2: Verify Services

```bash
# Test PostgreSQL
psql -U curevendai -h localhost -d curevendai
# Password: curevendai-dev

# Test Redis
redis-cli ping
# Should return: PONG
```

---

## ✅ Complete Checklist - All Running Locally

When everything is running, you should have **3 terminal tabs**:

```
Terminal 1: Frontend (Next.js)   → http://localhost:3000
Terminal 2: Backend (FastAPI)   → http://localhost:8000/docs
Terminal 3: Database (Docker)   → PostgreSQL + Redis
```

### Quick Verification

1. **Frontend**: http://localhost:3000 → See landing page
2. **Backend API**: http://localhost:8000/docs → See Swagger UI
3. **Database**: `psql -U curevendai -h localhost -d curevendai` → Connected

---

## 🧪 Test the Application

### Test 1: Landing Page
```
✓ Visit http://localhost:3000
✓ Click "PM Login" button
✓ Click "Vendor Portal" button
✓ Features grid loads
```

### Test 2: PM Dashboard
```
✓ Click "PM Login"
✓ Form displays
✓ See KPI cards (once backend is live)
```

### Test 3: API Endpoints
```bash
# Test health check
curl http://localhost:8000/health

# Test API documentation
curl http://localhost:8000/docs
```

### Test 4: Supabase Connection
```bash
# Check authentication flow
# See if signup/login can hit Supabase

curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🛠️ Troubleshooting

### Issue: `node: command not found`
**Solution**: Node.js not installed yet. Follow STEP 1 above.

### Issue: Port 3000 already in use
```bash
# Find process on port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Then try: npm run dev
```

### Issue: Port 8000 already in use
```bash
# Find process on port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Then restart: uvicorn main:app --reload
```

### Issue: `Cannot find module 'next'`
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Supabase connection failed
1. Check `.env.local` has correct credentials
2. Verify URL format: `https://xxxxx.supabase.co`
3. Test manually:
   ```bash
   curl -s -H "apikey: YOUR_KEY" "YOUR_URL/rest/v1/"
   ```

### Issue: Database connection error
```bash
# Check Docker is running
docker ps

# Check PostgreSQL logs
docker logs curevendai-postgres

# Restart services
docker-compose down
docker-compose up
```

---

## 📊 Common Development Tasks

### Frontend Development
```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build
npm run start
```

### Backend Development
```bash
# Start dev server (auto-reload)
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Run tests
pytest

# View docs
# http://localhost:8000/docs
```

### Database Management
```bash
# Connect to PostgreSQL
psql -U curevendai -h localhost -d curevendai

# View Redis
redis-cli

# Stop services
docker-compose down

# Restart services
docker-compose up -d
```

---

## 🎨 Frontend URLs by Section

| Section | URL |
|---------|-----|
| Landing | http://localhost:3000 |
| PM Login | http://localhost:3000/pm/login |
| PM Dashboard | http://localhost:3000/pm/dashboard |
| Vendor Login | http://localhost:3000/vendor/login |
| Vendor Register | http://localhost:3000/vendor/register |
| Vendor Portal | http://localhost:3000/vendor/portal |

---

## 🔗 Backend API Endpoints

| Category | Endpoint |
|----------|----------|
| **Health** | GET `/health` |
| **API Docs** | GET `/docs` |
| **Auth** | POST `/api/auth/login`, `/api/auth/register` |
| **Vendors** | GET/POST `/api/vendors` |
| **Projects** | GET/POST `/api/projects` |
| **Invoices** | GET `/api/invoices`, POST `/api/invoices/upload` |
| **AI Chat** | POST `/api/ai/chat` |
| **Finance** | GET `/api/finance` |
| **Payments** | POST `/api/payments/razorpay/create` |

---

## 📚 Next Steps

1. ✅ Install Node.js
2. ✅ Configure Supabase credentials in `.env.local`
3. ✅ Run `npm install` on frontend
4. ✅ Run `npm run dev` to start frontend
5. ✅ Run `uvicorn main:app --reload` to start backend
6. ✅ Open http://localhost:3000 in browser
7. 🎉 Application running locally!

---

## 📞 Support

- **Frontend Issues**: Check browser console (DevTools) for errors
- **Backend Issues**: Check terminal output with `--reload` flag active
- **Database Issues**: Check Docker logs with `docker logs curevendai-postgres`
- **Supabase Issues**: Check https://supabase.io/docs

---

## ✨ You're Ready!

Once Node.js is installed, you can run the entire CureVendAI platform locally:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend  
cd backend && uvicorn main:app --reload

# Terminal 3: Database
docker-compose up
```

**Then open**: http://localhost:3000 🚀

Happy coding! ✨
