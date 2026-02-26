import uuid
from sqlalchemy import Column, String, Float, DateTime, Integer, ForeignKey
from app.core.database import Base

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    city = Column(String, index=True)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

class AirQuality(Base):
    __tablename__ = "air_quality"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String, ForeignKey("locations.id"))
    timestamp = Column(DateTime, index=True)
    aqi = Column(Float)
    pm25 = Column(Float)
    pm10 = Column(Float)
    no2 = Column(Float)
    so2 = Column(Float)
    o3 = Column(Float)

class WeatherRainfall(Base):
    __tablename__ = "weather_rainfall"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String, ForeignKey("locations.id"))
    timestamp = Column(DateTime, index=True)
    precipitation = Column(Float)
    temperature_2m = Column(Float)

class ClimateMetrics(Base):
    __tablename__ = "climate_metrics"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    year = Column(Integer)
    month = Column(Integer)
    global_temp_anomaly = Column(Float)
    co2_ppm = Column(Float)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String, ForeignKey("locations.id"))
    target_date = Column(DateTime)
    predicted_aqi = Column(Float)
    predicted_rain_prob = Column(Float)
    created_at = Column(DateTime)
