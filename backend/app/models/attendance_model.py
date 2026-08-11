from sqlalchemy import Column, Integer, Date, Time, String, ForeignKey
from app.config.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    date = Column(Date)

    time = Column(Time)

    status = Column(
        String(20),
        default="Present"
    )