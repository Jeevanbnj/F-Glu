from pydantic import BaseModel, EmailStr


class DoctorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    qualification: str | None = None
    specialization: str | None = None
    experience_years: int | None = 0
    hospital: str | None = None
    clinic_address: str | None = None
    city: str | None = None
    clinic_phone: str | None = None


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str
