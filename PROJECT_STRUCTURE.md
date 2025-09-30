# Racing Car Manager - Project Structure

```
trashbin/
│
├── 03_Race_Imola_25_29_Sett_2025.xlsb.xlsm  # Original Excel file (preserved)
├── formule_estratte.txt                      # 16,552 extracted formulas
│
├── README.md                                 # Project overview
├── DEPLOYMENT.md                             # Deployment guide
├── CONVERSION_GUIDE.md                       # Excel to WebApp mapping
├── .gitignore                                # Git ignore rules
│
├── start.sh                                  # Quick start script (Linux/Mac)
├── start.bat                                 # Quick start script (Windows)
│
├── backend/                                  # Python/Flask Backend
│   ├── app.py                               # Main Flask application
│   ├── models.py                            # Database models (5 models)
│   ├── calculations.py                      # Racing calculations (9 functions)
│   ├── test_api.py                          # API test suite
│   ├── requirements.txt                     # Python dependencies
│   ├── .env.example                         # Environment template
│   └── venv/                                # Python virtual environment (created on setup)
│
├── frontend/                                # React Frontend
│   ├── public/
│   │   └── index.html                      # HTML template
│   ├── src/
│   │   ├── index.js                        # React entry point
│   │   ├── index.css                       # Global styles
│   │   ├── App.js                          # Main app component
│   │   ├── App.css                         # App styles
│   │   ├── services/
│   │   │   └── api.js                      # API client
│   │   └── pages/
│   │       ├── Dashboard.js                # Dashboard page
│   │       ├── Events.js                   # Events management
│   │       └── EventDetail.js              # Event detail
│   ├── package.json                        # Node.js dependencies
│   ├── .env.example                        # Environment template
│   └── node_modules/                       # Node dependencies (created on npm install)
│
└── scripts/                                 # Utility Scripts
    ├── import_excel_data.py                # Data import utility
    └── calculation_examples.py             # Calculation demonstrations
```

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (React Frontend - Port 3000)                  │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard  │  Events List  │  Event Detail  │  Session Mgmt   │
└─────────────┴───────────────┴────────────────┴─────────────────┘
                                │
                                │ HTTP/JSON
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         REST API                                 │
│                   (Flask Backend - Port 5000)                    │
├─────────────────────────────────────────────────────────────────┤
│  /api/events        │  /api/sessions      │  /api/archive      │
│  /api/events/{id}   │  /api/sessions/{id} │  /api/health       │
└─────────────────────┴─────────────────────┴────────────────────┘
                                │
                                │ ORM (SQLAlchemy)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│                    (SQLite / PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│  RaceEvent  │  Session  │  TireData  │  EngineData  │  SetupData │
└─────────────┴───────────┴────────────┴──────────────┴───────────┘
```

## Database Schema

```
┌─────────────────────┐
│    RaceEvent        │
├─────────────────────┤
│ • id (PK)           │
│ • name              │
│ • track             │
│ • date_start        │
│ • date_end          │
│ • weather           │
│ • notes             │
│ • created_at        │
│ • updated_at        │
└──────────┬──────────┘
           │ 1:N
           │
┌──────────▼──────────┐
│     Session         │
├─────────────────────┤
│ • id (PK)           │
│ • event_id (FK)     │
│ • session_type      │
│ • session_number    │
│ • duration          │
│ • fuel_start        │
│ • fuel_consumed     │
│ • tire_set          │
│ • best_lap_time     │
│ • notes             │
│ • created_at        │
│ • updated_at        │
└──────────┬──────────┘
           │ 1:N
           ├──────────────┬──────────────┬──────────────┐
           │              │              │              │
┌──────────▼──────┐ ┌────▼──────────┐ ┌─▼────────────┐ ┌─▼────────────┐
│   TireData      │ │  EngineData   │ │  SetupData   │ │  (Future)    │
├─────────────────┤ ├───────────────┤ ├──────────────┤ ├──────────────┤
│ • id (PK)       │ │ • id (PK)     │ │ • id (PK)    │ │ • LapData    │
│ • session_id    │ │ • session_id  │ │ • session_id │ │ • Telemetry  │
│ • tire_position │ │ • engine_map  │ │ • front_wing │ │ • Weather    │
│ • tire_set      │ │ • rpm_limit   │ │ • rear_wing  │ │ • Notes      │
│ • pressure_cold │ │ • oil_temp    │ │ • ride_height│ │              │
│ • pressure_hot  │ │ • water_temp  │ │ • springs    │ │              │
│ • temp_inner    │ │ • fuel_rate   │ │ • dampers    │ │              │
│ • temp_middle   │ │ • notes       │ │ • anti_roll  │ │              │
│ • temp_outer    │ │ • created_at  │ │ • camber     │ │              │
│ • wear_level    │ │               │ │ • toe        │ │              │
│ • notes         │ │               │ │ • brakes     │ │              │
│ • created_at    │ │               │ │ • notes      │ │              │
│                 │ │               │ │ • created_at │ │              │
└─────────────────┘ └───────────────┘ └──────────────┘ └──────────────┘
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { "status": "healthy", "timestamp": "..." }
```

### Events
```
GET    /api/events              - List all events
POST   /api/events              - Create new event
GET    /api/events/{id}         - Get specific event
PUT    /api/events/{id}         - Update event
DELETE /api/events/{id}         - Delete event
GET    /api/events/{id}/sessions - Get event sessions
POST   /api/events/{id}/sessions - Create session for event
```

### Sessions
```
GET    /api/sessions/{id}       - Get session details
PUT    /api/sessions/{id}       - Update session
DELETE /api/sessions/{id}       - Delete session
GET    /api/sessions/{id}/tires - Get tire data
POST   /api/sessions/{id}/tires - Add tire data
```

### Archive
```
POST   /api/archive             - Archive event to OneDrive
Body: { "event_id": 1 }
```

## Racing Calculations Module

### Functions Available

1. **calculate_fuel_consumption(laps, fuel_per_lap)**
   - Calculates total fuel needed
   - Excel: `=B13*$I$9`

2. **calculate_fuel_remaining(initial_fuel, consumed_fuel)**
   - Tracks remaining fuel
   - Excel: `=D7-C13`

3. **calculate_stint_strategy(duration, lap_time, tank_capacity, fuel_per_lap)**
   - Plans pit stops
   - Calculates stint lengths
   - Excel: Complex formulas across RunPlan sheets

4. **optimize_tire_pressure(temps, current_pressure, target_temp)**
   - Optimizes pressure from temperatures
   - Analyzes temperature distribution
   - Excel: Tyre Temp Optimiser sheet logic

5. **calculate_lap_time_with_fuel(base_time, fuel_weight, fuel_effect)**
   - Adjusts lap time for fuel load
   - Excel: `=base_lap_time + (fuel_weight * 0.035)`

6. **calculate_tire_wear(laps_on_tire, tire_life, wear_rate)**
   - Tracks tire degradation
   - Excel: Wear calculations in Pressioni sheet

7. **calculate_race_time(laps, base_time, fuel_per_lap, initial_fuel)**
   - Simulates complete race
   - Includes pit stops
   - Excel: Sum of all lap times

8. **calculate_setup_balance(front_wing, rear_wing, front_spring, rear_spring)**
   - Analyzes car balance
   - Excel: Assetto sheet calculations

9. **format_time(seconds)**
   - Formats time display
   - Excel: Time formatting functions

## Excel Sheet Mapping

| Excel Sheet              | Web App Component              | Database Model |
|-------------------------|--------------------------------|----------------|
| DatiEvento              | Events management page         | RaceEvent      |
| RunPlanTest1-4          | Session management (Test)      | Session        |
| RunPlanFP1-3            | Session management (FP)        | Session        |
| RunPlanQ                | Session management (Qualify)   | Session        |
| RunPlanR1-2             | Session management (Race)      | Session        |
| RunPlanEndurance        | Session management (Endurance) | Session        |
| Pressioni               | Tire data tracking             | TireData       |
| Tyre Temp Optimiser     | Tire optimization              | TireData       |
| Motore                  | Engine data                    | EngineData     |
| Assetto                 | Setup data                     | SetupData      |
| Dashboard               | Dashboard page                 | All models     |
| TrackMap                | (Future) Track visualization   | -              |
| BoP                     | (Future) BoP data              | -              |
| ComandiDashTunnel       | (Future) Commands panel        | -              |

## Technology Stack

### Backend
- **Language:** Python 3.9+
- **Framework:** Flask 3.0
- **ORM:** SQLAlchemy 2.0
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **API:** RESTful with JSON
- **CORS:** Flask-CORS
- **Calculations:** pandas, python-dateutil

### Frontend
- **Language:** JavaScript ES6+
- **Framework:** React 18
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **UI Components:** Material-UI 5
- **Charts:** Chart.js 4 (ready)
- **Styling:** CSS3 + Emotion

### Development Tools
- **Version Control:** Git
- **Package Managers:** pip, npm
- **Testing:** Python unittest, React Testing Library (ready)
- **Linting:** ESLint (configurable)

## Deployment Options

### Backend
1. **Heroku** - Easy deployment with buildpacks
2. **Docker** - Containerized deployment
3. **AWS/Azure/GCP** - Cloud platforms
4. **VPS** - Traditional server hosting

### Frontend
1. **Vercel** - Automatic React deployment
2. **Netlify** - Static site hosting
3. **GitHub Pages** - Free static hosting
4. **AWS S3 + CloudFront** - Scalable CDN

### Database
1. **SQLite** - File-based (development)
2. **PostgreSQL** - Production database
3. **MySQL** - Alternative option
4. **Heroku Postgres** - Managed service

## Getting Started

### 1. Quick Start (Recommended)
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### 2. Manual Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### 3. Run Tests
```bash
# Backend tests
cd backend
source venv/bin/activate
python test_api.py

# Calculation examples
python ../scripts/calculation_examples.py
```

### 4. Import Data
```bash
# Interactive import wizard
python scripts/import_excel_data.py
```

## Key Features

✅ Multi-session event management
✅ Fuel strategy calculations
✅ Tire pressure optimization
✅ Lap time predictions
✅ Setup balance analysis
✅ Data persistence with database
✅ RESTful API architecture
✅ Responsive web interface
✅ OneDrive archiving (ready)
✅ Comprehensive documentation

## Support & Maintenance

- **Documentation:** README.md, DEPLOYMENT.md, CONVERSION_GUIDE.md
- **Examples:** scripts/calculation_examples.py
- **Import Guide:** scripts/import_excel_data.py
- **Test Suite:** backend/test_api.py
- **Environment:** .env.example files

## License

Private project for racing team use.
