import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { getWeatherHistory, getWeatherForecast } from '../api';

// Default: New Delhi, India
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

// Get last 8 months date range
function getLast8MonthsRange() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 8);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { start: fmt(start), end: fmt(end) };
}

// Aggregate daily data into monthly totals
function aggregateMonthly(daily: string[], precipitation: number[]) {
    const monthly: Record<string, number> = {};
    daily.forEach((date, i) => {
        const month = date.slice(0, 7); // YYYY-MM
        monthly[month] = (monthly[month] || 0) + (precipitation[i] || 0);
    });
    return Object.entries(monthly).map(([month, total]) => ({
        month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
        rain: parseFloat(total.toFixed(1)),
    }));
}

const cities = [
    { label: 'New Delhi, India', lat: 28.6139, lon: 77.209 },
    { label: 'Mumbai, India', lat: 19.076, lon: 72.8777 },
    { label: 'London, UK', lat: 51.5074, lon: -0.1278 },
    { label: 'New York, USA', lat: 40.7128, lon: -74.006 },
    { label: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
];

export const RainfallDashboard = () => {
    const [lat, setLat] = useState(DEFAULT_LAT);
    const [lon, setLon] = useState(DEFAULT_LON);
    const [locationLabel, setLocationLabel] = useState('New Delhi, India');
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [forecastData, setForecastData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (fetchLat: number, fetchLon: number) => {
        setLoading(true);
        setError(null);
        try {
            const { start, end } = getLast8MonthsRange();
            const [history, forecast] = await Promise.all([
                getWeatherHistory(fetchLat, fetchLon, start, end),
                getWeatherForecast(fetchLat, fetchLon, 7),
            ]);

            const daily: string[] = history?.daily?.time || [];
            const precip: number[] = history?.daily?.precipitation_sum || [];
            setHistoryData(aggregateMonthly(daily, precip));

            // 7-day forecast
            const fTimes: string[] = forecast?.daily?.time || [];
            const fPrecip: number[] = forecast?.daily?.precipitation_sum || [];
            const fProb: number[] = forecast?.daily?.precipitation_probability_max || [];
            setForecastData(fTimes.map((t, i) => ({
                day: new Date(t).toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' }),
                precip: fPrecip[i] ?? 0,
                prob: fProb[i] ?? 0,
            })));
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch weather data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(lat, lon); }, []);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = cities.find(c => c.label === e.target.value);
        if (city) {
            setLat(city.lat); setLon(city.lon); setLocationLabel(city.label);
            fetchData(city.lat, city.lon);
        }
    };

    const totalRain = historyData.reduce((s, d) => s + d.rain, 0).toFixed(1);
    const maxMonth = historyData.reduce((m, d) => d.rain > (m?.rain ?? 0) ? d : m, historyData[0]);

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 inline-block">
                        Precipitation & Weather
                    </h1>
                    <p className="text-muted mt-2">Historical rainfall patterns and 7-day forecast via Open-Meteo.</p>
                </div>
                <select onChange={handleCityChange} defaultValue={locationLabel}
                    className="bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors">
                    {cities.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                </select>
            </header>

            {error && <div className="glass-panel p-4 border border-red-500/30 text-red-400 rounded-xl">⚠ {error}</div>}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-panel p-5">
                            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">8-Month Total</h3>
                            <div className="text-4xl font-bold text-cyan-400">{totalRain} <span className="text-lg text-muted font-normal">mm</span></div>
                        </div>
                        <div className="glass-panel p-5">
                            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Wettest Month</h3>
                            <div className="text-4xl font-bold text-blue-400">{maxMonth?.month ?? 'N/A'}</div>
                            <p className="text-sm text-muted mt-1">{maxMonth?.rain ?? 0} mm</p>
                        </div>
                        <div className="glass-panel p-5">
                            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">7-Day Rain Chance</h3>
                            <div className="text-4xl font-bold text-indigo-400">
                                {forecastData.length ? Math.max(...forecastData.map(d => d.prob)) : 'N/A'}
                                <span className="text-lg text-muted font-normal">%</span>
                            </div>
                            <p className="text-sm text-muted mt-1">Max probability ahead</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-panel p-6">
                            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2 flex justify-between">
                                <span>Monthly Accumulation</span>
                                <span className="text-cyan-400">{locationLabel}</span>
                            </h3>
                            <div className="h-[300px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={historyData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                                        <YAxis stroke="#94A3B8" />
                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                        <Bar dataKey="rain" name="Rainfall (mm)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-panel p-6">
                            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">7-Day Forecast</h3>
                            <div className="h-[300px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={forecastData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                                        <YAxis yAxisId="left" stroke="#94A3B8" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                        <Legend />
                                        <Bar dataKey="precip" yAxisId="left" name="Precip (mm)" fill="#38BDF8" radius={[3, 3, 0, 0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="prob" name="Rain Prob %" stroke="#818CF8" strokeWidth={2.5} dot={{ fill: '#818CF8' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
