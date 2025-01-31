from contextlib import asynccontextmanager
from fastapi import FastAPI
import openai
from starlette.middleware.cors import CORSMiddleware
from app.db.session import warm_up_connections
from app.api.v1.endpoints.chat import router as chat_router
from app.routers.generate_dummy_data import router as generate_dummy_data_router
from app.api.v1.endpoints.user import router as user_router
from app.core.config import Settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # await warm_up_connections()
    print("App started")
    
    yield

app = FastAPI(
    title="Dynamic UI API Server",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(generate_dummy_data_router)
app.include_router(user_router)