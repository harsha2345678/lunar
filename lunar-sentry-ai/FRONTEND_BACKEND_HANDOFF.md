# Lunar Sentry AI — Frontend ↔ Backend Handoff

**Document Date:** 2026-11-22  
**Purpose:** Exact backend requirements and proposed API contracts for integrating the existing React frontend.

---

## 1. Architecture Overview

The frontend is a React + Vite SPA running at (dev) `http://localhost:5173`. It expects a REST JSON API at a configurable base URL (recommend environment variable `VITE_API_BASE`). All API calls will be initiated from the browser; no server-side rendering is involved.

```
Browser (React SPA)
       │  REST / JSON
       ▼
Backend API Server  ──▶  AI Model (YOLOv9-Lunar)
       │                        │
       ▼                        ▼
  Database / Storage      Detection Results
```

---

## 2. Environment Variable Convention

Add to `lunar-sentry-ai/.env.local`:
```
VITE_API_BASE=http://localhost:8000
```

The frontend should read `import.meta.env.VITE_API_BASE` for all fetch calls.

---

## 3. Page-by-Page Backend Requirements

---

### 3.1 Image Analysis (`/image-analysis`)

**Current frontend state:** File selected via browse or drag-and-drop, stored as a local object URL. "Analyze Image" button runs a simulated progress bar. No data is sent to any server.

#### API: Upload and Analyze Image

```
POST /api/v1/images/analyze
Content-Type: multipart/form-data

Fields:
  file           : binary   — The image file (GeoTIFF, PDS4 .IMG, PNG, JPEG; max 2 GB)
  gsd            : float    — Ground sample distance in m/px (from frontend GSD input)
  noise_reduce   : boolean  — Noise reduction preprocessing toggle state
  contrast_enhance: boolean — CLAHE contrast enhancement toggle state
  radiometric_cal : boolean — Radiometric calibration toggle state

Response 202 Accepted:
{
  "analysis_id": "uuid-string",
  "status": "queued",
  "eta_seconds": 30
}
```

#### API: Poll Analysis Status

```
GET /api/v1/images/analyze/{analysis_id}

Response 200:
{
  "analysis_id": "uuid-string",
  "status": "processing" | "complete" | "failed",
  "progress_pct": 0-100,
  "stage_label": "Running YOLOv9-Lunar Boulder Segmentation",
  "tile_current": 14,
  "tile_total": 18,
  "eta_label": "00:04.2s"
}

Response 200 (complete):
{
  "analysis_id": "uuid-string",
  "status": "complete",
  "progress_pct": 100,
  "annotated_image_url": "/media/annotated/uuid.png",
  "detections_url": "/api/v1/detections?analysis_id=uuid",
  "metadata": {
    "sensor": "LRO-NAC",
    "resolution": "4096 × 4096 px",
    "capture_timestamp": "2025-02-14T04:12:00Z",
    "gsd_mpp": 0.50,
    "sun_elevation_deg": 11.4,
    "sun_azimuth_deg": 218
  }
}
```

**Frontend integration point:** Replace `setProgress(0)` and the `setTimeout` animation in `ImageAnalysis.jsx` with:
1. `POST /api/v1/images/analyze` on button click → store `analysis_id`
2. Poll `GET /api/v1/images/analyze/{analysis_id}` every 1 s → update progress state
3. On `status: "complete"` → load annotated image URL into viewport, navigate or display results

---

### 3.2 Boulder Detection (`/boulder-detection`)

**Current frontend state:** 6 boulders with hardcoded positions in `demoData.js`. Bounding box positions are percentages of the frame image dimensions.

#### API: Fetch Detection Results

```
GET /api/v1/detections?analysis_id={uuid}
  OR
GET /api/v1/detections?frame_id={frame_id}

Response 200:
{
  "frame": {
    "id": "LRO-NAC Frame #8842-A",
    "resolution_mpp": 0.5,
    "coordinates": "89.9°S, 142.4°E",
    "annotated_image_url": "/media/annotated/frame8842a.png",
    "image_width_px": 4096,
    "image_height_px": 4096
  },
  "model": "YOLOv9-Lunar",
  "boulders": [
    {
      "id": "BLD-014",
      "confidence": 0.984,
      "diameter_m": 4.6,
      "hazard_class": "Critical",
      "latitude_deg": -89.91,
      "longitude_deg": 142.38,
      "bbox_left_pct": 17.9,
      "bbox_top_pct": 28.0,
      "bbox_width_pct": 16.2,
      "bbox_height_pct": 20.5
    }
  ],
  "summary": {
    "total_detected": 47,
    "average_diameter_m": 1.8,
    "max_diameter_m": 4.6,
    "max_diameter_id": "BLD-014",
    "hazard_counts": {
      "critical": 9,
      "moderate": 15,
      "low": 23
    }
  }
}
```

