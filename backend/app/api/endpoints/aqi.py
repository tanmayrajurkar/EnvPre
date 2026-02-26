from fastapi import APIRouter, HTTPException
from app.services.openaq_client import air_quality_client

router = APIRouter()

@router.get("/latest")
async def get_latest_aqi(lat: float, lon: float):
    """Fetch latest real air quality data from Open-Meteo for a given lat/lon."""
    try:
        data = await air_quality_client.get_latest(lat, lon)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forecast")
async def get_aqi_forecast(lat: float, lon: float):
    """Fetch 7-day daily max AQI forecast from Open-Meteo."""
    try:
        data = await air_quality_client.get_7day_aqi_forecast(lat, lon)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
