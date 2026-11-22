# Lunar Sentry AI — Backend Service

Autonomous lunar south pole hazard detection, landing site risk assessment, and rover navigation API built with FastAPI and Python.

## Quick Start (Windows PowerShell)

### 1. Setup Virtual Environment
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Environment Configuration
```powershell
Copy-Item .env.example .env
```

### 4. Database Initialization
Initialize local SQLite database:
```powershell
python init_db.py
```
Or with Alembic:
```powershell
alembic upgrade head
```

### 5. Run the Server
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Health Check: http://127.0.0.1:8000/health
- Interactive Swagger UI: http://127.0.0.1:8000/docs
- Alternative ReDoc: http://127.0.0.1:8000/redoc

### 6. Run Automated Tests
```powershell
python -m unittest discover tests
```
Or with pytest:
```powershell
pytest -v
```

## API Endpoints Overview
- `GET /health` — Health check
- `POST /api/v1/images/analyze` — Upload GeoTIFF/image and start detection pipeline
- `GET /api/v1/images/analyze/{id}` — Poll progress and retrieve results
- `GET /api/v1/detections` — Boulder detection bounding boxes and metrics
- `GET /api/v1/lander-risk` — Landing safety score, clearance, and zones
- `GET /api/v1/rover/state` — Live rover position, route, hazards, and telemetry
- `GET /api/v1/analytics` — Boulder size distribution and hazard breakdown
- `GET /api/v1/mission/overview` — Mission control metrics and telemetry stream
- `GET /api/v1/notifications` — Mission alerts and warnings
