from flask import Blueprint, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

bcrypt = Bcrypt()
mysql = MySQL()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cur.fetchone()
    if existing_user:
        cur.close()
        return jsonify({'error': 'User already exists.'}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_pw))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'User registered successfully.'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    if user is None:
        return jsonify({'error': 'User not found.'}), 404

    user_id, user_email, user_password = user
    if bcrypt.check_password_hash(user_password, password):
        session['user_id'] = user_id
        return jsonify({'message': 'Login successful.'}), 200
    else:
        return jsonify({'error': 'Incorrect password.'}), 401