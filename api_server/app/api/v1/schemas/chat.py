from enum import Enum
from sqlmodel import SQLModel


class ChatRole(str, Enum):
    SYSTEM = "system"
    USER = "user"

class ChatHistoryBase(SQLModel):
    message: str
    role: ChatRole