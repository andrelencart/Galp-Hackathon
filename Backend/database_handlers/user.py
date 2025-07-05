
from models import Profile, RunningLogs
from db import SessionLocal
from datetime import datetime

def register_user(form):
    name = form["name"]
    email = form["email"]
    session = SessionLocal()
    try:
        # Check if email already exists
        existing = session.query(Profile).filter_by(email=email).first()
        if existing:
            return "Email already registered."
        # Create and add new profile
        profile = Profile(name=name, email=email)
        session.add(profile)
        session.commit()
        return "Registration successful!"
    finally:
        session.close()

def add_run_entry(form):
    email = form["run_email"]
    run_date = form["date"]  # format: YYYY-MM-DD
    distance = form["distance_km"]
    session = SessionLocal()
    try:
        profile = session.query(Profile).filter_by(email=email).first()
        if not profile:
            return "Profile not found. Please register first."
        # Create and add new run log
        run_log = RunningLogs(
            profile_id=profile.id,
            date=datetime.strptime(run_date, "%Y-%m-%d").date(),
            submitted_at=datetime.now(),
            km=distance
        )
        session.add(run_log)
        session.commit()
        return "Run added!"
    finally:
        session.close()