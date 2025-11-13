import os
from fastapi import FastAPI
from pydantic import BaseModel
from src.ai.gemini import Gemini

app=FastAPI()

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str


@app.get("/")
async def root():
    return {"message":"This API is working"}

@app.post("/chat",response_model=ChatResponse)
async def chat(request:ChatRequest):
    response_text=ai_platform.chat(request.prompt)
    return ChatResponse(response=response_text)


# Configuring system prompt in project 

def load_system_prompt():
    base_dir=os.path.dirname(os.path.abspath(__file__))
    prompt_path=os.path.join(base_dir,"prompts","system_prompt.md")
    with open(prompt_path,encoding="utf-8") as f:
        return f.read()

system_prompt=load_system_prompt()

gemini_api_key = os.getenv("GEMINI_API_KEY")

gemini = Gemini(api_key=gemini_api_key, system_prompt=system_prompt)

ai_platform=Gemini(api_key=gemini_api_key,system_prompt=system_prompt)