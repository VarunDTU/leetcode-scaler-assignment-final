from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from messages import get_prev_messsages_from_conversation_id,get_prev_conversations_for_user
from llm import chat_with_leetcode_bot
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()
frontend_url = os.getenv("FRONTEND_URL")
origins = [
    frontend_url,
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    messages: str
    user_id: str
    problem_slug: str


class Thread(BaseModel):
    user_id: str
    problem_slug: str


class Conversation(BaseModel):
    user_id: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response = await chat_with_leetcode_bot(
            message=request.messages,
            userId=request.user_id,
            problem_slug=request.problem_slug,
        )
        
        return JSONResponse(content=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-prev-messages")
async def get_prev_messages(request: Thread):
   
    try:
        chat_history = await get_prev_messsages_from_conversation_id(
            problem_slug=request.problem_slug,
            userId=request.user_id
        )
        print(request.problem_slug,request.user_id)
        return JSONResponse(content=chat_history)
    except Exception as e:
        print(f"Error getting previous messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-prev-conversations")
async def get_prev_conversations(request: Conversation):
    try:
        conversations = await get_prev_conversations_for_user(request.user_id)
        return JSONResponse(content=conversations)
    except Exception as e:
        print(f"Error getting previous conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


@app.get("/")
def read_root():
    return {"Hello": "World"}