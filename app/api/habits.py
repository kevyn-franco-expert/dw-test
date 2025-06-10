from flask import request, jsonify
from app.api import habits_bp
from app.services.habit_service import HabitService

habit_service = HabitService()

@habits_bp.route('', methods=['GET'])
def get_habits():
    """Get all habits."""
    habits = habit_service.get_all_habits()
    return jsonify(habits)

@habits_bp.route('/<int:habit_id>', methods=['GET'])
def get_habit(habit_id):
    """Get a specific habit by ID."""
    habit = habit_service.get_habit_by_id(habit_id)
    if not habit:
        return jsonify({'error': 'Habit not found'}), 404
    return jsonify(habit)

@habits_bp.route('', methods=['POST'])
def create_habit():
    """Create a new habit."""
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    data = request.get_json()
    result, status_code = habit_service.create_habit(data)
    return jsonify(result), status_code

@habits_bp.route('/<int:habit_id>', methods=['PUT'])
def update_habit(habit_id):
    """Update an existing habit."""
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    data = request.get_json()
    result, status_code = habit_service.update_habit(habit_id, data)
    return jsonify(result), status_code

@habits_bp.route('/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    """Delete a habit."""
    result, status_code = habit_service.delete_habit(habit_id)
    return jsonify(result), status_code