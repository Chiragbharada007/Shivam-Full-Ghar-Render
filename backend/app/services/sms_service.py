import httpx
from app.config import settings


async def send_otp_sms_or_telegram(phone: str, otp_code: str) -> tuple[bool, str]:
    """Try configured free SMS / Telegram push gateways."""
    clean_phone = "".join(ch for ch in (phone or "") if ch.isdigit())[-10:]

    if settings.telegram_bot_token and settings.telegram_chat_id:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                r = await client.post(
                    f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage",
                    json={
                        "chat_id": settings.telegram_chat_id,
                        "text": f"🔐 Shivam Full Ghar Admin OTP: {otp_code} (Valid 60s)",
                    },
                )
            if r.status_code == 200:
                return True, "TELEGRAM"
        except Exception:
            pass

    if settings.fast2sms_api_key and len(clean_phone) == 10:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                r = await client.post(
                    "https://www.fast2sms.com/dev/bulkV2",
                    headers={"authorization": settings.fast2sms_api_key},
                    json={"route": "otp", "variables_values": otp_code, "numbers": clean_phone},
                )
            if r.status_code == 200:
                return True, "FAST2SMS"
        except Exception:
            pass

    if settings.two_factor_api_key and len(clean_phone) == 10:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                r = await client.get(
                    f"https://2factor.in/API/V1/{settings.two_factor_api_key}/SMS/{clean_phone}/{otp_code}"
                )
            if r.status_code == 200:
                return True, "2FACTOR"
        except Exception:
            pass

    return False, "LOGGED_ONLY"
