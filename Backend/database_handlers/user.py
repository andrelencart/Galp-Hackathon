from database_handlers.models import Profile, RunningLogs, Guest, ProfileGoogle
from database_handlers.db import SessionLocal
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask import jsonify
from database_handlers.countries import COUNTRIES_AND_DISTRICTS

bcrypt = Bcrypt()

def is_galp_email(email):
    galp_domains = ('@galp.com', '@galp.pt', '@mycompany.galp.com')
    return email.lower().endswith('@galp.com')

def register_user(data):
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    district = data.get('district')
    council = data.get('council')
    country = data.get('country') or "Portugal"
    google_id = data.get('google_id')

    is_google_signup = bool(google_id)

    # Require name, email (always), password only if not Google
    if not all([name, email]) or (not is_google_signup and not password):
        return {"message": "All fields are required: name, email" + (", password" if not is_google_signup else "") + "."}, 400

    session = SessionLocal()
    try:
        # Check ProfileGoogle for Google users, Profile for classic users
        if is_google_signup:
            existing = session.query(ProfileGoogle).filter_by(email=email).first()
        else:
            existing = session.query(Profile).filter_by(email=email).first()

        if existing:
            return {"message": "Email already registered."}, 400

        # Only require district/council for Portugal
        if country == "Portugal":
            if not (district and council):
                return {"message": "All fields are required: name, email" + (", password" if not is_google_signup else "") + ", district, council."}, 400
            if district not in COUNTRIES_AND_DISTRICTS[country]:
                return {"message": f"Invalid district. Supported districts for {country}: {', '.join(COUNTRIES_AND_DISTRICTS[country].keys())}"}, 400
            if council not in COUNTRIES_AND_DISTRICTS[country][district]:
                return {"message": f"Invalid council for district {district}. Supported councils: {', '.join(COUNTRIES_AND_DISTRICTS[country][district])}"}, 400

        if is_google_signup:
            profile = ProfileGoogle(
                name=name,
                email=email,
                google_id=google_id,
                country=country,
                district=district if country == "Portugal" else None,
                council=council if country == "Portugal" else None
            )
        else:
            hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
            profile = Profile(
                name=name,
                email=email,
                password=hashed_pw,
                country=country,
                district=district if country == "Portugal" else None,
                council=council if country == "Portugal" else None
            )

        session.add(profile)
        session.commit()
        return {"message": "Registration successful!"}, 201

    finally:
        session.close()

def add_run_entry(data):
    email = data.get("run_email") or data.get("email")
    name = data.get("name")
    run_date = data.get("date")
    distance = data.get("distance_km")
    steps = data.get("steps")
    country = data.get("country")
    district = data.get("district")
    council = data.get("council")
    group_type = data.get("group_type")
    activity = data.get("activity")
    session = SessionLocal()
    try:
        profile = session.query(Profile).filter_by(email=email).first() if email else None

        if not distance and steps:
            distance = round(int(steps) / 1312, 2)

        if profile:
            # Save only run info, link to profile
            run_log = RunningLogs(
                profile_id=profile.id,
                date=datetime.strptime(run_date, "%Y-%m-%d").date(),
                submitted_at=datetime.now(),
                km=distance
            )
            session.add(run_log)
        else:
            # Check or create guest
            guest = session.query(Guest).filter_by(email=email).first()
            if not guest:
                print("Creating Guest with:", name, email, country, district, council, group_type, activity)
                guest = Guest(
                    name=name,
                    email=email,
                    country=country,
                    district=district,
                    council=council,
                    group_type=group_type,
                    activity=activity,
                )
                session.add(guest)
                session.flush()  # get guest.id
            # Save run info, link to guest
            run_log = RunningLogs(
                guest_id=guest.id,
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