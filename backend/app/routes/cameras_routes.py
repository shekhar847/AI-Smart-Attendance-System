from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db 
from app.models.camera_model import Camera
from app.schemas.camera_schema import CameraCreate, CameraUpdate, CameraOut

router = APIRouter(
    prefix="/api/cameras",
    tags=["Cameras"]
)

# 1. Create - Naya camera add karne ke liye
@router.post("/", response_model=CameraOut)
def create_camera(camera: CameraCreate, db: Session = Depends(get_db)):
    db_camera = Camera(**camera.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

# 2. Read - Saare cameras dekhne ke liye
@router.get("/", response_model=List[CameraOut])
def get_cameras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Camera).offset(skip).limit(limit).all()

# 3. Update - Camera details edit karne ke liye
@router.put("/{camera_id}", response_model=CameraOut)
def update_camera(camera_id: int, camera_update: CameraUpdate, db: Session = Depends(get_db)):
    db_camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera nahi mila")
    
    update_data = camera_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_camera, key, value)
        
    db.commit()
    db.refresh(db_camera)
    return db_camera

# 4. Delete - Camera remove karne ke liye
@router.delete("/{camera_id}")
def delete_camera(camera_id: int, db: Session = Depends(get_db)):
    db_camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera nahi mila")
    
    db.delete(db_camera)
    db.commit()
    return {"message": "Camera successfully delete ho gaya"}