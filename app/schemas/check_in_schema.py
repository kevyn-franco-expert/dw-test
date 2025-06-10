from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime

class CheckInSchema(Schema):
    """Schema for validating and serializing check-in data."""
    
    id = fields.Integer(dump_only=True)
    habit_id = fields.Integer(required=True)
    date = fields.Date(default=lambda: datetime.utcnow().date())
    notes = fields.String(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    
    # Nested fields
    habit = fields.Nested('HabitSchema', exclude=('check_ins',), dump_only=True)
    
    @validates('date')
    def validate_date(self, date):
        """Validate that check-in date is not in the future."""
        if date > datetime.utcnow().date():
            raise ValidationError('Check-in date cannot be in the future.')
        return date

class StreakSchema(Schema):
    """Schema for serializing streak data."""
    
    first = fields.Date(required=True)
    last = fields.Date(required=True)
    days = fields.Integer(required=True)