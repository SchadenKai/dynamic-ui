import datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel


class RoleEnum(str, Enum):
    student = "student"
    trainer = "trainer"
    admin = "admin"
    
class UsersBase(SQLModel):
    role: RoleEnum
    full_name: str
    email: str
    phone_number: Optional[str] = None
    password_hash: str
    
class UsersCreate(UsersBase):
    date_joined: None | datetime.datetime = datetime.datetime.now()
