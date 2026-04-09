#!/bin/bash

# ProcurAI Local Hosting - System Diagnostic
# Shows what's installed and what's missing

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   ProcurAI - Local Hosting System Diagnostic               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "📦 Frontend Dependencies:"
echo "─────────────────────────"
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
else
    echo "❌ Node.js: NOT INSTALLED"
    echo "   → Download from https://nodejs.org/"
    echo "   → Or use: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
fi

# Check Python
echo ""
echo "🐍 Backend Dependencies:"
echo "────────────────────────"
if command -v python3 &> /dev/null; then
    echo "✅ Python: $(python3 --version)"
else
    echo "❌ Python: NOT INSTALLED"
fi

# Check Git
echo ""
echo "🔧 Development Tools:"
echo "────────────────────"
if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git: NOT INSTALLED"
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker: NOT INSTALLED (Optional, but recommended for database)"
fi

# Check Supabase Configuration
echo ""
echo "🔐 Supabase Configuration:"
echo "──────────────────────────"
SUPBASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local 2>/dev/null | cut -d'=' -f2)
SUPABASE_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local 2>/dev/null | cut -d'=' -f2)

if [ -z "$SUPBASE_URL" ] || [ "$SUPBASE_URL" == "https://your-project-id.supabase.co" ]; then
    echo "❌ Supabase: NOT CONFIGURED"
    echo "   → Go to https://supabase.io"
    echo "   → Create project in ap-south-1 region"
    echo "   → Copy credentials to .env.local"
else
    echo "✅ Supabase: CONFIGURED"
    echo "   URL: ${SUPBASE_URL:0:40}..."
fi

# Check if node_modules exists
echo ""
echo "📂 Project Status:"
echo "──────────────────"
if [ -d "node_modules" ]; then
    echo "✅ node_modules: INSTALLED"
else
    echo "❌ node_modules: NOT INSTALLED"
    echo "   → Run: npm install"
fi

if [ -d "backend/venv" ]; then
    echo "✅ Python venv: CREATED"
else
    echo "❌ Python venv: NOT CREATED"
    echo "   → Run: cd backend && python3 -m venv venv"
fi

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   NEXT STEPS                                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Install Node.js (if not installed)"
echo "    → https://nodejs.org/ (v18 LTS recommended)"
echo ""
echo "2️⃣  Configure Supabase (if not configured)"
echo "    → https://supabase.io"
echo "    → Update .env.local with credentials"
echo ""
echo "3️⃣  Install Frontend Dependencies"
echo "    → npm install"
echo ""
echo "4️⃣  Install Backend Dependencies"
echo "    → cd backend && python3 -m venv venv"
echo "    → source venv/bin/activate"
echo "    → pip install -r requirements.txt"
echo ""
echo "5️⃣  Start the Application"
echo "    Terminal 1: npm run dev"
echo "    Terminal 2: cd backend && uvicorn main:app --reload"
echo "    Terminal 3: docker-compose up"
echo ""
echo "6️⃣  Open Browser"
echo "    → http://localhost:3000"
echo ""
echo "For detailed guide, see: LOCAL_HOSTING_GUIDE.md"
echo ""
