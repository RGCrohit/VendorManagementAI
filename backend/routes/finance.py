from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_finance_data():
    return {"finance": {}}

@router.get("/budget/{project_id}")
async def get_budget_status(project_id: str):
    return {"budget": {}}

@router.post("/export")
async def export_csv():
    return {"download_url": "https://example.com/export.csv"}
