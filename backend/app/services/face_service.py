import json
import numpy as np

from sqlalchemy.orm import Session
from app.models.student_model import Student


# ======================================================
# Generate Face Encoding During Student Registration
# ======================================================

def generate_face_encoding(image_path: str):

    try:
        import face_recognition
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            return {"error": "no_face"}

        encoding = encodings[0]
        return json.dumps(encoding.tolist())

    except ImportError:
        print("[Face Engine Notice] face_recognition not installed on host. Storing photo without encoding.")
        return None
    except Exception as e:
        print("Face Encoding Error :", e)
        return None


# ======================================================
# Recognize Face During Attendance
# ======================================================

def recognize_face(image_path: str, db_or_students, tolerance: float = 0.6):

    try:
        import face_recognition
        image = face_recognition.load_image_file(image_path)

        unknown_encodings = face_recognition.face_encodings(image)

        if len(unknown_encodings) == 0:
            # Fallback: try detecting face locations first
            face_locs = face_recognition.face_locations(image)
            if face_locs:
                unknown_encodings = face_recognition.face_encodings(image, known_face_locations=face_locs)

        if len(unknown_encodings) == 0:
            print("[Face Engine] No face detected in webcam frame.")
            return None

        unknown_encoding = unknown_encodings[0]

        if isinstance(db_or_students, list):
            students = db_or_students
        else:
            students = db_or_students.query(Student).all()

        best_student = None
        best_distance = 1.0

        for student in students:
            if not student.face_encoding:
                continue

            try:
                known_encoding = np.array(json.loads(student.face_encoding))
                dist = float(face_recognition.face_distance([known_encoding], unknown_encoding)[0])
                print(f"[Face Engine] Comparing with {student.name} (Roll: {student.roll}) -> Distance: {dist:.4f}")

                if dist < best_distance:
                    best_distance = dist
                    best_student = student
            except Exception as parse_err:
                print(f"[Face Engine Error] Failed to parse encoding for student {student.id}:", parse_err)

        if best_student and best_distance <= tolerance:
            print(f"[RECOGNITION SUCCESS] Matched Student: {best_student.name} (Roll: {best_student.roll}) with distance: {best_distance:.4f}")
            return {"student": best_student, "emotion_status": "Neutral"}

        print(f"[Face Engine] Face did not match any registered student encodings (Best distance: {best_distance:.4f}, tolerance: {tolerance}).")
        return None

    except Exception as e:
        print("Face Recognition Error :", e)
        return None