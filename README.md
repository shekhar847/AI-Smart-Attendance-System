# 🤖 AI Smart Attendance System

An end-to-end, state-of-the-art **AI-Powered Smart Attendance System** featuring real-time facial recognition, automated attendance logging, student & teacher management, multi-camera tracking, comprehensive reporting dashboards, notification center, dark mode theme support, and JWT authentication.

---

## 🌟 Key Features

- 🤖 **AI Face Recognition**: Live webcam & image-based 128-dimensional facial embedding matching powered by OpenCV, `face-api.js`, and `face_recognition`.
- 🌙 **Dark & Light Theme**: Built-in toggleable Dark Mode theme with tailored dark aesthetics across all pages, cards, tables, navigation bars, and modals.
- 👤 **Student & Teacher Management**: Full CRUD management for student and teacher profiles, photo enrollment, roll numbers, departments, and academic years.
- 📊 **Analytics & Reporting**: Interactive charts, attendance summary metrics, best attendance student highlights, date-range filtering, and 1-click **Excel** & **PDF** report exports.
- 📹 **Multi-Camera Management**: Stream and manage multiple camera feeds across campus locations.
- 🔔 **Notifications & Communication Center**: Real-time admin notifications drawer and message communication module.
- 🔐 **Secure JWT Auth & Password Recovery**: Admin authentication with JWT tokens, session persistence, and a 6-digit verification code password reset flow.
- 💾 **Resilient Database Architecture**: Seamless MySQL database support with automatic SQLite fallback (`ai_attendance.db`).
- 🐳 **Docker & Microservices**: Docker Compose orchestration for FastAPI backend, React (Vite) frontend, and AI microservice.

---

## 📁 Repository Structure

```
AI-Smart-Attendance-System/
├── backend/                  # FastAPI REST API Backend
│   ├── app/                  # Routes, Models, Schemas, Services, Config
│   ├── main.py               # Application entry point
│   ├── create_admin.py       # Seed script for initial admin user
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variables template
├── frontend/                 # React (Vite + Tailwind CSS v4) Frontend
│   ├── src/                  # Components, Pages, API Clients, Layouts, Routes
│   ├── package.json          # Node dependencies & build scripts
│   └── .env.example          # Environment variables template
├── ai-service/               # Standalone AI Face Recognition Microservice
│   ├── main.py               # Face extraction & matching FastAPI endpoints
│   ├── requirements.txt      # AI dependencies
│   ├── Dockerfile            # Container configuration
│   └── README.md             # Service documentation
├── docs/                     # Comprehensive System Documentation
│   ├── ARCHITECTURE.md       # High-level architecture & diagrams
│   ├── API_DOCUMENTATION.md  # Complete REST API reference
│   └── SETUP_GUIDE.md        # Step-by-step setup guide
├── docker-compose.yml        # Docker orchestration file
├── start.sh                  # One-click startup shell script
└── README.md                 # Project overview (this file)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+
- **Database**: SQLite (default zero-config) or MySQL

### 1️⃣ Step 1: Backend Setup

```bash
cd backend
pip install -r requirements.txt
python create_admin.py
uvicorn main:app --reload --port 8000
```

### 2️⃣ Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser. Default Admin Login Credentials:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

### 3️⃣ Step 3: Run via Docker (Alternative)

```bash
docker-compose up --build
```

---

## 📚 Documentation Links

- [Architecture & System Design (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- [REST API Reference (`docs/API_DOCUMENTATION.md`)](docs/API_DOCUMENTATION.md)
- [Detailed Setup & Deployment Guide (`docs/SETUP_GUIDE.md`)](docs/SETUP_GUIDE.md)

---

## 📄 License

Licensed under the [MIT License](LICENSE).

