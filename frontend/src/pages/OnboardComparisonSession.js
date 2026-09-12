import React, { useMemo, useState } from 'react';

const createEmptyTrackPoint = (index) => ({
  id: `${Date.now()}-${index}`,
  pointName: `Punto ${index + 1}`,
  brakingSpeedA: '',
  brakingSpeedB: '',
  brakingPointA: '',
  brakingPointB: '',
  brakingModulationA: '',
  brakingModulationB: '',
  turnInSteeringA: '',
  turnInSteeringB: '',
  exitSteeringA: '',
  exitSteeringB: '',
  balanceCorrectionsA: '',
  balanceCorrectionsB: '',
  trajectoryA: '',
  trajectoryB: '',
  minCornerSpeedA: '',
  minCornerSpeedB: '',
  throttleOpenPointA: '',
  throttleOpenPointB: '',
  fullThrottlePointA: '',
  fullThrottlePointB: '',
});

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function OnboardComparisonSession() {
  const [sessionName, setSessionName] = useState('Sessione confronto onboard');
  const [trackName, setTrackName] = useState('');
  const [driverAName, setDriverAName] = useState('Pilota A');
  const [driverBName, setDriverBName] = useState('Pilota B');
  const [videoA, setVideoA] = useState({ fileName: '', url: '' });
  const [videoB, setVideoB] = useState({ fileName: '', url: '' });
  const [trackPoints, setTrackPoints] = useState([createEmptyTrackPoint(0)]);
  const [report, setReport] = useState('');

  const comparisonLabel = useMemo(() => `${driverAName} vs ${driverBName}`, [driverAName, driverBName]);

  const handleVideoUpload = (event, side) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);

    if (side === 'A') {
      if (videoA.url) URL.revokeObjectURL(videoA.url);
      setVideoA({ fileName: file.name, url: blobUrl });
    } else {
      if (videoB.url) URL.revokeObjectURL(videoB.url);
      setVideoB({ fileName: file.name, url: blobUrl });
    }
  };

  const updateTrackPoint = (id, field, value) => {
    setTrackPoints((current) => current.map((point) => (point.id === id ? { ...point, [field]: value } : point)));
  };

  const addTrackPoint = () => {
    setTrackPoints((current) => [...current, createEmptyTrackPoint(current.length)]);
  };

  const removeTrackPoint = (id) => {
    setTrackPoints((current) => {
      if (current.length === 1) return current;
      return current.filter((point) => point.id !== id);
    });
  };

  const compareNumeric = (valueA, valueB, betterWhenHigher, unit) => {
    const a = parseNumber(valueA);
    const b = parseNumber(valueB);

    if (a === null || b === null) {
      return `Dati numerici incompleti (${unit})`;
    }

    const delta = Number((a - b).toFixed(1));
    if (delta === 0) {
      return `Valore equivalente (${a.toFixed(1)} ${unit})`;
    }

    const fasterDriver = betterWhenHigher ? (delta > 0 ? driverAName : driverBName) : (delta < 0 ? driverAName : driverBName);
    const absDelta = Math.abs(delta).toFixed(1);

    return `${fasterDriver} ha un vantaggio di ${absDelta} ${unit}`;
  };

  const compareText = (a, b, metricName) => {
    if (!a && !b) return `${metricName}: osservazione non inserita`;
    if (!a || !b) return `${metricName}: dato mancante su uno dei due video`;
    if (a.trim().toLowerCase() === b.trim().toLowerCase()) return `${metricName}: approccio simile`;
    return `${metricName}: ${driverAName}="${a}", ${driverBName}="${b}"`;
  };

  const generateReport = () => {
    const validPoints = trackPoints.filter((point) => point.pointName.trim());

    if (!videoA.url || !videoB.url) {
      alert('Carica entrambi i video onboard prima di generare il report.');
      return;
    }

    if (validPoints.length === 0) {
      alert('Inserisci almeno un punto del tracciato.');
      return;
    }

    const lines = [];
    lines.push(`REPORT COMPARATIVO ONBOARD - ${sessionName}`);
    lines.push(`Circuito: ${trackName || 'Non specificato'}`);
    lines.push(`Confronto: ${comparisonLabel}`);
    lines.push('Ruolo analisi: ingegnere di pista / coach esperto');
    lines.push('');
    lines.push('Sintesi tecnica globale');

    const brakingSpeedDeltas = validPoints
      .map((point) => {
        const a = parseNumber(point.brakingSpeedA);
        const b = parseNumber(point.brakingSpeedB);
        return a !== null && b !== null ? a - b : null;
      })
      .filter((delta) => delta !== null);

    const minSpeedDeltas = validPoints
      .map((point) => {
        const a = parseNumber(point.minCornerSpeedA);
        const b = parseNumber(point.minCornerSpeedB);
        return a !== null && b !== null ? a - b : null;
      })
      .filter((delta) => delta !== null);

    const avgBrakingDelta =
      brakingSpeedDeltas.length > 0
        ? brakingSpeedDeltas.reduce((sum, value) => sum + value, 0) / brakingSpeedDeltas.length
        : null;

    const avgMinSpeedDelta =
      minSpeedDeltas.length > 0
        ? minSpeedDeltas.reduce((sum, value) => sum + value, 0) / minSpeedDeltas.length
        : null;

    if (avgBrakingDelta !== null) {
      const leader = avgBrakingDelta > 0 ? driverAName : driverBName;
      lines.push(
        `- Velocità alla staccata media: vantaggio ${leader} di ${Math.abs(avgBrakingDelta).toFixed(1)} km/h.`
      );
    } else {
      lines.push('- Velocità alla staccata media: dati non sufficienti.');
    }

    if (avgMinSpeedDelta !== null) {
      const leader = avgMinSpeedDelta > 0 ? driverAName : driverBName;
      lines.push(`- Velocità minima media in curva: vantaggio ${leader} di ${Math.abs(avgMinSpeedDelta).toFixed(1)} km/h.`);
    } else {
      lines.push('- Velocità minima media in curva: dati non sufficienti.');
    }

    lines.push('');
    lines.push('Analisi punto per punto');

    validPoints.forEach((point, index) => {
      lines.push('');
      lines.push(`${index + 1}) ${point.pointName}`);
      lines.push(`- Velocità alla staccata: ${compareNumeric(point.brakingSpeedA, point.brakingSpeedB, true, 'km/h')}`);
      lines.push(`- Punto di staccata: ${compareText(point.brakingPointA, point.brakingPointB, 'Riferimento frenata')}`);
      lines.push(
        `- Modulazione staccata: ${compareText(point.brakingModulationA, point.brakingModulationB, 'Progressività rilascio freno')}`
      );
      lines.push(`- Inserimento/sterzo ingresso: ${compareText(point.turnInSteeringA, point.turnInSteeringB, 'Turn-in')}`);
      lines.push(`- Uso sterzo uscita: ${compareText(point.exitSteeringA, point.exitSteeringB, 'Uscita curva')}`);
      lines.push(`- Correzioni sotto/sovrasterzo: ${compareText(point.balanceCorrectionsA, point.balanceCorrectionsB, 'Bilanciamento')}`);
      lines.push(`- Traiettoria: ${compareText(point.trajectoryA, point.trajectoryB, 'Linea di percorrenza')}`);
      lines.push(`- Velocità minima in curva: ${compareNumeric(point.minCornerSpeedA, point.minCornerSpeedB, true, 'km/h')}`);
      lines.push(`- Punto apertura gas: ${compareText(point.throttleOpenPointA, point.throttleOpenPointB, 'Apertura gas')}`);
      lines.push(`- Punto full gas: ${compareText(point.fullThrottlePointA, point.fullThrottlePointB, 'Full gas')}`);
    });

    lines.push('');
    lines.push('Indicazioni coaching');
    lines.push(`- ${driverAName}: consolidare i punti di forza e ridurre le variazioni di input tra ingresso e uscita curva.`);
    lines.push(`- ${driverBName}: lavorare sulla precisione del punto di frenata e sulla transizione freno-gas nelle curve lente.`);
    lines.push('- Ripetere il confronto dopo una sessione dedicata per validare il guadagno settore per settore.');

    setReport(lines.join('\n'));
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Sessione confronto onboard (Copilot Coach)</h1>
        <p style={{ color: '#666' }}>
          Carica due video onboard dello stesso circuito, confronta ogni punto del tracciato e genera un report tecnico.
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
            <input value={driverAName} onChange={(e) => setDriverAName(e.target.value || 'Pilota A')} />
          </div>
          <div className="form-group">
            <label>Pilota video B</label>
            <input value={driverBName} onChange={(e) => setDriverBName(e.target.value || 'Pilota B')} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Caricamento video onboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="btn btn-primary" style={{ display: 'inline-block' }}>
              Carica video A
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(e, 'A')}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ marginTop: '10px', color: '#666' }}>{videoA.fileName || 'Nessun file selezionato'}</p>
            {videoA.url && (
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={videoA.url} />
              </video>
            )}
          </div>

          <div>
            <label className="btn btn-primary" style={{ display: 'inline-block' }}>
              Carica video B
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(e, 'B')}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ marginTop: '10px', color: '#666' }}>{videoB.fileName || 'Nessun file selezionato'}</p>
            {videoB.url && (
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={videoB.url} />
              </video>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Analisi tecnica per punto del tracciato</h2>
          <button type="button" className="btn btn-secondary" onClick={addTrackPoint}>
            + Aggiungi punto
          </button>
        </div>

        {trackPoints.map((point, index) => (
          <div key={point.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ marginTop: 0 }}>Punto {index + 1}</h3>
              <button type="button" className="btn btn-danger" onClick={() => removeTrackPoint(point.id)}>
                Rimuovi
              </button>
            </div>

            <div className="form-group">
              <label>Nome punto tracciato (es. Curva 1 / Variante)</label>
              <input
                value={point.pointName}
                onChange={(e) => updateTrackPoint(point.id, 'pointName', e.target.value)}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: '1100px' }}>
                <thead>
                  <tr>
                    <th>Parametro</th>
                    <th>{driverAName}</th>
                    <th>{driverBName}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Velocità alla staccata (km/h)', 'brakingSpeedA', 'brakingSpeedB', 'number'],
                    ['Punto di staccata', 'brakingPointA', 'brakingPointB', 'text'],
                    ['Modulazione staccata', 'brakingModulationA', 'brakingModulationB', 'text'],
                    ['Inserimento in curva / sterzo ingresso', 'turnInSteeringA', 'turnInSteeringB', 'text'],
                    ['Uso sterzo in uscita', 'exitSteeringA', 'exitSteeringB', 'text'],
                    ['Correzioni sotto/sovrasterzo', 'balanceCorrectionsA', 'balanceCorrectionsB', 'text'],
                    ['Traiettoria', 'trajectoryA', 'trajectoryB', 'text'],
                    ['Velocità minima in curva (km/h)', 'minCornerSpeedA', 'minCornerSpeedB', 'number'],
                    ['Punto apertura gas', 'throttleOpenPointA', 'throttleOpenPointB', 'text'],
                    ['Punto full gas in uscita', 'fullThrottlePointA', 'fullThrottlePointB', 'text'],
                  ].map(([label, fieldA, fieldB, type]) => (
                    <tr key={fieldA}>
                      <td>{label}</td>
                      <td>
                        <input
                          type={type}
                          value={point[fieldA]}
                          onChange={(e) => updateTrackPoint(point.id, fieldA, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type={type}
                          value={point[fieldB]}
                          onChange={(e) => updateTrackPoint(point.id, fieldB, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-primary" onClick={generateReport}>
          Genera report tecnico con Copilot
        </button>
      </div>

      {report && (
        <div className="card">
          <h2>Report comparativo</h2>
          <textarea value={report} readOnly style={{ minHeight: '420px', fontFamily: 'monospace' }} />
        </div>
      )}
    </div>
  );
}

export default OnboardComparisonSession;
