#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# ProcurAI - Complete Setup & Local Hosting Guide
# ═══════════════════════════════════════════════════════════════════════════════

echo "🚀 ProcurAI Local Setup & Hosting Guide"
echo "========================================"
echo ""
echo "Your system status:"
echo "✓ Python 3.9.6 installed"
echo "✗ Node.js not installed yet"
echo "✗ Homebrew not installed yet"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: Install Node.js (Manual Download)
# ═══════════════════════════════════════════════════════════════════════════════

echo "📋 STEP 1: Download & Install Node.js"
echo "────────────────────────────────────"
echo ""
echo "Since sudo access is needed, please follow these steps MANUALLY:"
echo ""
echo "1. Download Node.js v18 LTS from: https://nodejs.org/"
echo "2. Run the installer (macOS)"
echo "3. Follow the installation wizard (may require asking for password)"
echo "4. After installation, verify by running:"
echo "   node --version"
echo "   npm --version"
echo ""
echo "Alternative: Use nvm (Node Version Manager)"
echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
echo ""
read -p "Press ENTER after Node.js is installed, then we'll continue..."

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: Verify Installation
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo "📋 STEP 2: Verifying Node.js Installation"
echo "──────────────────────────────────────────"

if command -v node &> /dev/null; then
    echo "✓ Node.js version: $(node --version)"
    echo "✓ npm version: $(npm --version)"
else
    echo "✗ Node.js still not found. Please install manually from https://nodejs.org/"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: Setup Environment Files
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo "📋 STEP 3: Setting Up Environment Files"
echo "───────────────────────────────────────"

cd /Users/rohit.chowdhury/Documents/TestRun_CureVendAI/Test/procurai

# Create .env.local for frontend
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Configure Supabase Credentials"
    echo "─────────────────────────────────────────────"
    echo ""
    echo "Open .env.local and update with your Supabase credentials:"
    echo ""
    echo "# From https://supabase.io"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here"
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000"
    echo ""
    read -p "Press ENTER after updating .env.local with your Supabase credentials..."
else
    echo "✓ .env.local already exists"
fi

# Create backend .env
if [ ! -f backend/.env ]; then
    cp .env.example backend/.env
    echo "✓ Created backend/.env"
else
    echo "✓ backend/.env already exists"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 4: Check Supabase Connection
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo "📋 STEP 4: Checking Supabase Configuration"
echo "──────────────────────────────────────────"

SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2 | tr -d ' ')
SUPABASE_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2 | tr -d ' ')

if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" == "https://your-project.supabase.co" ]; then
    echo "⚠️  Supabase URL not configured"
    echo "   If you don't have a Supabase project yet:"
    echo "   1. Go to https://supabase.io"
    echo "   2. Sign up and create a new project"
    echo "   3. Select 'ap-south-1 (Asia, Mumbai)' region"
    echo "   4. Copy Project URL and Anon Key"
    echo "   5. Paste into .env.local"
else
    echo "✓ Supabase URL configured"
    
    # Test Supabase connection
    echo ""
    echo "Testing Supabase connection..."
    curl -s -X GET \
      -H "apikey: $SUPABASE_KEY" \
      "$SUPABASE_URL/rest/v1/" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ Supabase connection successful!"
    else
        echo "⚠️  Could not verify Supabase connection"
        echo "   Check if credentials are correct"
    fi
fi

echo ""
