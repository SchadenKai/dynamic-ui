from fastapi import APIRouter
from app.services.execute_query import execute_query, generate_query_from_prompt
from app.api.v1.schemas.generate_ui import GenerateUISchema
from app.services.dynamic_ui import generate_ui
from app.services.get_weather import get_current_weather

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


@router.post("/current-weather")
async def get_current_weather_endpoint(location: str):
    function_parameter = get_current_weather(location)
    return function_parameter

@router.get("/history")
async def get_chat_history():
    return {"message": "This is the chat history endpoint"}

@router.get("/testing")
async def testing():
    query = "SELECT * FROM users WHERE role = :role"
    params = {"role": "admin"}
    return execute_query(query, params)

@router.post("/testing2")
async def testing2(user_input: str):
    result = generate_query_from_prompt(user_input)
    return result