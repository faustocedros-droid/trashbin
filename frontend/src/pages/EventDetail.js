import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, sessionAPI, archiveAPI } from '../services/api';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
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

  useEffect(() => {
    loadEventData();
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
        loadEventData();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Errore nell\'eliminazione della sessione');
      }
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
                <tr key={session.id}>
                  <td>{session.session_type}</td>
                  <td>{session.session_number}</td>
                  <td>{session.duration || '-'}</td>
                  <td>{session.fuel_start || '-'}</td>
                  <td>{session.tire_set || '-'}</td>
                  <td>{session.best_lap_time || '-'}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteSession(session.id)}
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
    </div>
  );
}

export default EventDetail;
