from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Doctor
from app.schemas import DoctorLogin, DoctorRegister

router = APIRouter(prefix="/api/auth", tags=["Auth"])


# ===================== LOGIN =====================
@router.post("/login")
def login_doctor(data: DoctorLogin, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == data.email).first()

    if not doctor or doctor.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "doctor_id": doctor.id,
        "name": doctor.name,
        "email": doctor.email
    }


# ===================== REGISTER =====================
@router.post("/register")
def register_doctor(data: DoctorRegister, db: Session = Depends(get_db)):

    # 1️⃣ Check if email already exists
    existing = db.query(Doctor).filter(Doctor.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2️⃣ Create doctor record
    doctor = Doctor(
        name=data.name,
        email=data.email,
        password=data.password,  # ⚠️ plain text for now (hash later)
        hospital=data.hospital,
        specialization=data.specialization,
        qualification=data.qualification,
        experience_years=data.experience_years,
        clinic_address=data.clinic_address,
        city=data.city,
        clinic_phone=data.clinic_phone
    )

    # 3️⃣ Save to DB
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    # 4️⃣ Return response
    return {
        "message": "Registration successful",
        "doctor_id": doctor.id,
        "name": doctor.name,
        "email": doctor.email
    }
