# import os
# import uuid
# from flask import Blueprint, request, jsonify
# from werkzeug.utils import secure_filename
# from .proof import validate_photo

# upload_bp = Blueprint('upload', __name__)
# UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", os.path.join(os.getcwd(), "uploads"))

# @upload_bp.route("/upload", methods=["POST"])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({"success": False, "error": "No file part"}), 400
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"success": False, "error": "No selected file"}), 400
    
#     filename = secure_filename(file.filename)
#     unique_filename = f"{uuid.uuid4().hex}_{filename}"
#     filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
#     os.makedirs(UPLOAD_FOLDER, exist_ok=True)
#     file.save(filepath)
    
#     is_valid, msg = validate_photo(filepath)
#     if not is_valid:
#         os.remove(filepath)
#         return jsonify({"success": False, "error": msg}), 400

#     # Optionally: Save metadata to DB here
    # return jsonify({"success": True, "filename": unique_filename}), 200