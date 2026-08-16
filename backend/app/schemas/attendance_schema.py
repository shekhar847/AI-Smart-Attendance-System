from pydantic import BaseModel
from datetime import date, time


class Attendance(BaseModel):
    student_id: int
    date: date
    time: time
    status: str

    class Config:
        from_attributes = True