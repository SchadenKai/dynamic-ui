from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.routers.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
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