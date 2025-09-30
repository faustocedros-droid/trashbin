from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///racing.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize extensions
CORS(app)

# Import and initialize database
from models import db, RaceEvent, Session, TireData, EngineData, SetupData
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/events', methods=['GET', 'POST'])
def handle_events():
    """Get all events or create a new event"""
    if request.method == 'GET':
        events = RaceEvent.query.all()
        return jsonify([event.to_dict() for event in events])
    
    elif request.method == 'POST':
        data = request.json
        event = RaceEvent(
            name=data['name'],
            track=data['track'],
            date_start=datetime.fromisoformat(data['date_start']),
            date_end=datetime.fromisoformat(data['date_end']),
            weather=data.get('weather'),
            notes=data.get('notes')
        )
        db.session.add(event)
        db.session.commit()
        return jsonify(event.to_dict()), 201

@app.route('/api/events/<int:event_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_event(event_id):
    """Get, update or delete a specific event"""
    event = RaceEvent.query.get_or_404(event_id)
    
    if request.method == 'GET':
        return jsonify(event.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        event.name = data.get('name', event.name)
        event.track = data.get('track', event.track)
        if 'date_start' in data:
            event.date_start = datetime.fromisoformat(data['date_start'])
        if 'date_end' in data:
            event.date_end = datetime.fromisoformat(data['date_end'])
        event.weather = data.get('weather', event.weather)
        event.notes = data.get('notes', event.notes)
        db.session.commit()
        return jsonify(event.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(event)
        db.session.commit()
        return '', 204

@app.route('/api/events/<int:event_id>/sessions', methods=['GET', 'POST'])
def handle_sessions(event_id):
    """Get all sessions for an event or create a new session"""
    event = RaceEvent.query.get_or_404(event_id)
    
    if request.method == 'GET':
        sessions = Session.query.filter_by(event_id=event_id).all()
        return jsonify([session.to_dict() for session in sessions])
    
    elif request.method == 'POST':
        data = request.json
        session = Session(
            event_id=event_id,
            session_type=data['session_type'],
            session_number=data.get('session_number', 1),
            duration=data.get('duration'),
            fuel_start=data.get('fuel_start'),
            tire_set=data.get('tire_set'),
            notes=data.get('notes')
        )
        db.session.add(session)
        db.session.commit()
        return jsonify(session.to_dict()), 201

@app.route('/api/sessions/<int:session_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_session(session_id):
    """Get, update or delete a specific session"""
    session = Session.query.get_or_404(session_id)
    
    if request.method == 'GET':
        return jsonify(session.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        session.session_type = data.get('session_type', session.session_type)
        session.session_number = data.get('session_number', session.session_number)
        session.duration = data.get('duration', session.duration)
        session.fuel_start = data.get('fuel_start', session.fuel_start)
        session.tire_set = data.get('tire_set', session.tire_set)
        session.notes = data.get('notes', session.notes)
        db.session.commit()
        return jsonify(session.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(session)
        db.session.commit()
        return '', 204

@app.route('/api/sessions/<int:session_id>/tires', methods=['GET', 'POST'])
def handle_tire_data(session_id):
    """Get tire data for a session or add new tire data"""
    session = Session.query.get_or_404(session_id)
    
    if request.method == 'GET':
        tire_data = TireData.query.filter_by(session_id=session_id).all()
        return jsonify([data.to_dict() for data in tire_data])
    
    elif request.method == 'POST':
        data = request.json
        tire_data = TireData(
            session_id=session_id,
            tire_position=data['tire_position'],
            tire_set=data.get('tire_set'),
            pressure_cold=data.get('pressure_cold'),
            pressure_hot=data.get('pressure_hot'),
            temp_inner=data.get('temp_inner'),
            temp_middle=data.get('temp_middle'),
            temp_outer=data.get('temp_outer')
        )
        db.session.add(tire_data)
        db.session.commit()
        return jsonify(tire_data.to_dict()), 201

@app.route('/api/archive', methods=['POST'])
def archive_event():
    """Archive an event to OneDrive (placeholder for future implementation)"""
    data = request.json
    event_id = data.get('event_id')
    
    # TODO: Implement OneDrive integration
    return jsonify({
        'status': 'success',
        'message': 'OneDrive archiving will be implemented in future release',
        'event_id': event_id
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
