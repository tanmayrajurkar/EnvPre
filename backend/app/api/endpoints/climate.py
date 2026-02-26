from fastapi import APIRouter, HTTPException
from app.services.climate_client import climate_client

router = APIRouter()

@router.get("/trends")
async def get_climate_trends(lat: float, lon: float, start_year: int, end_year: int):
    """Fetch climate trends proxy from Open-Meteo."""
    try:
        data = await climate_client.get_regional_climate_trend(lat, lon, start_year, end_year)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
