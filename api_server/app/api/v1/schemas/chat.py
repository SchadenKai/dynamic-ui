from enum import Enum
import uuid
from pydantic import BaseModel
from sqlmodel import SQLModel


class ChatRole(str, Enum):
    SYSTEM = "system"
    USER = "user"

class ChatHistoryBase(SQLModel):
    message: str
    role: ChatRole

class ChatCreate(BaseModel):
    message: str
    role: ChatRole = ChatRole.USER

class ChatHistoryCreate(ChatHistoryBase):
    sender_id: uuid.UUID