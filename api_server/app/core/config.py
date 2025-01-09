from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    openai_key: str = Field(validation_alias="openai_key")
    model_config = SettingsConfigDict(env_file=".env")