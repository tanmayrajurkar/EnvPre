# Environmental Intelligence Platform (Backend)

This is the FastAPI backend for the Environmental Intelligence Platform. It handles data ingestion from external APIs (OpenAQ, Open-Meteo), manages a Supabase PostgreSQL database via SQLAlchemy, and serves machine learning predictions using scikit-learn models.

## Architecture & Tech Stack

- **Framework**: FastAPI (Python)
- **Database**: Supabase PostgreSQL (via SQLAlchemy)
- **Machine Learning**: scikit-learn (RandomForest Regressor & Classifier)
- **External Data Sources**: OpenAQ, Open-Meteo Climate & Weather APIs

## Setup Instructions

### 1. Prerequisites
- Python 3.10+
- A Supabase project (for the PostgreSQL connection URI)

### 2. Installation
```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the root of the `backend` directory. Use `.env.example` as a template:

```env
DATABASE_URL=postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
API_V1_STR=/api/v1
PROJECT_NAME="Environmental Intelligence Platform"
```

### 4. Running the Application
Before starting the server, you need to train the ML models (synthetically generated for baseline):
```bash
python app/ml/train_models.py
```

Then, start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

## Key Endpoints
- `/api/v1/aqi/latest` - Latest air quality metrics
- `/api/v1/weather/history` - Historical rainfall data
- `/api/v1/ml/predict` - 7-day forecast for AQI and Rainfall probability
