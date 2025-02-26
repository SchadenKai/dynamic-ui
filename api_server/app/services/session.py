from datetime import datetime, timezone
from sqlmodel import Session, select
from app.db.models.session import SessionToken
import uuid

def create_session_token(session: Session, user_id: uuid.UUID, token: str) -> SessionToken:
    session_token = SessionToken(user_id=user_id, token=token)
    session.add(session_token)
    session.commit()
    session.refresh(session_token)
    return session_token

def get_session_token(session: Session, token: str) -> SessionToken | None:
    statement = select(SessionToken).where(SessionToken.token == token)
    result = session.exec(statement).first()
    return result

def delete_session_token(session: Session, token: str) -> bool:
    session_token = get_session_token(session, token)
    if session_token:
        session.delete(session_token)
        session.commit()
        return True
    return False

def is_token_valid(session: Session, token: str) -> bool:
    session_token = get_session_token(session, token)
    if session_token:
        print("session token expires at: ", session_token.expires_at)
        print("current time: ", datetime.now(timezone.utc))
        current_time = datetime.now(timezone.utc)
        # Ensure both datetime objects are aware before comparison
        if session_token.expires_at.tzinfo is None:
            # If expires_at is naive, make it aware
            session_token.expires_at = session_token.expires_at.replace(tzinfo=timezone.utc)

        # Now they are both aware datetime objects, so we can compare
        if session_token.expires_at > current_time:
            return True
    return False