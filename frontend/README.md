# Habit Tracker Frontend

A React-based frontend for the Habit Tracker application. This application allows users to create habits, check in daily, and track their streaks.

## Features

- Create, edit, and delete habits
- Check in on habits daily
- Add notes to check-ins
- View current streak or days since last check-in
- Material UI for a clean, responsive interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see main project README)

## Installation

1. Clone the repository (if not already done)
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

## Running the Application

1. Make sure the backend API is running on http://localhost:5000
2. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
3. Open your browser and navigate to http://localhost:5173

## Usage

### Creating a Habit

1. Click the "Add Habit" button
2. Enter a name and optional description
3. Click "Create"

### Checking In

1. Find the habit you want to check in on
2. Click the "Check In" button
3. Alternatively, click "Check In with Note" to add a note to your check-in

### Viewing Streaks

Each habit card displays:
- If you've checked in today
- Your current streak (if you've checked in today or yesterday)
- Days since last check-in (if not in a streak)

## Screenshots

![Habit Tracker Screenshot](./screenshot.png)

## Technologies Used

- React
- TypeScript
- Material UI
- Axios for API requests
- date-fns for date manipulation
