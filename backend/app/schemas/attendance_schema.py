from pydantic import BaseModel
from datetime import date, time
from typing import Optional


class Attendance(BaseModel):
    student_id: int
    date: date
    time: time
    status: str
    emotion_status: Optional[str] = "Neutral"
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    is_location_verified: Optional[int] = 0

    class Config:
        from_attributes = True