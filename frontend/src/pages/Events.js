import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    track: '',
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

  if (loading) {
    return <div className="container"><div className="loading">Caricamento...</div></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Eventi di Gara</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annulla' : '+ Nuovo Evento'}
        </button>
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
