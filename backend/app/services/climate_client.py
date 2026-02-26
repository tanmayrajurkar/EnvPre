import httpx
from typing import Dict, Any


class ClimateClient:
    """
    Client for Open-Meteo Climate Change API.
    Free, no API key. Provides regional temperature simulations from multiple models.
    Uses a simpler single-model approach (EC_Earth3P_HR) for reliability.
    """
    def __init__(self):
        self.base_url = "https://climate-api.open-meteo.com/v1/climate"

    async def get_regional_climate_trend(self, lat: float, lon: float, start_year: int, end_year: int) -> Dict[str, Any]:
        """Fetch regional simulated daily mean temperature statistics."""
        # Clamp end_year to 2050 (API limit)
        end_year = min(end_year, 2050)
        # Clamp start_year to 1950 (API limit)
        start_year = max(start_year, 1950)

        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.base_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "start_date": f"{start_year}-01-01",
                    "end_date": f"{end_year}-12-31",
                    "models": "EC_Earth3P_HR",
                    "daily": "temperature_2m_mean",
                },
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()


climate_client = ClimateClient()
