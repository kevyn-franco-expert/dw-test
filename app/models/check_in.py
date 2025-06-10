from datetime import datetime
from app import db

class CheckIn(db.Model):
    """Model representing a check-in for a habit."""
    
    __tablename__ = 'check_ins'
    
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habits.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with Habit model
    habit = db.relationship('Habit', back_populates='check_ins')
    
    __table_args__ = (
        db.UniqueConstraint('habit_id', 'date', name='uix_habit_date'),
    )
    
    def __repr__(self):
        return f'<CheckIn for habit_id={self.habit_id} on {self.date}>'
    
    def to_dict(self):
        """Convert check-in to dictionary."""
        return {
            'id': self.id,
            'habit_id': self.habit_id,
            'date': self.date.isoformat() if self.date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }