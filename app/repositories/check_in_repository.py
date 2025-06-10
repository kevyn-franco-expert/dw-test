from sqlalchemy import func, and_, text
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

from app import db
from app.models.check_in import CheckIn

class CheckInRepository:
    """Repository for check-in data access operations."""
    
    @staticmethod
    def get_by_habit_id(habit_id):
        """Get all check-ins for a habit."""
        return CheckIn.query.filter_by(habit_id=habit_id).order_by(CheckIn.date.desc()).all()
    
    @staticmethod
    def get_by_id(check_in_id):
        """Get check-in by ID."""
        return CheckIn.query.get(check_in_id)
    
    @staticmethod
    def create(check_in_data):
        """Create a new check-in."""
        check_in = CheckIn(**check_in_data)
        db.session.add(check_in)
        try:
            db.session.commit()
            return check_in
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def delete(check_in_id):
        """Delete a check-in."""
        check_in = CheckIn.query.get(check_in_id)
        if not check_in:
            return False
        
        db.session.delete(check_in)
        try:
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
    
    def get_streaks(self, habit_id: int) -> list[dict]:
        """
        Get streaks for a habit using a SQL query with window functions.
        A streak is defined as consecutive days with check-ins.
        Returns a list of dictionaries with 'first', 'last', and 'days' keys.
        """
        from sqlalchemy import text

        sql = text("""
            WITH ordered AS (
                SELECT
                    date,
                    ROW_NUMBER() OVER (ORDER BY date) AS rn
                FROM check_ins
                WHERE habit_id = :habit_id
            ),
            groups AS (
                SELECT
                    date,
                    DATE(julianday(date) - rn) AS grp
                FROM ordered
            )
            SELECT
                MIN(date) AS first,
                MAX(date) AS last,
                COUNT(*) AS days
            FROM groups
            GROUP BY grp
            ORDER BY first
        """)
        result = db.session.execute(sql, {"habit_id": habit_id})
        from datetime import datetime
        streaks = [
            {
                "first": datetime.strptime(row.first, "%Y-%m-%d").date() if isinstance(row.first, str) else row.first,
                "last": datetime.strptime(row.last, "%Y-%m-%d").date() if isinstance(row.last, str) else row.last,
                "days": row.days
            }
            for row in result
        ]
        return streaks