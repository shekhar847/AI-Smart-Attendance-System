# REST API Documentation

Base URL: `http://localhost:8000`

---

## 1. Authentication (`/auth`)

### `POST /auth/login`
Admin authentication endpoint.
- **Request Body**:
  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login Successful",
    "access_token": "<jwt_token>",
    "token_type": "bearer",
    "admin": { "id": 1, "name": "Administrator", "email": "admin@gmail.com" }
  }
  ```

---

## 2. Students (`/students`)

- `GET /students/` - Retrieve list of all students.
- `POST /students/` - Add a new student record.
- `GET /students/{id}` - Get details of a single student.
- `PUT /students/{id}` - Update student record.
- `DELETE /students/{id}` - Delete student.
- `POST /students/{id}/upload-photo` - Upload profile image and extract facial encoding.
- `GET /students/{id}/attendance` - Get attendance history and statistics for a student.

---

## 3. Attendance (`/attendance`)

- `GET /attendance/` - Get all attendance records.
- `POST /attendance/` - Manually mark attendance.
- `POST /attendance/recognize` - Upload camera image for AI face recognition and attendance logging.

---

## 4. Teachers (`/teachers`)

- `GET /teachers/` - Retrieve all registered teachers.
- `POST /teachers/` - Register new teacher.
- `GET /teachers/{id}` - Get teacher details.
- `PUT /teachers/{id}` - Update teacher details.
- `DELETE /teachers/{id}` - Delete teacher.

---

## 5. Dashboard & Reports (`/dashboard`, `/reports`)

- `GET /dashboard/` - Quick stats summary (Total Students, Teachers, Present Today, Absent Today).
- `GET /reports/summary` - Today's attendance summary.
- `GET /reports/daily` - Daily attendance timeline.
- `GET /reports/date-range` - Filter attendance records by `from_date` and `to_date`.
- `GET /reports/monthly` - Monthly aggregated attendance metrics.
- `GET /reports/best-student` - Top attending student data.

---

## 6. Admin (`/admin`)

- `PUT /admin/change-password` - Change admin password.
