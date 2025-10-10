import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tirePressureSubmenuOpen, setTirePressureSubmenuOpen] = useState(false);
  const [runPlanSubmenuOpen, setRunPlanSubmenuOpen] = useState(false);

  return (
    <Router>
      <div className="App">
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
            <Route path="/tire-pressure" element={<TirePressure />} />
            <Route path="/tire-pressure/sets-management" element={<TirePressureSetsManagement />} />
            <Route path="/tire-pressure/setup" element={<TirePressureSetup />} />
            <Route path="/tire-pressure/database" element={<TirePressureDatabase />} />
            <Route path="/runplan/fp1" element={<RunPlanSheet />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <div className="container">
            <p>&copy; 2025 Racing Car Manager - Sistema di Gestione Vettura da Gara</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
