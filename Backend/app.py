from flask import Flask, session, redirect, Blueprint, request, jsonify
from google_auth import log_check, login, handle_callback
from auth import auth_bp, bcrypt, mysql
from img_to_text import image_to_text_bp
from captcha import verify_recaptcha

app = Flask("DevAndar")
app.secret_key = "olasuperseguro"
app.config["RECAPTCHA_SECRET_KEY"] = "YOUR_SECRET_KEY"
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Roo123@'
app.config['MYSQL_DB'] = 'testing'

app.register_blueprint(auth_bp)
app.register_blueprint(image_to_text_bp)
bcrypt.init_app(app)
mysql.init_app(app)

@app.route("/")
def home():
    # data = request.json
    # recaptcha_token = data.get('recaptchaToken')
    # if not recaptcha_token or not verify_recaptcha(recaptcha_token):
    #     return jsonify({'error': 'Invalid CAPTCHA'}), 400
    return '''
        <button onclick="location.href='/auth/login'">Login</button>
        <button onclick="location.href='/auth/signup'">Sign Up</button>
        <button onclick="location.href='google_login'">Login with Google</button>
    '''

@app.route("/google_login")
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
    app.run(host="0.0.0.0", port=80, debug=True)