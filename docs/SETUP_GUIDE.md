# Complete Setup & Installation Guide

This guide provides instructions to set up, configure, and run the **AI Smart Attendance System**.

---

## Prerequisites

- **Python**: 3.10+
- **Node.js**: 18+ and npm
- **Docker & Docker Compose** *(Optional for Containerized Deployment)*
- **C++ Build Tools** / `cmake` *(Required for building `dlib` in Python if face-recognition is compiled from source)*

---

## Method 1: Local Development Setup

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Linux/WSL:
source venv/bin/activate
# On Windows PowerShell:
# .\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env

# Create Default Admin User
python create_admin.py

# Launch Backend Server
uvicorn main:app --reload --port 8000
```
> **Note**: If MySQL is not running on your machine, the backend will automatically fallback to SQLite (`ai_attendance.db`).

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open your browser at `http://localhost:5173`. Default admin login credentials:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

### 3. AI Standalone Microservice (Optional)

```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## Method 2: Docker Compose Setup (One-Command Launch)

From the project root directory:

```bash
docker-compose up --build
```

Services will start at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **AI Microservice**: http://localhost:5000
- **MySQL DB**: localhost:3306
