from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_invoices():
    return {"invoices": []}

@router.get("/{invoice_id}")
async def get_invoice(invoice_id: str):
    return {"invoice": invoice_id}

@router.post("/upload")
async def upload_invoice():
    return {"message": "Invoice uploaded"}

@router.post("/{invoice_id}/approve")
async def approve_invoice(invoice_id: str):
    return {"message": "Invoice approved"}
