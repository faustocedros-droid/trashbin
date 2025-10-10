# Event Export/Import Test Guide

This guide provides instructions for manually testing the enhanced event export/import functionality that now includes RunPlans and Tire Pressure database.

## Test Scenario 1: Export Event with All Data

### Setup
1. Start the application: `npm start` from the frontend directory
2. Navigate to an event detail page
3. Ensure you have:
   - At least one session with some laps
   - Some RunPlans saved in localStorage (create a RunPlan from the RunPlan page)
   - Some Tire Pressure entries in localStorage (add entries from Tire Pressure page)

### Testing Export
1. Click the "💾 Esporta Evento" button
2. Verify a `.rcme` file is downloaded
3. Open the downloaded file in a text editor
4. Verify the JSON structure contains:
   - `event` object with event metadata
   - `sessions` array with session and lap data
   - `runPlans` array with all RunPlan entries from localStorage
   - `tirePressureDatabase` array with all tire pressure entries
   - `exportDate` timestamp
   - `version` field set to "2.0"

### Expected Export File Structure
```json
{
  "event": { ... },
  "sessions": [ ... ],
  "runPlans": [
    {
      "id": "unique-id",
      "timestamp": "ISO-date",
      "eventName": "Event Name",
      "trackName": "Track Name",
      "sessionName": "Session Name",
      "data": { ... }
    }
  ],
  "tirePressureDatabase": [
    {
      "id": "unique-id",
      "session": "FP1",
      "tireSet": "Set#1",
      "coldPressures": { "FL": "2.0", "FR": "2.0", "RL": "2.0", "RR": "2.0" },
      "hotPressures": { "FL": "2.3", "FR": "2.3", "RL": "2.3", "RR": "2.3" },
      ...
    }
  ],
  "exportDate": "2024-10-10T...",
  "version": "2.0"
}
```

## Test Scenario 2: Import Event with All Data

### Setup
1. Use the `.rcme` file exported in Test Scenario 1
2. Optionally, clear localStorage to simulate a fresh installation:
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh the page

### Testing Import
1. Click the "📂 Importa Evento" button
2. Select the `.rcme` file exported earlier
3. Verify the confirmation dialog shows:
   - Event name
   - Number of sessions
   - Number of RunPlans (if present)
   - Number of Tire Pressure database entries (if present)
4. Confirm the import
5. Wait for the import to complete
6. Verify you're redirected to the Events list

### Verification After Import
1. **Event Data**: 
   - Find the imported event (look for "(Importato)" suffix)
   - Verify all event metadata is correct
   
2. **Sessions and Laps**:
   - Click on the imported event
   - Verify all sessions are present
   - Select each session and verify all laps are imported correctly
   
3. **RunPlans**:
   - Navigate to the RunPlan page
   - Click "📚 Mostra Storico RunPlan"
   - Verify imported RunPlans are present in the history
   - Look for entries with `imported: true` flag
   
4. **Tire Pressure Database**:
   - Navigate to the Tire Pressure Database page
   - Verify all imported tire pressure entries are present
   - Check that entries have unique IDs (no duplicates)

## Test Scenario 3: Backward Compatibility

### Testing Old Format Files (Version 1.0)
1. Create a simple `.rcme` file with version 1.0 format (without runPlans and tirePressureDatabase):
```json
{
  "event": { ... },
  "sessions": [ ... ],
  "exportDate": "2024-10-10T...",
  "version": "1.0"
}
```
2. Try to import this file
3. Verify:
   - Import completes successfully
   - Event and sessions are imported correctly
   - No errors occur due to missing runPlans/tirePressureDatabase fields

## Test Scenario 4: Empty Data Arrays

### Testing Export with No RunPlans or Tire Pressure Data
1. Clear localStorage:
   - `localStorage.removeItem('runPlanSheet_history')`
   - `localStorage.removeItem('tirePressureDatabase')`
2. Export an event
3. Verify the exported file contains:
   - `runPlans: []`
   - `tirePressureDatabase: []`
4. Import this file
5. Verify import completes without errors

## Expected Behavior Summary

### Export
- ✅ Exports event metadata
- ✅ Exports all sessions with laps
- ✅ Exports all RunPlans from localStorage
- ✅ Exports all Tire Pressure database entries
- ✅ Sets version to "2.0"
- ✅ Creates `.rcme` file with descriptive filename

### Import
- ✅ Imports event with "(Importato)" suffix
- ✅ Recreates all sessions and laps
- ✅ Imports RunPlans into localStorage with unique IDs
- ✅ Imports Tire Pressure entries into localStorage with unique IDs
- ✅ Shows confirmation with count of RunPlans and Tire Pressure entries
- ✅ Handles missing runPlans/tirePressureDatabase fields gracefully
- ✅ Redirects to Events list after successful import

## Known Behaviors

1. **Unique IDs**: Imported RunPlans and Tire Pressure entries get new unique IDs to avoid conflicts
2. **Timestamps**: RunPlans get a new timestamp on import to reflect when they were imported
3. **Imported Flag**: Imported entries are marked with `imported: true` for tracking
4. **Append Mode**: Import appends to existing localStorage data rather than replacing it
5. **No Duplicates Check**: The system doesn't check for duplicates - if you import the same file twice, you'll get duplicate entries

## Troubleshooting

### Issue: Export file is empty or missing data
- Check browser console for errors
- Verify localStorage has the expected data before export
- Check that you have sessions and laps in the event

### Issue: Import fails with validation error
- Verify the file is valid JSON
- Check that `event` and `sessions` fields are present
- Ensure the file hasn't been corrupted

### Issue: RunPlans or Tire Pressure data not imported
- Check that the export file contains these fields
- Verify the import process completed without errors
- Check browser console for any localStorage errors

## Notes for Developers

- The export/import functionality uses localStorage for RunPlans and Tire Pressure database
- Version number changed from "1.0" to "2.0" to reflect the new format
- Import is backward compatible with version 1.0 files
- The file extension remains `.rcme` (Racing Car Manager Event)
