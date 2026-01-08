from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.doctor import Doctor
from app.schemas import DoctorLogin, DoctorRegister

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register")
def register_doctor(data: DoctorRegister, db: Session = Depends(get_db)):
    # check if email already exists
    existing = db.query(Doctor).filter(Doctor.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    doctor = Doctor(
        name=data.name,
        email=data.email,
        password=data.password,   # later we will hash
        hospital=data.hospital,
        specialization=data.specialization,
        qualification=data.qualification,
        experience_years=data.experience_years,
        clinic_address=data.clinic_address,
        city=data.city,
        clinic_phone=data.clinic_phone,
    )

    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return {
        "id": doctor.id,
        "name": doctor.name,
        "email": doctor.email
    }


@router.post("/login")
def login_doctor(data: DoctorLogin, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == data.email).first()

    if not doctor or doctor.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "id": doctor.id,
        "name": doctor.name,
        "email": doctor.email
    }
