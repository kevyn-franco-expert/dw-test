from flask import request, jsonify
from app.api import check_ins_bp
from app.services.check_in_service import CheckInService

check_in_service = CheckInService()

@check_ins_bp.route('/<int:habit_id>/check-ins', methods=['GET'])
def get_check_ins(habit_id):
    """Get all check-ins for a habit."""
    result, status_code = check_in_service.get_check_ins_by_habit(habit_id)
    return jsonify(result), status_code

@check_ins_bp.route('/<int:habit_id>/check-ins', methods=['POST'])
def create_check_in(habit_id):
    """Create a new check-in for a habit."""
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    data = request.get_json()
    result, status_code = check_in_service.create_check_in(habit_id, data)
    return jsonify(result), status_code

@check_ins_bp.route('/<int:habit_id>/check-ins/<int:check_in_id>', methods=['DELETE'])
def delete_check_in(habit_id, check_in_id):
    """Delete a check-in."""
    result, status_code = check_in_service.delete_check_in(check_in_id)
    return jsonify(result), status_code

@check_ins_bp.route('/<int:habit_id>/streaks', methods=['GET'])
def get_streaks(habit_id):
    """Get streaks for a habit."""
    result, status_code = check_in_service.get_streaks(habit_id)
    return jsonify(result), status_code