from langchain_ollama import OllamaLLM
from openai import OpenAI

from app.core.config import Settings

openai_client = OpenAI(api_key=Settings().openai_key)
deepseek_chat_client = OpenAI(api_key="sk-961a0180eb824f9abad8cc0ce5c848e1", base_url="https://api.deepseek.com")
llama_client = OllamaLLM(model="llama3.1")

# Initialize DeepSeek LLM
# pip3 install langchain_openai
# python3 deepseek_v2_langchain.py
from langchain_openai import ChatOpenAI