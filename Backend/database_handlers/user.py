
import mysql.connector

def register_user(form):
    name = form["name"]
    email = form["email"]
    country = form["country"]
    district = form["district"]
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(
            host="db",
            user="root",
            password="Root123@",
            database="User_db"
        )
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Profile (name, email, group_type, location, activity, city, password) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (name, email, location, city)
        )
        conn.commit()
        return "Registration successful!"
    except mysql.connector.errors.IntegrityError:
        return "Email already registered."
    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()

def add_run_entry(form):
    email = form["run_email"]
    run_date = form["date"]
    distance = form["distance_km"]
    conn = mysql.connector.connect(
        host="db",
        user="root",
        password="Root123@",
        database="User_db"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM Profile WHERE email=%s", (email,))
    result = cursor.fetchone()
    if result:
        profile_id = result[0]
        cursor.execute(
            "INSERT INTO Running_logs (profile_id, date, distance_km) VALUES (%s, %s, %s)",
            (profile_id, run_date, distance)
        )
        conn.commit()
        message = "Run added!"
    else:
        message = "Profile not found. Please register first."
    cursor.close()
    conn.close()
    return message