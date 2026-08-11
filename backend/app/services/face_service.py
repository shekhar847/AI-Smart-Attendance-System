import json
import numpy as np
import face_recognition

from sqlalchemy.orm import Session
from app.models.student_model import Student


# ======================================================
# Generate Face Encoding During Student Registration
# ======================================================

def generate_face_encoding(image_path: str):

    try:
        image = face_recognition.load_image_file(image_path)

        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            return None

        encoding = encodings[0]

        return json.dumps(encoding.tolist())

    except Exception as e:
        print("Face Encoding Error :", e)
        return None


# ======================================================
# Recognize Face During Attendance
# ======================================================

def recognize_face(image_path: str, db: Session):

    try:

        image = face_recognition.load_image_file(image_path)

        unknown_encodings = face_recognition.face_encodings(image)

        if len(unknown_encodings) == 0:
            return None

        unknown_encoding = unknown_encodings[0]

        students = db.query(Student).all()

        for student in students:

            if not student.face_encoding:
                continue

            known_encoding = np.array(
                json.loads(student.face_encoding)
            )

            matched = face_recognition.compare_faces(
                [known_encoding],
                unknown_encoding,
                tolerance=0.50
            )

            if matched[0]:
                return student

        return None

    except Exception as e:
        print("Face Recognition Error :", e)
        return None