from sqlalchemy import Column, Integer, String

from app.config.database import Base


class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)

    camera_name = Column(String(100), nullable=False)

    camera_url = Column(String(255), nullable=False)

    location = Column(String(100), nullable=False)

    status = Column(String(20), default="Active")