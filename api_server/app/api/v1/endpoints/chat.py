import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from app.services.llm.template_json_generator import template_json_generator_agent
from app.services.llm.general import template_json_generator
from app.db.models.chat import ChatHistory
from app.services.chat import create_chat_history, get_all_chat_histories, get_user_chat_histories
from app.api.v1.schemas.chat import ChatCreate, ChatHistoryCreate
from app.api.dependencies import get_current_user
from app.db.models.user import Users
from app.db.session import get_session
from app.services.llm.execute_query import execute_query, generate_query_from_prompt, sql_generator_agent
from app.api.v1.schemas.generate_ui import GenerateUISchema
from app.services.llm.dynamic_ui import generate_ui, multi_uijson_generator_agent
from app.core.agent_config import openai_client, deepseek_chat_client
from app.services.llm.dynamic_ui import ui_json_generator_agent
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

class ChatCreateBase(BaseModel):
    message: str

@router.post("/llm/health")
async def get_llm_health(request: ChatCreateBase):
    response = await ui_json_generator_agent(request.message)
    return response

@router.post("/llm/retrieve-data")
async def get_llm_retrieve_data(request: ChatCreateBase):
    response = await sql_generator_agent(request.message)
    return response

@router.post("/llm/template-json")
async def template_json_generator(request: ChatCreateBase):
    response = await template_json_generator_agent(request.message)
    return response

@router.post("/llm/simple-generate-ui")
async def simple_generate_ui(request: ChatCreateBase, current_user: Users = Depends(get_current_user), db_session: Session = Depends(get_session)):
    new_chat_message = ChatHistory(
        sender_id=current_user.user_id,
        message=request.message,
        role="user"
    )
    create_chat_history(db_session, new_chat_message)
    
    # raw data in list of dictionaries format
    raw_data_retrieved = await sql_generator_agent(request.message)
    
    new_chat_message = ChatHistory(
        sender_id=current_user.user_id,
        message=str(raw_data_retrieved),
        role="system"
    )
    create_chat_history(db_session, new_chat_message)
    
    
    print(f"Raw data retrieved: {str(raw_data_retrieved)}")
    template_json_response = await multi_uijson_generator_agent(raw_data=raw_data_retrieved, user_input=request.message)
    
    new_chat_message = ChatHistory(
        sender_id=current_user.user_id,
        message=str(template_json_response.model_dump_json()),
        role="system"
    )
    create_chat_history(db_session, new_chat_message)
    return template_json_response

@router.get("/history")
async def get_chat_history(current_user: Users = Depends(get_current_user) ,db_session: Session = Depends(get_session)):
    chat_history = get_user_chat_histories(db_session, current_user.user_id)
    sort_by_chat_id = sorted(chat_history, key=lambda x: x.chat_id)
    return sort_by_chat_id




_SYSTEM_PROMPT = """
You are a dynamic UI generator where in you will be retrieving data from the database by generating SQL queries using `generate_sql_query_tool` and then you will be generating a UI that is compatible with React.js using `generate_ui_tool`.
Every after you generated and SQL query and returned the data from the database, already move on to the next step which would be generating the UI definition by using the `generate_ui_tool` function call. Do not forget to make the UI as complete as possible based on the request of the user.
Also do not repeat the same SQL query and UI generation process to avoid redundancy of prompts and responses.
"""

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
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                *chat_messages
            ],
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
             
@router.get("/latest-message")
async def get_latest_message(current_user: Users = Depends(get_current_user) ,db_session: Session = Depends(get_session)):
    chat_history = get_user_chat_histories(db_session, current_user.user_id)
    sort_by_chat_id = sorted(chat_history, key=lambda x: x.chat_id)
    latest_message = sort_by_chat_id[-1]
    return latest_message

@router.post("/execute-query")
async def execute_query_endpoint(user_input: str):
    result = generate_query_from_prompt(user_input)
    return result