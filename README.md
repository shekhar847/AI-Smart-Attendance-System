# 🤖 SmartAttend OS (v2.4) - AI Smart Attendance System

An enterprise-grade, state-of-the-art **AI-Powered Facial Telemetry & Attendance Management Operating System** built with **Next.js (React 19)**, **FastAPI**, **MySQL**, and **deep biometric embeddings**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Production-c8f135?style=for-the-badge&logo=vercel&logoColor=black)](https://ai-smart-attendance-system-red.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_(React_19)-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

---

## 🌐 Live Production Deployment
- **Frontend App**: [https://ai-smart-attendance-system-red.vercel.app](https://ai-smart-attendance-system-red.vercel.app)
- **Default Admin Account**: `admin@gmail.com` / `admin123`

---

## 🌟 Key Features

### 1. 🤖 Next-Gen Biometric Facial Recognition
- **Real-Time Webcam & RTSP Video Processing**: High-speed face detection, landmark alignment, and 128-dimensional biometric embedding generation.
- **Client & Server-Side Verification**: Real-time client-side face verification check preview before upload with resilient backend fallback.
- **Instant Attendance Logging**: Sub-second attendance verification with anti-spoofing telemetry and duplicate-scan debounce protection.

### 2. 🎓 Academic Structure & Dynamic Semester Management
- **Department-Specific Semester Mapping**:
  - **MCA**: 4 Semesters (`Semester 1` – `Semester 4`)
  - **MBA**: 4 Semesters (`Semester 1` – `Semester 4`)
  - **BBA**: 6 Semesters (`Semester 1` – `Semester 6`)
  - **BCA**: 6 Semesters (`Semester 1` – `Semester 6`)
  - **B.Tech**: 8 Semesters (`Semester 1` – `Semester 8`)
  - **Other / Custom**: Up to 8 Semesters + custom entry for non-standard university programs.
- **Interactive Custom Dropdowns**: Zero-bleed opaque styling with search, keyboard navigation, and automatic invalid semester reset on department change.

### 3. 🎨 Cyberpunk Electric Lime (`#c8f135`) UI/UX Design System
- **Signature Aesthetic**: Electric Lime high-contrast buttons, telemetry status badges, and dynamic active-route indicators.
- **3-Tier Fixed & Scrollable Sidebar**: Brand identity header (top fixed), sleek scrollable module navigation with custom 4px dark scrollbar, and fixed AI Core status / Sign-out footer.
- **Zero-Bleed Opaque Overlays**: High-opacity (`#0b0f19`) profile dropdowns, notifications drawer, and biometric registration modals eliminating transparency overlap.
- **Security & Autofill Shields**: Complete prevention of browser password managers auto-filling admin credentials into student registration fields via decoy traps and `autoComplete="new-password"`.

### 4. 👥 Complete Academic & Faculty Management
- **Student Enrollment Portal**: Multi-step student registration with biometric photo upload, roll number validation, parental contacts, and bulk Excel/CSV import.
- **Faculty Management Portal**: Onboard faculty members, manage department assignments, designation titles, and configure access privileges.
- **Parent Alerts & SMS Telemetry**: Automated absence detection with daily parent alert generation and WhatsApp/SMS webhook integrations.

### 5. 📊 Interactive Analytics & Enterprise Reporting
- **Analytical Dashboards**: Real-time metrics for Total Students, Faculty Members, Present Today, and Absent Today.
- **Custom Date-Range Query Engine**: Query attendance logs across custom date intervals with student-specific historical logs.
- **One-Click Export**: Export comprehensive tabular attendance data into **Excel (`.xlsx`)** and **PDF** formats.

### 6. 📹 Multi-Camera Campus Surveillance
- Stream, register, and monitor RTSP streams, IP cameras, and local webcams across corridors, gates, and lecture halls.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | Next.js (App Router), React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons, PostCSS |
| **Client Biometrics** | `face-api.js` (TensorFlow.js backend) |
| **Data Visualization & Export** | Recharts, XLSX (`xlsx`), jsPDF (`jspdf`) |
| **Backend REST API** | Python 3.11, FastAPI, SQLAlchemy ORM, Pydantic v2 |
| **Authentication & Security** | JWT Bearer Tokens, Passlib (Bcrypt), Private Network CORS Headers |
| **Data Processing** | Pandas, OpenPyXL, NumPy |
| **Database** | MySQL 8.0 (Production) / SQLite (Zero-config local fallback) |
| **Deployment & Hosting** | Vercel (Frontend), Uvicorn Daemon / Docker (Backend) |

---

## 📁 Repository Structure

```
AI-Smart-Attendance-System/
├── backend/                       # FastAPI REST API Backend
│   ├── app/
│   │   ├── config/                # Database connection & environment configuration
│   │   ├── controllers/           # Route logic & attendance processors
│   │   ├── models/                # SQLAlchemy database schemas
│   │   ├── routes/                # Endpoints (Auth, Students, Teachers, Attendance, Reports)
│   │   ├── schemas/               # Pydantic v2 request/response validators
│   │   ├── services/              # Face recognition & auth services
│   │   └── utils/                 # JWT token generation, security & scheduler
│   ├── uploads/                   # Uploaded student & teacher photo records
│   ├── main.py                    # FastAPI server entry point
│   ├── create_admin.py            # Initial administrator seeding script
│   └── requirements.txt           # Python dependencies
├── frontend/                      # Next.js App Router (React 19 + TypeScript)
│   ├── src/
│   │   ├── api/                   # Typed Axios API client modules
│   │   ├── app/                   # App Router pages (Dashboard, Students, Teachers, etc.)
│   │   ├── components/            # Reusable UI components & modals (StudentModal, Sidebar)
│   │   ├── layouts/               # Dashboard layout wrapper
│   │   └── types/                 # TypeScript interface definitions
│   ├── public/                    # Static assets & face-api.js neural weights
│   ├── next.config.ts             # Next.js configuration
│   ├── postcss.config.mjs         # Tailwind CSS v4 PostCSS configuration
│   └── package.json               # Frontend dependencies & build scripts
├── ai-service/                    # Standalone AI Face Recognition Microservice
│   ├── main.py                    # Microservice face encoding extraction
│   └── requirements.txt           # AI dependencies (OpenCV, face_recognition)
└── README.md                      # System documentation & overview
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10 or 3.11
- **Node.js**: 18.x or 20.x
- **npm**: 9.x or higher
- **MySQL Server** (optional; SQLite fallback enabled by default)

---

### 1️⃣ Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Seed initial admin account
python create_admin.py

# Launch FastAPI server on port 8000
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: **`http://localhost:8000`**  
Interactive API Docs (Swagger): **`http://localhost:8000/docs`**

---

### 2️⃣ Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Next.js development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

#### Default Credentials:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)
```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ai_attendance
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
AI_SERVICE_URL=http://localhost:5000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 📚 API Endpoints Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Authenticate user & issue JWT bearer token |
| **Auth** | `POST` | `/auth/forgot-password` | Send 6-digit OTP code to verified email |
| **Auth** | `POST` | `/auth/reset-password` | Reset password using verified OTP |
| **Students** | `GET` | `/students/` | Retrieve registered students |
| **Students** | `POST` | `/students/` | Enroll new student |
| **Students** | `POST` | `/students/{id}/upload-photo` | Upload student photo & generate facial embedding |
| **Students** | `PUT` | `/students/{id}` | Update student profile & semester details |
| **Students** | `DELETE`| `/students/{id}` | Delete student record |
| **Teachers** | `GET` | `/teachers/` | Retrieve faculty member directory |
| **Teachers** | `POST` | `/teachers/` | Onboard new faculty member |
| **Attendance**| `POST` | `/attendance/recognize` | Execute facial recognition & log attendance |
| **Attendance**| `GET` | `/attendance/` | List all historical attendance logs |
| **Dashboard** | `GET` | `/dashboard/` | Real-time aggregate telemetry & counts |
| **Reports** | `GET` | `/reports/summary` | Analytics chart breakdown |
| **Reports** | `GET` | `/reports/daily` | Current day attendance overview |
| **Reports** | `GET` | `/reports/monthly` | 30-day cumulative attendance metrics |
| **Reports** | `GET` | `/reports/best-student` | Top attending student of the month |
| **Cameras** | `GET` / `POST` | `/cameras/` | List & configure RTSP / Web streams |
| **Notifications** | `GET` | `/notifications/` | Real-time system alert feed |

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
