"""
Test script for Racing Car Management API
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import RaceEvent, Session, TireData, EngineData, SetupData
from datetime import datetime

def init_database():
    """Initialize database with tables"""
    with app.app_context():
        db.create_all()
        print("✓ Database tables created successfully")

def test_create_event():
    """Test creating a race event"""
    with app.app_context():
        event = RaceEvent(
            name="Test Race Imola 2025",
            track="Autodromo Enzo e Dino Ferrari",
            date_start=datetime(2025, 9, 25, 9, 0),
            date_end=datetime(2025, 9, 29, 18, 0),
            weather="Sunny, 25°C",
            notes="Test event for system validation"
        )
        db.session.add(event)
        db.session.commit()
        print(f"✓ Created event: {event.name} (ID: {event.id})")
        return event.id

def test_create_session(event_id):
    """Test creating a session"""
    with app.app_context():
        session = Session(
            event_id=event_id,
            session_type="FP1",
            session_number=1,
            duration=60,
            fuel_start=50.0,
            tire_set="Set#1",
            notes="Free Practice 1"
        )
        db.session.add(session)
        db.session.commit()
        print(f"✓ Created session: {session.session_type} (ID: {session.id})")
        return session.id

def test_create_tire_data(session_id):
    """Test creating tire data"""
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
                temp_outer=82.0
            )
            db.session.add(tire)
        db.session.commit()
        print(f"✓ Created tire data for 4 positions")

def test_api_endpoints():
    """Test API endpoints"""
    with app.test_client() as client:
        # Test health endpoint
        response = client.get('/api/health')
        assert response.status_code == 200
        print("✓ Health endpoint working")
        
        # Test get all events
        response = client.get('/api/events')
        assert response.status_code == 200
        events = response.json
        print(f"✓ Get events endpoint working (found {len(events)} events)")
        
        if events:
            event_id = events[0]['id']
            
            # Test get specific event
            response = client.get(f'/api/events/{event_id}')
            assert response.status_code == 200
            print(f"✓ Get specific event endpoint working")
            
            # Test get sessions for event
            response = client.get(f'/api/events/{event_id}/sessions')
            assert response.status_code == 200
            sessions = response.json
            print(f"✓ Get sessions endpoint working (found {len(sessions)} sessions)")

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*50)
    print("Racing Car Management API - Test Suite")
    print("="*50 + "\n")
    
    try:
        print("1. Initializing database...")
        init_database()
        
        print("\n2. Testing event creation...")
        event_id = test_create_event()
        
        print("\n3. Testing session creation...")
        session_id = test_create_session(event_id)
        
        print("\n4. Testing tire data creation...")
        test_create_tire_data(session_id)
        
        print("\n5. Testing API endpoints...")
        test_api_endpoints()
        
        print("\n" + "="*50)
        print("✓ All tests passed successfully!")
        print("="*50 + "\n")
        
    except Exception as e:
        print(f"\n✗ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
