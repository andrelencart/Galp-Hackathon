# import mysql.connector

# def register_user(form):
#     name = form["name"]
#     email = form["email"]
#     # For now, only insert what exists in the table
#     conn = None
#     cursor = None
#     try:
#         conn = mysql.connector.connect(
#             host="db",
#             user="root",
#             password="Root123@",
#             database="User_db"
#         )
#         cursor = conn.cursor()
#         # Only insert name and email
#         cursor.execute(
#             "INSERT INTO Profile (name, email, ) VALUES (%s, %s)",
#             (name, email)
#         )
#         conn.commit()
#         return "Registration successful!"
#     except mysql.connector.errors.IntegrityError:
#         return "Email already registered."
#     finally:
#         if cursor is not None:
#             cursor.close()
#         if conn is not None:
#             conn.close()

# def add_run_entry(form):
#     email = form["run_email"]
#     run_date = form["date"]
#     distance = form["distance_km"]
#     conn = mysql.connector.connect(
#         host="db",
#         user="root",
#         password="Root123@",
#         database="User_db"
#     )
#     cursor = conn.cursor()
#     cursor.execute("SELECT id FROM Profile WHERE email=%s", (email,))
#     result = cursor.fetchone()
#     if result:
#         profile_id = result[0]
#         # Use the correct column name: km
#         cursor.execute(
#             "INSERT INTO Running_logs (profile_id, date, km) VALUES (%s, %s, %s)",
#             (profile_id, run_date, distance)
#         )
#         conn.commit()
#         message = "Run added!"
#     else:
#         message = "Profile not found. Please register first."
#     cursor.close()
#     conn.close()
#     return message

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