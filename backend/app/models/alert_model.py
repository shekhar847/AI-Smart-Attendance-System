from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from datetime import datetime
from app.config.database import Base


class AlertSetting(Base):
    __tablename__ = "alert_settings"

    id = Column(Integer, primary_key=True, index=True)
    enabled = Column(Boolean, default=True)
    cutoff_time = Column(String(10), default="09:00")  # e.g. "09:00"
    provider = Column(String(50), default="mock")  # "whatsapp", "sms", "mock"
    
    # Twilio / Provider configuration fields
    account_sid = Column(String(255), nullable=True)
    auth_token = Column(String(255), nullable=True)
    from_number = Column(String(50), nullable=True)  # e.g. "+14155238886" or "whatsapp:+14155238886"
    api_key = Column(String(255), nullable=True)
    
    message_template = Column(
        Text,
        default="Dear Parent, your child {student_name} (Roll: {roll}) is marked ABSENT today ({date}). Please contact administration if unexpected."
    )


class AlertLog(Base):
    __tablename__ = "alert_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    student_name = Column(String(100), nullable=False)
    roll = Column(String(50), nullable=True)
    parent_phone = Column(String(50), nullable=False)
    channel = Column(String(50), default="mock")  # "whatsapp", "sms", "mock"
    status = Column(String(50), default="SENT")  # "SENT", "FAILED", "SIMULATED"
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow, nullable=False)
