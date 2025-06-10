import os
from datetime import timedelta

class Config:
    """Configuración base para la aplicación."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-muy-secreta'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    """Configuración para entorno de desarrollo."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or 'sqlite:///habit_tracker_dev.db'

class TestingConfig(Config):
    """Configuración para entorno de pruebas."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or 'sqlite:///habit_tracker_test.db'

class ProductionConfig(Config):
    """Configuración para entorno de producción."""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///habit_tracker.db'

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}