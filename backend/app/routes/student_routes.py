from fastapi import UploadFile, File
import shutil
import os
import json
try:
    import face_recognition
except ImportError:
    face_recognition = None

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.student_model import Student
from app.schemas.student_schema import Student as StudentSchema
from app.models.attendance_model import Attendance


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


# ==========================
# GET ALL STUDENTS
# ==========================
@router.get("/")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()


# ==========================
# ADD STUDENT
# ==========================
@router.post("/")
def add_student(student: StudentSchema, db: Session = Depends(get_db)):

    # Check duplicate email
    existing_email = db.query(Student).filter(Student.email == student.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Check duplicate roll
    existing_roll = db.query(Student).filter(Student.roll == student.roll).first()
    if existing_roll:
        raise HTTPException(status_code=400, detail="Roll number already exists")

    new_student = Student(
        name=student.name,
        email=student.email,
        roll=student.roll,
        department=student.department,
        year=student.year
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Student Added Successfully",
        "id": new_student.id
    }


# ==========================
# UPDATE STUDENT
# ==========================
@router.put("/{student_id}")
def update_student(
    student_id: int,
    student: StudentSchema,
    db: Session = Depends(get_db)
):

    existing_student = db.query(Student).filter(Student.id == student_id).first()

    if not existing_student:
        raise HTTPException(status_code=404, detail="Student not found")

    existing_student.name = student.name
    existing_student.email = student.email
    existing_student.roll = student.roll
    existing_student.department = student.department
    existing_student.year = student.year

    db.commit()
    db.refresh(existing_student)

    return {
        "message": "Student Updated Successfully",
        "student": existing_student
    }


# ==========================
# DELETE STUDENT
# ==========================
@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()

    return {
        "message": "Student Deleted Successfully"
    }


# ==========================
# GET SINGLE STUDENT
# ==========================
@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student

# ==========================
# UPLOAD STUDENT PHOTO
# ==========================
@router.post("/{student_id}/upload-photo")
def upload_student_photo(
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    os.makedirs("uploads/students", exist_ok=True)

    filename = f"{student.roll}_{file.filename}"
    filepath = os.path.join("uploads/students", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if face_recognition is None:
        student.photo = filepath
        db.commit()
        return {
            "message": "Photo uploaded successfully",
            "photo": filepath
        }

    image = face_recognition.load_image_file(filepath)

    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        os.remove(filepath)

        raise HTTPException(
            status_code=400,
            detail="No face detected in image"
        )

    student.photo = filepath
    student.face_encoding = json.dumps(
        encodings[0].tolist()
    )

    db.commit()

    return {
        "message": "Photo uploaded and face encoding saved successfully",
        "photo": filepath
    }
    
    # =====================================
# STUDENT ATTENDANCE HISTORY
# =====================================

@router.get("/{student_id}/attendance")
def student_attendance_history(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    history = (
        db.query(Attendance)
        .filter(
            Attendance.student_id == student_id
        )
        .order_by(
            Attendance.date.desc(),
            Attendance.time.desc()
        )
        .all()
    )

    total = len(history)

    present = len([
        x for x in history
        if x.status == "Present"
    ])

    percentage = 0

    if total > 0:
        percentage = round(
            (present / total) * 100,
            2
        )

    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "roll": student.roll,
            "department": student.department,
            "year": student.year,
            "photo": student.photo
        },
        "summary": {
            "total_classes": total,
            "present": present,
            "attendance_percentage": percentage
        },
        "history": history
    }