import React, { useEffect, useMemo, useState } from 'react';
import { onboardAPI } from '../services/api';

const buildVideoState = () => ({
  file: null,
  fileName: '',
  mimeType: '',
  previewUrl: '',
});

function OnboardComparisonSession() {
  const [sessionName, setSessionName] = useState('Sessione confronto onboard automatica');
  const [trackName, setTrackName] = useState('');
  const [driverAName, setDriverAName] = useState('Pilota A');
  const [driverBName, setDriverBName] = useState('Pilota B');

  const [videoA, setVideoA] = useState(buildVideoState());
  const [videoB, setVideoB] = useState(buildVideoState());
  const [trackMap, setTrackMap] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizedDriverA = useMemo(() => driverAName.trim() || 'Pilota A', [driverAName]);
  const normalizedDriverB = useMemo(() => driverBName.trim() || 'Pilota B', [driverBName]);

  useEffect(() => {
    const url = videoA.previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [videoA.previewUrl]);

  useEffect(() => {
    const url = videoB.previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [videoB.previewUrl]);

  const handleVideoUpload = (event, side) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = {
      file,
      fileName: file.name,
      mimeType: file.type || 'video/mp4',
      previewUrl: URL.createObjectURL(file),
    };

    if (side === 'A') {
      setVideoA(payload);
    } else {
      setVideoB(payload);
    }

    setAnalysis(null);
    setError('');
  };

  const handleTrackMapUpload = (event) => {
    const file = event.target.files?.[0] || null;
    setTrackMap(file);

    setAnalysis(null);
    setError('');
  };

  const runAutomaticAnalysis = async () => {
    if (!videoA.file || !videoB.file) {
      setError('Carica entrambi i video onboard prima di avviare l’analisi automatica.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('video_a', videoA.file);
      formData.append('video_b', videoB.file);
      formData.append('session_name', sessionName);
      formData.append('track_name', trackName);
      formData.append('driver_a_name', normalizedDriverA);
      formData.append('driver_b_name', normalizedDriverB);
      if (trackMap) {
        formData.append('track_map', trackMap);
      }

      const response = await onboardAPI.compare(formData);
      setAnalysis(response.data.analysis);
    } catch (requestError) {
      const message = requestError?.response?.data?.message || 'Errore durante l’analisi automatica onboard.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const mapPolyline = useMemo(() => {
    if (!analysis?.track_overlay?.path || analysis.track_overlay.path.length === 0) {
      return '';
    }
    return analysis.track_overlay.path
      .map((point) => `${Math.round(point.x * 1000)},${Math.round(point.y * 1000)}`)
      .join(' ');
  }, [analysis]);

  return (
    <div className="container">
      <div className="card">
        <h1>Sessione confronto onboard (automatica)</h1>
        <p style={{ color: '#666' }}>
          L’app rileva il pallino rosso GPS nella mappa onboard e produce automaticamente un confronto curva-per-curva.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Nome sessione</label>
            <input value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Circuito</label>
            <input value={trackName} onChange={(e) => setTrackName(e.target.value)} placeholder="Es. Monza" />
          </div>
          <div className="form-group">
            <label>Pilota video A</label>
            <input value={driverAName} onChange={(e) => setDriverAName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Pilota video B</label>
            <input value={driverBName} onChange={(e) => setDriverBName(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Caricamento file</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="btn btn-primary" htmlFor="video-upload-a" style={{ display: 'inline-block' }}>
              Carica video A
              <input
                id="video-upload-a"
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(e, 'A')}
                aria-label="Carica video onboard A"
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ marginTop: '10px', color: '#666' }}>{videoA.fileName || 'Nessun file selezionato'}</p>
            {videoA.previewUrl && (
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={videoA.previewUrl} type={videoA.mimeType} />
              </video>
            )}
          </div>

          <div>
            <label className="btn btn-primary" htmlFor="video-upload-b" style={{ display: 'inline-block' }}>
              Carica video B
              <input
                id="video-upload-b"
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(e, 'B')}
                aria-label="Carica video onboard B"
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ marginTop: '10px', color: '#666' }}>{videoB.fileName || 'Nessun file selezionato'}</p>
            {videoB.previewUrl && (
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={videoB.previewUrl} type={videoB.mimeType} />
              </video>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="btn btn-secondary" htmlFor="track-map-upload" style={{ display: 'inline-block' }}>
            Carica mappa tracciato (opzionale)
            <input
              id="track-map-upload"
              type="file"
              accept="image/*"
              onChange={handleTrackMapUpload}
              aria-label="Carica immagine mappa tracciato"
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ marginTop: '10px', color: '#666' }}>{trackMap?.name || 'Nessuna mappa caricata'}</p>
        </div>

        <button type="button" className="btn btn-primary" onClick={runAutomaticAnalysis} disabled={loading}>
          {loading ? 'Analisi in corso...' : 'Avvia analisi automatica con Copilot'}
        </button>

        {error && <div className="error" style={{ marginTop: '15px' }}>{error}</div>}
      </div>

      {analysis && (
        <>
          <div className="card">
            <h2>Output analisi automatica</h2>
            <p><strong>Modalità:</strong> {analysis.analysis_mode}</p>
            <p><strong>Campioni analizzati:</strong> {analysis.sample_count}</p>
            <p><strong>Sorgente mappa:</strong> GPS onboard (pallino rosso)</p>
          </div>

          <div className="card">
            <h2>Mappa curva-per-curva</h2>
            <p style={{ color: '#666' }}>
              Marker numerati ricavati dalla traiettoria GPS del video. Ogni marker corrisponde a una curva del report.
            </p>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#111' }}>
              <svg viewBox="0 0 1000 1000" width="100%" style={{ display: 'block' }}>
                {mapPolyline && (
                  <polyline
                    points={mapPolyline}
                    fill="none"
                    stroke="#4fc3f7"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {analysis.track_overlay?.curve_markers?.map((marker, index) => (
                  <g key={marker.name}>
                    <circle cx={marker.x * 1000} cy={marker.y * 1000} r="13" fill="#ff3b30" stroke="#fff" strokeWidth="2" />
                    <text
                      x={marker.x * 1000 + 18}
                      y={marker.y * 1000 - 10}
                      fill="#fff"
                      fontSize="20"
                      fontWeight="700"
                    >
                      C{index + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="card">
            <h2>Confronto curva per curva</h2>
            {analysis.curves?.map((curve, index) => (
              <div key={curve.curve_name} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                <h3 style={{ marginTop: 0 }}>{index + 1}) {curve.curve_name}</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Parametro</th>
                      <th>{normalizedDriverA}</th>
                      <th>{normalizedDriverB}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Velocità alla staccata</td><td>{curve.video_a.braking_speed_kmh} km/h</td><td>{curve.video_b.braking_speed_kmh} km/h</td></tr>
                    <tr><td>Punto di staccata</td><td>{curve.video_a.braking_point_reference}</td><td>{curve.video_b.braking_point_reference}</td></tr>
                    <tr><td>Modulazione staccata (0-10)</td><td>{curve.video_a.braking_modulation_score}</td><td>{curve.video_b.braking_modulation_score}</td></tr>
                    <tr><td>Sterzo ingresso</td><td>{curve.video_a.turn_in_steering}</td><td>{curve.video_b.turn_in_steering}</td></tr>
                    <tr><td>Sterzo uscita</td><td>{curve.video_a.exit_steering}</td><td>{curve.video_b.exit_steering}</td></tr>
                    <tr><td>Correzioni sotto/sovrasterzo</td><td>{curve.video_a.balance_corrections}</td><td>{curve.video_b.balance_corrections}</td></tr>
                    <tr><td>Traiettoria</td><td>{curve.video_a.trajectory}</td><td>{curve.video_b.trajectory}</td></tr>
                    <tr><td>Velocità minima in curva</td><td>{curve.video_a.min_corner_speed_kmh} km/h</td><td>{curve.video_b.min_corner_speed_kmh} km/h</td></tr>
                    <tr><td>Apertura gas</td><td>{curve.video_a.throttle_open_reference}</td><td>{curve.video_b.throttle_open_reference}</td></tr>
                    <tr><td>Full gas</td><td>{curve.video_a.full_throttle_reference}</td><td>{curve.video_b.full_throttle_reference}</td></tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Report ingegnere di pista / coach</h2>
            <textarea
              value={analysis.report || ''}
              readOnly
              aria-label="Report automatico confronto onboard"
              style={{ minHeight: '420px', fontFamily: 'monospace' }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default OnboardComparisonSession;
