"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str
    role: str = "PM"

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class VendorCreateSchema(BaseModel):
    name: str
    email: EmailStr
    gst_number: str
    ifsc_code: str
    company_category: Optional[str] = None

class ProjectCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None
    budget: float
    start_date: datetime
    end_date: datetime

class InvoiceUploadSchema(BaseModel):
    vendor_id: str
    project_id: Optional[str] = None
    amount: float
    due_date: datetime

class CaseCreateSchema(BaseModel):
    title: str
    description: Optional[str] = None
    vendor_id: str
    project_id: str
    priority: str = "medium"

class QuotationSubmitSchema(BaseModel):
    vendor_id: str
    project_id: str
    total_amount: float
    line_items: List[dict]
    delivery_timeline: str
    sla_terms: str

class AIMessageSchema(BaseModel):
    message: str
    session_id: Optional[str] = None
