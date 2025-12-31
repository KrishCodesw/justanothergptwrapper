import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.ai.gemini import Gemini
from src.ai.querycorrector import QueryCorrector
from typing import List, Optional, Any
from dotenv import load_dotenv
load_dotenv()

#Load system prompt 
def load_system_prompt():
    base_dir=os.path.dirname(os.path.abspath(__file__))
    prompt_path=os.path.join(base_dir,"prompts","system_prompt.md")
    with open(prompt_path,encoding="utf-8") as f:
        return f.read()

system_prompt=load_system_prompt()

gemini_api_key = os.getenv("GEMINI_API_KEY")

# gemini = Gemini(api_key=gemini_api_key, system_prompt=system_prompt)

ai_platform=Gemini(api_key=gemini_api_key,system_prompt=system_prompt)


#Load query corrector prompt 

def load_query_corrector_prompt():
    base_dir=os.path.dirname(os.path.abspath(__file__))
    prompt_path=os.path.join(base_dir,"prompts","query_correctorsystemprompt.md")
    with open(prompt_path,encoding="utf-8") as f:
        return f.read()
    
querycorrector_prompt=load_query_corrector_prompt()

query_corrector_platform = QueryCorrector(api_key=gemini_api_key, query_correctorsystemprompt=querycorrector_prompt)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (change to ["http://localhost:3000"] for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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



class QueryCorrectorRequest(BaseModel):
    sql_query: str


class QueryCorrectorResponse(BaseModel):
    original_query: str
    corrected_query: str
    type: str 
    changes_made: List[str]
    risk_level: str 
    confidence: Optional[float]


@app.post("/correctquery", response_model=QueryCorrectorResponse)
async def correct_query(request: QueryCorrectorRequest):
    result =  query_corrector_platform.chat(request.sql_query)

    if not isinstance(result, dict):
        raise ValueError("QueryCorrector did not return a valid dict response")

    return QueryCorrectorResponse(**result)
