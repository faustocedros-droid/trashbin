// Event and Session utility functions for Racing Car Manager
// Provides helper functions for managing events, sessions, and timing sheets

import { Event, Session, SessionType, TimingSheet } from './models';

/**
 * Generates a unique ID for sessions/events
 * Uses timestamp + random suffix for uniqueness
 * @param prefix - Optional prefix for the ID (e.g., 'session', 'event')
 * @returns Unique ID string
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomSuffix}` : `${timestamp}_${randomSuffix}`;
}

/**
 * Calculates the next session number for a given session type
 * Used for automatic progressive numbering per session type
 * @param event - The event containing existing sessions
 * @param sessionType - The type of session to get the next number for
 * @returns The next session number for the given type
 */
export function getNextSessionNumber(event: Event, sessionType: SessionType): number {
  // Filter sessions by type and find the highest session number
  const sessionsOfType = event.sessions.filter(s => s.sessionType === sessionType);
  
  if (sessionsOfType.length === 0) {
    return 1;
  }
  
  const maxNumber = Math.max(...sessionsOfType.map(s => s.sessionNumber));
  return maxNumber + 1;
}

/**
 * Adds a new session to an event with automatic numbering
 * Creates a new session and updates the session number automatically
 * @param event - The event to add the session to
 * @param sessionData - Partial session data (type is required, number will be auto-calculated)
 * @returns Updated event with the new session added
 */
export function addSession(
  event: Event,
  sessionData: Omit<Session, 'id' | 'eventId' | 'sessionNumber' | 'createdAt' | 'updatedAt'>
): Event {
  // Generate unique ID for the session
  const sessionId = generateId('session');
  
  // Calculate the next session number for this type
  const sessionNumber = getNextSessionNumber(event, sessionData.sessionType);
  
  // Create the new session with auto-generated fields
  const newSession: Session = {
    ...sessionData,
    id: sessionId,
    eventId: event.id,
    sessionNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Create empty timing sheet for the session
  newSession.timingSheet = createEmptyTimingSheet(sessionId);
  
  // Add session to event and return updated event
  return {
    ...event,
    sessions: [...event.sessions, newSession],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Creates an empty timing sheet for a session
 * Initializes a timing sheet with no entries
 * @param sessionId - The ID of the session
 * @returns Empty timing sheet object
 */
export function createEmptyTimingSheet(sessionId: string): TimingSheet {
  return {
    sessionId,
    entries: [],
    bestLap: undefined,
    averageLap: undefined,
  };
}

/**
 * Updates a session within an event by ID
 * Finds the session by ID and updates its properties
 * @param event - The event containing the session
 * @param sessionId - ID of the session to update
 * @param updates - Partial session data to update
 * @returns Updated event with the modified session
 */
export function updateSession(
  event: Event,
  sessionId: string,
  updates: Partial<Omit<Session, 'id' | 'eventId' | 'createdAt'>>
): Event {
  const updatedSessions = event.sessions.map(session => {
    if (session.id === sessionId) {
      return {
        ...session,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return session;
  });
  
  return {
    ...event,
    sessions: updatedSessions,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Removes a session from an event by ID
 * Filters out the session with the specified ID
 * @param event - The event containing the session
 * @param sessionId - ID of the session to remove
 * @returns Updated event with the session removed
 */
export function deleteSession(event: Event, sessionId: string): Event {
  const filteredSessions = event.sessions.filter(session => session.id !== sessionId);
  
  return {
    ...event,
    sessions: filteredSessions,
    updatedAt: new Date().toISOString(),
  };
}
