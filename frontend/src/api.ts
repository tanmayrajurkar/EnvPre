import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 15000,
});

// --- Air Quality ---
export const getAqiLatest = (lat: number, lon: number) =>
    api.get('/aqi/latest', { params: { lat, lon } }).then(r => r.data);

export const getAqiForecast = (lat: number, lon: number) =>
    api.get('/aqi/forecast', { params: { lat, lon } }).then(r => r.data);

// --- Weather / Rainfall ---
export const getWeatherHistory = (lat: number, lon: number, start_date: string, end_date: string) =>
    api.get('/weather/history', { params: { lat, lon, start_date, end_date } }).then(r => r.data);

export const getWeatherForecast = (lat: number, lon: number, days = 7) =>
    api.get('/weather/forecast', { params: { lat, lon, days } }).then(r => r.data);

// --- Climate ---
export const getClimateTrends = (lat: number, lon: number, start_year: number, end_year: number) =>
    api.get('/climate/trends', { params: { lat, lon, start_year, end_year } }).then(r => r.data);

// --- ML Predictions ---
export const getPrediction = (past_aqi_1: number, past_aqi_2: number, temp: number, precip: number) =>
    api.get('/ml/predict', { params: { past_aqi_1, past_aqi_2, temp, precip } }).then(r => r.data);
