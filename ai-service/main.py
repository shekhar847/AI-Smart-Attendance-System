import os
import shutil
import json
import numpy as np
import cv2
import face_recognition
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="AI Attendance Face Recognition Microservice",
    version="1.0.0",
    description="Standalone Microservice for AI Face Detection, Encoding Generation, and Recognition"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_processing"
os.makedirs(TEMP_DIR, exist_ok=True)


class KnownStudentEncoding(BaseModel):
    student_id: int
    name: str
    roll: str
    face_encoding: List[float]


class CompareFaceRequest(BaseModel):
    students: List[KnownStudentEncoding]
    tolerance: Optional[float] = 0.5


@app.get("/")
def root():
    return {
        "service": "AI Face Recognition Microservice",
        "status": "Online",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {"status": "OK"}


@app.post("/extract-encoding")
def extract_encoding(file: UploadFile = File(...)):
    """
    Uploads an image, extracts 128-d face encoding vector, returns vector list.
    """
    temp_path = os.path.join(TEMP_DIR, f"extract_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image = face_recognition.load_image_file(temp_path)
        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected in provided image")

        encoding_vector = encodings[0].tolist()
        return {
            "faces_detected": len(encodings),
            "face_encoding": encoding_vector
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/recognize-face")
def recognize_face(
    file: UploadFile = File(...),
    known_students_json: str = Form(...),
    tolerance: float = Form(0.5)
):
    """
    Compares an uploaded image against a list of known student face encodings.
    """
    temp_path = os.path.join(TEMP_DIR, f"rec_{file.filename}")
    try:
        students_data = json.loads(known_students_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format for known_students_json: {str(e)}")

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image = face_recognition.load_image_file(temp_path)
        unknown_encodings = face_recognition.face_encodings(image)

        if len(unknown_encodings) == 0:
            return {
                "matched": False,
                "detail": "No face detected in image"
            }

        unknown_encoding = unknown_encodings[0]

        for s in students_data:
            encoding_raw = s.get("face_encoding")
            if not encoding_raw:
                continue

            if isinstance(encoding_raw, str):
                known_encoding = json.loads(encoding_raw)
            else:
                known_encoding = encoding_raw

            match = face_recognition.compare_faces(
                [known_encoding],
                unknown_encoding,
                tolerance=tolerance
            )

            if match[0]:
                dist = face_recognition.face_distance([known_encoding], unknown_encoding)[0]
                return {
                    "matched": True,
                    "student_id": s.get("id") or s.get("student_id"),
                    "name": s.get("name"),
                    "roll": s.get("roll"),
                    "confidence": round((1 - dist) * 100, 2)
                }

        return {
            "matched": False,
            "detail": "Face not matched with registered students"
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
