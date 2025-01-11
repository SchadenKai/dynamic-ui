import datetime
from enum import Enum
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

from app.api.v1.schemas.user import UsersBase
    
class Users(UsersBase, table=True):
    user_id: str = Field(default=None, primary_key=True)
    date_joined: datetime.datetime | None = Field(nullable=False)