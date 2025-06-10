from flask import Blueprint

habits_bp = Blueprint('habits', __name__)
check_ins_bp = Blueprint('check_ins', __name__)

from app.api import habits, check_ins