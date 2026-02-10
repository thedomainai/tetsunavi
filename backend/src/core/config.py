"""アプリケーション設定"""

from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """アプリケーション設定"""

    # アプリケーション
    APP_NAME: str = "Tetsunavi API"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # Google Cloud
    GOOGLE_CLOUD_PROJECT: str
    FIRESTORE_COLLECTION: str = "sessions"

    # Vertex AI
    VERTEX_AI_LOCATION: str = "asia-northeast1"
    VERTEX_AI_MODEL: str = "gemini-2.0-flash-001"

    # Google Maps API
    GOOGLE_MAPS_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: str = '["http://localhost:3000"]'

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def cors_origins_list(self) -> List[str]:
        """CORS オリジンをリストに変換"""
        try:
            return json.loads(self.CORS_ORIGINS)
        except json.JSONDecodeError:
            return ["http://localhost:3000"]


settings = Settings()
