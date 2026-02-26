from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.routers import api_router
from app.ml.train_models import train_and_save_models
import os


def ensure_ml_models():
    """Auto-train ML models if they don't exist yet."""
    model_dir = os.path.join(os.path.dirname(__file__), "ml")
    required = ["scaler.joblib", "aqi_model.joblib", "rain_model.joblib"]
    if not all(os.path.exists(os.path.join(model_dir, f)) for f in required):
        print("ML models not found — training now...")
        train_and_save_models()
        print("ML models trained and saved successfully.")
    else:
        print("ML models already exist. Skipping training.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    ensure_ml_models()
    yield
    # Shutdown (nothing to clean up)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"message": "Welcome to Environmental Intelligence API", "docs": "/docs"}
