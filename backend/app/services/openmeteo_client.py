import httpx
from typing import Dict, Any

class OpenMeteoClient:
    def __init__(self):
        self.base_url = "https://archive-api.open-meteo.com/v1/archive"
        self.forecast_url = "https://api.open-meteo.com/v1/forecast"

    async def get_historical_weather(self, lat: float, lon: float, start_date: str, end_date: str) -> Dict[str, Any]:
        """Fetch historical weather data (precipitation, temperature)."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.base_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "start_date": start_date,
                    "end_date": end_date,
                    "daily": "precipitation_sum,temperature_2m_mean",
                    "timezone": "auto"
                },
                timeout=15.0
            )
            response.raise_for_status()
            return response.json()

    async def get_forecast(self, lat: float, lon: float, days: int = 7) -> Dict[str, Any]:
        """Fetch weather forecast for rainfall probability."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.forecast_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "daily": "precipitation_probability_max,precipitation_sum",
                    "timezone": "auto",
                    "forecast_days": days
                },
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()

openmeteo_client = OpenMeteoClient()
