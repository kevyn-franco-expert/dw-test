from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from config import config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name):
    """Factory function to create Flask application instance."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Enable CORS for frontend dev server
    CORS(app, origins=["http://localhost:5173"])

    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.api import habits_bp, check_ins_bp
    app.register_blueprint(habits_bp, url_prefix='/habits')
    app.register_blueprint(check_ins_bp, url_prefix='/habits')
    
    @app.route('/health')
    def health_check():
        return {'status': 'ok'}
    
    return app