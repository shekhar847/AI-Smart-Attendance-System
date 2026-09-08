import os
import asyncio
import logging
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.database import Base, engine, SessionLocal
from app.config.db_migration import migrate_db

logger = logging.getLogger("uvicorn")

# =========================================================
# CREATE UPLOAD DIRECTORIES & RUN DB MIGRATIONS
# =========================================================

os.makedirs("uploads/students", exist_ok=True)
os.makedirs("uploads/temp", exist_ok=True)

import app.models  # Register all SQLAlchemy models in Base.metadata

Base.metadata.create_all(bind=engine)
migrate_db()

# Auto-seed admins
try:
    from app.models.admin_model import Admin
    from app.services.auth_service import hash_password
    db = SessionLocal()
    if not db.query(Admin).first():
        print("[INFO] No admins found, seeding default admins...")
        admins_to_seed = [
            {"name": "Administrator", "email": "admin@gmail.com", "password": "admin123"},
            {"name": "Shekhar", "email": "shekhar32542@gmail.com", "password": "admin123"},
        ]
        for data in admins_to_seed:
            admin = Admin(
                name=data["name"],
                email=data["email"],
                password=hash_password(data["password"])
            )
            db.add(admin)
        db.commit()
    db.close()
except Exception as e:
    print(f"[WARNING] Failed to auto-seed admins: {e}")


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
from app.routes.alert_routes import router as alert_router

from app.routes import report_filter_route
from app.routes import monthly_report_route
from app.routes import best_student_route

from app.routes.cameras_routes import router as camera_router
from app.routes.notification_routes import router as notification_router

from app.services.alert_service import get_or_create_settings, check_and_trigger_absent_alerts


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Smart Attendance API",
    version="1.0.0",
    description="Backend API for AI Smart Attendance System"
)


# =========================================================
# BACKGROUND SCHEDULER FOR PARENT ALERTS AT CUTOFF TIME
# =========================================================

async def automated_cutoff_alert_scheduler():
    """
    Background worker that runs continuously and checks if local time matches configured cutoff time (e.g. 09:00).
    When matched, triggers automated parent SMS / WhatsApp alerts for absent students.
    """
    logger.info("[SCHEDULER] Automated Parent Alert Scheduler started.")
    last_triggered_date = None

    while True:
        try:
            now = datetime.now()
            today_date = now.date()
            current_time_str = now.strftime("%H:%M")

            if last_triggered_date != today_date:
                db = SessionLocal()
                try:
                    setting = get_or_create_settings(db)
                    if setting.enabled and setting.cutoff_time == current_time_str:
                        logger.info(f"[SCHEDULER] Cutoff time {current_time_str} reached! Triggering automated parent alerts...")
                        result = await check_and_trigger_absent_alerts(db)
                        logger.info(f"[SCHEDULER] Alert Trigger Result: {result}")
                        last_triggered_date = today_date
                except Exception as ex:
                    logger.error(f"[SCHEDULER ERROR] Failed to check/trigger parent alerts: {ex}")
                finally:
                    db.close()
        except Exception as e:
            logger.error(f"[SCHEDULER LOOP ERROR] {e}")

        await asyncio.sleep(45)  # Check every 45 seconds


@app.on_event("startup")
async def on_startup():
    asyncio.create_task(automated_cutoff_alert_scheduler())


# =========================================================
# CORS
# =========================================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://ai-smart-attendance-system-iota.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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
from app.routes.admin_route import router as admin_router
from app.routes.alert_routes import router as alert_router
from app.routes.behavioral_routes import router as behavioral_router

app.include_router(report_filter_route.router)
app.include_router(monthly_report_route.router)
app.include_router(best_student_route.router)

app.include_router(camera_router)
app.include_router(notification_router)
app.include_router(behavioral_router)


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