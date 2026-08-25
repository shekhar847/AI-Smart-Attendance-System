from pydantic import BaseModel, EmailStr
from typing import Optional


class Teacher(BaseModel):
    name: str
    email: EmailStr
    employee_id: str
    department: str
    designation: str
    password: Optional[str] = None

    class Config:
        from_attributes = True