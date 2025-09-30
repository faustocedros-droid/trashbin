# Excel to Web App Conversion Guide

This document explains how the original Excel file structure has been converted to a web application.

## Original Excel Structure

The file `03_Race_Imola_25_29_Sett_2025.xlsb.xlsm` contains the following sheets:

### 1. Data Sheets
- **TrackMap**: Track layouts and configurations
- **DatiEvento**: Event data (date, track, weather, etc.)
- **BoP**: Balance of Performance data
- **Motore**: Engine parameters and data

### 2. Session Planning Sheets
- **RunPlanTest1-4**: Test session planning (4 sheets)
- **RunPlanFP1-3**: Free Practice sessions (3 sheets)
- **RunPlanQ**: Qualifying session
- **RunPlanR1**: Race 1
- **RunPlanR2**: Race 2
- **RunPlanEndurance**: Endurance race

### 3. Analysis Sheets
- **Dashboard**: Main dashboard with overview
- **Tyre Temp Optimiser**: Tire temperature optimization
- **Pressioni**: Tire pressure data
- **Assetto**: Car setup data (suspension, aero, etc.)
- **ComandiDashTunnel**: Dashboard commands/controls

## Web App Architecture

### Database Models

The Excel sheets have been converted to database models:

#### 1. RaceEvent Model
Maps to: `DatiEvento` sheet

| Excel Field | Database Field | Type |
|-------------|---------------|------|
| Nome Evento | name | String |
| Circuito | track | String |
| Data Inizio | date_start | DateTime |
| Data Fine | date_end | DateTime |
| Meteo | weather | String |
| Note | notes | Text |

#### 2. Session Model
Maps to: All `RunPlan*` sheets

| Excel Sheet | session_type Value |
|-------------|-------------------|
| RunPlanTest1-4 | Test |
| RunPlanFP1 | FP1 |
| RunPlanFP2 | FP2 |
| RunPlanFP3 | FP3 |
| RunPlanQ | Q |
| RunPlanR1 | R1 |
| RunPlanR2 | R2 |
| RunPlanEndurance | Endurance |

Fields:
- session_type: Type of session
- session_number: Number for multiple sessions of same type
- duration: Session duration in minutes
- fuel_start: Starting fuel in liters
- fuel_consumed: Fuel consumed during session
- tire_set: Tire set identifier
- best_lap_time: Best lap time achieved
- notes: Session notes

#### 3. TireData Model
Maps to: `Pressioni`, `Tyre Temp Optimiser` sheets

| Excel Field | Database Field |
|-------------|---------------|
| Posizione | tire_position (FL, FR, RL, RR) |
| Set Gomme | tire_set |
| Pressione Fredda | pressure_cold |
| Pressione Calda | pressure_hot |
| Temp Interna | temp_inner |
| Temp Centrale | temp_middle |
| Temp Esterna | temp_outer |
| Usura | wear_level |

#### 4. EngineData Model
Maps to: `Motore` sheet

| Excel Field | Database Field |
|-------------|---------------|
| Mappa Motore | engine_map |
| Limite RPM | rpm_limit |
| Temp Olio | oil_temp |
| Temp Acqua | water_temp |
| Consumo Carburante | fuel_consumption_rate |

#### 5. SetupData Model
Maps to: `Assetto` sheet

| Excel Field | Database Field |
|-------------|---------------|
| Ala Anteriore | front_wing |
| Ala Posteriore | rear_wing |
| Altezza Ant | front_ride_height |
| Altezza Post | rear_ride_height |
| Molla Ant | front_spring_rate |
| Molla Post | rear_spring_rate |
| Ammortizzatore Ant Comp | front_damper_compression |
| Ammortizzatore Post Comp | rear_damper_compression |
| Ammortizzatore Ant Reb | front_damper_rebound |
| Ammortizzatore Post Reb | rear_damper_rebound |
| Barra Ant | front_anti_roll_bar |
| Barra Post | rear_anti_roll_bar |
| Campanatura AS | camber_front_left |
| Campanatura AD | camber_front_right |
| Campanatura PS | camber_rear_left |
| Campanatura PD | camber_rear_right |
| Convergenza Ant | toe_front |
| Convergenza Post | toe_rear |
| Bilanciamento Freni | brake_balance |

## Excel Formulas Conversion

The Excel file contains 16,552 formula lines. Here's how they are being converted:

### Common Formula Patterns

#### 1. VLOOKUP Formulas
**Excel:**
```excel
=VLOOKUP(D4,Motore!L:M,2,FALSE)
```

**Python (Backend):**
```python
def lookup_engine_data(value, lookup_table):
    return lookup_table.get(value, None)
```

#### 2. SUM Formulas
**Excel:**
```excel
=SUM(C13:D16)
```

**Python:**
```python
def calculate_total(values):
    return sum(values)
```

#### 3. IF Formulas
**Excel:**
```excel
=IF($H$11="Set#1",$B$17*$N$7,0)
```

**Python:**
```python
def calculate_conditional(tire_set, laps, fuel_rate):
    return laps * fuel_rate if tire_set == "Set#1" else 0
```

### Fuel Calculation Example

**Excel Formula (from RunPlanTest1):**
```excel
Cell C13: =B13*$I$9  # Laps * Fuel per lap
Cell N13: =D7+C13     # Previous fuel + consumed
```