**Frontend integration point:** Replace `boulderDetection` import in `BoulderDetection.jsx` with a `useEffect` fetch on mount (or when `analysis_id` is passed via route state/query param). Bounding box `left/top/w/h` are already expressed as percentages in the frontend — backend must return the same percentage format, or the frontend must compute from pixel coords and frame dimensions.

> [!IMPORTANT]
> **Cross-page `analysis_id` routing — frontend wiring still required.** Currently there is **no mechanism** in the frontend to pass an `analysis_id` from `ImageAnalysis.jsx` to `BoulderDetection.jsx`. When backend integration begins, the frontend must be updated to: (1) store `analysis_id` in React Router location state or a URL query param after the POST response, and (2) read it in `BoulderDetection.jsx` via `useLocation().state` or `useSearchParams()`. This is a **frontend task**, not just a backend task.

---

### 3.3 Lander Risk (`/lander-risk`)

**Current frontend state:** Static risk score (88/100), static map image, non-functional layer pills.

#### API: Fetch Landing Risk Assessment

```
GET /api/v1/lander-risk?site_id={site_id}&analysis_id={uuid}

Response 200:
{
  "site_id": "sector-7g-shackleton",
  "site_label": "SHACKLETON RIM · SECTOR 7G",
  "dem_resolution_mpp": 0.15,
  "safety_score": 88,
  "safety_max": 100,
  "safety_status": "LOW RISK — NOMINAL",
  "safety_note": "Site meets Artemis-IV touch-down safety criteria...",
  "confidence": 0.964,
  "hazard_density_per_sqm": 0.12,
  "coordinates": "89.412°S, 222.684°E",
  "lander_legs": {
    "summary": "ALL LEGS CLEAR",
    "min_clearance_m": 2.4,
    "max_rock_height_m": 0.35,
    "terrain_slope_deg": 4.2,
    "leg_statuses": ["L1: OK", "L2: OK", "L3: OK", "L4: OK"]
  },
  "safe_zones": [
    {
      "name": "Zone Alpha-1",
      "radius_m": 18.5,
      "clearance_m": 2.8,
      "tag": "PRIMARY"
    }
  ],
  "map_layers": {
    "base": "/media/maps/site-7g-base.png",
    "safe_zones": "/media/maps/site-7g-safe.png",
    "caution": "/media/maps/site-7g-caution.png",
    "high_risk_boulders": "/media/maps/site-7g-hazards.png"
  }
}
```

**Frontend integration point:** The `layer` state in `LanderRisk.jsx` should map to `map_layers` keys — when user selects a layer, load the corresponding PNG into `<img className="lander-stage-img">`.

---

### 3.4 Rover Navigation (`/rover-navigation`)

**Current frontend state:** Static map image, decorative HUD layer toggles, non-functional route selection.

#### API: Fetch Rover Navigation State

```
GET /api/v1/rover/state

Response 200:
{
  "status": "AUTONOMOUS TRAVERSE ACTIVE",
  "position": {
    "latitude_deg": -89.42,
    "longitude_deg": 42.18,
    "location_label": "SHACKLETON RIM"
  },
  "risk_score": 14,
  "risk_max": 100,
  "risk_status": "SAFE",
  "obstacle": {
    "status": "CAUTION",
    "nearest_label": "6.4m Starboard",
    "detail": "Boulder B-14 · Est. 2.1m dia"
  },
  "kinematics": {
    "velocity_mps": 0.42,
    "heading_label": "118° ESE",
    "pitch_label": "+3.2°"
  },
  "traction_pct": 96.4,
  "waypoints": [
    { "id": "WP-04", "status": "Cleared" },
    { "id": "WP-05", "status": "140m" },
    { "id": "WP-06", "status": "420m (GOAL)" }
  ],
  "routes": [
    {
      "id": "primary",
      "name": "Primary Route",
      "tag": "ACTIVE",
      "distance_m": 420,
      "risk_pct": 4.1,
      "eta_label": "16m 40s",
      "map_overlay_url": "/media/maps/rover-route-primary.png"
    },
    {
      "id": "alt",
      "name": "Route B",
      "tag": "LOWEST RISK",
      "distance_m": 485,
      "risk_pct": 1.8,
      "eta_label": "19m 15s",
      "map_overlay_url": "/media/maps/rover-route-alt.png"
    }
  ],
  "map_layers": {
    "base": "/media/maps/rover-sector7g-base.png",
    "contours": "/media/maps/rover-sector7g-contours.png",
    "hazards": "/media/maps/rover-sector7g-hazards.png",
    "grid": "/media/maps/rover-sector7g-grid.png"
  },
  "hazcam_snapshot_url": "/media/hazcam/latest.jpg"
}
```

