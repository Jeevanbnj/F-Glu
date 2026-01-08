from pydantic import BaseModel
from datetime import datetime


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    diagnosis: str
    doctor_id: int


class PatientResponse(BaseModel):
    id: int
    name: str
    age: int
    gender: str
    diagnosis: str
    doctor_id: int
    created_at: datetime

    class Config:
        from_attributes = True
