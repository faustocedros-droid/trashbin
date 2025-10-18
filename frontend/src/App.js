import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import TirePressure from './pages/TirePressure';
import TirePressureSetsManagement from './pages/TirePressureSetsManagement';
import TirePressureSetup from './pages/TirePressureSetup';
import TirePressureDatabase from './pages/TirePressureDatabase';
import Settings from './pages/Settings';
import RunPlanSheet from './pages/RunPlanSheet';
import Weather from './pages/Weather';
import GeneralInformation from './pages/GeneralInformation';
import Setup from './pages/Setup';
import FuelConsumption from './pages/FuelConsumption';
import notificationService from './services/notificationService';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tirePressureSubmenuOpen, setTirePressureSubmenuOpen] = useState(false);
  const [runPlanSubmenuOpen, setRunPlanSubmenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Monitor schedule data for notifications
  useEffect(() => {
    // Load schedule data from localStorage
    const loadScheduleData = () => {
      const saved = localStorage.getItem('eventSchedule');
      if (saved) {
        return JSON.parse(saved);
      }
      return {
        sessions: Array(10).fill(''),
        times: Array(10).fill('')
      };
    };

    const scheduleData = loadScheduleData();

    // Start monitoring for upcoming sessions
    notificationService.startMonitoring(scheduleData, (notification) => {
      // Show native OS notification
      if (window.electron && window.electron.showNotification) {
        window.electron.showNotification(notification.title, notification.body);
      }
      
      // Also show in-app notification
      setNotifications(prev => [...prev, notification]);

      // Auto-remove notification after 30 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 30000);
    });

    // Listen for localStorage changes to update schedule monitoring
    const handleStorageChange = (e) => {
      if (e.key === 'eventSchedule') {
        const newData = e.newValue ? JSON.parse(e.newValue) : { sessions: Array(10).fill(''), times: Array(10).fill('') };
        notificationService.stopMonitoring();
        notificationService.startMonitoring(newData, (notification) => {
          if (window.electron && window.electron.showNotification) {
            window.electron.showNotification(notification.title, notification.body);
          }
          setNotifications(prev => [...prev, notification]);
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 30000);
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup on unmount
    return () => {
      notificationService.stopMonitoring();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Router>
      <div className="App">
        {/* Global Notifications */}
        {notifications.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 10000,
            maxWidth: '400px'
          }}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: notification.type === '5min' ? '#d32f2f' : '#ff9800',
                  color: 'white',
                  padding: '15px 20px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  position: 'relative',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <button
                  onClick={() => closeNotification(notification.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '0 5px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
                <div style={{ marginRight: '25px', fontWeight: 'bold' }}>
                  {notification.message}
                </div>
              </div>
            ))}
          </div>
        )}

        <header className="App-header">
          <nav className="navbar">
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  className="hamburger-menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  ☰
                </button>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                  <h1 className="logo">🏎️ Racing Car Manager</h1>
                </Link>
              </div>
              <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/events" onClick={() => setMenuOpen(false)}>Eventi</Link></li>
                <li><Link to="/general-information" onClick={() => setMenuOpen(false)}>General Information</Link></li>
                <li><Link to="/setup" onClick={() => setMenuOpen(false)}>Setup</Link></li>
                <li>
                  <div style={{ position: 'relative' }}>
                    <span 
                      onClick={() => setRunPlanSubmenuOpen(!runPlanSubmenuOpen)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      RunPlan Sheets {runPlanSubmenuOpen ? '▼' : '▶'}
                    </span>
                    {runPlanSubmenuOpen && (
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: '10px 0 10px 20px', 
                        margin: 0,
                        backgroundColor: '#2a2a2a',
                        borderRadius: '4px',
                        marginTop: '5px'
                      }}>
                        <li style={{ padding: '5px 0' }}>
                          <Link to="/runplan/fp1" onClick={() => { setMenuOpen(false); setRunPlanSubmenuOpen(false); }}>
                            Run Plan Generator
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
                <li>
                  <div style={{ position: 'relative' }}>
                    <span 
                      onClick={() => setTirePressureSubmenuOpen(!tirePressureSubmenuOpen)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      Tire pressure management {tirePressureSubmenuOpen ? '▼' : '▶'}
                    </span>
                    {tirePressureSubmenuOpen && (
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: '10px 0 10px 20px', 
                        margin: 0,
                        backgroundColor: '#2a2a2a',
                        borderRadius: '4px',
                        marginTop: '5px'
                      }}>
                        <li style={{ padding: '5px 0' }}>
                          <Link to="/tire-pressure/sets-management" onClick={() => { setMenuOpen(false); setTirePressureSubmenuOpen(false); }}>
                            Cold tire pressure sets management
                          </Link>
                        </li>
                        <li style={{ padding: '5px 0' }}>
                          <Link to="/tire-pressure/setup" onClick={() => { setMenuOpen(false); setTirePressureSubmenuOpen(false); }}>
                            Cold tire pressure setup
                          </Link>
                        </li>
                        <li style={{ padding: '5px 0' }}>
                          <Link to="/tire-pressure/database" onClick={() => { setMenuOpen(false); setTirePressureSubmenuOpen(false); }}>
                            Tire pressure database
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
                <li><Link to="/fuel-consumption" onClick={() => setMenuOpen(false)}>Fuel Consumption</Link></li>
                <li><Link to="/weather" onClick={() => setMenuOpen(false)}>Meteo</Link></li>
                <li><Link to="/settings" onClick={() => setMenuOpen(false)}>Impostazioni</Link></li>
              </ul>
            </div>
          </nav>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/general-information" element={<GeneralInformation />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/tire-pressure" element={<TirePressure />} />
            <Route path="/tire-pressure/sets-management" element={<TirePressureSetsManagement />} />
            <Route path="/tire-pressure/setup" element={<TirePressureSetup />} />
            <Route path="/tire-pressure/database" element={<TirePressureDatabase />} />
            <Route path="/runplan/fp1" element={<RunPlanSheet />} />
            <Route path="/fuel-consumption" element={<FuelConsumption />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <div className="container">
            <p>&copy; 2025 Racing Car Manager - Sistema di Gestione Vettura da Gara</p>
          </div>
        </footer>

        {/* CSS Animation for notifications */}
        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    </Router>
  );
}

export default App;
