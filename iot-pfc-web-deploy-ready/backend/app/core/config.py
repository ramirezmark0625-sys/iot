from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from typing import List
import secrets

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

    SECRET_KEY: str = secrets.token_urlsafe(48)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = "sqlite:///./pfc.db"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    SEED_ADMIN: bool = False
    SEED_ADMIN_EMAIL: str = "admin@pfc.local"
    SEED_ADMIN_PASSWORD: str = "admin123!"

    @property
    def origins_list(self) -> List[str]:
        # comma-separated
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

settings = Settings()
