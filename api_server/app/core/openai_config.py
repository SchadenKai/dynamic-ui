from openai import OpenAI

from app.core.config import Settings

client = OpenAI(api_key=Settings().openai_key)