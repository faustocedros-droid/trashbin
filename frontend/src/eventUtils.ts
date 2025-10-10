/**
 * Utility functions for managing events and sessions in localStorage
 */

import { RaceEvent, Session, Lap } from './models';

const STORAGE_KEY = 'racingCarManager_events';

/**
 * Carica tutti gli eventi dal localStorage
 */
export const loadEventsFromStorage = (): RaceEvent[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};

/**
 * Salva tutti gli eventi nel localStorage
 */
export const saveEventsToStorage = (events: RaceEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

/**
 * Carica un singolo evento dal localStorage
 */
export const loadEventFromStorage = (eventId: string): RaceEvent | null => {
  const events = loadEventsFromStorage();
  return events.find(e => e.id === eventId) || null;
};

/**
 * Salva o aggiorna un evento nel localStorage
 */
export const saveEventToStorage = (event: RaceEvent): void => {
  const events = loadEventsFromStorage();
  const index = events.findIndex(e => e.id === event.id);
  
  if (index >= 0) {
    events[index] = event;
  } else {
    events.push(event);
  }
  
  saveEventsToStorage(events);
};

/**
 * Aggiorna una sessione specifica all'interno di un evento
 */
export const updateSessionInStorage = (eventId: string, session: Session): void => {
  const event = loadEventFromStorage(eventId);
  if (!event) return;
  
  const sessionIndex = event.sessions.findIndex(s => s.id === session.id);
  if (sessionIndex >= 0) {
    event.sessions[sessionIndex] = session;
    saveEventToStorage(event);
  }
};

/**
 * Aggiunge un giro a una sessione
 */
export const addLapToSession = (eventId: string, sessionId: string, lap: Lap): void => {
  const event = loadEventFromStorage(eventId);
  if (!event) return;
  
  const session = event.sessions.find(s => s.id === sessionId);
  if (session) {
    session.laps.push(lap);
    saveEventToStorage(event);
  }
};

/**
 * Aggiorna un giro esistente
 */
export const updateLapInSession = (eventId: string, sessionId: string, lap: Lap): void => {
  const event = loadEventFromStorage(eventId);
  if (!event) return;
  
  const session = event.sessions.find(s => s.id === sessionId);
  if (session) {
    const lapIndex = session.laps.findIndex(l => l.id === lap.id);
    if (lapIndex >= 0) {
      session.laps[lapIndex] = lap;
      saveEventToStorage(event);
    }
  }
};

/**
 * Elimina un giro da una sessione
 */
export const deleteLapFromSession = (eventId: string, sessionId: string, lapId: string | number): void => {
  const event = loadEventFromStorage(eventId);
  if (!event) return;
  
  const session = event.sessions.find(s => s.id === sessionId);
  if (session) {
    session.laps = session.laps.filter(l => l.id !== lapId);
    saveEventToStorage(event);
  }
};

/**
 * Genera un ID univoco semplice
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calcola il miglior tempo sul giro da un array di giri
 */
export const calculateBestLapTime = (laps: Lap[]): string | undefined => {
  if (laps.length === 0) return undefined;
  
  const times = laps
    .map(lap => lap.lapTime)
    .filter(time => time && time.trim() !== '');
  
  if (times.length === 0) return undefined;
  
  // Converte i tempi in secondi per il confronto
  const timeToSeconds = (time: string): number => {
    const parts = time.split(':');
    if (parts.length !== 2) return Infinity;
    const [minutes, seconds] = parts;
    return parseInt(minutes) * 60 + parseFloat(seconds);
  };
  
  times.sort((a, b) => timeToSeconds(a) - timeToSeconds(b));
  return times[0];
};

/**
 * Calcola il consumo totale di carburante da un array di giri
 */
export const calculateTotalFuelConsumed = (laps: Lap[]): number => {
  return laps.reduce((total, lap) => total + (lap.fuelConsumed || 0), 0);
};

/**
 * Calcola il carburante residuo basato sul carburante iniziale e i giri completati
 * @param fuelStart - Carburante iniziale in litri
 * @param fuelPerLap - Consumo carburante per giro in litri
 * @param completedLaps - Numero di giri completati
 * @returns Carburante residuo in litri
 */
export const calculateRemainingFuel = (fuelStart: number, fuelPerLap: number, completedLaps: number): number => {
  return fuelStart - (fuelPerLap * completedLaps);
};

/**
 * Calcola il miglior tempo teorico dalla somma dei migliori settori
 * @param laps - Array di giri
 * @returns Tempo teorico in formato MM:SS.mmm o undefined se non ci sono dati
 */
export const calculateTheoreticalBestLap = (laps: Lap[]): string | undefined => {
  if (laps.length === 0) return undefined;
  
  // Trova i migliori tempi per ciascun settore
  const bestSectors = [1, 2, 3, 4].map(sectorNum => {
    const sectorKey = `sector${sectorNum}` as keyof Lap;
    const sectorTimes = laps
      .map(lap => lap[sectorKey] as string | undefined)
      .filter(time => time && time.trim() !== '')
      .map(time => parseFloat(time as string))
      .filter(time => !isNaN(time));
    
    if (sectorTimes.length === 0) return 0;
    return Math.min(...sectorTimes);
  });
  
  // Se non ci sono dati per tutti i settori, ritorna undefined
  if (bestSectors.some(sector => sector === 0)) return undefined;
  
  // Calcola il tempo totale
  const totalSeconds = bestSectors.reduce((sum, sector) => sum + sector, 0);
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(3);
  const paddedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds;
  
  return `${minutes}:${paddedSeconds}`;
};

/**
 * Calcola il tempo totale del giro dalla somma dei settori
 * @param sector1 - Tempo settore 1 in formato SS.mmm
 * @param sector2 - Tempo settore 2 in formato SS.mmm
 * @param sector3 - Tempo settore 3 in formato SS.mmm
 * @param sector4 - Tempo settore 4 in formato SS.mmm
 * @returns Tempo totale in formato MM:SS.mmm
 */
export const calculateLapTimeFromSectors = (
  sector1: string,
  sector2: string,
  sector3: string,
  sector4: string
): string => {
  // Converte un tempo settore (SS.mmm) in secondi
  const sectorToSeconds = (sector: string): number => {
    if (!sector || sector.trim() === '') return 0;
    const parsed = parseFloat(sector);
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalSeconds = 
    sectorToSeconds(sector1) + 
    sectorToSeconds(sector2) + 
    sectorToSeconds(sector3) + 
    sectorToSeconds(sector4);

  if (totalSeconds === 0) return '';

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(3);
  
  // Assicura che i secondi siano sempre con 2 cifre prima del punto decimale
  const paddedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds;
  
  return `${minutes}:${paddedSeconds}`;
};

/**
 * Calcola il passo sessione (media mobile degli ultimi 3 giri)
 * @param laps - Array di giri
 * @returns Tempo medio in formato MM:SS.mmm o undefined se non ci sono abbastanza dati
 */
export const calculateSessionPace = (laps: Lap[]): string | undefined => {
  // Deve esserci almeno il quarto giro per calcolare la media mobile
  if (laps.length < 4) return undefined;
  
  // Ordina i giri per numero
  const sortedLaps = [...laps].sort((a, b) => a.lapNumber - b.lapNumber);
  
  // Prende gli ultimi 3 giri
  const lastThreeLaps = sortedLaps.slice(-3);
  
  // Converte il tempo del giro in secondi
  const lapTimeToSeconds = (time: string): number => {
    if (!time || time.trim() === '') return 0;
    const parts = time.split(':');
    if (parts.length !== 2) return 0;
    const [minutes, seconds] = parts;
    const totalSeconds = parseInt(minutes) * 60 + parseFloat(seconds);
    return isNaN(totalSeconds) ? 0 : totalSeconds;
  };
  
  // Calcola i tempi in secondi degli ultimi 3 giri
  const lapTimes = lastThreeLaps
    .map(lap => lapTimeToSeconds(lap.lapTime))
    .filter(time => time > 0);
  
  // Deve avere almeno 3 tempi validi
  if (lapTimes.length < 3) return undefined;
  
  // Calcola la media
  const averageSeconds = lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length;
  
  // Converte in formato MM:SS.mmm
  const minutes = Math.floor(averageSeconds / 60);
  const seconds = (averageSeconds % 60).toFixed(3);
  const paddedSeconds = parseFloat(seconds) < 10 ? `0${seconds}` : seconds;
  
  return `${minutes}:${paddedSeconds}`;
};
