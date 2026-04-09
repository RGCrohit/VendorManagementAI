from fastapi import APIRouter

router = APIRouter()

@router.post("/chat")
async def chat_with_agent():
    return {"message": "Chat response"}

@router.post("/voice/start")
async def start_voice_session():
    return {"session_id": "voice-session-1"}

@router.post("/voice/process")
async def process_voice():
    return {"response": "Voice response"}
