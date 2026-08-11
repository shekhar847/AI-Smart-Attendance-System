from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.config.database import get_db
from app.models.student_model import Student
from app.models.attendance_model import Attendance

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/best-student")
def best_student(db: Session = Depends(get_db)):

    result = (
        db.query(
            Student.id,
            Student.name,
            Student.roll,
            Student.department,
            Student.year,
            Student.photo,
            func.count(Attendance.id).label("present"),
        )
        .join(
            Attendance,
            Student.id == Attendance.student_id
        )
        .group_by(Student.id)
        .order_by(func.count(Attendance.id).desc())
        .first()
    )

    if not result:
        return {}

    return {
        "id": result.id,
        "name": result.name,
        "roll": result.roll,
        "department": result.department,
        "year": result.year,
        "photo": result.photo,
        "present": result.present,
    }