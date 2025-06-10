from datetime import datetime
from app import db

class Habit(db.Model):
    """Model representing a habit to be tracked."""
    
    __tablename__ = 'habits'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with CheckIn model
    check_ins = db.relationship('CheckIn', back_populates='habit', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Habit {self.name}>'
    
    def to_dict(self):
        """Convert habit to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }