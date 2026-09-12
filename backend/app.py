from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import tempfile
import logging
from typing import Set
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///racing.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['MAX_CONTENT_LENGTH'] = 800 * 1024 * 1024  # 800 MB

# Initialize extensions
CORS(app)

# Import and initialize database
from models import db, RaceEvent, Session, Lap, TireData, EngineData, SetupData
from calculations import RacingCalculations
from onboard_analysis import analyze_onboard_pair
db.init_app(app)
logger = logging.getLogger(__name__)

# Create tables
with app.app_context():
    db.create_all()

def update_session_best_lap(session_id):
    """Helper function to update the best lap time for a session"""
    session = Session.query.get(session_id)
    if session:
        laps = Lap.query.filter_by(session_id=session_id).all()
        best_lap = RacingCalculations.calculate_best_lap_time(laps)
        session.best_lap_time = best_lap
        db.session.commit()

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
        
        # Update session's best lap time
        update_session_best_lap(session_id)
        
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
        
        # Update session's best lap time
        update_session_best_lap(lap.session_id)
        
        return jsonify(lap.to_dict())
    
    elif request.method == 'DELETE':
        session_id = lap.session_id
        db.session.delete(lap)
        db.session.commit()
        
        # Update session's best lap time
        update_session_best_lap(session_id)
        
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


def _is_allowed_upload(file_storage, allowed_mimes: Set[str], allowed_extensions: Set[str]) -> bool:
    filename = (file_storage.filename or '').lower()
    extension = os.path.splitext(filename)[1]
    mime = (file_storage.mimetype or '').lower()
    return extension in allowed_extensions and mime in allowed_mimes


def _is_allowed_csv_upload(file_storage, allowed_mimes: Set[str], allowed_extensions: Set[str]) -> bool:
    filename = (file_storage.filename or '').lower()
    extension = os.path.splitext(filename)[1]
    if extension not in allowed_extensions:
        return False

    mime = (file_storage.mimetype or '').lower()
    if mime in allowed_mimes:
        return True

    # Some browsers/OSes send CSV files as generic binary uploads.
    return mime in {'application/octet-stream', ''}


def _has_allowed_signature(file_storage, file_kind: str) -> bool:
    try:
        stream = file_storage.stream
        current_position = stream.tell()
        header = stream.read(64)
        stream.seek(current_position)
    except Exception:
        return False

    if file_kind == 'video':
        if len(header) >= 12 and header[4:8] == b'ftyp':
            return True  # mp4/mov/m4v family
        if len(header) >= 12 and header[:4] == b'RIFF' and header[8:12] == b'AVI ':
            return True
        if len(header) >= 4 and header[:4] == b'\x1A\x45\xDF\xA3':
            return True  # mkv/webm
        return False

    if file_kind == 'image':
        if len(header) >= 8 and header[:8] == b'\x89PNG\r\n\x1a\n':
            return True
        if len(header) >= 3 and header[:3] == b'\xFF\xD8\xFF':
            return True  # jpeg
        if len(header) >= 2 and header[:2] == b'BM':
            return True  # bmp
        if len(header) >= 12 and header[:4] == b'RIFF' and header[8:12] == b'WEBP':
            return True
        return False

    return False


def _detected_video_suffix(file_storage) -> str:
    stream = file_storage.stream
    current_position = stream.tell()
    header = stream.read(64)
    stream.seek(current_position)

    if len(header) >= 12 and header[4:8] == b'ftyp':
        brand = header[8:12].lower()
        if brand in {b'qt  ', b'moov'}:
            return '.mov'
        return '.mp4'
    if len(header) >= 12 and header[:4] == b'RIFF' and header[8:12] == b'AVI ':
        return '.avi'
    if len(header) >= 4 and header[:4] == b'\x1A\x45\xDF\xA3':
        return '.mkv'
    return '.mp4'


def _detected_image_suffix(file_storage) -> str:
    stream = file_storage.stream
    current_position = stream.tell()
    header = stream.read(32)
    stream.seek(current_position)

    if len(header) >= 8 and header[:8] == b'\x89PNG\r\n\x1a\n':
        return '.png'
    if len(header) >= 3 and header[:3] == b'\xFF\xD8\xFF':
        return '.jpg'
    if len(header) >= 2 and header[:2] == b'BM':
        return '.bmp'
    if len(header) >= 12 and header[:4] == b'RIFF' and header[8:12] == b'WEBP':
        return '.webp'
    return '.png'


def _has_csv_structure(file_storage) -> bool:
    try:
        stream = file_storage.stream
        current_position = stream.tell()
        head = stream.read(4096)
        stream.seek(current_position)
        text = head.decode('utf-8', errors='ignore')
    except Exception:
        return False

    if not text.strip():
        return False

    lines = [line for line in text.splitlines() if line.strip()]
    if len(lines) <= 18:
        return False

    data_line = lines[18]
    if ',' not in data_line and ';' not in data_line and '\t' not in data_line:
        return False
    delimiter = ';' if data_line.count(';') >= data_line.count(',') else ','
    if '\t' in data_line and data_line.count('\t') > max(data_line.count(';'), data_line.count(',')):
        delimiter = '\t'

    columns = [value.strip() for value in data_line.split(delimiter)]
    if len(columns) < 7:
        return False

    def _as_number(text: str):
        try:
            return float(text.replace(',', '.'))
        except Exception:
            return None

    latitude = _as_number(columns[3]) if len(columns) > 3 else None
    longitude = _as_number(columns[4]) if len(columns) > 4 else None
    return latitude is not None and longitude is not None


def _build_onboard_validation_message(error: ValueError) -> str:
    raw_message = (str(error) or "").lower()
    if "aprire il video" in raw_message:
        return "Impossibile aprire uno dei video caricati."
    if "non contiene frame leggibili" in raw_message:
        return "Uno dei video non contiene frame leggibili."
    if "troppo corti" in raw_message:
        return "I video caricati sono troppo corti per il confronto automatico."
    if "nessun dato valido" in raw_message:
        return "I dati CSV non contengono campioni GPS validi."
    if "campioni insufficienti" in raw_message:
        return "Dati insufficienti per costruire il confronto curva per curva."
    return "I file caricati non consentono una analisi automatica valida. Verifica formato e durata."


