from app.schemas.admin_schema import AdminLogin, ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema
from app.schemas.student_schema import Student
from app.schemas.teacher_schema import Teacher
from app.schemas.attendance_schema import Attendance
from app.schemas.camera_schema import CameraBase, CameraCreate, CameraUpdate, CameraOut

__all__ = [
    "AdminLogin", "ChangePasswordSchema", "ForgotPasswordSchema", "ResetPasswordSchema",
    "Student", "Teacher", "Attendance",
    "CameraBase", "CameraCreate", "CameraUpdate", "CameraOut"
]
