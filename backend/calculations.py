"""
Racing calculations module
Implements the core calculation logic from the Excel formulas
"""

class RacingCalculations:
    """Helper class for racing-related calculations"""
    
    @staticmethod
    def calculate_fuel_consumption(laps, fuel_per_lap):
        """
        Calculate total fuel consumption
        
        Args:
            laps: Number of laps
            fuel_per_lap: Fuel consumption per lap in liters
            
        Returns:
            Total fuel consumed in liters
        """
        return laps * fuel_per_lap
    
    @staticmethod
    def calculate_fuel_remaining(initial_fuel, consumed_fuel):
        """
        Calculate remaining fuel
        
        Args:
            initial_fuel: Starting fuel in liters
            consumed_fuel: Fuel consumed in liters
            
        Returns:
            Remaining fuel in liters
        """
        return initial_fuel - consumed_fuel
    
    @staticmethod
    def calculate_stint_strategy(session_duration, lap_time, fuel_tank_capacity, 
                                 fuel_per_lap, minimum_fuel=5):
        """
        Calculate pit stop strategy for a session
        
        Args:
            session_duration: Session duration in minutes
            lap_time: Average lap time in seconds
            fuel_tank_capacity: Maximum fuel capacity in liters
            fuel_per_lap: Fuel consumption per lap in liters
            minimum_fuel: Minimum fuel to keep in tank (liters)
            
        Returns:
            Dictionary with stint strategy
        """
        # Convert session duration to seconds
        session_seconds = session_duration * 60
        
        # Calculate total laps possible in session
        total_laps = int(session_seconds / lap_time)
        
        # Calculate laps per tank
        usable_fuel = fuel_tank_capacity - minimum_fuel
        laps_per_tank = int(usable_fuel / fuel_per_lap)
        
        # Calculate number of pit stops needed
        pit_stops = max(0, (total_laps // laps_per_tank))
        
        # Calculate stint lengths
        if pit_stops == 0:
            stints = [total_laps]
        else:
            stint_length = total_laps // (pit_stops + 1)
            stints = [stint_length] * (pit_stops + 1)
            # Adjust last stint for remaining laps
            stints[-1] = total_laps - (stint_length * pit_stops)
        
        return {
            'total_laps': total_laps,
            'pit_stops': pit_stops,
            'laps_per_tank': laps_per_tank,
            'stints': stints,
            'fuel_per_stint': [laps * fuel_per_lap for laps in stints]
        }
    
    @staticmethod
    def optimize_tire_pressure(temp_inner, temp_middle, temp_outer, 
                               current_pressure, target_temp=85):
        """
        Calculate optimal tire pressure based on temperature readings
        Implements logic from Tyre Temp Optimiser sheet
        
        Args:
            temp_inner: Inner tire temperature in °C
            temp_middle: Middle tire temperature in °C
            temp_outer: Outer tire temperature in °C
            current_pressure: Current tire pressure in bar
            target_temp: Target average temperature in °C
            
        Returns:
            Dictionary with optimization results
        """
        avg_temp = (temp_inner + temp_middle + temp_outer) / 3
        temp_range = max(temp_inner, temp_middle, temp_outer) - min(temp_inner, temp_middle, temp_outer)
        
        # Calculate pressure adjustment based on average temperature
        temp_diff = avg_temp - target_temp
        pressure_adjustment = temp_diff * 0.02  # 0.02 bar per degree
        
        recommended_pressure = current_pressure - pressure_adjustment
        
        # Analyze temperature distribution
        if temp_range < 5:
            distribution = "Excellent"
        elif temp_range < 10:
            distribution = "Good"
        elif temp_range < 15:
            distribution = "Fair"
        else:
            distribution = "Poor"
        
        # Analyze camber based on temperature distribution
        if temp_inner > temp_outer + 5:
            camber_advice = "Reduce negative camber"
        elif temp_outer > temp_inner + 5:
            camber_advice = "Increase negative camber"
        else:
            camber_advice = "Camber is good"
        
        return {
            'average_temp': round(avg_temp, 1),
            'temp_range': round(temp_range, 1),
            'current_pressure': current_pressure,
            'recommended_pressure': round(recommended_pressure, 2),
            'pressure_change': round(pressure_adjustment, 2),
            'distribution_rating': distribution,
            'camber_advice': camber_advice,
            'within_target': abs(temp_diff) < 5
        }
    
    @staticmethod
    def calculate_lap_time_with_fuel(base_lap_time, fuel_weight, fuel_effect=0.035):
        """
        Calculate lap time considering fuel weight
        
        Args:
            base_lap_time: Base lap time in seconds with minimum fuel
            fuel_weight: Current fuel weight in kg
            fuel_effect: Time penalty per kg of fuel (seconds)
            
        Returns:
            Adjusted lap time in seconds
        """
        return base_lap_time + (fuel_weight * fuel_effect)
    
    @staticmethod
    def calculate_tire_wear(laps_on_tire, tire_life_laps, wear_rate=1.0):
        """
        Calculate tire wear percentage
        
        Args:
            laps_on_tire: Number of laps completed on this tire set
            tire_life_laps: Expected tire life in laps
            wear_rate: Wear multiplier (1.0 = normal, >1 = faster wear)
            
        Returns:
            Wear percentage (0-100)
        """
        wear = (laps_on_tire / tire_life_laps) * 100 * wear_rate
        return min(100, wear)
    
    @staticmethod
    def calculate_race_time(laps, base_lap_time, fuel_per_lap, initial_fuel, 
                           fuel_effect=0.035, pit_stop_time=25):
        """
        Calculate total race time including pit stops and fuel effect
        
        Args:
            laps: Total race laps
            base_lap_time: Base lap time in seconds
            fuel_per_lap: Fuel consumption per lap in liters
            initial_fuel: Starting fuel in liters
            fuel_effect: Time penalty per kg of fuel
            pit_stop_time: Pit stop duration in seconds
            
        Returns:
            Dictionary with race time breakdown
        """
        # Fuel density approximately 0.75 kg/liter
        fuel_density = 0.75
        
        total_time = 0
        current_fuel = initial_fuel
        pit_stops = 0
        
        for lap in range(laps):
            # Calculate current fuel weight
            fuel_weight = current_fuel * fuel_density
            
            # Calculate lap time with current fuel load
            lap_time = RacingCalculations.calculate_lap_time_with_fuel(
                base_lap_time, fuel_weight, fuel_effect
            )
            
            total_time += lap_time
            current_fuel -= fuel_per_lap
            
            # Check if pit stop needed
            if current_fuel < 5 and lap < laps - 1:  # Don't pit on last lap
                total_time += pit_stop_time
                current_fuel = initial_fuel  # Refuel
                pit_stops += 1
        
        return {
            'total_time_seconds': round(total_time, 2),
            'total_time_formatted': RacingCalculations.format_time(total_time),
            'pit_stops': pit_stops,
            'average_lap_time': round(total_time / laps, 2)
        }
    
    @staticmethod
    def format_time(seconds):
        """
        Format time in seconds to MM:SS.mmm format
        
        Args:
            seconds: Time in seconds
            
        Returns:
            Formatted time string
        """
        minutes = int(seconds // 60)
        remaining_seconds = seconds % 60
        return f"{minutes}:{remaining_seconds:06.3f}"
    
    @staticmethod
    def calculate_setup_balance(front_wing, rear_wing, front_spring, rear_spring):
        """
        Calculate car balance based on setup parameters
        
        Args:
            front_wing: Front wing setting
            rear_wing: Rear wing setting
            front_spring: Front spring rate
            rear_spring: Rear spring rate
            
        Returns:
            Dictionary with balance analysis
        """
        # Wing balance (higher value = more downforce)
        wing_balance = (rear_wing - front_wing) / max(front_wing, rear_wing) * 100
        
        # Spring balance
        spring_balance = (rear_spring - front_spring) / max(front_spring, rear_spring) * 100
        
        # Overall balance tendency
        if wing_balance > 10:
            aero_balance = "Oversteer (rear-biased aero)"
        elif wing_balance < -10:
            aero_balance = "Understeer (front-biased aero)"
        else:
            aero_balance = "Neutral aero balance"
        
        if spring_balance > 10:
            mech_balance = "Oversteer (rear-biased springs)"
        elif spring_balance < -10:
            mech_balance = "Understeer (front-biased springs)"
        else:
            mech_balance = "Neutral mechanical balance"
        
        return {
            'wing_balance_percent': round(wing_balance, 1),
            'spring_balance_percent': round(spring_balance, 1),
            'aero_tendency': aero_balance,
            'mechanical_tendency': mech_balance
        }
