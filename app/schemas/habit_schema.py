from marshmallow import Schema, fields, validate, ValidationError

class HabitSchema(Schema):
    """Schema for validating and serializing habit data."""
    
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    description = fields.String(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
    # Nested fields
    check_ins = fields.List(fields.Nested('CheckInSchema', exclude=('habit',)), dump_only=True)
    
    def validate_name(self, name):
        """Validate that habit name is not empty."""
        if not name.strip():
            raise ValidationError('Habit name cannot be empty.')
        return name