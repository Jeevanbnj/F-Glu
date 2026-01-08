from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)

    # ✅ Only stages your model supports
    glaucoma_stage = Column(String)  # Normal / Early / Advanced

    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
