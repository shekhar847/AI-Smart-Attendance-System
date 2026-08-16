from app.config.database import SessionLocal, Base, engine
from app.models.admin_model import Admin
from app.models.student_model import Student
from app.models.teacher_model import Teacher
from app.models.attendance_model import Attendance
from app.models.camera_model import Camera
from app.services.auth_service import hash_password

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

admins_to_seed = [
    {"name": "Administrator", "email": "admin@gmail.com", "password": "admin123"},
    {"name": "Shekhar", "email": "shekhar32542@gmail.com", "password": "admin123"},
]

for data in admins_to_seed:
    existing = db.query(Admin).filter(Admin.email == data["email"]).first()
    if not existing:
        admin = Admin(
            name=data["name"],
            email=data["email"],
            password=hash_password(data["password"])
        )
        db.add(admin)

db.commit()

print("[SUCCESS] Admins Created Successfully")