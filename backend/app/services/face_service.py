"""
Backward compatibility bridge for face service imports.
All core face recognition and encoding functions are consolidated in face_recognition_service.py.
"""
from app.services.face_recognition_service import generate_face_encoding, recognize_face

__all__ = ["generate_face_encoding", "recognize_face"]
