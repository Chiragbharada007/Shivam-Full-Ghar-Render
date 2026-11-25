from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import AdminUser, NotificationLog
from app.security import (
    create_access_token,
    decode_access_token,
    generate_otp_code,
    hash_otp,
    verify_otp_hash,
    verify_password,
    verify_security_answer,
)
from app.services.email_service import send_otp_email
from app.services.sms_service import send_otp_sms_or_telegram

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class OtpVerifyRequest(BaseModel):
    email: str
    otp: str


class SecurityQuestionsVerifyRequest(BaseModel):
    email: str
    answer1: str
    answer2: str


def _mask_phone(phone: Optional[str]) -> str:
    digits = "".join(ch for ch in (phone or "9904578134") if ch.isdigit())[-10:]
    if len(digits) < 10:
        return "+91 99*** *8134"
    return f"+91 {digits[:2]}*** *{digits[-4:]}"


def _set_session_cookie(response: Response, token: str):
    response.set_cookie(
        key="sfg_admin_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )


@router.post("/login")
def direct_login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.isActive == True).first()
    if not admin or not verify_password(payload.password, admin.passwordHash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    admin.failedAttempts = 0
    admin.lastLoginAt = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(admin.id, admin.email, admin.role, admin.name)
    _set_session_cookie(response, token)
    return {
        "success": True,
        "token": token,
        "user": {"id": admin.id, "email": admin.email, "name": admin.name, "role": admin.role},
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("sfg_admin_token", path="/")
    return {"success": True}


@router.get("/me")
def get_session(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("sfg_admin_token")
    auth_header = request.headers.get("authorization", "")
    if not token and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1].strip()
    if not token:
        return {"authenticated": False, "user": None}

    payload = decode_access_token(token)
    if not payload:
        return {"authenticated": False, "user": None}

    admin = db.query(AdminUser).filter(AdminUser.id == payload.get("sub"), AdminUser.isActive == True).first()
    if not admin:
        return {"authenticated": False, "user": None}

    return {
        "authenticated": True,
        "user": {"id": admin.id, "email": admin.email, "name": admin.name, "role": admin.role},
    }


@router.post("/admin-otp/send")
async def send_admin_otp(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.isActive == True).first()
    if not admin or not verify_password(payload.password, admin.passwordHash):
        return {"success": False, "message": "Invalid email or password."}

    now = datetime.now(timezone.utc)
    otp_code = generate_otp_code()
    admin.otpHash = hash_otp(otp_code)
    admin.otpExpiresAt = now + timedelta(seconds=60)
    admin.otpAttempts = 0
    admin.otpLastSentAt = now

    email_ok, email_status = await send_otp_email(admin.email, otp_code, admin.name)
    sms_ok, sms_channel = await send_otp_sms_or_telegram(admin.phone or "", otp_code)

    db.add(
        NotificationLog(
            channel="EMAIL",
            recipient=admin.email or settings.admin_notify_email,
            subject="Admin Login OTP",
            body=f"OTP code generated for {admin.email}",
            status="SENT" if email_ok else "FAILED",
        )
    )
    if sms_ok:
        db.add(
            NotificationLog(
                channel=sms_channel,
                recipient=admin.phone or "",
                subject="Admin Login OTP",
                body="OTP dispatched via gateway",
                status="SENT",
            )
        )
    db.commit()

    return {
        "success": True,
        "maskedMobile": _mask_phone(admin.phone),
        "rawPhone": admin.phone,
        "emailSent": email_ok,
        "emailStatus": email_status,
        "smsSent": sms_ok,
        "message": "6-digit security code dispatched.",
    }


@router.post("/admin-otp/verify")
def verify_admin_otp(payload: OtpVerifyRequest, response: Response, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.isActive == True).first()
    if not admin:
        return {"success": False, "message": "Account not found."}

    now = datetime.now(timezone.utc)
    if admin.otpAttempts >= 5:
        return {"success": False, "message": "Too many wrong OTP attempts. Request a new code."}

    if not admin.otpExpiresAt or admin.otpExpiresAt.replace(tzinfo=timezone.utc) < now:
        return {"success": False, "message": "OTP expired. Please request a new code."}

    if not verify_otp_hash(payload.otp.strip(), admin.otpHash):
        admin.otpAttempts = (admin.otpAttempts or 0) + 1
        db.commit()
        return {"success": False, "message": "Incorrect 6-digit OTP code."}

    admin.otpHash = None
    admin.otpExpiresAt = None
    admin.otpAttempts = 0
    admin.lastLoginAt = now
    db.commit()

    token = create_access_token(admin.id, admin.email, admin.role, admin.name)
    _set_session_cookie(response, token)
    return {
        "success": True,
        "token": token,
        "user": {"id": admin.id, "email": admin.email, "name": admin.name, "role": admin.role},
    }


@router.get("/admin-security-questions")
def get_security_questions(email: str = Query(...), db: Session = Depends(get_db)):
    clean_email = email.strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.email == clean_email, AdminUser.isActive == True).first()
    if not admin:
        return {"success": False, "message": "Administrator account not found for this email."}

    return {
        "success": True,
        "question1": admin.securityQuestion1 or "What is your primary flower shop location?",
        "question2": admin.securityQuestion2 or "What is your business registered brand name?",
    }


@router.post("/admin-security-questions")
def verify_security_questions(
    payload: SecurityQuestionsVerifyRequest, response: Response, db: Session = Depends(get_db)
):
    clean_email = payload.email.strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.email == clean_email, AdminUser.isActive == True).first()
    if not admin:
        return {"success": False, "message": "Administrator account not found."}

    if (admin.failedAttempts or 0) >= 10:
        return {"success": False, "message": "Too many failed attempts. Please try again later."}

    ok1 = verify_security_answer(payload.answer1, admin.securityAnswer1Hash)
    ok2 = verify_security_answer(payload.answer2, admin.securityAnswer2Hash)

    if not ok1 or not ok2:
        admin.failedAttempts = (admin.failedAttempts or 0) + 1
        db.commit()
        return {"success": False, "message": "Incorrect security answer(s). Please check and try again."}

    admin.failedAttempts = 0
    admin.lastLoginAt = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(admin.id, admin.email, admin.role, admin.name)
    _set_session_cookie(response, token)
    return {
        "success": True,
        "token": token,
        "message": "Security questions verified successfully! Access granted.",
        "user": {"id": admin.id, "email": admin.email, "name": admin.name, "role": admin.role},
    }
