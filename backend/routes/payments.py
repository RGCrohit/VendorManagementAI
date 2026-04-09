from fastapi import APIRouter

router = APIRouter()

@router.post("/razorpay/create")
async def create_razorpay_payment():
    return {"payment_id": "pay_123"}

@router.post("/razorpay/verify")
async def verify_razorpay_payment():
    return {"verified": True}

@router.post("/refund")
async def refund_payment():
    return {"refund_id": "rfnd_123"}
