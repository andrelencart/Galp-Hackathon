# import imghdr
# from flask import current_app

# def validate_photo(filepath):
    
#     filetype = imghdr.what(filepath)
#     if filetype not in ("jpeg", "png"):
#         return False, "Only JPEG, PNG, and GIF allowed"
  
#     max_size = 5 * 1024 * 1024  # 5MB
#     try:
#         if os.path.getsize(filepath) > max_size:
#             return False, "File too large"
#     except Exception as e:
#         return False, f"Error: {str(e)}"
#     return True, "OK"