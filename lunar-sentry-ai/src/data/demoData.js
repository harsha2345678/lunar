// Static values copied from the Figma prototype.
// These are fixed design values for demonstration only. They are not live mission data
// and are not produced by any AI model.

export const NAV_ITEMS = [
  { to: '/', label: 'Mission Overview' },
  { to: '/image-analysis', label: 'Image Analysis' },
  { to: '/boulder-detection', label: 'Boulder Detection' },
  { to: '/lander-risk', label: 'Lander Risk' },
  { to: '/rover-navigation', label: 'Rover Navigation' },
  { to: '/mission-analytics', label: 'Mission Analytics' },
];

/* ---------- Mission Overview ---------- */

export const overviewHero = {
  sectorLabel: 'SECTOR 04 // LRO-NAC ORBITAL PASS 419',
  title: 'South Pole Terrain Intelligence',
  description:
    'Autonomous boulder segmentation and slope-stability telemetry across permanently shadowed crater rims.',
  coordinates: '89.4°S 222.7°E',
  location: 'SHACKLETON RIM',
  layerToggles: ['OPTICAL', 'SLOPE', 'HAZARD AI'],
  stats: [
    { label: 'SUN ELEVATION', value: '1.8°' },
    { label: 'RESOLUTION', value: '0.50 m/px' },
    { label: 'AI MODEL', value: 'SENTRY-v4.2' },
  ],
};

export const overviewMetrics = [
  { label: 'TOTAL IMAGES ANALYZED', value: '1,482', badge: '+24 TODAY' },
  { label: 'TOTAL BOULDERS DETECTED', value: '14,920', badge: '98.4% CONF' },
  { label: 'SAFE LANDING ZONES', value: '18', badge: 'SLOPE < 8°' },
  { label: 'CRITICAL HAZARD ALERTS', value: '3', badge: 'ACTION REQ', alert: true },
];

export const detectionFeed = [
  {
    id: 'B-409',
    title: 'Boulder Cluster #B-409 — 4.2m Diameter',
    meta: '89.42°S 222.71°E · 14:22:08 UTC',
    confidence: '99.1% CONF',
    status: 'CRITICAL',
    tone: 'critical',
  },
  {
    id: 'R-slope',
    title: 'Crater Rim Slope Anomaly — 16.8° Grade',
    meta: '89.38°S 222.64°E · 14:18:45 UTC',
    confidence: '94.6% CONF',
    status: 'ELEVATED',
    tone: 'elevated',
  },
  {
    id: 'LZ-18',
    title: 'Landing Zone LZ-18 Verified Clear',
    meta: '89.45°S 222.80°E · 14:11:19 UTC',
    confidence: '97.8% CONF',
    status: 'NOMINAL',
    tone: 'nominal',
  },
  {
    id: 'LRO-419B',
    title: 'LRO-NAC Frame #419-B Ingested',
    meta: '89.40°S 222.70°E · 14:04:52 UTC',
    confidence: '100% SYNC',
    status: 'PROCESSED',
    tone: 'processed',
  },
];

export const missionStats = {
  performance: '99.2%',
  avgInference: '142 ms',
  areaMapped: '412 km²',
};

export const quickNav = [
  { to: '/image-analysis', label: 'Image Analysis' },
  { to: '/boulder-detection', label: 'Boulder Detection' },
  { to: '/lander-risk', label: 'Lander Risk' },
  { to: '/rover-navigation', label: 'Rover Navigation' },
];

/* ---------- Image Analysis ---------- */

