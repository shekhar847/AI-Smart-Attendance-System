import json
import os
import httpx


AI_SERVICE_URL = os.getenv(
    "AI_SERVICE_URL",
    "http://localhost:5000"
)


def generate_face_encoding(image_path):
    """
    Generate face encoding using the AI microservice.
    Returns JSON string or None.
    """

    try:
        with open(image_path, "rb") as image_file:

            response = httpx.post(
                f"{AI_SERVICE_URL}/extract-encoding",
                files={
                    "file": (
                        os.path.basename(image_path),
                        image_file,
                        "image/jpeg"
                    )
                },
                timeout=60.0
            )

        if response.status_code != 200:
            print(
                "AI Service Encoding Error:",
                response.status_code,
                response.text
            )
            return None

        data = response.json()

        encoding = data.get("face_encoding")

        if not encoding:
            return None

        return json.dumps(encoding)

    except Exception as e:
        print("AI Service Connection Error:", e)
        return None


def recognize_face(image_path, students):
    """
    Recognize a face using the AI microservice.

    students:
        SQLAlchemy Student objects containing:
        id, name, roll, face_encoding
    """

    try:

        known_students = []

        for student in students:

            if not student.face_encoding:
                continue

            known_students.append({
                "id": student.id,
                "student_id": student.id,
                "name": student.name,
                "roll": student.roll,
                "face_encoding": student.face_encoding
            })

        if not known_students:
            print("No students with face encodings found.")
            return None

        known_students_json = json.dumps(known_students)

        with open(image_path, "rb") as image_file:

            response = httpx.post(
                f"{AI_SERVICE_URL}/recognize-face",
                files={
                    "file": (
                        os.path.basename(image_path),
                        image_file,
                        "image/jpeg"
                    )
                },
                data={
                    "known_students_json": known_students_json,
                    "tolerance": "0.5"
                },
                timeout=60.0
            )

        if response.status_code not in (200, 400):
            print(
                "AI Service Recognition Error:",
                response.status_code,
                response.text
            )
            return None

        data = response.json()

        if not data.get("matched"):
            print(
                "Face not matched:",
                data.get("detail")
            )
            return None

        matched_id = data.get("student_id")

        if not matched_id:
            return None

        for student in students:
            if student.id == matched_id:
                return student

        return None

    except httpx.ConnectError:
        print("[AI Microservice Notice] AI Service is not running on", AI_SERVICE_URL)
        print("[Fallback] Running local face recognition engine...")
        try:
            from app.services.face_service import recognize_face as local_recognize_face
            return local_recognize_face(image_path, students)
        except Exception as fallback_err:
            print("Local fallback face recognition error:", fallback_err)
            return None
    except Exception as e:
        print("AI Face Recognition Error:", e)
        return None


