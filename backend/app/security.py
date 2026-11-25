import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Header, Request, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db

SECURITY_ANSWER_SALT = "shivam_full_ghar_security_questions_salt_2026"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False


def normalize_security_answer(answer: str) -> str:
    return " ".join(answer.strip().lower().split())


def hash_security_answer(answer: str) -> str:
    normalized = normalize_security_answer(answer)
    return hashlib.sha256(f"{normalized}:{SECURITY_ANSWER_SALT}".encode("utf-8")).hexdigest()


def verify_security_answer(answer: str, stored_hash: Optional[str]) -> bool:
    if not stored_hash or not answer:
        return False
    expected = hash_security_answer(answer)
    return hmac.compare_digest(expected, stored_hash)


def generate_otp_code() -> str:
    return f"{secrets.randbelow(900000) + 100000}"


def hash_otp(code: str) -> str:
    return hashlib.sha256(f"{code}:{settings.jwt_secret}".encode("utf-8")).hexdigest()


def verify_otp_hash(code: str, otp_hash: Optional[str]) -> bool:
    if not otp_hash or not code:
        return False
    expected = hash_otp(code)
    return hmac.compare_digest(expected, otp_hash)


def create_access_token(user_id: str, email: str, role: str, name: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "name": name,
        "iat": now,
        "exp": now + timedelta(hours=settings.jwt_expire_hours),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except Exception:
        return None


def get_current_admin(
    request: Request,
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
):
    from app.models import AdminUser

    token = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    elif request.cookies.get("sfg_admin_token"):
        token = request.cookies.get("sfg_admin_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token",
        )

    admin = db.query(AdminUser).filter(AdminUser.id == payload["sub"], AdminUser.is_active == True).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrator account not active",
        )
    return admin