**Python Implementation:**
```python
def calculate_fuel_consumption(laps, fuel_per_lap, previous_fuel):
    """
    Calculate fuel consumption for a stint
    
    Args:
        laps: Number of laps
        fuel_per_lap: Fuel consumption per lap
        previous_fuel: Remaining fuel from previous stint
    
    Returns:
        Total fuel consumed
    """
    consumed = laps * fuel_per_lap
    remaining = previous_fuel + consumed
    return consumed, remaining
```

### Tire Temperature Optimization

**Excel Logic:**
The Tyre Temp Optimiser sheet uses complex formulas to find optimal tire pressures based on temperature readings.

**Web App Implementation:**
```python
def optimize_tire_pressure(temp_inner, temp_middle, temp_outer, target_temp=85):
    """
    Calculate optimal tire pressure based on temperature distribution
    
    Target: Even temperature distribution across tire surface
    Ideal: All temps within 5°C of target
    """
    avg_temp = (temp_inner + temp_middle + temp_outer) / 3
    
    # Calculate pressure adjustment
    if avg_temp < target_temp - 5:
        adjustment = 0.2  # Increase pressure
    elif avg_temp > target_temp + 5:
        adjustment = -0.2  # Decrease pressure
    else:
        adjustment = 0  # No change needed
    
    # Check temperature distribution
    temp_range = max(temp_inner, temp_middle, temp_outer) - min(temp_inner, temp_middle, temp_outer)
    
    return {
        'pressure_adjustment': adjustment,
        'temp_distribution': 'Good' if temp_range < 10 else 'Needs adjustment',
        'average_temp': avg_temp
    }
```

## API Endpoints

The web app provides REST API endpoints to replace Excel operations:

### Events
- `GET /api/events` - List all events (replaces browsing sheets)
- `POST /api/events` - Create new event (replaces adding new Excel file)
- `GET /api/events/{id}` - Get event details (replaces opening specific sheet)
- `PUT /api/events/{id}` - Update event (replaces editing cells)
- `DELETE /api/events/{id}` - Delete event (replaces deleting sheet)

### Sessions
- `GET /api/events/{id}/sessions` - List sessions for event
- `POST /api/events/{id}/sessions` - Create session
- `GET /api/sessions/{id}` - Get session details
- `PUT /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session

### Tire Data
- `GET /api/sessions/{id}/tires` - Get tire data for session
- `POST /api/sessions/{id}/tires` - Add tire measurements

### Archive
- `POST /api/archive` - Archive event to OneDrive

## User Interface Components

### Dashboard (Replaces Excel Dashboard Sheet)
- Overview of all events
- Quick statistics
- Recent activities
- Charts and visualizations

### Event Management (Replaces DatiEvento Sheet)
- Create/edit/delete events
- Track information
- Date and weather data

### Session Management (Replaces RunPlan* Sheets)
- Plan sessions
- Track fuel and tire usage
- Record lap times
- Session notes

### Tire Analysis (Replaces Tyre Temp Optimiser, Pressioni Sheets)
- Temperature monitoring
- Pressure optimization
- Wear tracking
- Visual charts

### Setup Management (Replaces Assetto Sheet)
- Car setup parameters
- Suspension settings
- Aerodynamic configuration
- Comparison between setups

## Data Migration

To migrate data from Excel to the web app:

1. **Export Excel data to CSV**
   - Use Excel's "Save As" to export each sheet as CSV

2. **Create import script**
   ```python
   import pandas as pd
   from app import db, RaceEvent, Session
   
   def import_events(csv_file):
       df = pd.read_csv(csv_file)
       for _, row in df.iterrows():
           event = RaceEvent(
               name=row['name'],
               track=row['track'],
               date_start=row['date_start'],
               date_end=row['date_end']
           )
           db.session.add(event)
       db.session.commit()
   ```

3. **Run import**
   ```bash
   python import_data.py
   ```

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic event management
- ✅ Session planning
- ✅ Data models

### Phase 2 (In Development)
- 🔄 Excel formula logic implementation
- 🔄 Tire optimization calculations
- 🔄 Fuel strategy calculations

### Phase 3 (Planned)
- 📋 OneDrive integration
- 📋 Advanced charting
- 📋 Setup comparison tools
- 📋 Telemetry data visualization

### Phase 4 (Future)
- 📋 Real-time data entry during sessions
- 📋 Mobile app
- 📋 Team collaboration features
- 📋 AI-powered setup recommendations

## Benefits Over Excel

1. **Accessibility**: Access from any device with a browser
2. **Collaboration**: Multiple users can access simultaneously
3. **Data Integrity**: Database ensures data consistency
4. **Scalability**: Handle unlimited events and sessions
5. **Archiving**: Automatic backup and OneDrive integration
6. **Analysis**: Better visualization and reporting tools
7. **Mobile**: Responsive design works on tablets and phones
8. **Version Control**: Track changes and history
9. **Security**: User authentication and access control
10. **Integration**: Can integrate with other racing tools

## Support for Original Excel File

The original Excel file and formulas are preserved in the repository:
- `03_Race_Imola_25_29_Sett_2025.xlsb.xlsm` - Original Excel file
- `formule_estratte.txt` - Extracted formulas (16,552 lines)

These files serve as:
- Reference for formula conversion
- Backup of original data
- Documentation of requirements
