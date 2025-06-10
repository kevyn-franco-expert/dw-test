import pytest
from run import app
from app import db
from flask import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_create_habit(client):
    # Valid habit
    response = client.post('/habits', json={'name': 'Drink Water'})
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'Drink Water'

    # Invalid habit (empty name)
    response = client.post('/habits', json={'name': ''})
    assert response.status_code == 400

def test_create_check_in_and_streak(client):
    # Create habit
    response = client.post('/habits', json={'name': 'Exercise'})
    habit_id = response.get_json()['id']

    # Valid check-in
    response = client.post(f'/habits/{habit_id}/check-ins', json={'date': '2025-06-10'})
    assert response.status_code == 201

    # Invalid check-in (future date)
    response = client.post(f'/habits/{habit_id}/check-ins', json={'date': '2999-01-01'})
    assert response.status_code == 400

    # Get streaks (should be 1 day)
    response = client.get(f'/habits/{habit_id}/streaks')
    assert response.status_code == 200
    streaks = response.get_json()
    assert isinstance(streaks, list)
    assert streaks[0]['days'] == 1

def test_habit_not_found(client):
    # Get non-existent habit
    response = client.get('/habits/999')
    assert response.status_code == 404

    # Create check-in for non-existent habit
    response = client.post('/habits/999/check-ins', json={'date': '2025-06-10'})
    assert response.status_code == 404

def test_check_in_not_found(client):
    # Create habit
    response = client.post('/habits', json={'name': 'Read'})
    habit_id = response.get_json()['id']

    # Delete non-existent check-in
    response = client.delete(f'/habits/{habit_id}/check-ins/999')
    assert response.status_code == 404