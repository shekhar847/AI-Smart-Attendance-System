from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict

from app.config.database import get_db, engine
from app.models.attendance_model import Attendance

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/monthly")
def monthly_report(db: Session = Depends(get_db)):
    dialect = engine.dialect.name
    
    if dialect == "mysql":
        data = (
            db.query(
                func.date_format(
                    Attendance.date,
                    "%Y-%m"
                ).label("month"),
                func.count().label("present")
            )
            .group_by(
                func.date_format(
                    Attendance.date,
                    "%Y-%m"
                )
            )
            .order_by(
                func.date_format(
                    Attendance.date,
                    "%Y-%m"
                )
            )
            .all()
        )
        return [
            {
                "month": item.month,
                "present": item.present
            }
            for item in data
        ]
    else:
        # Cross-database / SQLite compatible approach
        records = db.query(Attendance.date).all()
        counts = defaultdict(int)
        for rec in records:
            if rec.date:
                month_str = rec.date.strftime("%Y-%m") if hasattr(rec.date, "strftime") else str(rec.date)[:7]
                counts[month_str] += 1
        
        sorted_months = sorted(counts.keys())
        return [
            {
                "month": m,
                "present": counts[m]
            }
            for m in sorted_months
        ]