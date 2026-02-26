import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic data for initial model training."""
    np.random.seed(42)
    # Features: past_aqi_1, past_aqi_2, temp, precip
    X = np.random.rand(n_samples, 4) * 100
    
    # Target 1: Next day AQI (Regression)
    y_aqi = X[:, 0] * 0.5 + X[:, 1] * 0.3 + X[:, 2] * 0.1 + np.random.randn(n_samples) * 5
    
    # Target 2: Rain tomorrow (Classification)
    y_rain = (X[:, 3] > 50).astype(int)
    
    return X, y_aqi, y_rain

def train_and_save_models():
    print("Generating synthetic data for initial training...")
    X, y_aqi, y_rain = generate_synthetic_data()

    print("Scaling Features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("Training AQI Regressor...")
    aqi_model = RandomForestRegressor(n_estimators=100, random_state=42)
    aqi_model.fit(X_scaled, y_aqi)

    print("Training Rain Classifier...")
    rain_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rain_model.fit(X_scaled, y_rain)

    print("Saving pipeline artifacts...")
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.joblib"))
    joblib.dump(aqi_model, os.path.join(MODEL_DIR, "aqi_model.joblib"))
    joblib.dump(rain_model, os.path.join(MODEL_DIR, "rain_model.joblib"))
    print("Models saved successfully.")

if __name__ == "__main__":
    train_and_save_models()
