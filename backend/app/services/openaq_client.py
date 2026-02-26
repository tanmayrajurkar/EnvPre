import httpx
from datetime import datetime
from typing import List, Dict, Any
from app.core.config import settings

class OpenAQClient:
    def __init__(self):
        self.base_url = "https://api.openaq.org/v2"
        self.headers = {}
        if settings.OPENAQ_API_KEY:
            self.headers["X-API-Key"] = settings.OPENAQ_API_KEY

    async def get_latest_measurements(self, city: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch latest air quality measurements for a given city."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/measurements",
                params={"city": city, "limit": limit, "order_by": "datetime", "sort": "desc"},
                headers=self.headers,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json().get("results", [])

    async def get_locations(self, city: str) -> List[Dict[str, Any]]:
        """Fetch station locations for a given city."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/locations",
                params={"city": city, "limit": 10},
                headers=self.headers,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json().get("results", [])

openaq_client = OpenAQClient()
