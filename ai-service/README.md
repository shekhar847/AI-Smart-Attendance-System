# AI Attendance Face Recognition Microservice

Microservice dedicated to face detection, 128-dimensional facial embedding extraction, and real-time face matching.

## Features
- **Encoding Extraction (`POST /extract-encoding`)**: Upload image, returns 128-d face encoding float vector.
- **Face Recognition (`POST /recognize-face`)**: Upload camera frame and known student encodings list, returns matched student with confidence score.
- **Health Check (`GET /health`)**: Service health check.

## Running Locally

```bash
cd ai-service
pip install -r requirements.txt
python main.py
# Server will start on http://localhost:5000
```

## Running with Docker

```bash
docker build -t ai-attendance-service .
docker run -p 5000:5000 ai-attendance-service
```
