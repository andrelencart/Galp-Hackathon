import os
import pathlib

import requests
from flask import Flask, session, abort, redirect, request
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
from flask import url_for


app = Flask("DevAndar")
app.secret_key = "olasuperseguro"

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
GOOGLE_CLIENT_ID = "582976854264-7ofqk8mngef34ndt2qc6tvvu71t97r00.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
GOOGLE_REDIRECT_URI="http://127.0.0.1:80/callback"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

def log_check(function):
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)
        else:
            return function()
    wrapper.__name__ = function.__name__
    return wrapper

@app.route("/")
def index():
    return "<a href='/login'><button>Login with Google</button></a>"

@app.route("/login")
def login():
    flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri=url_for("callback", _external=True),
    )
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/callback")
def callback():
    state = session["state"]
    flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
        state=state,
        redirect_uri=url_for("callback", _external=True),
    )
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    request_session = google.auth.transport.requests.Request()
    id_info = id_token.verify_oauth2_token(
        credentials._id_token,
        request_session,
        GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")        # user's unique Google ID
    session["name"] = id_info.get("name")            # user's display name
    session["email"] = id_info.get("email")          # user's email

    return redirect("/protected_area")

@app.route("/protected_area")
@log_check
def protected_area():
    return f"""
    <h1>Welcome {session['name']}!</h1>
    <p>Email: {session['email']}</p>
    <a href='/logout'><button>Logout</button></a>
    """

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=80, debug=True)