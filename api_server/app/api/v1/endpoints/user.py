from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.services.user import create_user, get_user_by_id, get_all_users, delete_user
from app.services.session import create_session_token, delete_session_token, is_token_valid
from app.api.v1.schemas.user import UsersCreate, UsersBase
from app.db.models.user import Users
from app.api.dependencies import get_current_user
import uuid
import secrets

router = APIRouter(prefix="/user", tags=["/user"])

@router.post("/signup")
def signup(user: UsersCreate, db_session: Session = Depends(get_session)):
    new_user = Users(**user.model_dump())
    created_user = create_user(db_session, new_user)
    return created_user

@router.post("/login")
def login(email: str, password: str, db_session: Session = Depends(get_session)):
    users = get_all_users(db_session)
    for user in users:
        if user.email == email and user.password_hash == password:
            token = secrets.token_hex(16)
            create_session_token(db_session, user.user_id, token)
            return {"message": "Login successful", "token": token}
    raise HTTPException(status_code=400, detail="Invalid email or password")

@router.post("/logout")
def logout(token: str, db_session: Session = Depends(get_session)):
    success = delete_session_token(db_session, token)
    if not success:
        raise HTTPException(status_code=404, detail="Session token not found")
    return {"message": "Logout successful"}

@router.get("/{user_id}")
def read_user(user_id: uuid.UUID, current_user: Users = Depends(get_current_user)):
    user = get_user_by_id(current_user, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/")
def read_users(current_user: Users = Depends(get_current_user)):
    users = get_all_users(current_user)
    return users

@router.delete("/{user_id}")
def delete_user_endpoint(user_id: uuid.UUID, current_user: Users = Depends(get_current_user)):
    success = delete_user(current_user, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

