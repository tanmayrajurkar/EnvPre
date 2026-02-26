from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Environmental Intelligence Platform"
    # Default to SQLite for local dev. Override via .env with a Supabase/PostgreSQL URL.
    DATABASE_URL: str = "sqlite:///./envpre.db"
    OPENAQ_API_KEY: str | None = None

    class Config:
        env_file = ".env"
        # Don't fail on extra fields in .env
        extra = "ignore"


settings = Settings()
