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
from app.utils.geo_utils import haversine
from app.models.unauthorized_entry_model import UnauthorizedEntry
from fastapi import Form
import random

# Mock classroom coordinates (e.g., center of the institute)
CLASSROOM_LAT = 28.6139 
CLASSROOM_LON = 77.2090
ALLOWED_RADIUS_METERS = 50

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
        status=attendance.status,
        emotion_status=attendance.emotion_status,
        latitude=attendance.latitude,
        longitude=attendance.longitude
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
    latitude: str = Form(None),
    longitude: str = Form(None),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads/temp", exist_ok=True)

    filename = file.filename or "captured.jpg"
    temp_path = os.path.join(
        "uploads/temp",
        filename
    )

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        students = db.query(Student).all()

        result = recognize_face(temp_path, students)

        if result is None:
            raise HTTPException(
                status_code=404,
                detail="Face not recognized"
            )

        if "error" in result:
            raise HTTPException(
                status_code=503,
                detail=result["error"]
            )

        if result.get("unauthorized"):
            # Log unauthorized entry
            entry = UnauthorizedEntry(
                image_path=filename,
                notes="Unauthorized face detected during attendance"
            )
            db.add(entry)
            db.commit()
            raise HTTPException(
                status_code=403,
                detail="Unauthorized face detected and logged"
            )
        
        student = result["student"]
        emotion_status = result["emotion_status"]
        
        is_verified = 0
        if latitude and longitude:
            dist = haversine(CLASSROOM_LON, CLASSROOM_LAT, longitude, latitude)
            if dist <= ALLOWED_RADIUS_METERS:
                is_verified = 1

        today = datetime.now().date()
        now_time = datetime.now().time()
        from datetime import time

        # Determine attendance status based on slots
        status = "Present"
        if time(8, 0) <= now_time <= time(11, 0):
            status = "CHECK-IN"
        elif time(16, 0) <= now_time <= time(18, 0):
            status = "CHECK-OUT"

        already = db.query(Attendance).filter(
            Attendance.student_id == student.id,
            Attendance.date == today,
            Attendance.status == status
        ).first()

        if already:
            return {
                "message": f"Attendance already marked for {status}",
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
            time=now_time,
            status=status,
            emotion_status=emotion_status,
            latitude=latitude,
            longitude=longitude,
            is_location_verified=is_location_verified if 'is_location_verified' in locals() else is_verified
        )

        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        return {
            "message": f"Attendance ({status}) Marked Successfully",
            "attendance_id": attendance.id,
            "emotion_status": emotion_status,
            "is_location_verified": bool(is_verified),
            "student": {
                "id": student.id,
                "name": student.name,
                "roll": student.roll,
                "department": student.department,
                "year": student.year,
                "photo": student.photo
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print("[Recognize Endpoint Error]:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Face recognition error: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass