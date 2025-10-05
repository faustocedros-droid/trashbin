import React, { useState, useEffect } from 'react';

interface PressureEntry {
  id: string;
  session: string;
  tireSet: string;
  coldPressures: {
    FL: string;
    FR: string;
    RL: string;
    RR: string;
  };
  coldSetTemp: string;
  hotPressures: {
    FL: string;
    FR: string;
    RL: string;
    RR: string;
  };
  laps: string;
  airTemp: string;
  trackTemp: string;
}

function TirePressureDatabase() {
  const [entries, setEntries] = useState<PressureEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PressureEntry>({
    id: '',
    session: 'FP1',
    tireSet: '',
    coldPressures: { FL: '', FR: '', RL: '', RR: '' },
    coldSetTemp: '',
    hotPressures: { FL: '', FR: '', RL: '', RR: '' },
    laps: '',
    airTemp: '',
    trackTemp: '',
  });

  const sessionOptions = ['T1', 'T2', 'T3', 'T4', 'FP1', 'FP2', 'FP3', 'Q1', 'Q2', 'R1', 'R2'];

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem('tirePressureDatabase');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveToLocalStorage = (data: PressureEntry[]) => {
    localStorage.setItem('tirePressureDatabase', JSON.stringify(data));
  };

  const handleAddEntry = () => {
    const newEntry = {
      ...formData,
      id: Date.now().toString(),
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    saveToLocalStorage(newEntries);
    resetForm();
  };

  const handleEditEntry = (entry: PressureEntry) => {
    setEditingId(entry.id);
    setFormData(entry);
  };

  const handleUpdateEntry = () => {
    const updatedEntries = entries.map((entry) =>
      entry.id === editingId ? formData : entry
    );
    setEntries(updatedEntries);
    saveToLocalStorage(updatedEntries);
    resetForm();
    setEditingId(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa riga?')) {
      const newEntries = entries.filter((entry) => entry.id !== id);
      setEntries(newEntries);
      saveToLocalStorage(newEntries);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      session: 'FP1',
      tireSet: '',
      coldPressures: { FL: '', FR: '', RL: '', RR: '' },
      coldSetTemp: '',
      hotPressures: { FL: '', FR: '', RL: '', RR: '' },
      laps: '',
      airTemp: '',
      trackTemp: '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🗄️ Tire Pressure Database</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Database completo delle pressioni pneumatici per sessione
      </p>

      {/* Input Form */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>{editingId ? 'Modifica Riga' : 'Aggiungi Nuova Riga'}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {/* Session */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sessione
            </label>
            <select
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              {sessionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Tire Set */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Set di Gomme
            </label>
            <input
              type="text"
              value={formData.tireSet}
              onChange={(e) => setFormData({ ...formData, tireSet: e.target.value })}
              placeholder="es. Set 1"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>

        {/* Cold Tire Pressures - Turquoise Background */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#40E0D0', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#fff' }}>Pressioni a Freddo (bar)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                FL (Front Left)
              </label>
              <input
                type="text"
                value={formData.coldPressures.FL}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coldPressures: { ...formData.coldPressures, FL: e.target.value },
                  })
                }
                placeholder="es. 1.8"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                FR (Front Right)
              </label>
              <input
                type="text"
                value={formData.coldPressures.FR}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coldPressures: { ...formData.coldPressures, FR: e.target.value },
                  })
                }
                placeholder="es. 1.8"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                RL (Rear Left)
              </label>
              <input
                type="text"
                value={formData.coldPressures.RL}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coldPressures: { ...formData.coldPressures, RL: e.target.value },
                  })
                }
                placeholder="es. 1.7"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                RR (Rear Right)
              </label>
              <input
                type="text"
                value={formData.coldPressures.RR}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coldPressures: { ...formData.coldPressures, RR: e.target.value },
                  })
                }
                placeholder="es. 1.7"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Cold Set Temperature */}
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
              Temperatura Set a Freddo (°C)
            </label>
            <input
              type="text"
              value={formData.coldSetTemp}
              onChange={(e) => setFormData({ ...formData, coldSetTemp: e.target.value })}
              placeholder="es. 20"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>

        {/* Hot Tire Pressures - Orange Background */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#FFA500', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#fff' }}>Hot Tire Press (bar)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                FL (Front Left)
              </label>
              <input
                type="text"
                value={formData.hotPressures.FL}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hotPressures: { ...formData.hotPressures, FL: e.target.value },
                  })
                }
                placeholder="es. 2.1"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                FR (Front Right)
              </label>
              <input
                type="text"
                value={formData.hotPressures.FR}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hotPressures: { ...formData.hotPressures, FR: e.target.value },
                  })
                }
                placeholder="es. 2.1"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                RL (Rear Left)
              </label>
              <input
                type="text"
                value={formData.hotPressures.RL}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hotPressures: { ...formData.hotPressures, RL: e.target.value },
                  })
                }
                placeholder="es. 2.0"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                RR (Rear Right)
              </label>
              <input
                type="text"
                value={formData.hotPressures.RR}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hotPressures: { ...formData.hotPressures, RR: e.target.value },
                  })
                }
                placeholder="es. 2.0"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Additional Fields in Orange Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                Laps
              </label>
              <input
                type="text"
                value={formData.laps}
                onChange={(e) => setFormData({ ...formData, laps: e.target.value })}
                placeholder="es. 10"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                Air Temp (°C)
              </label>
              <input
                type="text"
                value={formData.airTemp}
                onChange={(e) => setFormData({ ...formData, airTemp: e.target.value })}
                placeholder="es. 25"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                Track Temp (°C)
              </label>
              <input
                type="text"
                value={formData.trackTemp}
                onChange={(e) => setFormData({ ...formData, trackTemp: e.target.value })}
                placeholder="es. 35"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          {editingId ? (
            <>
              <button onClick={handleUpdateEntry} className="btn btn-primary">
                ✅ Aggiorna Riga
              </button>
              <button onClick={handleCancelEdit} className="btn btn-secondary">
                ❌ Annulla
              </button>
            </>
          ) : (
            <button onClick={handleAddEntry} className="btn btn-primary">
              ➕ Aggiungi Riga
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <h2>Dati Salvati ({entries.length})</h2>
        {entries.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
            Nessun dato disponibile. Aggiungi la tua prima riga!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Sessione</th>
                  <th>Set Gomme</th>
                  <th colSpan={4} style={{ backgroundColor: '#40E0D0', color: '#fff' }}>
                    Pressioni a Freddo (bar)
                  </th>
                  <th style={{ backgroundColor: '#40E0D0', color: '#fff' }}>
                    Temp Set Freddo (°C)
                  </th>
                  <th colSpan={4} style={{ backgroundColor: '#FFA500', color: '#fff' }}>
                    Hot Tire Press (bar)
                  </th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>Laps</th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>Air Temp (°C)</th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>Track Temp (°C)</th>
                  <th>Azioni</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th style={{ backgroundColor: '#40E0D0', color: '#fff' }}>FL</th>
                  <th style={{ backgroundColor: '#40E0D0', color: '#fff' }}>FR</th>
                  <th style={{ backgroundColor: '#40E0D0', color: '#fff' }}>RL</th>
                  <th style={{ backgroundColor: '#40E0D0', color: '#fff' }}>RR</th>
                  <th></th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>FL</th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>FR</th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>RL</th>
                  <th style={{ backgroundColor: '#FFA500', color: '#fff' }}>RR</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.session}</td>
                    <td>{entry.tireSet}</td>
                    <td style={{ backgroundColor: '#E0F7F7' }}>{entry.coldPressures.FL}</td>
                    <td style={{ backgroundColor: '#E0F7F7' }}>{entry.coldPressures.FR}</td>
                    <td style={{ backgroundColor: '#E0F7F7' }}>{entry.coldPressures.RL}</td>
                    <td style={{ backgroundColor: '#E0F7F7' }}>{entry.coldPressures.RR}</td>
                    <td style={{ backgroundColor: '#E0F7F7' }}>{entry.coldSetTemp}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.hotPressures.FL}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.hotPressures.FR}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.hotPressures.RL}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.hotPressures.RR}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.laps}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.airTemp}</td>
                    <td style={{ backgroundColor: '#FFE5CC' }}>{entry.trackTemp}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '14px' }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="btn btn-danger"
                          style={{ padding: '5px 10px', fontSize: '14px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TirePressureDatabase;
