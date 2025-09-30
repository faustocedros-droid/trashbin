/**
 * Type definitions for the Racing Car Manager application
 * These models represent the data structures used throughout the app
 */

// Tipo per un giro (lap)
export interface Lap {
  id: string;
  lapNumber: number;
  lapTime: string; // formato MM:SS.mmm
  fuelConsumed?: number; // litri consumati in questo giro
  tireSet?: string;
  notes?: string;
}

// Tipo per una sessione
export interface Session {
  id: string;
  session_type: 'Test' | 'FP1' | 'FP2' | 'FP3' | 'Q' | 'R1' | 'R2' | 'Endurance';
  session_number: number;
  duration?: number; // minuti
  fuel_start?: number; // litri
  fuel_consumed?: number; // litri totali consumati
  tire_set?: string;
  best_lap_time?: string;
  notes?: string;
  laps: Lap[]; // array di giri
}

// Tipo per un evento
export interface RaceEvent {
  id: string;
  name: string;
  track: string;
  date_start: string;
  date_end: string;
  weather?: string;
  notes?: string;
  sessions: Session[];
}

// Tipo per i dati del form di modifica sessione
export interface SessionFormData {
  session_type: Session['session_type'];
  session_number: number;
  duration: number;
  fuel_start: number;
  tire_set: string;
  notes: string;
}

// Tipo per i dati del form di modifica giro
export interface LapFormData {
  lapNumber: number;
  lapTime: string;
  fuelConsumed: number;
  tireSet: string;
  notes: string;
}
