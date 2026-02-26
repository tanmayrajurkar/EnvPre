from fastapi import APIRouter, HTTPException
from app.ml.inference import ml_service

router = APIRouter()

@router.get("/predict")
async def get_predictions(past_aqi_1: float, past_aqi_2: float, temp: float, precip: float):
    """Get ML predictions for AQI and Rainfall probability."""
    try:
        result = ml_service.predict_future(past_aqi_1, past_aqi_2, temp, precip)
        if "error" in result:
            raise HTTPException(status_code=503, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
