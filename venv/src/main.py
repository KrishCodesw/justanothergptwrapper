import os
from fastapi import FastAPI
from pydantic import BaseModel

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
    response_text="..."
    return ChatResponse(response=response_text)

# Configuring system prompt in project 

def load_system_prompt():
    with open("src/prompts/system_prompt.md") as f:
        return f.read()

system_prompt=load_system_prompt()