from pydantic import BaseModel, EmailStr
from typing import Optional, Any


class Student(BaseModel):
    name: str
    email: EmailStr
    roll: str
    department: str
    year: str

    # Parent & Auth Fields
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    password: Optional[str] = None

    # New Fields
    photo: Optional[Any] = None
    face_encoding: Optional[Any] = None


class StudentResponse(Student):
    id: Optional[int] = None

    class Config:
        from_attributes = True