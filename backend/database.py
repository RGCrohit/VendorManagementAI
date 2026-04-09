"""
Database configuration and models
"""
from sqlalchemy import create_engine, Column, String, Integer, DateTime, JSON, Float, Enum, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
import os
from datetime import datetime
import enum
from uuid import uuid4

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/procurai")

# Create engine
engine = create_engine(DATABASE_URL, echo=os.getenv("ENVIRONMENT") == "development")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enums
class UserRole(str, enum.Enum):
    SCRUM = "SCRUM"
    HEAD_PM = "HEAD_PM"
    PM = "PM"
    JR_PM = "JR_PM"
    FINANCE = "FINANCE"
    JR_FINANCE = "JR_FINANCE"
    VENDOR = "VENDOR"

class VendorStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    ACTIVE = "active"
    SUSPENDED = "suspended"

class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    QC = "qc"
    SHIPMENT = "shipment"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class CaseStatus(str, enum.Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    QC = "qc"
    DONE = "done"

class CaseType(str, enum.Enum):
    BILLING_DISPUTE = "billing_dispute"
    SLA_BREACH = "sla_breach"
    DELIVERY_FAILURE = "delivery_failure"
    ONBOARDING_BLOCKER = "onboarding_blocker"

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.PM)
    company = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    gst_number = Column(String, unique=True)
    ifsc_code = Column(String)
    status = Column(Enum(VendorStatus), default=VendorStatus.PENDING)
    risk_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    budget = Column(Float)
    spent = Column(Float, default=0.0)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    case_number = Column(String, unique=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    type = Column(Enum(CaseType))
    vendor_id = Column(String, ForeignKey("vendors.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    status = Column(Enum(CaseStatus), default=CaseStatus.BACKLOG)
    priority = Column(String, default="medium")
    assigned_to = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    vendor_id = Column(String, ForeignKey("vendors.id"))
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    amount = Column(Float)
    gst_amount = Column(Float, default=0.0)
    status = Column(String, default="pending")  # pending, pm_approved, finance_approved, paid
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Quotation(Base):
    __tablename__ = "quotations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    vendor_id = Column(String, ForeignKey("vendors.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    total_amount = Column(Float)
    line_items = Column(JSON)  # [{"item": "", "quantity": 0, "price": 0}]
    delivery_timeline = Column(String)
    sla_terms = Column(String)
    status = Column(String, default="pending")  # pending, submitted, selected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VoiceSession(Base):
    __tablename__ = "voice_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    transcript = Column(String)
    intent = Column(String)
    entities = Column(JSON)
    response = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create all tables
Base.metadata.create_all(bind=engine)
