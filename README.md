# 🤖 SmartAttend OS (v2.5) — AI Smart Attendance System

An enterprise-grade, state-of-the-art **AI-Powered Facial Telemetry & Attendance Management Operating System** built with **Next.js 15 (React 19)**, **FastAPI (Python 3.11)**, **MySQL / SQLite**, and **deep biometric embeddings (128-dimensional dlib / face-api.js)**.

Designed for Universities, Colleges, and Enterprise Campuses with seamless cross-device mobile & desktop telemetry.

[![Live Production Demo](https://img.shields.io/badge/Live_Demo-Vercel_Production-c8f135?style=for-the-badge&logo=vercel&logoColor=black)](https://ai-smart-attendance-system-red.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_(React_19)-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Production Links

- **Frontend Cloud Portal**: [https://ai-smart-attendance-system-red.vercel.app](https://ai-smart-attendance-system-red.vercel.app)
- **Default Super Admin**: `admin@gmail.com` / `admin123`
- **Secondary Admin**: `shekhar32542@gmail.com` / `admin123`
- **Live Cloudflare Backend Tunnel**: `https://removing-gore-quarters-suits.trycloudflare.com`

---

## 🌟 Key Features & Innovations

### 1. 🤖 Dual-Tier Biometric Facial Telemetry
- **Client & Server Hybrid Pipeline**: Client-side preview via `face-api.js` (TensorFlow.js) with high-accuracy server-side 128-d facial embedding extraction (`dlib`/`face_recognition`).
- **Debounced Sub-Second Logging**: High-speed frame processing with automatic duplicate-scan debounce and anti-spoofing validation.
- **Microservice Fallback**: Fault-tolerant architecture switching to dedicated AI microservice if local engine is occupied.

### 2. 📱 Seamless Mobile & Desktop Support
- **Cross-Device Telemetry**: Dashboard and biometric scanning adapt responsively across Android, iOS, tablets, and desktops.
- **Intelligent In-App Backend Switcher**: Allows 1-click switching between local development server (`http://localhost:8000`) and live HTTPS Cloudflare / Ngrok tunnels.
- **Auto-Purge Safeguards**: Automatically clears invalid `localhost` or `vercel.app` URLs from mobile client caches to prevent 404 or connection errors.

### 3. 🎓 Dynamic Academic Department & Semester Management
- **Department-Specific Semester Mapping**:
  - **MCA**: 4 Semesters (`Semester 1` – `Semester 4`)
  - **MBA**: 4 Semesters (`Semester 1` – `Semester 4`)
  - **BCA**: 6 Semesters (`Semester 1` – `Semester 6`)
  - **BBA**: 6 Semesters (`Semester 1` – `Semester 6`)
  - **B.Tech**: 8 Semesters (`Semester 1` – `Semester 8`)
  - **Custom / Other Programs**: Dynamic semester ranges with zero-bleed opaque selectors.
- **Automatic Form Validation**: Resets invalid semester inputs upon department change and prevents credential autofill leaks.

### 4. 👥 3-Tier Role-Based Access Control (RBAC)
- **Admin Portal**: Full control over student/faculty onboarding, system settings, camera feeds, and cutoff alert triggers.
- **Teacher Portal**: Class-specific attendance tracking, manual attendance overrides, and daily student reports.
- **Student Portal**: Personal biometric profile, attendance history, monthly percentage telemetry, and leave requests.

### 5. 📢 Automated Parent Notification Scheduler
- **Daily Cutoff Auto-Trigger**: Background scheduler that checks campus cutoff time (e.g., `09:30 AM`) and automatically generates absence notifications.
- **Multi-Channel Webhooks**: Ready-to-connect integration points for WhatsApp API and SMS gateways for real-time guardian alerts.

### 6. 📊 Real-Time Analytics & Report Engine
- **Telemetry Visualizations**: Interactive Recharts tracking attendance distribution, department performance, and monthly top performers.
- **Multi-Format Export**: One-click instant export of attendance registers into **Excel (`.xlsx`)** and formatted **PDF** documents.
- **RTSP / IP Camera Streams**: Multi-camera campus surveillance module supporting IP webcams, RTSP corridor cameras, and integrated webcams.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & UI Kit** | Tailwind CSS v4, Lucide React Icons, Cyberpunk `#c8f135` Theme |
| **Client Biometrics** | `face-api.js` (TensorFlow.js WebAssembly / WebGL) |
| **Backend REST API** | Python 3.11, FastAPI, SQLAlchemy ORM, Pydantic v2, Uvicorn |
| **Computer Vision Engine** | `face_recognition`, OpenCV (`cv2`), `dlib`, NumPy |
| **Auth & Security** | JWT (JSON Web Tokens), Passlib (Bcrypt), Private Network Access CORS |
| **Database** | MySQL 8.0 (Production) / SQLite (Zero-config local fallback) |
| **Live Tunneling** | Cloudflare Quick Tunnels (`cloudflared`), Ngrok |
| **Cloud Deployment** | Vercel (Frontend), Docker / Linux VM / Windows Daemon (Backend) |

---

## 📁 Repository Structure

```
AI-Smart-Attendance-System/
├── backend/                       # FastAPI REST API Backend
│   ├── app/
│   │   ├── config/                # Database connection, migrations & settings
│   │   ├── models/                # SQLAlchemy models (Admin, Teacher, Student, Attendance, Alerts)
│   │   ├── routes/                # REST endpoints (auth, students, teachers, attendance, reports)
│   │   ├── schemas/               # Pydantic v2 schemas for request validation
│   │   ├── services/              # Biometric recognition, RBAC & parent alert scheduler
│   │   └── utils/                 # Security, JWT tokens & helpers
│   ├── uploads/                   # Uploaded biometric photos
│   ├── main.py                    # FastAPI server entry point & background schedulers
│   ├── create_admin.py            # Initial administrator seeding script
│   └── requirements.txt           # Python backend dependencies
├── frontend/                      # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── api/                   # Axios API client with dynamic live tunnel resolver
│   │   ├── app/                   # App Router pages (login, dashboard, students, attendance, etc.)
│   │   ├── components/            # Reusable UI widgets, modals, badges, inputs
│   │   ├── layouts/               # Cyberpunk sidebar, navigation & telemetry layout
│   │   └── types/                 # TypeScript type declarations
│   ├── public/                    # Neural weights for face-api.js (SSD MobileNet, Face Landmark, etc.)
│   ├── next.config.ts             # Next.js configuration
│   └── package.json               # Frontend dependencies & build scripts
├── ai-service/                    # Standalone Fallback Face Recognition Microservice
│   ├── main.py                    # Lightweight FastAPI service for face encodings
│   └── requirements.txt           # AI microservice dependencies
├── run_system.bat                 # 1-Click Windows Launcher (FastAPI + Cloudflare Live Tunnel)
└── README.md                      # Comprehensive project documentation
```

---

## 🚀 Quick Start Guide

### ⚡ Option A: 1-Click Launch (Recommended for Windows)

Simply double-click the included batch launcher:
```bat
run_system.bat
```
This automatically starts:
1. **FastAPI Backend Server** on `http://localhost:8000`
2. **Cloudflare Live HTTPS Tunnel** for mobile and remote access

---

### 💻 Option B: Manual Setup

#### 1️⃣ Step 1: Backend Setup (Python 3.11)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Activate virtual environment (or create one: python -m venv venv)
venv\Scripts\activate      # On Windows
# source venv/bin/activate  # On Linux / macOS

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations & seed admin
python create_admin.py

# 5. Start FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Root: `http://localhost:8000`
- Interactive Swagger Documentation: `http://localhost:8000/docs`

---

#### 2️⃣ Step 2: Frontend Setup (Next.js 15)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start development server
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

#### 3️⃣ Step 3: Expose for Mobile Access (Cloudflare Tunnel)

To test facial recognition from your phone's camera:
```bash
# Run Cloudflare quick tunnel (no account needed)
cloudflared.exe tunnel --url http://127.0.0.1:8000
```
Then paste the generated `https://*.trycloudflare.com` URL into the **⚙️ Server Settings** modal on the login page.

---

## 🔐 Default Credentials

| Role | Email / Identifier | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@gmail.com` | `admin123` | Full System Administration |
| **Admin** | `shekhar32542@gmail.com` | `admin123` | Campus Management |
| **Teacher** | *(Configured in Faculty Portal)* | Assigned Password | Department Attendance & Overrides |
| **Student** | *(Student Roll Number / Email)* | Assigned Password | Personal Records & Biometric Check |

---

## 📚 API Endpoints Summary

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Authenticate user & issue JWT bearer token |
| **Auth** | `POST` | `/auth/forgot-password` | Generate & send 6-digit OTP code to registered email |
| **Auth** | `POST` | `/auth/reset-password` | Verify OTP code and reset account password |
| **Students** | `GET` | `/students/` | Retrieve paginated student records with department filters |
| **Students** | `POST` | `/students/` | Enroll new student with parental contact info |
| **Students** | `POST` | `/students/{id}/upload-photo` | Process facial photo & generate 128-d biometric embedding |
| **Students** | `PUT` | `/students/{id}` | Update student profile, semester, and contact details |
| **Students** | `DELETE`| `/students/{id}` | Remove student record and associated encodings |
| **Teachers** | `GET` | `/teachers/` | List faculty members and department designations |
| **Teachers** | `POST` | `/teachers/` | Onboard new faculty member |
| **Attendance**| `POST` | `/attendance/recognize` | Execute facial recognition & record attendance stamp |
| **Attendance**| `GET` | `/attendance/` | Fetch historical attendance logs with date filtering |
| **Dashboard** | `GET` | `/dashboard/` | Real-time telemetry metrics (total, present, absent) |
| **Reports** | `GET` | `/reports/summary` | Aggregate graphical telemetry data |
| **Reports** | `GET` | `/reports/daily` | Day-wise breakdown of attendance counts |
| **Reports** | `GET` | `/reports/monthly` | 30-day cumulative attendance metrics |
| **Reports** | `GET` | `/reports/best-student` | Compute and return student of the month |
| **Cameras** | `GET` / `POST` | `/cameras/` | Register and manage campus RTSP / IP camera streams |
| **Alerts** | `GET` / `POST` | `/alerts/settings` | Configure parent alert cutoff times & SMS/WhatsApp webhooks |

---

## 🛡️ Security & Privacy Notice
- Biometric facial vectors are stored as mathematical 128-dimensional floating point arrays (`dlib` embeddings), ensuring raw facial imagery is never exposed to third-party endpoints.
- Role-based JWT bearer authentication protects all sensitive administration endpoints.

---

## 📄 License
This project is open-source and distributed under the [MIT License](LICENSE).
