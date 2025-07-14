FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libmariadb-dev \
    pkg-config \
    default-libmysqlclient-dev \
	tesseract-ocr \
    && apt-get clean

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install gunicorn flask flask-mysqldb

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

COPY . .

EXPOSE 5000

CMD ["wait-for-it", "db:3306", "--", "python", "app.py"]

{"web":{"client_id":"582976854264-sr8aoakotajjojbo6ao05iiem0bq6n76.apps.googleusercontent.com","project_id":"devandar-464616","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost:5000/google/callback","http://127.0.0.1:5000/google/callback","http://127.0.0.1:80/google/callback","http://localhost:80/google/callback"]}}

DB_USER=User
DB_HOST=db
DB_PASS=Root123@
DB_NAME=User_db
MYSQL_ROOT_PASSWORD=Root123@
MYSQL_DATABASE=User_db
SECRET_KEY=dev
SQLALCHEMY_DATABASE_URI=mysql+pymysql://User:Root123%40@db:3306/User_db