@app.route('/api/onboard/compare', methods=['POST'])
def compare_onboard_videos():
    """Automatic onboard comparison with optional track map"""
    video_a = request.files.get('video_a')
    video_b = request.files.get('video_b')
    csv_a = request.files.get('csv_a')
    csv_b = request.files.get('csv_b')
    track_map = request.files.get('track_map')

    if not video_a or not video_b or not csv_a or not csv_b:
        return jsonify({
            'status': 'error',
            'message': 'Sono richiesti due video e due file CSV traiettoria (video_a, video_b, csv_a, csv_b)'
        }), 400

    allowed_video_mimes = {
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/webm',
        'video/x-m4v',
    }
    allowed_video_extensions = {'.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'}
    allowed_csv_mimes = {'text/csv', 'text/plain', 'application/vnd.ms-excel'}
    allowed_csv_extensions = {'.csv'}
    allowed_map_mimes = {'image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/webp'}
    allowed_map_extensions = {'.png', '.jpg', '.jpeg', '.bmp', '.webp'}

    if not _is_allowed_upload(video_a, allowed_video_mimes, allowed_video_extensions):
        return jsonify({
            'status': 'error',
            'message': 'Formato video A non supportato'
        }), 400
    if not _has_allowed_signature(video_a, 'video'):
        return jsonify({
            'status': 'error',
            'message': 'Contenuto video A non valido'
        }), 400

    if not _is_allowed_upload(video_b, allowed_video_mimes, allowed_video_extensions):
        return jsonify({
            'status': 'error',
            'message': 'Formato video B non supportato'
        }), 400
    if not _has_allowed_signature(video_b, 'video'):
        return jsonify({
            'status': 'error',
            'message': 'Contenuto video B non valido'
        }), 400

    if not _is_allowed_csv_upload(csv_a, allowed_csv_mimes, allowed_csv_extensions):
        return jsonify({
            'status': 'error',
            'message': 'Formato CSV A non supportato'
        }), 400
    if not _has_csv_structure(csv_a):
        return jsonify({
            'status': 'error',
            'message': 'Contenuto CSV A non valido'
        }), 400

    if not _is_allowed_csv_upload(csv_b, allowed_csv_mimes, allowed_csv_extensions):
        return jsonify({
            'status': 'error',
            'message': 'Formato CSV B non supportato'
        }), 400
    if not _has_csv_structure(csv_b):
        return jsonify({
            'status': 'error',
            'message': 'Contenuto CSV B non valido'
        }), 400

    if track_map and not _is_allowed_upload(track_map, allowed_map_mimes, allowed_map_extensions):
        return jsonify({
            'status': 'error',
            'message': 'Formato mappa tracciato non supportato'
        }), 400
    if track_map and not _has_allowed_signature(track_map, 'image'):
        return jsonify({
            'status': 'error',
            'message': 'Contenuto mappa tracciato non valido'
        }), 400

    session_name = request.form.get('session_name', 'Sessione confronto onboard automatica')
    track_name = request.form.get('track_name', '')
    driver_a_name = request.form.get('driver_a_name', 'Pilota A')
    driver_b_name = request.form.get('driver_b_name', 'Pilota B')

    temp_video_a_path = None
    temp_video_b_path = None
    temp_csv_a_path = None
    temp_csv_b_path = None
    temp_track_map_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=_detected_video_suffix(video_a)) as temp_a:
            temp_video_a_path = temp_a.name
            video_a.save(temp_a)

        with tempfile.NamedTemporaryFile(delete=False, suffix=_detected_video_suffix(video_b)) as temp_b:
            temp_video_b_path = temp_b.name
            video_b.save(temp_b)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp_csv_a:
            temp_csv_a_path = temp_csv_a.name
            csv_a.save(temp_csv_a)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp_csv_b:
            temp_csv_b_path = temp_csv_b.name
            csv_b.save(temp_csv_b)

        if track_map:
            with tempfile.NamedTemporaryFile(delete=False, suffix=_detected_image_suffix(track_map)) as temp_map:
                temp_track_map_path = temp_map.name
                track_map.save(temp_map)

        analysis = analyze_onboard_pair(
            video_a_path=temp_video_a_path,
            video_b_path=temp_video_b_path,
            csv_a_path=temp_csv_a_path,
            csv_b_path=temp_csv_b_path,
            session_name=session_name,
            track_name=track_name,
            driver_a_name=driver_a_name,
            driver_b_name=driver_b_name,
            track_map_path=temp_track_map_path
        )

        analysis['track_map_provided'] = bool(track_map)
        analysis['track_map_name'] = secure_filename(track_map.filename) if track_map else None

        return jsonify({
            'status': 'success',
            'analysis': analysis
        }), 200
    except ValueError as error:
        logger.warning('Onboard analysis validation error: %s', error)
        return jsonify({
            'status': 'error',
            'message': _build_onboard_validation_message(error)
        }), 400
    except Exception as error:
        logger.exception('Unexpected onboard analysis error: %s', error)
        return jsonify({
            'status': 'error',
            'message': 'Errore durante la analisi automatica onboard'
        }), 500
    finally:
        for path in [temp_video_a_path, temp_video_b_path, temp_csv_a_path, temp_csv_b_path, temp_track_map_path]:
            if path and os.path.exists(path):
                os.remove(path)


@app.errorhandler(RequestEntityTooLarge)
def handle_request_entity_too_large(_error):
    return jsonify({
        'status': 'error',
        'message': 'Upload troppo grande: limite massimo 800 MB complessivi.'
    }), 413

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
