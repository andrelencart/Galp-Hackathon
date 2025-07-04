import requests
from flask import current_app

def verify_recaptcha(token):
    """
    Verifies Google reCAPTCHA token from the frontend.
    Args:
        token (str): The reCAPTCHA response token from the frontend.
    Returns:
        bool: True if verification is successful, False otherwise.
    """
    recaptcha_secret = current_app.config.get("RECAPTCHA_SECRET_KEY")
    payload = {
        'secret': recaptcha_secret,
        'response': token
    }
    r = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
    result = r.json()
    return result.get("success", False)