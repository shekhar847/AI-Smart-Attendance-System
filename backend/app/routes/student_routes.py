from fastapi import UploadFile, File
import shutil
import os
import json
from app.services.face_recognition_service import generate_face_encoding

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
from app.services.auth_service import hash_password

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

    pwd_hash = hash_password(student.password) if student.password else hash_password(student.roll)

    new_student = Student(
        name=student.name,
        email=student.email,
        roll=student.roll,
        department=student.department,
        year=student.year,
        parent_name=student.parent_name,
        parent_phone=student.parent_phone,
        parent_email=student.parent_email,
        password=pwd_hash
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
    if student.parent_name is not None:
        existing_student.parent_name = student.parent_name
    if student.parent_phone is not None:
        existing_student.parent_phone = student.parent_phone
    if student.parent_email is not None:
        existing_student.parent_email = student.parent_email
    if student.password:
        existing_student.password = hash_password(student.password)

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

    encoding = generate_face_encoding(filepath)

    if isinstance(encoding, dict) and encoding.get("error") == "no_face":
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(
            status_code=400,
            detail="Invalid photo: No face detected. Please upload a clear face photo. Document photos are not accepted."
        )
    elif encoding is None:
        print("[Warning] Face encoding failed or AI service unavailable. Saving photo without encoding.")
        student.photo = filepath
        db.commit()
        return {
            "message": "Photo uploaded successfully (AI Encoding skipped - Service Unavailable)",
            "photo": filepath
        }

    student.photo = filepath
    student.face_encoding = encoding

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

# ==========================
# BULK UPLOAD STUDENTS
# ==========================
import pandas as pd
import io

@router.post("/bulk-upload")
def bulk_upload_students(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not (file.filename.endswith(".csv") or file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .csv or .xlsx file")
        
    contents = file.file.read()
    
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        df.columns = [str(c).strip().lower() for c in df.columns]
        
        required_cols = {"name", "email", "roll", "department", "year"}
        if not required_cols.issubset(set(df.columns)):
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns. Required: {', '.join(required_cols)}"
            )
            
        existing_rolls = {row[0] for row in db.query(Student.roll).all()}
        existing_emails = {row[0] for row in db.query(Student.email).all()}
        
        new_students = []
        skipped = 0
        
        for _, row in df.iterrows():
            name = str(row.get("name", "")).strip()
            email = str(row.get("email", "")).strip()
            roll = str(row.get("roll", "")).strip()
            department = str(row.get("department", "")).strip()
            year = str(row.get("year", "")).strip()
            
            if not (name and email and roll and department and year):
                skipped += 1
                continue
                
            if roll in existing_rolls or email in existing_emails:
                skipped += 1
                continue
                
            pwd_hash = hash_password(roll)
            
            new_student = Student(
                name=name,
                email=email,
                roll=roll,
                department=department,
                year=year,
                password=pwd_hash
            )
            new_students.append(new_student)
            
            existing_rolls.add(roll)
            existing_emails.add(email)
            
        if new_students:
            db.bulk_save_objects(new_students)
            db.commit()
            
        return {
            "message": "Bulk upload completed",
            "added": len(new_students),
            "skipped": skipped
        }
    except HTTPException:
        raise
    except Exception as e:
        print("[Bulk Upload Error]:", e)
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
