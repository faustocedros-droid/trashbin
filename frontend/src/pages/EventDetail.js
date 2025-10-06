import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, sessionAPI, lapAPI, archiveAPI } from '../services/api';
import {
  calculateBestLapTime,
  calculateLapTimeFromSectors,
  calculateRemainingFuel,
  calculateTheoreticalBestLap,
} from '../eventUtils';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionLaps, setSessionLaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({
    session_type: 'Test',
    session_number: 1,
    duration: 60,
    fuel_start: 0,
    fuel_per_lap: 0,
    tire_set: '',
    session_status: null,
    notes: '',
  });

  // Lap management state
  const [showLapForm, setShowLapForm] = useState(false);
  const [editingLap, setEditingLap] = useState(null);
  const [lapFormData, setLapFormData] = useState({
    lapNumber: 1,
    lapTime: '',
    sector1: '',
    sector2: '',
    sector3: '',
    sector4: '',
    fuelConsumed: 0,
    tireSet: '',
    lapStatus: null,
    notes: '',
  });

  // Fuel dialog state
  const [showFuelDialog, setShowFuelDialog] = useState(false);
  const [fuelDialogMessage, setFuelDialogMessage] = useState('');

  useEffect(() => {
    loadEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEventData = async () => {
    try {
      const [eventResponse, sessionsResponse] = await Promise.all([
        eventAPI.get(id),
        eventAPI.getSessions(id),
      ]);
      setEvent(eventResponse.data);
      setSessions(sessionsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading event data:', error);
      setLoading(false);
    }
  };

  const loadSessionLaps = async (sessionId) => {
    try {
      const response = await sessionAPI.getLaps(sessionId);
      setSessionLaps(response.data);
    } catch (error) {
      console.error('Error loading laps:', error);
      setSessionLaps([]);
    }
  };

  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setShowLapForm(false);
    setEditingLap(null);
    await loadSessionLaps(session.id);
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.createSession(id, sessionFormData);
      setShowSessionForm(false);
      setSessionFormData({
        session_type: 'Test',
        session_number: 1,
        duration: 60,
        fuel_start: 0,
        fuel_per_lap: 0,
        tire_set: '',
        session_status: null,
        notes: '',
      });
      loadEventData();
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Errore nella creazione della sessione');
    }
  };

  const handleSessionChange = (e) => {
    setSessionFormData({
      ...sessionFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa sessione?')) {
      try {
        await sessionAPI.delete(sessionId);
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setSessionLaps([]);
        }
        loadEventData();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Errore nell\'eliminazione della sessione');
      }
    }
  };

  // Lap management functions
  const handleAddLap = () => {
    if (!selectedSession) return;
    
    setLapFormData({
      lapNumber: sessionLaps.length + 1,
      lapTime: '',
      sector1: '',
      sector2: '',
      sector3: '',
      sector4: '',
      fuelConsumed: 0,
      tireSet: selectedSession.tire_set || '',
      lapStatus: null,
      notes: '',
    });
    setEditingLap(null);
    setShowLapForm(true);
  };

  const handleEditLap = (lap) => {
    setLapFormData({
      lapNumber: lap.lap_number,
      lapTime: lap.lap_time,
      sector1: lap.sector1 || '',
      sector2: lap.sector2 || '',
      sector3: lap.sector3 || '',
      sector4: lap.sector4 || '',
      fuelConsumed: lap.fuel_consumed || 0,
      tireSet: lap.tire_set || '',
      lapStatus: lap.lap_status || null,
      notes: lap.notes || '',
    });
    setEditingLap(lap);
    setShowLapForm(true);
  };

  const handleSaveLap = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;

    const totalTime = calculateLapTimeFromSectors(
      lapFormData.sector1,
      lapFormData.sector2,
      lapFormData.sector3,
      lapFormData.sector4
    );

    const lapData = {
      lap_number: lapFormData.lapNumber,
      lap_time: totalTime,
      sector1: lapFormData.sector1,
      sector2: lapFormData.sector2,
      sector3: lapFormData.sector3,
      sector4: lapFormData.sector4,
      fuel_consumed: lapFormData.fuelConsumed,
      tire_set: lapFormData.tireSet,
      lap_status: lapFormData.lapStatus,
      notes: lapFormData.notes,
    };

    try {
      if (editingLap) {
        await lapAPI.update(editingLap.id, lapData);
      } else {
        await sessionAPI.createLap(selectedSession.id, lapData);
        
        // Show fuel dialog for new laps
        if (selectedSession.fuel_start && selectedSession.fuel_per_lap) {
          const remainingFuel = calculateRemainingFuel(
            selectedSession.fuel_start,
            selectedSession.fuel_per_lap,
            sessionLaps.length + 1
          );
          setFuelDialogMessage(`Carburante residuo dopo il giro ${lapFormData.lapNumber}: ${remainingFuel.toFixed(2)} L`);
          setShowFuelDialog(true);
        }
      }
      
      await loadSessionLaps(selectedSession.id);
      setShowLapForm(false);
      setEditingLap(null);
    } catch (error) {
      console.error('Error saving lap:', error);
      alert('Errore nel salvataggio del giro');
    }
  };

  const handleDeleteLap = async (lap) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il giro ${lap.lap_number}?`)) return;

    try {
      await lapAPI.delete(lap.id);
      await loadSessionLaps(selectedSession.id);
    } catch (error) {
      console.error('Error deleting lap:', error);
      alert('Errore nell\'eliminazione del giro');
    }
  };

  const handleArchive = async () => {
    try {
      await archiveAPI.archiveEvent(id);
      alert('Evento archiviato con successo (funzionalità OneDrive in sviluppo)');
    } catch (error) {
      console.error('Error archiving event:', error);
      alert('Errore nell\'archiviazione');
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Caricamento...</div></div>;
  }

  if (!event) {
    return <div className="container"><div className="error">Evento non trovato</div></div>;
  }

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => navigate('/events')} style={{ marginBottom: '20px' }}>
        ← Torna agli Eventi
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1>{event.name}</h1>
            <p><strong>Circuito:</strong> {event.track}</p>
            {event.track_length && (
              <p><strong>Lunghezza Percorso:</strong> {event.track_length} KM</p>
            )}
            <p><strong>Date:</strong> {new Date(event.date_start).toLocaleDateString('it-IT')} - {new Date(event.date_end).toLocaleDateString('it-IT')}</p>
            <p><strong>Meteo:</strong> {event.weather || 'Non specificato'}</p>
            {event.notes && <p><strong>Note:</strong> {event.notes}</p>}
          </div>
          <button className="btn btn-primary" onClick={handleArchive}>
            📦 Archivia su OneDrive
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Sessioni</h2>
          <button className="btn btn-primary" onClick={() => setShowSessionForm(!showSessionForm)}>
            {showSessionForm ? 'Annulla' : '+ Nuova Sessione'}
          </button>
        </div>

        {showSessionForm && (
          <form onSubmit={handleSessionSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Crea Nuova Sessione</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Tipo Sessione *</label>
                <select
                  name="session_type"
                  value={sessionFormData.session_type}
                  onChange={handleSessionChange}
                  required
                >
                  <option value="Test">Test</option>
                  <option value="FP1">Free Practice 1</option>
                  <option value="FP2">Free Practice 2</option>
                  <option value="FP3">Free Practice 3</option>
                  <option value="Q">Qualifying</option>
                  <option value="R1">Race 1</option>
                  <option value="R2">Race 2</option>
                  <option value="Endurance">Endurance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Numero Sessione</label>
                <input
                  type="number"
                  name="session_number"
                  value={sessionFormData.session_number}
                  onChange={handleSessionChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Durata (minuti)</label>
                <input
                  type="number"
                  name="duration"
                  value={sessionFormData.duration}
                  onChange={handleSessionChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Carburante Iniziale (litri)</label>
                <input
                  type="number"
                  name="fuel_start"
                  value={sessionFormData.fuel_start}
                  onChange={handleSessionChange}
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Consumo Carburante per Giro (litri)</label>
                <input
                  type="number"
                  name="fuel_per_lap"
                  value={sessionFormData.fuel_per_lap}
                  onChange={handleSessionChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Set Gomme</label>
                <input
                  type="text"
                  name="tire_set"
                  value={sessionFormData.tire_set}
                  onChange={handleSessionChange}
                  placeholder="es. Set#1"
                />
              </div>

              <div className="form-group">
                <label>Stato Sessione</label>
                <select
                  name="session_status"
                  value={sessionFormData.session_status || ''}
                  onChange={handleSessionChange}
                >
                  <option value="">Nessuno</option>
                  <option value="RF">RF (Red Flag)</option>
                  <option value="FCY">FCY (Full Course Yellow)</option>
                  <option value="SC">SC (Safety Car)</option>
                  <option value="TFC">TFC (Track Conditions)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea
                name="notes"
                value={sessionFormData.notes}
                onChange={handleSessionChange}
                placeholder="Note sulla sessione..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Crea Sessione
            </button>
          </form>
        )}

        {sessions.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
            Nessuna sessione disponibile. Crea la tua prima sessione!
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Numero</th>
                <th>Durata (min)</th>
                <th>Carburante (L)</th>
                <th>Set Gomme</th>
                <th>Miglior Giro</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr 
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  style={{ cursor: 'pointer', background: selectedSession?.id === session.id ? '#e3f2fd' : 'transparent' }}
                >
                  <td>{session.session_type}</td>
                  <td>{session.session_number}</td>
                  <td>{session.duration || '-'}</td>
                  <td>{session.fuel_start || '-'}</td>
                  <td>{session.tire_set || '-'}</td>
                  <td>{session.best_lap_time || '-'}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Selected Session Details with Laps */}
      {selectedSession && (
        <div className="card">
          <h2>Dettagli Sessione: {selectedSession.session_type} #{selectedSession.session_number}</h2>
          
          {/* Session status indicator */}
          {selectedSession.session_status && (
            <div style={{ 
              marginBottom: '15px',
              padding: '10px 20px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              color: 'black',
              background: 
                selectedSession.session_status === 'RF' ? 'red' :
                selectedSession.session_status === 'FCY' ? 'yellow' :
                selectedSession.session_status === 'SC' ? 'yellow' :
                selectedSession.session_status === 'TFC' ? 'orange' : 'transparent'
            }}>
              {selectedSession.session_status}
              {selectedSession.session_status === 'RF' && ' - Red Flag'}
              {selectedSession.session_status === 'FCY' && ' - Full Course Yellow'}
              {selectedSession.session_status === 'SC' && ' - Safety Car'}
              {selectedSession.session_status === 'TFC' && ' - Track Conditions'}
            </div>
          )}

          {/* Session info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <p><strong>Durata:</strong> {selectedSession.duration || '-'} min</p>
            <p><strong>Carburante iniziale:</strong> {selectedSession.fuel_start || '-'} L</p>
            <p><strong>Consumo per giro:</strong> {selectedSession.fuel_per_lap || '-'} L</p>
            <p><strong>Set gomme:</strong> {selectedSession.tire_set || '-'}</p>
            <p><strong>Miglior giro:</strong> {calculateBestLapTime(sessionLaps.map(l => ({ ...l, lapTime: l.lap_time, lapNumber: l.lap_number }))) || '-'}</p>
            <p><strong>Numero giri:</strong> {sessionLaps.length}</p>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Giri (Laps)</h3>
            <button className="btn btn-primary" onClick={handleAddLap}>
              + Aggiungi Giro
            </button>
          </div>

          {/* Info above lap list */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {/* Remaining fuel */}
            {selectedSession.fuel_start !== undefined && selectedSession.fuel_per_lap !== undefined && selectedSession.fuel_per_lap > 0 && (
              <div style={{ 
                padding: '15px',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                background: (() => {
                  const remaining = calculateRemainingFuel(
                    selectedSession.fuel_start,
                    selectedSession.fuel_per_lap,
                    sessionLaps.length
                  );
                  return remaining < 15 ? 'orange' : '#e3f2fd';
                })(),
                color: (() => {
                  const remaining = calculateRemainingFuel(
                    selectedSession.fuel_start,
                    selectedSession.fuel_per_lap,
                    sessionLaps.length
                  );
                  return remaining < 15 ? 'white' : '#333';
                })()
              }}>
                <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>
                  Carburante Residuo
                </div>
                <div>
                  {calculateRemainingFuel(
                    selectedSession.fuel_start,
                    selectedSession.fuel_per_lap,
                    sessionLaps.length
                  ).toFixed(2)} L
                </div>
              </div>
            )}

            {/* Theoretical best lap */}
            {sessionLaps.length > 0 && calculateTheoreticalBestLap(sessionLaps.map(l => ({ 
              ...l, 
              lapTime: l.lap_time, 
              lapNumber: l.lap_number,
              sector1: l.sector1,
              sector2: l.sector2,
              sector3: l.sector3,
              sector4: l.sector4
            }))) && (
              <div style={{ 
                padding: '15px',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                background: '#e8f5e9',
                color: '#333'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>
                  Miglior Tempo Teorico
                </div>
                <div style={{ color: '#2e7d32' }}>
                  {calculateTheoreticalBestLap(sessionLaps.map(l => ({ 
                    ...l, 
                    lapTime: l.lap_time, 
                    lapNumber: l.lap_number,
                    sector1: l.sector1,
                    sector2: l.sector2,
                    sector3: l.sector3,
                    sector4: l.sector4
                  })))}
                </div>
              </div>
            )}
          </div>

          {/* Lap form */}
          {showLapForm && (
            <form onSubmit={handleSaveLap} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4>{editingLap ? 'Modifica Giro' : 'Nuovo Giro'}</h4>
              
              {/* Lap number */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Numero Giro</label>
                <input
                  type="number"
                  value={lapFormData.lapNumber}
                  onChange={(e) => setLapFormData({ ...lapFormData, lapNumber: parseInt(e.target.value) })}
                  min="1"
                  required
                  style={{ maxWidth: '150px' }}
                />
              </div>

              {/* Sectors in horizontal layout */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
                  Intertempi Settori (secondi.millisecondi)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 1</label>
                    <input
                      type="text"
                      value={lapFormData.sector1}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector1: e.target.value })}
                      placeholder="25.123"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 2</label>
                    <input
                      type="text"
                      value={lapFormData.sector2}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector2: e.target.value })}
                      placeholder="28.456"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 3</label>
                    <input
                      type="text"
                      value={lapFormData.sector3}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector3: e.target.value })}
                      placeholder="30.789"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 4</label>
                    <input
                      type="text"
                      value={lapFormData.sector4}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector4: e.target.value })}
                      placeholder="22.012"
                      required
                    />
                  </div>

                  {/* Calculated total time */}
                  <div style={{ 
                    padding: '8px 15px', 
                    background: '#1976d2', 
                    color: 'white', 
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    minWidth: '120px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'normal', marginBottom: '2px' }}>Tempo Totale</div>
                    <div>{calculateLapTimeFromSectors(
                      lapFormData.sector1,
                      lapFormData.sector2,
                      lapFormData.sector3,
                      lapFormData.sector4
                    ) || '--:--.---'}</div>
                  </div>
                </div>
              </div>

              {/* Other fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label>Carburante Consumato (L)</label>
                  <input
                    type="number"
                    value={lapFormData.fuelConsumed}
                    onChange={(e) => setLapFormData({ ...lapFormData, fuelConsumed: parseFloat(e.target.value) })}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Set Gomme</label>
                  <input
                    type="text"
                    value={lapFormData.tireSet}
                    onChange={(e) => setLapFormData({ ...lapFormData, tireSet: e.target.value })}
                    placeholder="Set#1"
                  />
                </div>

                <div className="form-group">
                  <label>Stato Giro</label>
                  <select
                    value={lapFormData.lapStatus || ''}
                    onChange={(e) => setLapFormData({ ...lapFormData, lapStatus: e.target.value || null })}
                  >
                    <option value="">Normale</option>
                    <option value="RF">RF (Red Flag)</option>
                    <option value="FCY">FCY (Full Course Yellow)</option>
                    <option value="SC">SC (Safety Car)</option>
                    <option value="TFC">TFC (Track Conditions)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Note</label>
                <textarea
                  value={lapFormData.notes}
                  onChange={(e) => setLapFormData({ ...lapFormData, notes: e.target.value })}
                  placeholder="Note sul giro..."
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingLap ? 'Salva Modifiche' : 'Aggiungi Giro'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLapForm(false)}>
                  Annulla
                </button>
              </div>
            </form>
          )}

          {/* Laps table */}
          {sessionLaps.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
              Nessun giro registrato. Aggiungi il tuo primo giro!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Giro</th>
                    <th>Stato</th>
                    <th>Tempo Totale</th>
                    <th>Settore 1</th>
                    <th>Settore 2</th>
                    <th>Settore 3</th>
                    <th>Settore 4</th>
                    <th>Carburante (L)</th>
                    <th>Set Gomme</th>
                    <th>Note</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionLaps
                    .sort((a, b) => a.lap_number - b.lap_number)
                    .map(lap => (
                      <tr key={lap.id}>
                        <td>{lap.lap_number}</td>
                        <td>
                          {lap.lap_status ? (
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              color: 'black',
                              background: 
                                lap.lap_status === 'RF' ? 'red' :
                                lap.lap_status === 'FCY' ? 'yellow' :
                                lap.lap_status === 'SC' ? 'yellow' :
                                lap.lap_status === 'TFC' ? 'orange' : 'transparent'
                            }}>
                              {lap.lap_status}
                            </div>
                          ) : '-'}
                        </td>
                        <td><strong style={{ color: '#1976d2' }}>{lap.lap_time}</strong></td>
                        <td>{lap.sector1 || '-'}</td>
                        <td>{lap.sector2 || '-'}</td>
                        <td>{lap.sector3 || '-'}</td>
                        <td>{lap.sector4 || '-'}</td>
                        <td>
                          {selectedSession.fuel_start !== undefined && selectedSession.fuel_per_lap !== undefined
                            ? calculateRemainingFuel(selectedSession.fuel_start, selectedSession.fuel_per_lap, lap.lap_number).toFixed(2)
                            : '-'}
                        </td>
                        <td>{lap.tire_set || '-'}</td>
                        <td>{lap.notes || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleEditLap(lap)}
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteLap(lap)}
                              style={{ fontSize: '12px', padding: '4px 8px' }}
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
      )}

      {/* Fuel Dialog */}
      {showFuelDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>✓ Giro Completato</h3>
            <p style={{ fontSize: '16px', marginBottom: '25px' }}>{fuelDialogMessage}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowFuelDialog(false)}
              style={{ minWidth: '120px' }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
