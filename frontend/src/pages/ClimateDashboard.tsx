
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { year: '1980', tempAnomaly: 0.1, co2: 338 },
    { year: '1990', tempAnomaly: 0.3, co2: 354 },
    { year: '2000', tempAnomaly: 0.4, co2: 369 },
    { year: '2010', tempAnomaly: 0.7, co2: 389 },
    { year: '2020', tempAnomaly: 1.0, co2: 414 },
    { year: '2026', tempAnomaly: 1.3, co2: 425 },
];

export const ClimateDashboard = () => {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 inline-block">Macro Climate Trends</h1>
                <p className="text-muted mt-2">Global temperature anomalies and carbon dioxide concentration trajectories.</p>
            </header>

            <div className="glass-panel p-6 h-[400px]">
                <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
                    <span>Global Temperature Anomaly (°C)</span>
                    <span className="text-sm font-normal text-red-400 bg-red-400/10 px-3 py-1 rounded-full">+1.3°C vs Pre-industrial</span>
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dummyData}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Area type="monotone" dataKey="tempAnomaly" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
