import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt

from app.config.database import get_db
from app.models.admin_model import Admin
from app.schemas.admin_schema import (
    AdminLogin,
    ForgotPasswordSchema,
    ResetPasswordSchema,
)
from app.services.auth_service import verify_password, hash_password

SECRET_KEY = "AI_SMART_ATTENDANCE_SECRET_KEY"
ALGORITHM = "HS256"

# In-memory store for password reset OTP codes
reset_tokens_store = {}

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    admin: AdminLogin,
    db: Session = Depends(get_db)
):

    user = (
        db.query(Admin)
        .filter(Admin.email == admin.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        admin.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    expire = datetime.utcnow() + timedelta(hours=24)

    token = jwt.encode(
        {
            "sub": str(user.id),
            "email": user.email,
            "exp": expire,
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordSchema,
    db: Session = Depends(get_db)
):
    # Generate 6-digit OTP code valid for 15 minutes
    code = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=15)

    reset_tokens_store[data.email.strip().lower()] = {
        "code": code,
        "expires": expires
    }

    return {
        "message": "Password reset code generated successfully",
        "email": data.email,
        "reset_token": code,
        "expires_in_minutes": 15
    }


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordSchema,
    db: Session = Depends(get_db)
):
    email_key = data.email.strip().lower()
    stored_info = reset_tokens_store.get(email_key)

    if not stored_info:
        raise HTTPException(
            status_code=400,
            detail="No reset code requested for this email"
        )

    if datetime.utcnow() > stored_info["expires"]:
        reset_tokens_store.pop(email_key, None)
        raise HTTPException(
            status_code=400,
            detail="Reset code has expired. Please request a new code."
        )

    if stored_info["code"] != data.reset_token.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid reset code. Please check and try again."
        )

    user = db.query(Admin).filter(Admin.email == email_key).first()
    if not user:
        # Create new admin if user does not exist yet
        admin_name = email_key.split("@")[0].capitalize()
        user = Admin(
            name=admin_name,
            email=email_key,
            password=hash_password(data.new_password)
        )
        db.add(user)
    else:
        user.password = hash_password(data.new_password)

    db.commit()

    # Clear code after successful reset
    reset_tokens_store.pop(email_key, None)

    return {
        "message": "Password reset successfully. You can now login with your new password."
    }
