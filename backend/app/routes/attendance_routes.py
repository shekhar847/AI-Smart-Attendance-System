from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
import os
import shutil

from app.config.database import get_db

from app.models.attendance_model import Attendance
from app.models.student_model import Student

from app.schemas.attendance_schema import Attendance as AttendanceSchema

from app.services.face_recognition_service import recognize_face

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


# ==========================
# GET ALL ATTENDANCE
# ==========================
@router.get("/")
def get_attendance(db: Session = Depends(get_db)):
    return db.query(Attendance).all()


# ==========================
# MANUAL ATTENDANCE
# ==========================
@router.post("/")
def mark_attendance(
    attendance: AttendanceSchema,
    db: Session = Depends(get_db)
):

    new_record = Attendance(
        student_id=attendance.student_id,
        date=attendance.date,
        time=attendance.time,
        status=attendance.status
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return {
        "message": "Attendance Marked Successfully",
        "attendance": new_record
    }


# ==========================
# AI FACE RECOGNITION
# ==========================
@router.post("/recognize")
def recognize_student(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads/temp", exist_ok=True)

    temp_path = os.path.join(
        "uploads/temp",
        file.filename
    )

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    students = db.query(Student).all()

    student = recognize_face(temp_path, students)

    os.remove(temp_path)

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Face not recognized"
        )

    today = datetime.now().date()

    already = db.query(Attendance).filter(
        Attendance.student_id == student.id,
        Attendance.date == today
    ).first()

    if already:
        return {
            "message": "Attendance already marked",
            "student": {
                "id": student.id,
                "name": student.name,
                "roll": student.roll,
                "department": student.department,
                "year": student.year,
                "photo": student.photo
            }
        }

    attendance = Attendance(
        student_id=student.id,
        date=today,
        time=datetime.now().time(),
        status="Present"
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return {
        "message": "Attendance Marked Successfully",
        "attendance_id": attendance.id,
        "student": {
            "id": student.id,
            "name": student.name,
            "roll": student.roll,
            "department": student.department,
            "year": student.year,
            "photo": student.photo
        }
    }