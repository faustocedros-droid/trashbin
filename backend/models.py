from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class RaceEvent(db.Model):
    """Model for race events"""
    __tablename__ = 'race_events'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    track = db.Column(db.String(200), nullable=False)
    track_length = db.Column(db.Float)  # Track length in kilometers
    date_start = db.Column(db.DateTime, nullable=False)
    date_end = db.Column(db.DateTime, nullable=False)
    weather = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sessions = db.relationship('Session', backref='event', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'track': self.track,
            'track_length': self.track_length,
            'date_start': self.date_start.isoformat(),
            'date_end': self.date_end.isoformat(),
            'weather': self.weather,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Session(db.Model):
    """Model for race sessions (Test, FP, Qualifying, Race)"""
    __tablename__ = 'sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('race_events.id'), nullable=False)
    session_type = db.Column(db.String(50), nullable=False)  # Test, FP1, FP2, FP3, Q, R1, R2, Endurance
    session_number = db.Column(db.Integer, default=1)
    duration = db.Column(db.Integer)  # Duration in minutes
    fuel_start = db.Column(db.Float)  # Starting fuel in liters
    fuel_per_lap = db.Column(db.Float)  # Fuel consumed per lap in liters
    fuel_consumed = db.Column(db.Float)  # Fuel consumed in liters
    tire_set = db.Column(db.String(50))  # Tire set identifier
    best_lap_time = db.Column(db.String(20))  # Best lap time
    session_status = db.Column(db.String(10))  # RF, FCY, SC, TFC
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tire_data = db.relationship('TireData', backref='session', lazy=True, cascade='all, delete-orphan')
    engine_data = db.relationship('EngineData', backref='session', lazy=True, cascade='all, delete-orphan')
    setup_data = db.relationship('SetupData', backref='session', lazy=True, cascade='all, delete-orphan')
    laps = db.relationship('Lap', backref='session', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'session_type': self.session_type,
            'session_number': self.session_number,
            'duration': self.duration,
            'fuel_start': self.fuel_start,
            'fuel_per_lap': self.fuel_per_lap,
            'fuel_consumed': self.fuel_consumed,
            'tire_set': self.tire_set,
            'best_lap_time': self.best_lap_time,
            'session_status': self.session_status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Lap(db.Model):
    """Model for individual laps"""
    __tablename__ = 'laps'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    lap_number = db.Column(db.Integer, nullable=False)
    lap_time = db.Column(db.String(20))  # Total lap time in format MM:SS.mmm
    sector1 = db.Column(db.String(20))  # Sector 1 time in format SS.mmm
    sector2 = db.Column(db.String(20))  # Sector 2 time in format SS.mmm
    sector3 = db.Column(db.String(20))  # Sector 3 time in format SS.mmm
    sector4 = db.Column(db.String(20))  # Sector 4 time in format SS.mmm
    fuel_consumed = db.Column(db.Float)  # Fuel consumed in this lap
    tire_set = db.Column(db.String(50))  # Tire set identifier
    lap_status = db.Column(db.String(10))  # RF, FCY, SC, TFC, or null for normal
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'lap_number': self.lap_number,
            'lap_time': self.lap_time,
            'sector1': self.sector1,
            'sector2': self.sector2,
            'sector3': self.sector3,
            'sector4': self.sector4,
            'fuel_consumed': self.fuel_consumed,
            'tire_set': self.tire_set,
            'lap_status': self.lap_status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class TireData(db.Model):
    """Model for tire data and temperatures"""
    __tablename__ = 'tire_data'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    tire_position = db.Column(db.String(10), nullable=False)  # FL, FR, RL, RR
    tire_set = db.Column(db.String(50))
    pressure_cold = db.Column(db.Float)  # Cold tire pressure
    pressure_hot = db.Column(db.Float)  # Hot tire pressure
    temp_inner = db.Column(db.Float)  # Inner temperature
    temp_middle = db.Column(db.Float)  # Middle temperature
    temp_outer = db.Column(db.Float)  # Outer temperature
    wear_level = db.Column(db.Float)  # Wear level percentage
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'tire_position': self.tire_position,
            'tire_set': self.tire_set,
            'pressure_cold': self.pressure_cold,
            'pressure_hot': self.pressure_hot,
            'temp_inner': self.temp_inner,
            'temp_middle': self.temp_middle,
            'temp_outer': self.temp_outer,
            'wear_level': self.wear_level,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class EngineData(db.Model):
    """Model for engine data and parameters"""
    __tablename__ = 'engine_data'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    engine_map = db.Column(db.String(50))
    rpm_limit = db.Column(db.Integer)
    oil_temp = db.Column(db.Float)
    water_temp = db.Column(db.Float)
    fuel_consumption_rate = db.Column(db.Float)  # Liters per lap
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'engine_map': self.engine_map,
            'rpm_limit': self.rpm_limit,
            'oil_temp': self.oil_temp,
            'water_temp': self.water_temp,
            'fuel_consumption_rate': self.fuel_consumption_rate,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class SetupData(db.Model):
    """Model for car setup data (Assetto)"""
    __tablename__ = 'setup_data'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    front_wing = db.Column(db.Float)
    rear_wing = db.Column(db.Float)
    front_ride_height = db.Column(db.Float)
    rear_ride_height = db.Column(db.Float)
    front_spring_rate = db.Column(db.Float)
    rear_spring_rate = db.Column(db.Float)
    front_damper_compression = db.Column(db.Float)
    rear_damper_compression = db.Column(db.Float)
    front_damper_rebound = db.Column(db.Float)
    rear_damper_rebound = db.Column(db.Float)
    front_anti_roll_bar = db.Column(db.Float)
    rear_anti_roll_bar = db.Column(db.Float)
    camber_front_left = db.Column(db.Float)
    camber_front_right = db.Column(db.Float)
    camber_rear_left = db.Column(db.Float)
    camber_rear_right = db.Column(db.Float)
    toe_front = db.Column(db.Float)
    toe_rear = db.Column(db.Float)
    brake_balance = db.Column(db.Float)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'front_wing': self.front_wing,
            'rear_wing': self.rear_wing,
            'front_ride_height': self.front_ride_height,
            'rear_ride_height': self.rear_ride_height,
            'front_spring_rate': self.front_spring_rate,
            'rear_spring_rate': self.rear_spring_rate,
            'front_damper_compression': self.front_damper_compression,
            'rear_damper_compression': self.rear_damper_compression,
            'front_damper_rebound': self.front_damper_rebound,
            'rear_damper_rebound': self.rear_damper_rebound,
            'front_anti_roll_bar': self.front_anti_roll_bar,
            'rear_anti_roll_bar': self.rear_anti_roll_bar,
            'camber_front_left': self.camber_front_left,
            'camber_front_right': self.camber_front_right,
            'camber_rear_left': self.camber_rear_left,
            'camber_rear_right': self.camber_rear_right,
            'toe_front': self.toe_front,
            'toe_rear': self.toe_rear,
            'brake_balance': self.brake_balance,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
