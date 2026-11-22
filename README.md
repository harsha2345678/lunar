# 🌕 LUNAR SENTRY AI
### Autonomous Lunar South Pole Terrain Safety, Hazard Intelligence & Navigation System

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

---

## 1. Project Overview

**LUNAR SENTRY AI** is a mission-critical terrain safety intelligence platform designed for autonomous lunar south pole operations (Artemis program target areas, including Shackleton Rim, Malapert Massif, and Cabeus Crater). The platform enables:

1. **High-Resolution Lunar Orbital Image Analysis:** Accepts LRO-NAC GeoTIFF/imagery and runs noise reduction, CLAHE contrast enhancement, and radiometric calibration.
2. **Autonomous Boulder Detection & Segmentation:** Classifies hazardous boulders by diameter and severity (Critical $>3.0\,\text{m}$, Moderate $1.5\text{--}3.0\,\text{m}$, Low $<1.5\,\text{m}$) using a YOLO-based computer vision pipeline.
3. **Landing Site Risk Assessment:** Evaluates slope stability, hazard density, and lander 4-leg clearance across designated landing zones (e.g., Zone Alpha-1, Zone Beta-3).
4. **Rover Autonomous Navigation Intelligence:** Dynamically evaluates primary vs. alternative routes, computes obstacle proximity, traction, and monitors forward HazCam telemetry.
5. **Mission Telemetry & Analytics:** Aggregates boulder size distribution histograms, slope hazard donut charts, Sol-by-Sol detection trends, and comparative lander vs. rover risk scores.

---

