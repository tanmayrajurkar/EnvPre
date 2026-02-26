
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { time: '00:00', aqi: 45, pm25: 12 },
    { time: '04:00', aqi: 52, pm25: 18 },
    { time: '08:00', aqi: 85, pm25: 35 },
    { time: '12:00', aqi: 120, pm25: 55 },
    { time: '16:00', aqi: 95, pm25: 42 },
    { time: '20:00', aqi: 65, pm25: 22 },
];

export const PollutionDashboard = () => {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">Air Quality Intelligence</h1>
                <p className="text-muted mt-2">Real-time monitoring and historical trends of atmospheric pollutants.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Current AQI</h3>
                    <div className="text-5xl font-bold text-red-400">120</div>
                    <p className="text-sm text-red-400/80 mt-2">Unhealthy for sensitive groups</p>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">PM 2.5 Level</h3>
                    <div className="text-5xl font-bold text-orange-400">55 <span className="text-xl text-muted font-normal">µg/m³</span></div>
                    <p className="text-sm text-muted mt-2">Above WHO guidelines</p>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Dominant Pollutant</h3>
                    <div className="text-5xl font-bold text-yellow-400">O³</div>
                    <p className="text-sm text-yellow-400/80 mt-2">Ground-level Ozone</p>
                </div>
            </div>

            <div className="glass-panel p-6 h-[400px]">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    24-Hour AQI Trend
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                        <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="aqi" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="pm25" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
