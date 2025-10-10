import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI, sessionAPI } from '../services/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    track: '',
    track_length: '',
    date_start: '',
    date_end: '',
    weather: '',
    notes: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        track: '',
        track_length: '',
        date_start: '',
        date_end: '',
        weather: '',
        notes: '',
      });
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Errore nella creazione dell\'evento');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      try {
        await eventAPI.delete(id);
        loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Errore nell\'eliminazione dell\'evento');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Import event from file
  const handleImportEvent = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importData = JSON.parse(event.target?.result);
        
        // Validate import data
        if (!importData.event || !importData.sessions) {
          throw new Error('File non valido: struttura dati mancante');
        }

        if (!window.confirm(
          `Vuoi importare l'evento "${importData.event.name}"?\n\n` +
          `Questo creerà un nuovo evento con ${importData.sessions.length} sessioni e tutti i loro giri.`
        )) {
          return;
        }

        // Create new event
        const newEventData = {
          name: importData.event.name + ' (Importato)',
          track: importData.event.track,
          date_start: importData.event.date_start,
          date_end: importData.event.date_end,
          weather: importData.event.weather,
          notes: importData.event.notes,
          track_length: importData.event.track_length
        };
        
        const eventResponse = await eventAPI.create(newEventData);
        const newEventId = eventResponse.data.id;

        // Create sessions and laps
        for (const session of importData.sessions) {
          const sessionData = {
            session_type: session.session_type,
            session_number: session.session_number,
            duration: session.duration,
            fuel_start: session.fuel_start,
            fuel_per_lap: session.fuel_per_lap,
            tire_set: session.tire_set,
            session_status: session.session_status,
            notes: session.notes
          };

          const sessionResponse = await eventAPI.createSession(newEventId, sessionData);
          const newSessionId = sessionResponse.data.id;

          // Create laps for this session
          if (session.laps && session.laps.length > 0) {
            for (const lap of session.laps) {
              const lapData = {
                lap_number: lap.lap_number,
                lap_time: lap.lap_time,
                sector1: lap.sector1,
                sector2: lap.sector2,
                sector3: lap.sector3,
                sector4: lap.sector4,
                fuel_consumed: lap.fuel_consumed,
                tire_set: lap.tire_set,
                lap_status: lap.lap_status,
                notes: lap.notes
              };
              await sessionAPI.createLap(newSessionId, lapData);
            }
          }
        }

        alert('Evento importato con successo!');
        loadEvents();
      } catch (error) {
        console.error('Error importing event:', error);
        alert('Errore durante l\'importazione: ' + (error.message || 'File non valido'));
      }
    };
    reader.readAsText(file);
    
    // Reset input to allow importing the same file again
    e.target.value = '';
  };

  if (loading) {
    return <div className="container"><div className="loading">Caricamento...</div></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Eventi di Gara</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label className="btn btn-primary" style={{ margin: 0, cursor: 'pointer', textAlign: 'center' }}>
            📂 Importa Evento
            <input
              type="file"
              accept=".rcme"
              onChange={handleImportEvent}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annulla' : '+ Nuovo Evento'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>Crea Nuovo Evento</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome Evento *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="es. Race Imola 25-29 Sett 2025"
              />
            </div>

            <div className="form-group">
              <label>Circuito *</label>
              <input
                type="text"
                name="track"
                value={formData.track}
                onChange={handleChange}
                required
                placeholder="es. Autodromo Enzo e Dino Ferrari - Imola"
              />
            </div>

            <div className="form-group">
              <label>Lunghezza Percorso (KM)</label>
              <input
                type="number"
                name="track_length"
                value={formData.track_length}
                onChange={handleChange}
                step="0.001"
                min="0"
                placeholder="es. 4.909"
              />
              <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
                Lunghezza del circuito in chilometri
              </small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Data Inizio *</label>
                <input
                  type="datetime-local"
                  name="date_start"
                  value={formData.date_start}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Data Fine *</label>
                <input
                  type="datetime-local"
                  name="date_end"
                  value={formData.date_end}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Meteo</label>
              <input
                type="text"
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                placeholder="es. Soleggiato, 25°C"
              />
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Note aggiuntive sull'evento..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Crea Evento
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Lista Eventi</h2>
        {events.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
            Nessun evento disponibile. Crea il tuo primo evento!
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Circuito</th>
                <th>Data Inizio</th>
                <th>Data Fine</th>
                <th>Meteo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>
                    <Link to={`/events/${event.id}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                      {event.name}
                    </Link>
                  </td>
                  <td>{event.track}</td>
                  <td>{new Date(event.date_start).toLocaleDateString('it-IT')}</td>
                  <td>{new Date(event.date_end).toLocaleDateString('it-IT')}</td>
                  <td>{event.weather || '-'}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(event.id)}
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

export default Events;
