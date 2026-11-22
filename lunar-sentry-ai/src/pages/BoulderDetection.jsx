import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { boulderDetection as d } from '../data/demoData.js';
import { MetricCard, Pill } from '../components/Shared.jsx';
import boulderFrame from '../assets/images/boulder-frame.png';

const TONE = { Critical: 'critical', Moderate: 'elevated', Low: 'nominal' };

function matchesFilter(b, filter) {
  if (filter === 'All') return true;
  if (filter === 'Conf > 85%') return parseFloat(b.conf) > 85;
  return b.hazard === filter;
}

export default function BoulderDetection() {
  const location = useLocation();
  const analysisId = location.state?.analysis_id;
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const rows = d.boulders.filter((b) => matchesFilter(b, filter));

  return (
    <div className="page page-boulder">
      <section className="metric-strip">
        <MetricCard label={d.metrics.count.label} value={d.metrics.count.value} note={d.metrics.count.note} />
        <MetricCard
          label={d.metrics.averageSize.label}
          value={d.metrics.averageSize.value}
          unit={d.metrics.averageSize.unit}
          note={d.metrics.averageSize.note}
        />
        <MetricCard
          label={d.metrics.maxDiameter.label}
          value={d.metrics.maxDiameter.value}
          unit={d.metrics.maxDiameter.unit}
          note={d.metrics.maxDiameter.note}
        />
        <div className="card metric-tile">
          <span className="label">HAZARD CLASSIFICATION BREAKDOWN</span>
          <div className="hazard-bar">
            {d.hazardBreakdown.map((h) => (
              <span key={h.label} className={`hazard-seg tone-bg-${h.tone}`} style={{ flex: parseFloat(h.pct) }} />
            ))}
          </div>
          <div className="hazard-legend">
            {d.hazardBreakdown.map((h) => (
              <span key={h.label} className="hazard-legend-item">
                <span className={`feed-dot tone-bg-${h.tone}`} />
                {h.label} <strong>{h.count}</strong> ({h.pct})
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="split-main">
        <div className="split-left">
          <div className="card viewport-card">
            <div className="viewport-hud">
              <span className="chip">{analysisId || d.frame.id}</span>
              <span className="chip chip-muted">{d.frame.resolution}</span>
              <span className="chip chip-muted">{d.frame.coords}</span>
              <span className="chip chip-muted">Model: {d.model}</span>
            </div>
            <div className="boulder-stage">
              <img className="boulder-stage-img" src={boulderFrame} alt={d.frame.id} />
              {d.boulders.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`bbox tone-border-${TONE[b.hazard]}${selected === b.id ? ' is-selected' : ''}`}
                  style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, height: `${b.h}%` }}
                  onClick={() => setSelected(b.id)}
                  aria-label={`${b.id}, ${b.hazard}, ${b.conf} confidence`}
                >
                  <span className="bbox-label">
                    {b.id} · {b.conf}
                  </span>
                </button>
              ))}
            </div>
            <div className="legend-row">
              <span className="legend-item"><span className="feed-dot tone-bg-critical" />Critical (&gt;3.0m)</span>
              <span className="legend-item"><span className="feed-dot tone-bg-elevated" />Moderate (1.5–3.0m)</span>
              <span className="legend-item"><span className="feed-dot tone-bg-nominal" />Low (&lt;1.5m)</span>
              <span className="legend-item muted">Click any bounding box to inspect</span>
            </div>
          </div>
        </div>

        <div className="split-right">
          <div className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">{d.sector}</p>
                <h2 className="card-title">Detection Results</h2>
                <p className="metric-note">Filter &amp; inspect classified lunar boulders</p>
              </div>
              <span className="tag">Showing {rows.length} of {d.boulders.length}</span>
            </div>

            <div className="pill-row">
              {d.filters.map((f) => (
                <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </Pill>
              ))}
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>BOULDER ID</th>
                    <th>LAT / LON</th>
                    <th>DIA (M)</th>
                    <th>CONF</th>
                    <th>HAZARD</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr
                      key={b.id}
                      className={selected === b.id ? 'is-selected' : ''}
                      onClick={() => setSelected(b.id)}
                    >
                      <td>{b.id}</td>
                      <td>{b.lat}, {b.lon}</td>
                      <td>{b.dia}</td>
                      <td>{b.conf}</td>
                      <td className={`tone-text-${TONE[b.hazard]}`}>{b.hazard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="metric-note">{d.sector} · Filters apply to the six-item sample.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
