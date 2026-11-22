# Pydantic schemas matching FRONTEND_BACKEND_HANDOFF.md API contracts
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Health
class HealthResponse(BaseModel):
    status: str = "ok"
    app: str
    environment: str

# 3.1 Image Analysis
class AnalyzeInitResponse(BaseModel):
    analysis_id: str
    status: str = "queued"
    eta_seconds: int = 30

class ImageMetadata(BaseModel):
    sensor: str = "LRO-NAC"
    resolution: str = "4096 × 4096 px"
    capture_timestamp: str = "2025-02-14T04:12:00Z"
    gsd_mpp: float = 0.50
    sun_elevation_deg: float = 11.4
    sun_azimuth_deg: float = 218.0

class PollStatusResponse(BaseModel):
    analysis_id: str
    status: str
    progress_pct: int
    stage_label: str
    tile_current: Optional[int] = None
    tile_total: Optional[int] = None
    eta_label: Optional[str] = None
    annotated_image_url: Optional[str] = None
    detections_url: Optional[str] = None
    metadata: Optional[ImageMetadata] = None

# 3.2 Boulder Detection
class BoulderItem(BaseModel):
    id: str
    confidence: float
    diameter_m: float
    hazard_class: str
    latitude_deg: float
    longitude_deg: float
    bbox_left_pct: float
    bbox_top_pct: float
    bbox_width_pct: float
    bbox_height_pct: float

class BoulderFrame(BaseModel):
    id: str
    resolution_mpp: float
    coordinates: str
    annotated_image_url: str
    image_width_px: int = 4096
    image_height_px: int = 4096

class BoulderSummary(BaseModel):
    total_detected: int
    average_diameter_m: float
    max_diameter_m: float
    max_diameter_id: str
    hazard_counts: Dict[str, int]

class DetectionsResponse(BaseModel):
    frame: BoulderFrame
    model: str = "YOLOv9-Lunar"
    boulders: List[BoulderItem]
    summary: BoulderSummary

# 3.3 Lander Risk
class LanderLegs(BaseModel):
    summary: str
    min_clearance_m: float
    max_rock_height_m: float
    terrain_slope_deg: float
    leg_statuses: List[str]

class SafeZone(BaseModel):
    name: str
    radius_m: float
    clearance_m: float
    tag: str

class LanderRiskResponse(BaseModel):
    site_id: str
    site_label: str
    dem_resolution_mpp: float
    safety_score: int
    safety_max: int = 100
    safety_status: str
    safety_note: str
    confidence: float
    hazard_density_per_sqm: float
    coordinates: str
    lander_legs: LanderLegs
    safe_zones: List[SafeZone]
    map_layers: Dict[str, str]

# 3.4 Rover Navigation
class RoverPosition(BaseModel):
    latitude_deg: float
    longitude_deg: float
    location_label: str

class RoverObstacle(BaseModel):
    status: str
    nearest_label: str
    detail: str

class RoverKinematics(BaseModel):
    velocity_mps: float
    heading_label: str
    pitch_label: str

class RoverWaypoint(BaseModel):
    id: str
    status: str

class RoverRoute(BaseModel):
    id: str
    name: str
    tag: str
    distance_m: int
    risk_pct: float
    eta_label: str
    map_overlay_url: str

class RoverStateResponse(BaseModel):
    status: str
    position: RoverPosition
    risk_score: int
    risk_max: int = 100
    risk_status: str
    obstacle: RoverObstacle
    kinematics: RoverKinematics
    traction_pct: float
    hazards: List[str]
    waypoints: List[RoverWaypoint]
    routes: List[RoverRoute]
    map_layers: Dict[str, str]
    hazcam_snapshot_url: str

# 3.5 Mission Analytics
class HistogramBar(BaseModel):
    label: str
    value_pct: float

class SizeHistogram(BaseModel):
    peak_label: str
    bars: List[HistogramBar]

class DonutSegment(BaseModel):
    label: str
    value_pct: float
    tone: str

class SolTimeline(BaseModel):
    labels: List[str]
    detections_per_sol: List[int]

class ComparisonItem(BaseModel):
    metric: str
    lander_pct: int
    rover_pct: int

class AnalyticsStats(BaseModel):
    mean_boulder_density_per_100sqm: float
    density_vs_baseline_pct: float
    avg_model_confidence_pct: float
    total_cataloged_hazards: int
    frames_analyzed: int

class AnalyticsResponse(BaseModel):
    range: str
    site: str
    size_histogram: SizeHistogram
    hazard_donut: List[DonutSegment]
    avg_confidence_pct: float
    confidence_tiers_validated_pct: float
    timeline: SolTimeline
    risk_comparison: List[ComparisonItem]
    stats: AnalyticsStats
    ai_insight: str

# 3.6 Mission Overview
class HeroStat(BaseModel):
    label: str
    value: str

class OverviewMetric(BaseModel):
    label: str
    value: Any
    badge: str
    alert: Optional[bool] = False

class FeedItem(BaseModel):
    id: str
    title: str
    meta: str
    confidence_label: str
    status: str
    tone: str
    timestamp_utc: str

class MissionOverviewResponse(BaseModel):
    sector_label: str
    title: str
    coordinates: str
    location: str
    hero_image_url: str
    layer_toggles: List[str] = ["OPTICAL", "SLOPE", "HAZARD AI"]
    stats: List[HeroStat]
    metrics: List[OverviewMetric]
    detection_feed: List[FeedItem]
    mission_performance_pct: float
    avg_inference_ms: int
    area_mapped_sqkm: int

# 3.7 Notifications
class NotificationItem(BaseModel):
    id: str
    type: str
    title: str
    timestamp_utc: str
    read: bool

class NotificationListResponse(BaseModel):
    unread_count: int
    notifications: List[NotificationItem]
