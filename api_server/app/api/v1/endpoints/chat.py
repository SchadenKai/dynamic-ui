import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from app.utils.extract_fieldnames import extract_table_and_field_names
from app.services.llm.template_json_generator import template_json_generator_agent
from app.db.models.user import Users
from app.api.v1.schemas.generate_ui import GenerateUISchema
from app.services.llm.dynamic_ui import generate_ui

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

@router.post("/llm/template-json")
async def template_json_generator(request: ChatCreateBase):
    response = await template_json_generator_agent(request.message)
    
    api_query = extract_table_and_field_names(response)
        
    # add the combined repsonse from the api_query and the template_json
    
    return {
        "template_json": response,
        "api_query": api_query
    }