from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_quotations():
    return {"quotations": []}

@router.get("/{quotation_id}")
async def get_quotation(quotation_id: str):
    return {"quotation": quotation_id}

@router.post("/")
async def submit_quotation():
    return {"message": "Quotation submitted"}
