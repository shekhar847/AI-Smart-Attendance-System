from pydantic import BaseModel
from typing import Optional

class CameraBase(BaseModel):
    camera_name: str
    camera_url: str
    location: str
    status: Optional[str] = "Active"

class CameraCreate(CameraBase):
    pass

class CameraUpdate(BaseModel):
    camera_name: Optional[str] = None
    camera_url: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None

class CameraOut(CameraBase):
    id: int

    class Config:
        from_attributes = True  # Agar Pydantic V1 use kar rahe hain toh 'orm_mode = True' likhein