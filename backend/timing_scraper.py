"""
Timing Monitor Scraper Module

This module handles scraping timing data from web-based timing monitors.
It supports different scraping strategies and can be extended for various timing systems.
"""

import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional
import re
from datetime import datetime


class TimingScraper:
    """Base class for timing monitor scrapers"""
    
    def __init__(self, url: str):
        self.url = url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def fetch_page(self) -> Optional[str]:
        """Fetch the HTML content from the timing monitor URL"""
        try:
            response = self.session.get(self.url, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error fetching timing data: {e}")
            return None
    
    def parse_timing_data(self, html: str) -> Dict:
        """
        Parse timing data from HTML content.
        This is a generic implementation - should be overridden for specific timing systems.
        """
        soup = BeautifulSoup(html, 'html.parser')
        
        timing_data = {
            'race_number': self._extract_race_number(soup),
            'session_status': self._extract_session_status(soup),
            'drivers': self._extract_driver_data(soup)
        }
        
        return timing_data
    
    def _extract_race_number(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract race/session number from the page"""
        # Common patterns for race number
        patterns = [
            {'tag': 'h1', 'class_': 'race-title'},
            {'tag': 'div', 'class_': 'session-name'},
            {'tag': 'span', 'class_': 'race-number'}
        ]
        
        for pattern in patterns:
            element = soup.find(pattern['tag'], class_=pattern.get('class_'))
            if element:
                return element.get_text(strip=True)
        
        return None
    
    def _extract_session_status(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract session status (Green flag, Yellow flag, etc.)"""
        # Common patterns for session status
        patterns = [
            {'tag': 'div', 'class_': 'session-status'},
            {'tag': 'span', 'class_': 'flag-status'},
            {'tag': 'div', 'class_': 'race-status'}
        ]
        
        for pattern in patterns:
            element = soup.find(pattern['tag'], class_=pattern.get('class_'))
            if element:
                return element.get_text(strip=True)
        
        return "Unknown"
    
    def _extract_driver_data(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract driver timing data from the page"""
        drivers = []
        
        # Try to find timing table - common patterns
        table = soup.find('table', class_=re.compile(r'timing|leaderboard|results'))
        
        if not table:
            # Try finding by id
            table = soup.find('table', id=re.compile(r'timing|leaderboard|results'))
        
        if table:
            rows = table.find_all('tr')[1:]  # Skip header row
            
            for row in rows:
                cells = row.find_all(['td', 'th'])
                if len(cells) >= 3:  # Minimum: position, driver, time
                    driver_data = self._parse_row_cells(cells)
                    if driver_data:
                        drivers.append(driver_data)
        
        return drivers
    
    def _parse_row_cells(self, cells) -> Optional[Dict]:
        """Parse table cells into driver timing data"""
        try:
            # This is a generic implementation
            # Adjust indices based on actual table structure
            data = {
                'position': self._clean_text(cells[0].get_text()) if len(cells) > 0 else None,
                'driver_number': self._clean_text(cells[1].get_text()) if len(cells) > 1 else None,
                'driver_name': self._clean_text(cells[2].get_text()) if len(cells) > 2 else None,
                'laps_completed': self._parse_number(cells[3].get_text()) if len(cells) > 3 else None,
                'last_lap_time': self._clean_text(cells[4].get_text()) if len(cells) > 4 else None,
                'best_lap_time': self._clean_text(cells[5].get_text()) if len(cells) > 5 else None,
                'sector1_time': self._clean_text(cells[6].get_text()) if len(cells) > 6 else None,
                'sector2_time': self._clean_text(cells[7].get_text()) if len(cells) > 7 else None,
                'sector3_time': self._clean_text(cells[8].get_text()) if len(cells) > 8 else None,
                'gap_to_leader': self._clean_text(cells[9].get_text()) if len(cells) > 9 else None,
                'gap_to_ahead': self._clean_text(cells[10].get_text()) if len(cells) > 10 else None,
                'status': self._clean_text(cells[11].get_text()) if len(cells) > 11 else "Running"
            }
            
            return data
        except Exception as e:
            print(f"Error parsing row: {e}")
            return None
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        return text.strip().replace('\n', '').replace('\r', '')
    
    def _parse_number(self, text: str) -> Optional[int]:
        """Parse number from text"""
        try:
            cleaned = re.sub(r'[^\d]', '', text)
            return int(cleaned) if cleaned else None
        except ValueError:
            return None
    
    def scrape(self) -> Optional[Dict]:
        """Main method to scrape timing data"""
        html = self.fetch_page()
        if html:
            return self.parse_timing_data(html)
        return None


class GenericTimingScraper(TimingScraper):
    """
    Generic timing scraper with customizable selectors.
    Users can provide CSS selectors for different elements.
    """
    
    def __init__(self, url: str, selectors: Optional[Dict] = None):
        super().__init__(url)
        self.selectors = selectors or {}
    
    def _extract_by_selector(self, soup: BeautifulSoup, selector_key: str) -> Optional[str]:
        """Extract element using custom selector"""
        selector = self.selectors.get(selector_key)
        if selector:
            element = soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        return None
    
    def _extract_race_number(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract race number using custom selector or default"""
        race_number = self._extract_by_selector(soup, 'race_number')
        if race_number:
            return race_number
        return super()._extract_race_number(soup)
    
    def _extract_session_status(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract session status using custom selector or default"""
        status = self._extract_by_selector(soup, 'session_status')
        if status:
            return status
        return super()._extract_session_status(soup)


def create_scraper(url: str, scraper_type: str = 'generic', **kwargs) -> TimingScraper:
    """Factory function to create appropriate scraper"""
    if scraper_type == 'generic':
        return GenericTimingScraper(url, kwargs.get('selectors'))
    else:
        return TimingScraper(url)
