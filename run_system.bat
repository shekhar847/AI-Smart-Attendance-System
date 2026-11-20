@echo off
title AI Smart Attendance - System Launcher
echo ========================================================
echo        AI SMART ATTENDANCE - SYSTEM LAUNCHER
echo ========================================================
echo.
echo [1/2] Starting Backend Server (FastAPI on Port 8000)...
start "Backend Server (FastAPI)" cmd /k "cd /d "%~dp0backend" && ..\backend\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Cloudflare HTTPS Tunnel for Mobile Access...
start "Cloudflare Live Tunnel" cmd /k "cd /d "%~dp0" && cloudflared.exe tunnel --url http://127.0.0.1:8000"

echo.
echo ========================================================
echo  Backend & Live Cloudflare Tunnel launched successfully!
echo  Mobile & Laptop can now access dashboard seamlessly.
echo ========================================================
pause