## 2. System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    BROWSER (CLIENT LAYER)                     │
│               React 18 SPA + Vite Dev Server                  │
│                   http://localhost:5173                       │
└───────────────────────────────┬───────────────────────────────┘
                                │ REST JSON / Multipart Uploads
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                    BACKEND (API LAYER)                        │
│                     FastAPI + Uvicorn                         │
│                   http://localhost:8000                       │
│  ┌────────────────────┬────────────────────┬───────────────┐  │
│  │ /api/v1/images/*   │ /api/v1/detections │ /api/v1/rover │  │
│  ├────────────────────┼────────────────────┼───────────────┤  │
│  │ /api/v1/lander-risk│ /api/v1/analytics  │ /api/v1/notif │  │
│  └────────────────────┴────────────────────┴───────────────┘  │
└───────────────┬───────────────────────────────┬───────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────────┐ ┌─────────────────────────────┐
│      PERSISTENCE LAYER        │ │       AI / CV PIPELINE      │
│  SQLite / SQLAlchemy Database │ │ YOLOv9-Lunar Boulder Models │
│     Alembic Schema Versioning │ │ LRO-NAC Calibration & DEMs  │
└───────────────────────────────┘ └─────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18.3, React Router DOM 6.26, Vite 5.4, CSS Modules / Custom Tokens, Inter & Manrope typography |
| **Backend** | Python 3.10+, FastAPI 0.111+, Uvicorn, Pydantic v2, Python-Multipart, Pillow |
| **Database** | SQLite3 (local development), SQLAlchemy 2.0+, Alembic 1.13+ migrations |
| **Testing** | Python `unittest` / `pytest` (backend), Vite production roll-up verification (frontend) |
| **Platform** | Windows PowerShell, macOS, Linux |

---

## 4. Repository Structure

```
se/
├── .gitignore                     # Root Git exclusion rules
├── README.md                      # Comprehensive project documentation
├── TEAM_SETUP.md                  # Step-by-step onboarding for teammates
├── GIT_RELEASE_REPORT.md          # Release audit and Git verification status
│
├── lunar-sentry-ai/               # Complete Frontend Application
│   ├── package.json               # Node.js dependencies and scripts
│   ├── package-lock.json          # Deterministic dependency lockfile
│   ├── vite.config.js             # Vite bundler configuration
│   ├── index.html                 # Single page application entry point
│   ├── src/                       # React components, pages, styles, assets
│   │   ├── components/            # Layout, Header, Sidebar, Shared components
│   │   ├── pages/                 # All 6 mission control dashboard views
│   │   ├── data/                  # Mission demo data fixtures (demoData.js)
│   │   ├── styles/                # plain CSS modular stylesheets
│   │   └── assets/images/         # 13 mission terrain and UI images
│   ├── FRONTEND_AUDIT_REPORT.md   # Initial frontend audit report
│   ├── FRONTEND_BACKEND_HANDOFF.md# Detailed API contract specification
│   ├── TESTING_CHECKLIST.md       # 193-point verified testing checklist
│   └── PRE_BACKEND_READINESS.md   # Pre-backend sign-off assessment
│
└── backend/                       # Complete Backend API Service
    ├── app/                       # FastAPI application module
    │   ├── main.py                # App entry point, CORS, routers & endpoints
    │   ├── config.py              # Environment configuration & settings
    │   ├── database.py            # SQLite database connection & schema init
    │   ├── schemas.py             # Pydantic request/response validation models
    │   └── models.py              # Data structures and entities
    ├── alembic/                   # Database migration framework
    │   ├── versions/              # Migration revision scripts (001_initial_schema)
    │   └── env.py                 # Alembic environment runner
    ├── tests/                     # Automated test suite
    │   ├── test_health.py         # Health check tests
    │   └── test_api.py            # Endpoints and business logic tests
    ├── uploads/                   # Uploaded lunar images (gitignored)
    ├── media/                     # Generated overlays and static map layers
    ├── init_db.py                 # Standalone database initialization script
    ├── requirements.txt           # Python dependency specification
    ├── .env.example               # Environment variables template
    └── README.md                  # Dedicated backend instructions
```

---

## 5. Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Git** (2.30+): Verify with `git --version`
- **Node.js** (v18 or v20 LTS recommended): Verify with `node --version`
- **npm** (v9 or v10): Verify with `npm --version`
- **Python** (3.10 to 3.14): Verify with `python --version`

---

## 6. Getting Started (Step-by-Step PowerShell Guide)

Follow these instructions in Windows PowerShell to get both backend and frontend running locally:

### Step 1: Backend Setup & Startup (Terminal 1)

1. Open PowerShell and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
   *(Note: If PowerShell displays an execution policy error, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once).*

3. Install required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```

4. Configure local environment variables:
   ```powershell
   Copy-Item .env.example .env
   ```

5. Initialize the database:
   ```powershell
   python init_db.py
   ```
   *(Or using Alembic: `alembic upgrade head`)*

6. Run the automated backend tests:
   ```powershell
   python -m unittest discover tests
   ```

7. Start the FastAPI development server:
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   - Health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
   - Interactive Swagger API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - ReDoc Documentation: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### Step 2: Frontend Setup & Startup (Terminal 2)

1. Open a **second** PowerShell window and navigate to `lunar-sentry-ai`:
   ```powershell
   cd lunar-sentry-ai
   ```

2. Install Node.js packages:
   ```powershell
   npm install
   ```

3. Verify production compilation:
   ```powershell
   npm run build
   ```

4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   - Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 7. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API service health check |
| `POST` | `/api/v1/images/analyze` | Upload lunar image for YOLOv9-Lunar segmentation |
| `GET` | `/api/v1/images/analyze/{id}` | Poll analysis progress and retrieve annotated URLs |
| `GET` | `/api/v1/detections` | Get boulder detections, coordinates, and hazard classifications |
| `GET` | `/api/v1/lander-risk` | Retrieve landing zone safety score and leg clearance |
| `GET` | `/api/v1/rover/state` | Retrieve live rover traverse position, kinematics, and route |
| `GET` | `/api/v1/analytics` | Retrieve boulder size histograms and Sol detection timeline |
| `GET` | `/api/v1/mission/overview` | Retrieve mission control telemetry feed and performance stats |
| `GET` | `/api/v1/notifications` | Retrieve unread critical hazard and traverse warnings |
| `PATCH`| `/api/v1/notifications/{id}/read` | Mark alert notification as read |
| `POST` | `/api/detect` | Fast detection MVP endpoint |

---

## 8. Team Collaboration Guidelines

Please review [`TEAM_SETUP.md`](./TEAM_SETUP.md) for detailed instructions on:
- Branching strategy (`feature/<name>` branched from `develop`)
- Local `.env` isolation (never commit secret credentials)
- Pulling the latest changes and avoiding merge conflicts
- Pull request code review guidelines

---

## 9. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `Activate.ps1 cannot be loaded` | PowerShell execution policy restricted | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| `CORS Error in Browser` | Frontend port not in allowed origins | Ensure `CORS_ORIGINS` in `.env` includes `http://localhost:5173` |
| `Port 8000 already in use` | Another process running on port 8000 | Stop the existing process or run uvicorn on `--port 8001` |
| `ModuleNotFoundError` | Virtualenv not activated | Activate virtualenv with `.\.venv\Scripts\Activate.ps1` before running Python |

---

## 10. License

Developed for the Lunar Sentry AI Mission Control Initiative. Released under the MIT License.
