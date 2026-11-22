// Small reusable pieces shared by the dashboard pages.

export function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
      </div>
      {children ? <div className="page-header-actions">{children}</div> : null}
    </div>
  );
}

export function MetricCard({ label, value, unit, note, alert }) {
  return (
    <div className="card metric-tile">
      <span className="label">{label}</span>
      <div className="metric-tile-value">
        <span className={`metric-value${alert ? ' is-alert' : ''}`}>{value}</span>
        {unit ? <span className="metric-unit">{unit}</span> : null}
      </div>
      {note ? <span className="metric-note">{note}</span> : null}
    </div>
  );
}

export function AssetPending({ label, className = '' }) {
  return (
    <div className={`asset-pending ${className}`.trim()} role="img" aria-label={label}>
      <span className="asset-pending-text">IMAGE ASSET PENDING UPLOAD</span>
      <span className="asset-pending-sub">{label}</span>
    </div>
  );
}

export function Pill({ active, onClick, children }) {
  return (
    <button type="button" className={`pill${active ? ' is-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label, detail }) {
  return (
    <label className="toggle-row">
      <span className="toggle-text">
        <span className="toggle-label">{label}</span>
        <span className="toggle-detail">{detail}</span>
      </span>
      <input
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`toggle-track${checked ? ' is-on' : ''}`} aria-hidden="true">
        <span className="toggle-knob" />
      </span>
    </label>
  );
}

export function RingGauge({ value, max, size = 120, stroke = 10, color = '#00d9ff' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#262a33" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
