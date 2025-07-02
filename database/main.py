from flask import Flask, request, render_template_string
from flask_talisman import Talisman
from handlers.user import register_user, add_run_entry
from handlers.proof import proof_bp
from datetime import date

app = Flask(__name__)
Talisman(app)
app.register_blueprint(proof_bp)

@app.route("/", methods=["GET", "POST"])
def main():
    message = ""
    if request.method == "POST":
        if "register" in request.form:
            message = register_user(request.form)
        elif "add_run" in request.form:
            message = add_run_entry(request.form)
    form_html = """
    <h2>Register</h2>
    <form method="post">
      Name: <input name="name" required><br>
      Email: <input name="email" required><br>
      Country: <input name="country"><br>
      District: <input name="district"><br>
      <button type="submit" name="register">Register</button>
    </form>
    <hr>
    <h2>Add Run</h2>
    <form method="post">
      Email: <input name="run_email" required><br>
      Date (YYYY-MM-DD): <input name="date" value="{today}" required><br>
      Distance (km): <input name="distance_km" required><br>
      <button type="submit" name="add_run">Add Run</button>
    </form>
    <hr>
    <h2>Submit Proof</h2>
    <form method="post" action="/submit_proof" enctype="multipart/form-data">
      Run ID: <input name="run_id" required><br>
      Run Date (YYYY-MM-DD): <input name="run_date" required><br>
      Proof Photo: <input type="file" name="proof_photo" accept="image/*" required><br>
      <button type="submit">Submit Proof</button>
    </form>
    <p style="color:green;">{message}</p>
    """.format(today=date.today(), message=message)
    return render_template_string(form_html, today=date.today(), message=message)

if __name__ == "__main__":
    app.run(debug=True)