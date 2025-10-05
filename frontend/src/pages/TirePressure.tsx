import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Tire Pressure Management Page
 * Landing page with links to subsections
 */

function TirePressure() {
  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🏎️ Tire Pressure Management</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Gestione delle pressioni pneumatici - Seleziona una sezione
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {/* Card for Cold Tire Pressure Sets Management */}
        <Link to="/tire-pressure/sets-management" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '100%',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '2px solid #4472C4'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{ 
              padding: '30px', 
              backgroundColor: '#E2EFDA',
              borderRadius: '8px 8px 0 0',
              borderBottom: '2px solid #4472C4'
            }}>
              <h2 style={{ margin: 0, color: '#2c5282', fontSize: '24px' }}>
                📊 Cold Tire Pressure Sets Management
              </h2>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
                Gestione completa dei set di pressioni a freddo. Include calcoli basati su temperature 
                e pressioni misurate utilizzando le formule del worksheet Excel "Pressioni".
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Calcolo incrementi pressione</li>
                <li>Conversioni bar/psi</li>
                <li>Rapporti caldo/freddo</li>
                <li>Pressioni corrette raccomandate</li>
              </ul>
            </div>
          </div>
        </Link>

        {/* Card for Cold Tire Pressure Setup */}
        <Link to="/tire-pressure/setup" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '100%',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '2px solid #4472C4'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{ 
              padding: '30px', 
              backgroundColor: '#FFF2CC',
              borderRadius: '8px 8px 0 0',
              borderBottom: '2px solid #4472C4'
            }}>
              <h2 style={{ margin: 0, color: '#2c5282', fontSize: '24px' }}>
                ⚙️ Cold Tire Pressure Setup
              </h2>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
                Configurazione parametri per il setup delle pressioni a freddo. 
                Interfaccia con matrici 2x2 per facilitare l'inserimento dei dati.
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Parametri organizzati in matrici 2x2</li>
                <li>Input strutturato secondo schema Excel</li>
                <li>Configurazione completa dei coefficienti</li>
                <li>Valori di temperatura e pressione</li>
              </ul>
            </div>
          </div>
        </Link>

        {/* Card for Tire Pressure Database */}
        <Link to="/tire-pressure/database" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '100%',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '2px solid #4472C4'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{ 
              padding: '30px', 
              backgroundColor: '#FFE5CC',
              borderRadius: '8px 8px 0 0',
              borderBottom: '2px solid #4472C4'
            }}>
              <h2 style={{ margin: 0, color: '#2c5282', fontSize: '24px' }}>
                🗄️ Tire Pressure Database
              </h2>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
                Database completo per la gestione delle pressioni pneumatici per sessione.
                Include input strutturati per pressioni a freddo e a caldo.
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Selezione sessione (T1-T4, FP1-FP3, Q1-Q2, R1-R2)</li>
                <li>Matrici 2x2 per pressioni a freddo/caldo</li>
                <li>Temperature aria e pista</li>
                <li>Gestione dati giri e set gomme</li>
              </ul>
            </div>
          </div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '30px', backgroundColor: '#e7f3ff' }}>
        <h3>ℹ️ Informazioni</h3>
        <p style={{ lineHeight: '1.6' }}>
          Il modulo Tire Pressure Management è suddiviso in tre sezioni principali:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Cold Tire Pressure Sets Management:</strong> Per la gestione e il calcolo delle pressioni dei pneumatici</li>
          <li><strong>Cold Tire Pressure Setup:</strong> Per la configurazione dei parametri di setup</li>
          <li><strong>Tire Pressure Database:</strong> Database completo per la registrazione delle pressioni per sessione</li>
        </ul>
      </div>
    </div>
  );
}

export default TirePressure;