**Frontend integration point:**
- HUD layer toggles should composite selected layer PNGs (using CSS absolute positioning or canvas)
- Route selection should load `map_overlay_url` for the selected route
- Poll this endpoint every 2–5 s for live telemetry; use WebSocket for sub-second updates if available

> [!NOTE]
> **Hazard tags overlay — frontend implementation also required.** `demoData.roverNavigation.hazards` (`['B-14 (2.1m)', 'B-09 (1.4m)', 'B-22 (1.6m)']`) exists and the CSS class `.hazard-tags` is defined in `dashboards.css`, but `RoverNavigation.jsx` does not render any hazard tag elements. When integrating with the backend's `boulder proximity` data, the frontend must also add the JSX to render hazard tags on the map overlay.

#### Optional: WebSocket for live telemetry
```
WS /ws/rover/telemetry
Messages: same shape as GET /api/v1/rover/state (kinematics fields only for high-frequency updates)
```

---

### 3.5 Mission Analytics (`/mission-analytics`)

**Current frontend state:** All charts and metrics are hardcoded demo data. Date range filter changes UI state only.

#### API: Fetch Analytics Data

```
GET /api/v1/analytics?range=7d|30d|artemis-iv&site=south-pole-shackleton

Response 200:
{
  "range": "7d",
  "site": "SOUTH POLE SHACKLETON RIM",
  "size_histogram": {
    "peak_label": "Peak: 1.0–1.5m (38.4%)",
    "bars": [
      { "label": "0.5–1.0m", "value_pct": 22.1 },
      { "label": "1.0–1.5m", "value_pct": 38.4 }
    ]
  },
  "hazard_donut": [
    { "label": "Nominal (<15° Slope)", "value_pct": 68.2, "tone": "nominal" },
    { "label": "Caution (15–25°)", "value_pct": 21.8, "tone": "elevated" },
    { "label": "Critical (>25° / Occluded)", "value_pct": 10.0, "tone": "critical" }
  ],
  "avg_confidence_pct": 94.6,
  "confidence_tiers_validated_pct": 98.1,
  "timeline": {
    "labels": ["SOL 142", "SOL 148", "SOL 154", "SOL 160", "SOL 166", "SOL 172 (NOW)"],
    "detections_per_sol": [210, 340, 280, 390, 420, 470]
  },
  "risk_comparison": [
    { "metric": "Slope Gradient Hazard", "lander_pct": 18, "rover_pct": 42 }
  ],
  "stats": {
    "mean_boulder_density_per_100sqm": 12.4,
    "density_vs_baseline_pct": -1.8,
    "avg_model_confidence_pct": 94.6,
    "total_cataloged_hazards": 14820,
    "frames_analyzed": 412
  },
  "ai_insight": "Sector B4 shows 18% lower boulder density than the Shackleton baseline."
}
```

**Frontend integration point:** Call on mount + on `range` state change. The `timeline.detections_per_sol` array will enable implementing a real SVG/canvas line chart inside the existing "Detection Activity Timeline" card placeholder.

---

### 3.6 Mission Overview (`/`) — Live Data

**Current frontend state:** All metrics, detection feed, and mission stats are hardcoded. `overviewHero.coordinates` and `overviewHero.location` fields exist in `demoData.js` but are not yet rendered in `MachineOverview.jsx`. The backend response schema below includes these as top-level fields; frontend wiring to display them must be added during integration.

#### API: Fetch Mission Overview

