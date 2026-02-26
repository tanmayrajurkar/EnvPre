from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.openaq_client import openaq_client
from app.models.base import AirQuality, Location
import datetime

router = APIRouter()

@router.get("/latest")
async def get_latest_aqi(city: str, db: Session = Depends(get_db)):
    """Fetch latest AQI data from API and store/return it."""
    try:
        data = await openaq_client.get_latest_measurements(city=city, limit=20)
        
        # In a real app, we'd process and save to DB here. For now, just return.
        return {"city": city, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_aqi_history(city: str, db: Session = Depends(get_db)):
    """Fetch historical AQI from our own DB."""
    loc = db.query(Location).filter(Location.city == city).first()
    if not loc:
        raise HTTPException(status_code=404, detail="City not found in our database.")
    
    history = db.query(AirQuality).filter(AirQuality.location_id == loc.id).order_by(AirQuality.timestamp.desc()).limit(100).all()
    return {"city": city, "history": history}
