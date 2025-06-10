from app.repositories.check_in_repository import CheckInRepository
from app.repositories.habit_repository import HabitRepository
from app.schemas.check_in_schema import CheckInSchema, StreakSchema

from typing import Any, Dict, Tuple

class CheckInService:
    """Service for check-in business logic."""

    def __init__(self) -> None:
        """Initialize the service with repositories and schemas."""
        self.repository = CheckInRepository()
        self.habit_repository = HabitRepository()
        self.schema = CheckInSchema()
        self.streak_schema = StreakSchema()

    def get_check_ins_by_habit(self, habit_id: int) -> Tuple[list[dict], int]:
        """Get all check-ins for a habit."""
        habit = self.habit_repository.get_by_id(habit_id)
        if not habit:
            return {'error': 'Habit not found'}, 404

        check_ins = self.repository.get_by_habit_id(habit_id)
        return self.schema.dump(check_ins, many=True), 200

    def create_check_in(self, habit_id: int, check_in_data: Dict[str, Any]) -> Tuple[dict, int]:
        """Create a new check-in for a habit."""
        habit = self.habit_repository.get_by_id(habit_id)
        if not habit:
            return {'error': 'Habit not found'}, 404

        check_in_data['habit_id'] = habit_id

        errors = self.schema.validate(check_in_data)
        if errors:
            return {'errors': errors}, 400

        from datetime import datetime, date
        if 'date' in check_in_data and isinstance(check_in_data['date'], str):
            try:
                check_in_data['date'] = datetime.strptime(check_in_data['date'], "%Y-%m-%d").date()
            except ValueError:
                return {'error': 'Invalid date format. Use YYYY-MM-DD.'}, 400

        try:
            check_in = self.repository.create(check_in_data)
            return self.schema.dump(check_in), 201
        except Exception as e:
            return {'error': str(e)}, 500

    def delete_check_in(self, check_in_id: int) -> Tuple[dict, int]:
        """Delete a check-in."""
        check_in = self.repository.get_by_id(check_in_id)
        if not check_in:
            return {'error': 'Check-in not found'}, 404

        try:
            success = self.repository.delete(check_in_id)
            if success:
                return {'message': 'Check-in deleted successfully'}, 200
            else:
                return {'error': 'Failed to delete check-in'}, 500
        except Exception as e:
            return {'error': str(e)}, 500

    def get_streaks(self, habit_id: int) -> Tuple[list[dict], int]:
        """Get streaks for a habit."""
        habit = self.habit_repository.get_by_id(habit_id)
        if not habit:
            return {'error': 'Habit not found'}, 404

        streaks = self.repository.get_streaks(habit_id)
        return self.streak_schema.dump(streaks, many=True), 200