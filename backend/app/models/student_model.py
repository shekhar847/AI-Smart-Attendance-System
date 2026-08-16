from sqlalchemy import Column, Integer, String, Text
from app.config.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))
    email = Column(String(100), unique=True)
    roll = Column(String(50), unique=True)

    department = Column(String(100))
    year = Column(String(20))

    # New Fields
    photo = Column(String(255), nullable=True)
    face_encoding = Column(Text, nullable=True)