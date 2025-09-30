"""
Racing Calculations Examples
Demonstrates how Excel formulas are implemented in Python
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from calculations import RacingCalculations

def example_fuel_strategy():
    """Example: Calculate fuel strategy for a race"""
    print("\n" + "="*70)
    print("EXAMPLE 1: FUEL STRATEGY CALCULATION")
    print("="*70)
    
    # Race parameters
    session_duration = 60  # minutes
    lap_time = 95  # seconds
    fuel_tank_capacity = 120  # liters
    fuel_per_lap = 2.5  # liters
    
    print(f"\nRace Parameters:")
    print(f"  Session Duration: {session_duration} minutes")
    print(f"  Average Lap Time: {lap_time} seconds")
    print(f"  Fuel Tank Capacity: {fuel_tank_capacity} liters")
    print(f"  Fuel per Lap: {fuel_per_lap} liters")
    
    strategy = RacingCalculations.calculate_stint_strategy(
        session_duration, lap_time, fuel_tank_capacity, fuel_per_lap
    )
    
    print(f"\nCalculated Strategy:")
    print(f"  Total Laps: {strategy['total_laps']}")
    print(f"  Laps per Tank: {strategy['laps_per_tank']}")
    print(f"  Pit Stops Required: {strategy['pit_stops']}")
    print(f"  Stint Lengths: {strategy['stints']}")
    print(f"  Fuel per Stint: {[f'{f:.1f}L' for f in strategy['fuel_per_stint']]}")
    
    # Excel equivalent:
    print(f"\nExcel Formula Equivalent:")
    print(f"  Total Laps = (Duration*60) / Lap Time")
    print(f"  Laps per Tank = (Tank Capacity - 5) / Fuel per Lap")
    print(f"  Pit Stops = Total Laps / Laps per Tank")

def example_tire_optimization():
    """Example: Optimize tire pressure based on temperatures"""
    print("\n" + "="*70)
    print("EXAMPLE 2: TIRE PRESSURE OPTIMIZATION")
    print("="*70)
    
    # Front Left tire data
    temp_inner = 90.5
    temp_middle = 88.2
    temp_outer = 82.1
    current_pressure = 2.1  # bar
    
    print(f"\nFront Left Tire Data:")
    print(f"  Temperature Inner:  {temp_inner}°C")
    print(f"  Temperature Middle: {temp_middle}°C")
    print(f"  Temperature Outer:  {temp_outer}°C")
    print(f"  Current Pressure:   {current_pressure} bar")
    
    result = RacingCalculations.optimize_tire_pressure(
        temp_inner, temp_middle, temp_outer, current_pressure
    )
    
    print(f"\nOptimization Results:")
    print(f"  Average Temperature: {result['average_temp']}°C")
    print(f"  Temperature Range: {result['temp_range']}°C")
    print(f"  Current Pressure: {result['current_pressure']} bar")
    print(f"  Recommended Pressure: {result['recommended_pressure']} bar")
    print(f"  Pressure Change: {result['pressure_change']:+.2f} bar")
    print(f"  Distribution Rating: {result['distribution_rating']}")
    print(f"  Camber Advice: {result['camber_advice']}")
    print(f"  Within Target: {'Yes' if result['within_target'] else 'No'}")
    
    # Excel equivalent:
    print(f"\nExcel Formula Equivalent:")
    print(f"  =AVERAGE(temp_inner, temp_middle, temp_outer)")
    print(f"  =MAX(temps) - MIN(temps)")
    print(f"  =IF(avg_temp > target + 5, pressure - 0.2, pressure)")

def example_lap_time_fuel_effect():
    """Example: Calculate lap time with fuel weight effect"""
    print("\n" + "="*70)
    print("EXAMPLE 3: LAP TIME WITH FUEL WEIGHT")
    print("="*70)
    
    base_lap_time = 90.0  # seconds
    fuel_weights = [10, 30, 50, 70, 90]  # kg
    
    print(f"\nBase Lap Time: {base_lap_time} seconds")
    print(f"\nLap Times with Different Fuel Loads:")
    print(f"{'Fuel (kg)':<15} {'Lap Time (s)':<15} {'Delta (s)':<15}")
    print("-" * 45)
    
    for fuel in fuel_weights:
        lap_time = RacingCalculations.calculate_lap_time_with_fuel(base_lap_time, fuel)
        delta = lap_time - base_lap_time
        print(f"{fuel:<15} {lap_time:<15.3f} {delta:+.3f}")
    
    # Excel equivalent:
    print(f"\nExcel Formula Equivalent:")
    print(f"  =base_lap_time + (fuel_weight * 0.035)")

def example_race_simulation():
    """Example: Complete race simulation"""
    print("\n" + "="*70)
    print("EXAMPLE 4: RACE TIME SIMULATION")
    print("="*70)
    
    laps = 25
    base_lap_time = 92.0  # seconds
    fuel_per_lap = 2.8  # liters
    initial_fuel = 70.0  # liters
    
    print(f"\nRace Parameters:")
    print(f"  Race Laps: {laps}")
    print(f"  Base Lap Time: {base_lap_time}s")
    print(f"  Fuel per Lap: {fuel_per_lap}L")
    print(f"  Starting Fuel: {initial_fuel}L")
    
    result = RacingCalculations.calculate_race_time(
        laps, base_lap_time, fuel_per_lap, initial_fuel
    )
    
    print(f"\nSimulation Results:")
    print(f"  Total Race Time: {result['total_time_formatted']}")
    print(f"  Total Time (seconds): {result['total_time_seconds']}s")
    print(f"  Pit Stops: {result['pit_stops']}")
    print(f"  Average Lap Time: {result['average_lap_time']:.3f}s")

def example_setup_balance():
    """Example: Analyze car setup balance"""
    print("\n" + "="*70)
    print("EXAMPLE 5: SETUP BALANCE ANALYSIS")
    print("="*70)
    
    # Setup parameters
    front_wing = 3
    rear_wing = 5
    front_spring = 85000  # N/m
    rear_spring = 95000  # N/m
    
    print(f"\nCar Setup:")
    print(f"  Front Wing: {front_wing}")
    print(f"  Rear Wing: {rear_wing}")
    print(f"  Front Spring Rate: {front_spring} N/m")
    print(f"  Rear Spring Rate: {rear_spring} N/m")
    
    result = RacingCalculations.calculate_setup_balance(
        front_wing, rear_wing, front_spring, rear_spring
    )
    
    print(f"\nBalance Analysis:")
    print(f"  Wing Balance: {result['wing_balance_percent']:+.1f}%")
    print(f"  Spring Balance: {result['spring_balance_percent']:+.1f}%")
    print(f"  Aero Tendency: {result['aero_tendency']}")
    print(f"  Mechanical Tendency: {result['mechanical_tendency']}")
    
    # Interpretation
    print(f"\nInterpretation:")
    if result['wing_balance_percent'] > 10:
        print("  → More rear downforce = Better traction in corners")
        print("  → May cause understeer on entry")
    elif result['wing_balance_percent'] < -10:
        print("  → More front downforce = Better turn-in")
        print("  → May cause oversteer on exit")
    else:
        print("  → Balanced aerodynamics")

def example_tire_wear():
    """Example: Calculate tire wear"""
    print("\n" + "="*70)
    print("EXAMPLE 6: TIRE WEAR CALCULATION")
    print("="*70)
    
    tire_life_laps = 40
    wear_rates = [0.8, 1.0, 1.2]  # Conservative, Normal, Aggressive
    
    print(f"\nTire Life: {tire_life_laps} laps")
    print(f"\nWear Rate Comparison:")
    print(f"{'Laps':<10} {'Conservative':<20} {'Normal':<20} {'Aggressive':<20}")
    print("-" * 70)
    
    for laps in [5, 10, 15, 20, 25, 30, 35, 40]:
        wear_values = []
        for rate in wear_rates:
            wear = RacingCalculations.calculate_tire_wear(laps, tire_life_laps, rate)
            wear_values.append(f"{wear:.1f}%")
        
        print(f"{laps:<10} {wear_values[0]:<20} {wear_values[1]:<20} {wear_values[2]:<20}")
    
    # Excel equivalent:
    print(f"\nExcel Formula Equivalent:")
    print(f"  =(laps_on_tire / tire_life_laps) * 100 * wear_rate")

def main():
    """Run all examples"""
    print("\n" + "="*70)
    print("RACING CALCULATIONS - EXAMPLES AND DEMONSTRATIONS")
    print("Excel Formula Implementation in Python")
    print("="*70)
    
    example_fuel_strategy()
    example_tire_optimization()
    example_lap_time_fuel_effect()
    example_race_simulation()
    example_setup_balance()
    example_tire_wear()
    
    print("\n" + "="*70)
    print("All examples completed!")
    print("="*70)
    print("""
These calculations replicate the Excel formulas from the original file.

To use these in the web application:
1. The backend API provides endpoints to store data
2. The calculations module processes the data
3. The frontend displays the results

Example API usage:
  POST /api/events/{id}/sessions
  - Store session data with fuel and tire info
  
  The backend automatically calculates:
  - Optimal fuel strategy
  - Tire pressure recommendations
  - Expected lap times
  - Setup balance analysis

For more details, see:
  - backend/calculations.py - All calculation functions
  - backend/app.py - API endpoints
  - CONVERSION_GUIDE.md - Excel to WebApp mapping
""")

if __name__ == '__main__':
    main()
