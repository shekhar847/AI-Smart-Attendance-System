from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.alert_model import AlertSetting, AlertLog
from app.schemas.alert_schema import AlertSettingSchema, TestAlertSchema, AlertLogResponse
from app.services.alert_service import (
    get_or_create_settings,
    check_and_trigger_absent_alerts,
    send_message
)
from app.services.rbac_service import get_current_user, require_roles

router = APIRouter(
    prefix="/alerts",
    tags=["Parent Alerts"]
)


@router.get("/settings", response_model=AlertSettingSchema)
def get_alert_settings(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Get automated parent alert configuration settings.
    """
    return get_or_create_settings(db)


@router.put("/settings", response_model=AlertSettingSchema)
def update_alert_settings(
    data: AlertSettingSchema,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles(["admin"]))
):
    """
    Update automated parent alert settings (Cutoff time, channel, API keys, template).
    Admin only.
    """
    setting = get_or_create_settings(db)
    
    setting.enabled = data.enabled
    setting.cutoff_time = data.cutoff_time.strip()
    setting.provider = data.provider.strip().lower()
    setting.account_sid = data.account_sid.strip() if data.account_sid else None
    setting.auth_token = data.auth_token.strip() if data.auth_token else None
    setting.from_number = data.from_number.strip() if data.from_number else None
    setting.api_key = data.api_key.strip() if data.api_key else None
    setting.message_template = data.message_template.strip()

    db.commit()
    db.refresh(setting)
    return setting


@router.post("/trigger-now")
async def trigger_alerts_now(
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles(["admin", "teacher"]))
):
    """
    Manually check for absent students and dispatch parent SMS/WhatsApp alerts immediately.
    """
    result = await check_and_trigger_absent_alerts(db)
    return result


@router.post("/test")
async def test_send_alert(
    data: TestAlertSchema,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles(["admin"]))
):
    """
    Dispatch a test SMS / WhatsApp message to a specific phone number.
    Admin only.
    """
    setting = get_or_create_settings(db)
    msg = data.message or f"Test message from AI Smart Attendance System sent via {data.channel.upper()}."
    
    status_str, info = await send_message(data.phone, msg, data.channel, setting)
    
    return {
        "status": status_str,
        "detail": info,
        "phone": data.phone,
        "channel": data.channel,
        "message": msg
    }


@router.get("/logs", response_model=List[AlertLogResponse])
def get_alert_logs(
    student_id: int = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Fetch history of sent SMS / WhatsApp parent alerts.
    If logged in as student, filters strictly to student's own alerts.
    """
    query = db.query(AlertLog)

    # Scoping for student role
    if user.get("role") == "student" and user.get("student_id"):
        query = query.filter(AlertLog.student_id == user.get("student_id"))
    elif student_id:
        query = query.filter(AlertLog.student_id == student_id)

    logs = query.order_by(AlertLog.sent_at.desc()).limit(limit).all()
    return logs
