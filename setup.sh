#!/bin/bash

# ProcurAI Development Setup Script

echo "🚀 Setting up ProcurAI..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ from https://python.org"
    exit 1
fi

echo "✅ Python version: $(python3 --version)"

# Frontend setup
echo "📦 Installing frontend dependencies..."
npm install

echo "📝 Creating .env.local..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "ℹ️  Please configure .env.local with your Supabase credentials"
fi

# Backend setup
echo "🐍 Setting up Python environment..."
cd backend

python3 -m venv venv
source venv/bin/activate 2>/dev/null || venv\Scripts\activate

pip install -r requirements.txt

echo "📝 Creating backend .env..."
if [ ! -f .env ]; then
    cp ../.env.example .env
    sed 's|NEXT_PUBLIC_||g' .env > .env.tmp && mv .env.tmp .env
    echo "ℹ️  Please configure backend/.env with your credentials"
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env.local for frontend (Supabase credentials)"
echo "2. Configure backend/.env for backend API"
echo "3. Run 'npm run dev' to start frontend on localhost:3000"
echo "4. Run 'cd backend && uvicorn main:app --reload' for backend on localhost:8000"
echo ""
echo "📚 Documentation: https://procurai.dev"
echo "🐛 Report issues: https://github.com/procurai/procurai/issues"
