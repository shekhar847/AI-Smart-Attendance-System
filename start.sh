#!/usr/bin/env bash

# AI Smart Attendance System - Quick Start Script

echo "🚀 Starting AI Smart Attendance System..."

# Start Backend
if [ -d "backend" ]; then
    echo "📦 Starting Backend Server on http://localhost:8000..."
    cd backend
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    uvicorn main:app --reload --port 8000 &
    BACKEND_PID=$!
    cd ..
fi

# Start Frontend
if [ -d "frontend" ]; then
    echo "💻 Starting Frontend Dev Server on http://localhost:5173..."
    cd frontend
    export PATH="/home/dell/.nvm/versions/node/v24.18.0/bin:$PATH"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
fi

echo "✅ System launched successfully!"
echo "Press Ctrl+C to terminate processes."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
