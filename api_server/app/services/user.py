import uuid
from sqlmodel import Session, select
from app.db.models.user import Users

def create_user(session: Session, user: Users) -> Users:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_user_by_id(session: Session, user_id: uuid.UUID) -> Users | None:
    statement = select(Users).where(Users.user_id == user_id)
    result = session.exec(statement).first()
    return result

def get_all_users(session: Session) -> list[Users]:
    statement = select(Users)
    result = session.exec(statement).all()
    return result

def delete_user(session: Session, user_id: uuid.UUID) -> bool:
    user = get_user_by_id(session, user_id)
    if user:
        session.delete(user)
        session.commit()
        return True
    return False
