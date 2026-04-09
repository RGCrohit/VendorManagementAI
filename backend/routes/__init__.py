"""
Route placeholder files
"""
from fastapi import APIRouter

# Auth routes
router_auth = APIRouter()

@router_auth.post("/register")
async def register():
    return {"message": "Register endpoint"}

@router_auth.post("/login")
async def login():
    return {"message": "Login endpoint"}

# Export as 'router' for main.py import
router = router_auth
