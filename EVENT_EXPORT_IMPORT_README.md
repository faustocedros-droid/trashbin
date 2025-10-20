# Event Export/Import Functionality

## Overview

The Event Detail page now includes functionality to export and import **complete events with ALL their content** from all sections and subsections. This allows users to create a comprehensive archive of events or share complete event data between different installations of the application.

## Features

### Export Event
- **Location**: Event Detail page (`/events/:id`)
- **Button**: "💾 Esporta Evento"
- **File Format**: `.rcme` (Racing Car Manager Event)
- **File Content**: Single JSON file containing ALL event data:
  - Event metadata (name, track, dates, weather, notes, track length)
  - All sessions with their configurations
  - All laps for each session with complete timing data
  - **Complete localStorage data from all sections:**
    - Run Plan history and current run plan
    - Tire Pressure Database (all entries)
    - Tire Pressure Session Table
    - Tire Pressure Sets Management
    - Tire Pressure Setup configuration
    - Setup Sheet data (complete vehicle setup)
    - Circuit Image (Base64 encoded)
    - Weekly Schedule Table
    - Fuel Consumption data
    - Event Features (document file paths)
    - Track length configuration
  - Export date and version information (v3.0)

### Import Event
- **Location**: Event Detail page (`/events/:id`) or Events List page (`/events`)
- **Button**: "📂 Importa Evento"
- **Accepted Files**: `.rcme` files
- **Behavior**:
  - Creates a new event with "(Importato)" suffix
  - Recreates all sessions with their original configuration
  - Recreates all laps with complete timing data
  - **Restores ALL localStorage data:**
    - Imports all RunPlans into the RunPlan history
    - Imports current RunPlan data
    - Imports all Tire Pressure database entries
    - Imports Tire Pressure Session Table
    - Imports Tire Pressure Sets Management data
    - Imports Tire Pressure Setup configuration
    - Imports Setup Sheet data (complete vehicle setup)
    - Imports Circuit Image
    - Imports Weekly Schedule Table
    - Imports Fuel Consumption data
    - Imports Event Features (document file paths)
    - Imports Track length configuration
  - Shows detailed confirmation dialog listing all data to be imported
  - Redirects to Events list after successful import
  - **Backward compatibility**: Supports importing v2.0 format files

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

The `.rcme` file is a JSON file with the following structure (v3.0):

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
  "localStorage": {
    "runPlanHistory": [...],
    "runPlanCurrent": {...},
    "tirePressureDatabase": [...],
    "tirePressureSessionTable": {...},
    "tirePressureSetsManagement": {...},
    "tirePressureSetup": {...},
    "setup": {...},
    "circuitImage": "data:image/png;base64,...",
    "schedule": [...],
    "fuelConsumption": {...},
    "eventFeatures": {...},
    "trackLength": 5.793
  },
  "runPlans": [...],
  "tirePressureDatabase": [...],
  "exportDate": "2024-10-10T10:36:39.740Z",
  "version": "3.0"
}
```

**Note**: The v3.0 format includes a comprehensive `localStorage` object containing all section data. For backward compatibility, `runPlans` and `tirePressureDatabase` are still included at the root level.

## Technical Details

### Export Implementation
- Fetches all sessions for the event
- For each session, fetches all laps
- Retrieves **ALL relevant data from localStorage:**
  - Run Plan history (`runPlanSheet_history`)
  - Current Run Plan data (`runPlanSheet_data`)
  - Complete Tire Pressure database (`tirePressureDatabase`)
  - Tire Pressure Session Table (`tirePressureSessionTable`)
  - Tire Pressure Sets Management (`tirePressureSetsManagement`)
  - Tire Pressure Setup (`tirePressureSetup`)
  - Complete Setup Sheet data (`generalInfo_setup`)
  - Circuit Image (`generalInfo_circuitImage`)
  - Weekly Schedule Table (`generalInfo_schedule`)
  - Fuel Consumption data (`fuelConsumption_data`)
  - Event Features file paths (`eventFeatures_filePaths`)
  - Track length (`currentTrackLength`)
- Combines all data into a single JSON structure (v3.0 format)
- Creates a downloadable Blob with the JSON data
- Generates a descriptive filename based on event name and date
- Shows confirmation message listing all exported data items

### Import Implementation
- Reads and parses the `.rcme` file
- Validates the file structure
- Shows detailed confirmation dialog listing all data to be imported
- Creates a new event via the API
- Creates sessions sequentially
- Creates laps for each session
- **Restores ALL localStorage data:**
  - Imports RunPlans into localStorage history with unique IDs
  - Imports current RunPlan data
  - Imports Tire Pressure database entries with unique IDs
  - Imports Tire Pressure Session Table
  - Imports Tire Pressure Sets Management
  - Imports Tire Pressure Setup configuration
  - Imports Setup Sheet data
  - Imports Circuit Image
  - Imports Weekly Schedule Table
  - Imports Fuel Consumption data
  - Imports Event Features file paths
  - Imports Track length
- Handles errors with user-friendly messages
- **Backward compatibility**: Supports v2.0 format files (imports only runPlans and tirePressureDatabase)

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
- **Comprehensive data coverage:**
  - Event metadata and sessions
  - Lap timing and telemetry
  - Run Plans (history and current)
  - Tire Pressure data (database, sessions, setup, sets management)
  - Vehicle Setup configuration
  - Circuit information (image and schedule)
  - Fuel consumption calculations
  - Event features and documents
- **Version compatibility:**
  - v3.0: Full localStorage data export/import
  - v2.0: RunPlans and Tire Pressure database only
  - Import automatically detects and handles both formats

## Use Cases

1. **Complete Event Archive**: Export entire events with ALL their data to create comprehensive archives
2. **Backup**: Export events regularly to have complete offline backups of all event data
3. **Sharing**: Share complete event data with team members or other users
4. **Migration**: Transfer all data between different installations or computers
5. **Analysis**: Export data for external analysis while preserving all context
6. **Historical Records**: Keep complete historical event data in files
7. **Team Collaboration**: Share setups, tire pressures, and all configurations with team members
8. **Event Replication**: Import previous event data as a starting point for similar events

## Notes

- Each import creates a new event (doesn't overwrite existing events)
- The import process is sequential (sessions and laps are created one by one)
- Large events with many sessions and laps may take a few seconds to import
- **File size**: Depends on the amount of data, especially if circuit image is included (typically < 5MB)
- **localStorage data**: All imported localStorage data is merged with existing data (not replaced)
- **Unique IDs**: Import generates new unique IDs for all imported items to prevent conflicts
- **Data persistence**: After import, all data is available in their respective sections of the app
- **Complete restoration**: Importing an event file restores the complete working environment for that event
