
from models import Profile, RunningLogs
from db import SessionLocal
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask import request, jsonify

bcrypt = Bcrypt()

def register_user(form):
    name = form["name"]
    email = form["email"]
    password = form.get("password")
    
    if not password:
        return "Password is required."

    session = SessionLocal()
    try:
        existing = session.query(Profile).filter_by(email=email).first()
        if existing:
            return "Email already registered."

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        profile = Profile(name=name, email=email, password=hashed_pw)
        session.add(profile)
        session.commit()
        return "Registration successful!"
    finally:
        session.close()

def add_run_entry(form):
    email = form["run_email"]
    run_date = form["date"]
    distance = form["distance_km"]
    session = SessionLocal()
    try:
        profile = session.query(Profile).filter_by(email=email).first()
        if not profile:
            return "Profile not found. Please register first."

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

@app.route('/login', methods=['POST'])
def login_api():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    session = SessionLocal()
    try:
        user = session.query(Profile).filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found. Please register first."}), 404

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Incorrect password."}), 401

        return jsonify({"message": "Password confirmed. You are signed in."}), 200
    finally:
        session.close()