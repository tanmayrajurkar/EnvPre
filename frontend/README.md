# Environmental Intelligence Platform with predictions (Frontend)

The frontend for the Environmental Intelligence Platform. Built using React, Vite, and TailwindCSS. It provides a highly aesthetic, responsive dashboard to monitor air quality, historical rainfall, macro climate trends, and predictive ML analytics.

## Architecture & Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS (with custom Glassmorphism/Dark theme constraints)
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
# From the frontend directory
npm install
```

### 3. Running the Application
```bash
npm run dev
```

The application will start, typically on [http://localhost:5173](http://localhost:5173).

## Dashboard Modules
1. **Air Quality Intelligence**: Real-time monitoring of AQI, PM2.5, and core pollutants.
2. **Precipitation & Weather**: Historical rainfall patterns and anomaly detection.
3. **Macro Climate Trends**: Global temperature anomalies and CO2 trajectory visualization.
4. **Predictive Analytics Engine**: Interface to the backend RandomForest ML models providing 7-day environmental forecasting.
