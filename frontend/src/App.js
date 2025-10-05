import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventFullDemo from './pages/EventFullDemo';
import TirePressure from './pages/TirePressure';
import Settings from './pages/Settings';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                <h1 className="logo">🏎️ Racing Car Manager</h1>
              </div>
              <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/events" onClick={() => setMenuOpen(false)}>Eventi</Link></li>
                <li><Link to="/tire-pressure" onClick={() => setMenuOpen(false)}>Tire pressure management</Link></li>
                <li><Link to="/demo" onClick={() => setMenuOpen(false)}>Demo</Link></li>
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
            <Route path="/demo" element={<EventFullDemo />} />
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
