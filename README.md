# Racing Car Management Application

A desktop and web application for managing racing car data, sessions, and telemetry - converted from an Excel-based system.

## 🖥️ Desktop App Available!

**NEW**: Racing Car Manager è ora disponibile come applicazione desktop standalone!

### Quick Start Desktop App

**Windows:**
```bash
start-desktop.bat
```

**macOS/Linux:**
```bash
./start-desktop.sh
```

📖 **Vedi [DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md) per la guida completa all'app desktop**

### Vantaggi App Desktop
- ✅ Nessun browser necessario
- ✅ Menu nativi del sistema operativo
- ✅ Icona sul desktop
- ✅ Scorciatoie da tastiera globali
- ✅ Backend avviato automaticamente
- ✅ Funziona offline
- ✅ Aspetto e funzioni identiche alla web app

---

## Overview

This application replaces the complex Excel file `03_Race_Imola_25_29_Sett_2025.xlsb.xlsm` with a modern web interface that provides:

- Race event management
- Session planning and tracking (Tests, Free Practice, Qualifying, Races)
- Tire management and optimization
- Engine and setup data
- Telemetry analysis
- OneDrive integration for archiving race data

## Architecture

### Backend (Python/Flask)
- RESTful API for data management
- Excel formula logic implemented in Python
- Database models for races, sessions, and telemetry
- OneDrive integration for archiving

### Frontend (React)
- Modern responsive UI
- Data visualization with charts
- Real-time calculations
- Session management interface

### Database (SQLite/PostgreSQL)
- Stores all race events, sessions, and telemetry data
- Replaces Excel sheets with proper database tables

## Excel Sheets Mapping

The original Excel file contains the following sheets that are being converted:

1. **TrackMap** - Track layouts and configurations
2. **DatiEvento** - Event data (dates, tracks, weather)
3. **BoP** - Balance of Performance data
4. **RunPlanTest1-4** - Test session planning
5. **RunPlanFP1-3** - Free Practice session planning
6. **RunPlanQ** - Qualifying session planning
7. **RunPlanR1-2** - Race session planning
8. **RunPlanEndurance** - Endurance race planning
9. **Motore** - Engine data and parameters
10. **Dashboard** - Main dashboard view
11. **Tyre Temp Optimiser** - Tire temperature optimization
12. **Pressioni** - Tire pressure data
13. **Assetto** - Car setup data

## Installation

### Desktop App (Recommended)

The easiest way to use Racing Car Manager is as a desktop application:

**Windows:**
```bash
start-desktop.bat
```

**macOS/Linux:**
```bash
./start-desktop.sh
```

See [DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md) for complete desktop app documentation.

### Web App (Traditional)

#### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Deployment Options

### 1. Desktop App
- **Development**: Use `start-desktop.bat` or `start-desktop.sh`
- **Production**: Build with `npm run electron-build` (see [DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md))
- **Platforms**: Windows, macOS, Linux

### 2. Web App
- **Development**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Production**: Deploy backend and frontend separately (Heroku, Docker, etc.)

## Features

### Current Features
- [In Development] Basic project structure
- [In Development] Data models for races and sessions
- [In Development] API endpoints

### Planned Features
- Race event creation and management
- Session planning with fuel and tire calculations
- Telemetry data visualization
- Setup comparison tools
- OneDrive archiving and retrieval
- Data import from Excel
- PDF report generation

## Development Status

This is an active conversion project. The Excel file contains 16,552 formula lines that are being gradually converted to application logic.

## License

Private project for racing team use.
