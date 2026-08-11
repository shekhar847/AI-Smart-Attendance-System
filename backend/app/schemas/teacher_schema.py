from pydantic import BaseModel, EmailStr


class Teacher(BaseModel):
    name: str
    email: EmailStr
    employee_id: str
    department: str
    designation: str

    class Config:
        from_attributes = True