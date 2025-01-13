from datetime import datetime
from typing import TYPE_CHECKING
import uuid
from sqlmodel import Field, Relationship
from app.api.v1.schemas.chat import ChatHistoryBase

if TYPE_CHECKING:
    from .user import Users

class ChatHistory(ChatHistoryBase, table=True):
    chat_id: int = Field(default=None, primary_key=True)
    sent_at: datetime | None = Field(default=datetime.now())
    sender_id: uuid.UUID = Field(foreign_key="users.user_id")
    
    sender: "Users" = Relationship(back_populates="chat_history")
    