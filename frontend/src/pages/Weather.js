import React, { useEffect } from 'react';

function Weather() {
  useEffect(() => {
    // Automatically open Windy.com when the component mounts
    window.open('https://www.windy.com', '_blank');
  }, []);

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🌤️ Meteo</h1>
      
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Windy.com</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Il sito Windy.com è stato aperto in una nuova finestra.
        </p>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Se la finestra non si è aperta automaticamente, clicca sul pulsante qui sotto:
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => window.open('https://www.windy.com', '_blank')}
        >
          🌐 Apri Windy.com
        </button>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>ℹ️ Informazioni</h2>
        <p style={{ color: '#666', lineHeight: '1.8' }}>
          Windy.com è uno strumento professionale per la visualizzazione delle condizioni meteo in tempo reale.
          Include:
        </p>
        <ul style={{ lineHeight: '1.8', color: '#666' }}>
          <li>Previsioni meteo dettagliate</li>
          <li>Radar delle precipitazioni</li>
          <li>Velocità e direzione del vento</li>
          <li>Temperatura e pressione atmosferica</li>
          <li>Visibilità e altre informazioni utili per le competizioni</li>
        </ul>
      </div>
    </div>
  );
}

export default Weather;
