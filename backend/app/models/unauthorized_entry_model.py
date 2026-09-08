from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from app.config.database import Base
from datetime import datetime

class UnauthorizedEntry(Base):
    __tablename__ = "unauthorized_entries"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
