
from flask import Flask, request, jsonify, session, redirect, url_for, flash, render_template, send_from_directory
from database_handlers.user import register_user, add_run_entry, signup_api
from google_auth import log_check, google_login, google_handle_callback
from img_to_text import image_to_text_bp
from flask_cors import CORS
from database_handlers.models import Profile, RunningLogs
# from database_handlers.db import SessionLocal
from database_handlers.db import db
from dotenv import load_dotenv
import logging
import os


load_dotenv() 

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("SECRET_KEY", "dev") 
logging.basicConfig(level=logging.INFO)

app.config["IMAGE_SAVE_PATH"] = "/data/images"

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

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    result, status = signup_api(data)
    result["redirect_url"] = "http://localhost:3000/profile"
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
    result, status = add_run_entry(data)
    return jsonify(result), status

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")