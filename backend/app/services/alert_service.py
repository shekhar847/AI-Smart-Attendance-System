import logging
from datetime import datetime, date
import httpx

from sqlalchemy.orm import Session
from app.models.student_model import Student
from app.models.attendance_model import Attendance
from app.models.notification_model import Notification
from app.models.alert_model import AlertSetting, AlertLog

logger = logging.getLogger("uvicorn")


def get_or_create_settings(db: Session) -> AlertSetting:
    setting = db.query(AlertSetting).first()
    if not setting:
        setting = AlertSetting(
            enabled=True,
            cutoff_time="09:00",
            provider="mock",
            message_template="Dear Parent, your child {student_name} (Roll: {roll}) is marked ABSENT today ({date}). Please contact administration if unexpected."
        )
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting


async def send_message(phone: str, message: str, provider: str, settings: AlertSetting) -> tuple[str, str]:
    """
    Sends SMS or WhatsApp message using Twilio or Mock simulator.
    Returns tuple: (status, info_message)
    """
    if not phone or phone.strip() == "":
        return ("FAILED", "No parent phone number provided")

    phone_clean = phone.strip()

    # Twilio SMS / WhatsApp dispatch logic
    if provider in ["whatsapp", "sms"] and settings.account_sid and settings.auth_token and settings.from_number:
        try:
            account_sid = settings.account_sid.strip()
            auth_token = settings.auth_token.strip()
            from_num = settings.from_number.strip()
            
            # Format phone numbers for Twilio WhatsApp if needed
            to_num = phone_clean
            if provider == "whatsapp":
                if not from_num.startswith("whatsapp:"):
                    from_num = f"whatsapp:{from_num}"
                if not to_num.startswith("whatsapp:"):
                    to_num = f"whatsapp:{to_num}"

            twilio_url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
            
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    twilio_url,
                    data={"From": from_num, "To": to_num, "Body": message},
                    auth=(account_sid, auth_token),
                    timeout=10.0
                )
                if resp.status_code in [200, 201]:
                    logger.info(f"[ALERT SERVICE] Successfully sent {provider.upper()} to {phone_clean}")
                    return ("SENT", "Message sent via Twilio API")
                else:
                    err_msg = f"Twilio API Error ({resp.status_code}): {resp.text}"
                    logger.error(f"[ALERT SERVICE] {err_msg}")
                    return ("FAILED", err_msg)
        except Exception as e:
            err_msg = f"Network or API Error: {str(e)}"
            logger.error(f"[ALERT SERVICE] {err_msg}")
            return ("FAILED", err_msg)

    # Simulated Mock Provider Fallback
    logger.info(f"[SIMULATED {provider.upper()} ALERT] Sent to {phone_clean}: {message}")
    return ("SIMULATED", f"Simulated {provider.upper()} alert recorded successfully (Mock Mode)")


async def check_and_trigger_absent_alerts(db: Session, target_date: date = None) -> dict:
    """
    Checks attendance records for target_date (default today).
    Identifies absent students or students with no attendance record, and sends parent alerts.
    """
    if target_date is None:
        target_date = date.today()

    settings = get_or_create_settings(db)
    if not settings.enabled:
        return {"status": "skipped", "reason": "Automated Parent Alerts are currently disabled in settings"}

    date_str = target_date.strftime("%d-%b-%Y")
    
    # 1. Fetch all students
    all_students = db.query(Student).all()
    if not all_students:
        return {"status": "success", "alerts_sent": 0, "message": "No registered students found"}

    # 2. Fetch today's present attendance records
    today_records = db.query(Attendance).filter(Attendance.date == target_date).all()
    present_student_ids = {rec.student_id for rec in today_records if rec.status in ["Present", "P"]}

    sent_count = 0
    skipped_count = 0
    failed_count = 0

    for student in all_students:
        # Check if student is absent (not in present records or status is Absent)
        if student.id in present_student_ids:
            continue  # Present today, skip

        # Check if parent phone is present
        parent_phone = student.parent_phone or student.phone if hasattr(student, "phone") else ""
        if not parent_phone:
            parent_phone = "+919876543210"  # Default sample parent phone for demonstration

        # Check for duplicate alert today
        existing_log = db.query(AlertLog).filter(
            AlertLog.student_id == student.id,
            AlertLog.sent_at >= datetime.combine(target_date, datetime.min.time())
        ).first()

        if existing_log and existing_log.status in ["SENT", "SIMULATED"]:
            skipped_count += 1
            continue

        # Format message template
        parent_name = student.parent_name or "Parent/Guardian"
        message_body = settings.message_template.format(
            student_name=student.name,
            roll=student.roll,
            date=date_str,
            parent_name=parent_name,
            cutoff_time=settings.cutoff_time
        )

        status, info = await send_message(parent_phone, message_body, settings.provider, settings)

        # Log alert record
        alert_log = AlertLog(
            student_id=student.id,
            student_name=student.name,
            roll=student.roll,
            parent_phone=parent_phone,
            channel=settings.provider,
            status=status,
            message=message_body,
            sent_at=datetime.utcnow()
        )
        db.add(alert_log)

        # Create system notification for dashboard
        notif = Notification(
            title=f"Parent Alert ({student.name})",
            message=f"Absent alert ({settings.provider.upper()}) dispatched for {student.name} (Roll: {student.roll}) to parent ({parent_phone}). Status: {status}",
            type="alert"
        )
        db.add(notif)
        
        if status in ["SENT", "SIMULATED"]:
            sent_count += 1
        else:
            failed_count += 1

    db.commit()

    return {
        "status": "success",
        "date": date_str,
        "total_absent_detected": len(all_students) - len(present_student_ids),
        "alerts_sent": sent_count,
        "skipped_already_sent": skipped_count,
        "failed": failed_count
    }
