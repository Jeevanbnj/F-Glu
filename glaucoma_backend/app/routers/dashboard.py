from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.database import get_db
from app.models.patient import Patient

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

# ----------------------------------
# DASHBOARD SUMMARY
# ----------------------------------
@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    return {
        "total_patients": db.query(Patient).count(),
        "normal": db.query(Patient).filter(Patient.glaucoma_stage == "Normal").count(),
        "early": db.query(Patient).filter(Patient.glaucoma_stage == "Early").count(),
        "advanced": db.query(Patient).filter(Patient.glaucoma_stage == "Advanced").count(),
    }

# ----------------------------------
# PATIENTS OVER TIME
# ----------------------------------
@router.get("/patients-over-time")
def patients_over_time(db: Session = Depends(get_db)):
    results = (
        db.query(
            func.date(Patient.created_at).label("date"),
            func.count(Patient.id).label("count")
        )
        .group_by(func.date(Patient.created_at))
        .order_by(func.date(Patient.created_at))
        .all()
    )

    return [{"date": r.date.strftime("%b %d"), "count": r.count} for r in results]

# ----------------------------------
# AGE-WISE DISTRIBUTION ✅ NEW
# ----------------------------------
@router.get("/age-distribution")
def age_distribution(db: Session = Depends(get_db)):
    age_group = case(
        (Patient.age <= 20, "0-20"),
        (Patient.age <= 40, "21-40"),
        (Patient.age <= 60, "41-60"),
        else_="60+"
    )

    results = (
        db.query(
            age_group.label("age_group"),
            func.count(Patient.id).label("count")
        )
        .group_by(age_group)
        .all()
    )

    return [{"age_group": r.age_group, "count": r.count} for r in results]
