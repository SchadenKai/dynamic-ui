from fastapi import APIRouter


router = APIRouter(prefix="/chat", tags=["/chat"])

@router.post("/generate-ui")
async def generate_ui():
    return {"message": "UI generated"}