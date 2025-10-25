# Racing Car Management Application

A web application for managing racing car data, sessions, and telemetry - converted from an Excel-based system.

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

### Option 1: Install from Prebuilt Package (Recommended)

Download and install the latest release for your platform:

**Windows:**
1. Download `Racing-Car-Manager-Setup-x.x.x.exe` from the [Releases](https://github.com/faustocedros-droid/trashbin/releases) page
2. Run the installer and follow the setup wizard
3. Launch "Racing Car Manager" from the Start Menu or Desktop

**macOS:**
1. Download `Racing-Car-Manager-x.x.x.dmg` from the [Releases](https://github.com/faustocedros-droid/trashbin/releases) page
2. Open the DMG and drag the app to Applications
3. Launch from Applications folder

**Linux:**
1. Download the `.AppImage` or `.deb` file from the [Releases](https://github.com/faustocedros-droid/trashbin/releases) page
2. For AppImage: `chmod +x Racing-Car-Manager-x.x.x.AppImage && ./Racing-Car-Manager-x.x.x.AppImage`
3. For DEB: `sudo dpkg -i Racing-Car-Manager-x.x.x.deb`

See [INSTALL.md](INSTALL.md) for detailed installation instructions and troubleshooting.

### Option 2: Run from Source (Desktop App)

The easiest way to run from source is with the desktop app, which automatically starts both the backend and frontend.

**Linux/macOS:**
```bash
./start-desktop.sh
```

**Windows:**
```batch
start-desktop.bat
```

See [DESKTOP_APP_README.md](DESKTOP_APP_README.md) for more details.

### Option 3: Manual Installation (Web App)

### Prerequisites
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

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

- **Development**: Run backend and frontend separately
- **Production**: Deploy backend and frontend separately (Heroku, Docker, etc.)

## Building Installation Packages

To build installation packages from source:

### Prerequisites for Building
- Node.js 16+
- npm
- Python 3.9+ (must be in PATH)

### Build Commands

**Windows:**
```batch
build-installer.bat
```

**Linux/macOS:**
```bash
./build-installer.sh
```

**Or build for specific platforms:**
```bash
cd frontend
npm install
npm run build

# Choose one:
npm run electron-build-win     # Windows installer
npm run electron-build-mac     # macOS DMG
npm run electron-build-linux   # Linux AppImage and DEB
```

The installation packages will be created in the `dist/` directory.

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
