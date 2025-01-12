import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional
import uuid
from sqlmodel import Field, Relationship, SQLModel

from app.api.v1.schemas.user import UsersBase

if TYPE_CHECKING:
    from .chat import ChatHistory
    
class Users(UsersBase, table=True):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    date_joined: datetime.datetime | None = Field(nullable=False)
    
    chat_history: List["ChatHistory"] = Relationship(back_populates="sender")