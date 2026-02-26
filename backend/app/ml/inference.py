import joblib
import os
import numpy as np

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

class MLInference:
    def __init__(self):
        self.scaler = None
        self.aqi_model = None
        self.rain_model = None
        self.load_models()

    def load_models(self):
        try:
            self.scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.joblib"))
            self.aqi_model = joblib.load(os.path.join(MODEL_DIR, "aqi_model.joblib"))
            self.rain_model = joblib.load(os.path.join(MODEL_DIR, "rain_model.joblib"))
        except FileNotFoundError:
            print("Models not found. Please run train_models.py first.")

    def predict_future(self, past_aqi_1: float, past_aqi_2: float, temp: float, precip: float) -> dict:
        if not self.scaler or not self.aqi_model or not self.rain_model:
            return {"error": "Models not loaded. Train models first."}
        
        features = np.array([[past_aqi_1, past_aqi_2, temp, precip]])
        features_scaled = self.scaler.transform(features)
        
        pred_aqi = self.aqi_model.predict(features_scaled)[0]
        
        # Predict probability for RandomForestClassifier
        pred_rain_prob = self.rain_model.predict_proba(features_scaled)[0][1] * 100
        
        return {
            "predicted_aqi": round(pred_aqi, 2),
            "predicted_rain_prob_percent": round(pred_rain_prob, 2)
        }

ml_service = MLInference()
