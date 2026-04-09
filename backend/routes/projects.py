from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_projects():
    return {"projects": []}

@router.get("/{project_id}")
async def get_project(project_id: str):
    return {"project": project_id}

@router.post("/")
async def create_project():
    return {"message": "Project created"}
