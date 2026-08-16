import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.database import Base, engine

# =========================================================
# CREATE UPLOAD DIRECTORIES
# =========================================================

os.makedirs("uploads/students", exist_ok=True)
os.makedirs("uploads/temp", exist_ok=True)


# =========================================================
# IMPORT ROUTERS
# =========================================================

from app.routes.student_routes import router as student_router
from app.routes.teacher_routes import router as teacher_router
from app.routes.attendance_routes import router as attendance_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.report_routes import router as report_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_route import router as admin_router

from app.routes import report_filter_route
from app.routes import monthly_report_route
from app.routes import best_student_route

from app.routes.cameras_routes import router as camera_router

from app.models.camera_model import Camera
from app.models.notification_model import Notification
from app.routes.notification_routes import router as notification_router


# =========================================================
# DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Smart Attendance API",
    version="1.0.0",
    description="Backend API for AI Smart Attendance System"
)


# =========================================================
# CORS
# =========================================================

origins = [
    # Local frontend
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",

    # Production frontend - Vercel
    "https://ai-smart-attendance-system-iota.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# INCLUDE ROUTERS
# =========================================================

app.include_router(student_router)
app.include_router(teacher_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)
app.include_router(report_router)
app.include_router(auth_router)
app.include_router(admin_router)

app.include_router(report_filter_route.router)
app.include_router(monthly_report_route.router)
app.include_router(best_student_route.router)

app.include_router(camera_router)
app.include_router(notification_router)


# =========================================================
# SERVE UPLOADED FILES
# =========================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "AI Smart Attendance Backend Running Successfully"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "OK"
    }