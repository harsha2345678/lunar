import { useState } from 'react';
import { landerRisk as d } from '../data/demoData.js';
import { Pill, RingGauge } from '../components/Shared.jsx';
import landerMap from '../assets/images/lander-map.png';

export default function LanderRisk() {
  const [layer, setLayer] = useState('All Layers');
  const [copied, setCopied] = useState(false);

  async function copyCoords() {
    try {
      await navigator.clipboard.writeText(d.coordinates);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="page page-lander">
      <section className="top-strip card">
        <span className="chip">{d.breadcrumb}</span>
        <span className="chip chip-muted">{d.context.site}</span>
        <span className="chip chip-muted">{d.context.resolution}</span>
      </section>

      <section className="split-main">
        <div className="split-left">
          <div className="card viewport-card">
            <div className="card-header">
              <h2 className="card-title">Landing Site Visualization &amp; Zone Map</h2>
              <div className="pill-row">
                {d.mapLayers.map((l) => (
                  <Pill key={l} active={layer === l} onClick={() => setLayer(l)}>
                    {l}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="lander-stage">
              <img className="lander-stage-img" src={landerMap} alt="Landing site zone map with safe, caution and high-risk areas" />
            </div>
          </div>
        </div>

        <div className="split-right">
          <div className="card gauge-card">
            <p className="eyebrow">LANDING SAFETY SCORE</p>
            <div className="gauge-wrap">
              <RingGauge value={d.score.value} max={d.score.max} size={140} stroke={12} color="#00d9ff" />
              <div className="gauge-center">
                <span className="gauge-value">{d.score.value}</span>
                <span className="gauge-max">/ {d.score.max}</span>
              </div>
            </div>
            <p className="tone-text-nominal status-line">{d.score.status}</p>
            <p className="metric-note">{d.score.note}</p>
            <div className="meta-grid">
              <div className="meta-cell">
                <span className="label">CONFIDENCE</span>
                <span className="meta-value">{d.confidence}</span>
              </div>
              <div className="meta-cell">
                <span className="label">HAZARD DENSITY</span>
                <span className="meta-value">{d.hazardDensity}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="eyebrow">RECOMMENDED COORDINATES</p>
            <div className="coord-row">
              <span className="coord-value">{d.coordinates}</span>
              <button type="button" className="btn" onClick={copyCoords}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <p className="eyebrow">LANDER LEG CLEARANCE (4-LEG)</p>
              <span className="tag tone-text-nominal">{d.legs.summary}</span>
            </div>
            <div className="meta-grid">
              <div className="meta-cell">
                <span className="label">MIN CLEARANCE</span>
                <span className="meta-value">{d.legs.minClearance}</span>
              </div>
              <div className="meta-cell">
                <span className="label">MAX ROCK HT</span>
                <span className="meta-value">{d.legs.maxRockHeight}</span>
              </div>
              <div className="meta-cell">
                <span className="label">TERRAIN SLOPE</span>
                <span className="meta-value">{d.legs.terrainSlope}</span>
              </div>
            </div>
            <div className="leg-row">
              {d.legs.status.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="eyebrow">SAFE ZONE RECOMMENDATIONS</p>
            <div className="zone-list">
              {d.zones.map((z) => (
                <div key={z.name} className="zone-item">
                  <div>
                    <p className="feed-title">{z.name}</p>
                    <p className="feed-meta">{z.detail}</p>
                  </div>
                  <span className="tag">{z.tag}</span>
                </div>
              ))}
            </div>
            <p className="demo-note">Safety scores and landing zones are illustrative, not flight clearance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
