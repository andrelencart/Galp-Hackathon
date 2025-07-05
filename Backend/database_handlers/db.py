import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

user = "root"
password = os.getenv("MYSQL_ROOT_PASSWORD")
host = "db"
database = os.getenv("MYSQL_DATABASE")

DATABASE_URL = f"mysql+mysqlconnector://{user}:{password}@{host}/{database}"

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine)
