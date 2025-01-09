from fastapi import APIRouter
from app.services.get_weather import get_current_weather

router = APIRouter(prefix="/chat", tags=["/chat"])

@router.post("/generate-ui")
async def generate_ui():
    return {"message": "UI generated"}

@router.post("/current-weather")
async def get_current_weather_endpoint():
    function_parameter = get_current_weather(location="San Francisco")
    return function_parameter