from database_handlers.models import Profile, RunningLogs
from database_handlers.db import SessionLocal
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask import jsonify
from database_handlers.countries import COUNTRIES_AND_DISTRICTS

bcrypt = Bcrypt()

def register_user(data):
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    country = data.get('country')
    district = data.get('district')
    council = data.get('council')

    # Validate required fields
    if not all([name, email, password, district, council]):
        return {"message": "All fields are required: name, email, password, district, council."}, 400

    # Validate country, district and council
    if country not in COUNTRIES_AND_DISTRICTS or not COUNTRIES_AND_DISTRICTS[country]:
        return {"message": f"Invalid or unsupported country: {country}"}, 400

    if district not in COUNTRIES_AND_DISTRICTS[country]:
        return {"message": f"Invalid district. Supported districts for {country}: {', '.join(COUNTRIES_AND_DISTRICTS[country].keys())}"}, 400

    if council not in COUNTRIES_AND_DISTRICTS[country][district]:
        return {"message": f"Invalid council for district {district}. Supported councils: {', '.join(COUNTRIES_AND_DISTRICTS[country][district])}"}, 400

    session = SessionLocal()
    try:
        existing = session.query(Profile).filter_by(email=email).first()
        if existing:
            return {"message": "Email already registered."}, 400

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        profile = Profile(
            name=name,
            email=email,
            password=hashed_pw,
            country=country,
            district=district,
            council=council
        )
        session.add(profile)
        session.commit()
        return {"message": "Registration successful!"}, 201
    finally:
        session.close()

def add_run_entry(data):
    email = data.get("run_email")
    run_date = data.get("date")
    distance = data.get("distance_km")
    session = SessionLocal()
    try:
        profile = session.query(Profile).filter_by(email=email).first()
        if not profile:
            return {"message": "Profile not found. Please register first."}, 404

        run_log = RunningLogs(
            profile_id=profile.id,
            date=datetime.strptime(run_date, "%Y-%m-%d").date(),
            submitted_at=datetime.now(),
            km=distance
        )
        session.add(run_log)
        session.commit()
        return {"message": "Run added!"}, 201
    finally:
        session.close()

def signup_api(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"error": "Email and password are required."}, 400

    session = SessionLocal()
    try:
        user = session.query(Profile).filter_by(email=email).first()
        if not user:
            return {"error": "User not found. Please register first."}, 404

        if not bcrypt.check_password_hash(user.password, password):
            return {"error": "Incorrect password."}, 401

        return {"message": "Password confirmed. You are signed in."}, 200
    finally:
        session.close()