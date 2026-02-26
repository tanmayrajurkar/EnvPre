import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getClimateTrends } from '../api';

// Default: New Delhi
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

// Aggregate daily temps into yearly averages for charting
function aggregateYearly(times: string[], temps: number[]) {
    const yearly: Record<string, number[]> = {};
    times.forEach((t, i) => {
        const year = t.slice(0, 4);
        if (!yearly[year]) yearly[year] = [];
        if (temps[i] !== null && temps[i] !== undefined) yearly[year].push(temps[i]);
    });
    return Object.entries(yearly).map(([year, vals]) => ({
        year,
        avg_temp: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2)),
    }));
}

const cities = [
    { label: 'New Delhi, India', lat: 28.6139, lon: 77.209 },
    { label: 'London, UK', lat: 51.5074, lon: -0.1278 },
    { label: 'New York, USA', lat: 40.7128, lon: -74.006 },
    { label: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
    { label: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
];

export const ClimateDashboard = () => {
    const [lat, setLat] = useState(DEFAULT_LAT);
    const [lon, setLon] = useState(DEFAULT_LON);
    const [locationLabel, setLocationLabel] = useState('New Delhi, India');
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startYear, setStartYear] = useState(1990);
    const [endYear] = useState(2024);

    const fetchData = async (fetchLat: number, fetchLon: number, sy: number, ey: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClimateTrends(fetchLat, fetchLon, sy, ey);
            // Open-Meteo climate API returns multiple model results — use first available model
            const daily = data?.daily || {};
            // Temperature keys vary, pick the first temperature_2m_mean key
            const tempKey = Object.keys(daily).find(k => k.includes('temperature_2m_mean'));
            const times: string[] = daily.time || [];
            const temps: number[] = tempKey ? daily[tempKey] : [];
            setChartData(aggregateYearly(times, temps));
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch climate data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(lat, lon, startYear, endYear); }, []);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = cities.find(c => c.label === e.target.value);
        if (city) {
            setLat(city.lat); setLon(city.lon); setLocationLabel(city.label);
            fetchData(city.lat, city.lon, startYear, endYear);
        }
    };

    const latestTemp = chartData[chartData.length - 1]?.avg_temp;
    const earliestTemp = chartData[0]?.avg_temp;
    const anomaly = latestTemp != null && earliestTemp != null
        ? (latestTemp - earliestTemp).toFixed(2)
        : null;

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 inline-block">
                        Macro Climate Trends
                    </h1>
                    <p className="text-muted mt-2">Regional mean temperature trajectories from Open-Meteo Climate API.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <select onChange={handleCityChange} defaultValue={locationLabel}
                        className="bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors">
                        {cities.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                    <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}
                        className="bg-card/50 border border-white/10 rounded-lg px-3 py-2 text-text focus:outline-none">
                        {[1980, 1990, 1995, 2000, 2005, 2010].map(y => <option key={y}>{y}</option>)}
                    </select>
                    <button onClick={() => fetchData(lat, lon, startYear, endYear)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium text-sm">
                        Refresh
                    </button>
                </div>
            </header>

            {error && <div className="glass-panel p-4 border border-red-500/30 text-red-400 rounded-xl">⚠ {error}</div>}

            {!error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="glass-panel p-5">
                        <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Latest Avg Year Temp</h3>
                        <div className="text-4xl font-bold text-orange-400">
                            {latestTemp != null ? `${latestTemp}°C` : 'N/A'}
                        </div>
                        <p className="text-sm text-muted mt-1">{chartData[chartData.length - 1]?.year}</p>
                    </div>
                    <div className="glass-panel p-5">
                        <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Temperature Change</h3>
                        <div className={`text-4xl font-bold ${anomaly && Number(anomaly) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {anomaly != null ? `${Number(anomaly) > 0 ? '+' : ''}${anomaly}°C` : 'N/A'}
                        </div>
                        <p className="text-sm text-muted mt-1">Since {chartData[0]?.year}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="glass-panel p-6 h-[400px]">
                    <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
                        <span>Annual Mean Temperature (°C) — {locationLabel}</span>
                        {anomaly && (
                            <span className={`text-sm font-normal px-3 py-1 rounded-full ${Number(anomaly) > 0 ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                                {Number(anomaly) > 0 ? '+' : ''}{anomaly}°C over period
                            </span>
                        )}
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="year" stroke="#94A3B8" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 8)} />
                            <YAxis stroke="#94A3B8" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                            <Legend />
                            <Area type="monotone" dataKey="avg_temp" name="Avg Temp (°C)" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
