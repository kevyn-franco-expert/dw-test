FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=run.py
ENV FLASK_CONFIG=production

EXPOSE 5000

# Initialize the database before starting the application
RUN python init_db.py

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]