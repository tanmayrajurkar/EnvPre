import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAqiLatest } from '../api';

// Default: New Delhi, India — a city with notable air quality data
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

function getAqiCategory(aqi: number | null) {
    if (aqi === null || aqi === undefined) return { label: 'N/A', color: 'text-gray-400' };
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400' };
    return { label: 'Hazardous', color: 'text-rose-600' };
}

export const PollutionDashboard = () => {
    const [lat, setLat] = useState(DEFAULT_LAT);
    const [lon, setLon] = useState(DEFAULT_LON);
    const [locationLabel, setLocationLabel] = useState('New Delhi, India');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (fetchLat: number, fetchLon: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAqiLatest(fetchLat, fetchLon);
            setData(result);
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch air quality data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(lat, lon);
    }, []);

    // Predefined cities
    const cities = [
        { label: 'New Delhi, India', lat: 28.6139, lon: 77.209 },
        { label: 'Beijing, China', lat: 39.9042, lon: 116.4074 },
        { label: 'Los Angeles, USA', lat: 34.0522, lon: -118.2437 },
        { label: 'London, UK', lat: 51.5074, lon: -0.1278 },
        { label: 'Mumbai, India', lat: 19.076, lon: 72.8777 },
    ];

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = cities.find(c => c.label === e.target.value);
        if (city) {
            setLat(city.lat);
            setLon(city.lon);
            setLocationLabel(city.label);
            fetchData(city.lat, city.lon);
        }
    };

    const currentAqi = data?.current_aqi;
    const currentPm25 = data?.current_pm25;
    const currentPm10 = data?.current_pm10;
    const dominant = data?.dominant_pollutant || 'N/A';
    const aqiCategory = getAqiCategory(currentAqi);

    // Hourly chart data (show last 24 readings)
    const chartData = (data?.hourly || []).slice(-24).map((h: any) => ({
        time: h.time?.slice(11, 16) || '', // HH:MM
        aqi: h.aqi,
        pm25: h.pm25,
    }));

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">
                        Air Quality Intelligence
                    </h1>
                    <p className="text-muted mt-2">Real-time monitoring of atmospheric pollutants via Open-Meteo.</p>
                </div>
                <select
                    onChange={handleCityChange}
                    defaultValue={locationLabel}
                    className="bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors"
                >
                    {cities.map(c => (
                        <option key={c.label} value={c.label}>{c.label}</option>
                    ))}
                </select>
            </header>

            {error && (
                <div className="glass-panel p-4 border border-red-500/30 text-red-400 rounded-xl">
                    ⚠ {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 flex flex-col justify-center">
                            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Current AQI (US)</h3>
                            <div className={`text-5xl font-bold ${aqiCategory.color}`}>{currentAqi ?? 'N/A'}</div>
                            <p className={`text-sm mt-2 ${aqiCategory.color}/80`}>{aqiCategory.label}</p>
                        </div>
                        <div className="glass-panel p-6 flex flex-col justify-center">
                            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">PM 2.5 Level</h3>
                            <div className="text-5xl font-bold text-orange-400">
                                {currentPm25 != null ? currentPm25.toFixed(1) : 'N/A'}{' '}
                                <span className="text-xl text-muted font-normal">µg/m³</span>
                            </div>
                            <p className="text-sm text-muted mt-2">Fine particulate matter</p>
                        </div>
                        <div className="glass-panel p-6 flex flex-col justify-center">
                            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Dominant Pollutant</h3>
                            <div className="text-5xl font-bold text-yellow-400">{dominant}</div>
                            <p className="text-sm text-muted mt-2">
                                PM10: {currentPm10 != null ? currentPm10.toFixed(1) : 'N/A'} µg/m³
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 h-[400px]">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            24-Hour AQI & PM2.5 Trend — {locationLabel}
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        </h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} interval={3} />
                                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="aqi" name="AQI (US)" stroke="#3B82F6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} connectNulls />
                                <Line type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#8B5CF6" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} connectNulls />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};
