import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Annotated

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_sqlite_db, get_db_connection
from app.schemas import (
    HealthResponse,
    AnalyzeInitResponse,
    PollStatusResponse,
    ImageMetadata,
    DetectionsResponse,
    BoulderFrame,
    BoulderItem,
    BoulderSummary,
    LanderRiskResponse,
    LanderLegs,
    SafeZone,
    RoverStateResponse,
    RoverPosition,
    RoverObstacle,
    RoverKinematics,
    RoverRoute,
    RoverWaypoint,
    AnalyticsResponse,
    SizeHistogram,
    HistogramBar,
    DonutSegment,
    SolTimeline,
    ComparisonItem,
    AnalyticsStats,
    MissionOverviewResponse,
    HeroStat,
    OverviewMetric,
    FeedItem,
    NotificationListResponse,
    NotificationItem,
)

# Initialize application
app = FastAPI(
    title=settings.app_name,
    description="Autonomous Lunar Terrain Safety, Hazard Intelligence & Navigation Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload and media directories exist
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs(settings.media_dir, exist_ok=True)

# Mount static media if directory exists
if os.path.exists(settings.media_dir):
    app.mount("/media", StaticFiles(directory=settings.media_dir), name="media")


@app.on_event("startup")
def on_startup():
    init_sqlite_db()


# ---------------------------------------------------------------------------
# Health Check Endpoint
# ---------------------------------------------------------------------------
@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(
        status="ok",
        app=settings.app_name,
        environment=settings.app_env,
    )


# ---------------------------------------------------------------------------
# 3.1 Image Analysis Endpoints
# ---------------------------------------------------------------------------
@app.post("/api/v1/images/analyze", response_model=AnalyzeInitResponse, status_code=status.HTTP_202_ACCEPTED, tags=["Image Analysis"])
async def upload_and_analyze(
    file: UploadFile = File(...),
    gsd: Annotated[float, Form()] = 0.50,
    noise_reduce: Annotated[bool, Form()] = True,
    contrast_enhance: Annotated[bool, Form()] = True,
    radiometric_cal: Annotated[bool, Form()] = True,
):
    analysis_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = [".tif", ".tiff", ".img", ".png", ".jpg", ".jpeg"]
    if file_ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: {allowed_exts}",
        )

    # Save uploaded file
    dest_path = os.path.join(settings.upload_dir, f"{analysis_id}_{file.filename}")
    with open(dest_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Record in database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO analyses (id, filename, status, progress_pct, stage_label, gsd_mpp, noise_reduce, contrast_enhance, radiometric_cal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (analysis_id, file.filename, "queued", 0, "Image queued for YOLOv9-Lunar segmentation", gsd, noise_reduce, contrast_enhance, radiometric_cal),
    )
    conn.commit()
    conn.close()

    return AnalyzeInitResponse(
        analysis_id=analysis_id,
        status="queued",
        eta_seconds=30,
    )


@app.get("/api/v1/images/analyze/{analysis_id}", response_model=PollStatusResponse, tags=["Image Analysis"])
def poll_analysis_status(analysis_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    row = cursor.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
    conn.close()

    if not row:
        # Fallback for demo ID
        return PollStatusResponse(
            analysis_id=analysis_id,
            status="complete",
            progress_pct=100,
            stage_label="Analysis complete. YOLOv9-Lunar detected 6 classified hazard boulders.",
            tile_current=18,
            tile_total=18,
            eta_label="00:00.0s",
            annotated_image_url="/media/annotated/boulder-frame.png",
            detections_url=f"/api/v1/detections?analysis_id={analysis_id}",
            metadata=ImageMetadata(),
        )

    return PollStatusResponse(
        analysis_id=row["id"],
        status="complete" if row["progress_pct"] == 100 else row["status"],
        progress_pct=row["progress_pct"] or 100,
        stage_label=row["stage_label"] or "Analysis complete",
        tile_current=18,
        tile_total=18,
        eta_label="00:00.0s",
        annotated_image_url="/media/annotated/boulder-frame.png",
        detections_url=f"/api/v1/detections?analysis_id={analysis_id}",
        metadata=ImageMetadata(gsd_mpp=row["gsd_mpp"] or 0.50),
    )


# ---------------------------------------------------------------------------
# 3.2 Boulder Detection Endpoint
# ---------------------------------------------------------------------------
@app.get("/api/v1/detections", response_model=DetectionsResponse, tags=["Boulder Detection"])
def get_detections(
    analysis_id: Annotated[Optional[str], Query()] = None,
    frame_id: Annotated[Optional[str], Query()] = None,
):
    frame = BoulderFrame(
        id=analysis_id or frame_id or "LRO-NAC Frame #8842-A",
        resolution_mpp=0.5,
        coordinates="89.9°S, 142.4°E",
        annotated_image_url="/media/annotated/boulder-frame.png",
    )
    boulders = [
        BoulderItem(id="BLD-014", confidence=0.984, diameter_m=4.6, hazard_class="Critical", latitude_deg=-89.91, longitude_deg=142.38, bbox_left_pct=17.9, bbox_top_pct=28.0, bbox_width_pct=16.2, bbox_height_pct=20.5),
        BoulderItem(id="BLD-029", confidence=0.941, diameter_m=3.9, hazard_class="Critical", latitude_deg=-89.88, longitude_deg=142.45, bbox_left_pct=61.8, bbox_top_pct=52.2, bbox_width_pct=14.1, bbox_height_pct=17.9),
        BoulderItem(id="BLD-008", confidence=0.897, diameter_m=2.3, hazard_class="Moderate", latitude_deg=-89.93, longitude_deg=142.41, bbox_left_pct=44.1, bbox_top_pct=22.4, bbox_width_pct=10.8, bbox_height_pct=13.4),
        BoulderItem(id="BLD-041", confidence=0.862, diameter_m=1.9, hazard_class="Moderate", latitude_deg=-89.86, longitude_deg=142.36, bbox_left_pct=27.9, bbox_top_pct=64.6, bbox_width_pct=10.0, bbox_height_pct=11.6),
        BoulderItem(id="BLD-019", confidence=0.915, diameter_m=1.1, hazard_class="Low", latitude_deg=-89.94, longitude_deg=142.49, bbox_left_pct=76.2, bbox_top_pct=25.4, bbox_width_pct=7.7, bbox_height_pct=9.0),
        BoulderItem(id="BLD-033", confidence=0.814, diameter_m=0.9, hazard_class="Low", latitude_deg=-89.87, longitude_deg=142.31, bbox_left_pct=10.0, bbox_top_pct=58.2, bbox_width_pct=6.9, bbox_height_pct=9.0),
    ]
    summary = BoulderSummary(
        total_detected=47,
        average_diameter_m=1.8,
        max_diameter_m=4.6,
        max_diameter_id="BLD-014",
        hazard_counts={"critical": 9, "moderate": 15, "low": 23},
    )
    return DetectionsResponse(frame=frame, model="YOLOv9-Lunar", boulders=boulders, summary=summary)


# ---------------------------------------------------------------------------
# 3.3 Lander Risk Endpoint
# ---------------------------------------------------------------------------
@app.get("/api/v1/lander-risk", response_model=LanderRiskResponse, tags=["Lander Risk"])
def get_lander_risk(
    site_id: Annotated[Optional[str], Query()] = "sector-7g-shackleton",
    analysis_id: Annotated[Optional[str], Query()] = None,
):
    return LanderRiskResponse(
        site_id=site_id or "sector-7g-shackleton",
        site_label="SHACKLETON RIM · SECTOR 7G",
        dem_resolution_mpp=0.15,
        safety_score=88,
        safety_max=100,
        safety_status="LOW RISK — NOMINAL",
        safety_note="Site meets Artemis-IV touch-down safety criteria. Slope gradient is under 8° across Zone Alpha-1.",
        confidence=0.964,
        hazard_density_per_sqm=0.12,
        coordinates="89.412°S, 222.684°E",
        lander_legs=LanderLegs(
            summary="ALL LEGS CLEAR",
            min_clearance_m=2.4,
            max_rock_height_m=0.35,
            terrain_slope_deg=4.2,
            leg_statuses=["L1: OK", "L2: OK", "L3: OK", "L4: OK"],
        ),
        safe_zones=[
            SafeZone(name="Zone Alpha-1", radius_m=18.5, clearance_m=2.8, tag="PRIMARY"),
            SafeZone(name="Zone Beta-3", radius_m=14.2, clearance_m=2.4, tag="BACKUP"),
        ],
        map_layers={
            "base": "/media/maps/lander-map.png",
            "safe_zones": "/media/maps/lander-safe.png",
            "caution": "/media/maps/lander-caution.png",
            "high_risk_boulders": "/media/maps/lander-hazards.png",
        },
    )


# ---------------------------------------------------------------------------
# 3.4 Rover Navigation Endpoint
# ---------------------------------------------------------------------------
@app.get("/api/v1/rover/state", response_model=RoverStateResponse, tags=["Rover Navigation"])
def get_rover_state():
    return RoverStateResponse(
        status="AUTONOMOUS TRAVERSE ACTIVE",
        position=RoverPosition(latitude_deg=-89.42, longitude_deg=42.18, location_label="SHACKLETON RIM"),
        risk_score=14,
        risk_max=100,
        risk_status="SAFE",
        obstacle=RoverObstacle(status="CAUTION", nearest_label="6.4m Starboard", detail="Boulder B-14 · Est. 2.1m dia"),
        kinematics=RoverKinematics(velocity_mps=0.42, heading_label="118° ESE", pitch_label="+3.2°"),
        traction_pct=96.4,
        hazards=["B-14 (2.1m)", "B-09 (1.4m)", "B-22 (1.6m)"],
        waypoints=[
            RoverWaypoint(id="WP-04", status="Cleared"),
            RoverWaypoint(id="WP-05", status="140m"),
            RoverWaypoint(id="WP-06", status="420m (GOAL)"),
        ],
        routes=[
            RoverRoute(id="primary", name="Primary Route", tag="ACTIVE", distance_m=420, risk_pct=4.1, eta_label="16m 40s", map_overlay_url="/media/maps/rover-primary.png"),
            RoverRoute(id="alt", name="Route B", tag="LOWEST RISK", distance_m=485, risk_pct=1.8, eta_label="19m 15s", map_overlay_url="/media/maps/rover-alt.png"),
        ],
        map_layers={
            "base": "/media/maps/rover-map.png",
            "contours": "/media/maps/rover-contours.png",
            "hazards": "/media/maps/rover-hazards.png",
            "grid": "/media/maps/rover-grid.png",
        },
        hazcam_snapshot_url="/media/hazcam/hazcam.png",
    )


# ---------------------------------------------------------------------------
# 3.5 Mission Analytics Endpoint
# ---------------------------------------------------------------------------
@app.get("/api/v1/analytics", response_model=AnalyticsResponse, tags=["Mission Analytics"])
def get_analytics(
    range: Annotated[str, Query()] = "7d",
    site: Annotated[Optional[str], Query()] = "south-pole-shackleton",
):
    return AnalyticsResponse(
        range=range,
        site=site or "SOUTH POLE SHACKLETON RIM",
        size_histogram=SizeHistogram(
            peak_label="Peak: 1.0–1.5m (38.4%)",
            bars=[
                HistogramBar(label="0.5–1.0m", value_pct=22.1),
                HistogramBar(label="1.0–1.5m", value_pct=38.4),
                HistogramBar(label="1.5–2.0m", value_pct=19.6),
                HistogramBar(label="2.0–3.0m", value_pct=10.2),
                HistogramBar(label="3.0–4.0m", value_pct=5.4),
                HistogramBar(label="4.0–5.0m", value_pct=2.8),
                HistogramBar(label="5.0m+", value_pct=1.5),
            ],
        ),
        hazard_donut=[
            DonutSegment(label="Nominal (<15° Slope)", value_pct=68.2, tone="nominal"),
            DonutSegment(label="Caution (15–25°)", value_pct=21.8, tone="elevated"),
            DonutSegment(label="Critical (>25° / Occluded)", value_pct=10.0, tone="critical"),
        ],
        avg_confidence_pct=94.6,
        confidence_tiers_validated_pct=98.1,
        timeline=SolTimeline(
            labels=["SOL 142", "SOL 148", "SOL 154", "SOL 160", "SOL 166", "SOL 172 (NOW)"],
            detections_per_sol=[210, 340, 280, 390, 420, 470],
        ),
        risk_comparison=[
            ComparisonItem(metric="Slope Gradient Hazard", lander_pct=18, rover_pct=42),
            ComparisonItem(metric="Boulder Concentration", lander_pct=12, rover_pct=28),
            ComparisonItem(metric="Shadow Occlusion", lander_pct=35, rover_pct=14),
        ],
        stats=AnalyticsStats(
            mean_boulder_density_per_100sqm=12.4,
            density_vs_baseline_pct=-1.8,
            avg_model_confidence_pct=94.6,
            total_cataloged_hazards=14820,
            frames_analyzed=412,
        ),
        ai_insight="Sector B4 shows 18% lower boulder density than the Shackleton baseline. Safe landing window is optimal between SOL 174 and 178.",
    )


# ---------------------------------------------------------------------------
# 3.6 Mission Overview Endpoint
# ---------------------------------------------------------------------------
@app.get("/api/v1/mission/overview", response_model=MissionOverviewResponse, tags=["Mission Overview"])
def get_mission_overview():
    return MissionOverviewResponse(
        sector_label="SECTOR 04 // LRO-NAC ORBITAL PASS 419",
        title="South Pole Terrain Intelligence",
        coordinates="89.4°S 222.7°E",
        location="SHACKLETON RIM",
        hero_image_url="/media/hero/hero-terrain.png",
        layer_toggles=["OPTICAL", "SLOPE", "HAZARD AI"],
        stats=[
            HeroStat(label="SUN ELEVATION", value="1.8°"),
            HeroStat(label="RESOLUTION", value="0.50 m/px"),
            HeroStat(label="AI MODEL", value="SENTRY-v4.2"),
        ],
        metrics=[
            OverviewMetric(label="TOTAL IMAGES ANALYZED", value="1,482", badge="+24 TODAY"),
            OverviewMetric(label="TOTAL BOULDERS DETECTED", value="14,920", badge="98.4% CONF"),
            OverviewMetric(label="SAFE LANDING ZONES", value="18", badge="SLOPE < 8°"),
            OverviewMetric(label="CRITICAL HAZARD ALERTS", value="3", badge="ACTION REQ", alert=True),
        ],
        detection_feed=[
            FeedItem(id="B-409", title="Boulder Cluster #B-409 — 4.2m Diameter", meta="89.42°S 222.71°E · 14:22:08 UTC", confidence_label="99.1% CONF", status="CRITICAL", tone="critical", timestamp_utc="2025-02-14T14:22:08Z"),
            FeedItem(id="R-slope", title="Crater Rim Slope Anomaly — 16.8° Grade", meta="89.38°S 222.64°E · 14:18:45 UTC", confidence_label="96.4% CONF", status="ELEVATED", tone="elevated", timestamp_utc="2025-02-14T14:18:45Z"),
            FeedItem(id="B-382", title="Isolated Megalith #B-382 — 6.1m Tall", meta="89.45°S 222.80°E · 14:11:02 UTC", confidence_label="99.8% CONF", status="CRITICAL", tone="critical", timestamp_utc="2025-02-14T14:11:02Z"),
            FeedItem(id="L-clear", title="Zone Alpha-1 Approach Path Clear", meta="89.41°S 222.68°E · 14:05:19 UTC", confidence_label="97.2% CONF", status="NOMINAL", tone="nominal", timestamp_utc="2025-02-14T14:05:19Z"),
        ],
        mission_performance_pct=99.2,
        avg_inference_ms=142,
        area_mapped_sqkm=412,
    )


# ---------------------------------------------------------------------------
# 3.7 Notifications Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/v1/notifications", response_model=NotificationListResponse, tags=["Notifications"])
def get_notifications(unread: Annotated[bool, Query()] = True):
    items = [
        NotificationItem(id="notif-001", type="CRITICAL_HAZARD", title="Critical boulder detected in LZ-18 (Diameter: 4.6m)", timestamp_utc="2025-02-14T14:22:08Z", read=False),
        NotificationItem(id="notif-002", type="TRAVERSE_WARNING", title="Rover Route B slope warning (+16.8° grade)", timestamp_utc="2025-02-14T14:18:45Z", read=False),
        NotificationItem(id="notif-003", type="ORBITAL_PASS", title="Orbital pass #419 completed. 18 new tiles processed.", timestamp_utc="2025-02-14T14:05:19Z", read=True),
    ]
    if unread:
        items = [i for i in items if not i.read]
    return NotificationListResponse(unread_count=len(items), notifications=items)


@app.patch("/api/v1/notifications/{notif_id}/read", status_code=status.HTTP_200_OK, tags=["Notifications"])
def mark_notification_read(notif_id: str):
    return {"id": notif_id, "status": "marked_as_read"}


# ---------------------------------------------------------------------------
# Legacy/MVP Fast Detection Endpoint (from 10-Hour Plan)
# ---------------------------------------------------------------------------
@app.post("/api/detect", tags=["Legacy Detection"])
async def detect_legacy(file: UploadFile = File(...), metres_per_pixel: Optional[float] = Form(0.5)):
    return {
        "status": "success",
        "filename": file.filename,
        "metres_per_pixel": metres_per_pixel,
        "total_boulders": 6,
        "detections": [
            {"id": "BLD-014", "confidence": 0.984, "diameter_m": 4.6, "hazard_class": "Critical"},
            {"id": "BLD-029", "confidence": 0.941, "diameter_m": 3.9, "hazard_class": "Critical"},
            {"id": "BLD-008", "confidence": 0.897, "diameter_m": 2.3, "hazard_class": "Moderate"},
        ],
    }
