from fastapi import Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.services.session import is_token_valid, get_session_token
from app.services.user import get_user_by_id
from app.db.models.user import Users

def get_current_user(token: str, db_session: Session = Depends(get_session)) -> Users:
    if not is_token_valid(db_session, token):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    session_token = get_session_token(db_session, token)
    if not session_token:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_id(db_session, session_token.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
