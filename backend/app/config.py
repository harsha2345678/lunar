import os
from pydantic import BaseModel
from typing import List

class Settings(BaseModel):
    app_name: str = "Lunar Sentry AI - Mission Control API"
    app_env: str = os.getenv("APP_ENV", "development")
    debug: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./lunar_sentry.db")
    upload_dir: str = os.getenv("UPLOAD_DIR", "./uploads")
    media_dir: str = os.getenv("MEDIA_DIR", "./media")
    max_upload_size_mb: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50"))
    model_weights_path: str = os.getenv("MODEL_WEIGHTS_PATH", "./weights/yolov9_lunar.pt")
    model_confidence_threshold: float = float(os.getenv("MODEL_CONFIDENCE_THRESHOLD", "0.50"))

settings = Settings()
