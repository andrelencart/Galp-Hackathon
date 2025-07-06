
import os
import uuid
import re
from flask import Blueprint, request, jsonify, current_app
import pytesseract
from PIL import Image

image_to_text_bp = Blueprint('image_to_text', __name__)

def extract_distance(text):
    km_matches = re.findall(r'([0-9]+(?:\.[0-9]+)?)\s*kms?\b', text, flags=re.IGNORECASE)
    if not km_matches:
        km_matches = re.findall(r'([0-9]+(?:\.[0-9]+)?)\s*km\b', text, flags=re.IGNORECASE)
    steps_matches = re.findall(r'([0-9]{3,})\s*steps?\b', text, flags=re.IGNORECASE)
    return km_matches, steps_matches

def steps_to_km(steps, conversion_factor=1312):
    try:
        return round(int(steps) / conversion_factor, 2)
    except Exception:
        return None

@image_to_text_bp.route('/api/image-to-text', methods=['POST'])
def image_to_text():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        file = request.files['image']
        img = Image.open(file.stream)
        text = pytesseract.image_to_string(img)
        km_matches, steps_matches = extract_distance(text)

        distance_km = None
        distance_type = None
        original_value = None

        if km_matches:
            distance_km = float(km_matches[0])
            distance_type = "km"
            original_value = str(km_matches[0])
        elif steps_matches:
            distance_km = steps_to_km(steps_matches[0])
            distance_type = "steps"
            original_value = str(steps_matches[0])
        else:
            return jsonify({'error': 'Neither km nor steps found'}), 400

        image_save_path = current_app.config.get("IMAGE_SAVE_PATH", "/data/images")
        os.makedirs(image_save_path, exist_ok=True)
        filename = f"{uuid.uuid4()}.png"
        file_path = os.path.join(image_save_path, filename)
        img.save(file_path)
        image_url = f"/images/{filename}"

        # --- DATABASE LOGIC ---
        # You must provide the profile_id or guest_id, e.g. from session or request.form!
        profile_id = request.form.get('profile_id', None)
        guest_id = request.form.get('guest_id', None)
        people_count = request.form.get('people_count', None)
        valid = request.form.get('valid', 1)  # Default to valid

        run_log = RunningLogs(
            profile_id=profile_id,
            guest_id=guest_id,
            date=date.today(),
            submitted_at=datetime.utcnow(),
            km=distance_km,
            people_count=people_count,
            valid=valid,
            URL_proof=image_url
        )
        db.session.add(run_log)
        db.session.commit()

        return jsonify({
            'distance': distance_km,
            'distance_type': distance_type,
            'original_value': original_value,
            'image_url': image_url
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500