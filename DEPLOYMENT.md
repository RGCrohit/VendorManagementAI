# 🚀 Deployment Checklist & Guide

## Pre-Deployment Requirements

### ✅ Development Machine Setup
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.11+ installed (`python3 --version`)
- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] GitHub repository created
- [ ] All code committed and pushed

### ✅ Third-Party Services Created
- [ ] **Supabase** account (https://supabase.io)
  - [ ] Project created in ap-south-1 (Mumbai) region
  - [ ] API URL copied to notes
  - [ ] Anon key copied to notes
  - [ ] Service role key copied securely
  - [ ] Database configured with tables

- [ ] **Vercel** account (https://vercel.com)
  - [ ] GitHub connected
  - [ ] Team/Organization created
  - [ ] Domain purchased or custom domain configured

- [ ] **Railway** account (https://railway.app)
  - [ ] GitHub connected
  - [ ] Team created
  - [ ] PostgreSQL service provisioned
  - [ ] Redis service provisioned

- [ ] **Razorpay** account (https://razorpay.com)
  - [ ] Live mode keys generated
  - [ ] Test mode keys saved separately
  - [ ] Webhook endpoints configured

- [ ] **Deepgram** account (https://deepgram.com)
  - [ ] API key generated
  - [ ] STT model selected (Nova-2)

- [ ] **ElevenLabs** account (https://elevenlabs.io)
  - [ ] API key generated
  - [ ] Voice selected for TTS

- [ ] **Slack** workspace
  - [ ] Bot created with proper scopes
  - [ ] OAuth tokens generated
  - [ ] Channel for notifications selected

- [ ] **Gmail** Setup (for email MCP)
  - [ ] App-specific password generated
  - [ ] 2FA enabled

### ✅ Environment Variables Prepared
- [ ] All `.env.example` values documented
- [ ] Sensitive keys stored securely (e.g., 1Password, LastPass)
- [ ] No hardcoded secrets anywhere
- [ ] Database connection string validated

---

## Deployment Steps (In Order)

### Phase 1: Database Setup (15 minutes)

#### Step 1a: Supabase Database
```bash
1. Go to https://supabase.io → Sign In
2. Click "New Project"
3. Select ap-south-1 (Mumbai) region
4. Wait for database to provision (usually 2-3 minutes)
5. Copy "Project URL" and "Anon Key"
6. Run migrations:
   - Navigate to SQL Editor
   - Create tables from schema (see DATABASE_SCHEMA.sql)
   - Or use Supabase auto-migration with SQLAlchemy
```

#### Step 1b: Verify Database Connection
```bash
# Test from backend
python
>>> import psycopg2
>>> conn = psycopg2.connect("POSTGRESQL_URL")
>>> print("Connection successful!")
>>> conn.close()
```

---

### Phase 2: Backend Deployment (30 minutes)

#### Step 2a: Railway Backend Setup
```bash
# 1. Go to https://railway.app → Sign In with GitHub
# 2. Create new project → GitHub template → select procurai repo
# 3. Configure environment variables:
#    - Copy all from backend/.env
#    - Add DATABASE_URL (from Supabase)
#    - Add REDIS_URL (Railway Redis service)
#    - Add SECRET_KEY, API_KEY, etc.

# 4. Deploy
#    - Railway auto-deploys on GitHub push
#    - Watch deployment logs
#    - Ensure no build errors
```

#### Step 2b: Test Backend API
```bash
# After deployment:
1. Copy Railway URL (e.g., https://procurai-api.railway.app)
2. Test health check:
   curl https://procurai-api.railway.app/health
3. View API docs:
   https://procurai-api.railway.app/docs
4. Test login endpoint:
   POST /api/auth/login with test credentials
```

#### Step 2c: Configure Backend Environment
```bash
# Set in Railway dashboard:
ENVIRONMENT=production
DEBUG=False
ALLOWED_HOSTS=procurai-api.railway.app
CORS_ORIGINS=https://procurai.vercel.app
DATABASE_URL=postgresql://...  # Supabase
REDIS_URL=redis://...           # Railway Redis
```

---

### Phase 3: Frontend Deployment (20 minutes)

#### Step 3a: Configure Frontend Environment
```bash
# Create .env.production.local with:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://procurai-api.railway.app
# NO SECRETS - only NEXT_PUBLIC_ variables!
```

#### Step 3b: Vercel Frontend Setup
```bash
# 1. Go to https://vercel.com → Sign In with GitHub
# 2. Click "Add New..." → "Project"
# 3. Select procurai repository
# 4. Configure:
#    - Framework: Next.js
#    - Root Directory: . (current)
#    - Build Command: npm run build
#    - Output Directory: .next
# 5. Add environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - NEXT_PUBLIC_API_URL
# 6. Click Deploy
```

#### Step 3c: Test Frontend
```bash
# After deployment:
1. Visit https://procurai.vercel.app
2. Check landing page loads correctly
3. Click PM Login → should show form
4. Click Vendor Portal → should show register form
5. Open DevTools Console → check for errors
```

---

### Phase 4: Domain Configuration (10 minutes)

#### Step 4a: Add Custom Domain (Vercel)
```bash
# 1. In Vercel Dashboard → Project Settings → Domains
# 2. Add custom domain (e.g., procurai.com)
# 3. Update DNS records with Vercel values:
#    - Type: CNAME
#    - Value: cname.vercel-dns.com
# 4. Wait 15-30 minutes for DNS propagation
# 5. Verify: curl https://procurai.com → should work
```

#### Step 4b: Configure API Domain
```bash
# If using separate API domain (e.g., api.procurai.com):
# 1. In Railway → Domain → Add Custom Domain
# 2. Point to Railway's proxy
# 3. Update frontend NEXT_PUBLIC_API_URL
# 4. Redeploy frontend
```

---

### Phase 5: SSL/TLS Certificates (Automatic)

✅ **Already handled by:**
- Vercel → Automatic Let's Encrypt
- Railway → Automatic SSL
- Supabase → Automatic SSL

No additional action needed!

---

### Phase 6: Database Migrations & Seeding (10 minutes)

#### Step 6a: Run Migrations
```bash
# Option 1: Automatic (SQLAlchemy)
# Database models auto-create tables on first run

# Option 2: Manual (Alembic)
cd backend
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

#### Step 6b: Seed Development Data (Optional)
```bash
# Create backend/seed.py:
python backend/seed.py

# This creates test vendors, projects, users
```

---

### Phase 7: Monitoring & Logging (15 minutes)

#### Step 7a: Setup Error Tracking
```bash
# Option 1: Sentry (Recommended for free tier)
# 1. Go to https://sentry.io → Sign Up
# 2. Create project → Select Python for backend
# 3. Get DSN key
# 4. Add to backend SENTRY_DSN
# 5. Update main.py:
from sentry_sdk import init
init(dsn=os.getenv("SENTRY_DSN"))
```

#### Step 7b: Setup Monitoring
```bash
# Option: Use Railway's built-in monitoring
# 1. View logs in Railway dashboard
# 2. Setup alerts for errors
# 3. Monitor CPU/Memory usage
```

#### Step 7c: Enable Frontend Analytics
```bash
# Option: Vercel Analytics (free tier)
# 1. In Vercel Dashboard → Project Settings → Analytics
# 2. Enable Web Analytics
# 3. Check https://vercel.com/analytics
```

---

### Phase 8: Security Audit (20 minutes)

#### Step 8a: Security Headers
- [x] CORS configured
- [x] HTTPS enforced
- [x] X-Frame-Options: SAMEORIGIN
- [x] X-Content-Type-Options: nosniff
- [x] CSP headers configured

#### Step 8b: API Security
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection verified
- [ ] CSRF tokens implemented
- [ ] OTP verification working

#### Step 8c: Data Security
- [ ] Row-Level Security (RLS) enabled on Supabase
- [ ] Sensitive data encrypted at rest
- [ ] Database backups configured
- [ ] Audit logging enabled

#### Step 8d: Secret Management
- [ ] No .env files in version control
- [ ] Secrets in environment variables only
- [ ] Service role keys kept private
- [ ] API keys rotated regularly

---

### Phase 9: Performance Optimization (15 minutes)

#### Step 9a: Frontend Performance
```bash
# Run Lighthouse audit:
npm run build
npm run start
# Open http://localhost:3000
# Right-click → Inspect → Lighthouse
# Target: >90 score
```

#### Step 9b: Backend Performance
```bash
# Check response times:
# 1. API dashboard at /metrics (implement Prometheus)
# 2. View response time percentiles
# 3. Optimize slow endpoints
# 4. Enable caching with Redis
```

#### Step 9c: Database Optimization
```bash
# In Supabase SQL Editor:
-- Create indexes on frequently queried columns
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_projects_created ON projects(created_at);
CREATE INDEX idx_invoices_status ON invoices(status);
```

---

### Phase 10: Post-Deployment Testing (30 minutes)

#### Step 10a: Full End-to-End Test
```bash
✅ Test Checklist:

# 1. Landing Page
   - [ ] Hero section loads
   - [ ] Features grid displays
   - [ ] Buttons are clickable
   - [ ] Responsive on mobile

# 2. Authentication
   - [ ] PM Login form validates
   - [ ] Vendor Registration works
   - [ ] Email verification sent
   - [ ] OTP verification works
   - [ ] Session persists

# 3. PM Dashboard
   - [ ] KPI cards load data
   - [ ] Charts render correctly
   - [ ] Activity feed displays
   - [ ] Real-time updates work

# 4. Vendor Portal
   - [ ] Projects load
   - [ ] Invoice list displays
   - [ ] TAT status shows
   - [ ] Buttons are functional

# 5. API Integration
   - [ ] GET endpoints return 200
   - [ ] POST endpoints accept data
   - [ ] Validation works
   - [ ] Error responses correct

# 6. Performance
   - [ ] Page loads < 2 seconds
   - [ ] API responds < 200ms
   - [ ] No 404/500 errors
   - [ ] Mobile responsive
```

#### Step 10b: Load Testing (Optional)
```bash
# Use running simple load test:
# 1. ab -n 100 -c 10 https://procurai.vercel.app
# 2. Check Rails response times
# 3. Verify no 5xx errors
```

---

## Rollback Procedure

### If Deployment Fails:

```bash
# Vercel (automatic rollback)
1. Go to Deployments tab
2. Click on previous working deployment
3. Click "Promote to Production"
4. Done! Previous version restored in ~30 seconds

# Railway (revert)
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Redeploy"
4. Wait for deployment to complete

# Database (backup restore)
1. Go to Supabase → Backups
2. Select backup point
3. Restore to new database
4. Update connection string
```

---

## Production Maintenance

### Weekly Tasks
- [ ] Review error logs in Sentry
- [ ] Check database size in Supabase
- [ ] Verify backups completed
- [ ] Monitor uptime status

### Monthly Tasks
- [ ] Review performance metrics
- [ ] Update dependencies (npm audit, pip audit)
- [ ] Rotate API keys annually
- [ ] Review security logs
- [ ] Database cleanup (old records)

### Quarterly Tasks
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Disaster recovery drill
- [ ] Vendor/customer feedback review

---

## Post-Launch Marketing

```bash
# 1. GitHub
   Push to main branch → Vercel auto-deploys

# 2. Twitter/LinkedIn
   "ProcurAI is live! 🚀 Vendor management made simple"

# 3. Email
   Send launch announcement to beta users

# 4. Documentation
   Update status page: procurai.dev/status
```

---

## Support & Debugging

### Common Issues

#### Issue: Frontend showing 404
**Solution**:
- Check NEXT_PUBLIC_API_URL
- Verify backend is running
- Check CORS configuration
- View browser console for errors

#### Issue: Database connection failed
**Solution**:
- Verify DATABASE_URL format
- Check IP whitelist in Supabase
- Verify credentials
- Test with psql: `psql $DATABASE_URL`

#### Issue: Slow API responses
**Solution**:
- Add database indexes
- Enable Redis caching
- Review CloudSQL instance size
- Check for N+1 queries

#### Issue: Deployment status showing "Failed"
**Solution**:
- Check build logs
- Verify environment variables set
- Ensure all secrets configured
- Try rebuilding (click "Redeploy")

---

## 🎉 Deployment Complete!

Once all steps complete, you have:
- ✅ Production frontend on Vercel
- ✅ Production API on Railway  
- ✅ PostgreSQL database on Supabase
- ✅ Redis cache on Railway
- ✅ SSL/TLS certificates (automatic)
- ✅ Monitoring & error tracking
- ✅ Automatic backups
- ✅ CDN distribution

**Launch:** https://procurai.vercel.app 🚀

---

**Questions? Check the README or contact support!**
