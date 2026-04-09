from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_cases():
    return {"cases": []}

@router.get("/{case_id}")
async def get_case(case_id: str):
    return {"case": case_id}

@router.post("/")
async def create_case():
    return {"message": "Case created"}

@router.put("/{case_id}")
async def update_case(case_id: str):
    return {"message": "Case updated"}
