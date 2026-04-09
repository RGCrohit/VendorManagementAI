from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_vendors():
    return {"vendors": []}

@router.get("/{vendor_id}")
async def get_vendor(vendor_id: str):
    return {"vendor": vendor_id}

@router.post("/")
async def create_vendor():
    return {"message": "Vendor created"}
