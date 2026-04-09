from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
async def register():
    return {"message": "Register endpoint"}

@router.post("/login")
async def login():
    return {"message": "Login endpoint"}

@router.post("/verify-otp")
async def verify_otp():
    return {"message": "OTP verified"}

@router.post("/logout")
async def logout():
    return {"message": "Logged out"}
