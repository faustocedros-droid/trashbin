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
from models import (db, RaceEvent, Session, Lap, TireData, EngineData, SetupData,
                    TimingMonitorConfig, Driver, TimingSnapshot, TimingData)
db.init_app(app)

# Import timing service
from timing_service import TimingMonitorService
import models as models_module

# Initialize timing service
timing_service = TimingMonitorService(db, models_module)

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
            fuel_per_lap=data.get('fuel_per_lap'),
            tire_set=data.get('tire_set'),
            session_status=data.get('session_status'),
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
        session.fuel_per_lap = data.get('fuel_per_lap', session.fuel_per_lap)
        session.tire_set = data.get('tire_set', session.tire_set)
        session.session_status = data.get('session_status', session.session_status)
        session.notes = data.get('notes', session.notes)
        db.session.commit()
        return jsonify(session.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(session)
        db.session.commit()
        return '', 204

@app.route('/api/sessions/<int:session_id>/laps', methods=['GET', 'POST'])
def handle_laps(session_id):
    """Get all laps for a session or create a new lap"""
    session = Session.query.get_or_404(session_id)
    
    if request.method == 'GET':
        laps = Lap.query.filter_by(session_id=session_id).order_by(Lap.lap_number).all()
        return jsonify([lap.to_dict() for lap in laps])
    
    elif request.method == 'POST':
        data = request.json
        lap = Lap(
            session_id=session_id,
            lap_number=data['lap_number'],
            lap_time=data.get('lap_time'),
            sector1=data.get('sector1'),
            sector2=data.get('sector2'),
            sector3=data.get('sector3'),
            sector4=data.get('sector4'),
            fuel_consumed=data.get('fuel_consumed'),
            tire_set=data.get('tire_set'),
            lap_status=data.get('lap_status'),
            notes=data.get('notes')
        )
        db.session.add(lap)
        db.session.commit()
        return jsonify(lap.to_dict()), 201

@app.route('/api/laps/<int:lap_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_lap(lap_id):
    """Get, update or delete a specific lap"""
    lap = Lap.query.get_or_404(lap_id)
    
    if request.method == 'GET':
        return jsonify(lap.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        lap.lap_number = data.get('lap_number', lap.lap_number)
        lap.lap_time = data.get('lap_time', lap.lap_time)
        lap.sector1 = data.get('sector1', lap.sector1)
        lap.sector2 = data.get('sector2', lap.sector2)
        lap.sector3 = data.get('sector3', lap.sector3)
        lap.sector4 = data.get('sector4', lap.sector4)
        lap.fuel_consumed = data.get('fuel_consumed', lap.fuel_consumed)
        lap.tire_set = data.get('tire_set', lap.tire_set)
        lap.lap_status = data.get('lap_status', lap.lap_status)
        lap.notes = data.get('notes', lap.notes)
        db.session.commit()
        return jsonify(lap.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(lap)
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

# Timing Monitor Endpoints

@app.route('/api/timing/configs', methods=['GET', 'POST'])
def handle_timing_configs():
    """Get all timing monitor configurations or create a new one"""
    if request.method == 'GET':
        configs = TimingMonitorConfig.query.all()
        return jsonify([config.to_dict() for config in configs])
    
    elif request.method == 'POST':
        data = request.json
        config = TimingMonitorConfig(
            name=data['name'],
            url=data['url'],
            is_active=data.get('is_active', True),
            polling_interval=data.get('polling_interval', 5)
        )
        db.session.add(config)
        db.session.commit()
        return jsonify(config.to_dict()), 201

@app.route('/api/timing/configs/<int:config_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_timing_config(config_id):
    """Get, update or delete a specific timing monitor configuration"""
    config = TimingMonitorConfig.query.get_or_404(config_id)
    
    if request.method == 'GET':
        return jsonify(config.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        config.name = data.get('name', config.name)
        config.url = data.get('url', config.url)
        config.is_active = data.get('is_active', config.is_active)
        config.polling_interval = data.get('polling_interval', config.polling_interval)
        db.session.commit()
        return jsonify(config.to_dict())
    
    elif request.method == 'DELETE':
        # Stop monitoring if active
        timing_service.stop_monitoring(config_id)
        db.session.delete(config)
        db.session.commit()
        return '', 204

@app.route('/api/timing/configs/<int:config_id>/start', methods=['POST'])
def start_monitoring(config_id):
    """Start monitoring a timing monitor"""
    try:
        timing_service.start_monitoring(config_id)
        return jsonify({
            'status': 'success',
            'message': f'Monitoring started for config {config_id}'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/timing/configs/<int:config_id>/stop', methods=['POST'])
def stop_monitoring(config_id):
    """Stop monitoring a timing monitor"""
    timing_service.stop_monitoring(config_id)
    return jsonify({
        'status': 'success',
        'message': f'Monitoring stopped for config {config_id}'
    })

@app.route('/api/timing/configs/<int:config_id>/status', methods=['GET'])
def get_monitoring_status(config_id):
    """Get the monitoring status for a configuration"""
    status = timing_service.get_monitor_status(config_id)
    return jsonify(status)

@app.route('/api/timing/configs/<int:config_id>/latest', methods=['GET'])
def get_latest_timing(config_id):
    """Get the latest timing snapshot for a configuration"""
    snapshot = timing_service.get_latest_snapshot(config_id)
    if snapshot:
        return jsonify(snapshot)
    else:
        return jsonify({'message': 'No timing data available yet'}), 404

@app.route('/api/timing/snapshots', methods=['GET'])
def get_timing_snapshots():
    """Get timing snapshots with optional filters"""
    config_id = request.args.get('config_id', type=int)
    limit = request.args.get('limit', 10, type=int)
    
    query = TimingSnapshot.query
    if config_id:
        query = query.filter_by(monitor_config_id=config_id)
    
    snapshots = query.order_by(TimingSnapshot.timestamp.desc()).limit(limit).all()
    return jsonify([snapshot.to_dict() for snapshot in snapshots])

@app.route('/api/timing/snapshots/<int:snapshot_id>', methods=['GET'])
def get_timing_snapshot(snapshot_id):
    """Get a specific timing snapshot"""
    snapshot = TimingSnapshot.query.get_or_404(snapshot_id)
    return jsonify(snapshot.to_dict())

@app.route('/api/drivers', methods=['GET', 'POST'])
def handle_drivers():
    """Get all drivers or create a new driver"""
    if request.method == 'GET':
        drivers = Driver.query.all()
        return jsonify([driver.to_dict() for driver in drivers])
    
    elif request.method == 'POST':
        data = request.json
        driver = Driver(
            name=data['name'],
            number=data.get('number'),
            team=data.get('team')
        )
        db.session.add(driver)
        db.session.commit()
        return jsonify(driver.to_dict()), 201

@app.route('/api/drivers/<int:driver_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_driver(driver_id):
    """Get, update or delete a specific driver"""
    driver = Driver.query.get_or_404(driver_id)
    
    if request.method == 'GET':
        return jsonify(driver.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        driver.name = data.get('name', driver.name)
        driver.number = data.get('number', driver.number)
        driver.team = data.get('team', driver.team)
        db.session.commit()
        return jsonify(driver.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(driver)
        db.session.commit()
        return '', 204

# Cleanup on shutdown
@app.teardown_appcontext
def shutdown_session(exception=None):
    """Stop all monitoring on shutdown"""
    if exception:
        timing_service.stop_all_monitoring()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
