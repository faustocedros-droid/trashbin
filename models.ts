// TypeScript type definitions for Racing Car Manager
// Based on backend/models.py Python models

// Session types supported by the application
export type SessionType = 'Test' | 'FP1' | 'FP2' | 'FP3' | 'Q' | 'R1' | 'R2' | 'Endurance';

// Timing sheet entry for tracking lap times
export interface TimingSheetEntry {
  lapNumber: number;
  lapTime: string;
  sector1?: string;
  sector2?: string;
  sector3?: string;
  fuelUsed?: number;
  notes?: string;
}

// Timing sheet for a session
export interface TimingSheet {
  sessionId: string;
  entries: TimingSheetEntry[];
  bestLap?: string;
  averageLap?: string;
}

// Session model matching backend Session model
export interface Session {
  id: string;
  eventId: string;
  sessionType: SessionType;
  sessionNumber: number;
  duration?: number;
  fuelStart?: number;
  fuelConsumed?: number;
  tireSet?: string;
  bestLapTime?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  timingSheet?: TimingSheet;
}

// Event model matching backend RaceEvent model
export interface Event {
  id: string;
  name: string;
  track: string;
  dateStart: string;
  dateEnd: string;
  weather?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  sessions: Session[];
}
