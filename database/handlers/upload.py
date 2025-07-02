from google.cloud import storage
import uuid
from werkzeug.utils import secure_filename

def upload_file_to_gcs(file, bucket_name):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
    blob = bucket.blob(filename)
    blob.upload_from_file(file, content_type=file.content_type)
    blob.make_public()
    return blob.public_url