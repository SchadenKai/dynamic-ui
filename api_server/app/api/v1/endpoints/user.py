from fastapi import APIRouter
from app.db.generate_dummy_data import generate_dummy_data

router = APIRouter(prefix="/user", tags=["/user"])

@router.post("/generate-dummy-data")
def generate_dummy_data_endpoint():
    print("Generating dummy data")
    generate_dummy_data()
    return {"message": "Dummy data generated successfully!"}