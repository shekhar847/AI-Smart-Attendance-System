from pydantic import BaseModel, EmailStr


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordSchema(BaseModel):
    email: EmailStr
    current_password: str
    new_password: str


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    email: EmailStr
    reset_token: str
    new_password: str