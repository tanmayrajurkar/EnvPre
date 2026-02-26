import { getAqiLatest, getWeatherHistory, getClimateTrends } from './api.js';

async function test() {
    try {
        console.log("Testing AQI...");
        const aqi = await getAqiLatest(28.6139, 77.209);
        console.log("AQI OK", aqi.current_aqi);

        console.log("Testing Weather...");
        const weather = await getWeatherHistory(28.6139, 77.209, "2024-01-01", "2024-01-10");
        console.log("Weather OK", !!weather.daily);

        console.log("Testing Climate...");
        const climate = await getClimateTrends(28.6139, 77.209, 2000, 2020);
        console.log("Climate OK", !!climate.daily);

    } catch (e) {
        console.error("ERROR:", e.message, e.response?.data);
    }
}

test();
