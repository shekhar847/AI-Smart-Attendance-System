from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.config.database import get_db

from app.models.student_model import Student
from app.models.teacher_model import Teacher
from app.models.attendance_model import Attendance

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(db: Session = Depends(get_db)):

    total_students = db.query(Student).count()

    total_teachers = db.query(Teacher).count()

    today = date.today()

    present_today = db.query(Attendance).filter(
        Attendance.date == today
    ).count()

    absent_today = total_students - present_today

    return {

        "students": total_students,

        "teachers": total_teachers,

        "present": present_today,

        "absent": absent_today

    }