from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.notification_model import Notification


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# =========================================================
# GET ALL NOTIFICATIONS
# =========================================================

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .all()
    )

    return notifications


# =========================================================
# GET UNREAD NOTIFICATIONS
# =========================================================

@router.get("/unread")
def get_unread_notifications(
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification)
        .filter(Notification.read == False)
        .order_by(Notification.created_at.desc())
        .all()
    )

    return notifications


# =========================================================
# CREATE NOTIFICATION
# =========================================================

@router.post("/")
def create_notification(
    title: str,
    message: str,
    type: str = "general",
    db: Session = Depends(get_db)
):

    notification = Notification(
        title=title,
        message=message,
        type=type,
        read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return {
        "message": "Notification created successfully",
        "notification": notification
    }


# =========================================================
# MARK SINGLE NOTIFICATION AS READ
# =========================================================

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.read = True

    db.commit()
    db.refresh(notification)

    return {
        "message": "Notification marked as read",
        "notification": notification
    }


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@router.put("/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db)
):

    notifications = (
        db.query(Notification)
        .filter(Notification.read == False)
        .all()
    )

    for notification in notifications:
        notification.read = True

    db.commit()

    return {
        "message": "All notifications marked as read",
        "updated": len(notifications)
    }


# =========================================================
# DELETE NOTIFICATION
# =========================================================

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    db.delete(notification)
    db.commit()

    return {
        "message": "Notification deleted successfully"
    }