from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    openai_key: str = Field(validation_alias="openai_key")
    postgres_user: str = Field(validation_alias="postgres_user")
    postgres_password: str = Field(validation_alias="postgres_password")
    postgres_host: str = Field(validation_alias="postgres_host")
    postgres_port: str = Field(validation_alias="postgres_port")
    postgres_db: str = Field(validation_alias="postgres_db")    
    
    model_config = SettingsConfigDict(env_file=".env")