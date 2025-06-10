# Mini-Habit Tracker

## Features

- Create habits to track
- Record daily check-ins
- Track streaks of consecutive check-ins
- View habit progress with visual indicators
- Add notes to check-ins

## Tech Stack

### Backend
- Python 3.10+
- Flask 2.x
- SQLAlchemy 2.x (declarative)
- SQLite or Postgres

### Frontend
- React 18+
- TypeScript
- Material UI
- Axios

## Setup

1. Clone the repository:

2. Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Set environment variables (optional):
```
export FLASK_APP=run.py
export FLASK_CONFIG=development
```

5. Initialize the database:
```
python init_db.py
```
This script will create all necessary database tables directly without using Flask-Migrate.

## Running the Application

Start the development server:
```
python run.py
```

Or with Flask CLI:
```
flask run
```

The API will be available at http://localhost:5000

## Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

The frontend will be available at http://localhost:5173
## Running with Docker

You can build and run the application using Docker:

```sh
# Build the Docker image
docker build -t mini-habit-tracker .

# Run the container (exposes port 5000)
docker run -p 5000:5000 mini-habit-tracker
```

The database will be automatically initialized during the Docker build process, and the API will be available at [http://localhost:5000](http://localhost:5000)

## API Endpoints

### Habits

- `GET /habits` - List all habits
- `POST /habits` - Create a new habit
- `GET /habits/<id>` - Get a specific habit
- `PUT /habits/<id>` - Update a habit
- `DELETE /habits/<id>` - Delete a habit

### Check-ins

- `GET /habits/<id>/check-ins` - List all check-ins for a habit
- `POST /habits/<id>/check-ins` - Create a check-in for a habit
- `GET /habits/<id>/streaks` - Get streak information for a habit

## Running Tests

```
pytest
```

## License

[MIT License](LICENSE)