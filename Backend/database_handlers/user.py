
from models import Profile, RunningLogs
from db import SessionLocal
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask import sonify
from countries import COUNTRIES_AND_DISTRICTS

bcrypt = Bcrypt()


@app.route('/auth/register', methods=['POST'])
def register_api():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    country = data.get('country')
    district = data.get('district')
    council = data.get('council')

    # Validate required fields
    if not all([name, email, password, district, council]):
        return jsonify({"message": "All fields are required: name, email, password, district, council."}), 400

    # Validate country, district and council
    if country not in COUNTRIES_AND_DISTRICTS or not COUNTRIES_AND_DISTRICTS[country]:
        return jsonify({"message": f"Invalid or unsupported country: {country}"}), 400

    if district not in COUNTRIES_AND_DISTRICTS[country]:
        return jsonify({"message": f"Invalid district. Supported districts for {country}: {', '.join(COUNTRIES_AND_DISTRICTS[country].keys())}"}), 400

    if council not in COUNTRIES_AND_DISTRICTS[country][district]:
        return jsonify({"message": f"Invalid council for district {district}. Supported councils: {', '.join(COUNTRIES_AND_DISTRICTS[country][district])}"}), 400

    session = SessionLocal()
    try:
        existing = session.query(Profile).filter_by(email=email).first()
        if existing:
            return jsonify({"message": "Email already registered."}), 400

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
        return jsonify({"message": "Registration successful!"}), 201
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