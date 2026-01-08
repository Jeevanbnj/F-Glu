from pydantic import BaseModel

class DoctorLogin(BaseModel):
    email: str
    password: str

from pydantic import BaseModel

class DoctorRegister(BaseModel):
    name: str
    email: str
    password: str
    hospital: str | None = None
    specialization: str | None = None
    qualification: str | None = None
    experience_years: int | None = 0
    clinic_address: str | None = None
    city: str | None = None
    clinic_phone: str | None = None

