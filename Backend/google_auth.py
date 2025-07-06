# import os
# import pathlib
# from flask import session, abort, redirect, request, url_for
# from google.oauth2 import id_token
# from google_auth_oauthlib.flow import Flow
# import google.auth.transport.requests

# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
# GOOGLE_CLIENT_ID = "582976854264-7ofqk8mngef34ndt2qc6tvvu71t97r00.apps.googleusercontent.com"
# GOOGLE_CLIENT_SECRET = "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"
# client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

# def log_check(function):
#     def wrapper(*args, **kwargs):
#         if "google_id" not in session:
#             return abort(401)
#         return function(*args, **kwargs)
#     wrapper.__name__ = function.__name__
#     return wrapper

# def get_login_flow():
#     return Flow.from_client_secrets_file(
#         client_secrets_file=client_secrets_file,
#         scopes=[
#             "https://www.googleapis.com/auth/userinfo.profile",
#             "https://www.googleapis.com/auth/userinfo.email",
#             "openid"
#         ],
#         redirect_uri=url_for("callback", _external=True),
#     )

# def login():
#     flow = get_login_flow()
#     authorization_url, state = flow.authorization_url()
#     session["state"] = state
#     return redirect(authorization_url)

# def handle_callback():
#     state = session["state"]
#     flow = Flow.from_client_secrets_file(
#         client_secrets_file=client_secrets_file,
#         scopes=[
#             "https://www.googleapis.com/auth/userinfo.profile",
#             "https://www.googleapis.com/auth/userinfo.email",
#             "openid"
#         ],
#         state=state,
#         redirect_uri=url_for("callback", _external=True),
#     )
#     flow.fetch_token(authorization_response=request.url)
#     credentials = flow.credentials
#     request_session = google.auth.transport.requests.Request()
#     id_info = id_token.verify_oauth2_token(
#         credentials._id_token,
#         request_session,
#         GOOGLE_CLIENT_ID
#     )
#     session["google_id"] = id_info.get("sub")
#     session["name"] = id_info.get("name")
#     session["email"] = id_info.get("email")
#     return redirect("/protected_area")

# import os
# import pathlib
# from google.oauth2 import id_token
# from google_auth_oauthlib.flow import Flow
# import google.auth.transport.requests

# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
# GOOGLE_CLIENT_ID = "582976854264-7ofqk8mngef34ndt2qc6tvvu71t97r00.apps.googleusercontent.com"
# client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

# def get_login_flow(redirect_url):
#     return Flow.from_client_secrets_file(
#         client_secrets_file=client_secrets_file,
#         scopes=[
#             "https://www.googleapis.com/auth/userinfo.profile",
#             "https://www.googleapis.com/auth/userinfo.email",
#             "openid"
#         ],
#         redirect_uri=redirect_url,
#     )

# def handle_google_callback(request, session, redirect_url):
#     state = session["state"]
#     flow = Flow.from_client_secrets_file(
#         client_secrets_file=client_secrets_file,
#         scopes=[
#             "https://www.googleapis.com/auth/userinfo.profile",
#             "https://www.googleapis.com/auth/userinfo.email",
#             "openid"
#         ],
#         state=state,
#         redirect_uri=redirect_url,
#     )
#     flow.fetch_token(authorization_response=request.url)
#     credentials = flow.credentials
#     request_session = google.auth.transport.requests.Request()
#     id_info = id_token.verify_oauth2_token(
#         credentials._id_token,
#         request_session,
#         GOOGLE_CLIENT_ID
#     )
#     return {
#         "google_id": id_info.get("sub"),
#         "name": id_info.get("name"),
#         "email": id_info.get("email"),
#     }

import os
import pathlib
from flask import session, abort, redirect, request, url_for
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
from database_handlers.models import Profile, RunningLogs, ProfileGoogle
from database_handlers.db import SessionLocal
from datetime import datetime
from database_handlers.countries import COUNTRIES_AND_DISTRICTS

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
GOOGLE_CLIENT_ID = "582976854264-sr8aoakotajjojbo6ao05iiem0bq6n76.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

def log_check(function):
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)
        return function(*args, **kwargs)
    wrapper._name_ = function._name_
    return wrapper

def google_get_login_flow():
    return Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"
        ],
        redirect_uri=url_for("callback", _external=True),
    )

def google_login():
    flow = google_get_login_flow()
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

def google_handle_callback():
    state = session["state"]
    flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"
        ],
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
    email = id_info.get("email")
    db_session = SessionLocal()
    try:
        user = db_session.query(ProfileGoogle).filter_by(email=email).first()
        if not user:
            return redirect(f"http://localhost:3000/register?name={id_info.get('name')}&email={id_info.get('email')}&google_id={id_info.get('sub')}")
        else:
            return redirect("http://localhost:3000/profile")
    finally:
        db_session.close()