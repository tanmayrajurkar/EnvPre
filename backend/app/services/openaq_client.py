import httpx
from typing import Dict, Any


class AirQualityClient:
    """
    Client for Open-Meteo Air Quality API.
    Free, no API key required.
    Provides PM2.5, PM10, AQI (US), NO2, SO2, Ozone data.
    """
    def __init__(self):
        self.base_url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    async def get_latest(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch the latest (today's hourly) air quality data for a given location."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.base_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "hourly": "pm2_5,pm10,us_aqi,nitrogen_dioxide,sulphur_dioxide,ozone",
                    "timezone": "auto",
                    "forecast_days": 1,
                },
                timeout=15.0,
            )
            response.raise_for_status()
            data = response.json()

        hourly = data.get("hourly", {})
        times = hourly.get("time", [])
        pm25 = hourly.get("pm2_5", [])
        pm10 = hourly.get("pm10", [])
        aqi = hourly.get("us_aqi", [])
        no2 = hourly.get("nitrogen_dioxide", [])
        so2 = hourly.get("sulphur_dioxide", [])
        o3 = hourly.get("ozone", [])

        # Build a list of hourly records, filtering out None values
        hourly_records = []
        for i, t in enumerate(times):
            hourly_records.append({
                "time": t,
                "aqi": aqi[i] if i < len(aqi) else None,
                "pm25": pm25[i] if i < len(pm25) else None,
                "pm10": pm10[i] if i < len(pm10) else None,
                "no2": no2[i] if i < len(no2) else None,
                "so2": so2[i] if i < len(so2) else None,
                "ozone": o3[i] if i < len(o3) else None,
            })

        # Compute "current" as the last non-None AQI value
        current_aqi = next((r["aqi"] for r in reversed(hourly_records) if r["aqi"] is not None), None)
        current_pm25 = next((r["pm25"] for r in reversed(hourly_records) if r["pm25"] is not None), None)
        current_pm10 = next((r["pm10"] for r in reversed(hourly_records) if r["pm10"] is not None), None)

        # Determine dominant pollutant
        pollutants = {
            "PM2.5": current_pm25 or 0,
            "PM10": current_pm10 or 0,
        }
        dominant = max(pollutants, key=pollutants.get) if any(pollutants.values()) else "Unknown"

        return {
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "timezone": data.get("timezone"),
            "current_aqi": current_aqi,
            "current_pm25": current_pm25,
            "current_pm10": current_pm10,
            "dominant_pollutant": dominant,
            "hourly": hourly_records,
        }

    async def get_7day_aqi_forecast(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch 7-day daily max AQI forecast."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.base_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "hourly": "us_aqi,pm2_5",
                    "timezone": "auto",
                    "forecast_days": 7,
                },
                timeout=15.0,
            )
            response.raise_for_status()
            data = response.json()

        hourly = data.get("hourly", {})
        times = hourly.get("time", [])
        aqi_values = hourly.get("us_aqi", [])
        pm25_values = hourly.get("pm2_5", [])

        # Group by date, get daily max
        daily: Dict[str, list] = {}
        for i, t in enumerate(times):
            date = t[:10]  # YYYY-MM-DD
            if date not in daily:
                daily[date] = {"aqi": [], "pm25": []}
            if i < len(aqi_values) and aqi_values[i] is not None:
                daily[date]["aqi"].append(aqi_values[i])
            if i < len(pm25_values) and pm25_values[i] is not None:
                daily[date]["pm25"].append(pm25_values[i])

        forecast = []
        for date, vals in daily.items():
            forecast.append({
                "date": date,
                "max_aqi": max(vals["aqi"]) if vals["aqi"] else None,
                "avg_pm25": round(sum(vals["pm25"]) / len(vals["pm25"]), 2) if vals["pm25"] else None,
            })

        return {"latitude": data.get("latitude"), "longitude": data.get("longitude"), "forecast": forecast}


air_quality_client = AirQualityClient()
