from contextlib import asynccontextmanager
from fastapi import FastAPI
import openai
from starlette.middleware.cors import CORSMiddleware
from app.api.v1.endpoints.chat import router as chat_router
from app.core.config import Settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading OPENAI API key")
    openai.api_key = Settings().openai_key
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