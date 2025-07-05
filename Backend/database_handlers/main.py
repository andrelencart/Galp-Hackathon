

# from flask import Flask, request, jsonify, session, redirect, url_for, flash, render_template
# from database_handlers.user import register_user, add_run_entry, signup_api
# from google_auth import get_login_flow, handle_google_callback, test
# from img_to_text import image_to_text_bp
# from flask_cors import CORS

# import os
# import pathlib
# from google.oauth2 import id_token
# from google_auth_oauthlib.flow import Flow
# import google.auth.transport.requests

# from database_handlers.models import Profile, RunningLogs
# from database_handlers.db import SessionLocal

# import logging

# app = Flask(__name__)
# CORS(app)
# app.secret_key = "your_very_secret_key_here"
# logging.basicConfig(level=logging.INFO)

# app.config["IMAGE_SAVE_PATH"] = "/data/images"

# app.register_blueprint(image_to_text_bp)

# @app.route("/images/<filename>")
# def get_image(filename):
#     return send_from_directory(app.config["IMAGE_SAVE_PATH"], filename)

# @app.route("/google/login")
# def google_login():
#     logging.info("Redirect URI: %s", url_for("google_callback", _external=True))
#     flow = get_login_flow(url_for("google_callback", _external=True))
#     authorization_url, state = flow.authorization_url()
#     session["state"] = state
#     return redirect(authorization_url)

# @app.route("/google/callback")
# def google_callback():
#     try:
#         user_data = handle_google_callback(request, session, url_for("google_callback", _external=True))
#         # Check if user exists in DB
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
#         return redirect("/protected_area")
#     except Exception as e:
#         flash("Google sign-in failed, please register with email.")
#         return redirect(url_for("register"))

# @app.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     result, status = signup_api(data)
#     return jsonify(result), status

# @app.route("/register", methods=["POST"])
# def register():
#     data = request.json
#     result, status = register_user(data)
#     return jsonify(result), status

# @app.route("/add_run", methods=["POST"])
# def add_run():
#     data = request.json
#     result, status = add_run_entry(data)
#     return jsonify(result), status

# if __name__ == "__main__":
#     app.run(debug=True, port=5000, host="0.0.0.0")

from flask import Flask, request, jsonify, session, redirect, url_for, flash, render_template, send_from_directory
from database_handlers.user import register_user, add_run_entry, signup_api
from google_auth import get_login_flow, handle_google_callback
from img_to_text import image_to_text_bp
from flask_cors import CORS
from database_handlers.models import Profile, RunningLogs
from database_handlers.db import SessionLocal
import logging

app = Flask(__name__)
CORS(app)
app.secret_key = "your_very_secret_key_here"
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

@app.route("/google/login")
def google_login():
    logging.info("Redirect URI: %s", url_for("google_callback", _external=True))
    flow = get_login_flow(url_for("google_callback", _external=True))
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/google/callback")
def google_callback():
    db_session = SessionLocal()
    try:
        user_data = handle_google_callback(request, session, url_for("google_callback", _external=True))
        # Check if user exists in DB
        user = db_session.query(Profile).filter_by(email=user_data["email"]).first()
        if not user:
            user = Profile(
                name=user_data["name"],
                email=user_data["email"],
                google_id=user_data["google_id"]
            )
            db_session.add(user)
            db_session.commit()
        session["google_id"] = user_data["google_id"]
        session["name"] = user_data["name"]
        session["email"] = user_data["email"]
        return redirect("/protected_area")
    except Exception as e:
        flash("Google sign-in failed, please register with email.")
        return redirect(url_for("register"))
    finally:
        db_session.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    result, status = signup_api(data)
    return jsonify(result), status

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    result, status = register_user(data)
    return jsonify(result), status

@app.route("/add_run", methods=["POST"])
def add_run():
    data = request.json
    result, status = add_run_entry(data)
    return jsonify(result), status

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")