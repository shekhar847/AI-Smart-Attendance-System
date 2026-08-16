from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.admin_model import Admin
from app.schemas.admin_schema import ChangePasswordSchema
from app.services.auth_service import (
    verify_password,
    hash_password,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.put("/change-password")
def change_password(
    data: ChangePasswordSchema,
    db: Session = Depends(get_db),
):

    admin = (
        db.query(Admin)
        .filter(Admin.email == data.email)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )

    if not verify_password(
        data.current_password,
        admin.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    admin.password = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message": "Password Changed Successfully"
    }