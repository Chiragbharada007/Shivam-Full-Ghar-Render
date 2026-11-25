import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./shivam_local.db",
    )
    jwt_secret: str = os.getenv("JWT_SECRET", "shivam-full-ghar-dev-jwt-secret-2026")
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 24 * 7

    resend_api_key: str = os.getenv("RESEND_API_KEY", "")
    admin_notify_email: str = os.getenv("ADMIN_NOTIFY_EMAIL", "chiragcaret09@gmail.com")

    fast2sms_api_key: str = os.getenv("FAST2SMS_API_KEY", "")
    two_factor_api_key: str = os.getenv("TWO_FACTOR_API_KEY", "")
    textbee_api_key: str = os.getenv("TEXTBEE_API_KEY", "")
    textbee_device_id: str = os.getenv("TEXTBEE_DEVICE_ID", "")
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    telegram_chat_id: str = os.getenv("TELEGRAM_CHAT_ID", "")

    cors_origins: str = os.getenv("CORS_ORIGINS", "*")

    @property
    def normalized_database_url(self) -> str:
        url = self.database_url.strip()
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url


settings = Settings()
