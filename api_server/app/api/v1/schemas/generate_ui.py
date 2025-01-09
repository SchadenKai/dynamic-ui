from pydantic import BaseModel


class GenerateUISchema(BaseModel):
    user_input: str
    