import datetime
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel import Field
from faker import Faker
import random

from app.db.models.user import Users
from app.api.v1.schemas.user import UsersCreate
from app.db.session import get_sqlalchemy_engine


# Generate dummy data
def generate_dummy_data(num_records: int = 100):
    with Session(get_sqlalchemy_engine()) as session:
        fake = Faker()
        for _ in range(num_records):
            user = Users(
                role=random.choice(["student", "trainer", "admin"]),
                full_name=fake.name(),
                email=fake.email(domain="gmail.com"),
                phone_number=fake.phone_number(),
                password_hash=fake.password(),
                date_joined=datetime.datetime.now()
            )
            session.add(user)
        session.commit()
        session.refresh(user)