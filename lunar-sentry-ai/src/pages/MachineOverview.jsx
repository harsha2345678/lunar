import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import heroTerrain from '../assets/images/hero-terrain.png';
import {
  overviewHero,
  overviewMetrics,
  detectionFeed,
  missionStats,
  quickNav,
} from '../data/demoData.js';

export default function MachineOverview() {
  const [activeLayer, setActiveLayer] = useState(overviewHero.layerToggles[0]);

  return (
    <div className="page page-overview">
      <section className="hero">
        <img className="hero-bg" src={heroTerrain} alt="Lunar south pole crater terrain" />
        <div className="hero-hud">
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="chip">{overviewHero.location}</span>
            <span className="chip chip-muted">{overviewHero.coordinates}</span>
          </div>
          <div className="layer-toggles">
            {overviewHero.layerToggles.map((lt) => (
              <button
                key={lt}
                type="button"
                className={`layer-toggle${activeLayer === lt ? ' is-active' : ''}`}
                onClick={() => setActiveLayer(lt)}
              >
                {lt}
              </button>
            ))}
          </div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">{overviewHero.sectorLabel}</p>
          <h1 className="hero-title">{overviewHero.title}</h1>
          <p className="hero-description">{overviewHero.description}</p>
        </div>

        <div className="hero-stats">
          {overviewHero.stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="label">{stat.label}</span>
              <span className="value">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="metric-row">
        {overviewMetrics.map((m) => (
          <div key={m.label} className="metric-card">
            <span className="label">{m.label}</span>
            <div className="metric-body">
              <span className={`metric-value${m.alert ? ' is-alert' : ''}`}>{m.value}</span>
              <span className="metric-badge">{m.badge}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="lower-deck">
        <div className="card feed-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">TELEMETRY STREAM</p>
              <h2 className="card-title">Recent Detection Activity</h2>
            </div>
            <span className="tag">UTC LIVE</span>
          </div>
          <ul className="feed-list">
            {detectionFeed.map((item) => (
              <li key={item.id} className="feed-item">
                <span className={`feed-dot tone-bg-${item.tone}`} />
                <div className="feed-text">
                  <p className="feed-title">{item.title}</p>
                  <p className="feed-meta">{item.meta}</p>
                </div>
                <div className="feed-status">
                  <span className={`feed-confidence tone-text-${item.tone}`}>{item.confidence}</span>
                  <span className="feed-tag">{item.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="side-column">
          <div className="card stats-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">SYSTEM PERFORMANCE</p>
                <h2 className="card-title">Mission Statistics</h2>
              </div>
              <span className="stat-highlight">{missionStats.performance}</span>
            </div>
            <div className="stat-tiles">
              <div className="stat-tile">
                <span className="label">AVG INFERENCE</span>
                <span className="value">{missionStats.avgInference}</span>
              </div>
              <div className="stat-tile">
                <span className="label">AREA MAPPED</span>
                <span className="value">{missionStats.areaMapped}</span>
              </div>
            </div>
          </div>

          <div className="card quick-card">
            <p className="eyebrow">QUICK NAVIGATION</p>
            <div className="quick-grid">
              {quickNav.map((q) => (
                <NavLink key={q.to} to={q.to} className="quick-link">
                  {q.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
