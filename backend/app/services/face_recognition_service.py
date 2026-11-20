"""
Face Recognition & Biometric Telemetry Service
High-performance face encoding extraction and Euclidean distance recognition.
"""
import json
import os
import httpx
import numpy as np

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:5000").rstrip("/")


def check_ai_service_online() -> bool:
    """Quick health probe for external AI microservice."""
    try:
        r = httpx.get(f"{AI_SERVICE_URL}/health", timeout=0.3)
        return r.status_code == 200
    except Exception:
        return False


def generate_face_encoding(image_path: str):
    """
    Generate 128-dimensional face metric encoding vector from an image.
    Uses local face_recognition/dlib engine first, falls back to AI microservice.
    Returns JSON string of 128 floats, or {'error': 'no_face'}, or None.
    """
    # 1. Primary: Local face_recognition engine (high-speed, zero network latency)
    try:
        import face_recognition
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if not encodings:
            locs = face_recognition.face_locations(image)
            if locs:
                encodings = face_recognition.face_encodings(image, known_face_locations=locs)

        if not encodings:
            return {"error": "no_face"}

        return json.dumps(encodings[0].tolist())
    except ImportError:
        pass  # Fall through to microservice
    except Exception as e:
        print("[Face Service] Local encoding extraction error:", e)

    # 2. Fallback: External AI microservice
    if check_ai_service_online():
        try:
            with open(image_path, "rb") as img_file:
                resp = httpx.post(
                    f"{AI_SERVICE_URL}/extract-encoding",
                    files={"file": (os.path.basename(image_path), img_file, "image/jpeg")},
                    timeout=httpx.Timeout(4.0, connect=1.5)
                )
            if resp.status_code == 400:
                return {"error": "no_face"}
            if resp.status_code == 200:
                data = resp.json()
                encoding = data.get("face_encoding")
                if encoding:
                    return json.dumps(encoding)
        except Exception as e:
            print("[Face Service] AI microservice encoding error:", e)

    return None


def recognize_face(image_path: str, students, tolerance: float = 0.6):
    """
    Recognize a face against known student database encodings.
    Uses Euclidean distance vector matching (best match below tolerance).
    """
    # 1. Primary: Local face_recognition engine
    try:
        import face_recognition
        image = face_recognition.load_image_file(image_path)
        unknown_encodings = face_recognition.face_encodings(image)

        if not unknown_encodings:
            locs = face_recognition.face_locations(image)
            if locs:
                unknown_encodings = face_recognition.face_encodings(image, known_face_locations=locs)

        if not unknown_encodings:
            print("[Face Engine] No face detected in frame.")
            return None

        unknown_encoding = unknown_encodings[0]

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
            print(f"[RECOGNITION SUCCESS] Matched: {best_student.name} (Roll: {best_student.roll}) with distance: {best_distance:.4f}")
            return {"student": best_student, "emotion_status": "Neutral"}

        print(f"[Face Engine] No match (Best distance: {best_distance:.4f}, tolerance: {tolerance})")
        return None

    except ImportError:
        pass  # Fall through to microservice
    except Exception as e:
        print("[Face Engine] Local recognition error:", e)

    # 2. Fallback: External AI microservice
    if check_ai_service_online():
        try:
            known_students = [
                {
                    "id": s.id,
                    "student_id": s.id,
                    "name": s.name,
                    "roll": s.roll,
                    "face_encoding": s.face_encoding
                }
                for s in students if s.face_encoding
            ]

            if not known_students:
                return None

            with open(image_path, "rb") as img_file:
                resp = httpx.post(
                    f"{AI_SERVICE_URL}/recognize-face",
                    files={"file": (os.path.basename(image_path), img_file, "image/jpeg")},
                    data={"known_students_json": json.dumps(known_students), "tolerance": str(tolerance)},
                    timeout=httpx.Timeout(5.0, connect=1.5)
                )

            if resp.status_code == 200:
                data = resp.json()
                if data.get("matched"):
                    matched_id = data.get("student_id")
                    for s in students:
                        if s.id == matched_id:
                            return {"student": s, "emotion_status": data.get("emotion_status", "Neutral")}
                elif data.get("is_unauthorized"):
                    return {"unauthorized": True}
        except Exception as e:
            print("[Face Service] AI microservice recognition error:", e)

    return None
