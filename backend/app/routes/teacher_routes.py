from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.teacher_model import Teacher
from app.schemas.teacher_schema import Teacher as TeacherSchema

router = APIRouter(
    prefix="/teachers",
    tags=["Teachers"]
)


@router.get("/")
def get_teachers(db: Session = Depends(get_db)):
    return db.query(Teacher).all()


@router.post("/")
def add_teacher(teacher: TeacherSchema, db: Session = Depends(get_db)):

    existing_email = db.query(Teacher).filter(
        Teacher.email == teacher.email
    ).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    existing_id = db.query(Teacher).filter(
        Teacher.employee_id == teacher.employee_id
    ).first()

    if existing_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    new_teacher = Teacher(
        name=teacher.name,
        email=teacher.email,
        employee_id=teacher.employee_id,
        department=teacher.department,
        designation=teacher.designation
    )

    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)

    return {
        "message": "Teacher Added Successfully",
        "id": new_teacher.id
    }


@router.put("/{teacher_id}")
def update_teacher(
    teacher_id: int,
    teacher: TeacherSchema,
    db: Session = Depends(get_db)
):

    existing_teacher = db.query(Teacher).filter(
        Teacher.id == teacher_id
    ).first()

    if not existing_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    existing_teacher.name = teacher.name
    existing_teacher.email = teacher.email
    existing_teacher.employee_id = teacher.employee_id
    existing_teacher.department = teacher.department
    existing_teacher.designation = teacher.designation

    db.commit()
    db.refresh(existing_teacher)

    return {
        "message": "Teacher Updated Successfully",
        "teacher": existing_teacher
    }


@router.delete("/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db)
):

    teacher = db.query(Teacher).filter(
        Teacher.id == teacher_id
    ).first()

    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    db.delete(teacher)
    db.commit()

    return {
        "message": "Teacher Deleted Successfully"
    }


@router.get("/{teacher_id}")
def get_teacher(
    teacher_id: int,
    db: Session = Depends(get_db)
):

    teacher = db.query(Teacher).filter(
        Teacher.id == teacher_id
    ).first()

    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    return teacher