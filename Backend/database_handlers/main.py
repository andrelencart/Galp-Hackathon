
from flask import Flask, request, jsonify, session, redirect, url_for, flash, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import logging
import os

from database_handlers.user import register_user, add_run_entry, signup_api
from google_auth import log_check, google_login, google_handle_callback
from img_to_text import image_to_text_bp
from database_handlers.models import Profile, RunningLogs, Guest
from database_handlers.db import db
from datetime import datetime


load_dotenv() 

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("SECRET_KEY", "dev") 
logging.basicConfig(level=logging.INFO)

app.config["IMAGE_SAVE_PATH"] = "/data/images"
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
db.init_app(app)

app.register_blueprint(image_to_text_bp)

# @app.route("/test")
# def test():
#     logging.info("TEST HIT")
#     return "Test route hit"

@app.route("/images/<filename>")
def get_image(filename):
    return send_from_directory(app.config["IMAGE_SAVE_PATH"], filename)

# @app.route("/google/login")
# def google_login():
#     flow = get_login_flow(url_for("google_callback", _external=True))
#     authorization_url, state = flow.authorization_url()
#     session["state"] = state
#     return redirect(authorization_url)

@app.route("/protected_area")
def protected_area():
    return f"""
    <h1>Welcome!</h1>
    <p>Email:</p>
    <a href='/logout'><button>Logout</button></a>
    """

@app.route("/")
def home():
    return '''
        <button onclick="location.href='/auth/login'">Login</button>
        <button onclick="location.href='/auth/signup'">Sign Up</button>
        <button onclick="location.href='/google/login'">Login with Google</button>
    '''

@app.route("/google/login")
def login_route():
    return google_login()

@app.route("/google/callback")
def callback():
    return google_handle_callback()

# @app.route("/google/callback")
# def google_callback():
#     db_session = SessionLocal()
#     try:
#         user_data = handle_google_callback(request, session, url_for("google_callback", _external=True))
#         user = db_session.query(Profile).filter_by(email=user_data["email"]).first()
#         if not user:
#             user = Profile(
#                 name=user_data["name"],
#                 email=user_data["email"],
#                 google_id=user_data["google_id"]
#             )
#             db_session.add(user)
#             db_session.commit()
#         session["google_id"] = user_data["google_id"]
#         session["name"] = user_data["name"]
#         session["email"] = user_data["email"]
#         return redirect("http://localhost:3000/register")
#     except Exception as e:
#         flash("Google sign-in failed, please register with email.")
#         return redirect(url_for("register"))
#     finally:
#         db_session.close()

@app.route("/api/get_user_by_email")
def get_user_by_email():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Missing email"}), 400
    user = db.session.query(Profile).filter_by(email=email).first()
    if user:
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            # Add other fields as you wish
        })
    else:
        return jsonify(None), 200  # frontend expects null if not found

@app.route("/api/get_guest_by_email")
def get_guest_by_email():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Missing email"}), 400
    guest = db.session.query(Guest).filter_by(email=email).first()
    if guest:
        return jsonify({
            "id": guest.id,
            "name": guest.name,
            "email": guest.email,
            "group_type": guest.group_type,
            "district": guest.district,
            "council": guest.council,
            "activity": guest.activity,
            "country": guest.country,
        })
    else:
        return jsonify(None), 200 

@app.route("/api/create_guest", methods=["POST"])
def create_guest():
    try:
        data = request.json
        # Validate required fields!
        if not data.get("email"):
            return jsonify({"error": "Missing email"}), 400
        if not data.get("name"):
            return jsonify({"error": "Missing name"}), 400

        # Check for existing guest
        guest = db.session.query(Guest).filter_by(email=data["email"]).first()
        if guest:
            return jsonify({
                "id": guest.id, 
                "email": guest.email, 
                "name": guest.name
            }), 200

        # Create new guest
        guest = Guest(
            name=data.get("name"),
            email=data.get("email"),
            district=data.get("district"),
            council=data.get("council"),
            country=data.get("country", "Portugal"),  # default to Portugal
        )
        
        db.session.add(guest)
        db.session.commit()
        
        return jsonify({
            "id": guest.id, 
            "email": guest.email, 
            "name": guest.name
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating guest: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    result, status = signup_api(data)
    return jsonify(result), status

@app.route("/register", methods=["POST"])
def register():
    if request.method == "POST":
        data = request.get_json() or request.form
        result, status = register_user(data)
        return jsonify(result), status
    else:
        google_name = session.get("google_name")
        google_email = session.get("google_email")
        return render_template('register.html', name=google_name, email=google_email)

@app.route("/add_run", methods=["POST"])
def add_run():
    data = request.json
    valid = data.get("valid", 1)
    run_log = RunningLogs(
        profile_id=data.get("profile_id"),
        guest_id=data.get("guest_id", None),
        date=data.get("date"),  # Make sure date is in correct format (YYYY-MM-DD)
        submitted_at=datetime.utcnow(),
        km=data.get("distance_km"),
        # steps=data.get("steps"),
        people_count=data.get("people_count"),
        valid=valid,  # or set as needed
        URL_proof=data.get("image_url")  # Accept image_url from frontend
    )
    db.session.add(run_log)
    db.session.commit()
    # result, status = add_run_entry(data)
    return jsonify({"message": "Run added!"}), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")