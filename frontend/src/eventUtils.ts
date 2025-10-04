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
export const deleteLapFromSession = (eventId: string, sessionId: string, lapId: string): void => {
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