export const imageAnalysis = {
  breadcrumb: '02 / IMAGE ANALYSIS',
  heading: 'LRO-NAC RAW TILE INGESTION & PREPROCESSING',
  pipeline: 'PIPELINE:',
  gpuCluster: 'GPU CLUSTER:',
  dropzone: {
    title: 'Drop LRO-NAC GeoTIFF or Lunar Surface Tile',
    hint: 'Supports 16-bit GeoTIFF, PDS4 .IMG, or high-contrast PNG up to 2.0 GB',
    button: 'Browse Image',
  },
  activeFile: 'NAC_M1432098412L_SHACKLETON_RIM.TIF',
  activeTags: ['RAW MONOCHROME', 'LAT -89.42°', 'LON +41.18°'],
  preprocessing: [
    { label: 'Noise Reduction', detail: 'Non-local means regolith despeckle' },
    { label: 'Contrast Enhancement', detail: 'CLAHE shadow-edge sharpening' },
    { label: 'Radiometric Calibration', detail: 'Solar incidence I/F normalization' },
  ],
  metadata: [
    { label: 'SENSOR', value: 'LRO-NAC' },
    { label: 'RESOLUTION', value: '4096 × 4096 px' },
    { label: 'CAPTURE TIMESTAMP', value: '2025-02-14 04:12 UTC' },
  ],
  gsd: { label: 'Ground Sample Distance (GSD)', value: '0.50', unit: 'm/px', status: 'CALIBRATED' },
  sunElevation: '11.4° AZ 218°',
  progress: { percent: 78, label: '78% — Running YOLOv8-Lunar Boulder Segmentation', batch: 'TILE BATCH: 14 / 18', eta: 'ETA: 00:04.2s' },
  thumbnails: [
    { name: 'SHACKLETON_RIM.TIF', meta: '4096² px • 0.50 m/px', status: 'ACTIVE' },
    { name: 'MALAPERT_MASSIF.TIF', meta: '4096² px • 0.50 m/px', status: 'HAZARD DETECTED' },
    { name: 'NOBILE_CRATER.TIF', meta: '2048² px • 0.65 m/px', status: 'PROCESSED' },
    { name: 'CABEUS_FLOOR.TIF', meta: '4096² px • 0.50 m/px', status: 'QUEUED' },
  ],
};

/* ---------- Boulder Detection ---------- */

export const boulderDetection = {
  metrics: {
    count: { label: 'TOTAL DETECTED', value: '47', note: '+6 vs T-1' },
    averageSize: { label: 'AVERAGE SIZE', value: '1.8', unit: 'm', note: 'Mean equivalent diameter' },
    maxDiameter: { label: 'MAX DIAMETER', value: '4.6', unit: 'm', note: 'ID: BLD-014 • Critical' },
  },
  sector: 'Sector 04-B • Shackleton Rim',
  hazardBreakdown: [
    { label: 'Critical', count: 9, pct: '19%', tone: 'critical' },
    { label: 'Moderate', count: 15, pct: '32%', tone: 'elevated' },
    { label: 'Low/Benign', count: 23, pct: '49%', tone: 'nominal' },
  ],
  model: 'YOLOv9-Lunar',
  frame: { id: 'LRO-NAC Frame #8842-A', resolution: '0.5m/px', coords: '89.9°S, 142.4°E' },
  boulders: [
    { id: 'BLD-014', conf: '98.4%', dia: '4.6m', hazard: 'Critical', lat: '89.91°S', lon: '142.38°E', left: 17.9, top: 28.0, w: 16.2, h: 20.5 },
    { id: 'BLD-029', conf: '94.1%', dia: '3.9m', hazard: 'Critical', lat: '89.88°S', lon: '142.45°E', left: 61.8, top: 52.2, w: 14.1, h: 17.9 },
    { id: 'BLD-008', conf: '89.7%', dia: '2.3m', hazard: 'Moderate', lat: '89.93°S', lon: '142.41°E', left: 44.1, top: 22.4, w: 10.8, h: 13.4 },
    { id: 'BLD-041', conf: '86.2%', dia: '1.9m', hazard: 'Moderate', lat: '89.86°S', lon: '142.36°E', left: 27.9, top: 64.6, w: 10.0, h: 11.6 },
    { id: 'BLD-019', conf: '91.5%', dia: '1.1m', hazard: 'Low', lat: '89.94°S', lon: '142.49°E', left: 76.2, top: 25.4, w: 7.7, h: 9.0 },
    { id: 'BLD-033', conf: '81.4%', dia: '0.9m', hazard: 'Low', lat: '89.87°S', lon: '142.31°E', left: 10.0, top: 58.2, w: 6.9, h: 9.0 },
  ],
  filters: ['All', 'Critical', 'Moderate', 'Low', 'Conf > 85%'],
};

/* ---------- Lander Risk ---------- */

