import httpx
from typing import Dict, Any

class ClimateClient:
    def __init__(self):
        # Using Open-Meteo's historical climate API as a proxy for global/regional anomalies
        self.base_url = "https://climate-api.open-meteo.com/v1/climate"
        
    async def get_regional_climate_trend(self, lat: float, lon: float, start_year: int, end_year: int) -> Dict[str, Any]:
        """Fetch regional simulated climate statistics."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.base_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "start_date": f"{start_year}-01-01",
                    "end_date": f"{end_year}-12-31",
                    "models": "CMCC_CM2_VHR4,FGOALS_f3_H,HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S",
                    "daily": "temperature_2m_mean",
                },
                timeout=15.0
            )
            response.raise_for_status()
            return response.json()

climate_client = ClimateClient()
