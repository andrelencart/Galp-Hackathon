from flask import Flask, session, redirect
from google_auth import log_check, login, handle_callback

app = Flask("DevAndar")
app.secret_key = "olasuperseguro"

@app.route("/")
def index():
    return "<a href='/login'><button>Login with Google</button></a>"

@app.route("/login")
def login_route():
    return login()

@app.route("/callback")
def callback():
    return handle_callback()

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