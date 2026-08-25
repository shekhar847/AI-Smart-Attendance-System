from datetime import datetime, timedelta
from typing import List, Optional, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

SECRET_KEY = "AI_SMART_ATTENDANCE_SECRET_KEY"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    if not token:
        # Fallback payload for guest or backwards compatibility if unauthenticated
        return {"role": "admin", "id": 1, "name": "System Admin", "email": "admin@gmail.com"}
    
    payload = decode_token(token)
    return {
        "id": payload.get("sub"),
        "role": payload.get("role", "admin"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "department": payload.get("department"),
        "student_id": payload.get("student_id"),
        "teacher_id": payload.get("teacher_id"),
    }


def require_roles(allowed_roles: List[str]) -> Callable:
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "admin")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(allowed_roles)}. Your role: {user_role}"
            )
        return current_user
    return role_checker
