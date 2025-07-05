# from flask import Flask, request, render_template_string, jsonify
# from user import register_user, add_run_entry, signup_api
# from datetime import date

# app = Flask(__name__)

# @app.route("/", methods=["GET", "POST"])
# def main():
#     message = ""
#     if request.method == "POST":
#         if "register" in request.form:
#             message = register_user(request.form)
#         elif "signin" in request.form:
#             # simulate JSON-style data
#             data = {
#                 "email": request.form.get("signin_email"),
#                 "password": request.form.get("signin_password")
#             }
#             result, status = signup_api(data)
#             message = result.get("message") if status == 200 else result.get("error")
#         elif "add_run" in request.form:
#             message = add_run_entry(request.form)

#     form_html = """
#     <h2>Register</h2>
#     <form method="post">
#       Name: <input name="name" required><br>
#       Email: <input name="email" required><br>
#       Password: <input type="password" name="password" required><br>
#       Country: <input name="country"><br>
#       District: <input name="district"><br>
#       <button type="submit" name="register">Register</button>
#     </form>
#     <hr>
#     <h2>Sign In</h2>
#     <form method="post">
#       Email: <input name="signin_email" required><br>
#       Password: <input type="password" name="signin_password" required><br>
#       <button type="submit" name="signin">Sign In</button>
#     </form>
#     <hr>
#     <h2>Add Run</h2>
#     <form method="post">
#       Email: <input name="run_email" required><br>
#       Date (YYYY-MM-DD): <input name="date" value="{today}" required><br>
#       Distance (km): <input name="distance_km" required><br>
#       <button type="submit" name="add_run">Add Run</button>
#     </form>
#     <hr>
#     <h2>Submit Proof</h2>
#     <form method="post" action="/submit_proof" enctype="multipart/form-data">
#       Run ID: <input name="run_id" required><br>
#       Run Date (YYYY-MM-DD): <input name="run_date" required><br>
#       Proof Photo: <input type="file" name="proof_photo" accept="image/*" required><br>
#       <button type="submit">Submit Proof</button>
#     </form>
#     <p style="color:green;">{message}</p>
#     """.format(today=date.today(), message=message)

#     return render_template_string(form_html, today=date.today(), message=message)

# if __name__ == "__main__":
#     app.run(debug=True, port=5000, host="0.0.0.0")

from flask import Flask, request, jsonify
from user import register_user, add_run_entry, signup_api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required."}), 400
    result, status = signup_api(data)
    # signup_api should return a tuple (dict, int)
    return jsonify(result), status

# Example: register endpoint (adapt as needed)
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    result, status = register_user(data)
    return jsonify(result), status

# Example: add run endpoint (adapt as needed)
@app.route("/add_run", methods=["POST"])
def add_run():
    data = request.json
    result, status = add_run_entry(data)
    return jsonify(result), status

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")