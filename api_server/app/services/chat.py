from sqlmodel import Session, select
from app.db.models.chat import ChatHistory

def create_chat_history(session: Session, chat_history: ChatHistory) -> ChatHistory:
    session.add(chat_history)
    session.commit()
    session.refresh(chat_history)
    return chat_history

def get_chat_history_by_id(session: Session, chat_id: int) -> ChatHistory | None:
    statement = select(ChatHistory).where(ChatHistory.chat_id == chat_id)
    result = session.exec(statement).first()
    return result

def get_user_chat_histories(session: Session, user_id: int) -> list[ChatHistory]:
    statement = select(ChatHistory).where(ChatHistory.sender_id == user_id)
    result = session.exec(statement).all()
    return result

def get_all_chat_histories(session: Session) -> list[ChatHistory]:
    statement = select(ChatHistory)
    result = session.exec(statement).all()
    return result

def delete_chat_history(session: Session, chat_id: int) -> bool:
    chat_history = get_chat_history_by_id(session, chat_id)
    if chat_history:
        session.delete(chat_history)
        session.commit()
        return True
    return False
