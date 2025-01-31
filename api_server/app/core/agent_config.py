from langchain_ollama import OllamaLLM

from openai import OpenAI

from app.core.config import Settings

openai_client = OpenAI(api_key=Settings().openai_key)
deepseek_chat_client = OpenAI(api_key=Settings().deepseek_ai_key, base_url="https://api.deepseek.com", max_retries=4)

from pydantic_ai.models.groq import GroqModel
from pydantic_ai.models.openai import OpenAIModel
import logfire

logfire.configure()

groq_model = GroqModel(model_name="llama-3.3-70b-versatile", api_key=Settings().groq_api_key)
openai_model = OpenAIModel(model_name="gpt-4o", api_key=Settings().openai_key)