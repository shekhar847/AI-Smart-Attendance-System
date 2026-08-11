from sqlalchemy import Column, Integer, String
from app.config.database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    employee_id = Column(String(50), unique=True)
    department = Column(String(100))
    designation = Column(String(100))