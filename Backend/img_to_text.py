from flask import Blueprint, request, jsonify
import pytesseract
from PIL import Image
import io
import re

image_to_text_bp = Blueprint('image_to_text', __name__)

@image_to_text_bp.route('/api/image-to-text', methods=['POST'])
def image_to_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    try:
        img = Image.open(file.stream)
        text = pytesseract.image_to_string(img)
        kms_lines = re.findall(r'([0-9]+(?:\.[0-9]+)?)\s*km?\b', text, flags=re.IGNORECASE)
        if(kms_lines):
            kms_text = "\n".join(kms_lines)
            return jsonify({'text': kms_text})
        else:
            kms_lines = re.findall(r'([0-9]+(?:\.[0-9]+)?)\s*kms?\b', text, flags=re.IGNORECASE)
            if(kms_lines):
                kms_text = "\n".join(kms_lines)
                return jsonify({'text': kms_text})
            else:
                return jsonify({'error, km not found': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500