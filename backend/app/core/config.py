from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Environmental Intelligence Platform"
    DATABASE_URL: str = "sqlite:///./test.db"  # Default to sqlite for local dev if not set
    OPENAQ_API_KEY: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
