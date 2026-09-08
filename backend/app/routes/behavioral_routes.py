from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.unauthorized_entry_model import UnauthorizedEntry

router = APIRouter(
    prefix="/behavioral",
    tags=["Behavioral Analytics"]
)

@router.get("/unauthorized")
def get_unauthorized_entries(db: Session = Depends(get_db)):
    return db.query(UnauthorizedEntry).order_by(UnauthorizedEntry.timestamp.desc()).all()
