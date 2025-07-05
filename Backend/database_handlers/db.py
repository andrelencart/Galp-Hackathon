import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

user = os.getenv("DB_USER", "root")
password = os.getenv("DB_PASS")
host = os.getenv("DB_HOST", "db")
database = os.getenv("DB_NAME")

password_encoded = quote_plus(password) 

DATABASE_URL = f"mysql+mysqlconnector://{user}:{password_encoded}@{host}/{database}"

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine)
