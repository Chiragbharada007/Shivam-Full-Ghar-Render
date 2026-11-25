import httpx
from app.config import settings


async def send_otp_email(to_email: str, otp_code: str, admin_name: str = "Admin") -> tuple[bool, str]:
    """Send 6-digit OTP via Resend transactional email API."""
    api_key = settings.resend_api_key.strip()
    if not api_key:
        return False, "RESEND_API_KEY not configured"

    recipient = to_email or settings.admin_notify_email
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #9f1239; margin: 0 0 8px;">Shivam Full Ghar — Admin Security Code</h2>
      <p style="color: #44403c; font-size: 14px;">Hello {admin_name}, use the following 6-digit verification code to access your Admin Console:</p>
      <div style="background: #fff1f2; border: 1px dashed #fb7185; border-radius: 10px; padding: 16px; text-align: center; margin: 16px 0;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #881337;">{otp_code}</span>
      </div>
      <p style="color: #78716c; font-size: 12px;">Valid for 60 seconds. Do not share this code with anyone.</p>
    </div>
    """

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": "Shivam Full Ghar <onboarding@resend.dev>",
                    "to": [recipient],
                    "subject": f"Shivam Full Ghar OTP: {otp_code}",
                    "html": html_body,
                },
            )
        if res.status_code in (200, 201):
            return True, "SENT"
        return False, f"Resend HTTP {res.status_code}: {res.text[:200]}"
    except Exception as exc:
        return False, str(exc)
