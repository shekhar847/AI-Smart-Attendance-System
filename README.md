# 🤖 AI Smart Attendance System

An end-to-end, state-of-the-art **AI-Powered Smart Attendance System** featuring real-time facial recognition, automated attendance logging, student & teacher management, multi-camera tracking, comprehensive reporting dashboards, notification center, dark/light theme support, and JWT authentication.

---

## 🌟 Key Features

- 🤖 **AI Facial Recognition**: Real-time webcam face detection, landmark extraction, and 128-dimensional embedding matching using `face-api.js`, OpenCV, and `face_recognition`.
- 🗣️ **Text-to-Speech Feedback**: Voice confirmation upon successful attendance verification.
- 🌙 **Dark & Light Mode**: Toggleable theme with tailored dark aesthetics across all pages, cards, tables, navigation bars, and modals.
- 👥 **Student & Teacher Management**: Complete CRUD operations for students and teachers, photo enrollment, roll numbers, departments, and academic years.
- 📊 **Analytics & Interactive Reports**: Summary metrics, daily/monthly breakdown charts (Recharts), best student highlights, date-range filters, and 1-click **Excel (`xlsx`)** & **PDF (`jspdf`)** report exports.
- 📹 **Multi-Camera Management**: Stream, register, and manage multiple camera feeds across campus locations.
- 🔔 **Notification Center**: Real-time notifications drawer for mark-as-read and notification filtering.
- 🔐 **JWT Authentication & Password Reset**: Secure admin login with JWT bearer tokens, session persistence, and 6-digit OTP password recovery flow.
- 💾 **Dual Database Architecture**: Production-ready MySQL database support with seamless zero-config SQLite fallback (`ai_attendance.db`).
- 🐳 **Docker & Microservices Architecture**: Docker Compose orchestration for FastAPI backend, Vite React frontend, and AI microservice.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts, `face-api.js`, Axios, jsPDF, XLSX |
| **Backend API** | Python 3.11, FastAPI, SQLAlchemy ORM, Pydantic v2, PyJWT, Passlib (Bcrypt), Uvicorn |
| **AI Microservice** | Python 3.11, OpenCV (`cv2`), `face_recognition`, NumPy, FastAPI |
| **Database** | SQLite (Development/Fallback), MySQL 8.0 (Production) |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Repository Structure

```
AI-Smart-Attendance-System/
├── backend/                  # FastAPI REST API Backend
│   ├── app/                  # Application core
│   │   ├── config/           # Database setup & environment config
│   │   ├── controllers/      # Route logic handlers
│   │   ├── models/           # SQLAlchemy database schemas
│   │   ├── routes/           # API endpoints (Auth, Students, Attendance, etc.)
│   │   ├── schemas/          # Pydantic request/response validators
│   │   ├── services/         # Face recognition & auth services
│   │   └── utils/            # Helper functions (JWT, hashing, email)
│   ├── uploads/              # Uploaded student photos & temporary frames
│   ├── main.py               # FastAPI application entry point
│   ├── create_admin.py       # Admin seeding script
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React (Vite + Tailwind CSS v4) Frontend
│   ├── src/
│   │   ├── api/              # Axios API client modules
│   │   ├── assets/           # Images & static assets
│   │   ├── components/       # Reusable UI components & modals
│   │   ├── layouts/          # Dashboard layout wrappers
│   │   ├── pages/            # Page components (Attendance, Students, Reports, etc.)
│   │   ├── routes/           # Protected router configuration
│   │   └── App.jsx           # Main application entry
│   ├── public/               # Static assets & face-api.js models
│   ├── package.json          # Frontend dependencies & scripts
│   └── vite.config.js        # Vite configuration
├── ai-service/               # Standalone AI Face Recognition Microservice
│   ├── main.py               # Face encoding extraction & matching endpoints
│   ├── requirements.txt      # AI dependencies (OpenCV, face_recognition)
│   └── Dockerfile            # Container configuration
├── docs/                     # Detailed System Documentation
│   ├── ARCHITECTURE.md       # High-level architecture & sequence diagrams
│   ├── API_DOCUMENTATION.md  # REST API specification
│   └── SETUP_GUIDE.md        # Complete setup & deployment guide
├── docker-compose.yml        # Multi-container orchestration
├── start.sh                  # One-click startup shell script
└── README.md                 # Project overview
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10 or 3.11
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher

---

### 1️⃣ Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed initial admin user
python create_admin.py

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

---

### 2️⃣ Step 2: Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

Open **`http://localhost:5173`** in your browser.

#### Default Credentials:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

---

### 3️⃣ Step 3: Run via Docker (Alternative)

```bash
# Spin up MySQL, Backend, AI Microservice, and Frontend containers
docker-compose up --build
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
DATABASE_URL=sqlite:///./ai_attendance.db
SECRET_KEY=supersecretkey123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
AI_SERVICE_URL=http://localhost:5000
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📚 API Endpoints Summary

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Login & receive JWT token |
| **Auth** | `POST` | `/auth/forgot-password` | Request password reset verification code |
| **Auth** | `POST` | `/auth/reset-password` | Reset password using OTP code |
| **Students** | `GET` / `POST` | `/students/` | Fetch list / Add student with photo |
| **Students** | `PUT` / `DELETE`| `/students/{id}` | Update / Delete student |
| **Teachers** | `GET` / `POST` | `/teachers/` | Fetch list / Add teacher |
| **Attendance**| `POST` | `/attendance/recognize` | Perform face recognition & log attendance |
| **Attendance**| `GET` | `/attendance/` | List all attendance logs |
| **Dashboard** | `GET` | `/dashboard/` | Overall statistics & summary counts |
| **Reports** | `GET` | `/reports/summary` | Summary breakdown for charts |
| **Reports** | `GET` | `/reports/daily` | Today's attendance report |
| **Reports** | `GET` | `/reports/monthly` | Monthly attendance report |
| **Reports** | `GET` | `/reports/best-student` | Top attending student of the month |
| **Cameras** | `GET` / `POST` | `/api/cameras/` | Camera management |
| **Notifications** | `GET` | `/notifications/` | Admin notification list |

---

## 📚 Additional Documentation

- [Architecture & Design Guide (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- [REST API Reference (`docs/API_DOCUMENTATION.md`)](docs/API_DOCUMENTATION.md)
- [Deployment & Setup Guide (`docs/SETUP_GUIDE.md`)](docs/SETUP_GUIDE.md)

---

## 📄 License

Licensed under the [MIT License](LICENSE).
