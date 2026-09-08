from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UnauthorizedEntryBase(BaseModel):
    camera_id: Optional[int] = None
    image_path: Optional[str] = None
    notes: Optional[str] = None

class UnauthorizedEntryCreate(UnauthorizedEntryBase):
    pass

class UnauthorizedEntry(UnauthorizedEntryBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
