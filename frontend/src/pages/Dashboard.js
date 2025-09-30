import React, { useEffect, useState } from 'react';
import { eventAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await eventAPI.getAll();
      const events = response.data;
      
      const now = new Date();
      const upcoming = events.filter(e => new Date(e.date_start) > now);
      const completed = events.filter(e => new Date(e.date_end) < now);
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming.length,
        completedEvents: completed.length,
      });
      
      // Show last 5 events
      setRecentEvents(events.slice(-5).reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Caricamento...</div></div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="card stat-card" style={{ textAlign: 'center' }}>
          <h3>Eventi Totali</h3>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#1976d2', margin: '10px 0' }}>
            {stats.totalEvents}
          </p>
        </div>
        
        <div className="card stat-card" style={{ textAlign: 'center' }}>
          <h3>Eventi Futuri</h3>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#2e7d32', margin: '10px 0' }}>
            {stats.upcomingEvents}
          </p>
        </div>
        
        <div className="card stat-card" style={{ textAlign: 'center' }}>
          <h3>Eventi Completati</h3>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#757575', margin: '10px 0' }}>
            {stats.completedEvents}
          </p>
        </div>
      </div>
      
      <div className="card">
        <h2>Eventi Recenti</h2>
        {recentEvents.length === 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {recentEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.track}</td>
                  <td>{new Date(event.date_start).toLocaleDateString('it-IT')}</td>
                  <td>{new Date(event.date_end).toLocaleDateString('it-IT')}</td>
                  <td>{event.weather || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
