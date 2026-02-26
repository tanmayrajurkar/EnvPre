import axios from 'axios';

// Backend API for ML Predictions Only
const backendApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 15000,
});

// --- Air Quality (Direct to Open-Meteo) ---
export const getAqiLatest = async (lat: number, lon: number) => {
    const res = await axios.get("https://air-quality-api.open-meteo.com/v1/air-quality", {
        params: {
            latitude: lat,
            longitude: lon,
            hourly: "pm2_5,pm10,us_aqi,nitrogen_dioxide,sulphur_dioxide,ozone",
            timezone: "auto",
            forecast_days: 1,
        }
    });

    // Process response identically to the old backend format so UI doesn't break
    const data = res.data;
    const hourly = data.hourly || {};
    const times = hourly.time || [];
    const aqi = hourly.us_aqi || [];
    const pm25 = hourly.pm2_5 || [];
    const pm10 = hourly.pm10 || [];

    const hourly_records = times.map((t: string, i: number) => ({
        time: t,
        aqi: aqi[i],
        pm25: pm25[i],
        pm10: pm10[i],
    }));

    const currentAqi = [...hourly_records].reverse().find(r => r.aqi !== null)?.aqi;
    const currentPm25 = [...hourly_records].reverse().find(r => r.pm25 !== null)?.pm25;
    const currentPm10 = [...hourly_records].reverse().find(r => r.pm10 !== null)?.pm10;

    const dominant = (currentPm25 || 0) > (currentPm10 || 0) ? "PM2.5" : "PM10";

    return {
        current_aqi: currentAqi,
        current_pm25: currentPm25,
        current_pm10: currentPm10,
        dominant_pollutant: dominant,
        hourly: hourly_records,
    };
};

export const getAqiForecast = async (lat: number, lon: number) => {
    return backendApi.get('/aqi/forecast', { params: { lat, lon } }).then(r => r.data);
};

// --- Weather / Rainfall (Direct to Open-Meteo) ---
export const getWeatherHistory = async (lat: number, lon: number, start_date: string, end_date: string) => {
    const res = await axios.get("https://archive-api.open-meteo.com/v1/archive", {
        params: {
            latitude: lat,
            longitude: lon,
            start_date,
            end_date,
            daily: "precipitation_sum,temperature_2m_mean",
            timezone: "auto"
        }
    });
    return res.data;
};

export const getWeatherForecast = async (lat: number, lon: number, days = 7) => {
    const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
            latitude: lat,
            longitude: lon,
            daily: "precipitation_probability_max,precipitation_sum",
            timezone: "auto",
            forecast_days: days
        }
    });
    return res.data;
};

// --- Climate (Direct to Open-Meteo) ---
export const getClimateTrends = async (lat: number, lon: number, start_year: number, end_year: number) => {
    const clampedEnd = Math.min(end_year, 2050);
    const clampedStart = Math.max(start_year, 1950);
    const res = await axios.get("https://climate-api.open-meteo.com/v1/climate", {
        params: {
            latitude: lat,
            longitude: lon,
            start_date: `${clampedStart}-01-01`,
            end_date: `${clampedEnd}-12-31`,
            models: "EC_Earth3P_HR",
            daily: "temperature_2m_mean",
        }
    });
    return res.data;
};

// --- ML Predictions (Needs Python Backend) ---
export const getPrediction = (past_aqi_1: number, past_aqi_2: number, temp: number, precip: number) =>
    backendApi.get('/ml/predict', { params: { past_aqi_1, past_aqi_2, temp, precip } }).then(r => r.data);
