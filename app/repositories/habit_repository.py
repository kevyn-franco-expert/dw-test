from app import db
from app.models.habit import Habit
from sqlalchemy.exc import SQLAlchemyError

class HabitRepository:
    """Repository for habit data access operations."""
    
    @staticmethod
    def get_all():
        """Get all habits."""
        return Habit.query.all()
    
    @staticmethod
    def get_by_id(habit_id):
        """Get habit by ID."""
        return Habit.query.get(habit_id)
    
    @staticmethod
    def create(habit_data):
        """Create a new habit."""
        habit = Habit(**habit_data)
        db.session.add(habit)
        try:
            db.session.commit()
            return habit
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def update(habit_id, habit_data):
        """Update an existing habit."""
        habit = Habit.query.get(habit_id)
        if not habit:
            return None
        
        for key, value in habit_data.items():
            setattr(habit, key, value)
        
        try:
            db.session.commit()
            return habit
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def delete(habit_id):
        """Delete a habit."""
        habit = Habit.query.get(habit_id)
        if not habit:
            return False
        
        db.session.delete(habit)
        try:
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e