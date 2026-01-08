from sqlalchemy import Column, Integer, String
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    hospital = Column(String)
    specialization = Column(String)
    qualification = Column(String)
    experience_years = Column(Integer)
    clinic_address = Column(String)
    city = Column(String)
    clinic_phone = Column(String)

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    diagnosis = Column(String)  # Normal / Early / Advanced
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor_id = Column(Integer, ForeignKey("doctors.id"))