```
GET /api/v1/mission/overview

Response 200:
{
  "sector_label": "SECTOR 04 // LRO-NAC ORBITAL PASS 419",
  "title": "South Pole Terrain Intelligence",
  "coordinates": "89.4°S 222.7°E",
  "location": "SHACKLETON RIM",
  "hero_image_url": "/media/hero/sector04-latest.png",
  "stats": [
    { "label": "SUN ELEVATION", "value": "1.8°" },
    { "label": "RESOLUTION", "value": "0.50 m/px" },
    { "label": "AI MODEL", "value": "SENTRY-v4.2" }
  ],
  "metrics": [
    { "label": "TOTAL IMAGES ANALYZED", "value": 1482, "badge": "+24 TODAY" },
    { "label": "TOTAL BOULDERS DETECTED", "value": 14920, "badge": "98.4% CONF" },
    { "label": "SAFE LANDING ZONES", "value": 18, "badge": "SLOPE <8°" },
    { "label": "CRITICAL HAZARD ALERTS", "value": 3, "badge": "ACTION REQ", "alert": true }
  ],
  "detection_feed": [
    {
      "id": "B-409",
      "title": "Boulder Cluster #B-409 – 4.2m Diameter",
      "meta": "89.42°S 222.71°E · 14:22:08 UTC",
      "confidence_label": "99.1% CONF",
      "status": "CRITICAL",
      "tone": "critical",
      "timestamp_utc": "2025-02-14T14:22:08Z"
    }
  ],
  "mission_performance_pct": 99.2,
  "avg_inference_ms": 142,
  "area_mapped_sqkm": 412
}
```

---

### 3.7 Notifications (Header Bell)

```
GET /api/v1/notifications?unread=true

Response 200:
{
  "unread_count": 3,
  "notifications": [
    {
      "id": "notif-001",
      "type": "CRITICAL_HAZARD",
      "title": "Critical boulder detected in LZ-18",
      "timestamp_utc": "2025-02-14T14:22:08Z",
      "read": false
    }
  ]
}

PATCH /api/v1/notifications/{id}/read
```

---

## 4. Image & Media Serving Requirements

| Asset Type | Suggested Path | Description |
|---|---|---|
| Annotated detection image | `/media/annotated/{analysis_id}.png` | Boulder frame with bboxes drawn server-side |
| Landing site base map | `/media/maps/site-{id}-base.png` | Static DEM-derived map |
| Landing site layer overlays | `/media/maps/site-{id}-{layer}.png` | Per-layer PNG composites |
| Rover base map | `/media/maps/rover-{sector}-base.png` | Topography map |
| Rover route overlays | `/media/maps/rover-route-{id}.png` | Route path drawn on map |
| HazCam snapshot | `/media/hazcam/latest.jpg` | Latest 24fps frame |
| Hero terrain image | `/media/hero/{sector}-latest.png` | Hero section background |

All media should be served with `Cache-Control: no-cache` for live-updated images, and long-lived caching for static assets.

---

## 5. Authentication

No authentication UI exists in the frontend yet. If auth is required, integrate JWT Bearer tokens:
- Store token in `sessionStorage` (not `localStorage` for security)
- Add `Authorization: Bearer {token}` header to all API calls
- Handle 401 responses with redirect to a login page (page not yet built)

---

## 6. Error Handling Contract

The backend should return structured errors:
```json
{
  "error": "ANALYSIS_FAILED",
  "message": "Image preprocessing failed: unsupported bit depth",
  "code": 422
}
```

The frontend currently shows a `role="alert"` error container in ImageAnalysis; other pages need error state UI added during backend integration.

---

## 7. CORS Configuration

The backend must allow `Origin: http://localhost:5173` during development. For production, configure the appropriate domain.

---

## 8. Summary of Required Endpoints

| Endpoint | Method | Priority | Page |
|---|---|---|---|
| `/api/v1/images/analyze` | POST | P0 | Image Analysis |
| `/api/v1/images/analyze/{id}` | GET | P0 | Image Analysis |
| `/api/v1/detections` | GET | P0 | Boulder Detection |
| `/api/v1/lander-risk` | GET | P0 | Lander Risk |
| `/api/v1/rover/state` | GET | P0 | Rover Navigation |
| `/api/v1/analytics` | GET | P1 | Mission Analytics |
| `/api/v1/mission/overview` | GET | P1 | Mission Overview |
| `/api/v1/notifications` | GET | P2 | Header |
| `/api/v1/notifications/{id}/read` | PATCH | P2 | Header |
| `/ws/rover/telemetry` | WebSocket | P2 | Rover Navigation |

> [!NOTE]
> **Outstanding frontend wiring tasks (to complete during backend integration):**
> 1. Wire `analysis_id` routing: pass via `navigate('/boulder-detection', { state: { analysis_id } })` in `ImageAnalysis.jsx` and read with `useLocation().state` in `BoulderDetection.jsx`.
> 2. Render hazard tags on rover map: add JSX reading `roverNavigation.hazards` (or backend proximity data) using the existing `.hazard-tags` CSS class in `RoverNavigation.jsx`.
> 3. Render `coordinates` and `location` fields in `MachineOverview.jsx` hero section.
> 4. Add skip-to-content `<a href="#main-content">` link in `Layout.jsx` or `index.html`.
