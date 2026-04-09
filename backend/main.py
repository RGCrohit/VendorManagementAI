"""
ProcurAI Backend - FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routes import vendors, projects, invoices, cases, quotations, ai_agent, finance, payments, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 ProcurAI Backend Starting...")
    yield
    # Shutdown
    print("🛑 ProcurAI Backend Shutting Down...")

# Create FastAPI application
app = FastAPI(
    title="ProcurAI API",
    description="AI-Powered Vendor & Project Management Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://procurai.vercel.app",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", ".vercel.app"]
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["Vendors"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(cases.router, prefix="/api/cases", tags=["Cases"])
app.include_router(quotations.router, prefix="/api/quotations", tags=["Quotations"])
app.include_router(ai_agent.router, prefix="/api/ai", tags=["AI Agent"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to ProcurAI API",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "procurai-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info",
    )
