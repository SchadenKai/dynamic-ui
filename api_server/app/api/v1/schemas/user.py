import datetime
from enum import Enum
import hashlib
from typing import Optional
from pydantic import BaseModel, field_validator
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
    role: RoleEnum
    full_name: str
    email: str
    password_hash: str
    date_joined: None | datetime.datetime = datetime.datetime.now()
    @field_validator("password_hash", mode="after")
    def hash_password(cls, v : str):
        return hashlib.sha256(v.encode()).hexdigest()
    @field_validator("full_name", mode="before")
    def capitalize_name(cls, v : str):
        return v.title()
    
class LoginBase(BaseModel):
    email: str
    password_hash: str
    
    @field_validator("email", mode="before")
    def lower_case_email(cls, v : str):
        return v.lower()
    @field_validator("password_hash", mode="after")
    def hash_password(cls, v : str):
        return hashlib.sha256(v.encode()).hexdigest()