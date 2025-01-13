from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.session import get_session
from app.services.execute_query import execute_query, generate_query_from_prompt
from app.api.v1.schemas.generate_ui import GenerateUISchema
from app.services.dynamic_ui import generate_ui

router = APIRouter(prefix="/chat", tags=["/chat"])

@router.post("/generate-ui")
async def generate_ui_endpoint(request: GenerateUISchema):
    function = generate_ui(request.user_input) 
    if function == "null" or function == "None":
        print("Function has not been called")
        return
    else: 
        print("Function has been called")   
    return function


@router.get("/history")
async def get_chat_history():
    return {"message": "This is the chat history endpoint"}


@router.post("/create-chat-session")
async def create_chat_session(db_session: Session = Depends(get_session)):
    pass


@router.post("/testing2")
async def testing2(user_input: str):
    result = generate_query_from_prompt(user_input)
    return result