import json
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.models.chat import ChatHistory
from app.services.chat import create_chat_history, get_all_chat_histories, get_user_chat_histories
from app.api.v1.schemas.chat import ChatCreate, ChatHistoryCreate
from app.api.dependencies import get_current_user
from app.db.models.user import Users
from app.db.session import get_session
from app.services.llm.execute_query import execute_query, generate_query_from_prompt
from app.api.v1.schemas.generate_ui import GenerateUISchema
from app.services.llm.dynamic_ui import generate_ui
from app.core.openai_config import openai_client
from app.services.llm.dynamic_ui import generate_ui_tool
from app.services.llm.execute_query import generate_sql_query_tool

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
async def get_chat_history(current_user: Users = Depends(get_current_user) ,db_session: Session = Depends(get_session)):
    chat_history = get_user_chat_histories(db_session, current_user.user_id)
    return chat_history


@router.post("/send-message")
async def create_chat_session_endpoint(request: ChatCreate, current_user: Users = Depends(get_current_user), db_session: Session = Depends(get_session)):
    new_chat_message = ChatHistory(
        sender_id=current_user.user_id,
        message=request.message,
        role="user"
    )
    create_chat_history(db_session, new_chat_message)
    while True: 
        chat_message_history = get_user_chat_histories(db_session, current_user.user_id)
        chat_messages = [{"role": chat.role.value, "content": chat.message} for chat in chat_message_history]
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=chat_messages,
            functions=[generate_sql_query_tool, generate_ui_tool],
            function_call="auto"
        )
        if response.choices[0].finish_reason == 'function_call':
            function_call = response.choices[0].message.function_call
            func_name = function_call.name
            func_args = json.loads(function_call.arguments)
            
            if func_name == "generate_sql_query":
                query = func_args["query"]
                params = func_args.get("params", {})
                result = execute_query(query, params)
                new_ai_chat_message = ChatHistory(
                    sender_id=current_user.user_id,
                    message=str(result),
                    role="system"
                )
                create_chat_history(db_session, new_ai_chat_message)
            if func_name == "generate_ui":
                ui = func_args
                new_ai_chat_message = ChatHistory(
                    sender_id=current_user.user_id,
                    message=str(ui),
                    role="system"
                )
                create_chat_history(db_session, new_ai_chat_message)
                break
        elif response.choices[0].message.content:
            response_message = response.choices[0].message.content
            new_ai_chat_message = ChatHistory(
                sender_id=current_user.user_id,
                message=response_message,
                role="system"
            )
            create_chat_history(db_session, new_ai_chat_message)
        else:
            break
    return
             


@router.post("/execute-query")
async def execute_query_endpoint(user_input: str):
    result = generate_query_from_prompt(user_input)
    return result