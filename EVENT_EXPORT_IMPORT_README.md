# Event Export/Import Functionality

## Overview

The Event Detail page now includes functionality to export and import complete events with all their sessions and laps data. This allows users to backup events or share them between different installations of the application.

## Features

### Export Event
- **Location**: Event Detail page (`/events/:id`)
- **Button**: "💾 Esporta Evento"
- **File Format**: `.rcme` (Racing Car Manager Event)
- **File Content**: JSON file containing:
  - Event metadata (name, track, dates, weather, notes)
  - All sessions with their configurations
  - All laps for each session with complete timing data
  - All RunPlans generated for the event (from localStorage)
  - Complete Tire Pressure database (from localStorage)
  - Export date and version information

### Import Event
- **Location**: Event Detail page (`/events/:id`)
- **Button**: "📂 Importa Evento"
- **Accepted Files**: `.rcme` files
- **Behavior**:
  - Creates a new event with "(Importato)" suffix
  - Recreates all sessions with their original configuration
  - Recreates all laps with complete timing data
  - Imports all RunPlans into the RunPlan history (localStorage)
  - Imports all Tire Pressure database entries (localStorage)
  - Redirects to Events list after successful import

## Usage

### Exporting an Event

1. Navigate to an event detail page
2. Click the "💾 Esporta Evento" button
3. The browser will download a file named `event_<EventName>_<Date>.rcme`
4. Save the file to your preferred location

**Example filename**: `event_GP_Monza_2024_2024-10-10.rcme`

### Importing an Event

1. Navigate to any event detail page (the import button is available on any event)
2. Click the "📂 Importa Evento" button
3. Select a `.rcme` file from your computer
4. Confirm the import in the dialog that shows:
   - Event name
   - Number of sessions
   - Total number of laps
5. Wait for the import to complete
6. The app will redirect you to the Events list showing the newly imported event

## File Format

The `.rcme` file is a JSON file with the following structure:

```json
{
  "event": {
    "name": "Event Name",
    "track": "Track Name",
    "date_start": "2024-01-01T00:00:00Z",
    "date_end": "2024-01-01T23:59:59Z",
    "weather": "Sunny",
    "notes": "Event notes",
    "track_length": 5.793
  },
  "sessions": [
    {
      "session_type": "FP1",
      "session_number": 1,
      "duration": 60,
      "fuel_start": 50,
      "fuel_per_lap": 2.5,
      "tire_set": "Set#1",
      "session_status": null,
      "notes": "Session notes",
      "laps": [
        {
          "lap_number": 1,
          "lap_time": "1:42.345",
          "sector1": "25.123",
          "sector2": "28.456",
          "sector3": "30.789",
          "sector4": "22.012",
          "fuel_consumed": 2.5,
          "tire_set": "Set#1",
          "lap_status": null,
          "notes": "Lap notes"
        }
      ]
    }
  ],
  "runPlans": [
    {
      "id": "runplan-id",
      "timestamp": "2024-10-10T10:36:39.740Z",
      "eventName": "Event Name",
      "trackName": "Track Name",
      "sessionName": "FP1",
      "data": {
        "O4": "Event Name",
        "D4": "Track Name",
        "O5": "FP1",
        ...
      }
    }
  ],
  "tirePressureDatabase": [
    {
      "id": "entry-id",
      "session": "FP1",
      "tireSet": "Set#1",
      "coldPressures": {
        "FL": "2.0",
        "FR": "2.0",
        "RL": "2.0",
        "RR": "2.0"
      },
      "coldSetTemp": "20",
      "hotPressures": {
        "FL": "2.3",
        "FR": "2.3",
        "RL": "2.3",
        "RR": "2.3"
      },
      "laps": "10",
      "airTemp": "25",
      "trackTemp": "35",
      "initialKm": "100"
    }
  ],
  "exportDate": "2024-10-10T10:36:39.740Z",
  "version": "2.0"
}
```

## Technical Details

### Export Implementation
- Fetches all sessions for the event
- For each session, fetches all laps
- Retrieves all RunPlans from localStorage (key: 'runPlanSheet_history')
- Retrieves complete Tire Pressure database from localStorage (key: 'tirePressureDatabase')
- Combines data into a single JSON structure
- Creates a downloadable Blob with the JSON data
- Generates a descriptive filename based on event name and date

### Import Implementation
- Reads and parses the `.rcme` file
- Validates the file structure
- Creates a new event via the API
- Creates sessions sequentially
- Creates laps for each session
- Imports RunPlans into localStorage history with unique IDs
- Imports Tire Pressure database entries into localStorage with unique IDs
- Handles errors with user-friendly messages

### Error Handling
- Invalid file format detection
- Missing data validation
- API error handling
- User confirmation before import
- Progress feedback via alerts

## Compatibility

- Works with the existing backend API
- Compatible with all event types (Test, FP1, FP2, FP3, Q, R1, R2, Endurance)
- Supports all lap timing data including:
  - 4-sector timing
  - Fuel consumption
  - Tire sets
  - Lap status (RF, FCY, SC, TFC)
  - Notes

## Use Cases

1. **Backup**: Export events regularly to have offline backups
2. **Sharing**: Share event data with team members or other users
3. **Migration**: Transfer data between different installations
4. **Analysis**: Export data for external analysis tools
5. **Archive**: Keep historical event data in files

## Notes

- Each import creates a new event (doesn't overwrite existing events)
- The import process is sequential (sessions and laps are created one by one)
- Large events with many sessions and laps may take a few seconds to import
- File size depends on the number of sessions and laps (typically < 1MB)
