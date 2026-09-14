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
            return {"error": "no_face"}

        encoding = encodings[0]
        return json.dumps(encoding.tolist())

    except Exception as e:
        print("Face Encoding Error :", e)
        return None


# ======================================================
# Recognize Face During Attendance
# ======================================================

def recognize_face(image_path: str, db_or_students):

    try:
        image = face_recognition.load_image_file(image_path)

        unknown_encodings = face_recognition.face_encodings(image)

        if len(unknown_encodings) == 0:
            print("[Face Engine] No face detected in webcam frame.")
            return None

        unknown_encoding = unknown_encodings[0]

        if isinstance(db_or_students, list):
            students = db_or_students
        else:
            students = db_or_students.query(Student).all()

        for student in students:

            if not student.face_encoding:
                continue
                
            parsed_encodings = json.loads(student.face_encoding)
            
            # Legacy: single encoding (1D list) or New: multiple encodings (2D list)
            if len(parsed_encodings) > 0 and not isinstance(parsed_encodings[0], list):
                known_encodings = [np.array(parsed_encodings)]
            else:
                known_encodings = [np.array(e) for e in parsed_encodings]

            matched = face_recognition.compare_faces(
                known_encodings,
                unknown_encoding,
                tolerance=0.6
            )

            if any(matched):
                print(f"[RECOGNITION SUCCESS] Matched Student: {student.name} (Roll: {student.roll})")
                return {"student": student, "emotion_status": "Neutral"}

        print("[Face Engine] Face did not match any registered student encodings.")
        return None

    except Exception as e:
        print("Face Recognition Error :", e)
        return None