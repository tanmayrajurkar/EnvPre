from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.openmeteo_client import openmeteo_client

router = APIRouter()

@router.get("/history")
async def get_weather_history(lat: float, lon: float, start_date: str, end_date: str):
    """Fetch weather history from Open-Meteo."""
    try:
        data = await openmeteo_client.get_historical_weather(lat, lon, start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forecast")
async def get_weather_forecast(lat: float, lon: float, days: int = 7):
    """Fetch rainfall forecast from Open-Meteo."""
    try:
        data = await openmeteo_client.get_forecast(lat, lon, days)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
