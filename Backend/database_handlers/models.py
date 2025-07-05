from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    DECIMAL,
    ForeignKey,
    UniqueConstraint,
    SmallInteger
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Guest(Base):
    __tablename__ = 'Guest'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=False, unique=True)
    group_type = Column(String(32), nullable=True)
    district = Column(String(255), nullable=True)
    council = Column(String(255), nullable=True)
    activity = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)

    # Relationship to Running_logs
    running_logs = relationship("RunningLogs", back_populates="guest")

class Profile(Base):
    __tablename__ = 'Profile'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    group_type = Column(String(32), nullable=True)
    district = Column(String(255), nullable=True)
    council = Column(String(255), nullable=True)
    activity = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)

    # Relationship to Running_logs
    running_logs = relationship("RunningLogs", back_populates="profile")

class RunningLogs(Base):
    __tablename__ = 'Running_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey('Profile.id'), nullable=True)
    guest_id = Column(Integer, ForeignKey('Guest.id'), nullable=True)
    date = Column(Date, nullable=False)
    submitted_at = Column(DateTime, nullable=False)
    km = Column(DECIMAL(6, 3), nullable=True)
    people_count = Column(Integer, nullable=True)
    valid = Column(SmallInteger, nullable=True)  # 0 or 1
    URL_proof = Column(String(512), nullable=True)

    profile = relationship("Profile", back_populates="running_logs")
    guest = relationship("Guest", back_populates="running_logs")