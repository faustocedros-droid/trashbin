# Schedule Table Implementation - General Information Page

## Overview
This document describes the implementation of the editable schedule table feature in the General Information page.

## Requirements Met ✅

1. **Structured table with "SCHEDULE" header** ✅
   - Clear header section with "SCHEDULE" title
   
2. **7 columns representing days of the week** ✅
   - Lunedì (Monday)
   - Martedì (Tuesday)
   - Mercoledì (Wednesday)
   - Giovedì (Thursday)
   - Venerdì (Friday)
   - Sabato (Saturday)
   - Domenica (Sunday)

3. **15 editable rows** ✅
   - Each row contains editable input fields for all 7 days
   - Users can enter session times, activities, or notes

4. **Automatic localStorage persistence** ✅
   - All changes are automatically saved to localStorage
   - Data is loaded on component mount
   - Key: `generalInfo_schedule`

5. **Clean table styling** ✅
   - Consistent with existing application design
   - Uses the same `.table` class and styling patterns
   - Responsive with `overflowX: 'auto'` for mobile devices

## Implementation Details

### File Modified
- `frontend/src/pages/GeneralInformation.js`

### State Management
```javascript
const [scheduleData, setScheduleData] = useState([]);
```

### Data Structure
Each row in the schedule is represented as an object:
```javascript
{
  rowId: 0,
  monday: '',
  tuesday: '',
  wednesday: '',
  thursday: '',
  friday: '',
  saturday: '',
  sunday: ''
}
```

### Key Functions

#### 1. `initializeScheduleData()`
Initializes 15 empty rows with 7 columns for days of the week.

#### 2. `handleScheduleChange(rowIndex, dayKey, value)`
Handles changes to schedule inputs:
- Updates the state
- Automatically persists to localStorage
- Called on every input change

### localStorage Integration
- **Storage Key**: `generalInfo_schedule`
- **Data Format**: JSON string of array containing 15 row objects
- **Auto-save**: Triggers on every input change
- **Auto-load**: Loads on component mount with error handling

### UI Features
- **Input Fields**: Full-width text inputs in each cell
- **Placeholder**: "..." to indicate editable fields
- **Styling**: 
  - Clean borders (1px solid #ddd)
  - 4px border radius
  - 8px padding
  - 14px font size
  - Proper box-sizing

### Error Handling
- Try-catch block when loading from localStorage
- Falls back to initializing empty data if localStorage is corrupted
- Console error logging for debugging

## Usage

1. Navigate to the General Information page
2. Scroll down to the SCHEDULE section
3. Click on any cell to enter text
4. Data is automatically saved as you type
5. Refresh the page - all data persists

## Examples of Use Cases

- **Session Times**: "FP1 10:00-11:00", "Qualifying 15:00"
- **Activities**: "Setup check", "Tire test", "Debrief"
- **Notes**: "Rain expected", "Track temperature: 25°C"
- **Multi-session days**: Enter multiple sessions in the same cell

## Future Enhancements (Optional)

While the current implementation meets all requirements, potential future enhancements could include:
- Time picker integration
- Color coding for different session types
- Export/import schedule data
- Template presets for common race weekend formats
- Row labels (e.g., "Session 1", "Session 2", etc.)

## Testing

The implementation has been:
- ✅ Built successfully with no compilation errors
- ✅ Tested for localStorage persistence
- ✅ Verified to work with the existing application structure
- ✅ Checked for responsive design

## Screenshots

See `screenshot-schedule-table.png` for a visual representation of the implemented feature.
