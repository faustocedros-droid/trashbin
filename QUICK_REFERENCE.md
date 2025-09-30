# Quick Reference Guide

## Using the Racing Dashboard Workbook

This guide provides quick instructions for using the `03_Race_Imola_25_29_Sett_2025.xlsm` workbook safely and effectively.

---

## ⚠️ Before You Start

### Security Considerations
1. **Enable Macros Carefully**: This workbook requires macros to function. Only enable macros if you trust the source.
2. **Update File Paths**: Many buttons reference hard-coded file paths that won't exist on your system.
3. **Review External Scripts**: The workbook can execute a Python script - review it before running.

### System Requirements
- Microsoft Excel 2007 or later
- Windows OS (for some Shell commands)
- Python installed (if using data conversion features)
- Access to referenced PDF documents (optional)

---

## Setting Up the Workbook

### Step 1: Update Configuration
Before using the dashboard, update these items:

1. **Update File Paths** (if you have the external documents):
   - Edit Foglio29 VBA code
   - Search for all hard-coded paths (D:\ and C:\)
   - Replace with your actual file locations

2. **Verify Sheet Names**:
   - Ensure all required sheets exist
   - Check that sheet names match those referenced in VBA code

### Step 2: Test Basic Functionality
1. Try navigation buttons first (they don't require external files)
2. Test save functionality
3. Verify dropdown menus work correctly

---

## Dashboard Navigation

### Main Menu (Dashboard Sheet)

#### Navigation Buttons
| Button | Goes To | Purpose |
|--------|---------|---------|
| Consumi | Fuel Consumption | Track fuel usage |
| Dati Evento | Event Data | Event information |
| Pressioni | Tire Pressures | Calculate tire pressures |
| Track Map | Circuit Map | View track layout |
| Assetto | Setup | Vehicle setup changes |
| Situazione Gomme | Tire Status | Tire usage tracking |
| Riepilogo | Summary | Overall summary |

#### Dynamic Menus
- **Run Plan Dropdown** (Cell L6): Select session to view its run plan
- **Session Times Dropdown** (Cell O6): View timing data for selected session
- **Print Selection Dropdown** (Cell O25): Choose sheet to print

#### Document Access (Requires External Files)
- Various buttons open PDFs and images
- Will show errors if files don't exist
- See MACRO_INVENTORY.md for complete list

#### Tools
- **Meteo**: Opens Windy.com weather website
- **Save**: Saves the workbook
- **Print**: Opens print dialog for selected sheet
- **Convert Data**: Runs Python data converter (requires setup)

---

## Worksheet Overview

### Data Entry Sheets
- **DatiEvento**: Event details, track info, session times
- **Pressioni**: Tire pressure calculator inputs
- **Consumi**: Fuel consumption tracking
- **Assetto**: Setup sheet for vehicle changes

### Run Planning Sheets
Each session has a dedicated run plan:
- RunPlanTest1-4: Test session planning
- RunPlanFP1-3: Free practice planning
- RunPlanQ: Qualifying planning
- RunPlanR1-2: Race planning
- RunPlanEndurance: Endurance race strategy

### Timing Sheets
- Test1-4: Test session lap times
- FP1-3: Free practice times
- Qualy: Qualifying times
- Race1-2: Race lap times

### Reference Sheets
- **TrackMap**: Circuit layout
- **ComandiDashTunnel**: Dashboard/steering controls reference
- **Tyre Temp Optimiser**: Tire temperature analysis
- **BoP**: Balance of Performance data

---

## Common Tasks

### Starting a New Event
1. Go to **DatiEvento** sheet
2. Update event name, date, location
3. Update track information
4. Set session times
5. Update tire allocations

### Planning a Session
1. Select session from dropdown (Cell L6)
2. Click **Run Plan** button
3. Fill in stint planning
4. Track tire usage
5. Monitor fuel consumption

### During a Session
1. Use dropdown (Cell O6) to select active session
2. Click **Session Times** button
3. Enter lap times as they come in
4. Monitor running calculations
5. Track tire wear and fuel usage

### Reviewing Setup Changes
1. Click **Assetto** button
2. Review previous setup
3. Document changes made
4. Note driver feedback
5. Track performance differences

### Accessing Documents
1. Ensure external files exist at specified paths
2. Click document button (e.g., "Manuale")
3. Document opens in default application
4. If error occurs, file path needs updating

---

## Troubleshooting

### Macro Errors
**Problem**: "File not found" errors  
**Solution**: Update hard-coded file paths in VBA code or remove buttons for missing files

**Problem**: "Subscript out of range"  
**Solution**: Sheet name mismatch - verify all required sheets exist

**Problem**: "Object required"  
**Solution**: Check that dropdown values match expected options

### Navigation Issues
**Problem**: Button doesn't work  
**Solution**: Check if target sheet exists with correct name

**Problem**: Dropdown doesn't populate  
**Solution**: Verify data validation source range exists

### Print Issues
**Problem**: Print dialog shows wrong sheet  
**Solution**: Check O25 value matches available sheet name in Motore!C3:C13

### Data Conversion
**Problem**: Python script won't run  
**Solution**: 
1. Verify Python is installed
2. Check script path is correct
3. Ensure script file exists
4. Check script for errors

---

## Best Practices

### Data Management
1. **Save Regularly**: Use the Save button or Ctrl+S
2. **Backup Before Events**: Copy workbook before each event
3. **Archive After Events**: Save completed events separately
4. **Document Changes**: Use setup sheet to track all changes

### Session Planning
1. **Pre-Event Planning**: Complete all run plans before arriving
2. **Tire Strategy**: Plan tire usage across all sessions
3. **Fuel Strategy**: Calculate fuel requirements in advance
4. **Contingency Plans**: Have backup plans for each session

### Data Entry
1. **Real-Time Updates**: Enter data as it happens
2. **Verify Entries**: Double-check critical numbers
3. **Use Consistency**: Follow same entry format always
4. **Review After Session**: Check all data is complete

---

## Customization Tips

### Adding New Documents
1. Open VBA Editor (Alt+F11)
2. Find Foglio29 module
3. Locate a document button's code
4. Copy and modify for new button
5. Update file path and descriptions

### Modifying File Paths
Instead of editing each button individually, consider:
1. Create a "Config" sheet
2. Store base paths in cells
3. Modify VBA to read from config
4. Update paths in one location

### Adding New Sheets
1. Create new sheet
2. Add to appropriate dropdown list
3. Update VBA SelectCase statements if needed
4. Test navigation

---

## Security Notes

### What This Workbook Does
- ✅ Saves data to itself only
- ✅ Opens external PDF documents (read-only)
- ✅ Opens web browser to weather site
- ✅ Executes Python script (if configured)
- ✅ Opens print dialog

### What This Workbook Does NOT Do
- ❌ Connect to internet (except user-initiated website)
- ❌ Send data anywhere
- ❌ Modify system files
- ❌ Install software
- ❌ Access registry
- ❌ Modify other files

### Recommendations
1. Keep macro security set to "Disable all macros with notification"
2. Only enable macros when you opened the file intentionally
3. Review VBA code if you're concerned
4. Don't enable macros from untrusted sources
5. Keep backups before enabling macros

---

## Support

### Documentation Files
- **README.md**: Repository overview
- **VBA_SECURITY_ANALYSIS.md**: Detailed security assessment
- **MACRO_INVENTORY.md**: Complete macro documentation
- **QUICK_REFERENCE.md**: This file

### Getting Help
1. Review the relevant documentation file
2. Check VBA code comments (if any)
3. Verify all prerequisites are met
4. Check file paths and sheet names
5. Review error messages carefully

---

## Racing-Specific Notes

### Lamborghini Huracan GT3 EVO2
This workbook is configured for:
- Lamborghini Huracan GT3 EVO2 specifications
- Italian GT Championship regulations
- Super Trofeo regulations (some sheets)
- Specific tire compound management
- Bosch Motorsport ECU data

### Event Types Supported
- Test Days (4 sessions)
- Race Weekends (3 practice, qualifying, 2 races)
- Endurance Races (dedicated strategy sheet)

### Data Sources
- Manual entry during sessions
- Motec telemetry (via conversion script)
- Pit lane timing
- Driver feedback
- Setup changes

---

## Changelog / Version Control

When making changes to the workbook:
1. Document the change date
2. Note what was modified
3. Keep previous versions as backup
4. Test thoroughly before events
5. Share updates with team

---

*For detailed technical information, see the complete documentation set.*
