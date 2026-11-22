import { useState } from 'react';
import { missionAnalytics as d } from '../data/demoData.js';
import { PageHeader, Pill, MetricCard } from '../components/Shared.jsx';
import aiThumb from '../assets/images/ai-terrain-thumb.png';

const DONUT_COLORS = { nominal: '#00d9ff', elevated: '#ffbb2a', critical: '#ffb4ab' };

function donutSegments(items) {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return items.map((it) => {
    const len = (it.value / 100) * c;
    const seg = {
      key: it.label,
      color: DONUT_COLORS[it.tone],
      dasharray: `${len} ${c - len}`,
      dashoffset: -offset,
    };
    offset += len;
    return seg;
  });
}

export default function MissionAnalytics() {
  const [range, setRange] = useState('Last 7 Days');

  function exportReport() {
    const payload = {
      note: 'Frontend demonstration export. Values are static demo data, not live mission data.',
      range,
      site: d.site,
      stats: d.stats,
      hazardDonut: d.hazardDonut,
      sizeHistogram: d.sizeHistogram,
      comparison: d.comparison,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mission-analytics-demo.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const maxBar = Math.max(...d.sizeHistogram.bars.map((b) => b.value));
  const segments = donutSegments(d.hazardDonut);

  return (
    <div className="page page-analytics">
      <PageHeader eyebrow={d.breadcrumb} title="Mission Analytics & Hazard Telemetry">
        <div className="pill-row">
          {d.dateFilters.map((f) => (
            <Pill key={f} active={range === f} onClick={() => setRange(f)}>
              {f}
            </Pill>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={exportReport}>
          Export Report
        </button>
      </PageHeader>
      <p className="metric-note">{d.site}</p>

      <section className="analytics-grid">
        <div className="card span-7">
          <p className="eyebrow">MORPHOLOGY DISTRIBUTION</p>
          <h2 className="card-title">Boulder Size Distribution (0.5m – 5.0m+)</h2>
          <p className="metric-note">{d.sizeHistogram.peak}</p>
          <div className="histogram">
            {d.sizeHistogram.bars.map((b) => (
              <div key={b.label} className="hist-col">
                <span className="hist-value">{b.value}%</span>
                <span
                  className={`hist-bar${b.value === maxBar ? ' is-peak' : ''}`}
                  style={{ height: `${(b.value / maxBar) * 100}%` }}
                />
                <span className="hist-label">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card span-5">
          <p className="eyebrow">CLASSIFICATION TELEMETRY</p>
          <h2 className="card-title">Confidence &amp; Hazard Breakdown</h2>
          <div className="donut-wrap">
            <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
              <circle cx="80" cy="80" r="52" fill="none" stroke="#262a33" strokeWidth="16" />
              {segments.map((s) => (
                <circle
                  key={s.key}
                  cx="80"
                  cy="80"
                  r="52"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="16"
                  strokeDasharray={s.dasharray}
                  strokeDashoffset={s.dashoffset}
                  transform="rotate(-90 80 80)"
                />
              ))}
            </svg>
            <div className="donut-center">
              <span className="gauge-value">{d.avgConfidence}</span>
              <span className="label">AVG CONF</span>
            </div>
          </div>
          <div className="legend-col">
            {d.hazardDonut.map((h) => (
              <span key={h.label} className="legend-item">
                <span className={`feed-dot tone-bg-${h.tone}`} />
                {h.label} <strong>{h.value}%</strong>
              </span>
            ))}
          </div>
          <p className="tag">MODEL CONFIDENCE TIERS · {d.tiers}</p>
        </div>

        <div className="card span-6">
          <p className="eyebrow">TEMPORAL THROUGHPUT</p>
          <h2 className="card-title">Detection Activity Timeline</h2>
          <div className="timeline-labels">
            {d.timeline.labels.map((l) => (
              <span key={l} className="label">{l}</span>
            ))}
          </div>
          <p className="demo-note">Timeline chart data is not included in this build.</p>
        </div>

        <div className="card span-6">
          <p className="eyebrow">OPERATIONAL RISK MATRIX</p>
          <h2 className="card-title">Lander vs. Rover Risk Comparison</h2>
          <div className="compare-legend">
            <span className="legend-item"><span className="feed-dot tone-bg-nominal" />Lander Zone</span>
            <span className="legend-item"><span className="feed-dot tone-bg-critical" />Rover Corridor</span>
          </div>
          <div className="compare-list">
            {d.comparison.map((c) => (
              <div key={c.metric} className="compare-row">
                <span className="feed-title">{c.metric}</span>
                <div className="compare-bars">
                  <span className="compare-bar tone-bg-nominal" style={{ width: `${c.lander}%` }} />
                  <span className="compare-bar tone-bg-critical" style={{ width: `${c.rover}%` }} />
                </div>
                <span className="feed-meta">{c.lander}% vs {c.rover}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="span-12 stat-cards">
          {d.stats.map((s) => (
            <MetricCard key={s.label} label={s.label} value={s.value} unit={s.unit} note={s.note} />
          ))}
          <div className="card metric-tile">
            <div className="ai-insight">
              <img className="ai-thumb" src={aiThumb} alt="Sector B4 terrain" />
              <div className="ai-insight-text">
                <span className="label">AI TERRAIN INSIGHT</span>
                <p className="feed-title">{d.insight}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="demo-note span-12">Charts show mock, aggregate data. The date filter is for display only in this build.</p>
      </section>
    </div>
  );
}
