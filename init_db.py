from app import create_app, db
from app.models.habit import Habit
from app.models.check_in import CheckIn

# Create app with development configuration
app = create_app('development')

# Create application context
with app.app_context():
    print("Creating database tables...")
    db.drop_all()
    # Create all tables
    db.create_all()
    print("Database tables created successfully!")
    
    # Verify tables were created
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Tables in database: {tables}")