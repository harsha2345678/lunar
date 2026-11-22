import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageAnalysis as d } from '../data/demoData.js';
import { PageHeader, Toggle } from '../components/Shared.jsx';
import analysisMain from '../assets/images/analysis-main.png';
import thumbShackleton from '../assets/images/thumb-shackleton.png';
import thumbMalapert from '../assets/images/thumb-malapert.png';
import thumbNobile from '../assets/images/thumb-nobile.png';
import thumbCabeus from '../assets/images/thumb-cabeus.png';

const thumbImages = [thumbShackleton, thumbMalapert, thumbNobile, thumbCabeus];

const ACCEPTED_TYPES = [
  'image/tiff',
  'image/png',
  'image/jpeg',
  // .img and .tif may come through as application/octet-stream — we also accept by extension
];

function isAcceptedFile(file) {
  if (!file) return false;
  const ext = file.name.split('.').pop().toLowerCase();
  return (
    ACCEPTED_TYPES.includes(file.type) ||
    ['tif', 'tiff', 'img', 'png', 'jpg', 'jpeg'].includes(ext)
  );
}

export default function ImageAnalysis() {
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState(d.activeFile);
  const [gsd, setGsd] = useState(d.gsd.value);
  const [toggles, setToggles] = useState({ noise: true, contrast: true, radiometric: true });
  const [activeThumb, setActiveThumb] = useState(0);
  const [progress, setProgress] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const queue = d.thumbnails;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (progress === null) return undefined;
    if (progress >= 100) return undefined;
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 5)), 300);
    return () => clearTimeout(t);
  }, [progress]);

  function handleFile(file) {
    if (!file) return;
    if (!isAcceptedFile(file)) {
      setFileError(`Unsupported file type "${file.name}". Accepted: GeoTIFF, PDS4 .IMG, PNG, JPEG.`);
      return;
    }
    setFileError('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setProgress(null);
  }

  function removeImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileName('');
    setProgress(null);
    setFileError('');
  }

  function selectThumb(i) {
    setActiveThumb(i);
    setPreviewUrl(null);
    setFileName(queue[i].name);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function onDragLeave() {
    setDragOver(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  const hasImage = previewUrl || fileName;

  return (
    <div className="page page-analysis">
      <PageHeader eyebrow={d.breadcrumb} title={d.heading} />

      <div className="split-main">
        <div className="split-left">
          <div
            className={`card dropzone${dragOver ? ' drag-over' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="region"
            aria-label="Image upload dropzone"
          >
            <input
              ref={fileInput}
              type="file"
              accept=".tif,.tiff,.img,.png,.jpg,.jpeg"
              hidden
              aria-hidden="true"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="dropzone-body">
              <div className="dropzone-text">
                <p className="dropzone-title">{d.dropzone.title}</p>
                <p className="dropzone-hint">{d.dropzone.hint}</p>
                {fileError && (
                  <p className="dropzone-error" role="alert">{fileError}</p>
                )}
              </div>
              <div className="dropzone-actions">
                <button type="button" className="btn btn-primary" onClick={() => fileInput.current.click()}>
                  {d.dropzone.button}
                </button>
                <button type="button" className="btn" onClick={() => fileInput.current.click()}>
                  Replace
                </button>
                <button type="button" className="btn" onClick={removeImage} disabled={!hasImage}>
                  Remove image
                </button>
              </div>
            </div>
          </div>

          <div className="card viewport-card">
            <div className="viewport-hud">
              <span className="chip">{fileName || 'NO IMAGE LOADED'}</span>
              {d.activeTags.map((t) => (
                <span key={t} className="chip chip-muted">{t}</span>
              ))}
            </div>
            <div className="viewport-body">
              {previewUrl ? (
                <img className="viewport-image" src={previewUrl} alt="Uploaded preview" />
              ) : (
                <img className="viewport-image" src={analysisMain} alt={fileName || 'Lunar tile preview'} />
              )}
            </div>
            <div className="viewport-scale">
              <span className="label">SCALE BAR</span>
              <span className="scale-bar" />
              <span className="label">50 m</span>
              <span className="label">{d.sunElevation}</span>
            </div>
          </div>

          <div className="card thumb-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">RECENT UPLOADED IMAGES</p>
                <p className="metric-note">Click any tile to load into active viewport</p>
              </div>
              <span className="tag">4 TILES IN QUEUE</span>
            </div>
            <div className="thumb-row">
              {queue.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`thumb${i === activeThumb ? ' is-active' : ''}`}
                  onClick={() => selectThumb(i)}
                  aria-pressed={i === activeThumb}
                  aria-label={`Load ${t.name} — ${t.status}`}
                >
                  <img className="thumb-image has-image" src={thumbImages[i]} alt={t.name} />
                  <span className="thumb-text">
                    <span className="thumb-name">{t.name}</span>
                    <span className="thumb-meta">{t.meta}</span>
                    <span className="thumb-status">{t.status}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="split-right">
          <div className="card">
            <p className="eyebrow">IMAGE METADATA</p>
            <div className="meta-grid">
              {d.metadata.map((m) => (
                <div key={m.label} className="meta-cell">
                  <span className="label">{m.label}</span>
                  <span className="meta-value">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="label">{d.gsd.label}</span>
              <span className="tag">{d.gsd.status}</span>
            </div>
            <div className="gsd-input">
              <input
                type="number"
                step="0.01"
                min="0"
                value={gsd}
                onChange={(e) => setGsd(e.target.value)}
                aria-label="Ground sample distance in metres per pixel"
              />
              <span className="metric-unit">{d.gsd.unit}</span>
            </div>
          </div>

          <div className="card">
            <p className="eyebrow">IMAGE PREPROCESSING · 3 MODULES</p>
            <div className="toggle-list">
              <Toggle
                label={d.preprocessing[0].label}
                detail={d.preprocessing[0].detail}
                checked={toggles.noise}
                onChange={(v) => setToggles((s) => ({ ...s, noise: v }))}
              />
              <Toggle
                label={d.preprocessing[1].label}
                detail={d.preprocessing[1].detail}
                checked={toggles.contrast}
                onChange={(v) => setToggles((s) => ({ ...s, contrast: v }))}
              />
              <Toggle
                label={d.preprocessing[2].label}
                detail={d.preprocessing[2].detail}
                checked={toggles.radiometric}
                onChange={(v) => setToggles((s) => ({ ...s, radiometric: v }))}
              />
            </div>
          </div>

          <div className="card">
            {progress === 100 ? (
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => navigate('/boulder-detection', { state: { analysis_id: 'ANALYSIS-LRO-8842A' } })}
              >
                View Detection Results →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => setProgress(0)}
                disabled={progress !== null && progress < 100}
                aria-busy={progress !== null && progress < 100}
              >
                Analyze Image
              </button>
            )}
            <div className="progress-block" role="status" aria-live="polite">
              <div className="progress-head">
                <span className="progress-label">
                  {progress === null ? 'Ready to analyze' : d.progress.label}
                </span>
                <span className="progress-value">{progress === null ? '0%' : `${progress}%`}</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-fill" style={{ width: `${progress ?? 0}%` }} />
              </div>
              <div className="progress-foot">
                <span className="label">{d.progress.batch}</span>
                <span className="label">{d.progress.eta}</span>
              </div>
              <p className="demo-note">Processing is simulated for demonstration. No AI model runs in this frontend. <strong>MODEL REQUIRED</strong> for real inference.</p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-block"
            onClick={() => setProgress(null)}
          >
            Cancel analysis
          </button>
        </div>
      </div>
    </div>
  );
}
