from fastapi import APIRouter
from pydantic import BaseModel
from google import genai

router = APIRouter(prefix="/chat", tags=["Chat"])

client = genai.Client()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    prompt = f"You are a skincare ingredient expert. Reply conversationally.\nUser: {req.message}"
    result = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)

    reply = result.text if result.text else "No response received."

    return ChatResponse(reply=reply)
