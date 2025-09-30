"""
Excel Data Import Script
Import data from the existing Excel file into the web application database
"""

import sys
import os
import pandas as pd
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app, db
from models import RaceEvent, Session, TireData, EngineData, SetupData

EXCEL_FILE = '../03_Race_Imola_25_29_Sett_2025.xlsb.xlsm'

def import_event_data():
    """Import event data from DatiEvento sheet"""
    print("Importing event data...")
    
    try:
        # Read the Excel file
        # Note: .xlsb format may require additional libraries
        # You may need to convert to .xlsx first or use pyxlsb library
        
        # Example structure for manual import:
        with app.app_context():
            event = RaceEvent(
                name="Race Imola 25-29 Sett 2025",
                track="Autodromo Enzo e Dino Ferrari - Imola",
                date_start=datetime(2025, 9, 25, 9, 0),
                date_end=datetime(2025, 9, 29, 18, 0),
                weather="Variabile",
                notes="Evento di gara importato da Excel"
            )
            db.session.add(event)
            db.session.commit()
            print(f"✓ Created event: {event.name} (ID: {event.id})")
            return event.id
            
    except Exception as e:
        print(f"✗ Error importing event data: {e}")
        return None

def import_session_data(event_id):
    """Import session data from RunPlan sheets"""
    print("Importing session data...")
    
    # Define sessions based on Excel sheets
    sessions_config = [
        {'type': 'Test', 'number': 1, 'duration': 60},
        {'type': 'Test', 'number': 2, 'duration': 60},
        {'type': 'Test', 'number': 3, 'duration': 60},
        {'type': 'Test', 'number': 4, 'duration': 60},
        {'type': 'FP1', 'number': 1, 'duration': 45},
        {'type': 'FP2', 'number': 1, 'duration': 45},
        {'type': 'FP3', 'number': 1, 'duration': 30},
        {'type': 'Q', 'number': 1, 'duration': 30},
        {'type': 'R1', 'number': 1, 'duration': None},  # Race duration depends on laps
        {'type': 'R2', 'number': 1, 'duration': None},
    ]
    
    try:
        with app.app_context():
            session_ids = []
            for config in sessions_config:
                session = Session(
                    event_id=event_id,
                    session_type=config['type'],
                    session_number=config['number'],
                    duration=config['duration'],
                    fuel_start=50.0,  # Default starting fuel
                    tire_set="Set#1",
                    notes=f"Imported from Excel - {config['type']}"
                )
                db.session.add(session)
                db.session.commit()
                session_ids.append(session.id)
                print(f"✓ Created session: {session.session_type} #{session.session_number}")
            
            return session_ids
            
    except Exception as e:
        print(f"✗ Error importing session data: {e}")
        return []

def import_tire_data_template(session_id):
    """Import tire data template (actual data needs to be extracted from Excel)"""
    print(f"Creating tire data template for session {session_id}...")
    
    try:
        with app.app_context():
            tire_positions = ['FL', 'FR', 'RL', 'RR']
            
            for position in tire_positions:
                tire = TireData(
                    session_id=session_id,
                    tire_position=position,
                    tire_set="Set#1",
                    pressure_cold=2.0,
                    pressure_hot=2.3,
                    temp_inner=85.0,
                    temp_middle=88.0,
                    temp_outer=82.0,
                    wear_level=0.0
                )
                db.session.add(tire)
            
            db.session.commit()
            print(f"✓ Created tire data for session {session_id}")
            
    except Exception as e:
        print(f"✗ Error creating tire data: {e}")

def manual_excel_data_guide():
    """Print guide for manual data extraction from Excel"""
    print("\n" + "="*70)
    print("MANUAL DATA EXTRACTION GUIDE")
    print("="*70)
    print("""
The Excel file uses .xlsb format with macros, which requires manual extraction.

STEPS TO EXTRACT DATA:

1. OPEN EXCEL FILE
   - Open: 03_Race_Imola_25_29_Sett_2025.xlsb.xlsm
   - Enable macros if prompted

2. EXPORT DATA TO CSV
   For each sheet you want to import:
   
   a) DatiEvento (Event Data):
      - Go to DatiEvento sheet
      - Select relevant cells with event info
      - Save As → CSV (Comma delimited)
      - Save as: data/evento.csv
   
   b) RunPlan sheets (Session Data):
      - For each RunPlanTest1, RunPlanFP1, etc.
      - Export key data (fuel, laps, tire sets)
      - Save as: data/sessions/[sheet_name].csv
   
   c) Pressioni (Tire Pressure):
      - Export pressure data
      - Save as: data/tire_pressure.csv
   
   d) Tyre Temp Optimiser:
      - Export temperature readings
      - Save as: data/tire_temps.csv
   
   e) Assetto (Setup):
      - Export setup parameters
      - Save as: data/setup.csv
   
   f) Motore (Engine):
      - Export engine parameters
      - Save as: data/engine.csv

3. CREATE DATA DIRECTORY
   mkdir -p data/sessions

4. RUN IMPORT SCRIPT
   python scripts/import_excel_data.py

ALTERNATIVE - USE OPENPYXL:
   
   If you save the Excel file as .xlsx (not .xlsb), you can use:
   - File → Save As → Excel Workbook (.xlsx)
   - Then this script can read it directly with pandas

FORMULAS:
   
   The file 'formule_estratte.txt' contains all 16,552 formulas.
   These are being implemented in the backend calculations.py module.
   
   Example formulas that are now implemented:
   - Fuel consumption: =B13*$I$9 → calculate_fuel_consumption()
   - Tire optimization: Complex formulas → optimize_tire_pressure()
   - Lap time adjustments → calculate_lap_time_with_fuel()

""")
    print("="*70)

def create_sample_data():
    """Create sample data for demonstration"""
    print("\nCreating sample data for demonstration...")
    
    try:
        # Create event
        event_id = import_event_data()
        
        if event_id:
            # Create sessions
            session_ids = import_session_data(event_id)
            
            # Create tire data for first session
            if session_ids:
                import_tire_data_template(session_ids[0])
        
        print("\n✓ Sample data created successfully!")
        print("\nYou can now start the application:")
        print("  Backend:  python backend/app.py")
        print("  Frontend: cd frontend && npm start")
        
    except Exception as e:
        print(f"\n✗ Error creating sample data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("\n" + "="*70)
    print("RACING CAR MANAGER - DATA IMPORT UTILITY")
    print("="*70)
    
    # Show manual guide
    manual_excel_data_guide()
    
    # Ask if user wants to create sample data
    response = input("\nCreate sample data for demonstration? (y/n): ")
    
    if response.lower() == 'y':
        create_sample_data()
    else:
        print("\nTo import real data, follow the manual extraction guide above.")
        print("After extracting to CSV, modify this script to read your CSV files.")
