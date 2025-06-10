from app.repositories.habit_repository import HabitRepository
from app.schemas.habit_schema import HabitSchema

class HabitService:
    """Service for habit business logic."""
    
    def __init__(self):
        """Initialize the service with repositories and schemas."""
        self.repository = HabitRepository()
        self.schema = HabitSchema()
    
    def get_all_habits(self):
        """Get all habits."""
        habits = self.repository.get_all()
        return self.schema.dump(habits, many=True)
    
    def get_habit_by_id(self, habit_id):
        """Get a habit by ID."""
        habit = self.repository.get_by_id(habit_id)
        if not habit:
            return None
        return self.schema.dump(habit)
    
    def create_habit(self, habit_data):
        """Create a new habit."""
        # Validate data
        errors = self.schema.validate(habit_data)
        if errors:
            return {'errors': errors}, 400
        
        # Create habit
        try:
            habit = self.repository.create(habit_data)
            return self.schema.dump(habit), 201
        except Exception as e:
            return {'error': str(e)}, 500
    
    def update_habit(self, habit_id, habit_data):
        """Update an existing habit."""
        # Check if habit exists
        existing_habit = self.repository.get_by_id(habit_id)
        if not existing_habit:
            return {'error': 'Habit not found'}, 404
        
        # Validate data
        errors = self.schema.validate(habit_data, partial=True)
        if errors:
            return {'errors': errors}, 400
        
        # Update habit
        try:
            updated_habit = self.repository.update(habit_id, habit_data)
            return self.schema.dump(updated_habit), 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    def delete_habit(self, habit_id):
        """Delete a habit."""
        # Check if habit exists
        existing_habit = self.repository.get_by_id(habit_id)
        if not existing_habit:
            return {'error': 'Habit not found'}, 404
        
        # Delete habit
        try:
            success = self.repository.delete(habit_id)
            if success:
                return {'message': 'Habit deleted successfully'}, 200
            else:
                return {'error': 'Failed to delete habit'}, 500
        except Exception as e:
            return {'error': str(e)}, 500