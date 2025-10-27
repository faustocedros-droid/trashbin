"""
Timing Monitor Service

This module handles the real-time polling and updating of timing data
from web-based timing monitors.
"""

import threading
import time
from datetime import datetime
from typing import Optional, Dict
from timing_scraper import create_scraper


class TimingMonitorService:
    """Service to manage real-time timing data updates"""
    
    def __init__(self, db, models):
        self.db = db
        self.models = models
        self.polling_threads = {}
        self.running = {}
    
    def start_monitoring(self, config_id: int):
        """Start monitoring a timing monitor configuration"""
        if config_id in self.polling_threads and self.running.get(config_id):
            print(f"Monitoring already running for config {config_id}")
            return
        
        config = self.models.TimingMonitorConfig.query.get(config_id)
        if not config:
            raise ValueError(f"Timing monitor config {config_id} not found")
        
        if not config.is_active:
            raise ValueError(f"Timing monitor config {config_id} is not active")
        
        self.running[config_id] = True
        thread = threading.Thread(
            target=self._polling_loop,
            args=(config_id,),
            daemon=True
        )
        thread.start()
        self.polling_threads[config_id] = thread
        print(f"Started monitoring for config {config_id}")
    
    def stop_monitoring(self, config_id: int):
        """Stop monitoring a timing monitor configuration"""
        if config_id in self.running:
            self.running[config_id] = False
            print(f"Stopped monitoring for config {config_id}")
    
    def stop_all_monitoring(self):
        """Stop all monitoring threads"""
        for config_id in list(self.running.keys()):
            self.stop_monitoring(config_id)
    
    def _polling_loop(self, config_id: int):
        """Main polling loop for a timing monitor"""
        while self.running.get(config_id, False):
            try:
                config = self.models.TimingMonitorConfig.query.get(config_id)
                if not config or not config.is_active:
                    self.running[config_id] = False
                    break
                
                # Scrape timing data
                scraper = create_scraper(config.url)
                timing_data = scraper.scrape()
                
                if timing_data:
                    self._store_timing_data(config_id, timing_data)
                
                # Wait for next poll
                time.sleep(config.polling_interval)
                
            except Exception as e:
                print(f"Error in polling loop for config {config_id}: {e}")
                time.sleep(5)  # Wait a bit before retrying
    
    def _store_timing_data(self, config_id: int, timing_data: Dict):
        """Store scraped timing data in the database"""
        try:
            # Create a new snapshot
            snapshot = self.models.TimingSnapshot(
                monitor_config_id=config_id,
                race_number=timing_data.get('race_number'),
                session_status=timing_data.get('session_status'),
                timestamp=datetime.utcnow()
            )
            self.db.session.add(snapshot)
            self.db.session.flush()  # Get the snapshot ID
            
            # Store each driver's timing data
            for driver_data in timing_data.get('drivers', []):
                # Try to find or create driver
                driver = None
                if driver_data.get('driver_name'):
                    driver = self.models.Driver.query.filter_by(
                        name=driver_data['driver_name']
                    ).first()
                    
                    if not driver:
                        driver = self.models.Driver(
                            name=driver_data['driver_name'],
                            number=driver_data.get('driver_number')
                        )
                        self.db.session.add(driver)
                        self.db.session.flush()
                
                # Create timing data entry
                timing_entry = self.models.TimingData(
                    snapshot_id=snapshot.id,
                    driver_id=driver.id if driver else None,
                    driver_name=driver_data.get('driver_name', ''),
                    driver_number=driver_data.get('driver_number'),
                    position=self._parse_position(driver_data.get('position')),
                    laps_completed=driver_data.get('laps_completed'),
                    last_lap_time=driver_data.get('last_lap_time'),
                    best_lap_time=driver_data.get('best_lap_time'),
                    sector1_time=driver_data.get('sector1_time'),
                    sector2_time=driver_data.get('sector2_time'),
                    sector3_time=driver_data.get('sector3_time'),
                    gap_to_leader=driver_data.get('gap_to_leader'),
                    gap_to_ahead=driver_data.get('gap_to_ahead'),
                    status=driver_data.get('status', 'Running')
                )
                self.db.session.add(timing_entry)
            
            self.db.session.commit()
            print(f"Stored timing snapshot {snapshot.id} with {len(timing_data.get('drivers', []))} drivers")
            
        except Exception as e:
            self.db.session.rollback()
            print(f"Error storing timing data: {e}")
    
    def _parse_position(self, position_str: Optional[str]) -> Optional[int]:
        """Parse position string to integer"""
        if not position_str:
            return None
        try:
            # Remove any non-numeric characters
            import re
            cleaned = re.sub(r'[^\d]', '', str(position_str))
            return int(cleaned) if cleaned else None
        except ValueError:
            return None
    
    def get_latest_snapshot(self, config_id: int) -> Optional[Dict]:
        """Get the latest timing snapshot for a monitor configuration"""
        snapshot = self.models.TimingSnapshot.query.filter_by(
            monitor_config_id=config_id
        ).order_by(self.models.TimingSnapshot.timestamp.desc()).first()
        
        if snapshot:
            return snapshot.to_dict()
        return None
    
    def get_monitor_status(self, config_id: int) -> Dict:
        """Get the monitoring status for a configuration"""
        return {
            'config_id': config_id,
            'is_running': self.running.get(config_id, False),
            'has_data': self.models.TimingSnapshot.query.filter_by(
                monitor_config_id=config_id
            ).count() > 0
        }
