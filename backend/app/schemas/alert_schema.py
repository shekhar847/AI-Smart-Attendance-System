from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlertSettingSchema(BaseModel):
    enabled: bool = True
    cutoff_time: str = "09:00"
    provider: str = "mock"
    account_sid: Optional[str] = None
    auth_token: Optional[str] = None
    from_number: Optional[str] = None
    api_key: Optional[str] = None
    message_template: str = "Dear Parent, your child {student_name} (Roll: {roll}) is marked ABSENT today ({date}). Please contact administration if unexpected."

    class Config:
        from_attributes = True


class TestAlertSchema(BaseModel):
    phone: str
    channel: str = "mock"  # "whatsapp", "sms", "mock"
    message: Optional[str] = None


class AlertLogResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    student_name: str
    roll: Optional[str] = None
    parent_phone: str
    channel: str
    status: str
    message: str
    sent_at: datetime

    class Config:
        from_attributes = True
