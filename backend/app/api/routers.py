from fastapi import APIRouter
from app.api.endpoints import aqi, weather, climate, predictions

api_router = APIRouter()
api_router.include_router(aqi.router, prefix="/aqi", tags=["Air Quality"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather and Rainfall"])
api_router.include_router(climate.router, prefix="/climate", tags=["Climate Trends"])
api_router.include_router(predictions.router, prefix="/ml", tags=["Predictive Analytics"])