export const landerRisk = {
  breadcrumb: '04 // LANDER RISK ANALYSIS',
  context: { site: 'SHACKLETON RIM • SECTOR 7G', resolution: 'DEM RES: 0.15m/px' },
  mapLayers: ['All Layers', 'Safe Zones', 'Caution', 'High-Risk Boulders'],
  score: { value: 88, max: 100, status: 'LOW RISK — NOMINAL', note: 'Site meets Artemis-IV touch-down safety criteria with minimal boulder obstruction.' },
  confidence: '96.4%',
  hazardDensity: '0.12/m²',
  coordinates: '89.412°S, 222.684°E',
  legs: {
    summary: 'ALL LEGS CLEAR',
    minClearance: '2.4m',
    maxRockHeight: '0.35m',
    terrainSlope: '4.2°',
    status: ['L1: OK', 'L2: OK', 'L3: OK', 'L4: OK'],
  },
  zones: [
    { name: 'Zone Alpha-1', detail: 'Radius: 18.5m • Clearance: 2.8m', tag: 'PRIMARY' },
    { name: 'Zone Beta-3', detail: 'Radius: 14.2m • Clearance: 2.4m', tag: 'BACKUP' },
  ],
};

/* ---------- Rover Navigation ---------- */

export const roverNavigation = {
  breadcrumb: '05 // NAV-INTEL',
  status: 'AUTONOMOUS TRAVERSE ACTIVE',
  position: '89.42°S, 42.18°E • SHACKLETON RIM',
  riskScore: { value: 14, max: 100, status: 'SAFE' },
  obstacle: { status: 'CAUTION', nearest: '6.4m Starboard', detail: 'Boulder B-14 • Est. 2.1m dia' },
  routes: [
    { id: 'primary', name: 'Primary Route', tag: 'ACTIVE', distance: '420m', risk: '4.1%', eta: '16m 40s' },
    { id: 'alt', name: 'Route B', tag: 'LOWEST RISK', distance: '485m', risk: '1.8%', eta: '19m 15s' },
  ],
  kinematics: { vel: '0.42 m/s', hdg: '118° ESE', pitch: '+3.2°' },
  hazards: ['B-14 (2.1m)', 'B-09 (1.4m)', 'B-22 (1.6m)'],
  waypoints: [
    { id: 'WP-04', status: 'Cleared' },
    { id: 'WP-05', status: '140m' },
    { id: 'WP-06', status: '420m (GOAL)' },
  ],
  traction: '96.4% NOMINAL',
};

/* ---------- Mission Analytics ---------- */

export const missionAnalytics = {
  breadcrumb: '06 / TELEMETRY & INSIGHTS',
  site: 'SOUTH POLE SHACKLETON RIM',
  dateFilters: ['Last 7 Days', 'Last 30 Days', 'Artemis-IV Window'],
  sizeHistogram: {
    peak: 'Peak: 1.0–1.5m (38.4%)',
    bars: [
      { label: '0.5–1.0m', value: 22.1 },
      { label: '1.0–1.5m', value: 38.4 },
      { label: '1.5–2.0m', value: 19.6 },
      { label: '2.0–3.0m', value: 10.2 },
      { label: '3.0–4.0m', value: 5.4 },
      { label: '4.0–5.0m', value: 2.8 },
      { label: '5.0m+', value: 1.5 },
    ],
  },
  hazardDonut: [
    { label: 'Nominal (<15° Slope)', value: 68.2, tone: 'nominal' },
    { label: 'Caution (15–25°)', value: 21.8, tone: 'elevated' },
    { label: 'Critical (>25° / Occluded)', value: 10.0, tone: 'critical' },
  ],
  avgConfidence: '94.6%',
  tiers: '98.1% VALIDATED',
  timeline: { labels: ['SOL 142', 'SOL 148', 'SOL 154', 'SOL 160', 'SOL 166', 'SOL 172 (NOW)'] },
  comparison: [
    { metric: 'Slope Gradient Hazard', lander: 18, rover: 42 },
    { metric: 'Boulder Density Index', lander: 24, rover: 61 },
    { metric: 'Shadow Occlusion Risk', lander: 12, rover: 54 },
  ],
  stats: [
    { label: 'MEAN BOULDER DENSITY', value: '12.4', unit: 'boulders/100m²', note: '-1.8% vs. Shackleton baseline' },
    { label: 'AVG MODEL CONFIDENCE', value: '94.6%', unit: '', note: '+0.9% · YOLOv9-Lunar Ensemble v4.2' },
    { label: 'TOTAL CATALOGED', value: '14,820', unit: 'hazards', note: 'Across 412 LRO NAC frames' },
  ],
  insight: 'Sector B4 shows 18% lower boulder density than the Shackleton baseline.',
};
