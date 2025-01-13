from datetime import datetime, timedelta, timezone
from sqlmodel import Field, SQLModel
import uuid

class SessionToken(SQLModel, table=True):
    token_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.user_id")
    token: str = Field(unique=True)
    created_at: datetime = Field(default=datetime.now())
    expires_at: datetime = Field(default=datetime.now() + timedelta(days=1))
