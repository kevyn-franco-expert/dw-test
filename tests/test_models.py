import unittest
from datetime import datetime, date, timedelta

from app import create_app, db
from app.models.habit import Habit
from app.models.check_in import CheckIn

class ModelsTestCase(unittest.TestCase):
    """Test case for the database models."""
    
    def setUp(self):
        """Set up test environment."""
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
    
    def tearDown(self):
        """Clean up test environment."""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_habit_model(self):
        """Test the Habit model."""
        # Create a habit
        habit = Habit(name='Drink water', description='Drink 2L of water daily')
        db.session.add(habit)
        db.session.commit()
        
        # Retrieve the habit
        saved_habit = Habit.query.get(habit.id)
        
        # Check that the habit was saved correctly
        self.assertEqual(saved_habit.name, 'Drink water')
        self.assertEqual(saved_habit.description, 'Drink 2L of water daily')
        self.assertIsNotNone(saved_habit.created_at)
        self.assertIsNotNone(saved_habit.updated_at)
    
    def test_check_in_model(self):
        """Test the CheckIn model."""
        # Create a habit
        habit = Habit(name='Drink water', description='Drink 2L of water daily')
        db.session.add(habit)
        db.session.commit()
        
        # Create a check-in
        today = date.today()
        check_in = CheckIn(habit_id=habit.id, date=today, notes='Completed')
        db.session.add(check_in)
        db.session.commit()
        
        # Retrieve the check-in
        saved_check_in = CheckIn.query.get(check_in.id)
        
        # Check that the check-in was saved correctly
        self.assertEqual(saved_check_in.habit_id, habit.id)
        self.assertEqual(saved_check_in.date, today)
        self.assertEqual(saved_check_in.notes, 'Completed')
        self.assertIsNotNone(saved_check_in.created_at)
    
    def test_habit_check_in_relationship(self):
        """Test the relationship between Habit and CheckIn models."""
        # Create a habit
        habit = Habit(name='Drink water', description='Drink 2L of water daily')
        db.session.add(habit)
        db.session.commit()
        
        # Create check-ins for the habit
        today = date.today()
        yesterday = today - timedelta(days=1)
        
        check_in1 = CheckIn(habit_id=habit.id, date=yesterday, notes='Completed yesterday')
        check_in2 = CheckIn(habit_id=habit.id, date=today, notes='Completed today')
        
        db.session.add_all([check_in1, check_in2])
        db.session.commit()
        
        # Retrieve the habit with check-ins
        habit_with_check_ins = Habit.query.get(habit.id)
        
        # Check that the relationship works correctly
        self.assertEqual(len(habit_with_check_ins.check_ins), 2)
        self.assertEqual(habit_with_check_ins.check_ins[0].notes, 'Completed yesterday')
        self.assertEqual(habit_with_check_ins.check_ins[1].notes, 'Completed today')
        
        # Check the reverse relationship
        self.assertEqual(check_in1.habit.name, 'Drink water')
        self.assertEqual(check_in2.habit.name, 'Drink water')

if __name__ == '__main__':
    unittest.main()