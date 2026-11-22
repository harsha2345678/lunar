import { useState } from 'react';
import { roverNavigation as d } from '../data/demoData.js';
import { RingGauge } from '../components/Shared.jsx';
import roverMap from '../assets/images/rover-map.png';
import hazcam from '../assets/images/hazcam.png';

export default function RoverNavigation() {
  const [route, setRoute] = useState('primary');
  const [hud, setHud] = useState({ contours: true, hazards: true, grid: false });

  return (
    <div className="page page-rover">
      <section className="top-strip card">
        <span className="chip">{d.breadcrumb}</span>
        <span className="chip chip-live">
          <span className="status-dot" />
          {d.status}
        </span>
        <span className="chip chip-muted">{d.position}</span>
      </section>

      <section className="split-main">
        <div className="split-left">
          <div className="card viewport-card">
            <div className="viewport-hud">
              <span className="chip">SECTOR 7G TOPOGRAPHY</span>
              <span className="chip chip-muted">1:2500</span>
              <div className="layer-toggles">
                {[
                  ['contours', 'CONTOURS'],
                  ['hazards', 'HAZARDS'],
                  ['grid', 'GRID'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`layer-toggle${hud[key] ? ' is-active' : ''}`}
                    onClick={() => setHud((s) => ({ ...s, [key]: !s[key] }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rover-stage">
              <img className="rover-stage-img" src={roverMap} alt="Sector 7G lunar terrain map with rover route and hazards" />
              {hud.hazards && (
                <div className="hazard-tags">
                  {d.hazards.map((h) => (
                    <span key={h} className="tag tone-text-critical">{h}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="legend-row">
              <span className="legend-item"><span className="feed-dot tone-bg-nominal" />Rover Position</span>
              <span className="legend-item"><span className="feed-dot tone-bg-processed" />Primary Route</span>
              <span className="legend-item"><span className="feed-dot tone-bg-elevated" />Alt Route B</span>
              <span className="legend-item"><span className="feed-dot tone-bg-critical" />Boulder Hazard</span>
            </div>
            <div className="kinematics">
              <span className="chip chip-muted">VEL: {d.kinematics.vel}</span>
              <span className="chip chip-muted">HDG: {d.kinematics.hdg}</span>
              <span className="chip chip-muted">PITCH: {d.kinematics.pitch}</span>
            </div>
          </div>

          <div className="rover-bottom">
            <div className="card">
              <div className="card-header">
                <p className="eyebrow">WAYPOINT QUEUE</p>
                <span className="tag">3 REMAINING</span>
              </div>
              <div className="zone-list">
                {d.waypoints.map((w) => (
                  <div key={w.id} className="zone-item">
                    <span className="feed-title">{w.id}</span>
                    <span className="feed-meta">{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <p className="eyebrow">REGOLITH TRACTION</p>
              <p className="feed-title">{d.traction}</p>
              <p className="demo-note">Route previews only. No rover commands or live telemetry.</p>
            </div>
          </div>
        </div>

        <div className="split-right">
          <div className="card gauge-card">
            <p className="eyebrow">ROVER RISK SCORE</p>
            <div className="gauge-wrap">
              <RingGauge value={d.riskScore.value} max={d.riskScore.max} size={120} stroke={10} color="#00d9ff" />
              <div className="gauge-center">
                <span className="gauge-value">{d.riskScore.value}</span>
                <span className="gauge-max">/ {d.riskScore.max}</span>
              </div>
            </div>
            <p className="tone-text-nominal status-line">{d.riskScore.status}</p>
          </div>

          <div className="card">
            <div className="card-header">
              <p className="eyebrow">OBSTACLE PROXIMITY</p>
              <span className="tag tone-text-elevated">{d.obstacle.status}</span>
            </div>
            <p className="feed-title">Nearest Hazard: {d.obstacle.nearest}</p>
            <p className="feed-meta">{d.obstacle.detail}</p>
          </div>

          <div className="card">
            <p className="eyebrow">SAFE ROUTE RECOMMENDATIONS</p>
            <div className="route-list">
              {d.routes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`route-option${route === r.id ? ' is-selected' : ''}`}
                  onClick={() => setRoute(r.id)}
                >
                  <span className="route-head">
                    <span className="feed-title">{r.name}</span>
                    <span className="tag">{r.tag}</span>
                  </span>
                  <span className="route-stats">
                    <span>Distance: {r.distance}</span>
                    <span>Risk: {r.risk}</span>
                    <span>ETA: {r.eta}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="eyebrow">FWD HAZCAM // LIVE · 24 FPS</p>
            <div className="hazcam-frame">
              <img src={hazcam} alt="Forward HazCam live feed" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
