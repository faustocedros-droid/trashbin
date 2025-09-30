import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <div className="container">
              <h1 className="logo">🏎️ Racing Car Manager</h1>
              <ul className="nav-links">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/events">Eventi</Link></li>
              </ul>
            </div>
          </nav>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
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
