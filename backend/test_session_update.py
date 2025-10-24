"""
Integration test for session update functionality
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import RaceEvent, Session
from datetime import datetime

def test_session_update_flow():
    """Test the complete session create, read, update flow"""
    print("\n" + "="*70)
    print("Testing Session Update Functionality")
    print("="*70 + "\n")
    
    with app.app_context():
        # Clean up database
        db.drop_all()
        db.create_all()
        print("✓ Database initialized")
        
        # Create a test event
        event = RaceEvent(
            name="Test Event for Session Update",
            track="Test Track",
            date_start=datetime(2025, 10, 1, 9, 0),
            date_end=datetime(2025, 10, 3, 18, 0),
            weather="Sunny"
        )
        db.session.add(event)
        db.session.commit()
        print(f"✓ Created test event (ID: {event.id})")
        
        # Create initial session
        session = Session(
            event_id=event.id,
            session_type="FP1",
            session_number=1,
            duration=60,
            fuel_start=50.0,
            fuel_per_lap=1.5,
            tire_set="Set#1",
            session_status="RF",
            notes="Initial notes"
        )
        db.session.add(session)
        db.session.commit()
        session_id = session.id
        print(f"✓ Created session (ID: {session_id})")
        print(f"  - Type: {session.session_type}")
        print(f"  - Number: {session.session_number}")
        print(f"  - Duration: {session.duration} min")
        print(f"  - Fuel Start: {session.fuel_start} L")
        print(f"  - Notes: {session.notes}")
        
        # Test API update endpoint
        with app.test_client() as client:
            # Update session via API
            update_data = {
                'session_type': 'FP2',
                'session_number': 2,
                'duration': 90,
                'fuel_start': 45.0,
                'fuel_per_lap': 1.4,
                'tire_set': 'Set#2',
                'session_status': 'SC',
                'notes': 'Updated notes - session modified successfully'
            }
            
            response = client.put(
                f'/api/sessions/{session_id}',
                json=update_data,
                content_type='application/json'
            )
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
            print("\n✓ Session updated via API")
            
            updated_session = response.json
            print(f"  - Type: {updated_session['session_type']} (changed from FP1)")
            print(f"  - Number: {updated_session['session_number']} (changed from 1)")
            print(f"  - Duration: {updated_session['duration']} min (changed from 60)")
            print(f"  - Fuel Start: {updated_session['fuel_start']} L (changed from 50.0)")
            print(f"  - Fuel per Lap: {updated_session['fuel_per_lap']} L (changed from 1.5)")
            print(f"  - Tire Set: {updated_session['tire_set']} (changed from Set#1)")
            print(f"  - Status: {updated_session['session_status']} (changed from RF)")
            print(f"  - Notes: {updated_session['notes']}")
            
            # Verify all fields were updated
            assert updated_session['session_type'] == 'FP2', "Session type not updated"
            assert updated_session['session_number'] == 2, "Session number not updated"
            assert updated_session['duration'] == 90, "Duration not updated"
            assert updated_session['fuel_start'] == 45.0, "Fuel start not updated"
            assert updated_session['fuel_per_lap'] == 1.4, "Fuel per lap not updated"
            assert updated_session['tire_set'] == 'Set#2', "Tire set not updated"
            assert updated_session['session_status'] == 'SC', "Session status not updated"
            assert 'Updated notes' in updated_session['notes'], "Notes not updated"
            print("\n✓ All session fields verified to be updated correctly")
            
            # Verify update persisted to database
            get_response = client.get(f'/api/sessions/{session_id}')
            assert get_response.status_code == 200
            persisted_session = get_response.json
            assert persisted_session['session_type'] == 'FP2', "Changes not persisted"
            print("✓ Changes persisted to database")
            
            # Test partial update (only some fields)
            partial_update = {
                'notes': 'Partially updated notes only'
            }
            response = client.put(
                f'/api/sessions/{session_id}',
                json=partial_update,
                content_type='application/json'
            )
            assert response.status_code == 200
            partial_updated = response.json
            # Verify only notes changed, other fields remained
            assert partial_updated['notes'] == 'Partially updated notes only'
            assert partial_updated['session_type'] == 'FP2'  # Should remain unchanged
            assert partial_updated['duration'] == 90  # Should remain unchanged
            print("✓ Partial update works correctly (only specified fields updated)")
            
    print("\n" + "="*70)
    print("✅ All Session Update Tests Passed Successfully!")
    print("="*70 + "\n")
    return True

if __name__ == '__main__':
    try:
        success = test_session_update_flow()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
