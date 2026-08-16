# System Architecture Documentation

The **AI Smart Attendance System** is an enterprise solution designed for automated student attendance tracking using facial recognition technology.

---

## 1. System Architecture Diagram

```
+-------------------------------------------------------------+
|                      Frontend (Vite / React)                |
|  - Dashboard, Attendance Logs, Students & Teachers Management|
|  - WebCam Live Capture & Photo Upload Interfaces             |
+------------------------------+------------------------------+
                               | REST API (JSON / Multipart)
                               v
+-------------------------------------------------------------+
|                     Backend (FastAPI Engine)                |
|  - JWT Authentication & Admin Management                     |
|  - Attendance Business Logic & Reporting                     |
|  - Database ORM (SQLAlchemy) & Media Files Handling          |
+---------------+------------------------------+--------------+
                |                              |
                v                              v
+---------------+---------------+  +-----------+--------------+
|   Relational Database         |  |   AI Microservice        |
| (MySQL / SQLite Fallback)     |  | (Face Recognition / CV)  |
|  - Admins, Teachers, Students |  | - 128-d Vector Encoding  |
|  - Attendance Logs            |  | - Realtime Match Engine  |
+-------------------------------+  +--------------------------+
```

---

## 2. Component breakdown

### Frontend (`frontend/`)
- Built with React 18, Vite, React Router DOM, Axios, and Chart.js.
- Clean component architecture separated into `pages/`, `components/`, `api/`, and `layouts/`.

### Backend (`backend/`)
- Built with Python FastAPI, SQLAlchemy ORM, and Passlib / JWT Security.
- Handles CRUD for Students, Teachers, Admins, Attendance logs, and Report Generation.
- Automatic database fallback: switches to local SQLite (`ai_attendance.db`) if MySQL is unavailable.

### AI Microservice (`ai-service/`)
- Standalone FastAPI processing node using OpenCV and `face_recognition` (built on dlib).
- Generates 128-dimensional facial landmark embeddings and calculates Euclidean distance for identity matching.

---

## 3. Facial Recognition Workflow

1. **Student Registration**:
   - Admin uploads student profile picture.
   - Facial feature extractor calculates 128-dimensional float vector.
   - Vector is JSON-serialized and stored in `students.face_encoding` database column.

2. **Automated Attendance Marking**:
   - Camera frame captured from web interface or camera feed.
   - Image transmitted to `/attendance/recognize`.
   - AI service calculates frame embedding and compares against database known student encodings (`tolerance=0.5`).
   - If distance match found:
     - Check if student already marked present today.
     - If not present: insert new Attendance record (`status='Present'`).
