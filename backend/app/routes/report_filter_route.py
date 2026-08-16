from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.config.database import get_db
from app.models.attendance_model import Attendance
from app.models.student_model import Student

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/date-range")
def date_range_report(
    from_date: str,
    to_date: str,
    db: Session = Depends(get_db),
):

    records = (
        db.query(Attendance, Student)
        .join(Student)
        .filter(
            and_(
                Attendance.date >= from_date,
                Attendance.date <= to_date
            )
        )
        .order_by(
            Attendance.date.desc(),
            Attendance.time.desc()
        )
        .all()
    )

    result = []

    for attendance, student in records:

        result.append({
            "student_id": student.id,
            "name": student.name,
            "roll": student.roll,
            "department": student.department,
            "year": student.year,
            "date": attendance.date,
            "time": attendance.time,
            "status": attendance.status
        })

    return result