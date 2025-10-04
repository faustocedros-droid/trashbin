/**
 * Type definitions for the Racing Car Manager application
 * These models represent the data structures used throughout the app
 */

// Tipo per un giro (lap)
export interface Lap {
  id: string | number; // string for localStorage, number for backend
  lapNumber: number;
  lapTime: string; // formato MM:SS.mmm (calcolato automaticamente dalla somma dei settori)
  sector1?: string; // tempo settore 1 in formato SS.mmm
  sector2?: string; // tempo settore 2 in formato SS.mmm
  sector3?: string; // tempo settore 3 in formato SS.mmm
  sector4?: string; // tempo settore 4 in formato SS.mmm
  fuelConsumed?: number; // litri consumati in questo giro
  tireSet?: string;
  lapStatus?: 'RF' | 'FCY' | 'SC' | 'TFC' | null; // stato del giro
  notes?: string;
}

// Tipo per una sessione
export interface Session {
  id: string;
  session_type: 'Test' | 'FP1' | 'FP2' | 'FP3' | 'Q' | 'R1' | 'R2' | 'Endurance';
  session_number: number;
  duration?: number; // minuti
  fuel_start?: number; // litri
  fuel_per_lap?: number; // litri consumati per giro
  fuel_consumed?: number; // litri totali consumati
  tire_set?: string;
  best_lap_time?: string;
  session_status?: 'RF' | 'FCY' | 'SC' | 'TFC' | null; // stato della sessione
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
  fuel_per_lap: number;
  tire_set: string;
  session_status: Session['session_status'];
  notes: string;
}

// Tipo per i dati del form di modifica giro
export interface LapFormData {
  lapNumber: number;
  lapTime: string;
  sector1: string;
  sector2: string;
  sector3: string;
  sector4: string;
  fuelConsumed: number;
  tireSet: string;
  lapStatus: 'RF' | 'FCY' | 'SC' | 'TFC' | null;
  notes: string;
}
