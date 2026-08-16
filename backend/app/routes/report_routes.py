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


# ==========================
# Dashboard Summary
# ==========================
@router.get("/summary")
def attendance_summary(db: Session = Depends(get_db)):

    # Total Students
    total_students = db.query(Student).count()

    # Latest Attendance Date
    latest_date = db.query(
        func.max(Attendance.date)
    ).scalar()

    # No Attendance Found
    if latest_date is None:
        return {
            "total_students": total_students,
            "present": 0,
            "absent": total_students
        }

    # Present Students (Unique)
    total_present = (
        db.query(func.count(func.distinct(Attendance.student_id)))
        .filter(
            Attendance.date == latest_date,
            Attendance.status == "Present"
        )
        .scalar()
    ) or 0

    # Absent Students
    total_absent = max(0, total_students - total_present)

    return {
        "total_students": total_students,
        "present": total_present,
        "absent": total_absent
    }


# ==========================
# Daily Attendance Report
# ==========================
@router.get("/daily")
def daily_report(db: Session = Depends(get_db)):

    report = (
        db.query(
            Attendance.date,
            func.count(
                func.distinct(Attendance.student_id)
            ).label("present")
        )
        .filter(
            Attendance.status == "Present"
        )
        .group_by(
            Attendance.date
        )
        .order_by(
            Attendance.date
        )
        .all()
    )

    return [
        {
            "date": row.date,
            "present": row.present
        }
        for row in report
    ]