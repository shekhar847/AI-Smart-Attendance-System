import json

try:
    import face_recognition
except ImportError:
    face_recognition = None


def generate_face_encoding(image_path):
    """
    Generate face encoding from uploaded image.
    Returns JSON string.
    """

    if face_recognition is None:
        return None

    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

    return json.dumps(encodings[0].tolist())


def recognize_face(image_path, students):
    """
    Match unknown face with registered students.
    """

    if face_recognition is None:
        return None

    try:
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            return None

        unknown_encoding = encodings[0]

        for student in students:

            if not student.face_encoding:
                continue

            known_encoding = json.loads(student.face_encoding)

            match = face_recognition.compare_faces(
                [known_encoding],
                unknown_encoding,
                tolerance=0.50
            )

            if match[0]:
                return student

    except Exception as e:
        print(e)

    return None